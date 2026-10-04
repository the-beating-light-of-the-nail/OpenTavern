<script setup lang="ts">
/**
 * 首页 —— 应用工作台布局 + 原首页 SEO 内容
 *
 * 结构参照 https://tools.laopobao.online/ ：顶栏 + 左分类栏 + 工具卡网格（见 wb-layout）。
 * 网格下方 1:1 恢复改造前的营销段落（.wb-seo）——H1/正文体量/H2·H3 层级/FAQ/内链与旧版首页一致，
 * 不做 SEO 取舍。原 H1 文案回到工作台标题位，原 tools hub 的 H2 作为网格上方小节标题。
 *
 * 规格与实测数据：docs/research/laopobao-tools/home/
 * SEO 基线对比：docs/research/laopobao-tools/home/seo/{old-live,new-local}.json
 */
import { useCharacters } from '~/data';
import { HOME_HUB, HUB_CATEGORIES, type HubCategory, type HubTool } from '~/data/tools';
import { AD_REGISTRY, withAdCards } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: () => t('home_seo_title'),
  description: () => t('home_seo_desc'),
  ogTitle: () => t('home_seo_title'),
  ogDescription: () => t('home_seo_desc'),
});

/* ================= 工作台：分类筛选（click-driven，不导航、不改 URL） ================= */
const activeCat = ref<HubCategory | 'all'>('all');

const categories = computed(() =>
  HUB_CATEGORIES.map((c) => ({
    id: c.id as string,
    label: t(c.labelKey),
    count: c.id === 'all' ? HOME_HUB.length : HOME_HUB.filter((x) => x.category === c.id).length,
  })),
);

const filteredHub = computed(() =>
  activeCat.value === 'all' ? HOME_HUB : HOME_HUB.filter((x) => x.category === activeCat.value),
);

function setCat(id: string) {
  activeCat.value = id as HubCategory | 'all';
}

function catLabelOf(id: HubCategory): string {
  return t(HUB_CATEGORIES.find((c) => c.id === id)?.labelKey ?? 'home_hub_cat_all');
}

/** 站内路由过 localePath；外链原样透传（HubToolCard 据 tool.href 决定 a / NuxtLink） */
function toOf(tool: HubTool): string {
  return tool.href ?? localePath(tool.to ?? '/');
}

/* ================= 广告：content 位 banner（?adpanel=1 面板控制） ================= */
const { state } = useAdPanel();
const contentAds = AD_REGISTRY.filter(
  (a): a is typeof a & { html: string; width: number; height: number } =>
    a.placement === 'content' && a.html != null && a.width != null && a.height != null,
);
const anyContentOn = computed(() => contentAds.some((a) => state.value[a.id]));

/* ================= 以下为原首页内容（1:1 保留，勿删：SEO 正文与内链来源） ================= */
// Popular 网格：每 6 张角色卡后插 1 张原生广告卡
const characters = useCharacters();
const featured = computed(() => characters.value.slice(0, 6));
const featuredGrid = computed(() => withAdCards(featured.value, (c) => c.slug));

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

const footerLinks = computed(() => [
  { to: localePath('/tools'), label: t('nav_tools') },
  { to: localePath('/characters'), label: t('nav_characters') },
  { to: localePath('/guides'), label: t('nav_guides') },
  { to: localePath('/about'), label: t('nav_about') },
  { to: localePath('/contact'), label: t('nav_contact') },
  { to: localePath('/privacy'), label: t('nav_privacy') },
  { to: localePath('/terms'), label: t('nav_terms') },
  { to: localePath('/app'), label: t('nav_open_app') },
]);
</script>

<template>
  <div class="wb-shell">
    <WorkbenchHeader />

    <main class="wb-main">
      <div class="wb-layout">
        <!-- 桌面：分类侧栏（≥768px 显示） -->
        <HubCategoryNav
          variant="rail"
          :categories="categories"
          :model-value="activeCat"
          @update:model-value="setCat"
        />

        <div class="wb-content">
          <!-- 移动端：分类胶囊（<768px 显示） -->
          <HubCategoryNav
            variant="pills"
            :categories="categories"
            :model-value="activeCat"
            @update:model-value="setCat"
          />

          <!-- 页面 H1：沿用改造前的 hero 文案，SEO 主标题不变 -->
          <div class="wb-head">
            <div>
              <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-rose-tint px-3 py-1 text-xs font-medium text-plum-light">
                <span class="h-1.5 w-1.5 rounded-full bg-rose-deep" /> {{ t('home_badge') }}
              </div>
              <h1 class="wb-title">{{ t('home_hero_title_1') }} {{ t('home_hero_title_2') }}</h1>
              <p class="wb-sub">{{ t('home_hero_desc') }}</p>
            </div>
            <div class="wb-head-actions">
              <NuxtLink :to="localePath('/app')" class="rc-btn-primary rc-btn-compact">{{ t('home_cta_start') }}</NuxtLink>
              <a href="#tools-hub" class="rc-btn-ghost rc-btn-compact">{{ t('home_cta_tools') }}</a>
            </div>
          </div>

          <!-- 工具中枢：原 tools hub 的 H2 + 描述（锚点沿用 #tools-hub） -->
          <div id="tools-hub" class="wb-tools-head scroll-mt-20">
            <h2 class="wb-tools-title">{{ t('home_hub_title') }}</h2>
            <p class="wb-tools-sub">{{ t('home_hub_desc') }}</p>
          </div>

          <div class="wb-grid">
            <HubToolCard
              v-for="tool in filteredHub"
              :key="tool.slug"
              :tool="tool"
              :category-label="catLabelOf(tool.category)"
              :to="toOf(tool)"
            />
          </div>

          <!-- 广告位：网格下方（content 位 banner，由 ?adpanel=1 面板控制显隐） -->
          <ClientOnly>
            <div v-if="anyContentOn" class="wb-ads">
              <div class="wb-ads-row">
                <AdBanner
                  v-for="ad in contentAds"
                  v-show="state[ad.id]"
                  :key="ad.id"
                  :src="ad.html"
                  :width="ad.width"
                  :height="ad.height"
                />
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </main>

    <!-- ================= SEO 内容区：原首页营销段落原样保留 ================= -->
    <div class="wb-seo">
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
    </div>

    <!-- 极简页脚 -->
    <footer class="wb-footer">
      <div class="wb-footer-inner">
        <NuxtLink :to="localePath('/')" class="wb-footer-brand">
          <span class="wb-brand-mark">OT</span>
          <span>Open Tavern</span>
        </NuxtLink>
        <nav class="wb-footer-nav">
          <NuxtLink v-for="l in footerLinks" :key="l.to" :to="l.to">{{ l.label }}</NuxtLink>
        </nav>
        <p>{{ t('home_footer_tagline') }}</p>
      </div>
    </footer>
  </div>
</template>
