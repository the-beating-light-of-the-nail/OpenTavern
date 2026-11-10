<script setup lang="ts">
import { SITE_TOOLS, KEPT_TOOL_SLUGS } from '~/data/tools';
import { useGuides } from '~/data';
import { breadcrumbSchema } from '~/composables/useSeo';

/**
 * 工具中心（新版 /tools 列表页）。
 * 旧 /tools 保留 200 承接搜索流量并挂 PageUpgradeBanner 引流到本页；
 * 本页承接侧栏导航与全站内链。/tools/<slug> 工具详情页路由不变。
 */
definePageMeta({ layout: 'dashboard' });

const { t, locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');

// 只展示白名单内的站内工具，避免链到已 410 的工具页（白名单在 data/tools.ts 统一维护）
const keptTools = computed(() =>
  SITE_TOOLS.filter((tool) => {
    if (!KEPT_TOOL_SLUGS.has(tool.slug)) return false;
    // /zh-CN/tools/pure-tavern 未保留；中文版不展示，避免死链
    if (locale.value === 'zh-CN' && tool.slug === 'pure-tavern') return false;
    return true;
  }),
);

const guides = useGuides();
const API_GUIDE_SLUGS = ['how-to-get-an-api-key', 'how-to-use-openrouter-for-roleplay'];
const apiGuides = computed(() =>
  API_GUIDE_SLUGS.map((slug) => guides.value.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g)),
);

const C = {
  'zh-CN': {
    badge: '在线 AI 酒馆 · 免登录',
    h1: 'SillyTavern 在线工具箱',
    subtitle: '五个工具全部在浏览器本地运行：文件不上传、免安装，支持 SillyTavern V2/V3 规范的 PNG 与 JSON。',
    hint: '打开即用，做完即走——你的角色卡、世界书和预设始终只存在你自己的设备上。',
    ctaPrimary: '打开在线网页酒馆',
    ctaSecondary: '先看新手教程',
    trust: '本地运行 · 文件不上传 · 免费使用',
    toolsTitle: '五个工具，各管一件事',
    toolsDesc: '从做卡、修卡到转格式——每个工具只有一个核心任务，按需取用。',
    pickTitle: '不知道从哪开始？',
    pickDesc: '按你想做的事对号入座：',
    picks: [
      '要做一张自己的卡 → 用 Card Studio：从模板起步，填人物设定与开场白，导出 PNG 直接能用。',
      '下载的卡打不开或格式报错 → 用 Card Converter：跨平台格式互转，PNG 与 JSON 双向转换。',
      '想给角色加世界观设定 → 用 Worldbook Forge：条目化编写触发词与设定内容。',
      '想对比或整理预设 → 用 Preset Lab：预设字段并排对比、排序与合并。',
    ],
    guidesTitle: '开工前的两篇教程',
    guidesDesc: '工具都就绪了，只差一把 API Key——这两篇按顺序看完即可开聊。',
    updated: '最后更新：2026-11-10',
    seo: {
      title: 'SillyTavern 在线工具箱：角色卡编辑、世界书、预设、格式转换 | RoleChat AI',
      description:
        '五个 SillyTavern 在线工具全部在浏览器本地运行：角色卡编辑器 Card Studio、世界书编写 Worldbook Forge、预设对比 Preset Lab、格式转换 Card Converter，文件不上传、免安装。',
      ogTitle: 'SillyTavern 在线工具箱 | RoleChat AI',
      ogDescription: '角色卡编辑、世界书、预设对比、格式转换——五个工具，浏览器里直接用。',
    },
  },
  en: {
    badge: 'Online AI tavern · No login',
    h1: 'SillyTavern Online Toolkit',
    subtitle: 'Five tools that run entirely in your browser: no uploads, no install, SillyTavern V2/V3 PNG & JSON supported.',
    hint: 'Open, use, leave — your cards, worldbooks and presets never leave your device.',
    ctaPrimary: 'Open the web tavern',
    ctaSecondary: 'Read the beginner guides',
    trust: 'Runs locally · No uploads · Free to use',
    toolsTitle: 'Five tools, one job each',
    toolsDesc: 'Build cards, fix cards, convert formats — each tool does exactly one core job.',
    pickTitle: 'Not sure where to start?',
    pickDesc: 'Match the tool to what you want to do:',
    picks: [
      'Making your own card → Card Studio: start from a template, fill in persona and first message, export a ready-to-use PNG.',
      'A downloaded card fails to open → Card Converter: cross-platform format conversion, PNG ⇄ JSON both ways.',
      'Adding world lore to a character → Worldbook Forge: write keyed lore entries with triggers.',
      'Comparing or cleaning presets → Preset Lab: side-by-side fields, reordering and merging.',
    ],
    guidesTitle: 'Two guides before you start',
    guidesDesc: 'The tools are ready — all you need is an API key. Read these two in order and you can chat.',
    updated: 'Last updated: 2026-11-10',
    seo: {
      title: 'SillyTavern Online Toolkit: Card Editor, Worldbook, Presets & Converter | RoleChat AI',
      description:
        'Five SillyTavern tools that run locally in your browser: Card Studio card editor, Worldbook Forge, Preset Lab and Card Converter — no uploads, nothing to install.',
      ogTitle: 'SillyTavern Online Toolkit | RoleChat AI',
      ogDescription: 'Card editor, worldbook, preset lab and converter — five tools, right in your browser.',
    },
  },
} as const;

