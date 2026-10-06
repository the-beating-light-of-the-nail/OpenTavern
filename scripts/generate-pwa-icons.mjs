/**
 * 生成 PWA 图标（public/icon-*.png + apple-touch-icon.png）。
 * 设计：coffee 主题——炭黑底 + 奶油描边圆角环 + 啤酒杯图形（纯形状，无字体依赖）。
 * 用法：node scripts/generate-pwa-icons.mjs
 */
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CREAM = '#fcdec0';
const BG = '#121212';

/** 酒杯图形（viewBox 512）；scale 用于 maskable 安全区收缩 */
function iconSvg(scale = 1) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">
    <rect x="56" y="56" width="400" height="400" rx="96" fill="none" stroke="${CREAM}" stroke-width="16"/>
    <path d="M198 196 h116 l-14 146 a44 44 0 0 1 -88 0 z" fill="${CREAM}"/>
    <path d="M210 224 h92 l-9 106 a34 34 0 0 1 -74 0 z" fill="${BG}" opacity="0.35"/>
    <circle cx="218" cy="180" r="16" fill="${CREAM}"/>
    <circle cx="256" cy="168" r="21" fill="${CREAM}"/>
    <circle cx="294" cy="180" r="16" fill="${CREAM}"/>
  </g>
</svg>`;
}

const jobs = [
  ['public/icon-192.png', 192, 1],
  ['public/icon-512.png', 512, 1],
  ['public/icon-512-maskable.png', 512, 0.78],
  ['public/apple-touch-icon.png', 180, 1],
];

for (const [rel, size, scale] of jobs) {
  const out = path.join(root, rel);
  await sharp(Buffer.from(iconSvg(scale))).resize(size, size).png().toFile(out);
  console.log('ok', rel, size + 'x' + size);
}
