<script setup lang="ts">
import { useCharacters, useCollections } from '~/data';
import type { CharacterSeo, CharacterCategory } from '~/types/seo';
const { t } = useI18n();

useSeoMeta({
  title: () => t('characters_seo_title'),
  description: () => t('characters_seo_desc'),
  ogTitle: () => t('characters_seo_title'),
  ogDescription: () => t('characters_seo_desc'),
});

// 大类（固定顺序，用于 category 筛选）；'All' 为筛选占位，渲染时走 i18n
const categories: (CharacterCategory | 'All')[] = ['All', 'Modern', 'Fantasy', 'Sci-Fi'];
const activeCategory = ref<CharacterCategory | 'All'>('All');
/** 分类标签本地化：'All' 走 filter_all；具体分类走 category_<key>（en 下与原值一致） */
function catLabel(cat: CharacterCategory | 'All'): string {
  if (cat === 'All') return t('filter_all');
  const key = cat.toLowerCase().replace('-', '_');
  return t(`category_${key}`);
}

// 数据随当前 locale 响应式切换
const characters = useCharacters();
const collections = useCollections();

// 标签筛选（纯前端，数据已 SSR 进 HTML）
const allTags = computed(() => {
  const set = new Set<string>();
  for (const c of characters.value) for (const tg of c.tags) set.add(tg);
  return [...set].sort();
});

const activeTag = ref<string | null>(null);
const search = ref('');

const filtered = computed<CharacterSeo[]>(() => {
  const q = search.value.trim().toLowerCase();
  return characters.value.filter((c) => {
    if (activeCategory.value !== 'All' && c.category !== activeCategory.value) return false;
    if (activeTag.value && !c.tags.includes(activeTag.value)) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.archetype.toLowerCase().includes(q) ||
      c.tags.some((tt) => tt.toLowerCase().includes(q)) ||
      c.personalityTags.some((tt) => tt.toLowerCase().includes(q))
    );
  });
});

function toggleTag(tt: string) {
  activeTag.value = activeTag.value === tt ? null : tt;
}
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-5xl px-5 py-14">
      <div class="mb-10 text-center">
        <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-4xl">{{ t('characters_title') }}</h1>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">
          {{ t('characters_desc') }}
        </p>
      </div>

      <!-- Search -->
      <div class="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          v-model="search"
          type="text"
          :placeholder="t('characters_search_placeholder')"
          class="flex-1 rounded-xl border border-champagne/40 bg-rose-tint px-4 py-2.5 text-sm text-plum focus:border-rose-accent focus:outline-none focus:ring-1 focus:ring-rose-accent/40"
        >
      </div>

      <!-- Category filter -->
      <div class="mb-4 flex flex-wrap gap-1.5">
        <button
          v-for="cat in categories"
          :key="cat"
          class="rounded-lg px-3 py-1 text-xs font-semibold transition-all"
          :class="activeCategory === cat ? 'bg-rose-accent/15 text-rose-accent ring-1 ring-amber-400/50' : 'bg-rose-tint text-plum-muted hover:bg-rose-tint'"
          @click="activeCategory = cat"
        >{{ catLabel(cat) }}</button>
      </div>

      <!-- Tag filter -->
      <div class="mb-10 flex flex-wrap gap-1.5">
        <button
          class="rc-tag"
          :class="activeTag === null ? 'ring-1 ring-amber-400/50' : 'opacity-70 hover:opacity-100'"
          @click="activeTag = null"
        >{{ t('characters_all_tags') }}</button>
        <button
          v-for="tt in allTags"
          :key="tt"
          class="rc-tag"
          :class="activeTag === tt ? 'ring-1 ring-amber-400/50' : 'opacity-70 hover:opacity-100'"
          @click="toggleTag(tt)"
        >{{ tt }}</button>
      </div>

      <!-- Grid -->
      <div v-if="filtered.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <PublicCardItem v-for="c in filtered" :key="c.slug" :c="c" />
      </div>
      <div v-else class="py-16 text-center text-plum-faint">
        <p>{{ t('no_characters_match') }}</p>
      </div>

      <!-- Collections -->
      <section class="mt-14">
        <h2 class="text-lg font-bold">{{ t('characters_browse_collections') }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NuxtLink v-for="col in collections" :key="col.slug" :to="`/collections/${col.slug}`" class="rc-card group block p-5">
            <h3 class="text-base font-bold group-hover:text-rose-accent">{{ col.title }}</h3>
            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-plum-muted">{{ col.intro }}</p>
            <p class="mt-3 text-xs font-semibold text-rose-accent/70">{{ col.characterSlugs.length }} {{ t('characters_count_suffix') }}</p>
          </NuxtLink>
        </div>
      </section>

      <div class="mt-14 text-center">
        <NuxtLink to="/app" class="rc-btn-primary">{{ t('characters_start_now') }}</NuxtLink>
      </div>
    </main>
  </div>
</template>
