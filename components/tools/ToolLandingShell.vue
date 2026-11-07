<script setup lang="ts">
/**
 * 复刻自 tools.laopobao.online 的工具落地页壳：
 * hero + 3 特性 + 工作区 + 3 FAQ + 结尾 CTA。
 * 文案 key 由 prefix 拼接（stg_ / doc_ / stu_ / abs_ / qr_），
 * 工作区内容由插槽传入并在 ClientOnly 中挂载。
 */
import type { HubCategory } from '~/data/tools';

const props = withDefaults(defineProps<{
  prefix: string;
  slug: string;
  activeCat?: HubCategory;
  featureCount?: number;
  faqCount?: number;
  /** AI 工具：未配置 API 时显示 BYOK 提示条（并挂载 SettingsModal） */
  byok?: boolean;
}>(), { activeCat: 'craft', featureCount: 3, faqCount: 3, byok: false });

const { t } = useI18n();
const localePath = useLocalePath();
const ui = useUiStore();
const ai = useToolAI();
const configured = computed(() => ai.isConfigured());

const k = (suffix: string) => `${props.prefix}_${suffix}`;

const features = computed(() =>
  Array.from({ length: props.featureCount }, (_, i) => ({
    title: t(k(`feature_${i + 1}_title`)),
    desc: t(k(`feature_${i + 1}_desc`)),
  })),
);

const faqs = computed(() =>
  Array.from({ length: props.faqCount }, (_, i) => ({
    q: t(k(`faq_q${i + 1}`)),
    a: t(k(`faq_a${i + 1}`)),
  })),
);

useSeoMeta({
  title: () => t(k('seo_title')),
  description: () => t(k('seo_desc')),
  ogTitle: () => t(k('seo_title')),
  ogDescription: () => t(k('seo_desc')),
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
          { name: t(k('title')), path: `/tools/${props.slug}` },
        ]),
      ),
    },
  ],
});
</script>

<template>
  <WorkbenchShell :active-cat="activeCat">
    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('tp_back_tools') }}</NuxtLink>

      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t(k('badge')) }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">{{ t(k('title')) }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t(k('tagline')) }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t(k('desc')) }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a :href="`#${prefix}-app`" class="rc-btn-primary">{{ t(k('cta_open')) }}</a>
          <NuxtLink :to="localePath('/app')" class="rc-btn-ghost">{{ t('tp_start_chat') }}</NuxtLink>
        </div>
      </section>

      <section class="mt-14">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="f in features" :key="f.title" class="rc-card p-6">
            <h2 class="flex items-center gap-2 text-base font-bold">
              <span class="h-2 w-2 flex-shrink-0 rounded-full" style="background:var(--color-rose-deep)" /> {{ f.title }}
            </h2>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ f.desc }}</p>
          </div>
        </div>
      </section>

      <section :id="`${prefix}-app`" class="mt-14 scroll-mt-20">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t(k('ws_title')) }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm text-plum-muted">{{ t(k('ws_desc')) }}</p>
        <div class="mt-8">
          <div v-if="byok && !configured" class="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-champagne/50 bg-rose-tint px-3 py-2.5">
            <span class="text-sm text-plum">🔑 {{ t('tp_byok_hint') }}</span>
            <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="ui.open('settings')">
              {{ t('tp_byok_open') }}
            </button>
          </div>
          <ClientOnly>
            <slot />
            <template #fallback>
              <div class="ui-panel flex min-h-[280px] items-center justify-center text-sm text-plum-muted">
                {{ t(k('ws_loading')) }}
              </div>
            </template>
          </ClientOnly>
        </div>
      </section>

      <SettingsModal />

      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('tp_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="rc-faq mt-8">
          <details v-for="f in faqs" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t(k('cta2_title')) }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t(k('cta2_body')) }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('tp_start_chat') }}</NuxtLink>
          <NuxtLink :to="localePath('/tools')" class="rc-btn-ghost">{{ t('tp_more_tools') }}</NuxtLink>
        </div>
      </section>
    </main>
  </WorkbenchShell>
</template>
