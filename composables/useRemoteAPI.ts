import { ref } from 'vue';
import type { Settings } from '~/types/state';
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
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
  const ui = useUiStore();
  const isTesting = ref(false);
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
   * 测试远程 API 连接（用于设置面板的“测试 API 连接”按钮）。
   * 优先 GET {base}/models（OpenAI 兼容 /v1/models），失败则回退到非流式 chat/completions。
   * 所有反馈文案对接已就绪的 api_test_* i18n 键。
   */
  async function testApiConnection(): Promise<void> {
    const rawEndpoint = String(store.settings.apiEndpoint || '').trim();
    if (!rawEndpoint) {
      ui.showDialog({ message: t('api_test_need_endpoint'), showCancel: false });
      return;
    }
    const key = String(store.settings.apiKey || '').trim();
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = 'Bearer ' + key;

    // 规范化基址：去尾斜杠 + 去掉可能已带的 /chat/completions
    const base = rawEndpoint.replace(/\/+$/, '').replace(/\/chat\/completions$/i, '');
    const testedUrls: string[] = [];
    const TIMEOUT_S = 15;

    const fetchWithTimeout = (url: string, init: RequestInit): Promise<Response> => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_S * 1000);
      return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
    };

    const errToString = (e: any): string => {
      if (!e) return t('api_test_unknown_error');
      if (e?.name === 'AbortError') return t('api_test_timeout_msg', { s: TIMEOUT_S });
      const msg = String(e?.message || e);
      if (e instanceof TypeError) {
        return t('api_test_typeerror_prefix') + msg + '\n' + t('api_test_typeerror_cors_note');
      }
      return msg;
    };

    isTesting.value = true;
    try {
      // 1) 首选：GET {base}/models
      const modelsUrl = base + '/models';
      testedUrls.push(modelsUrl);
      const modelsResult: { ok: boolean; note: string } = { ok: false, note: '' };
      try {
        const res = await fetchWithTimeout(modelsUrl, { method: 'GET', headers });
        if (!res.ok) {
          modelsResult.note = 'HTTP ' + res.status;
        } else {
          const json: any = await res.json().catch(() => null);
          const arr: any[] | null = Array.isArray(json?.data) ? json.data
            : Array.isArray(json?.models) ? json.models : null;
          if (arr) {
            modelsResult.ok = true;
            if (arr.length === 0) {
              modelsResult.note = t('api_test_models_empty_note');
            } else {
              const ids = arr
                .map((m: any) => (typeof m === 'string' ? m : (m?.id || m?.name || '')))
                .filter(Boolean);
              const shown = ids.slice(0, 10);
              let note = t('api_test_models_prefix') + shown.length + t('api_test_models_mid') + '\n';
              note += shown.join('\n');
              note += t('api_test_models_total') + ids.length;
              if (ids.length > shown.length) note += '\n' + t('api_test_more_omitted');
              modelsResult.note = note;
            }
          } else {
            modelsResult.note = t('api_test_models_empty_note');
          }
        }
      } catch (e: any) {
        modelsResult.note = errToString(e);
      }

      if (modelsResult.ok) {
        ui.showDialog({ title: t('api_test_success_title'), message: modelsResult.note, showCancel: false });
        return;
      }

      // 2) 回退：非流式 chat/completions（stream:false）
      const chatUrl = normalizeApiEndpoint(base);
      testedUrls.push(chatUrl);
      const fallbackResult: { ok: boolean; note: string } = { ok: false, note: '' };
      try {
        const res = await fetchWithTimeout(chatUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: store.settings.model || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hi' }],
            max_tokens: 16,
            stream: false,
          }),
        });
        if (!res.ok) {
          fallbackResult.note = 'HTTP ' + res.status;
        } else {
          const json: any = await res.json().catch(() => null);
          const hasChoices = !!json?.choices?.length;
          fallbackResult.ok = true;
          fallbackResult.note = t('api_test_fallback_success')
            + (hasChoices ? t('api_test_fallback_success_choice') : t('api_test_fallback_success_ok'));
        }
      } catch (e: any) {
        fallbackResult.note = errToString(e);
      }

      if (fallbackResult.ok) {
        ui.showDialog({ title: t('api_test_success_title'), message: fallbackResult.note, showCancel: false });
        return;
      }

      // 3) 均失败 → 汇总诊断 + 针对性建议
      const combined = modelsResult.note + '\n' + fallbackResult.note;
      const suggestions: string[] = [];
      if (/localhost|127\.0\.0\.1/.test(base.toLowerCase())) suggestions.push(t('api_test_suggest_localhost'));
      if (/typeerror|failed to fetch|cors/i.test(combined)) suggestions.push(t('api_test_suggest_cors'));
      if (/50[234]/.test(combined)) suggestions.push(t('api_test_suggest_gateway'));
      if (!/\/v[0-9]/.test(base)) suggestions.push(t('api_test_suggest_endpoint_path'));
      suggestions.push(t('api_test_suggest_apikey'));
      suggestions.push(t('api_test_suggest_stream'));

      const lines: string[] = [
        t('api_test_models_failed_prefix') + (modelsResult.note || t('api_test_unknown_error')),
        t('api_test_fallback_failed_prefix') + (fallbackResult.note || t('api_test_unknown_error')),
        t('api_test_tested_urls_label'),
        ...testedUrls.map((u) => '• ' + u),
        t('api_test_suggest_title'),
        ...suggestions.map((s) => '• ' + s),
      ];
      ui.showDialog({
        title: t('api_test_failed_title'),
        message: lines.join('\n\n'),
        showCancel: false,
        danger: true,
      });
    } finally {
      isTesting.value = false;
    }
  }

  return { streamChat, testApiConnection, isTesting };
}
