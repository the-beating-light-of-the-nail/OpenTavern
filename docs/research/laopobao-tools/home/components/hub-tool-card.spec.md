# 组件规格：HubToolCard（工具卡）

- **源站对照**：`div.group.relative.border.rounded-lg.p-4.bg-card` + 内层 `a.block.space-y-2`
- **目标文件**：`components/home/HubToolCard.vue`
- **交互模型**：`static` + hover 反馈（整卡可点，无 JS 行为）
- **样式承载**：全部类名已在 `assets/css/workbench.css` 定义，组件内**不要**写 `<style>`

## Props

```ts
import type { HubTool, HubCategory } from '~/data/tools';

const props = defineProps<{
  tool: HubTool;
  /** 分类中文案（父级已 t() 过），用于卡片底部标签 */
  categoryLabel: string;
  /** 站内路由已由父级做过 localePath 处理 */
  to: string;
}>();
```

> 父级负责把 `tool.to` 过 `localePath()` 后传入 `to`；外链工具（`tool.href`）时父级传 `to = tool.href`。

## 结构

外链工具用 `<a :href="tool.href" target="_blank" rel="noopener">`；站内工具用 `<NuxtLink :to="to">`。两者外壳类名一致。

```html
<!-- 可点卡（status === 'live'） -->
<NuxtLink class="wb-card" :to="to">
  <div class="wb-card-top">
    <h3 class="wb-card-title">{{ tool.name }}</h3>
    <span v-if="tool.license" class="wb-card-badge">{{ tool.license }}</span>
  </div>
  <p class="wb-card-desc">{{ t(tool.descKey) }}</p>
  <div class="wb-card-foot">
    <span class="wb-card-tag">{{ categoryLabel }}</span>
    <HubIcon class="wb-card-go" :name="tool.href ? 'compass' : 'arrow-right'" size="14" />
  </div>
</NuxtLink>

<!-- 开发中卡（status === 'soon'）：无链接、虚线边、显示 soon 徽标、无箭头 -->
<div v-else class="wb-card is-soon">
  <div class="wb-card-top">
    <h3 class="wb-card-title">{{ tool.name }}</h3>
    <span class="wb-card-badge is-soon">{{ t('home_hub_soon') }}</span>
  </div>
  <p class="wb-card-desc">{{ t(tool.descKey) }}</p>
  <div class="wb-card-foot">
    <span class="wb-card-tag">{{ categoryLabel }}</span>
  </div>
</div>
```

> 外链卡也必须在视觉上是「可点卡」，不要用 `is-soon`。

## 精确度量（源站实测 → 已落进 workbench.css）

| 项 | 源站实测 |
| --- | --- |
| 卡片 | padding 16px / border 1px `rgb(214,214,214)` / radius 8px / bg `rgb(252,252,252)` / transition .2s |
| 标题行 | `flex; justify-content:space-between; margin-bottom:8px` |
| 标题 | 14px / line-height 18px / fw600 / truncate |
| 徽标 | 字号 10px / padding 2px 6px / radius 4px / bg `<muted>/30` / 图标 12×12 |
| 描述 | 12px / line-height 19.5px / 颜色 `rgb(99,99,99)` / **line-clamp 2 行** |
| 底部行 | `flex; justify-content:space-between; padding-top:8px` |
| 分类标签 | 字号 10px / padding 2px 8px / radius 9999px |
| 箭头 | 14×14（源站 3.5 Tailwind 单位） |
| **hover 卡片** | `border-color` → `primary/30`（实测源站只改了边框色；本组件按 workbench.css 追加轻微阴影与 -2px 位移，与全站 `.rc-card` 观感一致） |
| **hover 标题** | `color` → primary |
| **hover 箭头** | `color` → primary + `translateX(2px)` |
| hover 分类标签 | 无变化 |

## OpenTavern 字段映射（已与用户确认）

| 源站 | OpenTavern |
| --- | --- |
| 作者徽标（老婆宝） | `tool.license`（AGPL-3.0）；`soon` 卡改用 `home_hub_soon` 徽标 |
| 分类标签 | `categoryLabel` prop（父级 t(`home_hub_cat_*`)） |
| 右箭头 | `<HubIcon name="arrow-right" size="14">`；外链工具用 `compass` 表示「跳出去」 |
| 卡片链接 | `status==='live'` 才可点；`soon` 是禁用虚线卡 |

## 硬性约束

- 只创建 `components/home/HubToolCard.vue` 一个文件
- `HubTool` 类型从 `~/data/tools` **显式 import type**（`data/tools.ts` 已导出 `HubTool` / `HubCategory`）
- 用 `<HubIcon>` 标签（Nuxt 自动注册，勿手写 import）；`useI18n()` 自动导入
- 卡片的根元素必须是单个元素（`NuxtLink` 或 `div`），`v-if/v-else` 二选一，不要在外层再包一层 div（网格子元素数量要等于工具数）
- 不得修改 `nuxt.config.ts`、`assets/css/*`、`pages/index.vue`、`data/tools.ts`
- 不要跑 `npm run build`；改完自查 TS 语法、标签闭合、`v-if/v-else` 配对
