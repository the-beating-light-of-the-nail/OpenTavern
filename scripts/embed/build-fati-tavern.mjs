#!/usr/bin/env node
/**
 * 构建并部署 FATI Tavern 到 public/play/fati/（本站在线体验区）。
 *
 * 用法：
 *   node scripts/embed/build-fati-tavern.mjs              # 跟随上游 main 最新 commit
 *   node scripts/embed/build-fati-tavern.mjs --sha=<sha>   # 固定 commit 复现构建
 *
 * 做了什么：
 *   1. 从 GitHub API 取上游 dongzhang777-source/fati-tavern 的 commit（默认 main 最新）
 *   2. 下载 tarball 解压到系统临时目录（第三方源码不进本仓库）
 *   3. 唯一补丁：vite.config.ts 里 manifest 图标绝对路径 '/icon-*.png' → 相对 'icon-*.png'
 *      （--base=/play/fati/ 子路径部署下绝对路径会 404；MIT 允许，见 CREDITS.md）
 *   4. npm install + vite build --base=/play/fati/
 *   5. 校验产物（asset 前缀 /play/fati/、sw.js 存在、manifest 图标非根路径）
 *   6. 覆盖拷贝 dist/* → public/play/fati/，并写入 LICENSE 与 CREDITS.md
 */

import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const REPO = 'dongzhang777-source/fati-tavern';
const BASE = '/play/fati/';
const DEST = path.resolve('public/play/fati');
const argSha = process.argv.find((a) => a.startsWith('--sha='));
const SHA = argSha ? argSha.slice(6) : null;

function log(msg) {
  console.log(`[fati-build] ${msg}`);
}
function die(msg) {
  console.error(`[fati-build] 失败：${msg}`);
  process.exit(1);
}

async function download(url, file) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) die(`下载失败 ${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  return buf.length;
}

// 1. 解析 commit SHA
let sha = SHA;
if (!sha) {
  log('查询上游 main 最新 commit …');
  const res = await fetch(`https://api.github.com/repos/${REPO}/commits/main`);
  if (!res.ok) die(`GitHub API ${res.status}`);
  sha = (await res.json()).sha;
}
log(`commit: ${sha}`);

// 2. 下载并解压到临时目录（用 Windows 自带 bsdtar：Git Bash 的 GNU tar 会把 C:\ 当远程主机语法）
const work = await mkdtemp(path.join(tmpdir(), 'fati-tavern-'));
const tarball = path.join(work, 'src.tar.gz');
const size = await download(`https://api.github.com/repos/${REPO}/tarball/${sha}`, tarball);
log(`tarball ${(size / 1024 / 1024).toFixed(2)} MB`);
const src = path.join(work, 'src');
await mkdir(src);
const bsdtar = path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe');
execFileSync(bsdtar, ['-xzf', tarball.replaceAll('\\', '/'), '-C', src.replaceAll('\\', '/'), '--strip-components=1'], { stdio: 'inherit' });

// 3. 图标路径补丁（相对化，消除子路径 404）
const viteConfigPath = path.join(src, 'vite.config.ts');
let viteConfig = await readFile(viteConfigPath, 'utf8');
const hits = viteConfig.split("src: '/icon-").length - 1;
if (hits !== 4) die(`补丁锚点数量异常：期望 4 处 '/icon-'，实际 ${hits}（上游配置可能已变，请人工核对）`);
viteConfig = viteConfig.replaceAll("src: '/icon-", "src: 'icon-");
await writeFile(viteConfigPath, viteConfig);
log('补丁：manifest 图标 4 处改为相对路径');

// 4. 安装依赖并构建（Windows 下 npm 需走 shell）
const run = (cmd, cwd) => execFileSync(cmd, { cwd, shell: true, stdio: 'inherit' });
run('npm install --no-audit --no-fund', src);
run(`node node_modules/vite/bin/vite.js build --base=${BASE}`, src);

// 5. 校验产物
const dist = path.join(src, 'dist');
const indexHtml = await readFile(path.join(dist, 'index.html'), 'utf8');
if (!indexHtml.includes(`${BASE}assets/`)) die('index.html 资源前缀不是 ' + BASE);
const manifest = JSON.parse(await readFile(path.join(dist, 'manifest.webmanifest'), 'utf8'));
const badIcons = (manifest.icons || []).filter((i) => i.src.startsWith('/'));
if (badIcons.length) die(`manifest 仍有根路径图标：${badIcons.map((i) => i.src).join(', ')}`);
await readFile(path.join(dist, 'sw.js')); // 不存在会抛错
log('校验通过：资源前缀 / SW / manifest 图标');

// 6. 拷贝进仓库
await rm(DEST, { recursive: true, force: true });
await mkdir(DEST, { recursive: true });
await cp(dist, DEST, { recursive: true });
await cp(path.join(src, 'LICENSE'), path.join(DEST, 'LICENSE'));

const credits = `# FATI Tavern — 本站托管溯源

- 上游仓库: https://github.com/${REPO}
- 构建 commit: \`${sha}\`
- 构建日期: ${new Date().toISOString().slice(0, 10)}
- 许可证: MIT（见同目录 LICENSE）
- 构建命令: \`vite build --base=${BASE}\`

## 本站改动（相对上游源码，仅部署适配）

vite.config.ts 中 PWA manifest 图标 4 处 \`src: '/icon-*.png'\` 改为相对路径 \`icon-*.png\`，
消除 ${BASE} 子路径部署下的图标 404。其余源码与产物未做任何功能性修改。

## 更新方式

重跑 \`node scripts/embed/build-fati-tavern.mjs\`（跟随 main），或加 \`--sha=<commit>\` 固定版本。
`;
await writeFile(path.join(DEST, 'CREDITS.md'), credits);
log(`完成 → ${DEST}`);
await rm(work, { recursive: true, force: true }).catch(() => {});
