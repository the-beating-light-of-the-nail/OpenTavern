<script setup lang="ts">
// 通用 iframe banner：加载 public 里的静态广告页，invoke.js 在 iframe 内运行
// （避免 document.write 清空已 hydrate 的主页面）。468x60 在 SiteAd 内联渲染，其余尺寸用此组件。
defineProps<{ src: string; width: number; height: number }>();
</script>

<template>
  <div class="flex justify-center overflow-hidden">
    <iframe
      :src="src"
      :width="width"
      :height="height"
      title="Advertisement"
      scrolling="no"
      style="border: 0; display: block; max-width: 100%"
    />
  </div>
</template>
