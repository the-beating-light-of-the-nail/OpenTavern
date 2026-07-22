// 站点级 SEO 工具：canonical URL 单一来源 + 结构化数据拼装
// SITE_URL 与 nuxt.config 的 site.url 保持一致；换域名时只改这里 + nuxt.config

export const SITE_URL = 'https://open-tavern.vercel.app';

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
