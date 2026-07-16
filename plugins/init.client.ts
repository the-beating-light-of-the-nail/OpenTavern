import { useAppStore } from '~/stores/app';
import { useLocale } from '~/composables/useLocale';

/**
 * 客户端启动：从存储加载用户数据注入 Pinia store。
 * 仅在 client 执行（存储依赖 OPFS / localStorage / IndexedDB）。
 * 加载完成后从 store.settings.lang 恢复 Nuxt i18n locale，打通 store 与 i18n。
 *
 * 注意：locale 恢复必须延后到 hydration 完成 (app:mounted) 之后，否则在 hydration 前
 * 从预渲染的 en 切到用户保存的 zh，会导致 hydration mismatch；同时包裹 try/catch，
 * 即使 lazy locale chunk 加载失败也不影响 app 启动。
 */
export default defineNuxtPlugin(async (nuxtApp) => {
  const store = useAppStore();
  try {
    await store.load();
  } catch (e) {
    console.error('[init] load state failed:', e);
  } finally {
    store.ready = true;
  }
  const { restore } = useLocale();
  nuxtApp.hook('app:mounted', () => {
    restore().catch((e) => console.error('[init] restore locale failed:', e));
  });
});
