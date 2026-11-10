<script setup lang="ts">
const { locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();

const isZh = computed(() => locale.value === 'zh-CN');
const expanded = ref(true);

onMounted(() => {
  try {
    const stored = localStorage.getItem('rolechat-dashboard-sidebar');
    if (stored !== null) expanded.value = stored === '1';
  } catch { /* noop */ }
});

function toggleSidebar() {
  expanded.value = !expanded.value;
  try {
    localStorage.setItem('rolechat-dashboard-sidebar', expanded.value ? '1' : '0');
  } catch { /* noop */ }
}

function navTo(path: string) {
  if (path === '/opentavern') return path;
  return localePath(path);
}

const navItems = computed(() => [
  { to: navTo('/'), label: isZh.value ? '首页' : 'Home', icon: 'house' },
  // 锚文本带业务词（在线网页酒馆），让 /opentavern 承接「在线酒馆」搜索意图
  { to: '/opentavern', label: isZh.value ? '在线网页酒馆' : 'Online tavern', icon: 'chat' },
  // 教程/工具/卡站/酒馆方案四槽改指新版页面；旧 /guides /tools /where-to-find-character-cards
  // 保留 200 给搜索引擎自然流量，页内挂 PageUpgradeBanner 引流到新 URL
  { to: navTo('/tutorials'), label: isZh.value ? '教程' : 'Guides', icon: 'book' },
  { to: navTo('/toolkit'), label: isZh.value ? '工具' : 'Tools', icon: 'tools' },
  { to: navTo('/card-sites'), label: isZh.value ? '角色卡网站' : 'Card sites', icon: 'users' },
  { to: navTo('/web-tavern'), label: isZh.value ? '在线本地酒馆' : 'Online local tavern', icon: 'server' },
]);

const mobileNav = computed(() => [
  { to: navTo('/'), label: isZh.value ? '首页' : 'Home', icon: 'house' },
  { to: '/opentavern', label: isZh.value ? '网页酒馆' : 'Tavern', icon: 'chat' },
  { to: navTo('/tutorials'), label: isZh.value ? '教程' : 'Guides', icon: 'book' },
  { to: navTo('/toolkit'), label: isZh.value ? '工具' : 'Tools', icon: 'tools' },
  { to: navTo('/about'), label: isZh.value ? '关于' : 'About', icon: 'compass' },
]);

function isActive(to: string) {
  const path = route.path.replace(/\/+$/, '') || '/';
  const target = to.replace(/\/+$/, '') || '/';
  if (target === '/') return path === '/' || path === '/zh-CN';
  return path === target || path.startsWith(`${target}/`);
}
</script>

<template>
  <div class="cp-shell">
    <aside class="cp-sidebar" :class="{ 'is-expanded': expanded }">
      <button class="cp-logo" type="button" :title="isZh ? '展开/收起导航' : 'Toggle navigation'" @click="toggleSidebar">
        <span class="cp-logo-mark">RC</span>
        <span v-if="expanded" class="cp-logo-text">RoleChat AI</span>
      </button>

      <nav class="cp-nav" :aria-label="isZh ? '站点导航' : 'Site navigation'">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="cp-nav-item"
          :class="{ 'is-active': isActive(item.to) }"
          :title="item.label"
        >
          <HubIcon :name="item.icon as any" size="18" />
          <span v-if="expanded" class="cp-nav-label">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- 语言切换迁至页面顶栏（cp-btn-lang）：移动端侧栏隐藏、底部 tab 无语言项，顶栏是唯一全视口入口 -->
      <div class="cp-sidebar-footer">
        <NuxtLink
          :to="navTo('/about')"
          class="cp-nav-item"
          :class="{ 'is-active': isActive(navTo('/about')) }"
          :title="isZh ? '关于' : 'About'"
        >
          <HubIcon name="compass" size="18" />
          <span v-if="expanded" class="cp-nav-label">{{ isZh ? '关于' : 'About' }}</span>
        </NuxtLink>
      </div>
    </aside>

    <div class="cp-main">
      <slot />
    </div>

    <nav class="cp-mobile-tabs" :aria-label="isZh ? '移动端导航' : 'Mobile navigation'">
      <NuxtLink
        v-for="item in mobileNav"
        :key="item.to"
        :to="item.to"
        class="cp-mobile-tab"
        :class="{ 'is-active': isActive(item.to) }"
      >
        <HubIcon :name="item.icon as any" size="18" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>
