<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <CookieConsent />
</template>

<script setup lang="ts">
// 站点级 SEO 默认值（所有页面生效；页面内 useSeoMeta 可按需覆盖）
// 解决审计发现的全站缺失项：canonical、OG/Twitter、Organization/WebSite JSON-LD
import { mergeAiToolkitI18n } from '~/utils/st/regex-script';
import { mergeToolPagesI18n } from '~/utils/tool-pages-i18n';

// at_* / 复刻工具页文案片段全局合并（首页宫格与 /tools 也会用到卡片文案）
const i18n = useI18n();
mergeAiToolkitI18n(i18n);
mergeToolPagesI18n(i18n);
watch(() => i18n.locale.value, () => {
  mergeAiToolkitI18n(i18n);
  mergeToolPagesI18n(i18n);
});

// 主题 / 效能模式全局应用（含营销页；system 跟随 prefers-color-scheme）
const { watch: watchTheme } = useTheme();
onMounted(() => watchTheme());
// SITE_URL / 绝对 URL 统一来自 composables/useSeo.ts（单一来源）
const canonicalUrl = useCanonicalUrl();
const ogImage = absUrl('/og-default.png');
const { locale } = useI18n();
const route = useRoute();

useHead({
  htmlAttrs: { lang: computed(() => localeToHtmlLang(locale.value)) },
  link: [
    { rel: 'canonical', key: 'canonical', href: canonicalUrl },
  ],
});

// 首屏主题兜底：在 body 开始处读取缓存，避免等待 store 加载时闪一下暗色
useHead({
  script: [
    {
      key: 'theme-init',
      tagPosition: 'bodyOpen',
      innerHTML:
        "(function(){try{var m=localStorage.getItem('opentavern-ui-theme')||'system';" +
        "var r=m==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'new-dark':'new-light'):m;" +
        "if(r!=='new-light'&&r!=='new-dark'&&r!=='classic')r='new-light';" +
        "document.body.classList.add('theme-'+r);" +
        "var meta=document.querySelector('meta[name=theme-color]');" +
        "if(meta)meta.setAttribute('content',r==='new-light'?'#f7f7f7':(r==='classic'?'#0a0908':'#121212'));" +
        "}catch(e){}})();",
    },
  ],
});

useSeoMeta({
  ogType: 'website',
  ogSiteName: BRAND,
  ogUrl: canonicalUrl,
  ogImage,
  ogImageAlt: 'RoleChat AI — private AI character roleplay in your browser',
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
        name: BRAND,
        alternateName: BRAND_ALTERNATE_NAMES,
        url: absUrl('/'),
        description:
          'RoleChat AI (also known as Open Tavern) is a private AI roleplay platform with original romance and fantasy characters. Bring your own AI key.',
      }),
    },
  ],
});

// PWA：注册 service worker（离线支持；不可用时静默降级，不影响站点）
onMounted(() => {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => { /* 注册失败不影响正常浏览 */ });
});
</script>
