<script setup lang="ts">
import { useCharacters, useGuides, KEPT_CHARACTER_SLUGS } from '~/data';
import { HOME_CONTENT } from '~/data/homepage';
import { KEPT_TOOL_SLUGS } from '~/data/tools';

definePageMeta({ layout: 'dashboard' });

const { locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');
const { setLocale } = useLocale();

/** 语言互切：线上只保留 en（根路径）/ zh-CN 两个语言版本，按钮显示目标语言。
 *  顶栏按钮全视口可见（移动端侧栏隐藏、底部 tab 无语言项，这里是唯一入口）。 */
function toggleLocale() {
  setLocale(isZh.value ? 'en' : 'zh-CN');
}

// 六板块内容（zh-CN / en 双语，见 data/homepage.ts；其余 locale 回退 en）
const content = computed(() => (isZh.value ? HOME_CONTENT['zh-CN'] : HOME_CONTENT.en));

const allCharacters = useCharacters();
const guides = useGuides();
// 只展示收录白名单内的角色，与 /characters 列表页一致（避免链到 410 详情页）
const characters = computed(() => allCharacters.value.filter((c) => KEPT_CHARACTER_SLUGS.has(c.slug)));

const stats = computed(() => [
  {
    key: 'characters',
    label: isZh.value ? '角色卡' : 'Characters',
    value: characters.value.length,
    icon: 'users',
    color: 'blue',
    to: localePath('/characters'),
  },
  {
    key: 'guides',
    label: isZh.value ? '教程' : 'Guides',
    value: guides.value.length,
    icon: 'book',
    color: 'green',
    to: localePath('/tutorials'),
  },
  {
    key: 'tools',
    label: isZh.value ? '工具' : 'Tools',
    value: KEPT_TOOL_SLUGS.size,
    icon: 'tools',
    color: 'orange',
    to: localePath('/toolkit'),
  },
]);

// 右侧「本页板块」目录：七个板块全量（原中间栏只列 5 个，补齐角色卡与教程）
const tocItems = computed(() => [
  { id: 'tools', label: isZh.value ? '工具箱' : 'Toolbox' },
  { id: 'characters', label: isZh.value ? '角色卡' : 'Characters' },
  { id: 'card-sites', label: isZh.value ? '卡站导航' : 'Card sites' },
  { id: 'plugins', label: isZh.value ? '插件与预设' : 'Plugins & presets' },
  { id: 'cloud', label: isZh.value ? '云酒馆' : 'Cloud taverns' },
  { id: 'api-guide', label: isZh.value ? 'API 指南' : 'API guide' },
  { id: 'guides', label: isZh.value ? '教程' : 'Guides' },
]);

const tipIndex = ref(0);
const currentTip = computed(() => content.value.tips[tipIndex.value % content.value.tips.length]);

function nextTip() {
  tipIndex.value = (tipIndex.value + 1) % content.value.tips.length;
}

const welcomeVisible = ref(false);
onMounted(() => {
  try {
    welcomeVisible.value = localStorage.getItem('rolechat-dashboard-welcome') !== '1';
  } catch {
    welcomeVisible.value = true;
  }
});

function dismissWelcome() {
  welcomeVisible.value = false;
  try {
    localStorage.setItem('rolechat-dashboard-welcome', '1');
  } catch { /* noop */ }
}

const canonicalUrl = computed(() =>
  isZh.value ? 'https://www.rolechatai.com/zh-CN/' : 'https://www.rolechatai.com/',
);

// 首页内容橱窗的结构化数据：角色卡 + 教程两个 ItemList，帮助搜索引擎理解首页聚合的是哪类实体
const itemListJsonLd = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: content.value.charactersTitle,
      numberOfItems: characters.value.length,
      itemListElement: characters.value.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.rolechatai.com${localePath(`/characters/${c.slug}`)}`,
        name: c.name,
      })),
    }),
  },
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: content.value.guidesTitle,
      numberOfItems: guides.value.length,
      itemListElement: guides.value.map((g, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://www.rolechatai.com${localePath(`/guides/${g.slug}`)}`,
        name: g.title,
      })),
    }),
  },
]);

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
    { rel: 'alternate', hreflang: 'en', href: 'https://www.rolechatai.com/' },
    { rel: 'alternate', hreflang: 'zh-CN', href: 'https://www.rolechatai.com/zh-CN/' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://www.rolechatai.com/' },
  ]),
  script: itemListJsonLd,
});
</script>

