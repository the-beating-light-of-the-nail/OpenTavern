<script setup lang="ts">
/**
 * Story to Worldbook 落地页：WorkbenchShell 页面壳（hero / features / steps / 工作区 / FAQ / CTA）
 * + ClientOnly 包裹的 StoryToWorldbook 工作区（长文逐章转世界书条目，BYOK 纯浏览器端）。
 * sw_* 文案存于 i18n/fragments/story-to-worldbook.json，运行时合并进 vue-i18n
 * （对齐 worldbook-forge / ai-toolkit 的片段合并模式；合并幂等，主流程稍后可静态合并同一片段）。
 */
import swFragment from '~/i18n/fragments/story-to-worldbook.json';

type I18nLike = { mergeLocaleMessage?: (locale: string, message: Record<string, unknown>) => void };

/** 把 sw_* 片段按语言合并进 vue-i18n 全局消息（幂等，SSR 与客户端都可安全调用） */
function mergeStoryToWorldbookI18n(i18n: unknown): void {
  const composer = i18n as I18nLike | null;
  if (!composer || typeof composer.mergeLocaleMessage !== 'function') return;
  const merge = composer.mergeLocaleMessage.bind(composer);
  for (const [locale, messages] of Object.entries(swFragment)) {
    merge(locale, messages as Record<string, unknown>);
  }
}

const i18n = useI18n();
const { t } = i18n;
const localePath = useLocalePath();

// 片段运行时合并：SSR 与客户端都执行；切换语言时 lazy loader 会整体替换该语言消息，需重新合并
mergeStoryToWorldbookI18n(i18n);
watch(() => i18n.locale.value, () => mergeStoryToWorldbookI18n(i18n));

useSeoMeta({
  title: () => t('sw_seo_title'),
  description: () => t('sw_seo_desc'),
  ogTitle: () => t('sw_seo_title'),
  ogDescription: () => t('sw_seo_desc'),
});

// 结构化数据：面包屑（首页 › 工具 › Story to Worldbook）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
          { name: t('sw_title'), path: '/tools/story-to-worldbook' },
        ]),
      ),
    },
  ],
});

const features = computed(() =>
  [1, 2, 3, 4, 5, 6].map((n) => ({ title: t(`sw_feature_${n}_title`), desc: t(`sw_feature_${n}_desc`) })),
);

const steps = computed(() =>
  [1, 2, 3].map((n) => ({ title: t(`sw_step_${n}_title`), desc: t(`sw_step_${n}_desc`) })),
);

const faqs = computed(() =>
  [1, 2, 3, 4].map((n) => ({ q: t(`sw_faq_q${n}`), a: t(`sw_faq_a${n}`) })),
);
</script>

<template>
  <WorkbenchShell active-cat="craft">

    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('pt_back_tools') }}</NuxtLink>

      <!-- Hero -->
      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('sw_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">{{ t('sw_title') }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t('sw_tagline') }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t('sw_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a href="#sw-app" class="rc-btn-primary">{{ t('sw_cta_open') }}</a>
          <NuxtLink :to="localePath('/app')" class="rc-btn-ghost">{{ t('sw_cta_play') }}</NuxtLink>
        </div>
      </section>

      <!-- Features -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('sw_features_title') }}</h2>
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
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('sw_how_title') }}</h2>
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
      <section id="sw-app" class="mt-14 scroll-mt-20">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('sw_ws_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm text-plum-muted">{{ t('sw_ws_desc') }}</p>
        <div class="mt-8">
          <ClientOnly>
            <StoryToWorldbook />
            <template #fallback>
              <div class="ui-panel flex min-h-[280px] items-center justify-center text-sm text-plum-muted">
                {{ t('sw_ws_loading') }}
              </div>
            </template>
          </ClientOnly>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('sw_faq_title') }}</h2>
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
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('sw_cta2_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('sw_cta2_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/tools')" class="rc-btn-ghost">{{ t('sw_cta2_tools') }}</NuxtLink>
        </div>
      </section>
    </main>

  </WorkbenchShell>
</template>
