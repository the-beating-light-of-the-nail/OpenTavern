<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('cmp_seo_title'),
  description: () => t('cmp_seo_desc'),
  ogTitle: () => t('cmp_seo_title'),
  ogDescription: () => t('cmp_seo_desc'),
});

// 结构化数据：面包屑（首页 › 对比）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('cmp_badge'), path: '/compare' },
        ]),
      ),
    },
  ],
});

// 对比表：列为固定品牌名（专有名词不译），单元格与行标走 i18n
const columns = ['OpenTavern', 'SillyTavern', 'RisuAI', 'AgnAI'] as const;

const rows = computed(() => [
  { label: t('cmp_row_install'), cells: [t('cmp_v_install_ot'), t('cmp_v_install_st'), t('cmp_v_install_risu'), t('cmp_v_install_agn')] },
  { label: t('cmp_row_price'), cells: [t('cmp_v_price_ot'), t('cmp_v_price_st'), t('cmp_v_price_risu'), t('cmp_v_price_agn')] },
  { label: t('cmp_row_privacy'), cells: [t('cmp_v_privacy_ot'), t('cmp_v_privacy_st'), t('cmp_v_privacy_risu'), t('cmp_v_privacy_agn')] },
  { label: t('cmp_row_byok'), cells: [t('cmp_v_byok_ot'), t('cmp_v_byok_st'), t('cmp_v_byok_risu'), t('cmp_v_byok_agn')] },
  { label: t('cmp_row_cards'), cells: [t('cmp_v_cards_ot'), t('cmp_v_cards_st'), t('cmp_v_cards_risu'), t('cmp_v_cards_agn')] },
  { label: t('cmp_row_worldbook'), cells: [t('cmp_v_wb_ot'), t('cmp_v_wb_st'), t('cmp_v_wb_risu'), t('cmp_v_wb_agn')] },
  { label: t('cmp_row_presets'), cells: [t('cmp_v_ps_ot'), t('cmp_v_ps_st'), t('cmp_v_ps_risu'), t('cmp_v_ps_agn')] },
]);

const picks = computed(() => [
  { title: t('cmp_who_ot_t'), body: t('cmp_who_ot_b'), highlight: true },
  { title: t('cmp_who_st_t'), body: t('cmp_who_st_b'), highlight: false },
  { title: t('cmp_who_risu_t'), body: t('cmp_who_risu_b'), highlight: false },
  { title: t('cmp_who_agn_t'), body: t('cmp_who_agn_b'), highlight: false },
]);

const faqs = computed(() => [1, 2, 3].map((n) => ({ q: t(`cmp_faq_q${n}`), a: t(`cmp_faq_a${n}`) })));
</script>

<template>
  <WorkbenchShell active-cat="resource">

    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('pt_back_tools') }}</NuxtLink>

      <!-- Hero -->
      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('cmp_badge') }}
        </div>
        <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-5xl">{{ t('cmp_title') }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t('cmp_tagline') }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t('cmp_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/tools')" class="rc-btn-ghost">{{ t('cs_cta2_tools') }}</NuxtLink>
        </div>
      </section>

      <!-- Comparison table -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('cmp_table_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 overflow-x-auto rounded-2xl border border-border-warm">
          <table class="w-full min-w-[640px] border-collapse bg-surface text-sm">
            <thead>
              <tr class="border-b border-border-warm bg-rose-tint">
                <th class="p-3 text-left font-semibold text-plum-muted">{{ t('cmp_table_corner') }}</th>
                <th v-for="col in columns" :key="col" class="p-3 text-left font-bold" :class="col === 'OpenTavern' ? 'text-rose-accent' : 'text-plum'">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.label" class="border-b border-border-warm/60 last:border-0">
                <th scope="row" class="p-3 text-left font-semibold text-plum-light">{{ row.label }}</th>
                <td
                  v-for="(cell, i) in row.cells"
                  :key="i"
                  class="p-3 align-top leading-relaxed"
                  :class="i === 0 ? 'bg-rose-tint/40 font-semibold text-plum' : 'text-plum-muted'"
                >{{ cell }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="mx-auto mt-4 max-w-2xl text-center text-xs text-plum-faint">{{ t('cmp_table_note') }}</p>
      </section>

      <!-- Who should pick what -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('cmp_who_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div
            v-for="p in picks"
            :key="p.title"
            class="rc-card p-6"
            :class="p.highlight ? 'ring-1 ring-rose-accent/40' : ''"
          >
            <h3 class="text-base font-bold" :class="p.highlight ? 'text-rose-accent' : ''">{{ p.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.body }}</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('cmp_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="rc-faq mt-8">
          <details v-for="f in faqs" :key="f.q">
            <summary>{{ f.q }}</summary>
            <p class="rc-faq-a">{{ f.a }}</p>
          </details>
        </div>
      </section>

      <!-- CTA -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('cmp_cta_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('cmp_cta_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('nav_characters') }}</NuxtLink>
        </div>
      </section>
    </main>

  </WorkbenchShell>
</template>
