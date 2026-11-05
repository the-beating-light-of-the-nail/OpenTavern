import { useAppStore } from '~/stores/app';

/**
 * 主题应用（对应源站 tools.laopobao.online 的亮色 / 暗色 / 跟随系统三态）。
 * 用户偏好存 settings.uiTheme；实际落到 <body> 的仍是 theme-classic / new-light / new-dark。
 * system 通过 prefers-color-scheme 解析，并监听系统切换实时生效。
 */
const VALID_THEMES = ['classic', 'new-light', 'new-dark', 'system'] as const;
export type UiTheme = (typeof VALID_THEMES)[number];
export type ResolvedTheme = Exclude<UiTheme, 'system'>;

const THEME_CACHE_KEY = 'opentavern-ui-theme';
const DARK_QUERY = '(prefers-color-scheme: dark)';

let mediaBound = false;
let lastAppliedKey = '';

export function normalizeUiTheme(t: string | undefined | null): UiTheme {
  return (VALID_THEMES as readonly string[]).includes(t as string) ? (t as UiTheme) : 'system';
}

export function useTheme() {
  const store = useAppStore();
  const themeMode = computed<UiTheme>(() => normalizeUiTheme(store.settings.uiTheme as string));

  function prefersDark(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(DARK_QUERY).matches;
  }

  function resolveTheme(mode: UiTheme): ResolvedTheme {
    if (mode === 'system') return prefersDark() ? 'new-dark' : 'new-light';
    return mode;
  }

  function apply() {
    if (typeof document === 'undefined' || !document.body) return;

    const theme = resolveTheme(themeMode.value);
    const lowPower = !!store.settings.lowPowerMode;
    const key = `${themeMode.value}|${theme}|${lowPower}`;
    if (key === lastAppliedKey) return;
    lastAppliedKey = key;

    const body = document.body;
    body.classList.remove('theme-classic', 'theme-new-light', 'theme-new-dark');
    body.classList.add(`theme-${theme}`);

    if (lowPower) body.classList.add('low-power');
    else body.classList.remove('low-power');

    const themeColor = getComputedStyle(body).getPropertyValue('--color-bg').trim();
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta && themeColor) meta.setAttribute('content', themeColor);

    try {
      localStorage.setItem(THEME_CACHE_KEY, themeMode.value);
    } catch { /* noop */ }
  }

  function setTheme(mode: UiTheme) {
    store.settings.uiTheme = mode;
    store.persist();
    apply();
  }

  /** 监听 settings 变化并应用；system 模式下跟随系统主题变化 */
  function watch() {
    apply();
    store.$subscribe(() => apply());

    if (!mediaBound && typeof window !== 'undefined') {
      window.matchMedia(DARK_QUERY).addEventListener('change', () => {
        if (themeMode.value === 'system') apply();
      });
      mediaBound = true;
    }
  }

  return { apply, watch, normalizeUiTheme, setTheme, themeMode };
}
