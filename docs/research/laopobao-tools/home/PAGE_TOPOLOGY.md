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

---

## v2：外壳改全幅应用布局（用户第二轮反馈）

原站是**居中 1280px 容器**，宽屏下左右各留大片空白、左栏只占其中一列。
用户要求「左侧空间不能浪费、左栏死死贴左、可收缩、顶栏也别浪费」，故外壳偏离原站：

| 项 | 原站（v1 照抄） | 本仓 v2 |
| --- | --- | --- |
| 顶栏 | `max-width: 1280px; margin: 0 auto` | **通栏**，`padding: 0 clamp(12px, 1.6vw, 24px)` |
| 左栏位置 | 容器内 `w-48`，左右都有外边距 | **贴死视口左边缘 `x=0`** |
| 左栏高度 | 随内容列拉伸 | **整屏高** `height: calc(100dvh - 56px)`，`position: sticky; top: 56px` |
| 左栏底色 | `muted/20` 灰色块 | `color-mix(primary 7%, surface-soft)` 暖色面板 |
| 左栏收缩 | 无 | **可收缩** 232px ⇄ 64px（图标条），开关在栏头右侧，`localStorage` 记忆；<1024px 首次访问默认收起 |
| 内容列 | 容器内一列 | 占满左栏右侧**全部宽度**（`flex: 1; min-width: 0`） |
| 工具网格 | 固定 1/2/3/4 列 | `repeat(auto-fill, minmax(250px, 1fr))` —— 1440 时 4 列，1920 时 6 列，宽屏自然增列 |
| SEO 段落 | 页面根级整幅 | 移入 `.wb-content`，用 `margin-inline: calc(var(--wb-pad) * -1)` 反向出血对齐 |

实测（`qa-prod.json`）：1920/1440/768 三档 `rail.x = 0`、`header-inner.w = 视口宽`、`content.right = 视口宽`、无横向溢出；
`768` 档因「品牌文字 + 4 个带文字导航 + 语言 + CTA」会顶破视口，导航文字隐藏断点由 768px 上调到 **1024px**。

SEO 未受影响：`H1` 文本、`H2/H3` 数量与顺序、`FAQ` 条数、19 条内链集合、`title`/`canonical`/`ld+json` 与改造前**逐项一致**
（`seo/old-live.json` vs `seo/final-text.json`）；旧首页直接引用的 88 个 i18n key 100% 仍被渲染。
