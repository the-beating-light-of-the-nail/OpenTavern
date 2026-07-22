/**
 * 为每个角色生成 OG / Twitter 分享图（1200×630）。
 *
 * 设计：品牌渐变底 + 金圈首字母 monogram（呼应站内 CharAvatar 字母头像）
 * + 角色名 + tagline（自动换行）+ 类别。无真实立绘时也能有强分享视觉。
 *
 * 依赖项目已装的 sharp（devDep）。用法：npm run og:image:characters
 * 输出：public/og/characters/<slug>.png
 *
 * 数据源 data/characters.ts：字段名在文件中唯一，按出现顺序对齐抽取，无需 TS 编译。
 */
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = resolve(ROOT, 'data/characters.ts');
const OUT_DIR = resolve(ROOT, 'public/og/characters');

const C = {
  plumDark: '#3d2b3d',
  primary: '#a94f6d',
  accent: '#d4ab72',
  cream: '#fbf4f2',
};

// 抽取某字段的所有值（按文件出现顺序）
function extract(src, key) {
  const re = new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(src))) out.push(m[1].replace(/\\'/g, "'"));
  return out;
}

// 简单换行：按最大字符数折行
function wrap(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function svgFor(c) {
  // 名字自适应字号：长名字缩小，保证单行不溢出
  const nameSize = Math.min(72, Math.round((72 * 18) / Math.max(c.name.length, 8)));
  const tagLines = wrap(c.tagline, 32).slice(0, 3);
  const tagStartY = 250;
  const tagTspans = tagLines
    .map((l, i) => `<tspan x="500" y="${tagStartY + i * 40}">${esc(l)}</tspan>`)
    .join('');
  const catY = tagStartY + tagLines.length * 40 + 34;

  return `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${C.plumDark}"/>
      <stop offset="0.55" stop-color="${C.primary}"/>
      <stop offset="1" stop-color="${C.plumDark}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="48" y="48" width="1104" height="534" fill="none" stroke="${C.accent}" stroke-opacity="0.5" stroke-width="2"/>

  <!-- 金圈 monogram + 首字母 -->
  <circle cx="290" cy="315" r="150" fill="${C.plumDark}" fill-opacity="0.35" stroke="${C.accent}" stroke-width="3"/>
  <text x="290" y="315" text-anchor="middle" dominant-baseline="central"
        font-family="Georgia, 'Times New Roman', serif" font-size="210" font-weight="700" fill="${C.accent}">${esc(c.initial)}</text>

  <!-- 角色名 -->
  <text x="500" y="180" font-family="Georgia, 'Times New Roman', serif"
        font-size="${nameSize}" font-weight="700" fill="${C.cream}">${esc(c.name)}</text>

  <!-- tagline（多行斜体） -->
  <text font-family="Georgia, 'Times New Roman', serif" font-size="30" font-style="italic" fill="${C.cream}" fill-opacity="0.92">${tagTspans}</text>

  <!-- 类别 -->
  <text x="500" y="${catY}" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="${C.accent}" letter-spacing="3">${esc(c.category.toUpperCase())} ROMANCE</text>

  <!-- 底部品牌 -->
  <text x="600" y="545" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="${C.cream}" fill-opacity="0.7" letter-spacing="2">OPEN TAVERN · ROLECHAT AI</text>
</svg>`.trim();
}

const src = await readFile(SRC, 'utf8');
const lists = {
  slug: extract(src, 'slug'),
  name: extract(src, 'name'),
  initial: extract(src, 'initial'),
  tagline: extract(src, 'tagline'),
  category: extract(src, 'category'),
};
const chars = lists.slug.map((slug, i) => ({
  slug,
  name: lists.name[i],
  initial: lists.initial[i],
  tagline: lists.tagline[i],
  category: lists.category[i],
}));

await mkdir(OUT_DIR, { recursive: true });
for (const c of chars) {
  await sharp(Buffer.from(svgFor(c))).png().toFile(resolve(OUT_DIR, `${c.slug}.png`));
}
console.log(`✓ Wrote ${chars.length} character OG images to public/og/characters/`);
