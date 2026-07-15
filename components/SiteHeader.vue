<script setup lang="ts">
defineProps<{ showExtraLinks?: boolean }>();
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-border-warm bg-ivory/80 backdrop-blur-xl">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="rc-avatar-fill flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-tighter">RC</div>
        <span class="text-sm font-bold">RoleChat AI</span>
      </NuxtLink>
      <nav class="flex items-center gap-1.5">
        <NuxtLink to="/characters" class="rc-nav-link">Characters</NuxtLink>
        <NuxtLink to="/guides" class="rc-nav-link">Guides</NuxtLink>
        <template v-if="showExtraLinks">
          <a href="/#how" class="rc-nav-link">How it works</a>
          <a href="/#faq" class="rc-nav-link">FAQ</a>
        </template>
        <NuxtLink to="/app" class="rc-nav-link-primary">Open App</NuxtLink>
      </nav>
    </div>
  </header>
</template>
