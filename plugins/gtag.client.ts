// Google Analytics 4 (gtag.js) —— 仅浏览器端、仅生产环境加载。
// 测量 ID 来自 GA4 后台。覆盖首次加载 + 每次 SPA 路由切换的 page_view 上报。
// 本地 `nuxt dev` 不上报（import.meta.env.PROD 为 false）。

const GA_ID = 'G-9P6PL73E94';

export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.env.PROD) return;

  // 先初始化 dataLayer + gtag，使其在外部脚本加载前就绪（事件可排队）
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]) {
    w.dataLayer!.push(args);
  }
  w.gtag = gtag;

  // 异步加载 gtag.js
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  gtag('js', new Date());
  // 关闭 config 的自动 page_view，改由下面的路由钩子统一上报，避免重复计数
  gtag('config', GA_ID, { send_page_view: false });

  // 首次加载 + 每次 SPA 路由切换都上报一次 page_view
  nuxtApp.hook('page:finish', () => {
    gtag('event', 'page_view', { page_path: window.location.pathname });
  });
});
