<script setup lang="ts">
defineProps<{
  name: string;
  tags?: string[];
  description?: string;
  image?: string;
  /** 用于 @import CardItem 指定类型 */
}>();
</script>

<template>
  <div class="group glass rounded-2xl cursor-pointer overflow-hidden transition-all hover:border-amber-500/30 hover:bg-white/[0.06] relative">
    <!-- 3:4 preview -->
    <div class="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-amber-500/20 to-pink-500/10 ot-avatar-fill">
      <img v-if="image" :src="image" :alt="name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy">
      <div v-else class="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/80">
        {{ (name || '?').charAt(0) }}
      </div>
    </div>
    <!-- name + tags -->
    <div class="p-3">
      <p class="text-sm font-semibold text-zinc-100 truncate">{{ name }}</p>
      <div v-if="tags && tags.length" class="flex flex-wrap gap-1 mt-1.5">
        <span v-for="tag in tags.slice(0, 3)" :key="tag" class="char-tag">{{ tag }}</span>
      </div>
      <p v-if="description" class="text-[11px] text-zinc-500 mt-1.5 line-clamp-2 leading-snug">{{ description }}</p>
    </div>
  </div>
</template>
