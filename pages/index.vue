<script setup lang="ts">
import { characters } from '~/data/characters';
const { t } = useI18n();

useSeoMeta({
  title: 'Open Tavern · RoleChat AI — Private AI Character Roleplay',
  description:
    'Open Tavern (also known as RoleChat AI) is an easy private AI roleplay platform. Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.',
  ogTitle: 'Open Tavern · RoleChat AI — Private AI Character Roleplay',
  ogDescription:
    'Open Tavern (also known as RoleChat AI) is an easy private AI roleplay platform. Chat with original romance and fantasy characters in seconds. No installation. No complicated setup. Bring your own AI key.',
});

// 首页展示前 6 个原创角色（链接到真实角色页）
const featured = characters.slice(0, 6);


const howSteps = computed(() => [
  { n: 1, title: t('home_how_step1_title'), desc: t('home_how_step1_desc') },
  { n: 2, title: t('home_how_step2_title'), desc: t('home_how_step2_desc') },
  { n: 3, title: t('home_how_step3_title'), desc: t('home_how_step3_desc') },
]);

const privatePoints = computed(() => [
  { title: t('home_private_point1_title'), desc: t('home_private_point1_desc') },
  { title: t('home_private_point2_title'), desc: t('home_private_point2_desc') },
  { title: t('home_private_point3_title'), desc: t('home_private_point3_desc') },
  { title: t('home_private_point4_title'), desc: t('home_private_point4_desc') },
]);

const compatPoints = computed(() => [
  { title: t('home_compat_point1_title'), desc: t('home_compat_point1_desc') },
  { title: t('home_compat_point2_title'), desc: t('home_compat_point2_desc') },
  { title: t('home_compat_point3_title'), desc: t('home_compat_point3_desc') },
  { title: t('home_compat_point4_title'), desc: t('home_compat_point4_desc') },
]);

const guides = computed(() => [
  { title: t('home_guide1_title'), desc: t('home_guide1_desc') },
  { title: t('home_guide2_title'), desc: t('home_guide2_desc') },
  { title: t('home_guide3_title'), desc: t('home_guide3_desc') },
]);

const faqs = computed(() => [
  { q: t('home_faq_q1'), a: t('home_faq_a1') },
  { q: t('home_faq_q2'), a: t('home_faq_a2') },
  { q: t('home_faq_q3'), a: t('home_faq_a3') },
  { q: t('home_faq_q4'), a: t('home_faq_a4') },
  { q: t('home_faq_q5'), a: t('home_faq_a5') },
  { q: t('home_faq_q6'), a: t('home_faq_a6') },
]);
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <!-- Top Nav -->
    <SiteHeader :show-extra-links="true" />

    <!-- Hero -->
    <section class="rc-hero-bg relative overflow-hidden">
      <PetalField />
      <div class="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center sm:py-32">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-rose-tint px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('home_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          {{ t('home_hero_title_1') }}<br class="hidden sm:block" /> {{ t('home_hero_title_2') }}
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base text-plum-muted sm:text-lg">
          {{ t('home_hero_desc') }}
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink to="/characters" class="rc-btn-ghost">{{ t('home_cta_explore') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Popular Romance Characters (原创非 IP，链接到真实角色页) -->
    <section class="mx-auto max-w-5xl px-5 py-20">
      <div class="mb-10 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_popular_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_popular_desc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="c in featured" :key="c.slug" :to="`/characters/${c.slug}`" class="rc-card group block p-5">
          <div class="flex items-center gap-3">
            <CharAvatar :avatar="c.avatar" :initial="c.initial" size="md" />
            <div class="min-w-0">
              <h3 class="font-display truncate text-lg font-semibold tracking-wide group-hover:text-rose-accent">{{ c.name }}</h3>
              <p class="truncate text-xs text-rose-accent">{{ c.archetype }}</p>
            </div>
          </div>
          <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-plum-muted">{{ c.tagline }}</p>
          <div class="mt-4 flex flex-wrap gap-1.5">
            <span v-for="tg in c.tags.slice(0, 3)" :key="tg" class="rc-tag">{{ tg }}</span>
          </div>
        </NuxtLink>
      </div>
      <div class="mt-10 text-center">
        <NuxtLink to="/characters" class="rc-btn-ghost">{{ t('home_see_all') }}</NuxtLink>
      </div>
    </section>

    <!-- SillyTavern Compatible -->
    <section class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
            <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('home_compat_badge') }}
          </div>
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_compat_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_compat_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div v-for="p in compatPoints" :key="p.title" class="rc-card p-6">
            <h3 class="flex items-center gap-2 text-base font-bold">
              <span class="h-2 w-2 flex-shrink-0 rounded-full" style="background:var(--color-rose-deep)" /> {{ p.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.desc }}</p>
          </div>
        </div>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">{{ t('home_compat_cta_app') }}</NuxtLink>
          <NuxtLink to="/where-to-find-character-cards" class="rc-btn-ghost">{{ t('home_compat_cta_cards') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how" class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_how_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_how_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div v-for="s in howSteps" :key="s.n" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ s.n }}</div>
            <h3 class="text-base font-bold">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Private by Design -->
    <section class="mx-auto max-w-5xl px-5 py-20">
      <div class="mb-12 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_private_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_private_desc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div v-for="p in privatePoints" :key="p.title" class="rc-card p-6">
          <h3 class="flex items-center gap-2 text-base font-bold">
            <span class="h-2 w-2 flex-shrink-0 rounded-full" style="background:var(--color-success)" /> {{ p.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Beginner Guides -->
    <section class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_guides_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_guides_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="g in guides" :key="g.title" class="rc-card p-6">
            <h3 class="text-base font-bold">{{ g.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ g.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mx-auto max-w-3xl px-5 py-20">
      <div class="mb-10 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_faq_desc') }}</p>
      </div>
      <div class="rc-faq">
        <details v-for="f in faqs" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p class="rc-faq-a">{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- Footer CTA -->
    <section class="rc-hero-bg border-t border-border-warm">
      <div class="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_footer_ready_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_footer_ready_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink to="/characters" class="rc-btn-ghost">{{ t('home_cta_explore') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border-warm">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div class="flex items-center gap-2">
          <div class="rc-avatar-fill flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold tracking-tighter">RC</div>
          <span class="text-sm font-bold">RoleChat AI</span>
        </div>
        <nav class="flex items-center gap-4 text-xs text-plum-faint">
          <NuxtLink to="/characters" class="hover:text-plum-light">{{ t('nav_characters') }}</NuxtLink>
          <NuxtLink to="/guides" class="hover:text-plum-light">{{ t('nav_guides') }}</NuxtLink>
          <NuxtLink to="/about" class="hover:text-plum-light">{{ t('nav_about') }}</NuxtLink>
          <NuxtLink to="/contact" class="hover:text-plum-light">{{ t('nav_contact') }}</NuxtLink>
          <NuxtLink to="/app" class="hover:text-plum-light">{{ t('nav_open_app') }}</NuxtLink>
          <a href="#how" class="hover:text-plum-light">{{ t('nav_how_it_works') }}</a>
          <a href="#faq" class="hover:text-plum-light">{{ t('nav_faq') }}</a>
        </nav>
        <p class="text-xs text-plum-faint">{{ t('home_footer_tagline') }}</p>
      </div>
    </footer>
  </div>
</template>
