# 组件规格：HubCategoryNav（工具分类导航：桌面侧栏 + 移动胶囊）

- **源站对照**：`<aside class="hidden md:block w-48 …">` + `<div class="md:hidden …">` 胶囊行
- **目标文件**：`components/home/HubCategoryNav.vue`
- **交互模型**：`click-driven`（客户端筛选，不导航、不改 URL、无过渡动画）
- **样式承载**：全部类名已在 `assets/css/workbench.css` 定义，组件内**不要**写 `<style>`

## Props / Emits

```ts
const props = defineProps<{
  categories: { id: string; label: string; count: number }[];
  modelValue: string;                 // 当前选中的分类 id（'all' 表示全部）
  /** rail = 桌面侧栏（含底部目录 CTA）；pills = 移动端横向胶囊行 */
  variant?: 'rail' | 'pills';
}>();
const emit = defineEmits<{ 'update:modelValue': [string] }>();
```

- 组件**自带外壳类名**：`variant === 'rail'` 渲染 `<aside class="wb-rail">`；`variant === 'pills'` 渲染 `<div class="wb-pills">`。
- 父级只负责包一层 `min-w-0`，由 CSS 媒体查询控制两者互斥显示（**不要在组件里写 v-if 判断屏幕宽度**）。

## 结构：rail

```html
<aside class="wb-rail">
  <h3 class="wb-rail-title">{{ t('home_hub_cats') }}</h3>
  <button v-for="c in categories" type="button" class="wb-cat" :class="{ 'is-active': c.id === modelValue }"
          :aria-pressed="c.id === modelValue" @click="emit('update:modelValue', c.id)">
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
</aside>
```

## 结构：pills

```html
<div class="wb-pills">
  <button v-for="c in categories" type="button" class="wb-pill" :class="{ 'is-active': c.id === modelValue }"
          :aria-pressed="c.id === modelValue" @click="emit('update:modelValue', c.id)">
    {{ c.label }} ( {{ c.count }} )
  </button>
</div>
```

> 胶囊文案格式照抄源站：`全部 ( 10 )` —— 数字两侧各有一个空格（用模板里的普通空格，不要用 `&nbsp;`）。

## 图标映射（分类 id → HubIcon name）

源站所有分类都用同一个 `wrench` 图标。OpenTavern 有 4 个语义分类，按语义区分（已确认偏离项）：

```ts
function iconFor(id: string) {
  return ({ all: 'grid', play: 'house', craft: 'wrench', local: 'server', resource: 'compass' } as const)[id] ?? 'wrench';
}
```

## 精确度量（源站实测 → 已落进 workbench.css）

| 项 | 源站实测 |
| --- | --- |
| 侧栏宽 | 192px；padding 16px 16px 16px 12px；radius 12px 0 0 12px；border-right 1px |
| 侧栏背景 | `<muted>/20` → workbench.css 用 `color-mix(primary 5%)` |
| 栏目标题 | 12px / 600 / uppercase / letter-spacing 0.6px / padding 8px 12px / mb 8px |
| 分类按钮 | 全宽 / 高 36px / padding 8px 12px / radius 8px / gap 8px / 字号 14px |
| 选中 | 纯色 primary 底 + 白字 + fw500 |
| 未选中 | 透明底 + 正文色 + fw400 |
| 相邻间距 | 4px（`.wb-cat + .wb-cat`） |
| 计数 | 字号 12px / `margin-left:auto` / `opacity .7` |
| 底部 CTA | 高 32px / border 1px / radius 6px / 字号 14px / 上方 16px 分隔线 |
| 胶囊 | padding 6px 12px / radius 9999px / 字号 12px / fw500 / gap 8px |
| 胶囊未选中 | `muted` 底 + `muted-foreground` 字 |
| 胶囊选中 | 纯色 primary 底 + 白字 |

## 硬性约束

- 只创建 `components/home/HubCategoryNav.vue` 一个文件
- 用 `<HubIcon>` 标签（Nuxt 自动注册，勿手写 import）；`useI18n()` + `useLocalePath()` 走 Nuxt 自动导入
- 不得修改 `nuxt.config.ts`、`assets/css/*`、`pages/index.vue`、`data/tools.ts`
- 默认 `variant = 'rail'`
- 不要跑 `npm run build`；改完自查 TS 语法、标签闭合、事件名与 `defineEmits` 一致
