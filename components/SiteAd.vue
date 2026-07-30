<script setup lang="ts">
// SiteAd：公开页顶栏广告（Smartlink 横条 + 468x60 banner）。
// 显隐由 useAdPanel 运行时状态控制（?adpanel=1 面板切换）。
// ClientOnly：避免 SSR(默认值) 与客户端(localStorage) 状态差异的 hydration mismatch。
import { ADS } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';
const { state } = useAdPanel();
</script>

<template>
  <ClientOnly>
    <!-- Smartlink：顶栏可点击入口，新标签打开广告落地页 -->
    <div
      v-if="state.smartlink"
      class="border-b border-border-warm"
      style="background:color-mix(in srgb, var(--color-primary) 10%, transparent)"
    >
      <div class="mx-auto flex max-w-5xl items-center justify-center px-5 py-1.5">
        <a :href="ADS.smartlink" target="_blank" rel="noopener noreferrer sponsored" class="rc-smartlink">
          <span aria-hidden="true">✨</span>
          <span>Featured — Sponsored</span>
        </a>
      </div>
    </div>

    <!-- 468x60 Banner -->
    <div
      v-if="state.banner468"
      class="flex justify-center overflow-hidden border-b border-border-warm px-5 py-1.5"
    >
      <iframe
        :src="ADS.banner468.html"
        :width="ADS.banner468.width"
        :height="ADS.banner468.height"
        title="Advertisement"
        scrolling="no"
        style="border: 0; display: block; max-width: 100%"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.rc-smartlink {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--color-primary);
  transition: opacity 0.15s ease;
}
.rc-smartlink:hover {
  opacity: 0.75;
}
</style>
