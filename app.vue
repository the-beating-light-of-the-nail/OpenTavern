<template>
  <NuxtPage />
</template>

<script setup lang="ts">
// 站点级 SEO 默认值（所有页面生效；页面内 useSeoMeta 可按需覆盖）
// 解决审计发现的全站缺失项：canonical、OG/Twitter、Organization/WebSite JSON-LD
// SITE_URL / 绝对 URL 统一来自 composables/useSeo.ts（单一来源）
const canonicalUrl = useCanonicalUrl();
const ogImage = absUrl('/og-default.png');

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
});

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Open Tavern · RoleChat AI',
  ogUrl: canonicalUrl,
  ogImage,
  ogImageAlt: 'Open Tavern · RoleChat AI — Private AI Character Roleplay',
  twitterCard: 'summary_large_image',
  twitterImage: ogImage,
});

// 站点级结构化数据：WebSite + Organization（全站唯一，注入一次）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Open Tavern · RoleChat AI',
        alternateName: 'RoleChat AI',
        url: absUrl('/'),
        inLanguage: 'en',
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Open Tavern',
        alternateName: 'RoleChat AI',
        url: absUrl('/'),
        description:
          'Open Tavern (RoleChat AI) is an easy private AI roleplay platform with original romance and fantasy characters. Bring your own AI key.',
      }),
    },
  ],
});
</script>
