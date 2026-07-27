import { ref } from 'vue';
import type { Settings } from '~/types/state';
import { useAppStore } from '~/stores/app';
import {
  normalizeApiEndpoint,
  shouldUseOllamaCompat,
  normalizeMessagesForOllama,
  extractCotDelta,
  splitInlineCot,
} from '~/utils/chat-helpers';
export interface StreamCallbacks {
  onToken: (token: string, fullContent: string, fullCot: string) => void;
  onComplete: (content: string, cot: string) => void;
  onError: (err: Error) => void;
}

export interface RequestOptions {
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  requestCot?: boolean;
}

/**
 * 远程 API 流式调用（OpenAI 兼容 /chat/completions + SSE）。
 * 忠实移植原版 streamChatWithMessages（index.html:10029）的 pump/SSE 解析逻辑。
 */
export function useRemoteAPI() {
  const { t } = useI18n();
  const store = useAppStore();
  const isTesting = ref(false);

  /** API 测试结果（供设置面板内联展示；移植自原版 testMainApiConnection） */
  interface ApiTestState {
    status: 'idle' | 'testing' | 'need' | 'success' | 'error';
    models: string[];
    total: number;
    detail: string;
    testedUrls: string[];
    suggestions: string[];
  }
  const apiTest = ref<ApiTestState>({
    status: 'idle', models: [], total: 0, detail: '', testedUrls: [], suggestions: [],
  });

  async function streamChat(
    messages: any[],
    settings: Settings,
    controller: AbortController,
    callbacks: StreamCallbacks,
    requestOptions: RequestOptions = {},
  ): Promise<void> {
    const { onToken, onComplete, onError } = callbacks;

    if (!settings.apiEndpoint || !settings.apiKey) {
      onError(new Error(t('no_api_error')));
      return;
    }

    const endpoint = normalizeApiEndpoint(settings.apiEndpoint);
    let msgs = messages;
    if (shouldUseOllamaCompat(settings.apiEndpoint, settings.ollamaCompatMode)) {
      msgs = normalizeMessagesForOllama(msgs);
    }

    const captureCot = !!settings.requestCotEnabled && requestOptions.requestCot !== false;
    const payload = {
      model: settings.model,
      messages: msgs,
      max_tokens: requestOptions.maxTokens || settings.maxTokens,
      temperature: typeof requestOptions.temperature === 'number' ? requestOptions.temperature : settings.temperature,
      top_p: typeof requestOptions.topP === 'number' ? requestOptions.topP : settings.topP,
      stream: true,
    };

    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + settings.apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (e: any) {
      if (e.name === 'AbortError') {
        onComplete('', '');
      } else {
        onError(e);
      }
      return;
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      let errMsg = t('api_error_prefix') + ' ' + response.status;
      try {
        const errJson = JSON.parse(text);
        if (errJson.error?.message) errMsg += ': ' + errJson.error.message;
      } catch {
        if (text) errMsg += ': ' + text.slice(0, 200);
      }
      onError(new Error(errMsg));
      return;
    }

    // SSE pump 循环
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullContent = '';
    let fullCot = '';

    async function pump(): Promise<void> {
      try {
        const { done, value } = await reader.read();
        if (done) {
          const parts = captureCot ? splitInlineCot(fullContent, fullCot) : { content: fullContent, cot: '' };
          onComplete(parts.content, parts.cot);
          return;
        }
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const rawLine of lines) {
          const line = rawLine.trim();
          if (!line || !line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') {
            const parts = captureCot ? splitInlineCot(fullContent, fullCot) : { content: fullContent, cot: '' };
            onComplete(parts.content, parts.cot);
            return;
          }
          try {
            const json = JSON.parse(data);
            const delta = json.choices?.[0]?.delta;
            const cotDelta = captureCot ? extractCotDelta(delta) : '';
            const contentDelta = (delta && delta.content) ? delta.content : '';
            if (cotDelta) fullCot += cotDelta;
            if (contentDelta) fullContent += contentDelta;
            if (contentDelta || cotDelta) {
              const parts = captureCot ? splitInlineCot(fullContent, fullCot) : { content: fullContent, cot: '' };
              onToken(contentDelta, parts.content, parts.cot);
            }
          } catch { /* skip malformed */ }
        }
        return pump();
      } catch (e: any) {
        if (e.name === 'AbortError') {
          const parts = captureCot ? splitInlineCot(fullContent, fullCot) : { content: fullContent, cot: '' };
          onComplete(parts.content, parts.cot);
        } else {
          onError(e);
        }
      }
    }

    return pump();
  }

  /**
   * 测试远程 API 连接（忠实移植自原版 testMainApiConnection，archive/index.html:6419）。
   * 结果写入 apiTest 响应式状态，由设置面板内联渲染（绿=成功 / 红=失败），不依赖弹窗。
   * 流程：首选 GET {派生}/models → 成功即返回模型列表；失败则跑极简非流式 chat 做诊断，
   * 最终给出失败报告（详情 + 测试地址 + 针对性建议）。
   */

  /** 派生 /v1/models 测试地址（兼容 /v1、/openai/v1、/paas/v4，及 DeepSeek 等无版本输入） */
  function deriveModelsEndpoint(raw: string): string {
    let u = String(raw || '').trim().replace(/\/+$/, '').replace(/\/chat\/completions$/i, '');
    if (/\/(v[0-9]+|openai\/v1|paas\/v[0-9]+)$/.test(u)) return u + '/models';
    if (!/\/v[0-9]/.test(u) && !u.includes('/paas/')) u += '/v1';
    return u + '/models';
  }

  async function testApiConnection(): Promise<void> {
    const rawEndpoint = String(store.settings.apiEndpoint || '').trim();
    if (!rawEndpoint) {
      apiTest.value = { status: 'need', models: [], total: 0, detail: '', testedUrls: [], suggestions: [] };
      return;
    }
    const apiKey = String(store.settings.apiKey || '').trim();
    const model = String(store.settings.model || '').trim() || 'gpt-3.5-turbo';
    const modelsUrl = deriveModelsEndpoint(rawEndpoint);
    const chatUrl = normalizeApiEndpoint(rawEndpoint);
    const testedUrls: string[] = [];
    const TIMEOUT_MS = 15000;

    const fetchWithTimeout = (url: string, init: RequestInit): Promise<Response> => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
      return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
    };
    const authHeaders = (extra: Record<string, string> = {}): Record<string, string> => {
      const h: Record<string, string> = { ...extra };
      if (apiKey) h['Authorization'] = 'Bearer ' + apiKey;
      return h;
    };

    isTesting.value = true;
    apiTest.value = { status: 'testing', models: [], total: 0, detail: '', testedUrls: [], suggestions: [] };
    try {
      // ===== 1) 首选：GET /v1/models =====
      let modelsErrInfo = '';
      try {
        testedUrls.push('GET ' + modelsUrl);
        const resp = await fetchWithTimeout(modelsUrl, { method: 'GET', headers: authHeaders() });
        if (resp.ok) {
          const data: any = await resp.json().catch(() => ({}));
          let modelsList: string[] = [];
          if (data && Array.isArray(data.data)) {
            modelsList = data.data.map((m: any) => (m && (m.id || m.name)) || String(m)).filter(Boolean);
          } else if (Array.isArray(data)) {
            modelsList = data.map((m: any) => (m && (m.id || m.name)) || String(m)).filter(Boolean);
          }
          apiTest.value = {
            status: 'success',
            models: modelsList.slice(0, 12),
            total: modelsList.length,
            detail: '', testedUrls: [], suggestions: [],
          };
          return; // 成功即结束，不再跑备选
        } else {
          const text = await resp.text().catch(() => '');
          let errMsg = 'HTTP ' + resp.status;
          try {
            const j = JSON.parse(text);
            if (j.error?.message) errMsg += ' — ' + j.error.message;
            else if (j.message) errMsg += ' — ' + j.message;
          } catch {
            if (text) errMsg += ' — ' + text.slice(0, 300);
          }
          modelsErrInfo = errMsg;
        }
      } catch (e: any) {
        if (e?.name === 'AbortError') modelsErrInfo = t('api_test_timeout_msg', { s: TIMEOUT_MS / 1000 });
        else if (e instanceof TypeError) modelsErrInfo = t('api_test_typeerror_prefix') + (e.message || 'Failed to fetch');
        else modelsErrInfo = (e?.message || String(e));
      }

      // ===== 2) 备选/进阶：极简非流式 chat（仅作诊断，最终仍按失败报告呈现） =====
      let chatResult = '';
      try {
        testedUrls.push('POST ' + chatUrl + ' (stream:false)');
        const resp = await fetchWithTimeout(chatUrl, {
          method: 'POST',
          headers: authHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify({ model, messages: [{ role: 'user', content: 'hi' }], max_tokens: 1, temperature: 0, stream: false }),
        });
        if (resp.ok) {
          const data: any = await resp.json().catch(() => ({}));
          const hasChoice = !!(data && data.choices && data.choices[0]);
          chatResult = t('api_test_fallback_success') + (hasChoice ? t('api_test_fallback_success_choice') : t('api_test_fallback_success_ok'));
        } else {
          const text = await resp.text().catch(() => '');
          let cmsg = 'HTTP ' + resp.status;
          try { const j = JSON.parse(text); if (j.error?.message) cmsg += ' — ' + j.error.message; } catch { /* noop */ }
          chatResult = t('api_test_fallback_failed_prefix') + cmsg;
        }
      } catch (e: any) {
        let c2 = '';
        if (e?.name === 'AbortError') c2 = t('api_test_timeout_short');
        else if (e instanceof TypeError) c2 = t('api_test_typeerror_cors_note');
        else c2 = (e?.message || String(e));
        chatResult = t('api_test_fallback_failed_prefix') + c2;
      }

      // ===== 3) 失败报告：详情 + 测试地址 + 针对性建议 =====
      const suggestions: string[] = [];
      const rawLower = rawEndpoint.toLowerCase();
      if (rawLower.includes('localhost') || rawLower.includes('127.0.0.1')) suggestions.push(t('api_test_suggest_localhost'));
      suggestions.push(t('api_test_suggest_cors'));
      suggestions.push(t('api_test_suggest_endpoint_path'));
      suggestions.push(t('api_test_suggest_apikey'));
      suggestions.push(t('api_test_suggest_stream'));
      suggestions.push(t('api_test_suggest_gateway'));

      let detail = t('api_test_models_failed_prefix') + (modelsErrInfo || t('api_test_unknown_error'));
      if (chatResult) detail += '\n' + chatResult;

      apiTest.value = { status: 'error', models: [], total: 0, detail, testedUrls, suggestions };
    } finally {
      isTesting.value = false;
    }
  }

  return { streamChat, testApiConnection, isTesting, apiTest };
}
