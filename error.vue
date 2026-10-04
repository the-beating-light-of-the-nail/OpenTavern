<script setup lang="ts">
/**
 * 全站错误页（404 / 500 等）—— 与其他页面同款工作台外壳。
 * error.vue 不经过 app.vue（广告/全局 SEO 不注入），但插件上下文可用，i18n 正常。
 */
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const { t } = useI18n();
const localePath = useLocalePath();

const is404 = computed(() => props.error.statusCode === 404);

const title = computed(() =>
  is404.value ? t('err_404_title') : `${t('err_generic_title')} (${props.error.statusCode})`,
);

useSeoMeta({ title: () => title.value });

function goHome() {
  clearError({ redirect: localePath('/') });
}
</script>

<template>
  <WorkbenchShell>
    <div class="mx-auto max-w-2xl px-5 py-24 text-center">
      <p class="font-display text-6xl font-bold tracking-tight text-plum-faint">{{ error.statusCode }}</p>
      <h1 class="font-display mt-4 text-2xl font-semibold tracking-wide sm:text-3xl">{{ title }}</h1>
      <div class="orn-divider" aria-hidden="true">✦</div>
      <p class="mx-auto mt-3 max-w-xl text-plum-muted">
        {{ is404 ? t('err_404_desc') : t('err_generic_desc') }}
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button type="button" class="rc-btn-primary" @click="goHome">{{ t('err_back_home') }}</button>
      </div>
    </div>
  </WorkbenchShell>
</template>
