<script setup lang="ts">
/**
 * WebGL 着色器背景 + 暗角（纯占位，WebGL 渲染逻辑留待阶段 10）。
 * 保留原 DOM（#shaderCanvas / #vignetteOverlay）以命中 main.css 中的定位与主题隐藏规则。
 */
</script>

<template>
  <canvas id="shaderCanvas" />
  <div id="vignetteOverlay" />
</template>
