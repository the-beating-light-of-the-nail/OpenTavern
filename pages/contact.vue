<script setup lang="ts">
const SUPPORT_EMAIL = 'r3fbilgebasaran@gmail.com';

useSeoMeta({
  title: 'Contact Open Tavern · RoleChat AI',
  description:
    'Contact the Open Tavern (RoleChat AI) team by email — questions, feedback, character requests, or to report an issue. We aim to reply within 2 business days.',
  ogTitle: 'Contact Open Tavern · RoleChat AI',
  ogDescription:
    'Email the Open Tavern team with questions, feedback, or character requests. We reply within 2 business days.',
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Contact Open Tavern',
        url: absUrl('/contact'),
        inLanguage: 'en',
        mainEntity: {
          '@type': 'Organization',
          name: 'Open Tavern',
          email: `mailto:${SUPPORT_EMAIL}`,
          url: absUrl('/'),
        },
      }),
    },
  ],
});
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-2xl px-5 py-16">
      <NuxtLink to="/" class="rc-nav-link mb-6 inline-flex">← Home</NuxtLink>
      <h1 class="font-display text-4xl font-semibold tracking-wide">Contact</h1>
      <p class="mt-4 text-lg leading-relaxed text-plum-muted">
        Questions, feedback, character requests, or something not working? We'd love to
        hear from you.
      </p>

      <div class="orn-divider" aria-hidden="true">✦</div>

      <section class="mt-10 rc-hero-bg rounded-2xl border border-border-warm p-8">
        <h2 class="font-display text-2xl font-semibold tracking-wide">Email us</h2>
        <p class="mt-3 leading-relaxed text-plum-muted">
          The fastest way to reach the team. We aim to reply within
          <strong>2 business days</strong>.
        </p>
        <a :href="`mailto:${SUPPORT_EMAIL}`" class="rc-btn-primary mt-6 inline-flex break-all">
          {{ SUPPORT_EMAIL }}
        </a>
      </section>

      <section class="mt-8 space-y-3 leading-relaxed text-plum-muted">
        <h2 class="font-display text-xl font-semibold tracking-wide">What to include</h2>
        <ul class="list-disc space-y-2 pl-5">
          <li>Your browser and device, if you hit a bug.</li>
          <li>The character or page you were using.</li>
          <li>Any error text you saw.</li>
        </ul>
        <p class="text-sm text-plum-faint">
          Please don't send API keys or passwords — we'll never ask for them.
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
