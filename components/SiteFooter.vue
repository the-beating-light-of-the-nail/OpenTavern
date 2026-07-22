<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <footer class="border-t border-border-warm">
    <div
      class="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row"
    >
      <div class="flex items-center gap-2">
        <div
          class="rc-avatar-fill flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold tracking-tighter"
        >
          RC
        </div>
        <span class="text-sm font-bold">RoleChat AI</span>
      </div>
      <nav class="flex flex-wrap items-center justify-center gap-4 text-xs text-plum-faint">
        <NuxtLink to="/characters" class="hover:text-plum-light">{{ t('nav_characters') }}</NuxtLink>
        <NuxtLink to="/guides" class="hover:text-plum-light">{{ t('nav_guides') }}</NuxtLink>
        <NuxtLink to="/about" class="hover:text-plum-light">{{ t('nav_about') }}</NuxtLink>
        <NuxtLink to="/contact" class="hover:text-plum-light">{{ t('nav_contact') }}</NuxtLink>
        <NuxtLink to="/app" class="hover:text-plum-light">{{ t('nav_open_app') }}</NuxtLink>
      </nav>
      <p class="text-xs text-plum-faint">{{ t('home_footer_tagline') }}</p>
    </div>
  </footer>
</template>
