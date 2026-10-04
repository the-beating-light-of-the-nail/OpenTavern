# 组件规格：WorkbenchHeader（首页顶栏）

- **源站对照**：`<header>` + `.container.mx-auto.px-4.h-14`
- **目标文件**：`components/home/WorkbenchHeader.vue`
- **交互模型**：`static`（sticky 定位，滚动时无形态变化）
- **样式承载**：全部类名已在 `assets/css/workbench.css` 定义，组件内**不要**写 `<style>`，也不要改 CSS 文件

## 结构

```
<header class="wb-header">
  <div class="wb-header-inner">
    <NuxtLink to="/" class="wb-brand">
      <span class="wb-brand-mark">OT</span>
      <span class="wb-brand-name">Open Tavern</span>
    </NuxtLink>
    <div class="wb-header-right">
      <nav class="wb-nav">
        <NuxtLink class="wb-nav-link is-active"><HubIcon name="house" size="16"/> <span class="wb-nav-label">首页</span></NuxtLink>
        <NuxtLink class="wb-nav-link"><HubIcon name="tools" size="16"/> <span class="wb-nav-label">工具</span></NuxtLink>
        <NuxtLink class="wb-nav-link"><HubIcon name="users" size="16"/> <span class="wb-nav-label">角色</span></NuxtLink>
        <NuxtLink class="wb-nav-link"><HubIcon name="book" size="16"/> <span class="wb-nav-label">指南</span></NuxtLink>
      </nav>
      <div class="wb-header-divider">
        <select class="wb-lang"><option>…26 语言…</option></select>
      </div>
      <NuxtLink to="/app" class="wb-cta"><HubIcon name="chat" size="15"/> <span class="wb-cta-label">打开 App</span></NuxtLink>
    </div>
  </div>
</header>
```

## 精确度量（源站实测 → 本组件落位）

| 项 | 源站实测 | 本组件 |
| --- | --- | --- |
| header 高度 | 57px（56 + 1px 边框） | `.wb-header-inner` height 3.5rem |
| 内层容器 | max-w 1280px / margin auto / padding 0 16px | `.wb-header-inner` |
| sticky | `top:0; z-index:50` | `.wb-header` |
| 背景 | `<bg>/60` + `backdrop-filter: blur(8px)` | `.wb-header`（82% + blur 12px，取 OpenTavern 已有 SiteHeader 的观感） |
| 品牌 | emoji 24px + 文字 18px/700 | `.wb-brand-mark` 32×32 + `.wb-brand-name` |
| 品牌文字 | `<640px` 隐藏 | `.wb-brand-name` 由 CSS 的 640px 媒体查询隐藏 |
| 导航项 | padding 8/12、radius 6px、height 36px、图标 16、文字 14px | `.wb-nav-link`（radius 8px 对齐 OpenTavern 圆角语言） |
| 选中态 | bg `<primary>/10`、color primary、fw 500 | `.wb-nav-link.is-active` |
| 未选中 | 透明、color muted、fw 400 | `.wb-nav-link` |
| 分隔线 | `border-left` + `margin-left:8px; padding-left:8px` | `.wb-header-divider` |
| 图标按钮 | 36×36 | `.wb-lang`（语言切换占位） |
| CTA | —（源站无） | `.wb-cta`，`<640px` 只留图标 |

## 数据与 i18n（全部复用现有 key，**不要新增 key**）

- 首页 → `localePath('/')`，标签 `t('breadcrumb_home')`（= 「首页」/「Home」，25 个语言文件全部已有该 key，**不要新增 key**）
- 工具 → `localePath('/tools')`，`t('nav_tools')`
- 角色 → `localePath('/characters')`，`t('nav_characters')`
- 指南 → `localePath('/guides')`，`t('nav_guides')`
- 打开 App → `localePath('/app')`，`t('nav_open_app')`

## 语言切换

复用 `components/SiteHeader.vue` 的语言下拉实现（同一份 `langOptions` 构造 + `useLocale()` 的 `setLocale`）。**直接复制那段逻辑**，不要修改 SiteHeader.vue。类名换成 `.wb-lang`。

## 激活态判定

用 `useRoute().path` 判断：`/` 或 `''` → 首页；以 `/tools` 开头 → 工具；`/characters` → 角色；`/guides` → 指南。注意 i18n `prefix_except_default`，路由 path 可能带 `/zh-CN` 前缀，用 `includes` 而非 `===` 匹配子路径，首页用「去掉 locale 前缀后等于 `/`」判断（可复用 `useLocalePath()` 或 `useRoute().path` 尾部匹配）。

## 硬性约束

- 只创建/修改 `components/home/WorkbenchHeader.vue` 这一个文件
- 可导入：`HubIcon`（`components/home/HubIcon.vue`，props `name` / `size`）、`useLocale`（`~/composables/useLocale`）、`useAppStore`（`~/stores/app`）
- 不得修改 `nuxt.config.ts`、`assets/css/*`、`SiteHeader.vue`、`pages/index.vue`、`data/tools.ts`
- 组件自动注册（`pathPrefix: false`）→ 模板里用 `<HubIcon>` / `<WorkbenchHeader>`，**不要写 import 路径引入它们**（HubIcon 需 Nuxt 自动注册，直接用标签即可）
- 不要跑 `npm run build`（会看到其他并行 builder 的半成品）；改完后自查：TypeScript 语法、标签闭合、无未定义变量
