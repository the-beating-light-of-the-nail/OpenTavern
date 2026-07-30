<script setup lang="ts">
// SiteAd：渲染「需要放置位置」的广告位。
//   - smartlink：跳转链接，渲染成全站可点击入口（当前启用）。
//   - native-banner：invoke.js + 容器（未来在此扩展，按 utils/ads.ts 的 ADS.nativeBanner）。
// popunder / social-bar 是全站型脚本，在 app.vue 注入，与此组件无关。
// 切换见 utils/ads.ts 的 SMARTLINK_ENABLED / BANNER_468_ENABLED。
import { SMARTLINK_ENABLED, BANNER_468_ENABLED, ADS } from '~/utils/ads';
</script>

<template>
  <!-- Smartlink：全站顶部可点击入口，点击在新标签打开广告落地页 -->
  <div
    v-if="SMARTLINK_ENABLED"
    class="border-b border-border-warm"
    style="background:color-mix(in srgb, var(--color-primary) 10%, transparent)"
  >
    <div class="mx-auto flex max-w-5xl items-center justify-center px-5 py-1.5">
      <a
        :href="ADS.smartlink"
        target="_blank"
        rel="noopener noreferrer sponsored"
        class="rc-smartlink"
      >
        <span aria-hidden="true">✨</span>
        <span>Featured — Sponsored</span>
      </a>
    </div>
  </div>

  <!-- 468x60 Banner：iframe 加载 public 里的静态广告页，居中显示；移动端超宽居中裁切 -->
  <div
    v-if="BANNER_468_ENABLED"
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
