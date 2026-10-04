# BEHAVIORS.md — tools.laopobao.online 首页行为圣经

> 提取方式：headless Chrome + CDP（`scripts/clone/cdp.mjs`），全部数值来自 `getComputedStyle()` 实测。
> 原始数据：`docs/research/laopobao-tools/home/behaviors-raw.json`、`key-styles.json`、`cards.json`、`dom-tree.txt`
> 截图：`docs/design-references/laopobao-tools/home/`

## 0. 交互模型总判定

| 区块 | 交互模型 |
| --- | --- |
| 顶栏 | `static`（sticky 定位，滚动时无形态变化） |
| 分类侧栏 / 移动端分类胶囊 | `click-driven` 客户端筛选（不导航、不改 URL、无过渡动画，DOM 直接替换） |
| 工具卡网格 | `static` + hover 反馈 |
| 整页 | 无滚动驱动动画、无 scroll-snap、无平滑滚动库、无 IntersectionObserver 入场 |

**实测证据**：滚动到 y=500 后 header 计算样式与 y=0 完全一致（`backgroundColor` 仍为 `oklab(0.976133 … / 0.6)`，无 boxShadow / transform / 高度变化）→ 排除滚动驱动 header。
点击侧栏第 2 项「角色设定」后卡片数 10 → 4，`activeCat` 背景变 `rgb(100,74,64)`、文字变白、字重 400 → 500，无过渡动画参与（`transition` 只声明颜色类属性）→ 确认为纯客户端筛选。

## 1. 全局

- `html` 类：`notranslate light theme-coffee`（shadcn CSS 变量主题体系，本次不迁移配色）
- `body`：`background rgb(247,247,247)` / `color rgb(31,31,31)` / 字体 `ui-sans-serif, system-ui, sans-serif`（**无自定义 webfont**，`document.fonts` 为空）
- 页面无 `<img>`、无 `<video>`、无 canvas；全部图形 = 52 个 lucide 内联 SVG
- 页面总高 900px（内容不足一屏），无自定义滚动条样式

## 2. 顶栏 Header

- `position: sticky; top: 0; z-index: 50; height: 57px`（56px 内容 + 1px 下边框）
- `background: <bg>/60` + `backdrop-filter: blur(8px)`；`border-bottom: 1px solid rgb(214,214,214)`
- 内层容器 `max-width: 1280px; margin: 0 auto; padding: 0 16px; height: 56px; display:flex; align-items:center; justify-content:space-between`
- 品牌：emoji `🐰`（24px）+ 文字「小兔几」`font-size:18px; font-weight:700`；`<768px` 时文字 `display:none`（只剩 emoji）
- 右侧 `display:flex; gap:8px`
  - `<nav>`：`<768px` 整组 `display:none`（原站移动端无导航）
  - 导航项：`padding: 8px 12px; border-radius: 6px; gap: 8px; height: 36px`，内含 16×16 lucide 图标 + `font-size:14px`
    - 选中态：`background: <primary>/10`（`oklab(0.434 0.029 0.026 / 0.1)`）`color: rgb(100,74,64)` `font-weight:500`
    - 未选中：透明背景 `color: rgb(99,99,99)` `font-weight:400`
  - 图标按钮：`36×36; border-radius:6px`（GitHub 外链、主题切换）
  - 主题切换外面套 `border-left: 1px solid <border>/50; padding-left: 8px; margin-left: 8px`

## 3. 分类侧栏（桌面 ≥768px）

- 容器：`width: 192px; flex-shrink: 0; padding: 16px 16px 16px 12px; border-right: 1px solid <border>; border-radius: 12px 0 0 12px; background: <muted>/20`
- 标题「工具分类」：`font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:0.6px; color:rgb(99,99,99); padding:8px 12px; margin-bottom:8px`
- 分类按钮：`width:100%; height:36px; padding:8px 12px; border-radius:8px; gap:8px; font-size:14px`
  - 选中：`background: rgb(100,74,64)`（纯色 primary）`color:#fff; font-weight:500`
  - 未选中：透明，`color: rgb(31,31,31); font-weight:400`
  - 间距：相邻按钮 `margin-top: 4px`
  - 结构：`16×16 图标` + `label(truncate)` + `count(span.ml-auto; font-size:12px; opacity:0.7)`
- 底部 CTA：「导入插件」`width:100%; height:32px; padding:0 10px; border:1px solid <border>; border-radius:6px; background:<bg>; font-size:14px; font-weight:500`，上方有 `border-top:1px solid <border>; padding-top:16px; margin-top:16px` 分隔
- `<768px` 整个 aside `display:none`

## 4. 移动端分类胶囊（<768px）

- 容器：`display:flex; gap:8px; overflow-x:auto; padding-bottom:8px`
- 胶囊：`padding:6px 12px; border-radius:9999px; font-size:12px; font-weight:500`
  - 选中：`background:<primary 纯色>; color:#fff`
  - 未选中：`background: rgb(237,237,237); color: rgb(99,99,99)`
  - 文案格式：`全部 ( 10 )`、` 角色设定 ( 4 )`（数字带空格括号）
