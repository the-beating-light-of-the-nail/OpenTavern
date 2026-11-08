<script setup lang="ts">
const { locale } = useI18n();

// 全站只保留英文与简体中文首页；zh-TW 界面回落到英文首页，避免 /zh-TW 410
const homePath = computed(() => (locale.value === 'zh-CN' ? '/zh-CN/' : '/'));
const isZh = computed(() => locale.value === 'zh-CN' || locale.value === 'zh-TW');
</script>

<template>
  <NuxtLink :to="homePath" class="ot-home-btn" :title="isZh ? '返回首页' : 'Back to home'">
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
    <span class="ot-home-label">{{ isZh ? '首页' : 'Home' }}</span>
  </NuxtLink>
</template>

<style scoped>
.ot-home-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 2rem;
  padding: 0 0.65rem;
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--color-primary) 38%, var(--color-border));
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 0.18s ease, border-color 0.18s ease;
}

.ot-home-btn:hover {
  border-color: color-mix(in srgb, var(--color-primary) 60%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 18%, var(--color-surface));
}

@media (max-width: 639px) {
  .ot-home-btn {
    width: 2rem;
    padding: 0;
  }

  .ot-home-label {
    display: none;
  }
}
</style>
