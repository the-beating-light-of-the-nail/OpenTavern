<script setup lang="ts">
import { getCharacterBySlug, characters } from '~/data/characters';
const { t } = useI18n();

const route = useRoute();
const slug = computed(() => String(route.params.slug));
const character = computed(() => getCharacterBySlug(slug.value));

// 未知 slug → 404（prerender 时会为已知 slug 生成静态页，未知走此抛错）
if (!character.value) {
  throw createError({ statusCode: 404, statusMessage: 'Character not found', fatal: true });
}

const c = character.value;

useSeoMeta({
  title: c.seoTitle,
  description: c.seoDescription,
  ogTitle: c.seoTitle,
  ogDescription: c.seoDescription,
});

// 结构化数据：WebPage（角色实体信号）+ BreadcrumbList（面包屑富结果）
const charUrl = absUrl(`/characters/${c.slug}`);
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: c.name,
        description: c.seoDescription,
        url: charUrl,
        inLanguage: 'en',
      }),
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Characters', path: '/characters' },
          { name: c.name, path: `/characters/${c.slug}` },
        ]),
      ),
    },
  ],
});

const related = computed(() =>
  c.relatedSlugs
    .map((s) => getCharacterBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x),
);
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-12">
      <NuxtLink to="/characters" class="rc-nav-link mb-6 inline-flex">{{ t('char_all_characters') }}</NuxtLink>

      <!-- Character header -->
      <div class="flex items-center gap-4">
        <CharAvatar :avatar="c.avatar" :initial="c.initial" size="lg" />
        <div class="min-w-0">
          <h1 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ c.name }}</h1>
          <p class="text-sm text-rose-accent">{{ c.archetype }}</p>
        </div>
      </div>

      <p class="mt-5 text-lg italic text-plum-light">{{ c.tagline }}</p>

      <!-- Meta + safety + tags -->
      <div class="mt-5 flex flex-wrap items-center gap-1.5">
        <span class="ui-chip-success rounded-full px-2.5 py-0.5 text-xs font-bold">{{ c.safetyLevel }}</span>
        <span class="rc-tag">{{ c.category }}</span>
        <span v-for="t in c.tags" :key="t" class="rc-tag">{{ t }}</span>
      </div>

      <!-- CTA -->
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink :to="`/app?character=${c.slug}`" class="rc-btn-primary">{{ t('char_start_private_chat') }}</NuxtLink>
        <NuxtLink to="/characters" class="rc-btn-ghost">{{ t('char_browse_others') }}</NuxtLink>
      </div>

      <!-- Description -->
      <section class="mt-10">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_about_prefix') }} {{ c.name }}</h2>
        <p class="mt-3 leading-relaxed text-plum-muted">{{ c.description }}</p>
      </section>

      <!-- Personality -->
      <section class="mt-8">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_personality') }}</h2>
        <p class="mt-3 leading-relaxed text-plum-muted">{{ c.personality }}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="pt in c.personalityTags" :key="pt" class="rounded-full bg-rose-tint px-2.5 py-0.5 text-[0.68rem] font-medium text-plum-light">{{ pt }}</span>
        </div>
      </section>

      <!-- Relationship setup -->
      <section class="mt-8">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_how_you_meet') }}</h2>
        <p class="mt-3 leading-relaxed text-plum-muted">{{ c.relationshipSetup }}</p>
      </section>

      <!-- Scenario -->
      <section class="mt-8">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_world_scenario') }}</h2>
        <p class="mt-3 leading-relaxed text-plum-muted">{{ c.scenario }}</p>
      </section>

      <!-- Opening message -->
      <section class="mt-8">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_opening_message') }}</h2>
        <div class="mt-3 rounded-xl border border-border-warm bg-rose-tint p-5">
          <p class="whitespace-pre-wrap leading-relaxed text-plum-light">{{ c.openingMessage }}</p>
        </div>
      </section>

      <!-- Related characters -->
      <section v-if="related.length" class="mt-10">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_related') }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NuxtLink v-for="r in related" :key="r.slug" :to="`/characters/${r.slug}`" class="rc-card group flex items-center gap-3 p-4">
            <CharAvatar :avatar="r.avatar" :initial="r.initial" size="sm" />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold group-hover:text-rose-accent">{{ r.name }}</p>
              <p class="truncate text-xs text-plum-faint">{{ r.archetype }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-10">
        <h2 class="font-display text-lg font-semibold tracking-wide">{{ t('char_faq') }}</h2>
        <div class="rc-faq mt-4">
          <details v-for="f in c.faq" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- Footer CTA -->
      <section class="mt-12 rounded-2xl border border-border-warm bg-rose-tint p-8 text-center">
        <h2 class="font-display text-xl font-semibold tracking-wide">{{ t('char_ready_title', { name: c.name }) }}</h2>
        <p class="mx-auto mt-2 max-w-md text-sm text-plum-muted">{{ t('char_ready_desc') }}</p>
        <NuxtLink :to="`/app?character=${c.slug}`" class="rc-btn-primary mt-5 inline-flex">{{ t('char_start_private_chat') }}</NuxtLink>
      </section>
    </main>
  </div>
</template>
