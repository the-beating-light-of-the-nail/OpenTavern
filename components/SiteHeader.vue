<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useLocale } from '~/composables/useLocale';

withDefaults(defineProps<{ showExtraLinks?: boolean }>(), { showExtraLinks: true });
const { t } = useI18n();
const store = useAppStore();
const { setLocale, supported } = useLocale();

const langOptions = [
  { code: 'en', label: 'EN' },
  { code: 'zh-CN', label: '简' },
  { code: 'zh-TW', label: '繁' },
].filter((o) => supported.includes(o.code as any));

function onLangChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  setLocale(target.value);
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border-warm backdrop-blur-xl" style="background:color-mix(in srgb,var(--color-bg) 82%,transparent)">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="rc-avatar-fill flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-tighter">RC</div>
        <span class="text-sm font-bold">RoleChat AI</span>
      </NuxtLink>
      <nav class="flex items-center gap-1.5">
        <select :value="store.settings.lang" class="text-xs font-semibold rounded-md px-2 py-1 border cursor-pointer appearance-none text-center mr-1 transition-colors" style="background:color-mix(in srgb, var(--color-primary) 10%, transparent);color:var(--color-primary);border-color:color-mix(in srgb, var(--color-primary) 18%, transparent)" @change="onLangChange">
          <option v-for="o in langOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
        </select>
        <NuxtLink to="/characters" class="rc-nav-link">{{ t('nav_characters') }}</NuxtLink>
        <NuxtLink to="/guides" class="rc-nav-link">{{ t('nav_guides') }}</NuxtLink>
        <template v-if="showExtraLinks">
          <a href="/#how" class="rc-nav-link">{{ t('nav_how_it_works') }}</a>
          <a href="/#faq" class="rc-nav-link">{{ t('nav_faq') }}</a>
        </template>
        <NuxtLink to="/app" class="rc-nav-link-primary">{{ t('nav_open_app') }}</NuxtLink>
      </nav>
    </div>
  </header>
</template>
