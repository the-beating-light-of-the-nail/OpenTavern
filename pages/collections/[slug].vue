<script setup lang="ts">
import { getCollectionBySlug } from '~/data/collections';
import { getCharacterBySlug } from '~/data/characters';
const { t } = useI18n();

const route = useRoute();
const slug = computed(() => String(route.params.slug));
const collection = computed(() => getCollectionBySlug(slug.value));

if (!collection.value) {
  throw createError({ statusCode: 404, statusMessage: 'Collection not found', fatal: true });
}

const col = collection.value;

useSeoMeta({
  title: `${col.title} | RoleChat AI`,
  description: col.seoDescription,
  ogTitle: `${col.title} | RoleChat AI`,
  ogDescription: col.seoDescription,
});

const members = computed(() =>
  col.characterSlugs
    .map((s) => getCharacterBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x),
);
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-12">
      <NuxtLink to="/characters" class="rc-nav-link mb-6 inline-flex">{{ t('collection_all_characters') }}</NuxtLink>

      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">{{ col.title }}</h1>
      <p class="mt-4 leading-relaxed text-plum-muted">{{ col.intro }}</p>

      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink to="/app" class="rc-btn-primary">{{ t('collection_start_chatting') }}</NuxtLink>
        <NuxtLink to="/characters" class="rc-btn-ghost">{{ t('collection_browse_all') }}</NuxtLink>
      </div>

      <!-- Character list -->
      <section class="mt-10">
        <h2 class="text-lg font-bold">{{ t('collection_chars_in') }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NuxtLink v-for="m in members" :key="m.slug" :to="`/characters/${m.slug}`" class="rc-card group block p-5">
            <div class="flex items-center gap-3">
              <div class="rc-avatar-fill flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold">{{ m.initial }}</div>
              <div class="min-w-0">
                <h3 class="truncate text-base font-bold group-hover:text-rose-accent">{{ m.name }}</h3>
                <p class="truncate text-xs text-rose-accent">{{ m.archetype }}</p>
              </div>
            </div>
            <p class="mt-3 line-clamp-2 text-sm leading-relaxed text-plum-muted">{{ m.tagline }}</p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="t in m.tags.slice(0, 3)" :key="t" class="rc-tag">{{ t }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
