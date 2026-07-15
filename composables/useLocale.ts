import { useAppStore } from '~/stores/app';
import type { Composer } from 'vue-i18n';

/**
 * 打通 store.settings.lang 与 Nuxt i18n locale。
 * - setLocale(lang): 同步切换 i18n locale、store.settings.lang、持久化、document.documentElement.lang
 * - 启动时由 init.client.ts 调用 restore()，从 store.settings.lang 恢复 Nuxt locale
 * store.settings.lang 同时被 useChat / useSummarization 读取作 prompt 语言提示，现在与 UI locale 终于一致。
 */
const SUPPORTED = ['en', 'zh-CN', 'zh-TW'] as const;
type SupportedLang = (typeof SUPPORTED)[number];

function isSupported(lang: string | undefined | null): lang is SupportedLang {
  return !!lang && (SUPPORTED as readonly string[]).includes(lang);
}

export function useLocale() {
  const store = useAppStore();
  const { locale, setLocale: i18nSetLocale } = useI18n();

  async function setLocale(lang: string) {
    if (!isSupported(lang)) return;
    if (locale.value !== lang) {
      await i18nSetLocale(lang as Composer['locale']['value']);
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
    if (isSupported(saved) && locale.value !== saved) {
      await i18nSetLocale(saved as Composer['locale']['value']);
      document.documentElement.lang = saved;
    }
  }

  return { setLocale, restore, supported: SUPPORTED };
}
