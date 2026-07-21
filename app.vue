<template>
  <NuxtPage />
</template>

<script setup lang="ts">
// 站点级 SEO 默认值（所有页面生效；页面内 useSeoMeta 可按需覆盖）
// 解决审计发现的全站缺失项：canonical、OG/Twitter、Organization/WebSite JSON-LD
const route = useRoute();

// 与 nuxt.config 的 site.url 保持一致；换域名时两处一起改
const SITE_URL = 'https://open-tavern.vercel.app';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

// 每个页面的规范链接：去掉 query，避免 ?utm_source= 等参数产生重复页
const canonicalUrl = computed(() => `${SITE_URL}${route.path}`);

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
});

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Open Tavern · RoleChat AI',
  ogUrl: canonicalUrl,
  ogImage: DEFAULT_OG_IMAGE,
  ogImageAlt: 'Open Tavern · RoleChat AI — Private AI Character Roleplay',
  twitterCard: 'summary_large_image',
  twitterImage: DEFAULT_OG_IMAGE,
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
        url: SITE_URL,
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
        url: SITE_URL,
        description:
          'Open Tavern (RoleChat AI) is an easy private AI roleplay platform with original romance and fantasy characters. Bring your own AI key.',
      }),
    },
  ],
});
</script>
