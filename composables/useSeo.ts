// 站点级 SEO 工具：canonical URL 单一来源 + 结构化数据拼装 + hreflang
// SITE_URL 与 nuxt.config 的 site.url 保持一致；换域名时只改这里 + nuxt.config

export const SITE_URL = 'https://www.rolechatai.com';
// 收縮后仍保留独立页面的语言。hreflang 不再全站批量输出，只在首页声明 en + zh-CN + x-default。
export const LOCALES = ['en', 'zh-CN', 'zh-TW', 'ar', 'pt', 'fr', 'ja', 'no', 'da'] as const;

// 站点品牌规范名：RoleChat AI 为主品牌；Open Tavern 作为 /opentavern 承接页与 alternateName。
export const BRAND = 'RoleChat AI';

// 品牌 alternateName 列表 —— 注入 WebSite/Organization 结构化数据的 alternateName（数组）。
// 仅放"规范别名 + 高频拼写变体"，用于品牌防守（簇 A）：本项目是开源 fork、竞品众多，
// 覆盖常见拼错避免算法收紧后品牌词掉量。这些是品牌 token，不翻译，所有 locale 共用。
// 注：拼写变体只进结构化数据（alternateName）；可见正文与 alt 文本保持干净，避免 spam 信号。
export const BRAND_ALTERNATE_NAMES = [
  // Open Tavern 族（规范名 + 高频拼错）
  'Open Tavern', 'OpenTavern', 'Open-Tavern', 'Open Tavern AI', 'OpenTavern AI',
  'opentaven', 'opentarvern', 'opentavren', 'open taver',
  // RoleChat 族（规范名 + 高频拼错）
  'RoleChat AI', 'RoleChat', 'rolechat', 'role chat', 'RoleChatAI',
];

/** 规范化站内路径为绝对 URL（用于 canonical / og:url / schema） */
export function absUrl(path = ''): string {
  const p = path || '/';
  return `${SITE_URL}${p.startsWith('/') ? p : `/${p}`}`;
}

/** i18n locale → <html lang> 值（修掉中文页仍输出 lang="en" 的问题） */
export function localeToHtmlLang(locale: string): string {
  const map: Record<string, string> = {
    en: 'en',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    ar: 'ar',
    pt: 'pt',
    fr: 'fr',
    ja: 'ja',
    no: 'nb',
    da: 'da',
  };
  return map[locale] || 'en';
}

/** 当前路由的规范绝对 URL（去掉 query，避免 ?utm_source= 等参数产生重复页） */
export function useCanonicalUrl() {
  const route = useRoute();
  return computed(() => absUrl(route.path));
}

/** 生成 hreflang 标签（用于 <head>），帮助搜索引擎理解多语言页面关系 */
export function useHreflang() {
  const route = useRoute();
  return computed(() => {
    // 去掉 locale 前缀，得到基础路径
    const fullPath = route.fullPath.replace(/\?.*$/, '');
    let basePath = fullPath;
    for (const loc of LOCALES) {
      const prefix = `/${loc}`;
      if (fullPath === prefix) { basePath = '/'; break; }
      if (fullPath.startsWith(`${prefix}/`)) { basePath = fullPath.slice(prefix.length); break; }
    }
    // 补全斜杠
    if (!basePath.startsWith('/')) basePath = `/${basePath}`;

    const links: { rel: string; hreflang: string; href: string }[] = LOCALES.map((loc) => {
      const url = loc === 'en' ? absUrl(basePath) : absUrl(`/${loc}${basePath === '/' ? '' : basePath}`);
      return { rel: 'alternate', hreflang: loc, href: url };
    });
    links.push({ rel: 'alternate', hreflang: 'x-default', href: absUrl(basePath) });
    return links;
  });
}

/** 面包屑结构化数据：items = [{ name, path }]，自动转绝对 URL */
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absUrl(it.path),
    })),
  };
}
