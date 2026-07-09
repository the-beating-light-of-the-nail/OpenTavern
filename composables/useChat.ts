import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { useRemoteAPI } from '~/composables/useRemoteAPI';
import { useWebLLM } from '~/composables/useWebLLM';
import { useWorldInfo } from '~/composables/useWorldInfo';
import { useSummarization } from '~/composables/useSummarization';
import { useGroupMention } from '~/composables/useGroupMention';
import { BASE_SYSTEM_PROMPT } from '~/utils/prompts';
import { DEFAULT_TWO_STAGE_PROMPT } from '~/utils/defaults';
import { replacePlaceholders, makeId } from '~/utils/chat-helpers';
import {
  isGroupChat,
  getGroupMembers,
  getNextGroupSpeaker,
  getCurrentSpeakerCharacter,
  parseGroupMention,
  getEffectivePostHistoryInstructions,
} from '~/utils/group-helpers';

export interface ApiMessage { role: 'system' | 'user' | 'assistant'; content: string }

/** 群组多角色严格指令（按语言，1:1 原版 buildGroupSystemPrompt 内嵌文案） */
function groupInstructionFor(lang: string): string {
  if (lang === 'zh-TW') {
    return '你正在進行一個多角色群組對話。以下是本群組中所有角色的**完整、未經刪減**的角色資料。你必須嚴格按照每個角色提供的完整資料進行扮演，絕對不能混淆任何角色的性格、背景、說話方式或知識。\n\n**嚴格規則：**\n- 每個角色都有自己獨立且完整的設定，請嚴格遵守。\n- 當用戶訊息中包含 @角色名（例如 @普拉娜）時，被提及的角色應該是本輪的主要回應者。\n- 沒有 @ 時，你可以根據上下文自然決定由誰發言，但仍必須嚴格保持每個角色的獨立性。\n- 絕對不要將不同角色的特質混在一起。';
  }
  if (lang === 'en') {
    return 'You are roleplaying in a multi-character group chat. Below are the **complete, unedited** profiles of all characters currently in this group. You MUST strictly role-play each character according to their full provided information. Do not mix personalities, backgrounds, speech patterns, or knowledge between characters under any circumstances.\n\n**Strict Rules:**\n- Each character has their own independent and complete setting — adhere to them rigorously.\n- When the user\'s message contains @CharacterName (e.g. @普拉娜), the mentioned character should be the primary responder this turn.\n- If there is no @, you may naturally decide who speaks based on context, but you must still maintain each character\'s distinct identity.\n- Never blend traits from different characters.';
  }
  return '你正在进行一个多角色群组对话。以下是本群组中所有角色的**完整、未经删减**的角色资料。你必须严格按照每个角色提供的完整资料进行扮演，绝对不能混淆任何角色的性格、背景、说话方式或知识。\n\n**严格规则：**\n- 每个角色都有自己独立且完整的设定，请严格遵守。\n- 当用户消息中包含 @角色名（例如 @普拉娜）时，被提及的角色应该是本轮的主要回应者。\n- 没有 @ 时，你可以根据上下文自然决定由谁发言，但仍必须严格保持每个角色的独立性。\n- 绝对不要将不同角色的特质混在一起。';
}

/**
 * 核心聊天逻辑：发送/停止/重新生成、消息列表管理、流式渲染。
 * 集成 World Info 激活/注入 + 两阶段生成 + 自动总结 + WebLLM 本地后端分派 + 群聊 @ 路由。
 */
