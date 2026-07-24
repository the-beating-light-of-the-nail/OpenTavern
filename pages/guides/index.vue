<script setup lang="ts">
import { useGuides } from '~/data';
const { t } = useI18n();

useSeoMeta({
  title: () => t('guides_seo_title'),
  description: () => t('guides_seo_desc'),
  ogTitle: () => t('guides_seo_title'),
  ogDescription: () => t('guides_seo_desc'),
});

const guides = useGuides();
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-14">
      <div class="mb-10 text-center">
        <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-4xl">{{ t('guides_title') }}</h1>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">
          {{ t('guides_desc') }}
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <NuxtLink v-for="g in guides" :key="g.slug" :to="`/guides/${g.slug}`" class="rc-card group block p-6">
          <h2 class="text-lg font-bold group-hover:text-rose-accent">{{ g.title }}</h2>
          <p class="mt-2 leading-relaxed text-plum-muted">{{ g.description }}</p>
          <p class="mt-3 text-xs font-semibold text-rose-accent/70">{{ t('guides_read') }}</p>
        </NuxtLink>

        <NuxtLink to="/where-to-find-character-cards" class="rc-card group block p-6">
          <h2 class="text-lg font-bold group-hover:text-rose-accent">{{ t('guides_where_to_find_title') }}</h2>
          <p class="mt-2 leading-relaxed text-plum-muted">{{ t('guides_where_to_find_desc') }}</p>
          <p class="mt-3 text-xs font-semibold text-rose-accent/70">{{ t('guides_read') }}</p>
        </NuxtLink>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink to="/characters" class="rc-btn-primary">{{ t('guides_browse_characters') }}</NuxtLink>
      </div>
    </main>
  </div>
</template>
