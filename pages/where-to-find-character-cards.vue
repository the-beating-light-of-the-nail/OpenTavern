<script setup lang="ts">
const { t } = useI18n();

useSeoMeta({
  title: () => t('wfc_title') + ' — Open Tavern',
  description: () => t('wfc_subtitle'),
  ogTitle: () => t('wfc_title'),
  ogDescription: () => t('wfc_subtitle'),
});

// 资源站点：name 为专有名词（保持英文不译），desc 走 i18n。
// id 用于拼 i18n key：wfc_res_<id>_desc
const collections = [
  { name: 'Chatbots Webring', descKey: 'wfc_res_chatbots_webring_desc' },
  { name: 'AICharacterCards.com', descKey: 'wfc_res_aicharactercards_desc' },
  { name: 'Character Tavern', descKey: 'wfc_res_character_tavern_desc' },
  { name: 'realm.risuai.net', descKey: 'wfc_res_risuai_desc' },
  { name: 'Janny AI', descKey: 'wfc_res_janny_ai_desc' },
];

const cardsAndLorebooks = [
  { name: 'BotBooru', descKey: 'wfc_res_botbooru_desc' },
  { name: 'DataCat', descKey: 'wfc_res_datacat_desc' },
];

const individual = [
  { name: 'Wyvern.chat', descKey: 'wfc_res_wyvern_chat_desc' },
];
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-2xl px-5 py-12">
      <NuxtLink to="/guides" class="rc-nav-link mb-6 inline-flex">{{ t('wfc_back_all_guides') }}</NuxtLink>

      <h1 class="font-display text-3xl font-semibold tracking-wide sm:text-4xl">{{ t('wfc_title') }}</h1>
      <p class="mt-4 leading-relaxed text-plum-muted">{{ t('wfc_subtitle') }}</p>

      <!-- Quick explanation for beginners -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">{{ t('wfc_explanation_title') }}</h2>
        <div class="mt-3 space-y-3 leading-relaxed text-plum-muted">
          <p>{{ t('wfc_explanation_body_1') }}</p>
          <p>{{ t('wfc_explanation_body_2') }}</p>
          <ul class="list-disc space-y-1 pl-6">
            <li>{{ t('wfc_explanation_bullet_1') }}</li>
            <li>{{ t('wfc_explanation_bullet_2') }}</li>
            <li>{{ t('wfc_explanation_bullet_3') }}</li>
          </ul>
          <p>{{ t('wfc_explanation_body_3') }}</p>
        </div>
      </section>

      <!-- Section I -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">{{ t('wfc_section_1_title') }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-3">
          <div v-for="r in collections" :key="r.name" class="rc-card p-5">
            <h3 class="font-display text-lg font-semibold tracking-wide">{{ r.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ t(r.descKey) }}</p>
          </div>
        </div>
      </section>

      <!-- Section II -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">{{ t('wfc_section_2_title') }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-3">
          <div v-for="r in cardsAndLorebooks" :key="r.name" class="rc-card p-5">
            <h3 class="font-display text-lg font-semibold tracking-wide">{{ r.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ t(r.descKey) }}</p>
          </div>
        </div>
      </section>

      <!-- Section III -->
      <section class="mt-10">
        <h2 class="text-xl font-bold">{{ t('wfc_section_3_title') }}</h2>
        <div class="mt-4 grid grid-cols-1 gap-3">
          <div v-for="r in individual" :key="r.name" class="rc-card p-5">
            <h3 class="font-display text-lg font-semibold tracking-wide">{{ r.name }}</h3>
            <p class="mt-2 text-sm leading-relaxed text-plum-muted">{{ t(r.descKey) }}</p>
          </div>
        </div>
      </section>

      <!-- Disclaimer -->
      <section class="mt-12 rounded-2xl border border-border-warm bg-rose-tint p-6">
        <h2 class="text-base font-bold">{{ t('wfc_disclaimer_title') }}</h2>
        <div class="mt-3 space-y-2 text-sm leading-relaxed text-plum-muted">
          <p>{{ t('wfc_disclaimer_1') }}</p>
          <p>{{ t('wfc_disclaimer_2') }}</p>
          <p>{{ t('wfc_disclaimer_3') }}</p>
          <p>{{ t('wfc_disclaimer_4') }}</p>
        </div>
      </section>

      <!-- CTA -->
      <section class="rc-hero-bg mt-12 rounded-2xl border border-border-warm p-8 text-center">
        <h2 class="font-display text-2xl font-semibold tracking-wide">{{ t('wfc_cta_title') }}</h2>
        <div class="orn-divider" aria-hidden="true">✦</div>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">{{ t('wfc_cta_body') }}</p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <NuxtLink to="/app" class="rc-btn-primary">{{ t('wfc_open_app') }}</NuxtLink>
          <NuxtLink to="/characters" class="rc-btn-ghost">{{ t('wfc_browse_characters') }}</NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>
