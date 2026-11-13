# FATI Tavern — 本站托管溯源

- 上游仓库: https://github.com/dongzhang777-source/fati-tavern
- 构建 commit: `082b84a038c3ac3792d97f86b3f4683d4ae4c075`
- 构建日期: 2026-11-13
- 许可证: MIT（见同目录 LICENSE）
- 构建命令: `vite build --base=/play/fati/`

## 本站改动（相对上游源码，仅部署适配）

vite.config.ts 中 PWA manifest 图标 4 处 `src: '/icon-*.png'` 改为相对路径 `icon-*.png`，
消除 /play/fati/ 子路径部署下的图标 404。其余源码与产物未做任何功能性修改。

## 更新方式

重跑 `node scripts/embed/build-fati-tavern.mjs`（跟随 main），或加 `--sha=<commit>` 固定版本。
