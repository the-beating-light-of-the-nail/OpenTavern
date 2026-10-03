<script setup lang="ts">
import { useCharacters } from '~/data';
import { HOME_HUB, HUB_CATEGORIES, type HubCategory } from '~/data/tools';
import { AD_REGISTRY, withAdCards } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';

// 首页试验区：所有 content 位广告，由 ?adpanel=1 面板的运行时开关控制显隐
// （类型收窄：过滤掉未配置 html/width/height 的注册项，供 AdBanner props 直接使用）
const { state } = useAdPanel();
const contentAds = AD_REGISTRY.filter(
  (a): a is typeof a & { html: string; width: number; height: number } =>
    a.placement === 'content' && a.html != null && a.width != null && a.height != null,
);
const anyContentOn = computed(() => contentAds.some((a) => state.value[a.id]));
// 首页 Popular 网格：每 6 张角色卡后插 1 张原生广告卡
const featuredGrid = computed(() => withAdCards(featured.value, (c) => c.slug));
const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('home_seo_title'),
  description: () => t('home_seo_desc'),
  ogTitle: () => t('home_seo_title'),
  ogDescription: () => t('home_seo_desc'),
});

// 首页展示前 6 个原创角色（链接到真实角色页）
const characters = useCharacters();
const featured = computed(() => characters.value.slice(0, 6));

/* 工具中枢（布局参照 tools.laopobao.online：分类侧栏 + 工具卡网格） */
const activeCat = ref<HubCategory | 'all'>('all');
const hubCategories = computed(() =>
  HUB_CATEGORIES.map((c) => ({
    id: c.id,
    label: t(c.labelKey),
    count: c.id === 'all' ? HOME_HUB.length : HOME_HUB.filter((x) => x.category === c.id).length,
  })),
);
const filteredHub = computed(() =>
  activeCat.value === 'all' ? HOME_HUB : HOME_HUB.filter((x) => x.category === activeCat.value),
);
function catLabelKeyOf(id: HubCategory): string {
  return HUB_CATEGORIES.find((c) => c.id === id)?.labelKey ?? 'home_hub_cat_all';
}


const howSteps = computed(() => [
  { n: 1, title: t('home_how_step1_title'), desc: t('home_how_step1_desc') },
  { n: 2, title: t('home_how_step2_title'), desc: t('home_how_step2_desc') },
  { n: 3, title: t('home_how_step3_title'), desc: t('home_how_step3_desc') },
]);

const privatePoints = computed(() => [
  { title: t('home_private_point1_title'), desc: t('home_private_point1_desc') },
  { title: t('home_private_point2_title'), desc: t('home_private_point2_desc') },
  { title: t('home_private_point3_title'), desc: t('home_private_point3_desc') },
  { title: t('home_private_point4_title'), desc: t('home_private_point4_desc') },
]);

const compatPoints = computed(() => [
  { title: t('home_compat_point1_title'), desc: t('home_compat_point1_desc') },
  { title: t('home_compat_point2_title'), desc: t('home_compat_point2_desc') },
  { title: t('home_compat_point3_title'), desc: t('home_compat_point3_desc') },
  { title: t('home_compat_point4_title'), desc: t('home_compat_point4_desc') },
]);

const guides = computed(() => [
  { title: t('home_guide1_title'), desc: t('home_guide1_desc') },
  { title: t('home_guide2_title'), desc: t('home_guide2_desc') },
  { title: t('home_guide3_title'), desc: t('home_guide3_desc') },
]);

