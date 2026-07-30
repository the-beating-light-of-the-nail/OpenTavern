<script setup lang="ts">
// 手机端聊天输入框上方薄横幅（320×50）。仅窄屏显示（<1280px），桌面端走 AppRailAd。
// 不挡输入框与发送键（位于其上方），留存友好的常驻位。
import { ADS } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';

const { state } = useAdPanel();
const b = ADS.banner320x50;
</script>

<template>
  <ClientOnly>
    <div v-if="state.banner320x50" class="chat-mobile-ad" aria-label="Advertisement">
      <iframe :src="b.html" :width="b.width" :height="b.height" title="Advertisement" scrolling="no" style="border: 0; display: block" />
    </div>
  </ClientOnly>
</template>

<style scoped>
.chat-mobile-ad {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
  padding: 2px 0;
  border-top: 1px solid var(--color-border, rgba(255, 255, 255, 0.06));
  background: color-mix(in srgb, var(--color-panel, #1a1a22) 50%, transparent);
}
/* 仅窄屏显示（<1280px）；>=1280 桌面端隐藏，改由 AppRailAd 承担 */
@media (min-width: 1280px) {
  .chat-mobile-ad {
    display: none;
  }
}
</style>
