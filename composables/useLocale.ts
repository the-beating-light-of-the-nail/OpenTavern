import { useAppStore } from '~/stores/app';

/**
 * 打通 store.settings.lang 与 Nuxt i18n locale。
 * - setLocale(lang): 同步切换 i18n locale、store.settings.lang、持久化、document.documentElement.lang
 * - 启动时由 init.client.ts 调用 restore()，从 store.settings.lang 恢复 Nuxt locale
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

  return { setLocale, restore, supported: SUPPORTED };
}
