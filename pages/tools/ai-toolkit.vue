<script setup lang="ts">
/**
 * AI Toolkit 落地页：WorkbenchShell 页面壳（hero / features / steps / 工作区 / FAQ / CTA）
 * + ClientOnly 包裹的 AIToolkit 工作区（5 个 AI 生成器，BYOK 纯浏览器端）。
 * at_* 文案存于 i18n/fragments/ai-toolkit.json，运行时合并进 vue-i18n（locale 切换后重合并）。
 */
import { mergeAiToolkitI18n } from '~/utils/st/regex-script';

const i18n = useI18n();
const { t } = i18n;
const localePath = useLocalePath();

// 片段运行时合并：SSR 与客户端都执行；切换语言时 lazy loader 会整体替换该语言消息，需重新合并
mergeAiToolkitI18n(i18n);
watch(() => i18n.locale.value, () => mergeAiToolkitI18n(i18n));

useSeoMeta({
  title: () => t('at_seo_title'),
  description: () => t('at_seo_desc'),
  ogTitle: () => t('at_seo_title'),
  ogDescription: () => t('at_seo_desc'),
});

// 结构化数据：面包屑（首页 › 工具 › AI Toolkit）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
          { name: t('at_title'), path: '/tools/ai-toolkit' },
        ]),
      ),
    },
  ],
});

const features = computed(() =>
  [1, 2, 3, 4, 5, 6].map((n) => ({ title: t(`at_feature_${n}_title`), desc: t(`at_feature_${n}_desc`) })),
);

const steps = computed(() =>
  [1, 2, 3].map((n) => ({ title: t(`at_step_${n}_title`), desc: t(`at_step_${n}_desc`) })),
);

const faqs = computed(() =>
  [1, 2, 3, 4].map((n) => ({ q: t(`at_faq_q${n}`), a: t(`at_faq_a${n}`) })),
);
</script>

<template>
  <WorkbenchShell active-cat="craft">

    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('pt_back_tools') }}</NuxtLink>

      <!-- Hero -->
      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('at_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">{{ t('at_title') }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t('at_tagline') }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t('at_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#at-app" class="rc-btn-primary">{{ t('at_cta_open') }}</a>
          <NuxtLink :to="localePath('/app')" class="rc-btn-ghost">{{ t('at_cta_play') }}</NuxtLink>
        </div>
      </section>

      <!-- Features -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('at_features_title') }}</h2>
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
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('at_how_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="(s, i) in steps" :key="s.title" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ i + 1 }}</div>
            <h3 class="text-base font-bold">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ s.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 工作区（BYOK 调用自配 API，纯浏览器端） -->
      <section id="at-app" class="mt-14 scroll-mt-20">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('at_ws_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm text-plum-muted">{{ t('at_ws_desc') }}</p>
        <div class="mt-8">
          <ClientOnly>
            <AIToolkit />
            <template #fallback>
              <div class="ui-panel flex min-h-[280px] items-center justify-center text-sm text-plum-muted">
                {{ t('at_ws_loading') }}
              </div>
            </template>
          </ClientOnly>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('at_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="rc-faq mt-8">
          <details v-for="f in faqs" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- CTA 导流站内网页版（生成的内容直接开聊） -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('at_cta2_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('at_cta2_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/tools')" class="rc-btn-ghost">{{ t('at_cta2_tools') }}</NuxtLink>
        </div>
      </section>
    </main>

  </WorkbenchShell>
</template>
