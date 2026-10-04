<script setup lang="ts">
import { PURE_TAVERN_LINKS } from '~/data/tools';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('pt_seo_title'),
  description: () => t('pt_seo_desc'),
  ogTitle: () => t('pt_seo_title'),
  ogDescription: () => t('pt_seo_desc'),
});

// 结构化数据：面包屑（首页 › 工具 › PureTavern）
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        breadcrumbSchema([
          { name: t('breadcrumb_home'), path: '/' },
          { name: t('nav_tools'), path: '/tools' },
          { name: 'PureTavern', path: '/tools/pure-tavern' },
        ]),
      ),
    },
  ],
});

const features = computed(() =>
  [1, 2, 3, 4, 5, 6].map((n) => ({ title: t(`pt_feature_${n}_title`), desc: t(`pt_feature_${n}_desc`) })),
);

// 平台下载矩阵：全部外链官方 GitHub Releases（本站不做镜像，AGPL 项目由官方仓库分发最干净）
const platforms = computed(() =>
  (['web', 'android', 'ios', 'harmony', 'desktop', 'vscode'] as const).map((p) => ({
    key: p,
    label: t(`pt_plat_${p}`),
    note: t(`pt_plat_${p}_note`),
    href: PURE_TAVERN_LINKS.releases,
  })),
);

const deploys = computed(() =>
  [1, 2, 3].map((n) => ({ title: t(`pt_deploy_${n}_title`), desc: t(`pt_deploy_${n}_desc`) })),
);

// 三方对比表：列名是专有名词，不译；格子文案走 pt_cmp_<行>_<rc|pt|st>
const compareRows = computed(() =>
  (['setup', 'storage', 'cards', 'ext', 'platforms', 'best'] as const).map((row) => ({
    label: t(`pt_cmp_${row}`),
    rc: t(`pt_cmp_${row}_rc`),
    pt: t(`pt_cmp_${row}_pt`),
    st: t(`pt_cmp_${row}_st`),
  })),
);

const faqs = computed(() =>
  [1, 2, 3, 4, 5].map((n) => ({ q: t(`pt_faq_q${n}`), a: t(`pt_faq_a${n}`) })),
);
</script>

<template>
  <WorkbenchShell active-cat="local">

    <main class="mx-auto max-w-5xl px-5 py-12">
      <NuxtLink :to="localePath('/tools')" class="rc-nav-link mb-6 inline-flex">← {{ t('pt_back_tools') }}</NuxtLink>

      <!-- Hero -->
      <section class="rc-hero-bg rounded-2xl border border-border-warm px-6 py-14 text-center sm:px-10">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('pt_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">{{ t('pt_title') }}</h1>
        <p class="mt-3 text-lg font-semibold text-rose-accent">{{ t('pt_tagline') }}</p>
        <p class="mx-auto mt-5 max-w-2xl leading-relaxed text-plum-muted">{{ t('pt_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a :href="PURE_TAVERN_LINKS.releases" target="_blank" rel="noopener" class="rc-btn-primary">{{ t('pt_cta_releases') }} ↗</a>
          <a :href="PURE_TAVERN_LINKS.repo" target="_blank" rel="noopener" class="rc-btn-ghost">{{ t('pt_cta_github') }} ↗</a>
        </div>
      </section>

      <!-- Features -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('pt_features_title') }}</h2>
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

      <!-- 平台下载矩阵（外链官方 Releases） -->
      <section class="mt-14 border-y border-border-warm bg-rose-tint rounded-2xl px-5 py-12 sm:px-8">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('pt_platforms_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-center text-plum-muted">{{ t('pt_platforms_desc') }}</p>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            v-for="p in platforms"
            :key="p.key"
            :href="p.href"
            target="_blank"
            rel="noopener"
            class="rc-card group p-5"
          >
            <div class="flex items-center justify-between">
              <h3 class="font-display text-lg font-semibold tracking-wide group-hover:text-rose-accent">{{ p.label }}</h3>
              <span class="text-sm text-rose-deep transition-colors group-hover:text-rose-accent">↗</span>
            </div>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.note }}</p>
          </a>
        </div>
      </section>

      <!-- 部署方式 -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('pt_deploy_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="(d, i) in deploys" :key="d.title" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ i + 1 }}</div>
            <h3 class="text-base font-bold">{{ d.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ d.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 三方对比表 -->
      <section class="mt-14">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('pt_compare_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <div class="mt-8 overflow-x-auto rounded-2xl border border-border-warm">
          <table class="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr class="bg-rose-tint">
                <th class="p-4 text-left font-display font-semibold tracking-wide"></th>
                <th class="p-4 text-left font-display font-semibold tracking-wide">RoleChat AI</th>
                <th class="p-4 text-left font-display font-semibold tracking-wide text-rose-accent">PureTavern</th>
                <th class="p-4 text-left font-display font-semibold tracking-wide">SillyTavern</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in compareRows"
                :key="row.label"
                class="border-t border-border-warm"
              >
                <th class="p-4 text-left align-top font-bold">{{ row.label }}</th>
                <td class="p-4 align-top leading-relaxed text-plum-muted">{{ row.rc }}</td>
                <td class="p-4 align-top leading-relaxed text-plum">{{ row.pt }}</td>
                <td class="p-4 align-top leading-relaxed text-plum-muted">{{ row.st }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- FAQ -->
      <section class="mx-auto mt-14 max-w-3xl">
        <h2 class="text-center font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('pt_faq_title') }}</h2>
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
          <h2 class="text-base font-bold">{{ t('pt_disclaimer_title') }}</h2>
          <p class="mt-3 text-sm leading-relaxed text-plum-muted">{{ t('pt_disclaimer_body') }}</p>
        </div>
      </section>

      <!-- CTA 导流站内网页版 -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('pt_cta_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('pt_cta_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('home_cta_explore') }}</NuxtLink>
        </div>
      </section>
    </main>

  </WorkbenchShell>
</template>
