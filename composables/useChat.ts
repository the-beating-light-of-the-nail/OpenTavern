import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { useRemoteAPI } from '~/composables/useRemoteAPI';
import { useWorldInfo } from '~/composables/useWorldInfo';
import { useSummarization } from '~/composables/useSummarization';
import { BASE_SYSTEM_PROMPT } from '~/utils/prompts';
import { DEFAULT_TWO_STAGE_PROMPT } from '~/utils/defaults';
import { replacePlaceholders, makeId } from '~/utils/chat-helpers';

export interface ApiMessage { role: 'system' | 'user' | 'assistant'; content: string }

/**
 * 核心聊天逻辑：发送/停止/重新生成、消息列表管理、流式渲染。
 * 集成 World Info 激活/注入 + 两阶段生成 + 自动总结。
 */
export function useChat() {
  const store = useAppStore();
  const ui = useUiStore();
  const { streamChat } = useRemoteAPI();
  const { activate: activateWI, injectIntoSystem: injectWI } = useWorldInfo();
  const { autoSummarizeIfNeeded } = useSummarization();

  const conv = computed(() => store.activeConversation);
  const isGenerating = computed(() => store.isGenerating);

  function getCharName(): string {
    const c = conv.value?.character as any;
    return c?.name || 'Assistant';
  }

  function getChar(): any {
    return conv.value?.character || null;
  }

  /**
   * 构建系统提示（含 World Info 激活/注入，忠实原版 buildSystemPrompt）。
   */
  function buildSystemPrompt(): string {
    if (!conv.value) return '';
    const char = getChar() as any;
    const charName = char?.name || 'Assistant';
    const userName = store.settings.userName || 'User';
    let parts: string[] = [];

    let sysPrompt = store.settings.systemPrompt;
    if (!sysPrompt && char?.system_prompt) sysPrompt = char.system_prompt;
    if (sysPrompt) parts.push(replacePlaceholders(sysPrompt, charName, userName));
    else parts.push(BASE_SYSTEM_PROMPT); // 无自定义时注入基础引擎提示

    const userDesc = (store.settings.userDescription || '').trim();
    if (userDesc) parts.push("User's Persona: " + replacePlaceholders(userDesc, charName, userName));

    const postHistory = (store.settings.postHistoryInstructions || '').trim() || (char?.post_history_instructions || '');
    if (postHistory) parts.push(replacePlaceholders(postHistory, charName, userName));

    if (char) {
      const info: string[] = [];
      if (char.personality) info.push('Personality: ' + replacePlaceholders(char.personality, charName, userName));
      if (char.scenario) info.push('Scenario: ' + replacePlaceholders(char.scenario, charName, userName));
      if (char.description) info.push(replacePlaceholders(char.description, charName, userName));
      if (info.length) parts.push(info.join('\n\n'));
    }

    // World Info 激活 + 注入
    const wiResult = activateWI(conv.value);
    parts = injectWI(parts, wiResult.byPosition, charName, userName);

    if (char?.mes_example) parts.push('Example dialogues:\n' + replacePlaceholders(char.mes_example, charName, userName));
    return parts.join('\n\n').trim();
  }

  /** 构建发给 API 的消息数组（含上下文裁剪 + 占位符替换） */
  function buildMessagesForAPI(): ApiMessage[] {
    if (!conv.value) return [];
    const charName = getCharName();
    const userName = store.settings.userName || 'User';
    const maxMsgs = store.settings.contextLength || 20;

    const apiMessages: ApiMessage[] = [];
    const sysContent = buildSystemPrompt();
    if (sysContent) apiMessages.push({ role: 'system', content: sysContent });

    // 注入摘要（如有）
    const summaries = (conv.value as any).summaries as any[] | undefined;
    if (summaries && summaries.length > 0) {
      const summaryText = summaries.map((s) => s.text).join('\n---\n');
      apiMessages.push({ role: 'system', content: '[以下是先前对话的自动摘要，供上下文参考]\n' + summaryText });
    }

    // 上下文裁剪：取最近 N 条非空消息
    let regularMsgs = ((conv.value as any).messages || []).filter((m: any) =>
      m.role !== 'system' && String(m.content || '').trim(),
    );

    // 基于最后一个 summary 的 coveredEnd 向前裁剪
    let lastCovered = -1;
    if (summaries) {
      for (const s of summaries) {
        if (typeof s.coveredEnd === 'number' && s.coveredEnd > lastCovered) lastCovered = s.coveredEnd;
      }
    }
    if (lastCovered >= 0 && lastCovered < regularMsgs.length - 1) {
      regularMsgs = regularMsgs.slice(lastCovered + 1);
    }
    if (regularMsgs.length > maxMsgs) {
      regularMsgs = regularMsgs.slice(regularMsgs.length - maxMsgs);
    }

    // 深拷贝防污染
    for (const m of regularMsgs) {
      apiMessages.push({ role: m.role, content: m.content });
    }

    // 最终占位符替换
    return apiMessages.map((m) => ({ role: m.role, content: replacePlaceholders(m.content, charName, userName) }));
  }

  /** 发送消息 */
  async function sendMessage(text: string): Promise<void> {
    if (store.isGenerating) return;
    text = text.trim();
    if (!text) return;
    if (!conv.value) return;

    // 推入用户消息
    (conv.value as any).messages.push({ role: 'user', content: text });
    (conv.value as any).updated = Date.now();

    // 首条消息自动改标题
    const titleNew = 'New Chat';
    if ((conv.value as any).title === titleNew || !(conv.value as any).title) {
      (conv.value as any).title = text.slice(0, 50) + (text.length > 50 ? '...' : '');
    }

    store.persist();
    store.streamingContent = '';
    store.streamingCot = '';

    await doGenerate();
  }

  /** 核心生成流程 */
  async function doGenerate(): Promise<void> {
    if (!conv.value) return;

    const controller = new AbortController();
    store.abortController = controller;
    store.isGenerating = true;

    let messages: ApiMessage[];
    try {
      messages = buildMessagesForAPI();
    } catch (e: any) {
      store.isGenerating = false;
      await ui.showDialog({ message: '构建提示词时出错：' + (e.message || e), showCancel: false });
      return;
    }

    await streamChat(
      messages,
      store.settings,
      controller,
      {
        onToken: (_token, fullContent, fullCot) => {
          store.streamingContent = fullContent;
          store.streamingCot = fullCot;
        },
        onComplete: async (content, cot) => {
          store.streamingContent = '';
          store.streamingCot = '';
          store.isGenerating = false;
          store.abortController = null;

          if (content && content.trim()) {
            const msg: any = { role: 'assistant', content, id: makeId(), stage: 'main' };
            if (cot) msg.cot = cot;
            (conv.value as any).messages.push(msg);
            (conv.value as any).updated = Date.now();
            store.persist();

            // 两阶段生成（第二阶段：选项/小提示）
            if (store.settings.twoStageEnabled) {
              await runSecondStage(msg);
            }

            // 自动总结检查
            if (store.settings.summaryEnabled && store.settings.autoSummarizeOnReply) {
              autoSummarizeIfNeeded().catch(() => {});
            }
          }
        },
        onError: (err) => {
          store.streamingContent = '';
          store.streamingCot = '';
          store.isGenerating = false;
          store.abortController = null;
          ui.showDialog({ message: err.message || String(err), showCancel: false, danger: true });
        },
      },
    );
  }

  /** 第二阶段生成（独立调用，生成选项/小提示 XML） */
  async function runSecondStage(firstStageMsg: any): Promise<void> {
    if (!conv.value) return;
    const charName = getCharName();
    const userName = store.settings.userName || 'User';

    const secondSysPrompt = store.settings.twoStageSystemPrompt || DEFAULT_TWO_STAGE_PROMPT;
    const messages: ApiMessage[] = [
      { role: 'system', content: replacePlaceholders(secondSysPrompt, charName, userName) },
      { role: 'user', content: replacePlaceholders(firstStageMsg.content || '', charName, userName) },
    ];

    const controller = new AbortController();
    store.abortController = controller;
    store.isGenerating = true;

    await streamChat(
      messages,
      store.settings,
      controller,
      {
        onToken: (_t, full) => { store.streamingContent = full; },
        onComplete: (content) => {
          store.streamingContent = '';
          store.isGenerating = false;
          store.abortController = null;
          if (content && content.trim()) {
            (conv.value as any).messages.push({
              role: 'assistant', content, id: makeId(), stage: 'second', parentId: firstStageMsg.id,
            });
            store.persist();
          }
        },
        onError: (err) => {
          store.streamingContent = '';
          store.isGenerating = false;
          store.abortController = null;
          console.warn('[two-stage] error:', err.message);
        },
      },
      {
        temperature: store.settings.twoStageTemperature,
        topP: store.settings.twoStageTopP,
        requestCot: false,
      },
    );
  }

  /** 停止生成 */
  function stopGeneration(): void {
    if (store.abortController) {
      store.abortController.abort();
      store.abortController = null;
    }
    store.isGenerating = false;
    // 保留已生成内容
    const partial = store.streamingContent.trim();
    store.streamingContent = '';
    store.streamingCot = '';
    if (partial && conv.value) {
      (conv.value as any).messages.push({ role: 'assistant', content: partial + '\n\n[已停止]', id: makeId() });
      store.persist();
    }
  }

  /** 重新生成最后一条助手消息 */
  async function regenerate(): Promise<void> {
    if (store.isGenerating || !conv.value) return;
    const msgs = (conv.value as any).messages;
    // 找到最后一条 assistant 消息
    let lastAssistantIdx = -1;
    for (let i = msgs.length - 1; i >= 0; i--) {
      if (msgs[i].role === 'assistant') { lastAssistantIdx = i; break; }
    }
    if (lastAssistantIdx < 0) return;
    msgs.splice(lastAssistantIdx, 1); // 移除最后一条助手消息
    store.persist();
    await doGenerate();
  }

  /** 删除指定消息 */
  function deleteMessage(idx: number): void {
    if (!conv.value) return;
    const msgs = (conv.value as any).messages;
    if (idx >= 0 && idx < msgs.length) {
      msgs.splice(idx, 1);
      store.persist();
    }
  }

  return {
    conv,
    isGenerating,
    streamingContent: computed(() => store.streamingContent),
    streamingCot: computed(() => store.streamingCot),
    sendMessage,
    stopGeneration,
    regenerate,
    deleteMessage,
    buildMessagesForAPI,
  };
}
