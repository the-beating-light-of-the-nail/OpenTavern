<script setup lang="ts">
import type { CharacterSeo } from '~/types/seo';

/**
 * 公共角色卡（Romance Light 乙女风）：大头像 + 渐变顶条 + tagline + archetype + 标签 + 双按钮。
 * 复用于 /app LibraryView 公共 tab 与 SEO /characters 列表。
 */
defineProps<{ c: CharacterSeo }>();
</script>

<template>
  <div class="rc-card flex flex-col overflow-hidden">
    <!-- 顶部柔玫瑰渐变条 -->
    <div class="rc-card-accent" />
    <div class="flex flex-col p-5">
      <!-- 大头像 + 名字 -->
      <div class="flex items-center gap-3.5">
        <CharAvatar :avatar="c.avatar" :initial="c.initial" size="lg" />
        <div class="min-w-0">
          <h3 class="truncate text-base font-bold text-plum">{{ c.name }}</h3>
          <p class="truncate text-xs text-rose-accent">{{ c.archetype }}</p>
        </div>
      </div>
      <!-- Tagline -->
      <p class="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-plum-muted">{{ c.tagline }}</p>
      <!-- 标签 -->
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span class="rc-tag">{{ c.category }}</span>
        <span v-for="t in c.tags.slice(0, 2)" :key="t" class="rc-tag">{{ t }}</span>
      </div>
      <!-- 两按钮 -->
      <div class="mt-4 flex gap-2">
        <NuxtLink :to="`/characters/${c.slug}`" class="flex-1 rounded-lg border border-border-warm px-3 py-2 text-center text-xs font-semibold text-plum-muted transition-all hover:border-rose-accent hover:bg-rose-tint hover:text-plum">
          View Profile
        </NuxtLink>
        <NuxtLink :to="`/app?character=${c.slug}`" class="flex-1 rounded-lg bg-rose-accent px-3 py-2 text-center text-xs font-bold text-white transition-all hover:bg-rose-deep">
          Start Chat
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
