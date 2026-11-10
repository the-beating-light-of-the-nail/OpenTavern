<script setup lang="ts">
/**
 * 首页工作台顶栏（WorkbenchHeader）
 *
 * 规格：docs/research/laopobao-tools/home/components/workbench-header.spec.md
 * 样式：类名全部来自 assets/css/workbench.css（本组件不写 <style>，不改 CSS）
 * 图标：<HubIcon>（components/home/HubIcon.vue，Nuxt 自动注册 pathPrefix:false，不做 import）
 * 语言切换：en / zh-CN 双语互切按钮（.wb-lang，显示目标语言短标签），
 * 复用 useLocale().setLocale（持久化 + $i18n.setLocale 导航到对应前缀路径）
 */
import { useLocale } from '~/composables/useLocale';

const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const { supported, setLocale } = useLocale();

/** 只有 en / zh-CN 保留了本地化 hub；其余保留的收录页统一回英文根路径，避免指向 410。 */
const localizedHub = computed(() => locale.value === 'en' || locale.value === 'zh-CN');
function navTo(path: string) {
  // 角色 hub 只有英文版；中文/其他语言的保留页统一回根路径，避免 410
  if (path === '/characters') return '/characters';
  return localizedHub.value ? localePath(path) : path;
}

/**
 * 激活态判定：i18n 策略 prefix_except_default，路由 path 可能带 `/zh-CN` 前缀，
 * 先剥掉首段 locale 再比对，首页以「去掉前缀后等于 `/`」判定。
 */
const activePath = computed(() => {
  const segs = (route.path || '/').split('/').filter(Boolean);
  const first = segs[0];
  if (first && (supported as readonly string[]).includes(first)) segs.shift();
  return `/${segs.join('/')}`;
});

/**
 * 语言互切：25 语言路由下线后线上只保留 en（根路径）/ zh-CN 两个语言版本，
 * 按钮显示目标语言短标签（en 页显示「简」、zh-CN 页显示「EN」），aria-label 给全称。
 * /characters 是英文专属 hub（/zh-CN/characters 由 route-guard 返回 410），该页隐藏按钮。
 */
const nextLang = computed(() => (locale.value === 'zh-CN' ? 'en' : 'zh-CN'));
const showLangToggle = computed(() => activePath.value !== '/characters');
async function onToggleLang() {
  await setLocale(nextLang.value);
}

/** 本段或子路径命中（/tools → 工具，/tools/xxx 亦命中） */
function inSection(section: string) {
  return activePath.value === section || activePath.value.startsWith(`${section}/`);
}
</script>

<template>
  <header class="wb-header">
    <div class="wb-header-inner">
      <!-- 品牌：站名硬编码（源站同样硬编码站名，不走 i18n） -->
      <NuxtLink :to="navTo('/')" class="wb-brand">
        <span class="wb-brand-mark">RC</span>
        <span class="wb-brand-name">RoleChat AI</span>
      </NuxtLink>

      <div class="wb-header-right">
        <nav class="wb-nav">
          <NuxtLink :to="navTo('/')" class="wb-nav-link" :class="{ 'is-active': activePath === '/' }">
            <HubIcon name="house" size="16" />
            <span class="wb-nav-label">{{ t('breadcrumb_home') }}</span>
          </NuxtLink>
          <NuxtLink
            :to="navTo('/toolkit')"
            class="wb-nav-link"
            :class="{ 'is-active': inSection('/toolkit') || inSection('/tools') }"
          >
            <HubIcon name="tools" size="16" />
            <span class="wb-nav-label">{{ t('nav_tools') }}</span>
          </NuxtLink>
          <NuxtLink :to="navTo('/characters')" class="wb-nav-link" :class="{ 'is-active': inSection('/characters') }">
            <HubIcon name="users" size="16" />
            <span class="wb-nav-label">{{ t('nav_characters') }}</span>
          </NuxtLink>
          <NuxtLink
            :to="navTo('/tutorials')"
            class="wb-nav-link"
            :class="{ 'is-active': inSection('/tutorials') || inSection('/guides') }"
          >
            <HubIcon name="book" size="16" />
            <span class="wb-nav-label">{{ t('nav_guides') }}</span>
          </NuxtLink>
        </nav>

        <div class="wb-header-divider wb-header-tools">
          <button
            v-if="showLangToggle"
            type="button"
            class="wb-lang"
            :title="locale === 'zh-CN' ? 'Switch to English' : '切换到中文'"
            :aria-label="locale === 'zh-CN' ? 'English' : '简体中文'"
            @click="onToggleLang"
          >
            {{ locale === 'zh-CN' ? t('lang_en_short') : t('lang_zh_cn_short') }}
          </button>
          <ThemeMenu />
        </div>

        <NuxtLink to="/opentavern" class="wb-cta">
          <HubIcon name="chat" size="15" />
          <span class="wb-cta-label">{{ t('nav_open_app') }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
