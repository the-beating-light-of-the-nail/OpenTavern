<script setup lang="ts">
// 营销/SEO 站点公共顶栏 —— 复用于 /, /characters, /collections, /guides 页面
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
    <div class="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <NuxtLink to="/" class="flex items-center gap-2">
        <div class="rc-avatar-fill flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold tracking-tighter">RC</div>
        <span class="text-sm font-bold">RoleChat AI</span>
      </NuxtLink>
      <nav class="flex items-center gap-1.5">
        <NuxtLink to="/characters" class="rc-nav-link">Characters</NuxtLink>
        <NuxtLink to="/guides" class="rc-nav-link">Guides</NuxtLink>
        <NuxtLink to="/app" class="rc-nav-link-primary">Open App</NuxtLink>
      </nav>
    </div>
  </header>
</template>
