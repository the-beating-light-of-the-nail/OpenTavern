/**
 * 收录边界守卫。
 *
 * 2026-11 收缩策略：只保留 Google 已收录的页面 + 新首页 + /opentavern；
 * 其余旧路由统一 410 Gone，让 Google 尽快移除 1,259 个未收录页面。
 * 旧 app 入口与已收录的本地化 app 页 301 到 /opentavern（功能重复）。
 */
const REDIRECTS_301: Record<string, string> = {
  '/app': '/opentavern',
  '/fr/app': '/opentavern',
  '/no/app': '/opentavern',
  '/zh-CN/app': '/opentavern',
  '/zh-TW/app': '/opentavern',
  '/ja/app': '/opentavern',
  '/da/app': '/opentavern',
  '/ar/app': '/opentavern',
  '/pt/app': '/opentavern',
};

// 新首页规划中的栏目 URL：栏目页建好前临时 302 到最接近的现有页面，
// 避免首页内链直接打到 404；栏目页上线后删掉对应条目即可。
// 2026-11-10：/card-sites 升级为新版卡站导航页（302 条目移除）；
// /cloud-taverns 槽位升级为 /web-tavern 在线本地酒馆方案页（302 目标更新）。
const REDIRECTS_302: Record<string, string> = {
  '/ai-chat': '/opentavern',
  '/cloud-taverns': '/web-tavern',
  '/wiki': '/guides',
  '/wiki/local-deploy': '/guides/sillytavern-vs-web-tavern',
  '/wiki/glossary': '/guides',
};

const ALLOW_EXACT = new Set([
  '/',
  '/zh-CN',
  '/opentavern',
  '/guides',
  '/zh-CN/guides',
  '/contact',
  '/zh-CN/contact',
  '/about',
  '/zh-CN/about',
  '/privacy',
  '/zh-CN/privacy',
  '/terms',
  '/zh-CN/terms',
  '/where-to-find-character-cards',
  '/zh-CN/where-to-find-character-cards',
  // 新版列表页（承接导航与内链；与 nuxt.config prerender、public/sitemap.xml 四处同步）
  '/tutorials',
  '/zh-CN/tutorials',
  '/toolkit',
  '/zh-CN/toolkit',
  '/card-sites',
  '/zh-CN/card-sites',
  '/web-tavern',
  '/zh-CN/web-tavern',
  // 酒馆插件合辑页（与 nuxt.config prerender、public/sitemap.xml 四处同步）
  '/sillytavern-plugins',
  '/zh-CN/sillytavern-plugins',
  '/characters',
  '/characters/the-dragon-prince',
  // 新收录 3 张热门卡 + zh-CN 角色卡列表页（首页六板块橱窗链接；与 nuxt.config prerender、public/sitemap.xml 同步）
  '/characters/cold-doctor-boyfriend',
  '/characters/the-brooding-vampire-lord',
  '/characters/the-mafia-boss',
  '/zh-CN/characters',
  '/zh-CN/characters/cold-doctor-boyfriend',
  '/zh-CN/characters/the-brooding-vampire-lord',
  '/zh-CN/characters/the-mafia-boss',
  '/ja/characters/the-sharp-tongued-detective',
  '/da/characters/the-time-traveler',
  '/no/characters/the-witchs-familiar',
  '/ar/characters/the-protective-bodyguard',
  '/tools',
  '/zh-CN/tools',
  '/tools/card-studio',
  '/tools/worldbook-forge',
  '/tools/preset-lab',
  '/tools/card-converter',
  '/tools/pure-tavern',
  '/zh-CN/tools/card-studio',
  '/zh-CN/tools/worldbook-forge',
  '/zh-CN/tools/preset-lab',
  '/zh-CN/tools/card-converter',
  '/da/tools/pure-tavern',
  '/pt/tools/card-studio',
  '/sitemap.xml',
  '/robots.txt',
  '/manifest.webmanifest',
  '/sw.js',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-512-maskable.png',
  '/og-default.png',
  '/offline.html',
  '/BingSiteAuth.xml',
  '/google65a51ba1c815e67e.html',
]);

const ALLOW_PREFIXES = [
  '/guides/',
  '/zh-CN/guides/',
  '/_nuxt/',
  '/_ipx/',
  '/__nuxt',
  '/__sitemap__/',
  '/cards/',
  '/og/',
  '/sites/',
  '/fonts/',
  '/images/',
  '/ad-',
];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1);
  return pathname;
}

export default defineEventHandler((event) => {
  const path = normalizePath(getRequestURL(event).pathname);

  const redirect301 = REDIRECTS_301[path];
  if (redirect301) {
    const search = getRequestURL(event).search;
    return sendRedirect(event, `${redirect301}${search}`, 301);
  }

  const redirect302 = REDIRECTS_302[path];
  if (redirect302) {
    const search = getRequestURL(event).search;
    return sendRedirect(event, `${redirect302}${search}`, 302);
  }

  if (ALLOW_EXACT.has(path)) return;
  if (ALLOW_PREFIXES.some((prefix) => path.startsWith(prefix))) return;

  // Nuxt 客户端路由会请求各页面的 _payload.json；payload 本身不是可索引页面。
  if (path === '/_payload.json' || path.endsWith('/_payload.json')) return;

  setResponseStatus(event, 410);
  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>页面已下线</title></head><body style="font-family:system-ui,sans-serif;max-width:640px;margin:15vh auto;padding:0 24px;color:#333"><h1>410 — 页面已下线</h1><p>该页面已从本站移除。请访问新的首页继续浏览。</p><p><a href="/">返回首页</a> · <a href="/zh-CN">中文首页</a></p></body></html>`;
});