const faqs = computed(() => [
  { q: t('home_faq_q1'), a: t('home_faq_a1') },
  { q: t('home_faq_q2'), a: t('home_faq_a2') },
  { q: t('home_faq_q3'), a: t('home_faq_a3') },
  { q: t('home_faq_q4'), a: t('home_faq_a4') },
  { q: t('home_faq_q5'), a: t('home_faq_a5') },
  { q: t('home_faq_q6'), a: t('home_faq_a6') },
  { q: t('home_faq_q7'), a: t('home_faq_a7') },
]);
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <!-- Top Nav -->
    <SiteHeader :show-extra-links="true" />

    <!-- Hero（收紧留白，让工具中枢更早进入视野） -->
    <section class="rc-hero-bg relative overflow-hidden">
      <PetalField />
      <div class="relative z-10 mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
        <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-rose-tint px-3 py-1 text-xs font-medium text-plum-light">
          <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('home_badge') }}
        </div>
        <h1 class="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          {{ t('home_hero_title_1') }}<br class="hidden sm:block" /> {{ t('home_hero_title_2') }}
        </h1>
        <p class="mx-auto mt-5 max-w-xl text-base text-plum-muted sm:text-lg">
          {{ t('home_hero_desc') }}
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <a href="#tools-hub" class="rc-btn-ghost">{{ t('home_cta_tools') }}</a>
        </div>
      </div>
    </section>

    <!-- Banner 试验区（Hero 下方）：所有 content 位广告，由 ?adpanel=1 面板控制显隐 -->
    <ClientOnly>
      <section v-if="anyContentOn" class="mx-auto max-w-5xl px-5 py-8">
        <div class="flex flex-wrap items-center justify-center gap-6">
          <AdBanner
            v-for="ad in contentAds"
            v-show="state[ad.id]"
            :key="ad.id"
            :src="ad.html"
            :width="ad.width"
            :height="ad.height"
          />
        </div>
      </section>
    </ClientOnly>

    <!-- 工具中枢（布局参照 tools.laopobao.online：分类侧栏 + 工具卡网格，站内视觉语言） -->
    <section id="tools-hub" class="mx-auto max-w-6xl scroll-mt-20 px-5 py-16">
      <div class="grid gap-8 lg:grid-cols-[220px_1fr]">
        <!-- 侧栏：工具分类筛选（移动端退化为横向滚动 chip 行） -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <h3 class="mb-3 hidden text-xs font-bold uppercase tracking-[0.18em] text-plum-faint lg:block">{{ t('home_hub_cats') }}</h3>
          <div class="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0">
            <button
              v-for="cat in hubCategories"
              :key="cat.id"
              type="button"
              class="flex flex-shrink-0 items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-colors lg:w-full"
              :class="activeCat === cat.id
                ? 'border-primary bg-rose-tint font-bold text-plum'
                : 'border-border bg-surface text-plum-muted hover:border-primary hover:text-plum'"
              :aria-pressed="activeCat === cat.id"
              @click="activeCat = cat.id"
            >
              <span>{{ cat.label }}</span>
              <span class="min-w-6 rounded-full px-1.5 py-0.5 text-center text-xs font-bold" :class="activeCat === cat.id ? 'bg-rose-deep/15 text-rose-deep' : 'bg-border text-plum-faint'">{{ cat.count }}</span>
            </button>
          </div>
          <!-- 完整目录入口（对齐 laopobao 侧栏底部「导入插件」位） -->
          <NuxtLink :to="localePath('/tools')" class="rc-card group mt-4 hidden items-center justify-between gap-3 p-4 lg:flex">
            <div class="min-w-0">
              <p class="text-sm font-bold">{{ t('home_tools_more_tag') }}</p>
              <p class="mt-0.5 truncate text-xs text-plum-muted">{{ t('home_tools_more_desc') }}</p>
            </div>
            <span class="flex-shrink-0 text-sm font-bold text-rose-deep transition-colors group-hover:text-rose-accent">→</span>
          </NuxtLink>
        </aside>

        <!-- 主区：探索工具 + 卡片网格 -->
        <div>
          <div class="mb-6">
            <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_hub_title') }}</h2>
            <div class="orn-divider" aria-hidden="true">✦</div>
            <p class="mt-2 max-w-xl text-sm leading-relaxed text-plum-muted">{{ t('home_hub_desc') }}</p>
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <template v-for="tool in filteredHub" :key="tool.slug">
              <!-- 开发中：虚线禁用卡（展示路线图） -->
              <div v-if="tool.status === 'soon'" class="flex flex-col rounded-xl border border-dashed border-border-strong bg-surface/60 p-5">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-display text-lg font-semibold tracking-wide text-plum-muted">{{ tool.name }}</h3>
                  <span class="flex-shrink-0 rounded-full bg-rose-tint px-2 py-0.5 text-[11px] font-bold text-rose-deep">{{ t('home_hub_soon') }}</span>
                </div>
                <p class="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-plum-muted">{{ t(tool.descKey) }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="rc-tag">{{ t(catLabelKeyOf(tool.category)) }}</span>
                </div>
              </div>
              <!-- 可用：站内路由或外链 -->
              <NuxtLink
                v-else
                :to="tool.href ? tool.href : localePath(tool.to || '/')"
                :external="!!tool.href"
                :target="tool.href ? '_blank' : undefined"
                :rel="tool.href ? 'noopener' : undefined"
                class="rc-card group flex flex-col p-5"
              >
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-display text-lg font-semibold tracking-wide group-hover:text-rose-accent">{{ tool.name }}</h3>
                  <span v-if="tool.license" class="rc-tag flex-shrink-0">{{ tool.license }}</span>
                </div>
                <p class="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-plum-muted">{{ t(tool.descKey) }}</p>
                <div class="mt-4 flex items-center justify-between">
                  <span class="rc-tag">{{ t(catLabelKeyOf(tool.category)) }}</span>
                  <span class="text-sm font-bold text-rose-deep transition-colors group-hover:text-rose-accent">{{ tool.href ? '↗' : '→' }}</span>
                </div>
              </NuxtLink>
            </template>
          </div>
          <!-- 移动端目录入口（桌面端已由侧栏承担） -->
          <NuxtLink :to="localePath('/tools')" class="rc-card group mt-4 flex items-center justify-between gap-4 p-4 lg:hidden">
            <div class="flex min-w-0 items-center gap-3">
              <span class="rc-tag flex-shrink-0">{{ t('home_tools_more_tag') }}</span>
              <p class="truncate text-sm text-plum-muted">{{ t('home_tools_more_desc') }}</p>
            </div>
            <span class="flex-shrink-0 text-sm font-bold text-rose-deep transition-colors group-hover:text-rose-accent">{{ t('home_tools_more_cta') }} →</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 产品区分隔：以下为 RoleChat AI（网页酒馆）产品内容 -->
    <div class="border-y border-border-warm bg-rose-tint">
      <p class="mx-auto max-w-5xl px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-plum-faint">
        {{ t('home_featured_eyebrow') }}
      </p>
    </div>

    <!-- Popular Romance Characters (原创非 IP，链接到真实角色页) -->
    <section class="mx-auto max-w-5xl px-5 py-20">
      <div class="mb-10 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_popular_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_popular_desc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <template v-for="g in featuredGrid" :key="g.key">
          <AdCard v-if="g.kind === 'ad'" />
          <NuxtLink v-else :to="localePath(`/characters/${g.item.slug}`)" class="rc-card group block p-5">
            <div class="flex items-center gap-3">
              <CharAvatar :avatar="g.item.avatar" :initial="g.item.initial" size="md" />
              <div class="min-w-0">
                <h3 class="font-display truncate text-lg font-semibold tracking-wide group-hover:text-rose-accent">{{ g.item.name }}</h3>
                <p class="truncate text-xs text-rose-accent">{{ g.item.archetype }}</p>
              </div>
            </div>
            <p class="mt-3 line-clamp-3 text-sm leading-relaxed text-plum-muted">{{ g.item.tagline }}</p>
            <div class="mt-4 flex flex-wrap gap-1.5">
              <span v-for="tg in g.item.tags.slice(0, 3)" :key="tg" class="rc-tag">{{ tg }}</span>
            </div>
          </NuxtLink>
        </template>
      </div>
      <div class="mt-10 text-center">
        <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('home_see_all') }}</NuxtLink>
      </div>
    </section>

    <!-- SillyTavern Compatible -->
    <section class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <div class="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-bg px-3 py-1 text-xs font-medium text-plum-light">
            <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('home_compat_badge') }}
          </div>
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_compat_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_compat_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div v-for="p in compatPoints" :key="p.title" class="rc-card p-6">
            <h3 class="flex items-center gap-2 text-base font-bold">
              <span class="h-2 w-2 flex-shrink-0 rounded-full" style="background:var(--color-rose-deep)" /> {{ p.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.desc }}</p>
          </div>
        </div>
        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_compat_cta_app') }}</NuxtLink>
          <NuxtLink :to="localePath('/where-to-find-character-cards')" class="rc-btn-ghost">{{ t('home_compat_cta_cards') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section id="how" class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_how_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_how_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div v-for="s in howSteps" :key="s.n" class="rc-card p-6">
            <div class="rc-avatar-fill mb-4 flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">{{ s.n }}</div>
            <h3 class="text-base font-bold">{{ s.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ s.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Private by Design -->
    <section class="mx-auto max-w-5xl px-5 py-20">
      <div class="mb-12 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_private_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_private_desc') }}</p>
      </div>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div v-for="p in privatePoints" :key="p.title" class="rc-card p-6">
          <h3 class="flex items-center gap-2 text-base font-bold">
            <span class="h-2 w-2 flex-shrink-0 rounded-full" style="background:var(--color-success)" /> {{ p.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Beginner Guides -->
    <section class="border-y border-border-warm bg-rose-tint">
      <div class="mx-auto max-w-5xl px-5 py-20">
        <div class="mb-12 text-center">
          <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_guides_title') }}</h2>
          <div class="orn-divider" aria-hidden="true">✦</div>
          <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_guides_desc') }}</p>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div v-for="g in guides" :key="g.title" class="rc-card p-6">
            <h3 class="text-base font-bold">{{ g.title }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ g.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="mx-auto max-w-3xl px-5 py-20">
      <div class="mb-10 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_faq_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_faq_desc') }}</p>
      </div>
      <div class="rc-faq">
        <details v-for="f in faqs" :key="f.q">
          <summary>{{ f.q }}</summary>
          <p class="rc-faq-a">{{ f.a }}</p>
        </details>
      </div>
    </section>

    <!-- Footer CTA -->
    <section class="rc-hero-bg border-t border-border-warm">
      <div class="mx-auto max-w-3xl px-5 py-20 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide sm:text-3xl">{{ t('home_footer_ready_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('home_footer_ready_desc') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink :to="localePath('/app')" class="rc-btn-primary">{{ t('home_cta_start') }}</NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="rc-btn-ghost">{{ t('home_cta_explore') }}</NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="border-t border-border-warm">
      <div class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <div class="flex items-center gap-2">
          <div class="rc-avatar-fill flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold tracking-tighter" role="img" aria-label="Open Tavern">OT</div>
          <span class="text-sm font-bold">Open Tavern</span>
        </div>
        <nav class="flex items-center gap-4 text-xs text-plum-faint">
          <NuxtLink :to="localePath('/tools')" class="hover:text-plum-light">{{ t('nav_tools') }}</NuxtLink>
          <NuxtLink :to="localePath('/characters')" class="hover:text-plum-light">{{ t('nav_characters') }}</NuxtLink>
          <NuxtLink :to="localePath('/guides')" class="hover:text-plum-light">{{ t('nav_guides') }}</NuxtLink>
          <NuxtLink :to="localePath('/about')" class="hover:text-plum-light">{{ t('nav_about') }}</NuxtLink>
          <NuxtLink :to="localePath('/contact')" class="hover:text-plum-light">{{ t('nav_contact') }}</NuxtLink>
          <NuxtLink :to="localePath('/privacy')" class="hover:text-plum-light">{{ t('nav_privacy') }}</NuxtLink>
          <NuxtLink :to="localePath('/terms')" class="hover:text-plum-light">{{ t('nav_terms') }}</NuxtLink>
          <NuxtLink :to="localePath('/app')" class="hover:text-plum-light">{{ t('nav_open_app') }}</NuxtLink>
          <a href="#how" class="hover:text-plum-light">{{ t('nav_how_it_works') }}</a>
          <a href="#faq" class="hover:text-plum-light">{{ t('nav_faq') }}</a>
        </nav>
        <p class="text-xs text-plum-faint">{{ t('home_footer_tagline') }}</p>
      </div>
    </footer>
  </div>
</template>
