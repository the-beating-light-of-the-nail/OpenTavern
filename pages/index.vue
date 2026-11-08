<script setup lang="ts">
import { useCharacters, useGuides } from '~/data';

definePageMeta({ layout: 'dashboard' });

const { locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');

const characters = useCharacters();
const guides = useGuides();

const KEPT_TOOLS = 5;
const KEPT_PAGES = 12;

const stats = computed(() => [
  {
    key: 'characters',
    label: isZh.value ? '角色卡' : 'Characters',
    value: characters.value.length,
    icon: 'users',
    color: 'blue',
    to: '/characters',
  },
  {
    key: 'guides',
    label: isZh.value ? '教程' : 'Guides',
    value: guides.value.length,
    icon: 'book',
    color: 'green',
    to: localePath('/guides'),
  },
  {
    key: 'tools',
    label: isZh.value ? '工具' : 'Tools',
    value: KEPT_TOOLS,
    icon: 'tools',
    color: 'orange',
    to: localePath('/tools'),
  },
  {
    key: 'pages',
    label: isZh.value ? '保留页' : 'Kept pages',
    value: KEPT_PAGES,
    icon: 'server',
    color: 'red',
    to: localePath('/about'),
  },
]);

const tips = computed(() =>
  isZh.value
    ? [
        '本站只保留 Google 已收录的页面，旧页面统一返回 410。',
        '聊天记录默认存在浏览器，不上传；可以用自己的 API Key。',
        '角色卡支持 SillyTavern V2/V3 的 JSON 和 PNG。',
        '教程和榜单都会写最后验证日期。',
      ]
    : [
        'Only pages already indexed by Google are kept; old pages return 410.',
        'Chats stay in your browser. Bring your own API key.',
        'Character cards support SillyTavern V2/V3 JSON and PNG.',
        'Guides and lists publish a last-verified date.',
      ],
);

const tools = computed(() => [
  {
    title: isZh.value ? '角色卡编辑' : 'Card editor',
    desc: isZh.value ? 'Card Studio' : 'Card Studio',
    icon: 'users',
    color: 'blue',
    to: localePath('/tools/card-studio'),
  },
  {
    title: isZh.value ? '世界书编辑' : 'World book',
    desc: isZh.value ? 'Worldbook Forge' : 'Worldbook Forge',
    icon: 'book',
    color: 'green',
    to: localePath('/tools/worldbook-forge'),
  },
  {
    title: isZh.value ? '预设对比' : 'Preset diff',
    desc: isZh.value ? 'Preset Lab' : 'Preset Lab',
    icon: 'tools',
    color: 'orange',
    to: localePath('/tools/preset-lab'),
  },
  {
    title: isZh.value ? '角色卡转换' : 'Card converter',
    desc: isZh.value ? 'Card Converter' : 'Card Converter',
    icon: 'server',
    color: 'red',
    to: localePath('/tools/card-converter'),
  },
]);

const tipIndex = ref(0);
const currentTip = computed(() => tips.value[tipIndex.value % tips.value.length]);

function nextTip() {
  tipIndex.value = (tipIndex.value + 1) % tips.value.length;
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

useSeoMeta({
  title: () =>
    isZh.value
      ? 'RoleChat AI 工作台｜酒馆AI 开聊、SillyTavern 教程与工具'
      : 'RoleChat AI — AI Roleplay Workbench',
  description: () =>
    isZh.value
      ? 'RoleChat AI 工作台：直接开聊、SillyTavern 中文教程、角色卡网站与酒馆工具入口。免安装，聊天记录留在浏览器。'
      : 'Start chatting, browse SillyTavern guides, character card sites and tavern tools from one workbench. No install, local-first.',
  ogTitle: () => (isZh.value ? 'RoleChat AI 工作台' : 'RoleChat AI — AI Roleplay Workbench'),
  ogDescription: () =>
    isZh.value
      ? '直接开聊、SillyTavern 教程、角色卡与工具，一个工作台全部搞定。'
      : 'Chat, guides, character cards and tools — one local-first workbench.',
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
});
</script>

<template>
  <div class="cp-page">
    <h1 class="sr-only">{{ isZh ? 'RoleChat AI 工作台' : 'RoleChat AI workbench' }}</h1>

    <header class="cp-toolbar">
      <div class="cp-brand">
        <span class="cp-brand-mark">RC</span>
        <span class="cp-brand-name">RoleChat AI</span>
        <span class="cp-status">
          <i class="cp-status-dot" />
          {{ isZh ? '免登录 · 本地数据' : 'No login · Local data' }}
        </span>
      </div>
      <div class="cp-toolbar-actions">
        <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ isZh ? '直接开聊' : 'Start chatting' }}</NuxtLink>
        <NuxtLink :to="localePath('/guides')" class="cp-btn">{{ isZh ? '打开教程' : 'Guides' }}</NuxtLink>
      </div>
    </header>

    <main class="cp-workspace">
      <!-- 左：站内资源 -->
      <aside class="cp-panel">
        <div class="cp-panel-head">
          <div>
            <p class="cp-kicker">RESOURCES</p>
            <h2>{{ isZh ? '站内资源' : 'Resources' }}</h2>
          </div>
        </div>

        <ul class="cp-tree">
          <li v-for="stat in stats" :key="stat.key">
            <NuxtLink :to="stat.to">
              <span class="cp-tree-icon" :class="`is-${stat.color}`">
                <HubIcon :name="stat.icon as any" size="17" />
              </span>
              <span class="cp-tree-label">{{ stat.label }}</span>
              <strong class="cp-count">{{ stat.value }}</strong>
            </NuxtLink>
          </li>
        </ul>

        <div class="cp-quick">
          <h3>{{ isZh ? '快速入口' : 'Quick links' }}</h3>
          <NuxtLink to="/opentavern">
            <span>{{ isZh ? '直接开聊' : 'Start chatting' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/where-to-find-character-cards')">
            <span>{{ isZh ? '角色卡网站' : 'Card sites' }}</span><span>→</span>
          </NuxtLink>
          <NuxtLink to="/cloud-taverns/">
            <span>{{ isZh ? '云酒馆' : 'Cloud taverns' }}</span><span>→</span>
          </NuxtLink>
        </div>
      </aside>

      <!-- 中：工作台 -->
      <section class="cp-panel">
        <div class="cp-hero">
          <h2>{{ isZh ? '欢迎使用 RoleChat AI' : 'Welcome to RoleChat AI' }}</h2>
          <p class="cp-subtitle">{{ isZh ? '你今天要创造些什么？' : 'What will you create today?' }}</p>
          <p class="cp-hint">{{ isZh ? '从左侧选择工具，或直接开聊。' : 'Pick a tool on the left, or start chatting.' }}</p>
          <div class="cp-hero-actions">
            <NuxtLink to="/opentavern" class="cp-btn cp-btn-primary">{{ isZh ? '直接开聊' : 'Start chatting' }}</NuxtLink>
            <NuxtLink :to="localePath('/guides')" class="cp-btn">{{ isZh ? '看教程' : 'Read guides' }}</NuxtLink>
          </div>
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

        <div class="cp-tool-section">
          <div class="cp-tool-head">
            <h3>{{ isZh ? '常用工具' : 'Common tools' }}</h3>
            <NuxtLink :to="localePath('/tools')" class="cp-tool-all">
              {{ isZh ? '全部工具' : 'All tools' }} →
            </NuxtLink>
          </div>
          <div class="cp-tool-grid">
            <NuxtLink v-for="tool in tools" :key="tool.to" :to="tool.to" class="cp-tool-card">
              <span class="cp-tree-icon" :class="`is-${tool.color}`">
                <HubIcon :name="tool.icon as any" size="17" />
              </span>
              <span>
                <strong>{{ tool.title }}</strong>
                <small>{{ tool.desc }}</small>
              </span>
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- 首次进入的欢迎浮层（对齐 cardplus 的 welcome overlay） -->
    <div v-if="welcomeVisible" class="cp-welcome-overlay">
      <div class="cp-welcome-card">
        <div class="cp-welcome-logo">RC</div>
        <h2>{{ isZh ? '欢迎使用 RoleChat AI' : 'Welcome to RoleChat AI' }}</h2>
        <p class="cp-subtitle">{{ isZh ? '你今天要创造些什么？' : 'What will you create today?' }}</p>
        <p class="cp-hint">
          {{ isZh ? '从左侧选择工具，或直接开聊。所有数据默认留在你的浏览器。' : 'Pick a tool on the left, or start chatting. Everything stays in your browser by default.' }}
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
