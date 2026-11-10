<script setup lang="ts">
/**
 * 「本页板块」目录（TOC）：替代已删除的中间栏 aside 里的锚点列表。
 * ≥1200px 显示为主内容右侧的竖排导航栏（不挤占内容宽度），更窄视口整栏隐藏。
 *
 * 工作台外壳是 100dvh + 面板内部滚动（.cp-panel overflow:auto），所以：
 * - 高亮不能监听 window 滚动，要向上找真正的滚动容器（跨断点后容器会变，按需惰性求取）；
 * - 原生锚点跳转不受 html{scroll-behavior} 控制，这里显式滚容器并平滑滚动。
 */
const props = defineProps<{
  items: { id: string; label: string }[];
}>();

const { locale } = useI18n();
const isZh = computed(() => locale.value === 'zh-CN');

const activeId = ref('');

/** 点击后短时间锁住高亮：跳转落定阶段以点击意图为准，避免贴底兜底规则立刻改写；
 *  用户随后手动滚动时 spy 恢复接管 */
let lockUntil = 0;

/** 从板块元素向上找最近的可滚动祖先（面板内滚动布局）；找不到退回 window */
function findScroller(from: HTMLElement): HTMLElement | null {
  let parent: HTMLElement | null = from.parentElement;
  while (parent) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === 'auto' || overflowY === 'scroll') return parent;
    parent = parent.parentElement;
  }
  return null;
}

function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  history.replaceState(history.state, '', `#${id}`); // 保留深链可分享；带 state 替换不破坏路由历史
  activeId.value = id; // 点击即高亮所选板块；后续 scroll 事件再自然校准
  lockUntil = Date.now() + 600;

  const scroller = findScroller(el);
  if (!scroller) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  // 相对滚动容器计算目标位置；12px 对齐 .cp-section 的 scroll-margin-top
  const target = Math.max(
    0,
    el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 12,
  );
  const from = scroller.scrollTop;
  scroller.scrollTo({ top: target, behavior: 'smooth' });
  // 部分内嵌 webview 禁用平滑滚动时 scrollTo(smooth) 会整体不滚（而非瞬移）：探测后兜底
  window.setTimeout(() => {
    if (scroller.scrollTop === from && Math.abs(target - from) > 2) {
      scroller.scrollTo({ top: target, behavior: 'instant' });
    }
  }, 90);
  // 同类环境的程序化 instant 滚动还可能不发 scroll 事件：滚动落定后主动对齐一次高亮
  // （仍在点击锁窗口内则跳过——点击意图优先，等用户手动滚动再让 spy 接管）
  window.setTimeout(() => {
    if (Date.now() > lockUntil) updateActive?.();
  }, 200);
}

let updateActive: (() => void) | null = null;
let detach: (() => void) | null = null;

onMounted(() => {
  const sections = props.items
    .map((item) => document.getElementById(item.id))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!sections.length) return;

  const scroller = findScroller(sections[0]);
  const target: HTMLElement | Window = scroller ?? window;

  const onScroll = () => {
    if (Date.now() < lockUntil) return; // 点击跳转落定期间不改写高亮
    // 阈值取滚动容器可视区上部 40%：标题进入上半区的最近板块即当前板块。
    // 用相对线而非固定 160px：面板贴底时尾部板块停不到顶部也能正确命中。
    let current = props.items[0]?.id ?? ''; // 页面在顶部时保持第一项
    const line = scroller
      ? scroller.getBoundingClientRect().top + scroller.clientHeight * 0.4
      : window.innerHeight * 0.4;
    for (const el of sections) {
      if (el.getBoundingClientRect().top <= line) current = el.id;
    }
    // 兜底：内容不足时最后的板块可能连 40% 线都够不着，贴底直接高亮最后一项
    const atEnd = scroller
      ? scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
      : (() => {
          const doc = document.scrollingElement as HTMLElement | null;
          return !!doc && doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 4;
        })();
    if (atEnd) current = sections[sections.length - 1].id;
    activeId.value = current;
  };
  onScroll();
  target.addEventListener('scroll', onScroll, { passive: true });
  updateActive = onScroll;
  detach = () => {
    target.removeEventListener('scroll', onScroll);
    updateActive = null;
  };
});

onBeforeUnmount(() => detach?.());
</script>

<template>
  <nav class="cp-toc" :aria-label="isZh ? '本页板块' : 'On this page'">
    <p class="cp-toc-title">{{ isZh ? '本页板块' : 'On this page' }}</p>
    <a
      v-for="item in items"
      :key="item.id"
      :href="`#${item.id}`"
      :class="{ 'is-active': activeId === item.id }"
      @click.prevent="scrollTo(item.id)"
    >
      {{ item.label }}
    </a>
  </nav>
</template>
