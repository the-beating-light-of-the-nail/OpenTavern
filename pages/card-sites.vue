<script setup lang="ts">
import { breadcrumbSchema } from '~/composables/useSeo';

/**
 * 角色卡网站导航（新版卡站清单页，回收原 302 别名 /card-sites）。
 * 旧 /where-to-find-character-cards 保留 200 承接搜索流量并挂
 * PageUpgradeBanner 引流到本页；站内导航与首页内链改指本页。
 * 站内方针：卡站不做外链（name 保留英文专有名词，desc 复用 wfc_res_* 既有 i18n 键）。
 */
definePageMeta({ layout: 'dashboard' });

const { t, locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');

/** 与旧 /where-to-find-character-cards 相同的三组站点；descKey 复用全局 wfc_res_* 键（25 语言已有翻译） */
const GROUPS = [
  {
    key: 'collections',
    sites: [
      { name: 'Chatbots Webring', descKey: 'wfc_res_chatbots_webring_desc', noteZh: '合集', noteEn: 'Collection hub' },
      { name: 'AICharacterCards.com', descKey: 'wfc_res_aicharactercards_desc', noteZh: '角色卡 + 指南', noteEn: 'Cards + guides' },
      { name: 'Character Tavern', descKey: 'wfc_res_character_tavern_desc', noteZh: '社区合集', noteEn: 'Community hub' },
      { name: 'realm.risuai.net', descKey: 'wfc_res_risuai_desc', noteZh: 'RisuAI', noteEn: 'RisuAI' },
      { name: 'Janny AI', descKey: 'wfc_res_janny_ai_desc', noteZh: 'Janitor AI', noteEn: 'Janitor AI' },
    ],
  },
  {
    key: 'lorebooks',
    sites: [
      { name: 'BotBooru', descKey: 'wfc_res_botbooru_desc', noteZh: '角色卡 + 世界书', noteEn: 'Cards + lorebooks' },
      { name: 'DataCat', descKey: 'wfc_res_datacat_desc', noteZh: '归档', noteEn: 'Archive' },
    ],
  },
  {
    key: 'individual',
    sites: [
      { name: 'Wyvern.chat', descKey: 'wfc_res_wyvern_chat_desc', noteZh: '独立站', noteEn: 'Indie site' },
    ],
  },
];

const C = {
  'zh-CN': {
    badge: '在线 AI 酒馆 · 免登录',
    h1: '角色卡网站导航',
    subtitle: '精选 8 个角色卡资源站：跨平台合集、社区归档与独立作者站都在这里，附「下载之后怎么导入」指引。',
    hint: '清单人工复核、定期更新；下载前请确认站点条款与作者许可。',
    ctaPrimary: '打开在线网页酒馆',
    ctaSecondary: '先看：什么是角色卡',
    trust: '8 个站点 · 三类分组 · 人工复核',
    groups: [
      { title: '角色卡合集网站', desc: '站多卡多、更新频繁，适合先逛一圈找到喜欢的类型。' },
      { title: '角色卡 + 世界书站', desc: '角色卡与设定集（lorebook）一起拿，适合想搬运完整世界观的玩家。' },
      { title: '独立作者站', desc: '单作者精挑细选，数量不多但质量稳定。' },
    ],
    howTitle: '下载之后：怎么导入使用？',
    howDesc: '三步把下载的卡变成能聊的角色：',
    how: [
      { title: '用 Card Studio 打开', desc: '下载的 PNG / JSON 卡在浏览器里直接查看、编辑元数据，不用装任何软件。', cta: '打开 Card Studio', to: '/tools/card-studio' },
      { title: '看懂角色卡结构', desc: '什么是角色卡、V2 / V3 规范差在哪，一篇教程讲清楚。', cta: '阅读教程', to: '/guides/what-is-a-character-card' },
      { title: '导入酒馆开聊', desc: '把卡带进在线酒馆直接开聊，聊天记录只存你自己的浏览器。', cta: '立即开聊', to: '/opentavern' },
    ],
    note: '站点信息人工复核，仅供导航参考；下载前请确认各站点条款与作者许可。本站与上述站点无关联。',
    asideQuick: '相关入口',
    asideHere: '本页板块',
    updated: '最后更新：2026-11-10',
    seo: {
      title: '角色卡网站导航：8 个精选角色卡资源站 + 导入指引 | RoleChat AI',
      description:
        '精选 8 个 AI 角色卡资源站：Chatbots Webring、AICharacterCards、Character Tavern、RisuAI、JanitorAI 生态等合集与独立站分组导航，附 PNG / JSON 角色卡下载后的导入使用指引。',
      ogTitle: '角色卡网站导航 | RoleChat AI',
      ogDescription: '8 个精选角色卡资源站分组导航，附下载导入指引。',
    },
  },
  en: {
    badge: 'Online AI tavern · No login',
    h1: 'Character Card Site Directory',
    subtitle: '8 curated character-card sites — cross-platform collections, community archives and indie authors, plus how to import what you download.',
    hint: 'Human-reviewed and updated regularly; check each site’s terms and creator licenses before downloading.',
    ctaPrimary: 'Open the web tavern',
    ctaSecondary: 'Start with: what is a character card?',
    trust: '8 sites · 3 groups · human-reviewed',
    groups: [
      { title: 'Card collection sites', desc: 'Many sites, many cards, frequent updates — a good first stop to browse by taste.' },
      { title: 'Cards + lorebook sites', desc: 'Grab cards together with their lorebooks — ideal for moving whole world settings.' },
      { title: 'Indie author sites', desc: 'Hand-picked by a single author: smaller catalogs, consistent quality.' },
    ],
    howTitle: 'After downloading: how to import',
    howDesc: 'Three steps from a downloaded card to a character you can chat with:',
    how: [
      { title: 'Open it in Card Studio', desc: 'View and edit PNG / JSON card metadata right in your browser — nothing to install.', cta: 'Open Card Studio', to: '/tools/card-studio' },
      { title: 'Understand the card format', desc: 'What a character card is and how V2 / V3 specs differ, in one guide.', cta: 'Read the guide', to: '/guides/what-is-a-character-card' },
      { title: 'Import and chat', desc: 'Bring the card into the online tavern and start chatting — logs stay in your browser.', cta: 'Start chatting', to: '/opentavern' },
    ],
    note: 'Site listings are human-reviewed and provided for navigation only; check each site’s terms and creator licenses before downloading. We are not affiliated with these sites.',
    asideQuick: 'Related',
    asideHere: 'On this page',
    updated: 'Last updated: 2026-11-10',
    seo: {
      title: 'Character Card Site Directory: 8 Curated Card Sites + Import Guide | RoleChat AI',
      description:
        'A curated directory of 8 AI character-card sites — Chatbots Webring, AICharacterCards, Character Tavern, RisuAI and JanitorAI ecosystem hubs, archives and indie sites — plus how to import downloaded PNG / JSON cards.',
      ogTitle: 'Character Card Site Directory | RoleChat AI',
      ogDescription: '8 curated card sites in 3 groups, with a download-to-import guide.',
    },
  },
} as const;

const content = computed(() => (isZh.value ? C['zh-CN'] : C.en));

const canonicalUrl = computed(() =>
  isZh.value ? 'https://www.rolechatai.com/zh-CN/card-sites' : 'https://www.rolechatai.com/card-sites',
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
    { rel: 'alternate', hreflang: 'en', href: 'https://www.rolechatai.com/card-sites' },
    { rel: 'alternate', hreflang: 'zh-CN', href: 'https://www.rolechatai.com/zh-CN/card-sites' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.rolechatai.com/card-sites' },
  ]),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: isZh.value ? '首页' : 'Home', path: '/' },
          { name: content.value.h1, path: isZh.value ? '/zh-CN/card-sites' : '/card-sites' },
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
            <p class="cp-kicker">CARD SITES</p>
            <p class="cp-panel-title">{{ content.h1 }}</p>
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
          <NuxtLink :to="localePath('/web-tavern')">
            <span>{{ isZh ? '在线本地酒馆' : 'Online local tavern' }}</span><span>→</span>
          </NuxtLink>
        </div>

        <div class="cp-quick">
          <p class="cp-quick-title">{{ content.asideHere }}</p>
          <a v-for="(group, i) in GROUPS" :key="group.key" :href="`#${group.key}`">
            <span>{{ content.groups[i].title }}</span><span>↓</span>
          </a>
          <a href="#how"><span>{{ content.howTitle }}</span><span>↓</span></a>
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

        <!-- 三类分组 -->
        <section v-for="(group, i) in GROUPS" :id="group.key" :key="group.key" class="cp-section">
          <h2>{{ content.groups[i].title }}</h2>
          <p class="cp-section-desc">{{ content.groups[i].desc }}</p>
          <div class="cp-sites-grid">
            <div v-for="site in group.sites" :key="site.name" class="cp-site-card">
              <strong>{{ site.name }}</strong>
              <em>{{ isZh ? site.noteZh : site.noteEn }}</em>
              <small>{{ t(site.descKey) }}</small>
            </div>
          </div>
        </section>

        <!-- 下载之后 -->
        <section id="how" class="cp-section">
          <h2>{{ content.howTitle }}</h2>
          <p class="cp-section-desc">{{ content.howDesc }}</p>
          <div class="cp-res-grid">
            <div v-for="(step, i) in content.how" :key="step.to" class="cp-res-card">
              <span class="cp-res-tag">{{ i + 1 }}</span>
              <strong>{{ step.title }}</strong>
              <small>{{ step.desc }}</small>
              <NuxtLink :to="step.to === '/opentavern' ? step.to : localePath(step.to)" class="cp-res-cta">
                {{ step.cta }} →
              </NuxtLink>
            </div>
          </div>
          <p class="cp-section-note">{{ content.note }}</p>
        </section>

        <p class="cp-updated">{{ content.updated }}</p>
      </section>
    </main>
  </div>
</template>
