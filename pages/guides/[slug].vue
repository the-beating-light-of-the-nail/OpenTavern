<script setup lang="ts">
import { getGuideBySlug } from '~/data';
const { t } = useI18n();
const { $i18n } = useNuxtApp();

const route = useRoute();
const slug = computed(() => String(route.params.slug));
const guide = computed(() => getGuideBySlug(slug.value, $i18n.locale.value));

if (!guide.value) {
  throw createError({ statusCode: 404, statusMessage: 'Guide not found', fatal: true });
}

const g = computed(() => guide.value!);

useSeoMeta({
  title: () => `${g.value.title} | RoleChat AI`,
  description: () => g.value.description,
  ogTitle: () => `${g.value.title} | RoleChat AI`,
  ogDescription: () => g.value.description,
});

// 结构化数据：Article（指南正文实体）+ BreadcrumbList（面包屑富结果）
const guideUrl = computed(() => absUrl(`/guides/${g.value.slug}`));
const jsonLd = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: g.value.title,
      description: g.value.description,
      url: guideUrl.value,
      inLanguage: $i18n.locale.value,
      datePublished: g.value.datePublished,
      dateModified: g.value.datePublished,
      author: { '@type': 'Organization', name: 'Open Tavern' },
      publisher: { '@type': 'Organization', name: 'Open Tavern' },
    }),
  },
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify(
      breadcrumbSchema([
        { name: t('breadcrumb_home'), path: '/' },
        { name: t('nav_guides'), path: '/guides' },
        { name: g.value.title, path: `/guides/${g.value.slug}` },
      ]),
    ),
  },
]);
useHead({ script: jsonLd });
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-2xl px-5 py-12">
      <NuxtLink to="/guides" class="rc-nav-link mb-6 inline-flex">{{ t('guide_all_guides') }}</NuxtLink>

      <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-4xl">{{ g.title }}</h1>
      <p class="mt-4 leading-relaxed text-plum-muted">{{ g.description }}</p>

      <!-- Article content -->
      <article class="mt-10 space-y-10">
        <section v-for="(s, i) in g.sections" :key="i">
          <h2 class="text-xl font-bold">{{ s.heading }}</h2>
          <div class="mt-3 space-y-3">
            <p v-for="(p, j) in s.paragraphs" :key="j" class="leading-relaxed text-plum-muted">{{ p }}</p>
          </div>
        </section>
      </article>

      <!-- Internal links -->
      <section class="mt-12 rounded-2xl border border-border-warm bg-rose-tint p-6">
        <h2 class="text-base font-bold">{{ t('guide_keep_going') }}</h2>
        <div class="mt-4 flex flex-wrap gap-3">
          <NuxtLink
            v-for="l in g.internalLinks"
            :key="l.to"
            :to="l.to"
            class="rc-btn-ghost text-sm"
          >{{ l.label }}</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
