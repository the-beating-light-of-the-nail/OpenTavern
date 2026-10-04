<script setup lang="ts">
/**
 * 首页工具中枢卡片（HubToolCard）。
 *
 * 源站对照：tools.laopobao.online 首页 `div.group.relative.border.rounded-lg.p-4.bg-card`
 * + 内层 `a.block.space-y-2`。交互模型 static + 整卡 hover 反馈（无 JS 行为）。
 *
 * 三分支（渲染时只落一个根元素，父级网格子元素数 === 工具数）：
 * - status === 'soon'：`div.wb-card.is-soon`（虚线禁用卡，无链接、无箭头，徽标为 home_hub_soon）
 * - 有 tool.href：`a.wb-card`（target=_blank + rel=noopener，箭头用 compass 表示「跳出去」）
 * - 其余：`NuxtLink.wb-card`（站内路由，箭头用 arrow-right）
 *
 * 全部视觉样式由 assets/css/workbench.css 的 .wb-* 承载，本组件不写 <style>。
 * 规格：docs/research/laopobao-tools/home/components/hub-tool-card.spec.md
 */
import type { HubTool } from '~/data/tools';

const props = defineProps<{
  tool: HubTool;
  /** 分类中文案（父级已 t() 过），用于卡片底部标签 */
  categoryLabel: string;
  /** 站内路由已由父级做过 localePath 处理 */
  to: string;
}>();

const { t } = useI18n();
</script>
<template>
  <div v-if="props.tool.status === 'soon'" class="wb-card is-soon">
    <div class="wb-card-top">
      <h3 class="wb-card-title">{{ props.tool.name }}</h3>
      <span class="wb-card-badge is-soon">{{ t('home_hub_soon') }}</span>
    </div>
    <p class="wb-card-desc">{{ t(props.tool.descKey) }}</p>
    <div class="wb-card-foot">
      <span class="wb-card-tag">{{ props.categoryLabel }}</span>
    </div>
  </div>

  <a
    v-else-if="props.tool.href"
    class="wb-card"
    :href="props.tool.href"
    target="_blank"
    rel="noopener"
  >
    <div class="wb-card-top">
      <h3 class="wb-card-title">{{ props.tool.name }}</h3>
      <span v-if="props.tool.license" class="wb-card-badge">{{ props.tool.license }}</span>
    </div>
    <p class="wb-card-desc">{{ t(props.tool.descKey) }}</p>
    <div class="wb-card-foot">
      <span class="wb-card-tag">{{ props.categoryLabel }}</span>
      <HubIcon class="wb-card-go" name="compass" size="14" />
    </div>
  </a>

  <NuxtLink v-else class="wb-card" :to="props.to">
    <div class="wb-card-top">
      <h3 class="wb-card-title">{{ props.tool.name }}</h3>
      <span v-if="props.tool.license" class="wb-card-badge">{{ props.tool.license }}</span>
    </div>
    <p class="wb-card-desc">{{ t(props.tool.descKey) }}</p>
    <div class="wb-card-foot">
      <span class="wb-card-tag">{{ props.categoryLabel }}</span>
      <HubIcon class="wb-card-go" name="arrow-right" size="14" />
    </div>
  </NuxtLink>
</template>
