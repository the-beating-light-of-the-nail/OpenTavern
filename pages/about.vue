<script setup lang="ts">
useSeoMeta({
  title: 'About Open Tavern · RoleChat AI',
  description:
    'Open Tavern (RoleChat AI) is an independent, privacy-first AI roleplay platform. Learn who builds it, why it is bring-your-own-key, and how it keeps your conversations private.',
  ogTitle: 'About Open Tavern · RoleChat AI',
  ogDescription:
    'An independent, privacy-first AI roleplay platform — who builds it and why bring-your-own-key keeps your conversations private.',
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Open Tavern · RoleChat AI',
        url: absUrl('/about'),
        inLanguage: 'en',
      }),
    },
  ],
});
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-16">
      <NuxtLink to="/" class="rc-nav-link mb-6 inline-flex">{{ t('about_back_home') }}</NuxtLink>
      <h1 class="font-display text-4xl font-semibold tracking-wide">{{ t('about_title') }}</h1>
      <p class="mt-4 text-lg leading-relaxed text-plum-muted">
        {{ t('about_subtitle') }}
      </p>

      <div class="orn-divider" aria-hidden="true">✦</div>

      <section class="mt-10 space-y-5 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('about_why_title') }}</h2>
        <p>
          {{ t('about_why_body_1') }} <strong>{{ t('about_why_body_2') }}</strong> {{ t('about_why_body_3') }}
        </p>
        <p>
          {{ t('about_why_body_4') }}
        </p>
      </section>

      <section class="mt-12 space-y-5 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('about_byok_title') }}</h2>
        <p>
          {{ t('about_byok_body_1') }}
        </p>
        <p>
          {{ t('about_byok_body_2') }}
        </p>
      </section>

      <!-- TODO(personalize): Strengthen E-E-A-T by naming the maintainer, their
           background, and the editorial process behind new characters/guides. -->
      <section class="mt-12 space-y-5 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('about_who_title') }}</h2>
        <p>
          {{ t('about_who_body') }}
        </p>
        <p>
          {{ t('about_cta') }}
          <NuxtLink to="/contact" class="font-medium underline underline-offset-4"
            >{{ t('about_get_in_touch') }}</NuxtLink
          >.
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
