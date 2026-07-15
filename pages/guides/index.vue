<script setup lang="ts">
import { guides } from '~/data/guides';

useSeoMeta({
  title: 'Guides — RoleChat AI',
  description:
    'Beginner-friendly guides to AI roleplay on RoleChat AI. Learn how to start your first chat, get an AI key, and make characters feel more alive.',
  ogTitle: 'Guides — RoleChat AI',
  ogDescription:
    'Beginner-friendly guides to AI roleplay on RoleChat AI. Start chatting in minutes.',
});
</script>

<template>
  <div class="min-h-[100dvh] bg-ivory text-plum">
    <SiteHeader />

    <main class="mx-auto max-w-3xl px-5 py-14">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">Guides</h1>
        <p class="mx-auto mt-3 max-w-xl text-plum-muted">
          New to AI roleplay? These short, beginner-friendly guides walk you through everything —
          from your first message to making characters feel truly alive.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <NuxtLink v-for="g in guides" :key="g.slug" :to="`/guides/${g.slug}`" class="rc-card group block p-6">
          <h2 class="text-lg font-bold group-hover:text-rose-accent">{{ g.title }}</h2>
          <p class="mt-2 leading-relaxed text-plum-muted">{{ g.description }}</p>
          <p class="mt-3 text-xs font-semibold text-rose-accent/70">Read guide →</p>
        </NuxtLink>
      </div>

      <div class="mt-12 text-center">
        <NuxtLink to="/characters" class="rc-btn-primary">Browse Characters</NuxtLink>
      </div>
    </main>
  </div>
</template>
