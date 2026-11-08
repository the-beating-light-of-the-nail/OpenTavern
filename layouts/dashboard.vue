<script setup lang="ts">
const { locale } = useI18n();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
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
  if (path === '/opentavern' || path.startsWith('/cloud-taverns')) return path;
  return localePath(path);
}

const navItems = computed(() => [
  { to: navTo('/'), label: isZh.value ? '首页' : 'Home', icon: 'house' },
  { to: '/opentavern', label: isZh.value ? '直接开聊' : 'Chat', icon: 'chat' },
  { to: navTo('/guides'), label: isZh.value ? '教程' : 'Guides', icon: 'book' },
  { to: navTo('/tools'), label: isZh.value ? '工具' : 'Tools', icon: 'tools' },
  { to: navTo('/where-to-find-character-cards'), label: isZh.value ? '角色卡网站' : 'Card sites', icon: 'users' },
  { to: '/cloud-taverns/', label: isZh.value ? '云酒馆' : 'Cloud taverns', icon: 'server' },
]);

const mobileNav = computed(() => [
  { to: navTo('/'), label: isZh.value ? '首页' : 'Home', icon: 'house' },
  { to: '/opentavern', label: isZh.value ? '开聊' : 'Chat', icon: 'chat' },
  { to: navTo('/guides'), label: isZh.value ? '教程' : 'Guides', icon: 'book' },
  { to: navTo('/tools'), label: isZh.value ? '工具' : 'Tools', icon: 'tools' },
  { to: navTo('/about'), label: isZh.value ? '关于' : 'About', icon: 'compass' },
]);

function isActive(to: string) {
  const path = route.path.replace(/\/+$/, '') || '/';
  const target = to.replace(/\/+$/, '') || '/';
  if (target === '/') return path === '/' || path === '/zh-CN';
  return path === target || path.startsWith(`${target}/`);
}

function toggleLocale() {
  navigateTo(switchLocalePath(isZh.value ? 'en' : 'zh-CN'));
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

      <div class="cp-sidebar-footer">
        <button class="cp-nav-item" type="button" :title="isZh ? 'Switch to English' : '切换到中文'" @click="toggleLocale">
          <span class="cp-lang-mark">{{ isZh ? 'EN' : '中' }}</span>
          <span v-if="expanded" class="cp-nav-label">{{ isZh ? 'English' : '中文' }}</span>
        </button>
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