- `≥768px` 整块 `display:none`

## 5. 主区标题

- `h1`：`font-size:24px; line-height:32px; font-weight:700; letter-spacing:-0.6px`
- `p`：`font-size:14px; line-height:20px; color:rgb(99,99,99); margin-top:4px`
- 外层 `display:flex; align-items:center; justify-content:space-between; margin-bottom:24px`

## 6. 工具卡网格

- `display:grid; gap:12px; grid-template-columns: repeat(1)` → `sm(≥640): 2` → `lg(≥1024): 3` → `xl(≥1280): 4`
- 实测 1440 视口：4 列 × 249px；768 视口：2 列 × 254px；390 视口：1 列 × 358px

## 7. 工具卡

- 外层：`padding:16px; border:1px solid rgb(214,214,214); border-radius:8px; background: rgb(252,252,252); transition: 0.2s cubic-bezier(0.4,0,0.2,1)`
- 结构（单 `<a>` 包裹三段）：
  1. **标题行** `flex; justify-content:space-between; margin-bottom:8px`
     - `h3` 标题 `font-size:14px; line-height:18px; font-weight:600; truncate`
     - 作者徽标 `font-size:10px; padding:2px 6px; border-radius:4px; background:<muted>/30; color:<muted-foreground>/80` + `12×12 lucide-users` + 名字（`max-width:80px; truncate`）
  2. **描述** `font-size:12px; line-height:19.5px; color:rgb(99,99,99); line-clamp:2`
  3. **底部行** `flex; justify-content:space-between; padding-top:8px`
     - 分类标签 `font-size:10px; padding:2px 8px; border-radius:9999px; background:<muted>/50; color:rgb(99,99,99)`
     - 箭头 `14×14 lucide-arrow-right; color:<muted-foreground>`

## 8. 悬停态（CDP `Input.dispatchMouseEvent` 真实鼠标两态 diff）

| 目标 | 变化 | 过渡 |
| --- | --- | --- |
| 工具卡 | `border-color` `rgb(214,214,214)` → `oklab(0.434 0.029 0.026 / 0.3)`（= primary/30）。`hover:shadow-md` 声明了但实测 `boxShadow` 仍为 `none` | `0.2s cubic-bezier(0.4,0,0.2,1)` |
| 卡片标题 | `color` `rgb(31,31,31)` → `rgb(100,74,64)`（primary） | 继承卡片 .2s |
| 卡片分类标签 | 无变化 | — |
| 卡片箭头 | `color` → primary，且 `translate-x: 0.5`（2px）→ 由 class 声明 | `transition-all` |
| 顶栏未选中导航项 | `background` 透明 → `rgb(237,237,237)`；`color` `rgb(99,99,99)` → `rgb(31,31,31)` | `0.15s cubic-bezier(0.4,0,0.2,1)` |
| 侧栏未选中分类 | `background` 透明 → `rgb(237,237,237)` | `0.15s` |
| 侧栏「导入插件」 | 实测无变化（`hover:bg-accent` 未产生可见 diff） | `0.15s` |

## 9. 分类筛选数据（原站）

| 分类 | 计数 | 图标 |
| --- | --- | --- |
| 全部 | 10 | lucide-layout-grid |
| 角色设定 | 4 | lucide-wrench |
| 酒馆脚本 | 3 | lucide-wrench |
| 酒馆工具 | 2 | lucide-wrench |
| 难评 | 1 | lucide-wrench |

## 10. 响应式断点汇总

| 断点 | 变化 |
| --- | --- |
| `<640px` | 网格 1 列；顶栏导航隐藏、品牌文字隐藏；侧栏隐藏 → 胶囊行出现 |
| `640–767px` | 网格 2 列；其余同移动端 |
| `768–1023px` | 侧栏出现（192px），胶囊行隐藏，顶栏导航出现 |
| `1024–1279px` | 网格 3 列 |
| `≥1280px` | 网格 4 列，容器封顶 1280px 居中 |

## 11. 原站未覆盖 / OpenTavern 需要偏离的点（已与用户确认）

1. **配色**：用户选择保留 OpenTavern ivory/玫瑰金 token，不迁移 coffee 主题 → 所有 `<primary>`/`<muted>` 占位按 OpenTavern 语义 token 落位。
2. **移动端导航可达性**：原站 `<768px` 隐藏整组导航（移动端无站内导航）。OpenTavern 首页承担 SEO 与站内导流，**偏离**：移动端保留导航但只显示图标（隐藏文字标签）。
3. **卡片作者徽标**：原站显示作者（老婆宝 / 徐小酸）。OpenTavern `HOME_HUB` 无作者字段 → 该位置改放 `license`（AGPL-3.0）或 `soon` 状态徽标。
4. **无 footer**：原站是纯应用无页脚。OpenTavern 有 /about /privacy /terms 等合规链接 → **保留一条极简页脚**。
5. **卡片海拔**：原站卡片等高 136px 是因为描述都恰好 2 行；OpenTavern 描述长度不一 → 底部行用 `margin-top:auto` 对齐。
