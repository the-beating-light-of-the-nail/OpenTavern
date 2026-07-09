import { ref } from 'vue';
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { isGroupChat, getGroupMembers } from '~/utils/group-helpers';

/**
 * ComfyUI 本地图像生成（逐字移植自原版 index.html byte 515838-526419）。
 * 导入 API workflow → txt2img → 作为空正文 + attachments 的 assistant 消息插入。
 * checkpoint/sampler/steps 等不由此设置，全部沿用导入的 workflow JSON。
 */

/** 规范化 ComfyUI 地址（原版 normalizeComfyServer，byte 515838） */
function normalizeComfyServer(url: string): string {
  return String(url || '').trim() || 'http://127.0.0.1:8188';
}

/** 生成 client_id（原版 makeComfyClientId，byte 515982） */
function makeComfyClientId(): string {
  return 'opentavern-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
}

/** 仅当节点已存在该 input 时写入（原版 setComfyNodeInput，byte 516413） */
function setComfyNodeInput(workflow: any, nodeId: string, inputName: string, value: any): boolean {
  if (!nodeId) return false;
  const node = workflow[String(nodeId)];
  if (!node || !node.inputs || !(inputName in node.inputs)) return false;
  node.inputs[inputName] = value;
  return true;
}

/** 错误格式化：网络错误附加 CORS 提示（原版 formatComfyError，byte 526419） */
function formatComfyError(e: any, tFetchHint: string): string {
  const msg = (e && e.message) || String(e || '');
  if (/failed to fetch|networkerror|load failed/i.test(msg)) {
    return tFetchHint + '\n\n' + msg;
  }
  return msg;
}