export function useChat() {
  const store = useAppStore();
  const ui = useUiStore();
  const { streamChat: remoteStreamChat } = useRemoteAPI();
  const webllm = useWebLLM();
  const { activate: activateWI, injectIntoSystem: injectWI } = useWorldInfo();
  const { autoSummarizeIfNeeded } = useSummarization();
  const groupMention = useGroupMention();

  /** 按 inferenceBackend 选择推理后端（remote-api / webllm），两者签名与回调契约一致 */
  function pickStreamChat() {
    return store.settings.inferenceBackend === 'webllm' ? webllm.streamChat : remoteStreamChat;
  }

  const conv = computed(() => store.activeConversation);
  const isGenerating = computed(() => store.isGenerating);

  function getCharName(): string {
    const c = conv.value as any;
    // 群聊：取本轮发言者名
    if (isGroupChat(c)) {
      const sp = getCurrentSpeakerCharacter(c);
      return sp?.name || c?.group?.members?.[0]?.character?.name || 'Assistant';
    }
    const ch = c?.character as any;
    return ch?.name || 'Assistant';
  }

  function getChar(): any {
    const c = conv.value as any;
    if (isGroupChat(c)) return getCurrentSpeakerCharacter(c);
    return c?.character || null;
  }

  /**
   * 构建群组系统提示（1:1 原版 buildGroupSystemPrompt，byte 380807）。
   * 注入：自定义提示词、用户画像、多角色严格指令、场景覆盖、所有成员完整卡、
   * 当前 @ 强制发言者强化块、World Info。
   */
  function buildGroupSystemPrompt(): string {
    const c = conv.value as any;
    const members = getGroupMembers(c);
    const forcedSpeaker = getCurrentSpeakerCharacter(c);
    const userName = store.settings.userName || 'User';
    const lang = store.settings.lang || 'zh-CN';
    const charName = forcedSpeaker?.name || 'Assistant';
    const parts: string[] = [];

    const customSys = (store.settings.systemPrompt || '').trim();
    if (customSys) parts.push(replacePlaceholders(customSys, 'Assistant', userName));

    const userDesc = (store.settings.userDescription || '').trim();
    if (userDesc) parts.push("User's Persona: " + replacePlaceholders(userDesc, 'Assistant', userName));

    parts.push(groupInstructionFor(lang));

    if (c.group?.scenarioOverride && String(c.group.scenarioOverride).trim()) {
      parts.push(replacePlaceholders(String(c.group.scenarioOverride), charName, userName));
    }

    if (members.length > 0) {
      parts.push('\n=== 群组角色完整资料（以下所有角色信息必须严格遵守） ===\n');
      members.forEach((m: any, idx: number) => {
        const ch = m.character;
        const cn = ch?.name || `角色${idx + 1}`;
        let block = `=== ${cn} ===\n`;
        if (ch?.system_prompt) block += `System Prompt: ${replacePlaceholders(ch.system_prompt, cn, userName)}\n\n`;
        const ph = getEffectivePostHistoryInstructions(ch, store.settings);
        if (ph) block += `Post-History Instructions: ${replacePlaceholders(ph, cn, userName)}\n\n`;
        if (ch?.personality) block += `Personality: ${replacePlaceholders(ch.personality, cn, userName)}\n\n`;
        if (ch?.scenario) block += `Scenario: ${replacePlaceholders(ch.scenario, cn, userName)}\n\n`;
        if (ch?.description) block += `Description: ${replacePlaceholders(ch.description, cn, userName)}\n\n`;
        if (ch?.mes_example) block += `Example Dialogues:\n${replacePlaceholders(ch.mes_example, cn, userName)}\n\n`;
        if (ch?.creator_notes) block += `Creator Notes: ${ch.creator_notes}\n\n`;
        parts.push(block.trim());
      });
    }

    if (forcedSpeaker) {
      const fsName = forcedSpeaker.name;
      parts.push(`\n【本轮用户特别指定】用户在本条消息中明确 @ 了 ${fsName}。**本轮回复必须以 ${fsName} 为主角/主要发言者**：场景描述、动作、对话和内心活动应主要围绕 ${fsName} 展开，或让 ${fsName} 首先/主要回应用户。其他角色可以作为配角出现、评论或互动，但不能抢夺本轮的主要叙述焦点和第一人称/第三人称主视角。严格遵守本轮由 ${fsName} 驱动回复。`);
    }

    // World Info 激活 + 注入（复用单角色路径的 activateWI/injectWI）
    const wiResult = activateWI(c);
    return injectWI(parts, wiResult.byPosition, charName, userName).join('\n\n').trim();
  }

  /**
   * 构建系统提示（含 World Info 激活/注入，忠实原版 buildSystemPrompt）。
   * 群聊分支到 buildGroupSystemPrompt。
   */
  function buildSystemPrompt(): string {
    if (!conv.value) return '';
    if (isGroupChat(conv.value)) return buildGroupSystemPrompt();
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

    // 群聊 @ 路由（原版 sendMessage byte 739900）：
    // pill 指定 > 文本 @Name 解析 > 按 order 轮询；决定本轮发言者 conv._nextGroupSpeaker。
    if (isGroupChat(conv.value)) {
      const mentioned = groupMention.consume() || parseGroupMention(text, conv.value);
      (conv.value as any)._nextGroupSpeaker = mentioned || getNextGroupSpeaker(conv.value);
    }
    // 保险清除（防止异常残留）
    groupMention.clear();

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

    await pickStreamChat()(
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
            // 群聊：记录本轮发言者（原版 finishAssistantMessage speaker 逻辑）
            if (isGroupChat(conv.value)) {
              const sp = (conv.value as any)._nextGroupSpeaker;
              if (sp?.name) msg.speaker = sp.name;
            }
            (conv.value as any).messages.push(msg);
            (conv.value as any).updated = Date.now();
            store.persist();

            // 群聊：为下一轮预装发言者（原版 completeGenerationTurn byte 536756）
            if (isGroupChat(conv.value)) {
              (conv.value as any)._nextGroupSpeaker = getNextGroupSpeaker(conv.value);
            }

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

    await pickStreamChat()(
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
    // WebLLM 协作式中断（远程路径下为 no-op）
    try { webllm.abort(); } catch { /* noop */ }
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
