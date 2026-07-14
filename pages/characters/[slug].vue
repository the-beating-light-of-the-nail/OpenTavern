<script setup lang="ts">
import { getCharacterBySlug, characters } from '~/data/characters';

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

const related = computed(() =>
  c.relatedSlugs
    .map((s) => getCharacterBySlug(s))
    .filter((x): x is NonNullable<typeof x> => !!x),
);
</script>

<template>
  <div class="min-h-[100dvh] bg-zinc-950 text-zinc-100">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-12">
      <NuxtLink to="/characters" class="rc-nav-link mb-6 inline-flex">← All characters</NuxtLink>

      <!-- Character header -->
      <div class="flex items-center gap-4">
        <CharAvatar :avatar="c.avatar" :initial="c.initial" size="lg" />
        <div class="min-w-0">
          <h1 class="text-2xl font-bold tracking-tight sm:text-3xl">{{ c.name }}</h1>
          <p class="text-sm text-amber-400/80">{{ c.archetype }}</p>
        </div>
      </div>

      <p class="mt-5 text-lg italic text-zinc-300">{{ c.tagline }}</p>

      <!-- Meta + safety + tags -->
      <div class="mt-5 flex flex-wrap items-center gap-1.5">
        <span class="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-300 ring-1 ring-emerald-400/30">{{ c.safetyLevel }}</span>
        <span class="rc-tag">{{ c.category }}</span>
        <span v-for="t in c.tags" :key="t" class="rc-tag">{{ t }}</span>
      </div>

      <!-- CTA -->
      <div class="mt-8 flex flex-wrap gap-3">
        <NuxtLink :to="`/app?character=${c.slug}`" class="rc-btn-primary">Start Private Chat</NuxtLink>
        <NuxtLink to="/characters" class="rc-btn-ghost">Browse others</NuxtLink>
      </div>

      <!-- Description -->
      <section class="mt-10">
        <h2 class="text-lg font-bold">About {{ c.name }}</h2>
        <p class="mt-3 leading-relaxed text-zinc-400">{{ c.description }}</p>
      </section>

      <!-- Personality -->
      <section class="mt-8">
        <h2 class="text-lg font-bold">Personality</h2>
        <p class="mt-3 leading-relaxed text-zinc-400">{{ c.personality }}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span v-for="t in c.personalityTags" :key="t" class="rounded-full bg-white/5 px-2.5 py-0.5 text-[0.68rem] font-medium text-zinc-300">{{ t }}</span>
        </div>
      </section>

      <!-- Relationship setup -->
      <section class="mt-8">
        <h2 class="text-lg font-bold">How you meet</h2>
        <p class="mt-3 leading-relaxed text-zinc-400">{{ c.relationshipSetup }}</p>
      </section>

      <!-- Scenario -->
      <section class="mt-8">
        <h2 class="text-lg font-bold">World &amp; scenario</h2>
        <p class="mt-3 leading-relaxed text-zinc-400">{{ c.scenario }}</p>
      </section>

      <!-- Opening message -->
      <section class="mt-8">
        <h2 class="text-lg font-bold">Opening message</h2>
        <div class="mt-3 rounded-xl border border-white/8 bg-white/[0.03] p-5">
          <p class="whitespace-pre-wrap leading-relaxed text-zinc-300">{{ c.openingMessage }}</p>
        </div>
      </section>

      <!-- Related characters -->
      <section v-if="related.length" class="mt-10">
        <h2 class="text-lg font-bold">Related characters</h2>
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <NuxtLink v-for="r in related" :key="r.slug" :to="`/characters/${r.slug}`" class="rc-card group flex items-center gap-3 p-4">
            <CharAvatar :avatar="r.avatar" :initial="r.initial" size="sm" />
            <div class="min-w-0">
              <p class="truncate text-sm font-bold group-hover:text-amber-400">{{ r.name }}</p>
              <p class="truncate text-xs text-zinc-500">{{ r.archetype }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mt-10">
        <h2 class="text-lg font-bold">FAQ</h2>
        <div class="rc-faq mt-4">
          <details v-for="f in c.faq" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- Footer CTA -->
      <section class="mt-12 rounded-2xl border border-white/8 bg-white/[0.02] p-8 text-center">
        <h2 class="text-xl font-bold">Ready to talk to {{ c.name }}?</h2>
        <p class="mx-auto mt-2 max-w-md text-sm text-zinc-400">Open the app, add your AI key, and the story begins. No installation, no setup wizard.</p>
        <NuxtLink :to="`/app?character=${c.slug}`" class="rc-btn-primary mt-5 inline-flex">Start Private Chat</NuxtLink>
      </section>
    </main>
  </div>
</template>
