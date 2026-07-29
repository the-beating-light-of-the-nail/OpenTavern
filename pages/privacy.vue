<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const { $i18n } = useNuxtApp();
const SUPPORT_EMAIL = 'r3fbilgebasaran@gmail.com';

useSeoMeta({
  title: () => t('privacy_seo_title'),
  description: () => t('privacy_seo_desc'),
  ogTitle: () => t('privacy_seo_title'),
  ogDescription: () => t('privacy_seo_desc'),
});

// 普通章节（标题 + 正文），contact 段单独渲染（含邮件链接）
const sections = ['nodata', 'local', 'api', 'third', 'cookies', 'ads', 'children', 'user_content', 'changes'] as const;

const jsonLd = computed(() => [
  {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: t('privacy_title'),
      url: absUrl('/privacy'),
      inLanguage: $i18n.locale.value,
    }),
  },
]);
useHead({ script: jsonLd });
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-16">
      <NuxtLink :to="localePath('/')" class="rc-nav-link mb-6 inline-flex">{{ t('privacy_back_home') }}</NuxtLink>
      <h1 class="font-display text-4xl font-semibold tracking-wide">{{ t('privacy_title') }}</h1>
      <p class="mt-2 text-sm text-plum-faint">{{ t('privacy_updated') }}</p>
      <p class="mt-4 text-lg leading-relaxed text-plum-muted">{{ t('privacy_intro') }}</p>

      <div class="orn-divider" aria-hidden="true">✦</div>

      <section
        v-for="s in sections"
        :key="s"
        class="mt-10 space-y-3 leading-relaxed text-plum-muted"
      >
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t(`privacy_${s}_title`) }}</h2>
        <p>{{ t(`privacy_${s}_body`) }}</p>
      </section>

      <section class="mt-12 space-y-3 leading-relaxed text-plum-muted">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('privacy_contact_title') }}</h2>
        <p>
          {{ t('privacy_contact_body') }}
          <a :href="`mailto:${SUPPORT_EMAIL}`" class="font-medium underline underline-offset-4 break-all">{{
            SUPPORT_EMAIL
          }}</a>
        </p>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
