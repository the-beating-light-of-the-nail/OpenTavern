<script setup lang="ts">
/**
 * 首页工作台顶栏（WorkbenchHeader）
 *
 * 规格：docs/research/laopobao-tools/home/components/workbench-header.spec.md
 * 样式：类名全部来自 assets/css/workbench.css（本组件不写 <style>，不改 CSS）
 * 图标：<HubIcon>（components/home/HubIcon.vue，Nuxt 自动注册 pathPrefix:false，不做 import）
 * 语言切换：原 SiteHeader.vue（已随全站外壳化删除）的 langOptions 构造 + setLocale 处理
 */
import { useAppStore } from '~/stores/app';
import { useLocale } from '~/composables/useLocale';

const { t } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const store = useAppStore();
const { setLocale, supported } = useLocale();

/** 语言下拉（与 SiteHeader.vue 同一份构造：25 个受支持语言，按短标签展示） */
const langOptions = [
  { code: 'en', label: t('lang_en_short') },
  { code: 'zh-CN', label: t('lang_zh_cn_short') },
  { code: 'zh-TW', label: t('lang_zh_tw_short') },
  { code: 'es', label: t('lang_es_short') },
  { code: 'ar', label: t('lang_ar_short') },
  { code: 'pt', label: t('lang_pt_short') },
  { code: 'ru', label: t('lang_ru_short') },
  { code: 'fr', label: t('lang_fr_short') },
  { code: 'de', label: t('lang_de_short') },
  { code: 'ja', label: t('lang_ja_short') },
  { code: 'ko', label: t('lang_ko_short') },
  { code: 'it', label: t('lang_it_short') },
  { code: 'nl', label: t('lang_nl_short') },
  { code: 'sv', label: t('lang_sv_short') },
  { code: 'no', label: t('lang_no_short') },
  { code: 'da', label: t('lang_da_short') },
  { code: 'fi', label: t('lang_fi_short') },
  { code: 'pl', label: t('lang_pl_short') },
  { code: 'tr', label: t('lang_tr_short') },
  { code: 'hi', label: t('lang_hi_short') },
  { code: 'id', label: t('lang_id_short') },
  { code: 'vi', label: t('lang_vi_short') },
  { code: 'th', label: t('lang_th_short') },
  { code: 'ms', label: t('lang_ms_short') },
  { code: 'tl', label: t('lang_tl_short') },
].filter((o) => supported.includes(o.code as any));

function onLangChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  setLocale(target.value);
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

/** 本段或子路径命中（/tools → 工具，/tools/xxx 亦命中） */
function inSection(section: string) {
  return activePath.value === section || activePath.value.startsWith(`${section}/`);
}
</script>

<template>
  <header class="wb-header">
    <div class="wb-header-inner">
      <!-- 品牌：站名硬编码（源站同样硬编码站名，不走 i18n） -->
      <NuxtLink :to="localePath('/')" class="wb-brand">
        <span class="wb-brand-mark">OT</span>
        <span class="wb-brand-name">Open Tavern</span>
      </NuxtLink>

      <div class="wb-header-right">
        <nav class="wb-nav">
          <NuxtLink :to="localePath('/')" class="wb-nav-link" :class="{ 'is-active': activePath === '/' }">
            <HubIcon name="house" size="16" />
            <span class="wb-nav-label">{{ t('breadcrumb_home') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/tools')" class="wb-nav-link" :class="{ 'is-active': inSection('/tools') }">
            <HubIcon name="tools" size="16" />
            <span class="wb-nav-label">{{ t('nav_tools') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="wb-nav-link" :class="{ 'is-active': inSection('/characters') }">
            <HubIcon name="users" size="16" />
            <span class="wb-nav-label">{{ t('nav_characters') }}</span>
          </NuxtLink>
          <NuxtLink :to="localePath('/guides')" class="wb-nav-link" :class="{ 'is-active': inSection('/guides') }">
            <HubIcon name="book" size="16" />
            <span class="wb-nav-label">{{ t('nav_guides') }}</span>
          </NuxtLink>
        </nav>

        <div class="wb-header-divider">
          <select
            class="wb-lang"
            :value="store.settings.lang"
            :aria-label="t('announce_lang_label')"
            @change="onLangChange"
          >
            <option v-for="o in langOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
          </select>
        </div>

        <NuxtLink :to="localePath('/app')" class="wb-cta">
          <HubIcon name="chat" size="15" />
          <span class="wb-cta-label">{{ t('nav_open_app') }}</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