<template>
  <div class="cp-page">
    <header class="cp-toolbar">
      <div class="cp-brand">
        <span class="cp-brand-mark">RC</span>
        <span class="cp-brand-name">RoleChat AI</span>
        <span class="cp-status">
          <i class="cp-status-dot" />
          {{ content.badge }}
        </span>
      </div>
      <div class="cp-toolbar-actions">
        <button
          type="button"
          class="cp-btn cp-btn-lang"
          :title="isZh ? 'Switch to English' : '切换到中文'"
          @click="toggleLocale"
        >
          {{ isZh ? 'English' : '中文' }}
        </button>
        <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">
          OpenTavern
        </NuxtLink>
        <NuxtLink :to="localePath('/tutorials')" class="cp-btn">{{ isZh ? '打开教程' : 'Guides' }}</NuxtLink>
      </div>
    </header>

    <main class="cp-workspace">
      <!-- 主内容：六板块内容橱窗（原「站内资源/快速入口」中间栏与左侧导航、
           首屏统计完全重复，已删；板块跳转移至右侧 PageToc 目录栏） -->
      <section class="cp-panel cp-showcase">
        <!-- M1 首屏主视觉 -->
        <div class="cp-hero">
          <h1>{{ content.h1 }}</h1>
          <p class="cp-subtitle">{{ content.subtitle }}</p>
          <p class="cp-hint">{{ content.intro }}</p>
          <div class="cp-hero-actions">
            <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ content.ctaPrimary }}</NuxtLink>
            <NuxtLink :to="localePath('/guides')" class="cp-btn">{{ content.ctaSecondary }}</NuxtLink>
          </div>
          <p class="cp-trust">{{ content.trust }}</p>
        </div>

        <div class="cp-stats">
          <DashboardStat v-for="stat in stats" :key="stat.key" :stat="stat" />
        </div>

        <div class="cp-did-you-know">
          <div class="cp-did-you-know-head">
            <span class="cp-did-you-know-title">{{ isZh ? '你知道吗' : 'Did you know' }}</span>
            <button class="cp-did-you-know-next" type="button" @click="nextTip">
              {{ isZh ? '下一个' : 'Next' }}
            </button>
          </div>
          <p class="cp-did-you-know-text">{{ currentTip }}</p>
        </div>

        <!-- M2 SillyTavern 核心在线工具箱 -->
        <section id="tools" class="cp-section">
          <h2>{{ content.toolsTitle }}</h2>
          <p class="cp-section-desc">{{ content.toolsDesc }}</p>
          <div class="cp-tool-grid cp-tool-grid-detail">
            <NuxtLink v-for="tool in content.tools" :key="tool.to" :to="localePath(tool.to)" class="cp-tool-card">
              <span class="cp-tool-card-head">
                <span class="cp-tree-icon" :class="`is-${tool.color}`">
                  <HubIcon :name="tool.icon as any" size="17" />
                </span>
                <strong>{{ isZh ? `${tool.title} (${tool.name})` : `${tool.title} — ${tool.name}` }}</strong>
              </span>
              <small>{{ tool.desc }}</small>
            </NuxtLink>
          </div>
          <NuxtLink :to="localePath('/toolkit')" class="cp-section-cta">
            {{ isZh ? '全部工具' : 'All tools' }} →
          </NuxtLink>
        </section>

        <!-- M3 热门 AI 角色卡 -->
        <section id="characters" class="cp-section">
          <h2>{{ content.charactersTitle }}</h2>
          <p class="cp-section-desc">{{ content.charactersDesc }}</p>
          <div class="cp-char-grid">
            <NuxtLink
              v-for="c in characters"
              :key="c.slug"
              :to="localePath(`/characters/${c.slug}`)"
              class="cp-char-card"
            >
              <span class="cp-char-avatar" :aria-hidden="true">{{ c.initial }}</span>
              <span class="cp-char-info">
                <strong>{{ c.name }}</strong>
                <small>{{ c.tagline }}</small>
                <span class="cp-char-tags">
                  <em v-for="tag in c.tags.slice(0, 2)" :key="tag">{{ tag }}</em>
                </span>
              </span>
            </NuxtLink>
          </div>
          <NuxtLink :to="localePath('/characters')" class="cp-section-cta">
            {{ content.charactersCta }} →
          </NuxtLink>
        </section>

        <!-- M3b 角色卡资源网站导航 -->
        <section id="card-sites" class="cp-section">
          <h2>{{ content.cardSitesTitle }}</h2>
          <p class="cp-section-desc">{{ content.cardSitesDesc }}</p>
          <div class="cp-sites-grid">
            <div v-for="site in content.cardSites" :key="site.name" class="cp-site-card">
              <strong>{{ site.name }}</strong>
              <em>{{ site.note }}</em>
              <small>{{ site.desc }}</small>
            </div>
          </div>
          <NuxtLink :to="localePath('/card-sites')" class="cp-section-cta">
            {{ content.cardSitesCta }} →
          </NuxtLink>
        </section>

        <!-- M4 酒馆插件、破限预设与正则资源 -->
        <section id="plugins" class="cp-section">
          <h2>{{ content.resourcesTitle }}</h2>
          <p class="cp-section-desc">{{ content.resourcesDesc }}</p>
          <div class="cp-res-grid">
            <div v-for="res in content.resources" :key="res.to" class="cp-res-card">
              <span class="cp-res-tag">{{ res.tag }}</span>
              <strong>{{ res.title }}</strong>
              <small>{{ res.desc }}</small>
              <NuxtLink :to="localePath(res.to)" class="cp-res-cta">{{ res.cta }} →</NuxtLink>
            </div>
          </div>
        </section>

        <!-- M5a 云酒馆与即开即聊方案 -->
        <section id="cloud" class="cp-section">
          <h2>{{ content.cloudTitle }}</h2>
          <p class="cp-section-desc">{{ content.cloudDesc }}</p>
          <div class="cp-cloud-grid">
            <NuxtLink
              v-for="opt in content.cloud"
              :key="opt.to"
              :to="opt.to"
              class="cp-cloud-card"
              :class="{ 'is-highlight': opt.highlight }"
            >
              <strong>{{ opt.title }}</strong>
              <small>{{ opt.desc }}</small>
              <span class="cp-res-cta">{{ opt.cta }} →</span>
            </NuxtLink>
          </div>
          <ul class="cp-criteria">
            <li v-for="crit in content.cloudCriteria" :key="crit.title">
              <strong>{{ crit.title }}</strong>
              <span>{{ crit.desc }}</span>
            </li>
          </ul>
          <p class="cp-section-note">{{ content.cloudNote }}</p>
          <NuxtLink :to="localePath('/web-tavern')" class="cp-section-cta">
            {{ isZh ? '了解在线本地酒馆方案' : 'About the online local tavern' }} →
          </NuxtLink>
        </section>

        <!-- M5b AI 角色扮演 API 推荐指南 -->
        <section id="api-guide" class="cp-section">
          <h2>{{ content.apiTitle }}</h2>
          <p class="cp-section-desc">{{ content.apiDesc }}</p>
          <div class="cp-api-grid">
            <div v-for="api in content.apiProviders" :key="api.name" class="cp-api-card">
              <div class="cp-api-head">
                <strong>{{ api.name }}</strong>
                <a :href="api.href" target="_blank" rel="noopener noreferrer">{{ isZh ? '官网' : 'Official' }} ↗</a>
              </div>
              <small>{{ api.desc }}</small>
              <dl class="cp-api-meta">
                <div>
                  <dt>{{ isZh ? '计费' : 'Pricing' }}</dt>
                  <dd>{{ api.pricing }}</dd>
                </div>
                <div>
                  <dt>{{ isZh ? '适合' : 'Best for' }}</dt>
                  <dd>{{ api.bestFor }}</dd>
                </div>
              </dl>
              <NuxtLink :to="localePath(api.to)" class="cp-res-cta">{{ isZh ? '看配置教程' : 'Setup guide' }} →</NuxtLink>
            </div>
          </div>
          <NuxtLink :to="localePath('/guides/how-to-get-an-api-key')" class="cp-section-cta">
            {{ content.apiCta }} →
          </NuxtLink>
        </section>

        <!-- M6 AI 角色扮演新手教程与常见问题 -->
        <section id="guides" class="cp-section">
          <h2>{{ content.guidesTitle }}</h2>
          <p class="cp-section-desc">{{ content.guidesDesc }}</p>
          <ol class="cp-guide-list">
            <li v-for="g in guides" :key="g.slug">
              <NuxtLink :to="localePath(`/guides/${g.slug}`)">
                <strong>{{ g.title }}</strong>
                <small>{{ g.description }}</small>
              </NuxtLink>
            </li>
          </ol>
          <NuxtLink :to="localePath('/tutorials')" class="cp-section-cta">
            {{ content.guidesCta }} →
          </NuxtLink>
        </section>

        <p class="cp-updated">{{ content.updated }}</p>
      </section>

      <!-- 右：本页板块目录（≥1200px 显示） -->
      <PageToc :items="tocItems" />
    </main>

    <!-- 首次进入的欢迎浮层（对齐 cardplus 的 welcome overlay；SSR 不渲染，不影响 SEO） -->
    <div v-if="welcomeVisible" class="cp-welcome-overlay">
      <div class="cp-welcome-card">
        <div class="cp-welcome-logo">RC</div>
        <h2>{{ content.h1 }}</h2>
        <p class="cp-subtitle">{{ content.subtitle }}</p>
        <p class="cp-hint">
          {{ isZh
            ? '从左侧选择工具，或直接开聊。所有数据默认留在你的浏览器。'
            : 'Pick a tool on the left, or start chatting. Everything stays in your browser by default.' }}
        </p>

        <div class="cp-welcome-stats">
          <DashboardStat v-for="stat in stats" :key="stat.key" :stat="stat" />
        </div>

        <div class="cp-welcome-actions">
          <button class="cp-btn cp-btn-primary" type="button" @click="dismissWelcome">
            {{ isZh ? '开始使用' : 'Get started' }}
          </button>
        </div>

        <div class="cp-did-you-know">
          <div class="cp-did-you-know-head">
            <span class="cp-did-you-know-title">{{ isZh ? '你知道吗' : 'Did you know' }}</span>
            <button class="cp-did-you-know-next" type="button" @click="nextTip">
              {{ isZh ? '下一个' : 'Next' }}
            </button>
          </div>
          <p class="cp-did-you-know-text">{{ currentTip }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
