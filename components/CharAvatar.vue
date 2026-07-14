<script setup lang="ts">
/**
 * 角色头像：优先渲染 <img :src="avatar">；图片缺失（404/onerror）回退到 initial 字母渐变头像。
 * SSR 安全：img 标签服务端渲染为 <img>，无图片时不报错；onerror 仅在客户端触发。
 */
const props = defineProps<{
  avatar?: string;
  initial: string;
  size?: 'sm' | 'md' | 'lg';
}>();

const failed = ref(false);
const sizeClass = computed(() => ({
  sm: 'h-10 w-10 text-sm',
  md: 'h-12 w-12 text-lg',
  lg: 'h-16 w-16 text-2xl',
}[props.size || 'md']));
</script>

<template>
  <img
    v-if="avatar && !failed"
    :src="avatar"
    :alt="initial"
    loading="lazy"
    :class="['rc-avatar-img flex-shrink-0 rounded-xl object-cover', sizeClass]"
    @error="failed = true"
  >
  <div
    v-else
    :class="['rc-avatar-fill flex flex-shrink-0 items-center justify-center rounded-xl font-bold', sizeClass]"
  >{{ initial }}</div>
</template>
