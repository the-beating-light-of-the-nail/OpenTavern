<script setup lang="ts">
// 原生广告卡：外壳随模式自适配（seo=白 rc-card / app=深色 ui-panel）+ Sponsored 角标 + Native iframe。
import { ADS } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';

withDefaults(defineProps<{ mode?: 'seo' | 'app' }>(), { mode: 'seo' });
const { state } = useAdPanel();
const b = ADS.native;
</script>

<template>
  <ClientOnly>
    <div
      v-if="state.nativeBanner"
      class="relative flex flex-col overflow-hidden"
      :class="mode === 'app' ? 'ui-panel rounded-2xl' : 'rc-card'"
    >
      <div class="rc-card-accent" />
      <span class="ad-card-badge">Sponsored</span>
      <div class="p-5">
        <iframe
          :src="b.html"
          title="Advertisement"
          scrolling="no"
          style="border: 0; display: block; width: 100%; height: 280px"
        />
      </div>
    </div>
  </ClientOnly>
</template>

<style scoped>
.ad-card-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  padding: 2px 7px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #d8cabb;
  background: color-mix(in srgb, var(--color-primary, #b65c7a) 22%, transparent);
  border-radius: 999px;
}
</style>
