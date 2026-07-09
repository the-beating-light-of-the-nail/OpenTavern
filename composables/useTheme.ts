import { useAppStore } from '~/stores/app';

/**
 * 主题与效能模式应用。
 * 通过给 <body> 加 class（theme-new-light / theme-new-dark / low-power）触发 main.css 中的主题规则，
 * 与原版 applyUiTheme / applyPerformanceMode 行为一致。
 * UI_THEME_CACHE_KEY 用于首屏闪烁兜底（与原版一致）。
 */
const VALID_THEMES = ['classic', 'new-light', 'new-dark'] as const;
type UiTheme = (typeof VALID_THEMES)[number];

function normalizeUiTheme(t: string | undefined | null): UiTheme {
  return (VALID_THEMES as readonly string[]).includes(t as string) ? (t as UiTheme) : 'new-light';
}

export function useTheme() {
  const store = useAppStore();

  function apply() {
    if (typeof document === 'undefined') return;
    const body = document.body;
    if (!body) return;

    const theme = normalizeUiTheme(store.settings.uiTheme as string);
    body.classList.remove('theme-classic', 'theme-new-light', 'theme-new-dark');
    body.classList.add(`theme-${theme}`);

    if (store.settings.lowPowerMode) body.classList.add('low-power');
    else body.classList.remove('low-power');

    try {
      localStorage.setItem('opentavern-ui-theme', theme);
    } catch { /* noop */ }
  }

  /** 监听 settings 变化自动应用（响应式） */
  function watch() {
    apply();
    store.$subscribe(() => apply());
  }

  return { apply, watch, normalizeUiTheme };
}
