// 运行时广告开关状态：SSR 用默认值，客户端从 localStorage 恢复（自己浏览器记住选择）。
// 普通访客始终看到 ads.ts 的默认配置；?adpanel=1 时才显示切换面板。
import { AD_REGISTRY } from '~/utils/ads';

const STORAGE_KEY = 'rc_ad_panel_v1';

function defaults(): Record<string, boolean> {
  const o: Record<string, boolean> = {};
  for (const ad of AD_REGISTRY) o[ad.id] = ad.defaultOn;
  return o;
}

export function useAdPanel() {
  const state = useState<Record<string, boolean>>('adPanel', defaults);
  const ready = useState<boolean>('adPanelReady', () => false);

  // 客户端挂载后从 localStorage 恢复（合并：新广告用默认，旧选择保留）
  function load() {
    if (!import.meta.client || ready.value) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      state.value = { ...defaults(), ...saved };
    } catch {
      state.value = defaults();
    }
    ready.value = true;
  }

  function set(id: string, on: boolean) {
    state.value = { ...state.value, [id]: on };
    if (import.meta.client) localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value));
  }

  function reset() {
    state.value = defaults();
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY);
  }

  return { state, ready, load, set, reset, registry: AD_REGISTRY };
}
