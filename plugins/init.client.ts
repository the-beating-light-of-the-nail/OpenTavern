import { useAppStore } from '~/stores/app';

/**
 * 客户端启动：从存储加载用户数据注入 Pinia store。
 * 仅在 client 执行（存储依赖 OPFS / localStorage / IndexedDB）。
 *
 * 语言策略：
 * - 营销页（/、/zh-CN、保留的收录页）以 URL 为准，不能再被本地保存的 settings.lang 覆盖；
 * - /opentavern 在页面内恢复用户保存的 UI 语言（不改变 URL）。
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
});
