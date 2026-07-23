import { useAppStore } from '~/stores/app';

/**
 * 打通 store.settings.lang 与 Nuxt i18n locale。
 * - setLocale(lang): 同步切换 i18n locale、store.settings.lang、持久化、document.documentElement.lang
 * - 启动时由 init.client.ts 调用 restore()，从 store.settings.lang 恢复 Nuxt locale
 * - detectAndSet(): 首次访问时根据浏览器 navigator.language 自动检测用户地区，设置默认语言
 * store.settings.lang 同时被 useChat / useSummarization 读取作 prompt 语言提示，现在与 UI locale 终于一致。
 *
 * 注意：不能用 useI18n()。它依赖组件实例 (getCurrentInstance())，而 init.client.ts 是
 * Nuxt 插件、运行时无组件实例，调用会抛 vue-i18n 错误码 26 (MUST_BE_CALL_SETUP_TOP) ——
 * 生产构建表现为 SyntaxError: 26。改用 useNuxtApp().$i18n，插件与 setup 两种上下文均可用，
 * 且 $i18n.setLocale 是 @nuxtjs/i18n 扩展过的异步方法（处理 lazy locale 加载）。
 */
const SUPPORTED = ['en', 'zh-CN', 'zh-TW'] as const;
type SupportedLang = (typeof SUPPORTED)[number];

function isSupported(lang: string | undefined | null): lang is SupportedLang {
  return !!lang && (SUPPORTED as readonly string[]).includes(lang);
}

/**
 * 将浏览器 navigator.language 映射到支持的语言。
 * navigator.language 示例: "zh-CN", "zh", "zh-TW", "zh-HK", "en-US", "ja", ...
 */
function mapBrowserLang(raw: string): SupportedLang {
  const lang = (raw || '').toLowerCase();
  if (lang.startsWith('zh')) {
    // 繁体地区 → zh-TW
    if (/\b(tw|hk|mo|hant)\b/i.test(lang)) return 'zh-TW';
    // 其他中文（含简体、新加坡、通用 zh）→ zh-CN
    return 'zh-CN';
  }
  return 'en';
}

/** 检查是否有已保存的用户语言偏好（排除默认值 'en'） */
function hasSavedPreference(): boolean {
  try {
    // 先检查 localStorage 是否有之前保存过的数据
    const raw = localStorage.getItem('opentavern-data');
    if (!raw) return false;
    const data = JSON.parse(raw);
    return !!(data?.settings?.lang);
  } catch {
    return false;
  }
}

export function useLocale() {
  const store = useAppStore();
  const { $i18n } = useNuxtApp();

  async function setLocale(lang: string) {
    if (!isSupported(lang)) return;
    if ($i18n.locale.value !== lang) {
      await $i18n.setLocale(lang);
    }
    store.settings.lang = lang;
    store.persist(true);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }

  /** 启动时从 store.settings.lang 恢复 Nuxt i18n locale（仅在 client） */
  async function restore() {
    if (typeof document === 'undefined') return;
    const saved = store.settings.lang;
    if (isSupported(saved) && $i18n.locale.value !== saved) {
      await $i18n.setLocale(saved);
      document.documentElement.lang = saved;
    }
  }

  /** 根据浏览器语言自动检测并设置默认语言（仅在首次访问、无已有偏好时生效） */
  async function detectAndSet() {
    if (typeof navigator === 'undefined') return;
    // 如果用户已有明确偏好，不覆盖
    if (hasSavedPreference()) return;
    const detected = mapBrowserLang(navigator.language);
    if (detected === 'en') return; // 默认已是 en，无需设置
    await setLocale(detected);
  }

  return { setLocale, restore, detectAndSet, supported: SUPPORTED };
}
