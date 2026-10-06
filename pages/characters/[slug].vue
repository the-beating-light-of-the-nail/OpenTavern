<script setup lang="ts">
import { getCharacterBySlug } from '~/data';
import { downloadJson, safeFilename } from '~/utils/st/export';
import { useFavoritesStore } from '~/stores/favorites';
const { t } = useI18n();
const localePath = useLocalePath();
const { $i18n } = useNuxtApp();

const route = useRoute();
const slug = computed(() => String(route.params.slug));
// 按当前 locale 取角色数据（locale 切换时自动重算）
const character = computed(() => getCharacterBySlug(slug.value, $i18n.locale.value));

// 未知 slug → 404（prerender 时会为已知 slug 生成静态页，未知走此抛错）
if (!character.value) {
  throw createError({ statusCode: 404, statusMessage: 'Character not found', fatal: true });
}

const c = computed(() => character.value!);

useSeoMeta({
  title: () => c.value.seoTitle,
  description: () => c.value.seoDescription,
  ogTitle: () => c.value.seoTitle,
  ogDescription: () => c.value.seoDescription,
  // 每角色专属分享图（scripts/generate-character-og.mjs 生成）
  ogImage: absUrl(`/og/characters/${c.value.slug}.png`),
  twitterImage: absUrl(`/og/characters/${c.value.slug}.png`),
});

// 结构化数据：WebPage（角色实体信号）+ BreadcrumbList（面包屑富结果）
const charUrl = computed(() => absUrl(`/characters/${c.value.slug}`));
const jsonLd = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: c.value.name,
      description: c.value.seoDescription,
      url: charUrl.value,
      inLanguage: $i18n.locale.value,
    }),
  },
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify(
      breadcrumbSchema([
        { name: t('breadcrumb_home'), path: '/' },
        { name: t('nav_characters'), path: '/characters' },
        { name: c.value.name, path: `/characters/${c.value.slug}` },
      ]),
    ),
  },
]);
useHead({ script: jsonLd });

const related = computed(() =>
  c.value.relatedSlugs
    .map((s) => getCharacterBySlug(s, $i18n.locale.value))
    .filter((x): x is NonNullable<typeof x> => !!x),
);

// 展示标签：tags + personalityTags 去重，并剔除与 category 同名的标签（分类徽标单独渲染）
const allTags = computed(() =>
  [...new Set([...c.value.tags, ...c.value.personalityTags])].filter((t) => t !== c.value.category),
);

/* ------------------------------ 收藏与分享（纯本地，无账号体系） ------------------------------ */

const favs = useFavoritesStore();
onMounted(() => favs.load());
const isFav = computed(() => favs.has(c.value.slug));

const canNativeShare = ref(false);
onMounted(() => {
  canNativeShare.value = typeof navigator !== 'undefined' && typeof navigator.share === 'function';
});

const shareUrl = computed(() => charUrl.value);
const copied = ref(false);
let copiedTimer: ReturnType<typeof setTimeout> | null = null;

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copied.value = true;
    if (copiedTimer) clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied.value = false), 2000);
  } catch { /* 剪贴板权限被拒时静默 */ }
}

async function nativeShare() {
  try {
    await navigator.share({ title: c.value.name, text: c.value.tagline, url: shareUrl.value });
  } catch { /* 用户取消分享 */ }
}

const shareLinks = computed(() => {
  const u = encodeURIComponent(shareUrl.value);
  const txt = encodeURIComponent(`${c.value.name} — ${c.value.tagline}`);
  return {
    x: `https://twitter.com/intent/tweet?url=${u}&text=${txt}`,
    telegram: `https://t.me/share/url?url=${u}&text=${txt}`,
    reddit: `https://www.reddit.com/submit?url=${u}&title=${txt}`,
  };
});

// 角色卡下载：客户端即时生成 SillyTavern V3 卡（原创角色数据，无 IP 版权问题；全程本地不联网）
function downloadCard() {
  const ch = c.value;
  const card = {
    spec: 'chara_card_v3',
    spec_version: '3.0',
    create_date: new Date().toISOString().slice(0, 10),
    data: {
      name: ch.name,
      description: ch.description,
      personality: ch.personality,
      scenario: `${ch.scenario}\n\n${ch.relationshipSetup}`.trim(),
      first_mes: ch.openingMessage,
      mes_example: '',
      creator_notes: ch.tagline,
      system_prompt: '',
      post_history_instructions: '',
      alternate_greetings: [],
      tags: [...ch.tags, ...ch.personalityTags],
      creator: 'Open Tavern',
      character_version: '1.0',
      extensions: {},
    },
  };
  downloadJson(`${safeFilename(ch.name)}.json`, card);
}
</script>

<template>
  <WorkbenchShell active-cat="play">

    <main class="mx-auto max-w-3xl px-5 py-12">
      <NuxtLink :to="localePath('/characters')" class="rc-nav-link mb-6 inline-flex">{{ t('char_all_characters') }}</NuxtLink>

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
        <span v-for="t in allTags" :key="t" class="rc-tag">{{ t }}</span>
      </div>

      <!-- CTA -->
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink :to="localePath(`/app?character=${c.slug}`)" class="rc-btn-primary">{{ t('char_start_private_chat') }}</NuxtLink>
        <button type="button" class="rc-btn-ghost" :title="t('char_download_card_note')" @click="downloadCard">⬇ {{ t('char_download_card') }}</button>
        <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('char_browse_others') }}</NuxtLink>
      </div>
      <p class="mt-2 text-xs text-plum-faint">{{ t('char_download_card_note') }}</p>

      <!-- Favorite + share -->
      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rc-btn-ghost rc-btn-compact"
          :class="isFav ? '!border-rose-accent/60 !text-rose-accent' : ''"
          @click="favs.toggle(c.slug)"
        >{{ isFav ? '♥' : '♡' }} {{ isFav ? t('char_fav_on') : t('char_fav_off') }}</button>
        <button v-if="canNativeShare" type="button" class="rc-btn-ghost rc-btn-compact" @click="nativeShare">⎄ {{ t('char_share') }}</button>
        <button type="button" class="rc-btn-ghost rc-btn-compact" @click="copyLink">
          {{ copied ? '✓ ' + t('share_copied') : '⎘ ' + t('share_copy') }}
        </button>
        <span class="mx-1 h-4 w-px bg-border-warm" aria-hidden="true" />
        <a :href="shareLinks.x" target="_blank" rel="noopener" class="text-xs font-semibold text-plum-muted transition-colors hover:text-rose-accent">X</a>
        <a :href="shareLinks.telegram" target="_blank" rel="noopener" class="text-xs font-semibold text-plum-muted transition-colors hover:text-rose-accent">Telegram</a>
        <a :href="shareLinks.reddit" target="_blank" rel="noopener" class="text-xs font-semibold text-plum-muted transition-colors hover:text-rose-accent">Reddit</a>
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
          <NuxtLink v-for="r in related" :key="r.slug" :to="localePath(`/characters/${r.slug}`)" class="rc-card group flex items-center gap-3 p-4">
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
        <NuxtLink :to="localePath(`/app?character=${c.slug}`)" class="rc-btn-primary mt-5 inline-flex">{{ t('char_start_private_chat') }}</NuxtLink>
      </section>
    </main>
  </WorkbenchShell>
</template>
