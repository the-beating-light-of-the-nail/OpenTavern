<script setup lang="ts">
import { SILLY_TAVERN_MOD_LINKS } from '~/data/tools';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('stm_seo_title'),
  description: () => t('stm_seo_desc'),
  ogTitle: () => t('stm_seo_title'),
  ogDescription: () => t('stm_seo_desc'),
});

// 结构化数据：面包屑（首页 › 工具 › SillyTavernMOD）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
          { name: 'SillyTavernMOD', path: '/tools/sillytavern-mod' },
        ]),
      ),
    },
  ],
});

const features = computed(() =>
  [1, 2, 3, 4, 5, 6].map((n) => ({ title: t(`stm_feature_${n}_title`), desc: t(`stm_feature_${n}_desc`) })),
);

const deploys = computed(() =>
  [1, 2, 3].map((n) => ({ title: t(`stm_deploy_${n}_title`), desc: t(`stm_deploy_${n}_desc`) })),
);

// 三方对比表：列名是专有名词，不译；格子文案走 stm_cmp_<行>_<st|mod|pt>
const compareRows = computed(() =>
  (['purpose', 'users', 'setup', 'best'] as const).map((row) => ({
    label: t(`stm_cmp_${row}`),
    st: t(`stm_cmp_${row}_st`),
    mod: t(`stm_cmp_${row}_mod`),
    pt: t(`stm_cmp_${row}_pt`),
  })),
);

const faqs = computed(() =>
  [1, 2, 3, 4, 5].map((n) => ({ q: t(`stm_faq_q${n}`), a: t(`stm_faq_a${n}`) })),
);
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('pt_back_tools') }}</NuxtLink>

      <!-- Hero -->
      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('stm_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">{{ t('stm_title') }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t('stm_tagline') }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t('stm_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a :href="SILLY_TAVERN_MOD_LINKS.repo" target="_blank" rel="noopener" class="rc-btn-primary">{{ t('stm_cta_github') }} ↗</a>
          <a :href="SILLY_TAVERN_MOD_LINKS.docker" target="_blank" rel="noopener" class="rc-btn-ghost">{{ t('stm_cta_docker') }} ↗</a>
        </div>
      </section>

      <!-- 适合谁：README 明确"纯个人用原版即可"，如实引导，避免单人玩家误入重运维方案 -->
      <section class="mt-10 rounded-2xl border border-border-warm bg-rose-tint p-6">
        <h2 class="text-base font-bold">{{ t('stm_who_title') }}</h2>
        <p class="mt-3 text-sm leading-relaxed text-plum-muted">{{ t('stm_who_body') }}</p>
      </section>

      <!-- Features -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('stm_features_title') }}</h2>
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

      <!-- 部署方式 -->
      <section class="mt-14 border-y border-border-warm bg-rose-tint rounded-2xl px-5 py-12 sm:px-8">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('stm_deploy_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="(d, i) in deploys" :key="d.title" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ i + 1 }}</div>
            <h3 class="text-base font-bold">{{ d.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ d.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 安全须知（默认凭据等关键安全信息前置） -->
      <section class="mx-auto mt-10 max-w-3xl">
        <div class="rounded-2xl border border-border-warm bg-rose-tint p-6">
          <h2 class="text-base font-bold">{{ t('stm_security_title') }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-plum-muted">{{ t('stm_security_body') }}</p>
        </div>
      </section>

      <!-- 三方对比表 -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('stm_compare_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 overflow-x-auto rounded-2xl border border-border-warm">
          <table class="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr class="bg-rose-tint">
                <th class="p-4 text-left font-display font-semibold tracking-wide"></th>
                <th class="p-4 text-left font-display font-semibold tracking-wide">SillyTavern</th>
                <th class="p-4 text-left font-display font-semibold tracking-wide text-rose-accent">SillyTavernMOD</th>
                <th class="p-4 text-left font-display font-semibold tracking-wide">PureTavern</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in compareRows"
                :key="row.label"
                class="border-t border-border-warm"
              >
                <th class="p-4 text-left align-top font-bold">{{ row.label }}</th>
                <td class="p-4 align-top leading-relaxed text-plum-muted">{{ row.st }}</td>
                <td class="p-4 align-top leading-relaxed text-plum">{{ row.mod }}</td>
                <td class="p-4 align-top leading-relaxed text-plum-muted">{{ row.pt }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('stm_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="rc-faq mt-8">
          <details v-for="f in faqs" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- 第三方声明 -->
      <section class="mx-auto mt-12 max-w-3xl">
        <div class="rounded-2xl border border-border-warm bg-rose-tint p-6">
          <h2 class="text-base font-bold">{{ t('stm_disclaimer_title') }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-plum-muted">{{ t('stm_disclaimer_body') }}</p>
        </div>
      </section>

      <!-- CTA 导流站内网页版 -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('stm_cta_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('stm_cta_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('home_cta_explore') }}</NuxtLink>
        </div>
      </section>
    </main>

    <SiteFooter />
  </div>
</template>
