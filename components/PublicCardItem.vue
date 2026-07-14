<script setup lang="ts">
import type { CharacterSeo } from '~/types/seo';

/**
 * 公共角色卡（SEO 静态角色）：复用于 /app LibraryView 公共 tab 与 SEO /characters 列表。
 * View Profile → /characters/[slug]；Start Chat → /app?character=<slug>。
 * 两个按钮均为 NuxtLink（SSR 安全；/app 为 ssr:false，客户端接管）。
 */
defineProps<{ c: CharacterSeo }>();
</script>

<template>
  <div class="rc-card flex flex-col p-5">
    <div class="flex items-center gap-3">
      <CharAvatar :avatar="c.avatar" :initial="c.initial" size="md" />
      <div class="min-w-0">
        <h3 class="truncate text-base font-bold">{{ c.name }}</h3>
        <p class="truncate text-xs text-amber-400/80">{{ c.archetype }}</p>
      </div>
    </div>
    <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-400">{{ c.tagline }}</p>
    <div class="mt-4 flex flex-wrap gap-1.5">
      <span class="char-tag">{{ c.category }}</span>
      <span v-for="t in c.tags.slice(0, 2)" :key="t" class="char-tag">{{ t }}</span>
    </div>
    <!-- 两按钮：View Profile / Start Chat -->
    <div class="mt-4 flex gap-2">
      <NuxtLink :to="`/characters/${c.slug}`" class="flex-1 rounded-lg border border-white/10 px-3 py-2 text-center text-xs font-semibold text-zinc-300 transition-all hover:border-white/25 hover:bg-white/5 hover:text-zinc-100">
        View Profile
      </NuxtLink>
      <NuxtLink :to="`/app?character=${c.slug}`" class="flex-1 rounded-lg bg-amber-500 px-3 py-2 text-center text-xs font-bold text-white transition-all hover:bg-amber-400">
        Start Chat
      </NuxtLink>
    </div>
  </div>
</template>
