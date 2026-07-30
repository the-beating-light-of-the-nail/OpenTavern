<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useLocale } from '~/composables/useLocale';

withDefaults(defineProps<{ showExtraLinks?: boolean }>(), { showExtraLinks: true });
const { t } = useI18n();
const localePath = useLocalePath();
const store = useAppStore();
const { setLocale, supported } = useLocale();

const langOptions = [
  { code: 'en', label: t('lang_en_short') },
  { code: 'zh-CN', label: t('lang_zh_cn_short') },
  { code: 'zh-TW', label: t('lang_zh_tw_short') },
  { code: 'es', label: t('lang_es_short') },
  { code: 'ar', label: t('lang_ar_short') },
  { code: 'pt', label: t('lang_pt_short') },
  { code: 'ru', label: t('lang_ru_short') },
  { code: 'fr', label: t('lang_fr_short') },
  { code: 'de', label: t('lang_de_short') },
  { code: 'ja', label: t('lang_ja_short') },
  { code: 'ko', label: t('lang_ko_short') },
  { code: 'it', label: t('lang_it_short') },
  { code: 'nl', label: t('lang_nl_short') },
  { code: 'sv', label: t('lang_sv_short') },
  { code: 'no', label: t('lang_no_short') },
  { code: 'da', label: t('lang_da_short') },
  { code: 'fi', label: t('lang_fi_short') },
  { code: 'pl', label: t('lang_pl_short') },
  { code: 'tr', label: t('lang_tr_short') },
  { code: 'hi', label: t('lang_hi_short') },
  { code: 'id', label: t('lang_id_short') },
  { code: 'vi', label: t('lang_vi_short') },
  { code: 'th', label: t('lang_th_short') },
  { code: 'ms', label: t('lang_ms_short') },
  { code: 'tl', label: t('lang_tl_short') },
].filter((o) => supported.includes(o.code as any));

function onLangChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  setLocale(target.value);
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border-warm backdrop-blur-xl" style="background:color-mix(in srgb,var(--color-bg) 82%,transparent)">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <NuxtLink :to="localePath('/')" class="flex items-center gap-2">
        <div class="rc-avatar-fill flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-tighter">RC</div>
        <span class="text-sm font-bold">RoleChat AI</span>
      </NuxtLink>
      <nav class="flex items-center gap-1.5">
        <select :value="store.settings.lang" class="text-xs font-semibold rounded-md px-2 py-1 border cursor-pointer appearance-none text-center mr-1 transition-colors" style="background:color-mix(in srgb, var(--color-primary) 10%, transparent);color:var(--color-primary);border-color:color-mix(in srgb, var(--color-primary) 18%, transparent)" @change="onLangChange">
          <option v-for="o in langOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
        </select>
        <NuxtLink :to="localePath('/characters')" class="rc-nav-link">{{ t('nav_characters') }}</NuxtLink>
        <NuxtLink :to="localePath('/guides')" class="rc-nav-link">{{ t('nav_guides') }}</NuxtLink>
        <template v-if="showExtraLinks">
          <NuxtLink :to="localePath('/#how')" class="rc-nav-link">{{ t('nav_how_it_works') }}</NuxtLink>
          <NuxtLink :to="localePath('/#faq')" class="rc-nav-link">{{ t('nav_faq') }}</NuxtLink>
        </template>
        <NuxtLink :to="localePath('/app')" class="rc-nav-link-primary">{{ t('nav_open_app') }}</NuxtLink>
      </nav>
    </div>
    <SiteAd />
  </header>
</template>
