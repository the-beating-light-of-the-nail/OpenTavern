import { useAppStore } from '~/stores/app';

/**
 * 客户端启动：从存储加载用户数据注入 Pinia store。
 * 仅在 client 执行（存储依赖 OPFS / localStorage / IndexedDB）。
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
});
