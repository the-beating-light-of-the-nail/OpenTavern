<script setup lang="ts">
import type { CharacterSeo } from '~/types/seo';

/**
 * 统一角色卡：seo 模式（浅色 Romance Light）与 app 模式（深色 glass）自适配。
 * mode="seo"  → 白色 rc-card + plum 文字（SEO 页面）
 * mode="app"  → 深色 glass + zinc 文字（App 公共库）
 * 标签去重：过滤与 category 重复的 tag，最多展示 3 个，超出显示 +N。
 */
const props = withDefaults(defineProps<{
  c: CharacterSeo;
  mode?: 'seo' | 'app';
  showProfileButton?: boolean;
  showStartButton?: boolean;
}>(), {
  mode: 'seo',
  showProfileButton: true,
  showStartButton: true,
});

const { t } = useI18n();
const localePath = useLocalePath();
const favs = useFavoritesStore();
onMounted(() => favs.load());

/** 去重 + 截断：过滤 category 重复，取前 3 */
const displayTags = computed(() => {
  const deduped = (props.c.tags || []).filter((t) => t.toLowerCase() !== props.c.category.toLowerCase());
  const limited = deduped.slice(0, 3);
  const extra = deduped.length > 3 ? `+${deduped.length - 3}` : null;
  return { limited, extra };
});

const isSeo = computed(() => props.mode === 'seo');
const isApp = computed(() => props.mode === 'app');
</script>

<template>
  <!-- seo 模式 -->
  <div v-if="isSeo" class="rc-card relative flex flex-col overflow-hidden">
    <div class="rc-card-accent" />
    <!-- 收藏心标（本地存储，无账号） -->
    <button
      type="button"
      class="absolute right-2.5 top-2.5 z-10 text-lg leading-none transition-transform hover:scale-110"
      :class="favs.has(c.slug) ? 'text-rose-accent' : 'text-plum-faint/70 hover:text-plum-muted'"
      :aria-label="t('char_fav_aria')"
      :aria-pressed="favs.has(c.slug)"
      @click.stop.prevent="favs.toggle(c.slug)"
    >{{ favs.has(c.slug) ? '♥' : '♡' }}</button>
    <div class="flex flex-col p-5">
      <div class="flex items-center gap-3.5">
        <CharAvatar :avatar="c.avatar" :initial="c.initial" size="lg" />
        <div class="min-w-0">
          <h3 class="font-display truncate text-lg font-semibold tracking-wide text-plum">{{ c.name }}</h3>
          <p class="truncate text-xs text-rose-accent">{{ c.archetype }}</p>
        </div>
      </div>
      <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-plum-muted">{{ c.tagline }}</p>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span class="rc-tag">{{ c.category }}</span>
        <span v-for="t in displayTags.limited" :key="t" class="rc-tag">{{ t }}</span>
        <span v-if="displayTags.extra" class="rc-tag opacity-70">{{ displayTags.extra }}</span>
      </div>
      <div v-if="showProfileButton || showStartButton" class="mt-4 flex gap-2">
        <NuxtLink v-if="showProfileButton" :to="localePath(`/characters/${c.slug}`)" class="rc-btn-ghost rc-btn-compact flex-1">
          {{ t('view_profile') }}
        </NuxtLink>
        <NuxtLink v-if="showStartButton" :to="localePath(`/app?character=${c.slug}`)" class="rc-btn-primary rc-btn-compact flex-1">
          {{ t('start_chat') }}
        </NuxtLink>
      </div>
    </div>
  </div>

  <!-- app 模式 -->
  <div v-else-if="isApp" class="ui-panel rounded-2xl flex flex-col overflow-hidden transition-all hover:border-[var(--color-primary)]">
    <div class="rc-card-accent" />
    <div class="flex flex-col p-5">
      <div class="flex items-center gap-3.5">
        <CharAvatar :avatar="c.avatar" :initial="c.initial" size="lg" />
        <div class="min-w-0">
          <h3 class="font-display truncate text-lg font-semibold tracking-wide" style="color:var(--color-text)">{{ c.name }}</h3>
          <p class="truncate text-xs" style="color:var(--color-primary)">{{ c.archetype }}</p>
        </div>
      </div>
      <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed" style="color:var(--color-text-muted)">{{ c.tagline }}</p>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span class="char-tag">{{ c.category }}</span>
        <span v-for="t in displayTags.limited" :key="t" class="char-tag">{{ t }}</span>
        <span v-if="displayTags.extra" class="char-tag opacity-70">{{ displayTags.extra }}</span>
      </div>
      <div v-if="showProfileButton || showStartButton" class="mt-4 flex gap-2">
        <NuxtLink v-if="showProfileButton" :to="localePath(`/characters/${c.slug}`)" class="ui-button-ghost ui-button-sm flex-1">
          {{ t('view_profile') }}
        </NuxtLink>
        <NuxtLink v-if="showStartButton" :to="localePath(`/app?character=${c.slug}`)" class="ui-button-primary ui-button-sm flex-1">
          {{ t('start_chat') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
