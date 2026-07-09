import type { Settings } from '~/types/state';
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
  async function streamChat(
    messages: any[],
    settings: Settings,
    controller: AbortController,
    callbacks: StreamCallbacks,
    requestOptions: RequestOptions = {},
  ): Promise<void> {
    const { onToken, onComplete, onError } = callbacks;

    if (!settings.apiEndpoint || !settings.apiKey) {
      onError(new Error('请先在设置中配置 API Endpoint 和 API Key'));
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
      let errMsg = 'API Error ' + response.status;
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

  return { streamChat };
}
