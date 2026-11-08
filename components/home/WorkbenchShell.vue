<script setup lang="ts">
/**
 * 全站工作台外壳（WorkbenchShell）
 *
 * 首页（d28c228）的工作台布局抽成全站共用外壳：WorkbenchHeader 通栏顶栏 + HubCategoryNav
 * 贴左分类栏 + 内容列 + 极简页脚。pages/index.vue 与全部内页共用；/app 是角色扮演应用本体，
 * 自有界面不套本外壳。
 *
 * - railMode="filter"（仅首页）：分类点击 emit 给页面过滤网格，不改 URL（与原首页行为一致）
 * - railMode="nav"（内页，默认）：分类点击导航到 /?cat=<id>#tools-hub，由首页 onMounted 读取生效；
 *   activeCat 高亮当前页所属分类（页面→分类映射沿用 HOME_HUB 注册表）
 * - 左栏收缩状态存 localStorage（键 wb_rail_collapsed），全站共享一份
 * - 顶栏下方保留 SiteAd（Smartlink + 468x60）：原内页 SiteHeader 内嵌的广告位随外壳统一迁入，
 *   不随旧页头下线；显隐仍由 ?adpanel=1 面板运行时控制
 */
import { HUB_CATEGORIES, HOME_HUB } from '~/data/tools';

const props = withDefaults(
  defineProps<{
    /** filter = 首页网格过滤；nav = 内页导航（默认） */
    railMode?: 'filter' | 'nav';
    /** nav 模式：高亮的分类 id（空串 = 无高亮） */
    activeCat?: string;
    /** filter 模式：双向绑定的选中分类 */
    modelValue?: string;
  }>(),
  { railMode: 'nav', activeCat: '', modelValue: 'all' },
);

const emit = defineEmits<{ 'update:modelValue': [string] }>();

const { t, locale } = useI18n();
const localePath = useLocalePath();

/** 只有 en / zh-CN 有本地化 hub；其余保留页统一回根路径，避免指向 410。 */
const localizedHub = computed(() => locale.value === 'en' || locale.value === 'zh-CN');
function navTo(path: string) {
  // 角色 hub 只有英文版
  if (path === '/characters') return '/characters';
  return localizedHub.value ? localePath(path) : path;
}

const categories = computed(() =>
  HUB_CATEGORIES.map((c) => ({
    id: c.id as string,
    label: t(c.labelKey),
    count: c.id === 'all' ? HOME_HUB.length : HOME_HUB.filter((x) => x.category === c.id).length,
  })),
);

/** rail/pills 的选中态：filter 模式取页面双向绑定值，nav 模式取当前页所属分类 */
const currentCat = computed(() => (props.railMode === 'filter' ? props.modelValue : props.activeCat));

function onCat(id: string) {
  if (props.railMode === 'filter') {
    emit('update:modelValue', id);
    return;
  }
  if (id === 'all') navigateTo(navTo('/'));
  else navigateTo({ path: navTo('/'), query: { cat: id }, hash: '#tools-hub' });
}

/* ================= 极简页脚（路由收敛后只保留白名单链接） ================= */
const footerLinks = computed(() => [
  { to: navTo('/tools'), label: t('nav_tools') },
  { to: navTo('/characters'), label: t('nav_characters') },
  { to: navTo('/guides'), label: t('nav_guides') },
  { to: navTo('/about'), label: t('nav_about') },
  { to: navTo('/contact'), label: t('nav_contact') },
  { to: navTo('/privacy'), label: t('nav_privacy') },
  { to: navTo('/terms'), label: t('nav_terms') },
  { to: '/opentavern', label: t('nav_open_app') },
]);
</script>

<template>
  <div class="wb-shell">
    <WorkbenchHeader />
    <SiteAd />

    <!-- 全幅主体：路由收敛后旧分类栏/分类页已下线，只保留内容列 -->
    <div class="wb-body">
      <main class="wb-content">
        <slot />
      </main>
    </div>

    <!-- 极简页脚 -->
    <footer class="wb-footer">
      <div class="wb-footer-inner">
        <NuxtLink :to="navTo('/')" class="wb-footer-brand">
          <span class="wb-brand-mark">RC</span>
          <span>RoleChat AI</span>
        </NuxtLink>
        <nav class="wb-footer-nav">
          <NuxtLink v-for="l in footerLinks" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
          <NuxtLink to="/#faq">{{ t('nav_faq') }}</NuxtLink>
        </nav>
        <p>{{ t('home_footer_tagline') }}</p>
      </div>
    </footer>
  </div>
</template>
