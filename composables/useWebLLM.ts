import { shallowRef, ref } from 'vue';
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { useStorage } from '~/composables/useStorage';
import { extractCotDelta, splitInlineCot } from '~/utils/chat-helpers';
import type { Settings } from '~/types/state';
import type { StreamCallbacks, RequestOptions } from '~/composables/useRemoteAPI';

/**
 * WebLLM 浏览器本地推理（逐字移植自原版 index.html 的 WebLLM 逻辑）。
 * - 仅在用户主动确认后动态 import esm.run/@mlc-ai/web-llm，冷加载 0 KB。
 * - streamChat 与 useRemoteAPI.streamChat 同签名，便于 useChat 按后端分派。
 * - 初始化失败自动切回 remote-api 并提示；聊天推理失败仅 onError，不自动回退。
 * 所有 WebGPU / 动态 import 均为浏览器端，import.meta.client 守卫以防 SSR 执行。
 */

/** 模型清单（原版 WEBLLM_MODEL_INFO，byte 175247） */
const WEBLLM_MODEL_INFO: Record<string, { label: string; sizeMB: number }> = {
  'Llama-3.2-1B-Instruct-q4f16_1-MLC': { label: 'Llama-3.2-1B', sizeMB: 850 },
  'Llama-3.2-3B-Instruct-q4f16_1-MLC': { label: 'Llama-3.2-3B', sizeMB: 2100 },
};

// ---------- 模块级运行时状态（SPA 单例；ssr:false 下安全） ----------
const engine = shallowRef<any>(null);          // MLCEngine 实例
const currentModel = ref<string | null>(null); // 当前已加载模型 ID
let chatAbortFlag = false;                       // 聊天推理协作式中断标志
let initAbortByUser = false;                     // 初始化用户取消标志
const progressPercent = ref(0);
const progressStatus = ref('');
let webgpuLastDeviceReport: any = null;

/** 确认弹窗上下文（模态通过 useWebLLM 方法读取） */
let confirmResolvers: { onContinue?: (m: string) => void; onCancel?: () => void } = {};

/** 取扁平 adapterInfo（原版 getPlainAdapterInfo） */
function getPlainAdapterInfo(ai: any): any {
  if (!ai) return {};
  if (typeof ai === 'string') return { description: ai };
  const out: any = {};
  for (const k of ['vendor', 'architecture', 'device', 'description']) {
    if (ai[k]) out[k] = String(ai[k]);
  }
  return out;
}

/**
 * 临时把 navigator.gpu.requestAdapter 包装为强制 powerPreference:'high-performance'，
 * 仅用于引擎创建（原版 withHighPerformanceWebGPUAdapterRequest，byte 183195）。
 */
function withHighPerformanceWebGPUAdapterRequest<T>(fn: () => Promise<T>): Promise<T> {
  const gpu = (typeof navigator !== 'undefined') ? (navigator as any).gpu : undefined;
  if (!gpu || typeof gpu.requestAdapter !== 'function') return fn();
  const original = gpu.requestAdapter.bind(gpu);
  let restored = false;
  const restore = () => {
    if (!restored) {
      restored = true;
      gpu.requestAdapter = original;
    }
  };
  gpu.requestAdapter = function (options?: any) {
    return original.call(gpu, { ...(options || {}), powerPreference: 'high-performance' });
  };
  return Promise.resolve(fn()).then(
    (v) => { restore(); return v; },
    (e) => { restore(); throw e; },
  );
}