const content = computed(() => (isZh.value ? C['zh-CN'] : C.en));

// 右侧「本页板块」目录（原中间栏锚点）
const tocItems = computed(() => [
  { id: 'tools', label: content.value.toolsTitle },
  { id: 'pick', label: content.value.pickTitle },
  { id: 'guides', label: content.value.guidesTitle },
]);

const canonicalUrl = computed(() =>
  isZh.value ? 'https://www.rolechatai.com/zh-CN/toolkit' : 'https://www.rolechatai.com/toolkit',
);

useSeoMeta({
  title: () => content.value.seo.title,
  description: () => content.value.seo.description,
  ogTitle: () => content.value.seo.ogTitle,
  ogDescription: () => content.value.seo.ogDescription,
  ogType: 'website',
  ogUrl: () => canonicalUrl.value,
});

useHead({
  htmlAttrs: { lang: computed(() => (isZh.value ? 'zh-CN' : 'en')) },
  link: computed(() => [
    { rel: 'canonical', key: 'canonical', href: canonicalUrl.value },
    { rel: 'alternate', hreflang: 'en', href: 'https://www.rolechatai.com/toolkit' },
    { rel: 'alternate', hreflang: 'zh-CN', href: 'https://www.rolechatai.com/zh-CN/toolkit' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.rolechatai.com/toolkit' },
  ]),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: isZh.value ? '首页' : 'Home', path: '/' },
          { name: content.value.h1, path: isZh.value ? '/zh-CN/toolkit' : '/toolkit' },
        ]),
      ),
    },
  ],
});
</script>

<template>
  <div class="cp-page">
    <PageToolbar :badge="content.badge" :cta-label="content.ctaPrimary" />

    <main class="cp-workspace">
      <!-- 主内容（原「相关入口」中间栏与左侧全局导航完全重复，已删；板块跳转移至右侧 PageToc） -->
      <section class="cp-panel">
        <div class="cp-hero">
          <h1>{{ content.h1 }}</h1>
          <p class="cp-subtitle">{{ content.subtitle }}</p>
          <p class="cp-hint">{{ content.hint }}</p>
          <div class="cp-hero-actions">
            <NuxtLink :to="localePath('/tools/card-studio')" class="cp-btn cp-btn-primary">
              {{ isZh ? '打开角色卡编辑器' : 'Open Card Studio' }}
            </NuxtLink>
            <NuxtLink :to="localePath('/tutorials')" class="cp-btn">{{ content.ctaSecondary }}</NuxtLink>
          </div>
          <p class="cp-trust">{{ content.trust }}</p>
        </div>

        <!-- 工具网格 -->
        <section id="tools" class="cp-section">
          <h2>{{ content.toolsTitle }}</h2>
          <p class="cp-section-desc">{{ content.toolsDesc }}</p>
          <div class="cp-res-grid">
            <div v-for="tool in keptTools" :key="tool.slug" class="cp-res-card">
              <span class="cp-res-tag">{{ t(tool.copy.tag) }}</span>
              <strong>{{ tool.name }}</strong>
              <small>{{ t(tool.copy.desc) }}</small>
              <NuxtLink :to="localePath(tool.to)" class="cp-res-cta">{{ t(tool.copy.cta) }} →</NuxtLink>
            </div>
          </div>
        </section>

        <!-- 怎么选 -->
        <section id="pick" class="cp-section">
          <h2>{{ content.pickTitle }}</h2>
          <p class="cp-section-desc">{{ content.pickDesc }}</p>
          <div class="cp-res-grid">
            <div v-for="(pick, i) in content.picks" :key="i" class="cp-res-card">
              <span class="cp-res-tag">{{ i + 1 }}</span>
              <small>{{ pick }}</small>
            </div>
          </div>
        </section>

        <!-- API 教程 -->
        <section id="guides" class="cp-section">
          <h2>{{ content.guidesTitle }}</h2>
          <p class="cp-section-desc">{{ content.guidesDesc }}</p>
          <ol class="cp-guide-list">
            <li v-for="g in apiGuides" :key="g.slug">
              <NuxtLink :to="localePath(`/guides/${g.slug}`)">
                <strong>{{ g.title }}</strong>
                <small>{{ g.description }}</small>
              </NuxtLink>
            </li>
          </ol>
        </section>

        <p class="cp-updated">{{ content.updated }}</p>
      </section>

      <!-- 右：本页板块目录（≥1200px 显示） -->
      <PageToc :items="tocItems" />
    </main>
  </div>
</template>
