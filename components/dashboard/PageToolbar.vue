<script setup lang="ts">
/**
 * dashboard 布局内页顶栏（对齐 pages/index.vue 的 cp-toolbar）：
 * 品牌（点击回首页）+ 状态徽标 + 语言互切 + 主 CTA（/opentavern）。
 * 移动端侧栏隐藏、底部 tab 无语言项——顶栏是这些页面唯一的语言切换入口。
 */
import { useLocale } from '~/composables/useLocale';

const props = defineProps<{
  /** 状态徽标文案（如「在线 AI 酒馆 · 免登录」） */
  badge: string;
  /** 主 CTA 按钮文案（固定指向 /opentavern） */
  ctaLabel: string;
}>();

const { locale } = useI18n();
const { setLocale } = useLocale();
const isZh = computed(() => locale.value === 'zh-CN');

function toggleLocale() {
  setLocale(isZh.value ? 'en' : 'zh-CN');
}
</script>

<template>
  <header class="cp-toolbar">
    <NuxtLink :to="isZh ? '/zh-CN' : '/'" class="cp-brand">
      <span class="cp-brand-mark">RC</span>
      <span class="cp-brand-name">RoleChat AI</span>
      <span class="cp-status">
        <i class="cp-status-dot" />
        {{ props.badge }}
      </span>
    </NuxtLink>
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
        {{ props.ctaLabel }}
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped>
/* 全局 a 未做颜色重置，这里保持与 div 版 cp-brand 一致的观感 */
.cp-brand {
  color: inherit;
  text-decoration: none;
}
</style>
