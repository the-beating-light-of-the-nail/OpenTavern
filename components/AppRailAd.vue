<script setup lang="ts">
// /app 最右侧窄列广告（与左侧 AppSidebar 对称）。仅宽屏显示，窄屏隐藏；贴最边缘不打扰聊天区。
import { ADS } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';

const { state } = useAdPanel();
const b = ADS.banner160x600;
</script>

<template>
  <ClientOnly>
    <aside v-if="state.banner160x600" class="app-rail-ad" aria-label="Advertisement">
      <iframe :src="b.html" :width="b.width" :height="b.height" title="Advertisement" scrolling="no" style="border: 0; display: block" />
    </aside>
  </ClientOnly>
</template>

<style scoped>
.app-rail-ad {
  display: none;
  flex-shrink: 0;
  width: 164px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  border-left: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
  background: color-mix(in srgb, var(--color-panel, #1a1a22) 70%, transparent);
}
/* 仅宽屏显示，窄屏彻底隐藏不占空间 */
@media (min-width: 1280px) {
  .app-rail-ad {
    display: flex;
  }
}
</style>