export function useComfy() {
  const store = useAppStore();
  const ui = useUiStore();
  const { t } = useI18n();
  const isGenerating = ref(false);

  /** 深拷贝 workflow（原版 cloneComfyWorkflow，byte 516120） */
  function cloneWorkflow(): any {
    const wf = store.settings.comfyWorkflow;
    if (!wf || typeof wf !== 'object') throw new Error(t('comfy_error_no_workflow'));
    return JSON.parse(JSON.stringify(wf));
  }

  /** 构造正向提示词（模板替换，原版 buildComfyPromptText，byte 516690） */
  function buildPromptText(conv: any, inputText: string): string {
    let latestAssistant = '';
    if (conv && Array.isArray(conv.messages)) {
      for (let i = conv.messages.length - 1; i >= 0; i--) {
        if (conv.messages[i]?.role === 'assistant' && conv.messages[i].content) {
          latestAssistant = conv.messages[i].content;
          break;
        }
      }
    }
    const scene = inputText || latestAssistant || conv?.title || '';
    let character = '';
    if (conv) {
      if (isGroupChat(conv)) {
        character = getGroupMembers(conv).map((m: any) => m?.character?.name || '').filter(Boolean).join(', ');
      } else if (conv.character?.name) {
        character = conv.character.name;
      }
    }
    let text = store.settings.comfyPromptTemplate || '{{scene}}';
    text = text
      .replace(/\{\{scene\}\}/gi, scene)
      .replace(/\{\{last_assistant\}\}/gi, latestAssistant)
      .replace(/\{\{input\}\}/gi, inputText)
      .replace(/\{\{char\}\}/gi, character)
      .replace(/\{\{user\}\}/gi, store.settings.userName || 'User');
    return text.trim() || scene || character || 'roleplay scene';
  }

  /** 把正/负向提示词与随机 seed 写入 workflow（原版 applyComfyPromptToWorkflow，byte 517000） */
  function applyPromptToWorkflow(workflow: any, promptText: string): void {
    const posId = String(store.settings.comfyPositiveNodeId || '').trim();
    const negId = String(store.settings.comfyNegativeNodeId || '').trim();
    const seedId = String(store.settings.comfySeedNodeId || '').trim();
    if (!setComfyNodeInput(workflow, posId, 'text', promptText)) {
      throw new Error(t('comfy_error_positive_node'));
    }
    if (negId) setComfyNodeInput(workflow, negId, 'text', store.settings.comfyNegativePrompt || '');
    if (seedId) {
      const node = workflow[seedId];
      if (node && node.inputs) {
        if ('seed' in node.inputs) node.inputs.seed = Math.floor(Math.random() * 9007199254740991);
        else if ('noise_seed' in node.inputs) node.inputs.noise_seed = Math.floor(Math.random() * 9007199254740991);
      }
    }
  }

  /**
   * 等待生成完成：WebSocket + 2.5s 轮询双保险，180s 超时（原版 waitForComfyPrompt，byte 519600）。
   */
  function waitForPrompt(server: string, clientId: string, promptId: string, timeoutMs = 180000): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = server.replace(/^http/i, 'ws') + '/ws?clientId=' + encodeURIComponent(clientId);
      let ws: WebSocket | null = null;
      let done = false;
      let pollTimer: any = null;
      const timer = setTimeout(() => { cleanup(); reject(new Error(t('comfy_error_timeout'))); }, timeoutMs);

      function cleanup() {
        done = true;
        clearTimeout(timer);
        if (pollTimer) clearInterval(pollTimer);
        try { if (ws) ws.close(); } catch { /* noop */ }
      }

      async function pollHistory() {
        if (done) return;
        try {
          const res = await fetch(server + '/history/' + encodeURIComponent(promptId));
          if (!res.ok) return;
          const json = await res.json();
          if (json && (json[promptId] || json.outputs)) { cleanup(); resolve(); }
        } catch { /* keep polling */ }
      }
      pollTimer = setInterval(pollHistory, 2500);

      try {
        ws = new WebSocket(wsUrl);
      } catch (e) {
        cleanup();
        reject(e);
        return;
      }
      ws.onerror = () => { if (!done) { cleanup(); reject(new Error(t('comfy_error_ws'))); } };
      ws.onmessage = (ev) => {
        if (done || typeof ev.data !== 'string') return;
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === 'executing' && msg.data && msg.data.prompt_id === promptId && msg.data.node === null) {
            cleanup();
            resolve();
          }
        } catch { /* noop */ }
      };
    });
  }

  /** 从 history 中找输出图（原版 findComfyOutputImage，byte 520200） */
  function findOutputImage(history: any, promptId: string): any {
    const item = history && (history[promptId] || history);
    const outputs = item && item.outputs ? item.outputs : {};
    for (const nodeId of Object.keys(outputs || {})) {
      const images = outputs[nodeId]?.images;
      if (Array.isArray(images) && images.length > 0) return images[0];
    }
    return null;
  }

  /** 取图字节为 data URL（原版 fetchBlobAsDataUrl，byte 520100） */
  async function fetchBlobAsDataUrl(url: string): Promise<string> {
    const res = await fetch(url);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /** 是否可生成（启用 + 有会话 + 有 workflow + 非生成中） */
  function canGenerate(): boolean {
    return !!store.settings.comfyEnabled
      && !!store.activeConversation
      && !!store.settings.comfyWorkflow
      && !isGenerating.value
      && !store.isGenerating;
  }

  /**
   * 为当前会话生成一张图并附加为 assistant 消息（原版 generateComfyImageForCurrentChat，byte 521766）。
   * inputText 为当前输入框文本（用于 {{input}}/{{scene}}）。
   */
  async function generateForCurrentChat(inputText = ''): Promise<void> {
    if (isGenerating.value || store.isGenerating) return;
    if (!store.settings.comfyEnabled) { ui.showDialog({ message: t('comfy_error_disabled'), showCancel: false }); return; }
    const conv = store.activeConversation;
    if (!conv) return;

    const server = normalizeComfyServer(store.settings.comfyServer);
    const promptText = buildPromptText(conv, inputText);

    isGenerating.value = true;
    try {
      const workflow = cloneWorkflow();
      applyPromptToWorkflow(workflow, promptText);

      const clientId = makeComfyClientId();
      const submitRes = await fetch(server + '/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow, client_id: clientId }),
      });
      if (!submitRes.ok) throw new Error('HTTP ' + submitRes.status + ': ' + (await submitRes.text()).slice(0, 200));
      const submitJson = await submitRes.json();
      const promptId = submitJson.prompt_id;
      if (!promptId) throw new Error(t('comfy_error_prompt_id'));

      await waitForPrompt(server, clientId, promptId, 180000);

      const histRes = await fetch(server + '/history/' + encodeURIComponent(promptId));
      if (!histRes.ok) throw new Error('HTTP ' + histRes.status);
      const history = await histRes.json();
      const image = findOutputImage(history, promptId);
      if (!image) throw new Error(t('comfy_error_no_image'));

      const viewUrl = server + '/view?filename=' + encodeURIComponent(image.filename || '')
        + '&subfolder=' + encodeURIComponent(image.subfolder || '')
        + '&type=' + encodeURIComponent(image.type || 'output');
      const dataUrl = await fetchBlobAsDataUrl(viewUrl);

      const msg: any = {
        role: 'assistant',
        content: '',
        attachments: [{
          type: 'image',
          source: 'comfyui',
          mime: dataUrl.slice(5, dataUrl.indexOf(';')) || 'image/png',
          dataUrl,
          prompt: promptText,
          comfyPromptId: promptId,
          filename: image.filename || '',
          createdAt: Date.now(),
        }],
      };
      conv.messages.push(msg);
      conv.updated = Date.now();
      store.persist();
    } catch (e: any) {
      ui.showDialog({ message: t('comfy_error_prefix') + formatComfyError(e, t('comfy_error_fetch_hint')), showCancel: false });
    } finally {
      isGenerating.value = false;
    }
  }

  /** 导入 workflow JSON 文件（原版 importComfyWorkflowFile，byte 524673） */
  async function importWorkflowFile(file: File): Promise<void> {
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error(t('comfy_error_workflow_invalid'));
      store.settings.comfyWorkflow = json;
      store.settings.comfyWorkflowName = file.name || 'workflow.json';
      store.persist(true);
      ui.showDialog({ message: t('settings_comfy_import_success'), showCancel: false });
    } catch (e: any) {
      ui.showDialog({ message: t('comfy_error_prefix') + formatComfyError(e, t('comfy_error_fetch_hint')), showCancel: false });
    }
  }

  /** 测试连接（原版 testComfyConnection，byte 525976） */
  async function testConnection(): Promise<void> {
    const server = normalizeComfyServer(store.settings.comfyServer);
    try {
      const res = await fetch(server + '/system_stats');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      ui.showDialog({ message: t('settings_comfy_test_success'), showCancel: false });
    } catch (e: any) {
      ui.showDialog({ message: t('comfy_error_prefix') + formatComfyError(e, t('comfy_error_fetch_hint')), showCancel: false });
    }
  }

  /** workflow 状态文本（原版 updateComfyWorkflowStatus，byte 525650） */
  const workflowStatus = computed(() => {
    const wf = store.settings.comfyWorkflow;
    if (wf && typeof wf === 'object') {
      const count = Object.keys(wf).length;
      return (store.settings.comfyWorkflowName || 'workflow.json') + ' · ' + count + ' nodes';
    }
    return t('settings_comfy_no_workflow');
  });
  const hasWorkflow = computed(() => !!store.settings.comfyWorkflow);

  return {
    isGenerating,
    canGenerate,
    generateForCurrentChat,
    importWorkflowFile,
    testConnection,
    workflowStatus,
    hasWorkflow,
  };
}
