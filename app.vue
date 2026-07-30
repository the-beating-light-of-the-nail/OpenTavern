<template>
  <NuxtPage />
  <CookieConsent />
</template>

<script setup lang="ts">
// 站点级 SEO 默认值（所有页面生效；页面内 useSeoMeta 可按需覆盖）
// 解决审计发现的全站缺失项：canonical、OG/Twitter、Organization/WebSite JSON-LD
import { ACTIVE_AD, ADS } from '~/utils/ads';
// SITE_URL / 绝对 URL 统一来自 composables/useSeo.ts（单一来源）
const canonicalUrl = useCanonicalUrl();
const hreflangLinks = useHreflang();
const ogImage = absUrl('/og-default.png');

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
    ...hreflangLinks.value,
  ],
});

useSeoMeta({
  ogType: 'website',
  ogSiteName: BRAND,
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
        name: BRAND,
        alternateName: BRAND_ALTERNATE_NAMES,
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
        alternateName: BRAND_ALTERNATE_NAMES,
        url: absUrl('/'),
        description:
          'Open Tavern (RoleChat AI) is an easy private AI roleplay platform with original romance and fantasy characters. Bring your own AI key.',
      }),
    },
  ],
});

// ── 广告测试：全站型广告脚本（popunder / social-bar），按 utils/ads.ts 的 ACTIVE_AD 开关注入 ──
// 仅浏览器端执行；prerender 只输出 <script> 标签，不运行外部脚本。
// 换 AdSense 前把 ACTIVE_AD 设为 'none' 即可彻底移除。
if (ACTIVE_AD === 'popunder' || ACTIVE_AD === 'social-bar') {
  const adSrc = ACTIVE_AD === 'popunder' ? ADS.popunder : ADS.socialBar;
  useHead({ script: [{ src: adSrc, async: true, body: true }] });
}
</script>
