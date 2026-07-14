<script setup lang="ts">
import { characters } from '~/data/characters';
import { collections } from '~/data/collections';
import type { CharacterSeo } from '~/types/seo';

useSeoMeta({
  title: 'Characters — RoleChat AI',
  description:
    'Browse original romance and fantasy AI characters on RoleChat AI. Cold doctors, brooding vampires, exhausted idols, sharp detectives and more. Private roleplay with your own AI key.',
  ogTitle: 'Characters — RoleChat AI',
  ogDescription:
    'Browse original romance and fantasy AI characters on RoleChat AI. Chat in seconds with your own AI key.',
});

// 标签筛选（纯前端，数据已 SSR 进 HTML）
const allTags = computed(() => {
  const set = new Set<string>();
  for (const c of characters) for (const t of c.tags) set.add(t);
  return [...set].sort();
});

const activeTag = ref<string | null>(null);
const search = ref('');

const filtered = computed<CharacterSeo[]>(() => {
  const q = search.value.trim().toLowerCase();
  return characters.filter((c) => {
    if (activeTag.value && !c.tags.includes(activeTag.value)) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.archetype.toLowerCase().includes(q) ||
      c.tags.some((t) => t.toLowerCase().includes(q))
    );
  });
});

function toggleTag(t: string) {
  activeTag.value = activeTag.value === t ? null : t;
}
</script>

<template>
  <div class="min-h-[100dvh] bg-zinc-950 text-zinc-100">
    <SiteHeader />

    <main class="mx-auto max-w-5xl px-5 py-14">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Characters</h1>
        <p class="mx-auto mt-3 max-w-xl text-zinc-400">
          Original romance and fantasy characters for private AI roleplay. Each one has his own voice, his own story,
          and his own way of falling for you. Pick one and start chatting in seconds.
        </p>
      </div>

      <!-- Search + tag filter -->
      <div class="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          v-model="search"
          type="text"
          placeholder="Search by name, archetype, or tag..."
          class="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-amber-500/40 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
        >
      </div>
      <div class="mb-10 flex flex-wrap gap-1.5">
        <button
          class="rc-tag"
          :class="activeTag === null ? 'ring-1 ring-amber-400/50' : 'opacity-70 hover:opacity-100'"
          @click="activeTag = null"
        >All</button>
        <button
          v-for="t in allTags"
          :key="t"
          class="rc-tag"
          :class="activeTag === t ? 'ring-1 ring-amber-400/50' : 'opacity-70 hover:opacity-100'"
          @click="toggleTag(t)"
        >{{ t }}</button>
      </div>

      <!-- Grid -->
      <div v-if="filtered.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="c in filtered" :key="c.slug" :to="`/characters/${c.slug}`" class="rc-card group block p-5">
          <div class="flex items-center gap-3">
            <div class="rc-avatar-fill flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-lg font-bold">{{ c.initial }}</div>
            <div class="min-w-0">
              <h2 class="truncate text-base font-bold group-hover:text-amber-400">{{ c.name }}</h2>
              <p class="truncate text-xs text-amber-400/80">{{ c.archetype }}</p>
            </div>
          </div>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-zinc-400">{{ c.tagline }}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="t in c.tags.slice(0, 3)" :key="t" class="rc-tag">{{ t }}</span>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="py-16 text-center text-zinc-500">
        <p>No characters match your search.</p>
      </div>

      <!-- Collections -->
      <section class="mt-14">
        <h2 class="text-lg font-bold">Browse by collection</h2>
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <NuxtLink v-for="col in collections" :key="col.slug" :to="`/collections/${col.slug}`" class="rc-card group block p-5">
            <h3 class="text-base font-bold group-hover:text-amber-400">{{ col.title }}</h3>
            <p class="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-400">{{ col.intro }}</p>
            <p class="mt-3 text-xs font-semibold text-amber-400/70">{{ col.characterSlugs.length }} characters →</p>
          </NuxtLink>
        </div>
      </section>

      <div class="mt-14 text-center">
        <NuxtLink to="/app" class="rc-btn-primary">Start Chatting Now</NuxtLink>
      </div>
    </main>
  </div>
</template>
