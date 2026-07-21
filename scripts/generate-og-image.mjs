// 生成默认 OG / Twitter 分享图（1200×630）。依赖项目已装的 sharp（devDep）。
// 用法：node scripts/generate-og-image.mjs
// 输出：public/og-default.png
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = resolve(__dirname, '../public/og-default.png');

// 品牌色（取自 assets/css/tokens.css）
const C = {
  plumDark: '#3d2b3d',
  primary: '#a94f6d',
  accent: '#d4ab72',
  cream: '#fbf4f2',
  softPink: '#fdf0f3',
};

const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.plumDark}"/>
      <stop offset="0.55" stop-color="${C.primary}"/>
      <stop offset="1" stop-color="${C.plumDark}"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- 装饰边框 -->
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="${C.accent}" stroke-opacity="0.5" stroke-width="2"/>

  <!-- 金色短分隔线 -->
  <rect x="600" y="250" width="120" height="4" fill="${C.accent}" transform="translate(-60,0)"/>

  <!-- 品牌名 -->
  <text x="600" y="210" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="92" font-weight="700" fill="${C.cream}"
        letter-spacing="1">Open Tavern</text>

  <!-- 副品牌 -->
  <text x="600" y="320" text-anchor="middle"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="40" font-weight="500" fill="${C.accent}"
        letter-spacing="3">· ROLECHAT AI</text>

  <!-- 标语 -->
  <text x="600" y="430" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="36" font-weight="400" fill="${C.cream}" fill-opacity="0.92">
    Private AI Character Roleplay
  </text>

  <!-- 底部小字 -->
  <text x="600" y="500" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="24" font-weight="400" fill="${C.cream}" fill-opacity="0.7">
    Romance &amp; fantasy characters · No install · Bring your own AI key
  </text>
</svg>
`.trim();

await sharp(Buffer.from(svg)).png().toFile(outPath);
const meta = await sharp(outPath).metadata();
console.log(`✓ Wrote ${outPath} (${meta.width}×${meta.height} ${meta.format})`);
