<script setup lang="ts">
// 页面底部广告（内容流末尾，滚到最下才见）。/app 不显示。
import { useAdPanel } from '~/composables/useAdPanel';

defineProps<{ adId: string; src: string; width: number; height: number }>();
const { state } = useAdPanel();
const route = useRoute();
const hidden = computed(() => route.path.includes('/app'));
</script>

<template>
  <ClientOnly>
    <div v-if="state[adId] && !hidden" class="ad-footer">
      <iframe :src :width :height title="Advertisement" scrolling="no" style="border: 0; display: block; max-width: 100%" />
    </div>
  </ClientOnly>
</template>

<style scoped>
.ad-footer {
  display: flex;
  justify-content: center;
  padding: 20px 16px;
  border-top: 1px solid var(--color-border-warm, #e7d9c9);
}
</style>
