<script setup lang="ts">
import { breadcrumbSchema } from '~/composables/useSeo';

/**
 * 在线本地酒馆方案页（顶替原「云酒馆」导航槽）。
 * 概念：在线（网页即开即聊）+ 本地（聊天记录只存浏览器）——OpenTavern 为主推方案。
 * 第三方云酒馆榜单等服务就绪后再上线，本页先以方案对比承接「云酒馆」搜索意图。
 * 旧 /cloud-taverns 原为临时 302 桩（无收录价值），服务端改 302 到本页。
 */
definePageMeta({ layout: 'dashboard' });

const { locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');

/** 三方案卡片：highlight/to 仅「在线本地酒馆」条目携带 */
interface TavernWay {
  title: string;
  tag: string;
  desc: string;
  highlight?: boolean;
  to?: string;
}

interface TavernContent {
  badge: string;
  h1: string;
  subtitle: string;
  hint: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trust: string;
  waysTitle: string;
  waysDesc: string;
  ways: TavernWay[];
  whyTitle: string;
  why: { title: string; desc: string }[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaDesc: string;
  ctaPrimary2: string;
  ctaSecondary2: string;
  asideQuick: string;
  asideHere: string;
  updated: string;
  seo: { title: string; description: string; ogTitle: string; ogDescription: string };
}

const C: Record<'zh-CN' | 'en', TavernContent> = {
  'zh-CN': {
    badge: '在线本地酒馆 · 免安装',
    h1: '什么是在线本地酒馆？',
    subtitle:
      '在线本地酒馆 = 打开网页就能聊（在线）+ 聊天记录只存在你自己的浏览器（本地）。零安装、零配置、免登录——OpenTavern 就是这样的方案。',
    hint: '不用租服务器，也不用装 Node.js；换台电脑，带上导出的聊天文件就能继续。',
    ctaPrimary: '打开 OpenTavern 在线酒馆',
    ctaSecondary: '看部署对比教程',
    trust: '免安装 · 免登录 · 数据不离开浏览器 · 自带 API Key',
    waysTitle: '三种拥有酒馆的方式',
    waysDesc: '本地安装、云酒馆、在线本地酒馆各有取舍，按你愿意折腾的程度选：',
    ways: [
      {
        title: '本地安装 SillyTavern',
        tag: '自由度最高',
        desc: '在自己的电脑安装 SillyTavern：插件生态最全、完全免费，但要装运行环境、跟命令行打交道，换设备还要重新同步数据。',
      },
      {
        title: '云酒馆',
        tag: '整理中',
        desc: '在云主机自部署或用第三方托管，任何设备的浏览器都能访问。第三方云酒馆逐家实测榜单整理中，上线时会标注最后验证日期。',
      },
      {
        title: '在线本地酒馆（OpenTavern）',
        tag: '推荐',
        desc: '打开网页接入 API 即可开聊，聊天记录只存浏览器本地——零安装、零配置、免登录，这就是本站的主推方案。',
        highlight: true,
        to: '/opentavern',
      },
    ],
    whyTitle: '为什么坚持「数据存本地」',
    why: [
      { title: '隐私', desc: '聊天记录不上传服务器，不用于模型训练。' },
      { title: '便携', desc: '重要对话一键导出 JSON 文件，换设备随身带。' },
      { title: '安全', desc: 'API Key 只填在你自己的浏览器，不经第三方转手。' },
      { title: '可控', desc: '清空浏览器数据即彻底删除——删除就是真的删除。' },
    ],
    faqTitle: '常见问题',
    faq: [
      {
        q: '数据存在浏览器里，清了缓存会不会丢？',
        a: '会。重要对话请用「导出」按钮备份成 JSON 文件，需要时再导入恢复。',
      },
      {
        q: '和 SillyTavern 的角色卡、世界书通用吗？',
        a: '通用。支持 SillyTavern V2/V3 规范的 PNG 与 JSON，直接导入即可。',
      },
      {
        q: '以后会出云酒馆榜单或自托管方案吗？',
        a: '会。第三方云酒馆逐家实测榜单在整理中；想自己搭服务器的，可以先看部署对比教程。',
      },
    ],
    ctaTitle: '现在就试试',
    ctaDesc: '打开网页、填上 API Key，三十秒内开始你的第一段对话。',
    ctaPrimary2: '打开在线网页酒馆',
    ctaSecondary2: '先看新手教程',
    asideQuick: '相关入口',
    asideHere: '本页板块',
    updated: '最后更新：2026-11-10',
    seo: {
      title: '在线本地酒馆：免安装的网页 AI 酒馆方案 | RoleChat AI',
      description:
        '在线本地酒馆 = 网页即开即聊 + 聊天记录只存浏览器。对比本地安装 SillyTavern、云酒馆与在线本地酒馆三种方案；OpenTavern 免安装免登录，自带 API Key 即用。',
      ogTitle: '在线本地酒馆：免安装的网页 AI 酒馆 | RoleChat AI',
      ogDescription: '三种酒馆方案对比：本地安装、云酒馆、在线本地酒馆——OpenTavern 打开即聊。',
    },
  },
  en: {
    badge: 'Online local tavern · No install',
    h1: 'What is an online local tavern?',
    subtitle:
      'An online local tavern = open a web page and chat (online) + your chat logs stay in your own browser (local). No install, no setup, no login — OpenTavern is exactly that.',
    hint: 'No server to rent, no Node.js to install; move devices by carrying your exported chat files.',
    ctaPrimary: 'Open the OpenTavern tavern',
    ctaSecondary: 'Read the deployment comparison',
    trust: 'No install · No login · Data never leaves your browser · Bring your own API key',
    waysTitle: 'Three ways to own a tavern',
    waysDesc: 'Local install, cloud tavern, or online local tavern — pick by how much you want to tinker:',
    ways: [
      {
        title: 'Install SillyTavern locally',
        tag: 'Most flexible',
        desc: 'Install SillyTavern on your own machine: the richest plugin ecosystem and completely free, but you need runtime setup, command lines, and re-syncing when you switch devices.',
      },
      {
        title: 'Cloud tavern',
        tag: 'In review',
        desc: 'Self-deploy on a VPS or use a hosted service, reachable from any browser. Our hands-on review of third-party cloud taverns is in progress and will carry a verified date.',
      },
      {
        title: 'Online local tavern (OpenTavern)',
        tag: 'Recommended',
        desc: 'Open a page, plug in an API key and chat — logs stay in your browser. Zero install, zero config, no login. This is what this site is built on.',
        highlight: true,
        to: '/opentavern',
      },
    ],
    whyTitle: 'Why keep data local',
    why: [
      { title: 'Privacy', desc: 'Chat logs are never uploaded to a server or used for training.' },
      { title: 'Portability', desc: 'Export important chats to a JSON file and carry them across devices.' },
      { title: 'Security', desc: 'Your API key lives only in your own browser, never routed through third parties.' },
      { title: 'Control', desc: 'Clearing browser data truly deletes everything — deletion means deletion.' },
    ],
    faqTitle: 'FAQ',
    faq: [
      {
        q: 'If data lives in my browser, will clearing the cache wipe it?',
        a: 'Yes. Use the export button to back up important chats as JSON files, and re-import when needed.',
      },
      {
        q: 'Are SillyTavern cards and worldbooks compatible?',
        a: 'Yes. SillyTavern V2/V3 PNG and JSON files import directly.',
      },
      {
        q: 'Will there be a cloud tavern ranking or self-hosting option?',
        a: 'Yes — a hands-on review of third-party cloud taverns is in progress; if you want your own server, start with the deployment comparison guide.',
      },
    ],
    ctaTitle: 'Try it now',
    ctaDesc: 'Open the page, add an API key, and start your first conversation in thirty seconds.',
    ctaPrimary2: 'Open the online web tavern',
    ctaSecondary2: 'Read the beginner guides',
    asideQuick: 'Related',
    asideHere: 'On this page',
    updated: 'Last updated: 2026-11-10',
    seo: {
      title: 'Online Local Tavern: The No-Install Web AI Tavern | RoleChat AI',
      description:
        'An online local tavern chats in the web page while keeping logs in your own browser. Compare three setups — installing SillyTavern, cloud taverns, and the online local tavern; OpenTavern needs no install or login.',
      ogTitle: 'Online Local Tavern: The No-Install Web AI Tavern | RoleChat AI',
      ogDescription: 'Three tavern setups compared — local install, cloud, and online local tavern.',
    },
  },
};

const content = computed(() => (isZh.value ? C['zh-CN'] : C.en));

const canonicalUrl = computed(() =>
  isZh.value ? 'https://www.rolechatai.com/zh-CN/web-tavern' : 'https://www.rolechatai.com/web-tavern',
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
    { rel: 'alternate', hreflang: 'en', href: 'https://www.rolechatai.com/web-tavern' },
    { rel: 'alternate', hreflang: 'zh-CN', href: 'https://www.rolechatai.com/zh-CN/web-tavern' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.rolechatai.com/web-tavern' },
  ]),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: isZh.value ? '首页' : 'Home', path: '/' },
          { name: isZh.value ? '在线本地酒馆' : 'Online local tavern', path: isZh.value ? '/zh-CN/web-tavern' : '/web-tavern' },
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
      <!-- 左：相关入口 + 本页板块 -->
      <aside class="cp-panel">
        <div class="cp-panel-head">
          <div>
            <p class="cp-kicker">WEB TAVERN</p>
            <p class="cp-panel-title">{{ isZh ? '在线本地酒馆' : 'Online local tavern' }}</p>
          </div>
        </div>

        <div class="cp-quick">
          <p class="cp-quick-title">{{ content.asideQuick }}</p>
          <NuxtLink to="/opentavern">
            <span>{{ isZh ? '在线网页酒馆' : 'Online tavern' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/tutorials')">
            <span>{{ isZh ? '教程中心' : 'Tutorials' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/toolkit')">
            <span>{{ isZh ? '工具中心' : 'Toolkit' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/card-sites')">
            <span>{{ isZh ? '卡站导航' : 'Card sites' }}</span><span>→</span>
          </NuxtLink>
        </div>

        <div class="cp-quick">
          <p class="cp-quick-title">{{ content.asideHere }}</p>
          <a href="#ways"><span>{{ content.waysTitle }}</span><span>↓</span></a>
          <a href="#why"><span>{{ content.whyTitle }}</span><span>↓</span></a>
          <a href="#faq"><span>{{ content.faqTitle }}</span><span>↓</span></a>
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
            <NuxtLink :to="localePath('/guides/sillytavern-vs-web-tavern')" class="cp-btn">
              {{ content.ctaSecondary }}
            </NuxtLink>
          </div>
          <p class="cp-trust">{{ content.trust }}</p>
        </div>

        <!-- 三方案对比 -->
        <section id="ways" class="cp-section">
          <h2>{{ content.waysTitle }}</h2>
          <p class="cp-section-desc">{{ content.waysDesc }}</p>
          <div class="cp-cloud-grid">
            <div
              v-for="way in content.ways"
              :key="way.title"
              class="cp-cloud-card"
              :class="{ 'is-highlight': way.highlight }"
            >
              <span class="cp-res-tag">{{ way.tag }}</span>
              <strong>{{ way.title }}</strong>
              <small>{{ way.desc }}</small>
              <NuxtLink v-if="way.highlight" to="/opentavern" class="cp-res-cta">
                {{ content.ctaPrimary }} →
              </NuxtLink>
            </div>
          </div>
        </section>

        <!-- 为什么数据存本地 -->
        <section id="why" class="cp-section">
          <h2>{{ content.whyTitle }}</h2>
          <ul class="cp-criteria">
            <li v-for="item in content.why" :key="item.title">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </li>
          </ul>
        </section>

        <!-- FAQ -->
        <section id="faq" class="cp-section">
          <h2>{{ content.faqTitle }}</h2>
          <div class="cp-res-grid">
            <div v-for="item in content.faq" :key="item.q" class="cp-res-card">
              <strong>{{ item.q }}</strong>
              <small>{{ item.a }}</small>
            </div>
          </div>
        </section>

        <!-- 尾部 CTA -->
        <section class="cp-section">
          <h2>{{ content.ctaTitle }}</h2>
          <p class="cp-section-desc">{{ content.ctaDesc }}</p>
          <div class="cp-hero-actions" style="justify-content: flex-start">
            <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ content.ctaPrimary2 }}</NuxtLink>
            <NuxtLink :to="localePath('/tutorials')" class="cp-btn">{{ content.ctaSecondary2 }}</NuxtLink>
          </div>
        </section>

        <p class="cp-updated">{{ content.updated }}</p>
      </section>
    </main>
  </div>
</template>
