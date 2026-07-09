/**
 * 卡片图优化脚本（阶段 9，图片优化管线）。
 *
 * 作用：把 cards/ 下的原始角色立绘（PNG/JPG，≈40MB）降采样为多宽度 WebP + AVIF，
 * 输出到 public/cards/（由 Nuxt 静态服务）；原始大图与 JSON 归档到 cards-src/（不进 public，保留供 SillyTavern 下载/导入）。
 *
 * 用法：npm run optimize:cards
 *
 * 设计：
 * - 宽度 {600, 400, 200}：600 覆盖 retina 卡片预览，200 覆盖所有头像/缩略图（原版最大渲染 ≤300px）。
 * - WebP quality 80 / AVIF quality 60（原文件均为无 alpha 调色板 PNG，有损转码安全）。
 * - 命名 <Slug>-<w>.<ext>，Slug = 原文件名主部（如 Arona、Tendou_Kei）。
 * - 幂等：重复运行会覆盖变体、再次归档（已归档的跳过）。
 * - 同时写入 manifest.json，供后续公网卡库移植直接消费。
 */
import sharp from 'sharp';
import { readdir, readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'cards');
const OUT = path.join(ROOT, 'public', 'cards');
const ARCHIVE = path.join(ROOT, 'cards-src');

const WIDTHS = [600, 400, 200];
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg']);

function fmtSize(bytes) {
  return bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) + ' MB'
    : (bytes / 1024).toFixed(0) + ' KB';
}

async function safeRename(src, dest) {
  // 同路径（已归档）跳过；目标已存在则覆盖
  if (path.resolve(src) === path.resolve(dest)) return;
  try { await rename(src, dest); } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

async function main() {
  if (!existsSync(SRC)) {
    console.error('[optimize-cards] cards/ 目录不存在，无可处理文件。');
    process.exit(0);
  }
  await mkdir(OUT, { recursive: true });
  await mkdir(ARCHIVE, { recursive: true });

  const entries = await readdir(SRC);
  const images = entries.filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()));
  const jsons = entries.filter((f) => path.extname(f).toLowerCase() === '.json');

  if (!images.length && !jsons.length) {
    console.log('[optimize-cards] cards/ 已无源文件（看起来已处理过）。');
    return;
  }

  const manifest = [];
  let outBytes = 0;
  let srcBytes = 0;

  for (const img of images) {
    const slug = path.basename(img, path.extname(img));
    const srcPath = path.join(SRC, img);
    const sStat = await stat(srcPath).catch(() => null);
    srcBytes += sStat ? sStat.size : 0;

    for (const w of WIDTHS) {
      const webpBuf = await sharp(srcPath).resize({ width: w, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
      await writeFile(path.join(OUT, `${slug}-${w}.webp`), webpBuf);
      outBytes += webpBuf.length;

      const avifBuf = await sharp(srcPath).resize({ width: w, withoutEnlargement: true }).avif({ quality: 60 }).toBuffer();
      await writeFile(path.join(OUT, `${slug}-${w}.avif`), avifBuf);
      outBytes += avifBuf.length;
    }

    // 归档原图到 cards-src/
    await safeRename(srcPath, path.join(ARCHIVE, img));
    manifest.push({ slug, file: img });
    console.log(`[optimize-cards] ✓ ${slug} → 600/400/200 (webp+avif)`);
  }

  // JSON：复制到 public/cards/（供后续卡库 fetch），原件归档
  for (const j of jsons) {
    const data = await readFile(path.join(SRC, j));
    await writeFile(path.join(OUT, j), data);
    await safeRename(path.join(SRC, j), path.join(ARCHIVE, j));
  }

  await writeFile(path.join(OUT, 'manifest.json'), JSON.stringify({ generatedAt: new Date().toISOString(), widths: WIDTHS, cards: manifest }, null, 2));

  console.log('');
  console.log(`[optimize-cards] 原图合计: ${fmtSize(srcBytes)}（已归档至 cards-src/）`);
  console.log(`[optimize-cards] 变体合计: ${fmtSize(outBytes)}（写入 public/cards/，含 webp+avif 双格式）`);
  console.log(`[optimize-cards] 完成，共 ${images.length} 张图，${jsons.length} 个 JSON。`);
}

main().catch((e) => {
  console.error('[optimize-cards] 失败：', e);
  process.exit(1);
});
