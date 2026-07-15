import { useAppStore } from '~/stores/app';
import { useLocale } from '~/composables/useLocale';

/**
 * 客户端启动：从存储加载用户数据注入 Pinia store。
 * 仅在 client 执行（存储依赖 OPFS / localStorage / IndexedDB）。
 * 加载完成后从 store.settings.lang 恢复 Nuxt i18n locale，打通 store 与 i18n。
 */
export default defineNuxtPlugin(async () => {
  const store = useAppStore();
  try {
    await store.load();
  } catch (e) {
    console.error('[init] load state failed:', e);
  } finally {
    store.ready = true;
  }
  const { restore } = useLocale();
  await restore();
});
