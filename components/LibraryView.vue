<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { characters } from '~/data/characters';
import type { CharacterSeo } from '~/types/seo';

const store = useAppStore();
const { t, locale, locales, setLocale } = useI18n();

// 默认展示 Public（用户打开站点即可见公开角色，无需先理解导入/创建）
const activeTab = ref<'public' | 'my'>('public');
const search = ref('');

// 乙女向筛选标签（灵活匹配 archetype/category/tags/personalityTags/tagline）
const otomeChips = [
  'Boyfriend', 'CEO', 'Doctor', 'Bodyguard', 'Vampire',
  'Fantasy', 'Slow Burn', 'Gentle', 'Possessive', 'Enemies to Lovers',
];
const activeChip = ref<string | null>(null);

const availableLocales = computed(() => (locales.value as any[]).map((l) => ({ code: l.code, name: l.name })));

function switchLang(code: string) {
  setLocale(code as any);
  if (store.settings) store.settings.lang = code;
}

/** 规范化：去标点、小写，用于 chip 包含匹配（如 'Enemies-to-Lovers' ↔ 'Enemies to Lovers'） */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

/** 某角色是否匹配当前 chip（对 archetype/category/tags/personalityTags/tagline 做包含匹配） */
function matchesChip(c: CharacterSeo, chip: string): boolean {
  const needle = norm(chip);
  if (!needle) return true;
  const haystack = [
    c.archetype, c.category, c.tagline, c.name,
    ...c.tags, ...c.personalityTags,
  ].map(norm);
  return haystack.some((h) => h.includes(needle));
}

// ---- Public（静态 SEO 角色）----
const publicCards = computed<CharacterSeo[]>(() => {
  const q = search.value.trim().toLowerCase();
  return characters.filter((c) => {
    if (activeChip.value && !matchesChip(c, activeChip.value)) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.tagline.toLowerCase().includes(q) ||
      c.archetype.toLowerCase().includes(q) ||
      c.tags.some((x) => x.toLowerCase().includes(q)) ||
      c.personalityTags.some((x) => x.toLowerCase().includes(q))
    );
  });
});

// ---- My Cards（用户导入的角色卡）----
interface CardVM { id: string; name: string; tags: string[]; description: string; image?: string }

const myCards = computed<CardVM[]>(() => {
  const q = search.value.trim().toLowerCase();
  return Object.values(store.characters || {})
    .map((c: any): CardVM => ({
      id: c.id ?? c.data?.name ?? Math.random().toString(36),
      name: c.data?.name || c.name || 'Untitled',
      tags: c.data?.tags || c.tags || [],
      description: c.data?.description || c.description || '',
      image: c.data?.avatar || c.avatar,
    }))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some((tg: string) => tg.toLowerCase().includes(q)));
});

function openMenu() {
  store.sidebarOpen = true;
}
</script>

<template>
  <div id="libraryView" class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="flex-shrink-0 px-5 py-3 border-b border-white/5 bg-zinc-950/15 backdrop-blur-2xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button class="hamburger-btn" aria-label="Menu" @click="openMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </button>
          <h2 class="text-lg font-bold">{{ t('library_title') }}</h2>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="flex items-center glass rounded-xl p-0.5 border-white/5">
            <button
              v-for="l in availableLocales"
              :key="l.code"
              class="lang-btn px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              :class="locale === l.code ? 'active text-zinc-900' : 'text-zinc-400'"
              @click="switchLang(l.code)"
            >{{ l.name }}</button>
          </div>

        </div>
      </div>
      <!-- Tabs -->
      <div class="mt-3 flex gap-1 border-b border-white/10">
        <button class="tab-btn px-4 py-2 text-sm font-medium border-b-2 transition-all" :class="activeTab === 'public' ? 'active border-amber-500 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'" @click="activeTab = 'public'">{{ t('tab_public') }}</button>
        <button class="tab-btn px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-all" :class="activeTab === 'my' ? 'active border-amber-500 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'" @click="activeTab = 'my'">{{ t('tab_my_cards') }}</button>
      </div>
      <!-- Search -->
      <div class="mt-2 flex items-center gap-2">
        <input v-model="search" type="text" class="flex-1 px-3 py-1.5 text-sm glass rounded-xl placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40" :placeholder="t('library_search_placeholder')">
      </div>
      <!-- Otome chips（仅 public tab） -->
      <div v-if="activeTab === 'public'" class="mt-2 flex flex-wrap gap-1">
        <button
          class="filter-btn px-2 py-1 rounded text-[11px] transition-all"
          :class="activeChip === null ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-zinc-300 hover:bg-white/15'"
          @click="activeChip = null"
        >All</button>
        <button
          v-for="chip in otomeChips"
          :key="chip"
          class="filter-btn px-2 py-1 rounded text-[11px] transition-all"
          :class="activeChip === chip ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-zinc-300 hover:bg-white/15'"
          @click="activeChip = activeChip === chip ? null : chip"
        >{{ chip }}</button>
      </div>
    </div>

    <!-- Grids -->
    <div class="flex-1 overflow-y-auto p-4">
      <!-- Public（注意：不可再有 hidden class 与 v-show 冲突） -->
      <div v-show="activeTab === 'public'" id="publicCardsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PublicCardItem v-for="c in publicCards" :key="c.slug" :c="c" />
        <div v-if="!publicCards.length" class="col-span-full text-center text-zinc-500 text-sm py-12">No characters match your search.</div>
      </div>
      <!-- My Cards -->
      <div v-show="activeTab === 'my'" id="myCardsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <CardItem v-for="c in myCards" :key="c.id" :name="c.name" :tags="c.tags" :description="c.description" :image="c.image" />
        <div v-if="!myCards.length" class="col-span-full text-center text-zinc-500 text-sm py-12">{{ t('char_card_empty') }}</div>
      </div>
    </div>
  </div>
</template>