export function useWebLLM() {
  const store = useAppStore();
  const ui = useUiStore();
  const { t } = useI18n();

  /** 当前是否走 WebLLM 后端（原版 isWebLLMBackend，byte 185371） */
  function isWebLLMBackend(): boolean {
    return store.settings.inferenceBackend === 'webllm';
  }

  /** 取当前模型 ID（原版 getWebLLMModelId，byte 185468） */
  function getModelId(): string {
    return store.settings.webllmModel || 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
  }

  /**
   * 动态加载 WebLLM 库并创建引擎（原版 ensureWebLLMEngine，byte 185695）。
   * 仅在用户确认后调用，是唯一允许 import 的入口。
   */
  async function ensureEngine(modelId: string, onProgress?: (r: { progress: number; text: string }) => void): Promise<any> {
    if (engine.value && currentModel.value === modelId) {
      if (onProgress) onProgress({ progress: 1, text: t('webllm_ready') });
      return engine.value;
    }

    if (!import.meta.client) throw new Error('NO_WEBLLM_BROWSER');
    // WebGPU 能力检测（必须）
    if (!(navigator as any).gpu) throw new Error('NO_WEBGPU');

    let webllm: any;
    try {
      // @ts-expect-error 远程 URL 模块，运行时由浏览器解析（与原版一致）
      webllm = await import(/* @vite-ignore */ 'https://esm.run/@mlc-ai/web-llm');
    } catch (e: any) {
      throw new Error('LIB_LOAD_ERROR:' + (e?.message || e));
    }
    const CreateMLCEngine = webllm.CreateMLCEngine;
    if (!CreateMLCEngine) throw new Error('NO_WEBLLM_ENGINE');

    try {
      const eng: any = await withHighPerformanceWebGPUAdapterRequest(() =>
        CreateMLCEngine(modelId, { initProgressCallback: (report: any) => onProgress?.(report) }),
      );
      try {
        if (eng?.device?.adapterInfo) {
          webgpuLastDeviceReport = {
            info: getPlainAdapterInfo(eng.device.adapterInfo),
            detectedAt: Date.now(),
            source: 'WebLLM engine',
          };
        }
      } catch { /* noop */ }
      engine.value = eng;
      currentModel.value = modelId;
      store.settings.inferenceBackend = 'webllm';
      store.settings.webllmModel = modelId;
      return eng;
    } catch (e: any) {
      engine.value = null;
      currentModel.value = null;
      throw e;
    }
  }

  /**
   * 流式推理（原版 streamChatWebLLMWithMessages，byte 526910）。
   * 签名与 useRemoteAPI.streamChat 一致，messages / 回调契约完全相同。
   * 中断 = chatAbortFlag 置位后跳出循环，按原版语义回调 onComplete(partial)。
   */
  async function streamChat(
    messages: any[],
    settings: Settings,
    _controller: AbortController,
    callbacks: StreamCallbacks,
    requestOptions: RequestOptions = {},
  ): Promise<void> {
    const { onToken, onComplete, onError } = callbacks;

    const modelId = getModelId();
    if (!engine.value || currentModel.value !== modelId) {
      onError(new Error(t('webllm_engine_not_ready')));
      return;
    }

    const captureCot = !!settings.requestCotEnabled && requestOptions.requestCot !== false;
    const req = {
      messages,
      max_tokens: requestOptions.maxTokens || settings.maxTokens || 1024,
      temperature: typeof requestOptions.temperature === 'number' ? requestOptions.temperature : (typeof settings.temperature === 'number' ? settings.temperature : 0.7),
      top_p: typeof requestOptions.topP === 'number' ? requestOptions.topP : (typeof settings.topP === 'number' ? settings.topP : 0.9),
      stream: true,
    };

    let aborted = false;
    chatAbortFlag = false;
    const checkAbort = () => { if (chatAbortFlag) aborted = true; return aborted; };

    let fullContent = '';
    let fullCot = '';

    try {
      const stream = await engine.value.chat.completions.create(req);
      for await (const chunk of stream) {
        if (checkAbort()) break;
        const delta = chunk?.choices?.[0]?.delta;
        const cotDelta = captureCot ? extractCotDelta(delta) : '';
        const contentDelta = delta?.content ? delta.content : '';
        if (cotDelta) fullCot += cotDelta;
        if (contentDelta) fullContent += contentDelta;
        if (contentDelta || cotDelta) {
          const parts = captureCot ? splitInlineCot(fullContent, fullCot) : { content: fullContent, cot: '' };
          onToken(contentDelta, parts.content, parts.cot);
        }
      }
      chatAbortFlag = false;
      const finalParts = captureCot ? splitInlineCot(fullContent || '', fullCot) : { content: fullContent || '', cot: '' };
      onComplete(finalParts.content, finalParts.cot);
    } catch (e: any) {
      chatAbortFlag = false;
      if (aborted || e?.name === 'AbortError') {
        const abortParts = captureCot ? splitInlineCot(fullContent || '', fullCot) : { content: fullContent || '', cot: '' };
        onComplete(abortParts.content, abortParts.cot);
      } else {
        onError(e);
      }
    }
  }

  /** 中断当前聊天推理（由 useChat.stopGeneration 调用） */
  function abort(): void {
    chatAbortFlag = true;
  }

  /** 检测当前 WebGPU 设备（原版 detectCurrentWebGPUDevice，byte 181203） */
  async function detectWebGPUDevice(opts: { showDialog?: boolean } = {}): Promise<any> {
    if (!import.meta.client || !(navigator as any).gpu) throw new Error('NO_WEBGPU');
    const adapter = await (navigator as any).gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) throw new Error('NO_WEBGPU');
    let info: any = {};
    try {
      const ai = adapter.requestAdapterInfo ? await adapter.requestAdapterInfo() : adapter.info;
      info = getPlainAdapterInfo(ai);
    } catch { info = getPlainAdapterInfo(adapter.info); }
    webgpuLastDeviceReport = { info, detectedAt: Date.now(), source: 'detectWebGPUDevice' };
    const lines = Object.entries(info).map(([k, v]) => `${k}: ${v}`);
    const desc = lines.length ? lines.join('\n') : t('webllm_no_adapter_info');
    if (opts.showDialog) {
      ui.showDialog({ title: t('webllm_device_dialog_title'), message: desc, showCancel: false });
    }
    return webgpuLastDeviceReport;
  }

  /**
   * 启动下载/初始化（原版 startWebLLMInitialization，byte 193691）。
   * 驱动 webllmProgress 模态、配额预检、成功/失败/取消处理。
   */
  async function startInitialization(forcedModelId?: string): Promise<void> {
    const modelId = forcedModelId || getModelId();
    const info = WEBLLM_MODEL_INFO[modelId] || { label: modelId, sizeMB: 0 };
    initAbortByUser = false;

    async function preflightStorageQuota(): Promise<boolean> {
      const needMB = info.sizeMB || 900;
      try {
        const { service } = useStorage();
        const sInfo = await service.getStorageInfo();
        if (sInfo && sInfo.quota != null) {
          const currentUsed = sInfo.originUsed && sInfo.originUsed > 0 ? sInfo.originUsed : sInfo.used;
          const freeEst = sInfo.quota - currentUsed;
          if (freeEst < needMB * 1024 * 1024 * 1.6) {
            const sizeStr = info.sizeMB >= 1000 ? (info.sizeMB / 1000).toFixed(1) + ' GB' : info.sizeMB + ' MB';
            const ok = await ui.showDialog({
              title: t('webllm_storage_warning_title'),
              message: t('webllm_storage_warning_msg', { size: sizeStr }),
              showCancel: true,
            });
            if (!ok) {
              store.settings.inferenceBackend = 'remote-api';
              store.persist(true);
              return false;
            }
          }
        }
      } catch { /* ignore */ }
      return true;
    }

    function finish(success: boolean, errMsg?: string): void {
      ui.close('webllmProgress');
      if (!success) {
        store.settings.inferenceBackend = 'remote-api';
        store.persist();
        const msg = t('webllm_init_failed', { msg: errMsg || t('webllm_unknown_error') });
        ui.showDialog({ message: msg, showCancel: false });
      } else {
        console.log('[WebLLM]', t('webllm_init_success', { model: info.label }));
      }
    }

    if (!await preflightStorageQuota()) return;

    progressPercent.value = 0;
    progressStatus.value = t('webllm_download_preparing');
    ui.open('webllmProgress');

    ensureEngine(modelId, (report) => {
      const pct = Math.max(0, Math.min(100, Math.round((report.progress || 0) * 100)));
      progressPercent.value = pct;
      const txt = report.text || (pct < 100 ? t('webllm_download_in_progress') : t('webllm_download_done'));
      progressStatus.value = txt + ' (' + info.label + ')';
    })
      .then(() => { if (!initAbortByUser) finish(true); })
      .catch((e: any) => {
        if (initAbortByUser) return;
        const msg = e?.message || '';
        const reason = msg === 'NO_WEBGPU' ? t('webllm_init_no_webgpu')
          : msg === 'NO_WEBLLM_BROWSER' ? t('webllm_browser_only')
          : msg === 'NO_WEBLLM_ENGINE' ? t('webllm_lib_missing_engine')
          : msg.startsWith('LIB_LOAD_ERROR:') ? t('webllm_lib_load_error', { msg: msg.slice('LIB_LOAD_ERROR:'.length) })
          : msg || String(e);
        finish(false, reason);
      });
  }

  /** 用户在进度模态点取消（原版 doCancel） */
  function cancelInit(): void {
    initAbortByUser = true;
    ui.close('webllmProgress');
    store.settings.inferenceBackend = 'remote-api';
    store.persist();
    engine.value = null;
    currentModel.value = null;
  }

  /**
   * 打开确认模态（原版 showWebLLMConfirmForModel，byte 187639）。
   * isFirstEnable=true（首次启用）显示 1B/3B 选择按钮；否则显示通用 Continue/Cancel。
   */
  function showConfirmForModel(
    targetModelId: string | null,
    isModelSwitch: boolean,
    onContinue?: (m: string) => void,
    onCancel?: () => void,
  ): void {
    const modelId = targetModelId || getModelId();
    const info = WEBLLM_MODEL_INFO[modelId] || { label: t('webllm_selected_model'), sizeMB: 1000 };
    const sizeText = info.sizeMB >= 1000 ? (info.sizeMB / 1000).toFixed(1) + ' GB' : info.sizeMB + ' MB';

    const html = isModelSwitch
      ? t('webllm_confirm_switch_model', { size: sizeText, model: info.label || modelId })
      : t('webllm_confirm_first_enable', { size: sizeText });

    confirmResolvers = { onContinue, onCancel };
    ui.open('webllmConfirm', { html, isFirstEnable: !isModelSwitch, targetModelId: modelId, isModelSwitch });
  }

  // ---------- 确认模态按钮处理（由 WebLLMConfirmModal 调用） ----------
  function confirmChoose(chosenModel: string): void {
    ui.close('webllmConfirm');
    store.settings.inferenceBackend = 'webllm';
    store.settings.webllmModel = chosenModel;
    store.persist();
    startInitialization(chosenModel);
    confirmResolvers.onContinue?.(chosenModel);
    confirmResolvers = {};
  }

  function confirmContinueGeneric(): void {
    const payload = ui.payload('webllmConfirm') as any;
    const chosen = payload?.targetModelId || getModelId();
    ui.close('webllmConfirm');
    confirmResolvers.onContinue?.(chosen);
    confirmResolvers = {};
  }

  function confirmCancel(): void {
    ui.close('webllmConfirm');
    confirmResolvers.onCancel?.();
    confirmResolvers = {};
  }

  // ---------- 设置面板触发（由 SettingsModal 调用） ----------
  /** 后端下拉切换：切到 webllm 时弹确认；取消则回退 */
  function onBackendChange(newBackend: string, prevBackend: string): void {
    if (newBackend === 'webllm' && prevBackend !== 'webllm') {
      showConfirmForModel(null, false, undefined, () => {
        store.settings.inferenceBackend = 'remote-api';
        store.persist();
      });
    } else {
      store.persist();
    }
  }

  /** 模型下拉切换：已在 webllm 时换模型弹确认 */
  function onModelChange(newModel: string): void {
    if (!isWebLLMBackend()) {
      store.persist();
      return;
    }
    const loaded = currentModel.value;
    if (!loaded || loaded !== newModel) {
      showConfirmForModel(newModel, true, undefined, () => {
        store.settings.webllmModel = loaded || 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
        store.persist();
      });
    } else {
      store.persist();
    }
  }

  // ---------- 缓存清理（原版 clearWebLLMCache / getWebLLMUsedSize，byte 335600） ----------
  let cacheSizeMemo: { size: number; time: number } | null = null;

  async function getUsedSize(opts: { force?: boolean } = {}): Promise<number> {
    const ttl = 60000;
    const now = Date.now();
    if (!opts.force && cacheSizeMemo && now - cacheSizeMemo.time < ttl) return cacheSizeMemo.size;
    let total = 0;
    try {
      if (typeof caches === 'undefined') return 0;
      const keys = await caches.keys();
      const relevant = keys.filter((k) => /webllm|mlc|llm|transformers/i.test(k));
      for (const name of relevant) {
        const cache = await caches.open(name);
        const reqs = await cache.keys();
        for (const req of reqs) {
          const res = await cache.match(req);
          if (res) {
            const blob = await res.blob().catch(() => null);
            if (blob) total += blob.size;
          }
        }
      }
    } catch { /* ignore */ }
    cacheSizeMemo = { size: total, time: now };
    return total;
  }

  async function clearCache(opts: { silent?: boolean } = {}): Promise<void> {
    let cleared = 0;
    try {
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys();
        for (const key of keys) {
          if (/webllm|mlc|llm|transformers/i.test(key)) {
            if (await caches.delete(key)) cleared++;
          }
        }
      }
    } catch (e) {
      console.warn('[WebLLM] cache clear error', e);
    }
    cacheSizeMemo = null;
    if (!opts.silent) {
      ui.showDialog({
        message: cleared > 0
          ? t('webllm_cache_cleared', { count: cleared })
          : t('webllm_cache_none'),
        showCancel: false,
      });
    }
  }

  return {
    WEBLLM_MODEL_INFO,
    isWebLLMBackend,
    getModelId,
    ensureEngine,
    streamChat,
    abort,
    detectWebGPUDevice,
    startInitialization,
    cancelInit,
    showConfirmForModel,
    confirmChoose,
    confirmContinueGeneric,
    confirmCancel,
    onBackendChange,
    onModelChange,
    getUsedSize,
    clearCache,
    // 进度模态绑定
    progressPercent,
    progressStatus,
    // 引擎状态（只读）
    currentModel,
    hasEngine: () => !!engine.value,
  };
}
