<script setup lang="ts">
const props = defineProps<{
  name: string;
  tags?: string[];
  description?: string;
  image?: string;
  cardSlug?: string;
}>();

const emit = defineEmits<{ select: [] }>();

/** 卡片预览渲染宽度（CSS 最宽 ~300px × retina） */
const WIDE = 600;
const SRCSET_WIDTHS = [200, 400, 600];

/** 优化变体 srcset（cardSlug 存在时使用 public/cards/ 下产物） */
function srcsetFor(ext: 'webp' | 'avif'): string | null {
  if (!props.cardSlug) return null;
  return SRCSET_WIDTHS.map((w) => `/cards/${props.cardSlug}-${w}.${ext} ${w}w`).join(', ');
}
const webpSrcset = computed(() => srcsetFor('webp'));
const avifSrcset = computed(() => srcsetFor('avif'));
const fallbackSrc = computed(() => (props.cardSlug ? `/cards/${props.cardSlug}-${WIDE}.webp` : null));
</script>

<template>
  <div class="group ui-panel rounded-2xl cursor-pointer overflow-hidden transition-all hover:border-[var(--color-primary)] relative" @click="emit('select')">
    <!-- 3:4 preview -->
    <div class="relative aspect-[3/4] overflow-hidden ot-avatar-fill">
      <!-- 优先 base64 data URL（用户导入） -->
      <img v-if="image" :src="image" :alt="name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" width="300" height="400">
      <!-- 否则使用优化变体（public/cards/*.webp|avif），AVIF 优先 + WebP 回退 -->
      <picture v-else-if="cardSlug && fallbackSrc">
        <source v-if="avifSrcset" type="image/avif" :srcset="avifSrcset">
        <source v-if="webpSrcset" type="image/webp" :srcset="webpSrcset">
        <img :src="fallbackSrc" :alt="name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" decoding="async" width="300" height="400">
      </picture>
      <!-- 占位（首字母） -->
      <div v-else class="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white/80">
        {{ (name || '?').charAt(0) }}
      </div>
    </div>
    <!-- name + tags -->
    <div class="p-3">
      <p class="text-sm font-semibold truncate" style="color:var(--color-text)">{{ name }}</p>
      <div v-if="tags && tags.length" class="flex flex-wrap gap-1 mt-1.5">
        <span v-for="tag in tags.slice(0, 3)" :key="tag" class="char-tag">{{ tag }}</span>
      </div>
      <p v-if="description" class="text-[11px] mt-1.5 line-clamp-2 leading-snug" style="color:var(--color-text-muted)">{{ description }}</p>
    </div>
  </div>
</template>
