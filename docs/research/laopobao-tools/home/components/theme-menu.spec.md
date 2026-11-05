# Theme menu（源站顶栏主题切换）

提取日期：2026-11-06
来源：`https://tools.laopobao.online/` 顶栏「切换主题」按钮（浏览器 DOM + getComputedStyle）
交互模型：**click-driven** popover；选项 `亮色主题 / 暗色主题 / 跟随系统`；选择后写 localStorage 并立即应用。

## Trigger

| 属性 | 源站值 | OpenTavern |
| --- | --- | --- |
| 尺寸 | `36 × 36px` | `.wb-theme-trigger` ✅ |
| 圆角 | `6px` | ✅ |
| 背景 | 透明（hover `accent`） | `--color-accent-surface` ✅ |
| 图标 | lucide sun / moon，`1.1rem`，叠加交叉旋转缩放 | `HubIcon` sun/moon ✅ |
| 图标切换 | 浅色显示 sun，深色显示 moon，`transition: transform/opacity .2s` | `body.theme-new-light` 控制 ✅ |

## Menu

| 属性 | 源站值 | OpenTavern |
| --- | --- | --- |
| 最小宽度 | `128px`（`min-w-[8rem]`） | ✅ |
| 内边距 | `4px` | ✅ |
| 圆角 | `6px` | ✅ |
| 边框 | `1px solid var(--border)` | `--color-border` ✅ |
| 背景 | `popover`：浅 `#fcfcfc` / 深 `#171717` | `--color-surface` ✅ |
| 阴影 | 无（源站 `shadow-md` 变量为空） | 无 ✅ |
| 定位 | 右对齐；向下展开（截图实测） | `top: calc(100% + 6px); right: 0` ✅ |
| 动画 | fade-in + zoom-in-95，约 120ms | `wbThemeIn` ✅ |

## Item

| 属性 | 源站值 | OpenTavern |
| --- | --- | --- |
| 布局 | `flex; gap: 8px` | ✅ |
| 内边距 | `6px 8px` | ✅ |
| 圆角 | `4px` | ✅ |
| 字号 | `14px` | ✅ |
| check | lucide check `16px`；未选中 `opacity: 0`，选中 `opacity: 1` | `HubIcon check` ✅ |
| hover / focus | `bg-accent` / `text-accent-foreground` | `--color-accent-surface` + `--color-text` ✅ |

## 主题语义

- 浅色：`light` → `theme-new-light`（`#f7f7f7 / #1f1f1f / #644a40`）
- 深色：`dark` → `theme-new-dark`（`#121212 / #ededed / #fcdec0`）
- 跟随系统：`system` → 监听 `prefers-color-scheme`，实时切换浅/深
- 历史 `classic`：仅保留在设置页下拉，不在三态菜单中展示

## 实现文件

- `components/home/ThemeMenu.vue`
- `composables/useTheme.ts`（system 解析、媒体查询监听、首屏缓存）
- `assets/css/workbench.css`（`.wb-theme-*`）
- 挂载点：`components/home/WorkbenchHeader.vue`、`components/AppSidebar.vue`
- 首屏兜底脚本：`app.vue`（`bodyOpen` 读取 `opentavern-ui-theme`）
