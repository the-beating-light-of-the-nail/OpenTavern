<script setup lang="ts">
/**
 * 乙女向装饰：飘落花瓣 + 闪光点（纯 CSS 动画驱动）。
 * 固定配置数组 → SSR 与客户端渲染一致（预渲染页 hydration 不报错）。
 * 遵守 prefers-reduced-motion 与 body.low-power（由 CSS 隐藏整层）。
 */
const petals = [
  { left: '5%',  size: 15, delay: '0s',    dur: '14s', drift: '24px', spark: false },
  { left: '14%', size: 10, delay: '4.5s',  dur: '11s', drift: '-18px', spark: true },
  { left: '23%', size: 17, delay: '8s',    dur: '16s', drift: '30px',  spark: false },
  { left: '32%', size: 9,  delay: '2s',    dur: '10s', drift: '-22px', spark: true },
  { left: '41%', size: 14, delay: '11s',   dur: '15s', drift: '20px',  spark: false },
  { left: '50%', size: 12, delay: '6s',    dur: '13s', drift: '-26px', spark: false },
  { left: '58%', size: 16, delay: '9.5s',  dur: '17s', drift: '28px',  spark: false },
  { left: '66%', size: 8,  delay: '1.5s',  dur: '9.5s', drift: '-16px', spark: true },
  { left: '74%', size: 15, delay: '7s',    dur: '14.5s', drift: '24px', spark: false },
  { left: '82%', size: 11, delay: '3.5s',  dur: '12s', drift: '-28px', spark: false },
  { left: '90%', size: 13, delay: '10s',   dur: '15.5s', drift: '22px', spark: false },
  { left: '96%', size: 9,  delay: '5.5s',  dur: '11.5s', drift: '-20px', spark: true },
];
</script>

<template>
  <div class="petal-field" aria-hidden="true">
    <span
      v-for="(p, i) in petals"
      :key="i"
      :class="['petal', { 'petal-spark': p.spark }]"
      :style="{
        left: p.left,
        width: p.size + 'px',
        height: (p.spark ? p.size : p.size * 0.82) + 'px',
        animationDelay: p.delay,
        animationDuration: p.dur,
        '--drift': p.drift,
      }"
    />
  </div>
</template>
