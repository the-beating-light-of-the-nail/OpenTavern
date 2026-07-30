<script setup lang="ts">
// 侧边贴边竖幅广告。side=left/right；宽屏 fixed 显示，窄屏隐藏；/app 不显示。
import { useAdPanel } from '~/composables/useAdPanel';

defineProps<{ side: 'left' | 'right'; adId: string; src: string; width: number; height: number }>();
const { state } = useAdPanel();
const route = useRoute();
const hidden = computed(() => route.path.includes('/app'));
</script>

<template>
  <ClientOnly>
    <div
      v-if="state[adId] && !hidden"
      class="ad-sidebar"
      :class="[`ad-sidebar--${side}`]"
      aria-label="Advertisement"
    >
      <iframe :src :width :height title="Advertisement" scrolling="no" style="border: 0; display: block" />
    </div>
  </ClientOnly>
</template>

<style scoped>
.ad-sidebar {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
}
.ad-sidebar--left { left: 4px; }
.ad-sidebar--right { right: 4px; }
/* 两侧竖幅需要足够宽的视口；窄屏隐藏避免遮挡内容 */
@media (max-width: 1280px) {
  .ad-sidebar { display: none; }
}
</style>
