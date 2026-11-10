<script setup lang="ts">
import { useGuides } from '~/data';

/**
 * 教程中心（新版 /guides 列表页）。
 * 旧 /guides 保留 200 承接搜索流量并挂 PageUpgradeBanner 引流到本页；
 * 本页承接侧栏导航与全站内链，把权重集中到新 URL。
 */
definePageMeta({ layout: 'dashboard' });

const { locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');

const guides = useGuides();

/** 三段学习路径：slug 与 data/guides 保持一致，标题/描述走 useGuides 按当前语言取 */
const STAGES = [
  { anchor: 'stage-start', slugs: ['how-to-start-ai-roleplay', 'what-is-a-character-card'] },
  { anchor: 'stage-setup', slugs: ['how-to-get-an-api-key', 'how-to-use-openrouter-for-roleplay', 'sillytavern-vs-web-tavern'] },
  { anchor: 'stage-levelup', slugs: ['tips-for-better-roleplay', 'best-ai-roleplay-prompts'] },
];

function stageGuides(slugs: string[]) {
  return slugs
    .map((slug) => guides.value.find((g) => g.slug === slug))
    .filter((g): g is NonNullable<typeof g> => Boolean(g));
}

const C = {
  'zh-CN': {
    badge: '在线 AI 酒馆 · 免登录',
    h1: 'AI 酒馆新手教程中心',
    subtitle: '从拿到第一把 API Key 到写出第一张角色卡——7 篇教程按学习路径排好，跟着走就能从零开聊。',
    hint: '全部教程免费阅读；操作在浏览器里完成，不用装任何软件。',
    ctaPrimary: '打开在线网页酒馆',
    ctaSecondary: '先看：什么是角色卡',
    trust: '7 篇教程 · 三段学习路径 · 随时回看',
    stages: [
      { title: '阶段一 · 入门：先跑起来', desc: '搞清楚两件事：AI 角色扮演怎么开始、角色卡是什么。读完就能开聊。' },
      { title: '阶段二 · 配置：接上模型', desc: 'API Key 是开聊的唯一门槛：拿到 Key、接好渠道，再决定用哪种酒馆方案。' },
      { title: '阶段三 · 进阶：聊得更好', desc: '提示词与扮演技巧进阶，让对话更有代入感。' },
    ],
    nextTitle: '学完之后',
    nextDesc: '教程解决「会玩」，下面三个入口解决「玩好」：做卡、找卡、直接开聊。',
    next: [
      { title: '工具中心', desc: '五个浏览器工具：角色卡编辑、世界书编写、预设对比、格式转换。', cta: '去工具中心', to: '/toolkit' },
      { title: '角色卡网站导航', desc: '8 个精选角色卡资源站，附「下载之后怎么导入」指引。', cta: '找角色卡', to: '/card-sites' },
      { title: '在线网页酒馆', desc: '免登录直接开聊，聊天记录只存你自己的浏览器。', cta: '立即开聊', to: '/opentavern' },
    ],
    asideQuick: '相关入口',
    asideHere: '本页板块',
    updated: '最后更新：2026-11-10',
    seo: {
      title: 'AI 酒馆新手教程中心：7 篇中文教程 + 三段学习路径 | RoleChat AI',
      description:
        '7 篇 AI 角色扮演教程按入门 / 配置 / 进阶三段学习路径排好：API Key 获取、OpenRouter 配置、角色卡结构与提示词技巧，跟着走即可从零开聊在线 AI 酒馆。',
      ogTitle: 'AI 酒馆新手教程中心 | RoleChat AI',
      ogDescription: '7 篇教程 + 三段学习路径，从零开始玩转在线 AI 酒馆。',
    },
  },
  en: {
    badge: 'Online AI tavern · No login',
    h1: 'AI Tavern Tutorial Center',
    subtitle: 'From your first API key to your first character card — 7 guides arranged into a learning path that takes you from zero to roleplay.',
    hint: 'All guides are free to read; everything happens in your browser, nothing to install.',
    ctaPrimary: 'Open the web tavern',
    ctaSecondary: 'Start with: what is a character card?',
    trust: '7 guides · 3 learning stages · read at your own pace',
    stages: [
      { title: 'Stage 1 · Get started', desc: 'Two questions first: how AI roleplay works and what a character card is. Finish these and you can start chatting.' },
      { title: 'Stage 2 · Set up your model', desc: 'An API key is the only gate: get one, hook it up, then pick the tavern setup that fits you.' },
      { title: 'Stage 3 · Level up', desc: 'Prompting and roleplay techniques for deeper, more immersive conversations.' },
    ],
    nextTitle: 'Where to go next',
    nextDesc: 'The guides get you started — these three hubs keep you going: build cards, find cards, or just chat.',
    next: [
      { title: 'Toolkit', desc: 'Five browser tools: card editor, worldbook forge, preset lab, format converter.', cta: 'Open the toolkit', to: '/toolkit' },
      { title: 'Card site directory', desc: '8 curated character-card sites, with how to import what you download.', cta: 'Find cards', to: '/card-sites' },
      { title: 'Online web tavern', desc: 'No login, chat right away — your logs stay in your own browser.', cta: 'Start chatting', to: '/opentavern' },
    ],
    asideQuick: 'Related',
    asideHere: 'On this page',
    updated: 'Last updated: 2026-11-10',
    seo: {
      title: 'AI Tavern Tutorial Center: 7 Guides + Learning Path | RoleChat AI',
      description:
        '7 AI roleplay guides arranged into a 3-stage learning path: getting started, API key & model setup, then prompting techniques — from zero to your first tavern chat.',
      ogTitle: 'AI Tavern Tutorial Center | RoleChat AI',
      ogDescription: '7 guides + a 3-stage learning path to get started with online AI taverns.',
    },
  },
} as const;

const content = computed(() => (isZh.value ? C['zh-CN'] : C.en));

const canonicalUrl = computed(() =>
  isZh.value ? 'https://www.rolechatai.com/zh-CN/tutorials' : 'https://www.rolechatai.com/tutorials',
);

// 教程清单结构化数据：帮助搜索引擎理解本页聚合的学习路径实体
const itemListJsonLd = computed(() => ({
  type: 'application/ld+json',
  innerHTML: JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: content.value.h1,
    numberOfItems: guides.value.length,
    itemListElement: guides.value.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `https://www.rolechatai.com${localePath(`/guides/${g.slug}`)}`,
      name: g.title,
    })),
  }),
}));

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
    { rel: 'alternate', hreflang: 'en', href: 'https://www.rolechatai.com/tutorials' },
    { rel: 'alternate', hreflang: 'zh-CN', href: 'https://www.rolechatai.com/zh-CN/tutorials' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.rolechatai.com/tutorials' },
  ]),
  script: [itemListJsonLd],
});
</script>

