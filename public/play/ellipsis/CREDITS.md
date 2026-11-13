# EllipsisLM — 本站托管溯源

- 上游仓库: https://github.com/pacmanincarnate/EllipsisLM
- 抓取 commit: `f5dac453b3b213ddaa709a52d1e9e0c659031139`（main，2026-11-09）
- 抓取日期: 2026-11-13
- 许可证: Apache-2.0（见同目录 LICENSE；README 中 "MIT" 为上游标注笔误，以 LICENSE 文件为准）
- 上游在线版: https://pacmanincarnate.github.io/EllipsisLM/

## 本站改动（相对上游 index.html）

仅做资源本地化部署适配，无功能性修改：

1. 三处 `<script src>` 由公共 CDN 改为同目录相对引用 `vendor/*.min.js`，
   规避 CDN 在部分地区不可达导致的加载失败：
   - `jszip.min.js` ← https://cdn.jsdelivr.net/npm/jszip@3.10.2/dist/jszip.min.js（JSZip，MIT）
   - `marked.min.js` ← https://cdn.jsdelivr.net/npm/marked@15.0.12/marked.min.js（marked，MIT；
     版本取自官方无版本引用当日实际解析值）
   - `pako.min.js` ← https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min.js（pako，MIT AND Zlib）
2. 未随附 `sw.js`：应用内 `navigator.serviceWorker.register('./sw.js')` 将静默失败，
   不安装 Service Worker，与站点根作用域 sw.js 互不影响。

其余内容（含 favicon 远程指向、`electron/tailwind.css` 引用等）保持上游原样。

## 更新方式

按上游新 commit 重拉 `raw.githubusercontent.com/pacmanincarnate/EllipsisLM/<SHA>/index.html`，
重复上述三处替换后覆盖本目录，并更新本文件 SHA 与日期。
