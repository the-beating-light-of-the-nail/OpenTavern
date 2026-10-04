<script setup lang="ts">
/**
 * 首页工具中枢分类导航（桌面侧栏 rail + 移动端胶囊 pills）。
 *
 * 规格：docs/research/laopobao-tools/home/components/hub-category-nav.spec.md
 * - 交互模型 click-driven：点击只 emit 选中 id，不导航、不改 URL、无过渡动画
 * - rail 贴死左侧、整屏高（sticky）、可收缩成图标条（collapsed）
 * - 样式全部来自 assets/css/workbench.css，组件内不写 <style>
 * - rail 与 pills 的显隐由 CSS 媒体查询互斥控制，组件内不做屏幕宽度判断
 */
withDefaults(
  defineProps<{
    categories: { id: string; label: string; count: number }[];
    /** 当前选中的分类 id（'all' 表示全部） */
    modelValue: string;
    /** rail = 桌面侧栏（含折叠开关与底部目录 CTA）；pills = 移动端横向胶囊行 */
    variant?: 'rail' | 'pills';
    /** 仅 rail：收缩态（只显示图标） */
    collapsed?: boolean;
  }>(),
  { variant: 'rail', collapsed: false },
);

const emit = defineEmits<{
  'update:modelValue': [string];
  /** 仅 rail：点击折叠开关 */
  'toggle-collapse': [];
}>();

const { t } = useI18n();
const localePath = useLocalePath();

/** 分类 id → HubIcon name 映射（源站统一 wrench，这里按语义区分，见规格「图标映射」） */
type CategoryIcon = 'grid' | 'house' | 'wrench' | 'server' | 'compass';

const CATEGORY_ICONS: Record<string, CategoryIcon> = {
  all: 'grid',
  play: 'house',
  craft: 'wrench',
  local: 'server',
  resource: 'compass',
};

/** 未知分类 id 回落 wrench，与规格一致 */
function iconFor(id: string): CategoryIcon {
  return CATEGORY_ICONS[id] ?? 'wrench';
}
</script>

<template>
  <component
    :is="variant === 'rail' ? 'aside' : 'div'"
    :class="variant === 'rail' ? ['wb-rail', { 'is-collapsed': collapsed }] : 'wb-pills'"
  >
    <template v-if="variant === 'rail'">
      <div class="wb-rail-head">
        <h3 class="wb-rail-title">{{ t('home_hub_cats') }}</h3>
        <button
          type="button"
          class="wb-rail-toggle"
          :aria-expanded="!collapsed"
          aria-controls="wb-rail-nav"
          :title="t('home_hub_cats')"
          :aria-label="t('home_hub_cats')"
          @click="emit('toggle-collapse')"
        >
          <HubIcon :name="collapsed ? 'panel-open' : 'panel-close'" size="16" />
        </button>
      </div>

      <nav id="wb-rail-nav" class="wb-rail-nav">
        <button
          v-for="c in categories"
          :key="c.id"
          type="button"
          class="wb-cat"
          :class="{ 'is-active': c.id === modelValue }"
          :aria-pressed="c.id === modelValue"
          :title="collapsed ? c.label : undefined"
          @click="emit('update:modelValue', c.id)"
        >
          <HubIcon :name="iconFor(c.id)" size="16" />
          <span class="wb-cat-label">{{ c.label }}</span>
          <span class="wb-cat-count">{{ c.count }}</span>
        </button>
      </nav>

      <div class="wb-rail-cta">
        <NuxtLink
          :to="localePath('/tools')"
          class="wb-rail-btn"
          :title="collapsed ? t('home_tools_more_cta') : undefined"
        >
          <HubIcon name="upload" size="16" />
          <span class="wb-rail-btn-label">{{ t('home_tools_more_cta') }}</span>
        </NuxtLink>
      </div>
    </template>

    <template v-else>
      <button
        v-for="c in categories"
        :key="c.id"
        type="button"
        class="wb-pill"
        :class="{ 'is-active': c.id === modelValue }"
        :aria-pressed="c.id === modelValue"
        @click="emit('update:modelValue', c.id)"
      >{{ c.label }} ( {{ c.count }} )</button>
    </template>
  </component>
</template>
