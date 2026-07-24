// 站点级 SEO 工具：canonical URL 单一来源 + 结构化数据拼装 + hreflang
// SITE_URL 与 nuxt.config 的 site.url 保持一致；换域名时只改这里 + nuxt.config

export const SITE_URL = 'https://open-tavern.vercel.app';
// 全部支持的 locale —— hreflang 必须覆盖所有语言，否则非中英文 locale 的 alternate 链断裂
export const LOCALES = ['en', 'zh-CN', 'zh-TW', 'es', 'ar', 'pt', 'ru', 'fr', 'de'] as const;

/** 规范化站内路径为绝对 URL（用于 canonical / og:url / schema） */
export function absUrl(path = ''): string {
  const p = path || '/';
  return `${SITE_URL}${p.startsWith('/') ? p : `/${p}`}`;
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
