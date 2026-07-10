<script setup lang="ts">
import { useAppStore } from '~/stores/app';

const store = useAppStore();
const { t, locale, locales, setLocale } = useI18n();

const activeTab = ref<'my' | 'public'>('my');
const search = ref('');
const filter = ref<'all' | 'male' | 'female'>('all');

const availableLocales = computed(() => (locales.value as any[]).map((l) => ({ code: l.code, name: l.name })));

function switchLang(code: string) {
  setLocale(code as any);
  if (store.settings) store.settings.lang = code;
}

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
        <button class="tab-btn px-4 py-2 text-sm font-medium border-b-2 transition-all" :class="activeTab === 'my' ? 'active border-amber-500 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'" @click="activeTab = 'my'">{{ t('tab_my_cards') }}</button>
        <button class="tab-btn px-4 py-2 text-sm font-medium border-b-2 border-transparent transition-all" :class="activeTab === 'public' ? 'active border-amber-500 text-amber-400' : 'text-zinc-400 hover:text-zinc-200'" @click="activeTab = 'public'">{{ t('tab_public') }}</button>
      </div>
      <!-- Search + filter -->
      <div class="mt-2 flex items-center gap-2">
        <input v-model="search" type="text" class="flex-1 px-3 py-1.5 text-sm glass rounded-xl placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40" :placeholder="t('library_search_placeholder')">
        <div class="flex gap-1 text-xs">
          <button class="filter-btn px-2 py-1 rounded transition-all" :class="filter === 'all' ? 'bg-amber-500/20 text-amber-300 active' : 'bg-white/10 text-zinc-300'" @click="filter = 'all'">{{ t('filter_all') }}</button>
          <button class="filter-btn px-2 py-1 rounded transition-all" :class="filter === 'male' ? 'bg-amber-500/20 text-amber-300 active' : 'bg-white/10 text-zinc-300'" @click="filter = 'male'">{{ t('filter_male') }}</button>
          <button class="filter-btn px-2 py-1 rounded transition-all" :class="filter === 'female' ? 'bg-amber-500/20 text-amber-300 active' : 'bg-white/10 text-zinc-300'" @click="filter = 'female'">{{ t('filter_female') }}</button>
        </div>
      </div>
    </div>

    <!-- Grids -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-show="activeTab === 'my'" id="myCardsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <CardItem v-for="c in myCards" :key="c.id" :name="c.name" :tags="c.tags" :description="c.description" :image="c.image" />
        <div v-if="!myCards.length" class="col-span-full text-center text-zinc-500 text-sm py-12">{{ t('char_card_empty') }}</div>
      </div>
      <div v-show="activeTab === 'public'" id="publicCardsGrid" class="hidden grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div class="col-span-full text-center text-zinc-500 text-sm py-12">{{ t('tab_public') }}</div>
      </div>
    </div>
  </div>
</template>