<template>
  <div class="cp-page">
    <PageToolbar :badge="content.badge" :cta-label="content.ctaPrimary" />

    <main class="cp-workspace">
      <!-- 左：相关入口 + 本页板块 -->
      <aside class="cp-panel">
        <div class="cp-panel-head">
          <div>
            <p class="cp-kicker">GUIDES</p>
            <p class="cp-panel-title">{{ content.h1 }}</p>
          </div>
        </div>

        <div class="cp-quick">
          <p class="cp-quick-title">{{ content.asideQuick }}</p>
          <NuxtLink to="/opentavern">
            <span>{{ isZh ? '在线网页酒馆' : 'Online tavern' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/toolkit')">
            <span>{{ isZh ? '工具中心' : 'Toolkit' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/card-sites')">
            <span>{{ isZh ? '卡站导航' : 'Card sites' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/web-tavern')">
            <span>{{ isZh ? '在线本地酒馆' : 'Online local tavern' }}</span><span>→</span>
          </NuxtLink>
        </div>

        <div class="cp-quick">
          <p class="cp-quick-title">{{ content.asideHere }}</p>
          <a href="#stage-start"><span>{{ isZh ? '阶段一 · 入门' : 'Stage 1 · Start' }}</span><span>↓</span></a>
          <a href="#stage-setup"><span>{{ isZh ? '阶段二 · 配置' : 'Stage 2 · Setup' }}</span><span>↓</span></a>
          <a href="#stage-levelup"><span>{{ isZh ? '阶段三 · 进阶' : 'Stage 3 · Level up' }}</span><span>↓</span></a>
          <a href="#next"><span>{{ content.nextTitle }}</span><span>↓</span></a>
        </div>
      </aside>

      <!-- 中：内容橱窗 -->
      <section class="cp-panel">
        <div class="cp-hero">
          <h1>{{ content.h1 }}</h1>
          <p class="cp-subtitle">{{ content.subtitle }}</p>
          <p class="cp-hint">{{ content.hint }}</p>
          <div class="cp-hero-actions">
            <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ content.ctaPrimary }}</NuxtLink>
            <NuxtLink :to="localePath('/guides/what-is-a-character-card')" class="cp-btn">
              {{ content.ctaSecondary }}
            </NuxtLink>
          </div>
          <p class="cp-trust">{{ content.trust }}</p>
        </div>

        <section
          v-for="(stage, i) in STAGES"
          :id="stage.anchor"
          :key="stage.anchor"
          class="cp-section"
        >
          <h2>{{ content.stages[i].title }}</h2>
          <p class="cp-section-desc">{{ content.stages[i].desc }}</p>
          <ol class="cp-guide-list">
            <li v-for="g in stageGuides(stage.slugs)" :key="g.slug">
              <NuxtLink :to="localePath(`/guides/${g.slug}`)">
                <strong>{{ g.title }}</strong>
                <small>{{ g.description }}</small>
              </NuxtLink>
            </li>
          </ol>
        </section>

        <section id="next" class="cp-section">
          <h2>{{ content.nextTitle }}</h2>
          <p class="cp-section-desc">{{ content.nextDesc }}</p>
          <div class="cp-res-grid">
            <div v-for="item in content.next" :key="item.to" class="cp-res-card">
              <strong>{{ item.title }}</strong>
              <small>{{ item.desc }}</small>
              <NuxtLink :to="item.to === '/opentavern' ? item.to : localePath(item.to)" class="cp-res-cta">
                {{ item.cta }} →
              </NuxtLink>
            </div>
          </div>
        </section>

        <p class="cp-updated">{{ content.updated }}</p>
      </section>
    </main>
  </div>
</template>
