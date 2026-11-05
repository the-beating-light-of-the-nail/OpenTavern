# tools.laopobao.online 配色提取（2026-11-05）

来源：`https://tools.laopobao.online/assets/index-DmqGhbuO.css`（浏览器实测抓取 + getComputedStyle 验证）。
站点 3 套主题：`theme-coffee`（默认，html 类 `notranslate dark theme-coffee`）、`theme-supabase`、`theme-skyline`。
截图：`docs/design-references/laopobao-tools/home/{desktop-1440,mobile-390}.png`

## theme-coffee 深色（站点默认态，OpenTavern `:root` / `theme-new-dark` 对齐对象）

| 源 token | 值 | OpenTavern 槽位 |
| --- | --- | --- |
| background | `#121212` | `--color-bg` ✅ |
| foreground | `#ededed` | `--color-text` ✅ |
| card / popover | `#171717` | `--color-surface` ✅ |
| primary | `#fcdec0` | `--color-primary` ✅ |
| primary-foreground | `#0a191a` | `--color-on-primary` ✅ |
| secondary | `#393028` | **新增 `--color-secondary`** |
| secondary-foreground | `#fcdec0` | **新增 `--color-on-secondary`** |
| muted | `#212121` | `--color-surface-soft` ✅ |
| muted-foreground | `#b5b5b5` | `--color-text-soft` ✅ |
| accent | `#2b2b2b` | 语义=悬停灰面，OpenTavern 由 surface-soft 承担；`--color-accent` 保留蜜桃 `#ffdfb3`（=源浅色 secondary，咖啡家族，历史决定） |
| destructive | `#e55134` | `--color-danger` ✅ |
| border | `#22201b` | `--color-border` ✅ |
| input | `#474747` | **新增 `--color-input`** |
| ring | `#fcdec0` | **新增 `--color-ring`** |
| sidebar 系 | `#17171c / #26262b / #f5f5f5 / #d2d2da` | 与 surface 近似，暂不引入（无消费方） |
| chart-1..5 | `#fcdec0 / #393028 / #2b2b2b / #41382f / #fcdec0` | 无图表，不引入 |

OpenTavern 独有分层（源站无对应，保留）：`text-muted #9a9a9a`、`text-faint #7d7d7d`、`border-strong #2e2c27`、`primary-hover #edcfb0`、success/info。

## theme-coffee 浅色（OpenTavern `theme-new-light` 对齐对象）

| 源 token | 值 | OpenTavern |
| --- | --- | --- |
| background | `#f7f7f7` | ✅ |
| foreground | `#1f1f1f` | ✅ |
| card | `#fcfcfc` | surface ✅ |
| primary / primary-foreground | `#644a40` / `#fff` | ✅ |
| secondary / secondary-foreground | `#ffdfb3` / `#592d1c` | accent ✅ / **新增 on-secondary** |
| muted / muted-foreground | `#ededed` / `#636363` | ✅ |
| accent | `#e8e8e8` | 悬停灰面，surface-soft 承担 |
| destructive | `#e55134` | ✅ |
| border / input / ring | `#d6d6d6` / `#d6d6d6` / `#644a40` | ✅ / 新增 / 新增 |

## 计算样式验证（深色实测）

- 激活筛选按钮：bg `#fcdec0`、字 `#0a191a`（primary 实锤）
- 激活导航项：`bg-primary/10` + `text-primary`
- 侧栏容器：`bg-muted/20`（#212121 @20%）+ 圆角左 12px
- 品牌小徽（"老婆宝"）：`bg-muted/30`、字 muted-foreground @80%
- 全站边框 `#22201b`；header `bg-background/95 + backdrop-blur`
- 字体栈：`ui-sans-serif, system-ui` 系统栈（无自托管字体）

## theme-supabase / theme-skyline（备查，未采用）

- supabase：白底 + 绿 primary `#10b77f`
- skyline：白底 + 紫 primary `#7c3aed`

## 变更摘要（本次落到 assets/css/tokens.css）

`:root` 与 `theme-new-dark` 新增：`--color-secondary #393028`、`--color-on-secondary #fcdec0`、`--color-input #474747`、`--color-ring #fcdec0`（含 secondary 的 `-rgb` 三元组）。
`theme-new-light` 新增：`--color-secondary #ffdfb3`、`--color-on-secondary #592d1c`、`--color-input #d6d6d6`、`--color-ring #644a40`。
`theme-classic` 不动（继承 :root 深色新槽位即可）。
