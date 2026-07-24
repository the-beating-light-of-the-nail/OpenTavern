<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useCharacters } from '~/data';
import type { CharacterSeo } from '~/types/seo';

const store = useAppStore();
const { t } = useI18n();

// 默认展示 Public（用户打开站点即可见公开角色，无需先理解导入/创建）
const activeTab = ref<'public' | 'my'>('public');
const search = ref('');

// 乙女向筛选标签：展示文案走 i18n，匹配逻辑用 norm() 归一化后包含匹配，
// 因此中文/英文任意 locale 下都能正确命中角色数据。
const otomeChips = computed(() => [
  { label: t('otome_chip_boyfriend'), needle: 'Boyfriend' },
  { label: t('otome_chip_ceo'), needle: 'CEO' },
  { label: t('otome_chip_doctor'), needle: 'Doctor' },
  { label: t('otome_chip_bodyguard'), needle: 'Bodyguard' },
  { label: t('otome_chip_vampire'), needle: 'Vampire' },
  { label: t('otome_chip_fantasy'), needle: 'Fantasy' },
  { label: t('otome_chip_slow_burn'), needle: 'Slow Burn' },
  { label: t('otome_chip_gentle'), needle: 'Gentle' },
  { label: t('otome_chip_possessive'), needle: 'Possessive' },
  { label: t('otome_chip_enemies_to_lovers'), needle: 'Enemies to Lovers' },
]);
const activeChip = ref<string | null>(null);

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

// ---- Public（静态 SEO 角色，随当前 locale 响应式切换）----
const allCharacters = useCharacters();
const publicCards = computed<CharacterSeo[]>(() => {
  const q = search.value.trim().toLowerCase();
  return allCharacters.value.filter((c) => {
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
      name: c.data?.name || c.name || t('default_untitled'),
      tags: c.data?.tags || c.tags || [],
      description: c.data?.description || c.description || '',
      image: c.data?.avatar || c.avatar,
    }))
    .filter((c) => !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.tags.some((tg: string) => tg.toLowerCase().includes(q)));
});

function openMenu() {
  store.sidebarOpen = true;
}

function onSelectMyCard(cardVm: CardVM) {
  const entry = store.characters[cardVm.id];
  if (entry) {
    store.createConversation(entry);
  }
}
</script>

<template>
  <div id="libraryView" class="flex-1 flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="ui-topbar flex-shrink-0 px-5 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button class="hamburger-btn" aria-label="Menu" @click="openMenu">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
            <h2 class="text-lg font-bold">{{ t('library_title') }}</h2>
          </div>
        </div>
      <!-- Tabs -->
      <div class="mt-3 flex gap-1 border-b border-[var(--color-border)]">
        <button class="tab-btn px-4 py-2 text-sm font-medium border-b-2 transition-all" :class="activeTab === 'public' ? 'active' : ''" @click="activeTab = 'public'">{{ t('tab_public') }}</button>
        <button class="tab-btn px-4 py-2 text-sm font-medium border-b-2 transition-all" :class="activeTab === 'my' ? 'active' : ''" @click="activeTab = 'my'">{{ t('tab_my_cards') }}</button>
      </div>
      <!-- Search -->
      <div class="mt-2 flex items-center gap-2">
        <input v-model="search" type="text" class="ui-input ui-input-compact" :placeholder="t('library_search_placeholder')">
      </div>
      <!-- Otome chips（仅 public tab） -->
      <div v-if="activeTab === 'public'" class="mt-2 flex flex-wrap gap-1">
        <button
          class="filter-btn ui-chip ui-chip-sm transition-all"
          :class="activeChip === null ? 'active' : ''"
          @click="activeChip = null"
        >{{ t('filter_all') }}</button>
        <button
          v-for="chip in otomeChips"
          :key="chip.needle"
          class="filter-btn ui-chip ui-chip-sm transition-all"
          :class="activeChip === chip.needle ? 'active' : ''"
          @click="activeChip = activeChip === chip.needle ? null : chip.needle"
        >{{ chip.label }}</button>
      </div>
    </div>

    <!-- Grids -->
    <div class="flex-1 overflow-y-auto p-4">
      <!-- Public（注意：不可再有 hidden class 与 v-show 冲突） -->
      <div v-show="activeTab === 'public'" id="publicCardsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PublicCardItem v-for="c in publicCards" :key="c.slug" :c="c" mode="app" />
        <div v-if="!publicCards.length" class="col-span-full text-center text-sm py-12" style="color:var(--color-text-muted)">{{ t('no_characters_match') }}</div>
      </div>
      <!-- My Cards -->
      <div v-show="activeTab === 'my'" id="myCardsGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <CardItem v-for="c in myCards" :key="c.id" :name="c.name" :tags="c.tags" :description="c.description" :image="c.image" @select="onSelectMyCard(c)" />
        <div v-if="!myCards.length" class="col-span-full text-center text-sm py-12" style="color:var(--color-text-muted)">{{ t('char_card_empty') }}</div>
      </div>
    </div>
  </div>
</template>
