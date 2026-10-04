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

const { t } = useI18n();
const localePath = useLocalePath();

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
  if (id === 'all') navigateTo(localePath('/'));
  else navigateTo({ path: localePath('/'), query: { cat: id }, hash: '#tools-hub' });
}

/* ================= 左栏收缩状态（localStorage 全站共享；窄屏首次访问默认收起） ================= */
const RAIL_KEY = 'wb_rail_collapsed';
const railCollapsed = ref(false);

onMounted(() => {
  let stored: string | null = null;
  try {
    stored = localStorage.getItem(RAIL_KEY);
  } catch {
    /* 隐私模式下 localStorage 可能不可用，忽略即可 */
  }
  // 用户手动选过就尊重其选择；否则 <1024（平板）默认收起，避免 232px 左栏吃掉三分之一屏宽
  railCollapsed.value = stored !== null ? stored === '1' : window.innerWidth < 1024;
});

function toggleRail() {
  railCollapsed.value = !railCollapsed.value;
  try {
    localStorage.setItem(RAIL_KEY, railCollapsed.value ? '1' : '0');
  } catch {
    /* 同上 */
  }
}

/* ================= 极简页脚（原 index.vue 页脚原样迁入，全站统一） ================= */
const footerLinks = computed(() => [
  { to: localePath('/tools'), label: t('nav_tools') },
  { to: localePath('/characters'), label: t('nav_characters') },
  { to: localePath('/guides'), label: t('nav_guides') },
  { to: localePath('/about'), label: t('nav_about') },
  { to: localePath('/contact'), label: t('nav_contact') },
  { to: localePath('/privacy'), label: t('nav_privacy') },
  { to: localePath('/terms'), label: t('nav_terms') },
  { to: localePath('/app'), label: t('nav_open_app') },
]);
</script>

<template>
  <div class="wb-shell">
    <WorkbenchHeader />
    <SiteAd />

    <!-- 全幅主体：左栏贴死左侧边缘 + 内容列占满其余宽度 -->
    <div class="wb-body">
      <!-- 桌面：分类侧栏（≥768px 显示，可收缩成图标条） -->
      <HubCategoryNav
        variant="rail"
        :categories="categories"
        :model-value="currentCat"
        :collapsed="railCollapsed"
        @update:model-value="onCat"
        @toggle-collapse="toggleRail"
      />

      <main class="wb-content">
        <!-- 移动端：分类胶囊（<768px 显示） -->
        <HubCategoryNav
          variant="pills"
          :categories="categories"
          :model-value="currentCat"
          @update:model-value="onCat"
        />

        <slot />
      </main>
    </div>

    <!-- 极简页脚 -->
    <footer class="wb-footer">
      <div class="wb-footer-inner">
        <NuxtLink :to="localePath('/')" class="wb-footer-brand">
          <span class="wb-brand-mark">OT</span>
          <span>Open Tavern</span>
        </NuxtLink>
        <nav class="wb-footer-nav">
          <NuxtLink v-for="l in footerLinks" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
          <NuxtLink :to="localePath('/#how')">{{ t('nav_how_it_works') }}</NuxtLink>
          <NuxtLink :to="localePath('/#faq')">{{ t('nav_faq') }}</NuxtLink>
        </nav>
        <p>{{ t('home_footer_tagline') }}</p>
      </div>
    </footer>
  </div>
</template>
