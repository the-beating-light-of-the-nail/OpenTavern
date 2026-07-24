<script setup lang="ts">
const SUPPORT_EMAIL = 'r3fbilgebasaran@gmail.com';
const { t } = useI18n();
const { $i18n } = useNuxtApp();

const seoTitle = computed(() => t('contact_title') + ' · ' + 'Open Tavern · RoleChat AI');
const seoDesc = computed(() => t('contact_subtitle'));

useSeoMeta({
  title: seoTitle,
  description: seoDesc,
  ogTitle: seoTitle,
  ogDescription: seoDesc,
});

const jsonLd = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: seoTitle.value,
      url: absUrl('/contact'),
      inLanguage: $i18n.locale.value,
      mainEntity: {
        '@type': 'Organization',
        name: 'Open Tavern',
        email: `mailto:${SUPPORT_EMAIL}`,
        url: absUrl('/'),
      },
    }),
  },
]);
useHead({ script: jsonLd });
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-2xl px-5 py-16">
      <NuxtLink to="/" class="rc-nav-link mb-6 inline-flex">{{ t('contact_back_home') }}</NuxtLink>
      <h1 class="font-display text-4xl font-semibold tracking-wide">{{ t('contact_title') }}</h1>
      <p class="mt-4 text-lg leading-relaxed text-plum-muted">
        {{ t('contact_subtitle') }}
      </p>

      <div class="orn-divider" aria-hidden="true">✦</div>

      <section class="mt-10 rc-hero-bg rounded-2xl border border-border-warm p-8">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('contact_email_label') }}</h2>
        <p class="mt-3 leading-relaxed text-plum-muted">
          {{ t('contact_email_desc') }}
          <strong>{{ t('contact_business_days') }}</strong>.
        </p>
        <a :href="`mailto:${SUPPORT_EMAIL}`" class="rc-btn-primary mt-6 inline-flex break-all">
          {{ SUPPORT_EMAIL }}
        </a>
      </section>

      <section class="mt-8 space-y-3 leading-relaxed text-plum-muted">
        <h2 class="font-display text-xl font-semibold tracking-wide">{{ t('contact_what_to_include') }}</h2>
        <ul class="list-disc space-y-2 pl-5">
          <li>{{ t('contact_include_browser') }}</li>
          <li>{{ t('contact_include_page') }}</li>
          <li>{{ t('contact_include_error') }}</li>
        </ul>
        <p class="text-sm text-plum-faint">
          {{ t('contact_no_secrets') }}
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
