import { ref } from 'vue';
import { useAppStore } from '~/stores/app';
import { useRemoteAPI, type StreamCallbacks } from '~/composables/useRemoteAPI';

/**
 * 工具站 AI 生成：复用 /app 的 BYOK 设置（stores/app.settings）与
 * useRemoteAPI 流式客户端，key 只存浏览器本地。
 * 输出流入 output；generate 前置检查 API 配置，未配置返回 false（由调用方引导打开设置）。
 */
export function useToolAI() {
  const store = useAppStore();
  const { streamChat } = useRemoteAPI();

  const running = ref(false);
  const output = ref('');
  const error = ref('');

  let _controller: AbortController | null = null;
  // useRemoteAPI 在 abort 时也回调 onComplete('','')；置位后跳过覆盖，保留已流式的部分输出
  let _stopped = false;

  /** 是否已配置远程 API（WebLLM 后端时视为可用） */
  function isConfigured(): boolean {
    return store.settings.inferenceBackend === 'webllm' || !!(store.settings.apiEndpoint && store.settings.apiKey);
  }

  /**
   * 流式生成一段文本。成功返回 true；未配置 API 返回 false（不产生 error）。
   * messages: [{role, content}]；requestOptions 透传 temperature 等。
   */
  async function generate(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
    requestOptions: { temperature?: number; maxTokens?: number } = {},
  ): Promise<boolean> {
    if (running.value) return false;
    if (!isConfigured()) return false;
    error.value = '';
    output.value = '';
    running.value = true;
    _stopped = false;
    _controller = new AbortController();
    const callbacks: StreamCallbacks = {
      onToken: (_t, full) => { output.value = full; },
      onComplete: (content) => {
        if (!_stopped) output.value = content;
        running.value = false;
        _controller = null;
      },
      onError: (err: Error) => {
        if (err.name === 'AbortError') {
          running.value = false;
          _controller = null;
          return;
        }
        error.value = err.message || String(err);
        running.value = false;
        _controller = null;
      },
    };
    await streamChat(messages, store.settings, _controller, callbacks, {
      temperature: requestOptions.temperature ?? 0.8,
      maxTokens: requestOptions.maxTokens ?? store.settings.maxTokens,
      requestCot: false,
    });
    return true;
  }

  function stop() {
    _stopped = true;
    if (_controller) {
      _controller.abort();
      _controller = null;
    }
    running.value = false;
  }

  return { running, output, error, isConfigured, generate, stop };
}
