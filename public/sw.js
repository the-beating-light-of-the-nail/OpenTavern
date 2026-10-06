/**
 * Open Tavern Service Worker —— 离线支持（保守策略，避免缓存陈旧 HTML）：
 * - 页面导航：network-first；失败回退最近缓存；再失败给 /offline.html
 * - 静态资源（/_nuxt 哈希产物、图标、卡片图等）：cache-first + 首次访问后台入缓存
 * - 激活时清理旧版本缓存
 * 版本号改动 = 强制全端刷新缓存（ot-v1 → ot-v2 …）。
 */
const VERSION = 'ot-v1';
const STATIC_CACHE = `ot-static-${VERSION}`;
const PAGES_CACHE = `ot-pages-${VERSION}`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      await cache.addAll([OFFLINE_URL, '/manifest.webmanifest', '/icon-192.png']);
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 页面导航：network-first
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          try {
            const cache = await caches.open(PAGES_CACHE);
            cache.put(req, fresh.clone());
          } catch { /* 响应不可缓存（如重定向）时忽略 */ }
          return fresh;
        } catch {
          const cached = await caches.match(req, { ignoreSearch: true });
          return cached || (await caches.match(OFFLINE_URL)) || Response.error();
        }
      })(),
    );
    return;
  }

  // 静态资源：cache-first
  const isStatic =
    url.pathname.startsWith('/_nuxt/') ||
    url.pathname.startsWith('/cards/') ||
    url.pathname.startsWith('/og/') ||
    /\.(png|jpe?g|webp|avif|svg|ico|css|js|woff2?|ttf|otf|json|webmanifest|txt|xml|html)$/.test(url.pathname);
  if (isStatic) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          if (fresh.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(req, fresh.clone());
          }
          return fresh;
        } catch {
          return Response.error();
        }
      })(),
    );
  }
});
