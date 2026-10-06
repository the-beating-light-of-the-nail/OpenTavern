<script setup lang="ts">
import { mergeWorldbookI18n } from '~/utils/st/worldbook';

const i18n = useI18n();
const { t } = i18n;
const localePath = useLocalePath();

// wb_* 文案存于 i18n/fragments/worldbook-forge.json（独立于 locales/*.json），运行时合并；
// 切换语言时 lazy loader 会整体替换该语言消息，故 locale 变化后需重新合并
mergeWorldbookI18n(i18n);
watch(i18n.locale, () => mergeWorldbookI18n(i18n));

useSeoMeta({
  title: () => t('wb_seo_title'),
  description: () => t('wb_seo_desc'),
  ogTitle: () => t('wb_seo_title'),
  ogDescription: () => t('wb_seo_desc'),
});

// 结构化数据：面包屑（首页 › 工具 › Worldbook Forge）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
          { name: t('wb_title'), path: '/tools/worldbook-forge' },
        ]),
      ),
    },
  ],
});

const features = computed(() =>
  [1, 2, 3, 4, 5, 6].map((n) => ({ title: t(`wb_feature_${n}_title`), desc: t(`wb_feature_${n}_desc`) })),
);

const steps = computed(() =>
  [1, 2, 3].map((n) => ({ title: t(`wb_step_${n}_title`), desc: t(`wb_step_${n}_desc`) })),
);

const faqs = computed(() =>
  [1, 2, 3, 4].map((n) => ({ q: t(`wb_faq_q${n}`), a: t(`wb_faq_a${n}`) })),
);
</script>

<template>
  <WorkbenchShell active-cat="craft">

    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('pt_back_tools') }}</NuxtLink>

      <!-- Hero -->
      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('wb_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">{{ t('wb_title') }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t('wb_tagline') }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t('wb_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#wb-app" class="rc-btn-primary">{{ t('wb_cta_open') }}</a>
          <NuxtLink :to="localePath('/app')" class="rc-btn-ghost">{{ t('wb_cta_play') }}</NuxtLink>
        </div>
      </section>

      <!-- Features -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('wb_features_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="f in features" :key="f.title" class="rc-card p-6">
            <h3 class="flex items-center gap-2 text-base font-bold">
              <span class="h-2 w-2 flex-shrink-0 rounded-full" style="background:var(--color-rose-deep)" /> {{ f.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 三步上手 -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('wb_how_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="(s, i) in steps" :key="s.title" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ i + 1 }}</div>
            <h3 class="text-base font-bold">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ s.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 工作区（纯前端，数据存本地） -->
      <section id="wb-app" class="mt-14 scroll-mt-20">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('wb_ws_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm text-plum-muted">{{ t('wb_ws_desc') }}</p>
        <div class="mt-8">
          <ClientOnly>
            <WorldbookForge />
            <template #fallback>
              <div class="ui-panel flex min-h-[280px] items-center justify-center text-sm text-plum-muted">
                {{ t('wb_ws_loading') }}
              </div>
            </template>
          </ClientOnly>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('wb_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="rc-faq mt-8">
          <details v-for="f in faqs" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- CTA 导流站内网页版（世界书直接进酒馆用起来） -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('wb_cta2_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('wb_cta2_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/tools')" class="rc-btn-ghost">{{ t('wb_cta2_tools') }}</NuxtLink>
        </div>
      </section>
    </main>

  </WorkbenchShell>
</template>
