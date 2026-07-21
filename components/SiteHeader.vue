<script setup lang="ts">
withDefaults(defineProps<{ showExtraLinks?: boolean }>(), { showExtraLinks: true });
const { t } = useI18n();
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border-warm backdrop-blur-xl" style="background:color-mix(in srgb,var(--color-bg) 82%,transparent)">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="rc-avatar-fill flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-tighter">RC</div>
        <span class="text-sm font-bold">RoleChat AI</span>
      </NuxtLink>
      <nav class="flex items-center gap-1.5">
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
