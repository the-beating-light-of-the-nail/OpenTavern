/**
 * 源站复刻工具页（Style Generator / Card Doctor / Preset Tutor / Abstract Content /
 * Quick Reply Generator）的 i18n 片段加载。
 * 片段独立于 locales/*.json，运行时合并进 vue-i18n；其余语言由 fallbackLocale:'en' 兜底。
 */
import fragment from '~/i18n/fragments/tool-pages.json';

type I18nLike = { mergeLocaleMessage?: (locale: string, message: Record<string, unknown>) => void };

/** 幂等；SSR 与客户端都可安全调用。切换语言后 lazy loader 会整体替换消息，需重新合并。 */
export function mergeToolPagesI18n(i18n: unknown): void {
  const composer = i18n as I18nLike | null;
  if (!composer || typeof composer.mergeLocaleMessage !== 'function') return;
  const merge = composer.mergeLocaleMessage.bind(composer);
  for (const [locale, messages] of Object.entries(fragment)) {
    merge(locale, messages as Record<string, unknown>);
  }
}
