<script setup lang="ts">
/**
 * 首页工具中枢分类导航（桌面侧栏 rail + 移动端胶囊 pills）。
 *
 * 规格：docs/research/laopobao-tools/home/components/hub-category-nav.spec.md
 * - 交互模型 click-driven：点击只 emit 选中 id，不导航、不改 URL、无过渡动画
 * - 样式全部来自 assets/css/workbench.css（.wb-rail / .wb-rail-title / .wb-cat /
 *   .wb-rail-cta / .wb-rail-btn / .wb-pills / .wb-pill），组件内不写 <style>
 * - rail 与 pills 的显隐由 CSS 媒体查询互斥控制，组件内不做屏幕宽度判断
 */
withDefaults(
  defineProps<{
    categories: { id: string; label: string; count: number }[];
    /** 当前选中的分类 id（'all' 表示全部） */
    modelValue: string;
    /** rail = 桌面侧栏（含底部目录 CTA）；pills = 移动端横向胶囊行 */
    variant?: 'rail' | 'pills';
  }>(),
  { variant: 'rail' },
);

const emit = defineEmits<{ 'update:modelValue': [string] }>();

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
    :class="variant === 'rail' ? 'wb-rail' : 'wb-pills'"
  >
    <template v-if="variant === 'rail'">
      <h3 class="wb-rail-title">{{ t('home_hub_cats') }}</h3>

      <button
        v-for="c in categories"
        :key="c.id"
        type="button"
        class="wb-cat"
        :class="{ 'is-active': c.id === modelValue }"
        :aria-pressed="c.id === modelValue"
        @click="emit('update:modelValue', c.id)"
      >
        <HubIcon :name="iconFor(c.id)" size="16" />
        <span class="wb-cat-label">{{ c.label }}</span>
        <span class="wb-cat-count">{{ c.count }}</span>
      </button>

      <div class="wb-rail-cta">
        <NuxtLink :to="localePath('/tools')" class="wb-rail-btn">
          <HubIcon name="upload" size="16" />
          <span>{{ t('home_tools_more_cta') }}</span>
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
