<script setup lang="ts">
// 右侧贴边竖幅广告（160x600）。宽屏 fixed 显示，窄屏隐藏；聊天页 /app 不显示。
import { ADS } from '~/utils/ads';
import { useAdPanel } from '~/composables/useAdPanel';

const { state } = useAdPanel();
const route = useRoute();
// 排除聊天界面
const hidden = computed(() => route.path.includes('/app'));
const b = ADS.banner160x600;
</script>

<template>
  <ClientOnly>
    <div v-if="state.banner160x600 && !hidden" class="ad-sidebar" aria-label="Advertisement">
      <iframe
        :src="b.html"
        :width="b.width"
        :height="b.height"
        title="Advertisement"
        scrolling="no"
        style="border: 0; display: block"
      />
    </div>
  </ClientOnly>
</template>

<style scoped>
.ad-sidebar {
  position: fixed;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 40;
}
/* 窄屏隐藏，避免遮挡内容（160 宽需要足够边距） */
@media (max-width: 1100px) {
  .ad-sidebar {
    display: none;
  }
}
</style>
