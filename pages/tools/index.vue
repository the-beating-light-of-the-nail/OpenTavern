<script setup lang="ts">
import { SITE_TOOLS, LOCAL_TAVERNS } from '~/data/tools';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('tools_seo_title'),
  description: () => t('tools_seo_desc'),
  ogTitle: () => t('tools_seo_title'),
  ogDescription: () => t('tools_seo_desc'),
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
        ]),
      ),
    },
  ],
});

const picks = computed(() => [t('tools_pick_1'), t('tools_pick_2'), t('tools_pick_3'), t('tools_pick_4')]);
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <!-- Hero -->
    <section class="rc-hero-bg relative overflow-hidden">
      <div class="relative z-10 mx-auto max-w-3xl px-5 py-20 text-center sm:py-24">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-rose-tint px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('tools_badge') }}
        </div>
        <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-4xl">{{ t('tools_title') }}</h1>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('tools_desc') }}</p>
      </div>
    </section>

    <!-- 站内工具 -->
    <section class="mx-auto max-w-5xl px-5 py-16">
      <div class="mb-10 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('tools_site_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('tools_site_desc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <NuxtLink
          v-for="tool in SITE_TOOLS"
          :key="tool.slug"
          :to="localePath(tool.to)"
          class="rc-card group flex flex-col p-6"
        >
          <div class="flex items-center justify-between gap-3">
            <h3 class="font-display text-xl font-semibold tracking-wide group-hover:text-rose-accent">{{ tool.name }}</h3>
            <span v-if="tool.license" class="rc-tag">{{ tool.license }}</span>
          </div>
          <span class="mt-2 text-xs font-semibold text-rose-accent">{{ t(tool.copy.tag) }}</span>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-plum-muted">{{ t(tool.copy.desc) }}</p>
          <span class="mt-5 inline-flex self-start text-sm font-bold text-rose-deep transition-colors group-hover:text-rose-accent">
            {{ t(tool.copy.cta) }} →
          </span>
        </NuxtLink>
      </div>
    </section>

    <!-- 本地酒馆目录（第三方外链） -->
    <section class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-16">
        <div class="mb-10 text-center">
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('tools_dir_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('tools_dir_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="tv in LOCAL_TAVERNS" :key="tv.slug" class="rc-card flex flex-col p-5">
            <div class="flex items-center justify-between gap-2">
              <h3 class="font-display text-lg font-semibold tracking-wide">{{ tv.name }}</h3>
              <span v-if="tv.license" class="rc-tag">{{ tv.license }}</span>
            </div>
            <span class="mt-2 text-xs font-semibold text-rose-accent">{{ t(`tools_dir_${tv.slug}_tag`) }}</span>
            <p class="mt-3 flex-1 text-sm leading-relaxed text-plum-muted">{{ t(`tools_dir_${tv.slug}_desc`) }}</p>
            <a
              :href="tv.href"
              target="_blank"
              rel="noopener"
              class="rc-btn-ghost rc-btn-compact mt-4 inline-flex self-start"
            >{{ t('tools_visit') }} ↗</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 怎么选 -->
    <section class="mx-auto max-w-3xl px-5 py-16">
      <div class="mb-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('tools_pick_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
      </div>
      <div class="space-y-4">
        <div v-for="(p, i) in picks" :key="i" class="rc-card flex items-center gap-4 p-5">
          <div class="rc-avatar-fill flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-sm font-bold">{{ i + 1 }}</div>
          <p class="text-sm leading-relaxed text-plum-muted">{{ p }}</p>
        </div>
      </div>
    </section>

    <!-- Disclaimer -->
    <section class="mx-auto max-w-3xl px-5 pb-16">
      <div class="rounded-2xl border border-border-warm bg-rose-tint p-6">
        <h2 class="text-base font-bold">{{ t('tools_disclaimer_title') }}</h2>
        <p class="mt-3 text-sm leading-relaxed text-plum-muted">{{ t('tools_disclaimer_body') }}</p>
      </div>
    </section>

    <!-- CTA -->
    <section class="rc-hero-bg border-t border-border-warm">
      <div class="mx-auto max-w-3xl px-5 py-16 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('tools_cta_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('tools_cta_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('home_cta_explore') }}</NuxtLink>
        </div>
      </div>
    </section>

    <SiteFooter />
  </div>
</template>
