# PAGE_TOPOLOGY.md — 首页工作台拓扑

- **源 URL**：`https://tools.laopobao.online/`
- **目标路由**：`/`（OpenTavern 现有首页，i18n `prefix_except_default`，预渲染）
- **移植范围**：整页布局骨架（用户已确认方案 A：营销段落全部下掉，工具数据仍用 OpenTavern `HOME_HUB`）
- **配色**：保留 OpenTavern token（ivory/玫瑰金），不迁移 coffee 主题

## 渲染树（源站实测）

```
#root
└─ div.min-h-screen.flex.flex-col.bg-background.text-foreground        ← 页面外壳
   ├─ header.sticky.top-0.z-50.w-full.border-b.backdrop-blur           ← 层 1 顶栏（h 57px）
   │  └─ div.container.mx-auto.px-4.h-14.flex.items-center.justify-between   (max-w 1280)
   │     ├─ a.flex.items-center.gap-2.font-bold.text-lg                ← 品牌
   │     │  ├─ span.text-2xl                                            🐰
   │     │  └─ span.font-bold.hidden.sm:inline-block                    「小兔几」
   │     └─ div.flex.items-center.gap-2
   │        ├─ nav.hidden.md:flex.items-center.gap-2                    ← 导航（移动端隐藏）
   │        │  └─ a × 4  [icon 16 + span.text-sm]
   │        ├─ a.h-9.w-9 (GitHub 图标按钮)
   │        └─ div.ml-2.pl-2.border-l.border-border/50 → button.size-9  ← 主题切换
   └─ main.flex-1.container.mx-auto.px-4.py-6.pb-20.md:pb-6             ← 层 2 主容器 (max-w 1280)
      └─ div.flex.flex-col.md:flex-row.gap-6.min-h-[calc(100vh-120px)]  ← 层 3 两栏
         ├─ aside.hidden.md:block.w-48.shrink-0.border-r.pr-4           ← 层 3a 分类栏 (192px)
         │  │  .bg-muted/20.rounded-l-xl.px-3.py-4
         │  ├─ h3.text-xs.font-semibold.uppercase.tracking-wider        「工具分类」
         │  ├─ button.w-full × 5  [icon 16 + label.truncate + span.ml-auto 计数]
         │  └─ div.pt-4.border-t.mt-4 → button.h-8.w-full.gap-2          「导入插件」
         └─ main.flex-1.min-w-0                                          ← 层 3b 内容列
            ├─ div.md:hidden.mb-4.space-y-3                              ← 移动端分类胶囊
            │  └─ div.flex.gap-2.overflow-x-auto.pb-2 → button × 5
            ├─ div.flex.items-center.justify-between.mb-6                ← 标题行
            │  ├─ h1.text-2xl.font-bold.tracking-tight                   「探索工具」
            │  └─ p.text-sm.text-muted-foreground.mt-1                   「选择一个功能模块开始您的创作之旅」
            └─ div.grid.gap-3.grid-cols-1.sm:2.lg:3.xl:4                 ← 工具卡网格
               └─ div.group.border.rounded-lg.p-4.bg-card × N
                  └─ a.block.space-y-2
                     ├─ div.flex.items-center.justify-between.mb-2       ← 标题 + 作者徽标
                     ├─ p.text-xs.line-clamp-2                           ← 描述
                     └─ div.flex.items-center.justify-between.pt-2       ← 分类标签 + 箭头
```

（源站无 footer。）

## 页面级布局规则

- 纵向：`flex column`，header `sticky`，main `flex-1` → 内容不满一屏时页面仍铺满视口高度
- 两栏：`flex-direction: column`（<768）→ `row`（≥768），`gap: 24px`
- 两栏容器设 `min-height: calc(100vh - 120px)`，与 header 高度联动
- 主容器 `max-width: 1280px; margin: 0 auto; padding: 24px 16px`；<768 底部额外 `padding-bottom: 80px`
- 无 z-index 分层（除 header `z-50`）、无背景图层、无滚动容器切换

## 区块依赖

| 区块 | 依赖 |
| --- | --- |
| 顶栏 | 仅 i18n 文案 + 路由 |
| 分类栏 / 胶囊 | 与内容列共用同一份 `activeCat` 状态（同一筛选源，两个渲染形态互斥显示） |
| 工具卡网格 | 依赖 `activeCat` 过滤结果 |
| 页脚 | 无 |

## OpenTavern 落位映射

| 源站元素 | OpenTavern 落位 |
| --- | --- |
| 品牌「🐰 小兔几」 | `OT` 字标 + 「Open Tavern」（复用 `rc-avatar-fill` 渐变标） |
| 导航 首页/小剧场/历史/设置 | 首页 `/`、工具 `/tools`、角色 `/characters`、指南 `/guides` |
| GitHub 图标按钮 | 语言切换 `<select>`（26 语言，复用 `useLocale`） |
| 主题切换 | 「打开 App」主按钮（`rc-nav-link-primary` 语义） |
| 侧栏「导入插件」 | `/tools` 完整目录入口（复用 `home_tools_more_tag` / `home_tools_more_cta`） |
| 「探索工具」标题 | `home_hub_title` |
| 「选择一个功能模块…」 | `home_hub_desc` |
| 分类 5 项 | `HUB_CATEGORIES`（all/play/craft/local/resource） |
| 工具卡 × 10 | `HOME_HUB` × 15 |
| 卡片作者徽标 | `license` 或 `home_hub_soon` |
| 卡片分类标签 | `home_hub_cat_*` |
| 无 footer | 极简页脚（合规链接 + 目录入口） |
| 无广告位 | 工具网格下方保留 `content` 位 `AdBanner` + `AdCard`（`?adpanel=1` 面板控制，默认关闭者不渲染） |

## 命名空间

| 类型 | 路径 |
| --- | --- |
| 规格 / 提取工件 | `docs/research/laopobao-tools/home/` |
| 截图 | `docs/design-references/laopobao-tools/home/` |
| 组件 | `components/home/` |
| 样式 | `assets/css/workbench.css` |
| 页面 | `pages/index.vue` |
