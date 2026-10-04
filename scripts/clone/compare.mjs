#!/usr/bin/env node
/**
 * 把「原站截图 / 本地克隆截图」纵向拼成对比图（左列原站，右列本地）。
 * 用法: node scripts/clone/compare.mjs <target.png> <local.png> <out.png> [labelWidth]
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const [target, local, out] = process.argv.slice(2);
if (!target || !local || !out) {
  console.error('用法: node scripts/clone/compare.mjs <target.png> <local.png> <out.png>');
  process.exit(1);
}

const a = sharp(await readFile(target));
const b = sharp(await readFile(local));
const [ma, mb] = await Promise.all([a.metadata(), b.metadata()]);

const width = Math.max(ma.width ?? 0, mb.width ?? 0);
const height = Math.max(ma.height ?? 0, mb.height ?? 0);

const label = (text, w) =>
  Buffer.from(
    `<svg width="${w}" height="34" xmlns="http://www.w3.org/2000/svg">
       <rect width="${w}" height="34" fill="#1f1f1f"/>
       <text x="12" y="23" font-family="Segoe UI, sans-serif" font-size="15" fill="#ffffff">${text}</text>
     </svg>`,
  );

const ra = await sharp(await readFile(target)).resize({ width, fit: 'contain', position: 'top' }).toBuffer();
const rb = await sharp(await readFile(local)).resize({ width, fit: 'contain', position: 'top' }).toBuffer();
const [raMeta, rbMeta] = await Promise.all([sharp(ra).metadata(), sharp(rb).metadata()]);

await sharp({
  create: { width, height: 34 + (raMeta.height ?? height) + 34 + (rbMeta.height ?? height), channels: 4, background: '#ffffff' },
})
  .composite([
    { input: label('TARGET — tools.laopobao.online', width), top: 0, left: 0 },
    { input: ra, top: 34, left: 0 },
    { input: label('LOCAL — OpenTavern (kept ivory/rose palette)', width), top: 34 + (raMeta.height ?? height), left: 0 },
    { input: rb, top: 68 + (raMeta.height ?? height), left: 0 },
  ])
  .png()
  .toFile(out);

console.log('[compare] 已输出', out);
