/**
 * SEO 定稿对账：不依赖布局顺序 —— 把改造前首页引用的每一个 i18n key，
 * 取其英文渲染值，逐条在当前线上页面正文里找回来。
 * 用法: $env:SEO_URL="https://www.rolechatai.com/"; node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/12-key-parity.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

const URL = process.env.SEO_URL || 'https://www.rolechatai.com/';
const OLD_REV = process.env.OLD_REV || '604a641'; // 改造前的最后一个提交
const ROOT = resolve('docs/research/laopobao-tools/home/seo');

const norm = (s) => (s || '').replace(/\s+/g, ' ').trim();

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });

  // 1) 改造前首页引用的 i18n key 全集
  const oldSrc = execSync(`git show ${OLD_REV}:pages/index.vue`, { encoding: 'utf8' });
  const oldKeys = new Set();
  for (const m of oldSrc.matchAll(/t\(\s*'([a-z0-9_]+)'/gi)) oldKeys.add(m[1]);
  for (const m of oldSrc.matchAll(/labelKey:\s*'([a-z0-9_]+)'/gi)) oldKeys.add(m[1]);

  // 2) 英文渲染值
  const en = JSON.parse(readFileSync('i18n/locales/en.json', 'utf8'));

  // 3) 当前线上页面正文
  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 5000, waitFor: `document.querySelector('h1')` });
  await page.scrollSweep({ step: 700, delay: 130 });

  const now = await page.eval(`(() => {
    const n = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    // textContent 而非 innerText：不受 CSS text-transform 与折叠元素影响，
    // 与爬虫实际读到的 DOM 文本一致
    return {
      bodyText: n(document.body.textContent),
      url: location.href,
      h1: [...document.querySelectorAll('h1')].map(e => n(e.textContent)),
    };
  })()`);

  // 4) 逐 key 核对
  const hay = now.bodyText;
  const hayLower = hay.toLowerCase();
  const rows = [];
  for (const key of [...oldKeys].sort()) {
    const val = en[key];
    if (typeof val !== 'string' || !val.trim()) {
      rows.push({ key, value: val, status: 'skip', note: 'en.json 无此 key 或非字符串' });
      continue;
    }
    const v = norm(val);
    if (hay.includes(v)) rows.push({ key, value: v, status: 'exact' });
    else if (hayLower.includes(v.toLowerCase())) rows.push({ key, value: v, status: 'case', note: '仅大小写不同（CSS text-transform 所致）' });
    else rows.push({ key, value: v, status: 'MISSING' });
  }

  const exact = rows.filter((r) => r.status === 'exact').length;
  const cs = rows.filter((r) => r.status === 'case').length;
  const missing = rows.filter((r) => r.status === 'MISSING');
  const skipped = rows.filter((r) => r.status === 'skip');

  log('');
  log('══════ 逐 key 渲染值对账（改造前 88 个 key → 当前线上 DOM）══════');
  log(`精确命中      : ${exact}`);
  log(`大小写差异命中 : ${cs}${cs ? '  → ' + rows.filter((r) => r.status === 'case').map((r) => r.key).join(', ') : ''}`);
  log(`跳过（无英文值）: ${skipped.length}${skipped.length ? '  → ' + skipped.map((r) => r.key).join(', ') : ''}`);
  log(`缺失          : ${missing.length}`);
  if (missing.length) for (const m of missing) log(`   ❌ ${m.key} = ${JSON.stringify(m.value)}`);
  log('');
  log(`结论：${exact + cs}/${rows.length - skipped.length} 个 key 的渲染值在线上页面里找得到`);

  // 5) 内容级词覆盖（去掉语言选择器的语言名噪音）
  const oldBody = JSON.parse(readFileSync(resolve(ROOT, 'old-live.json'), 'utf8')).bodyText || '';
  const langNoise = /^(en|zh|ja|ko|es|ar|pt|ru|fr|de|it|nl|sv|no|da|fi|pl|tr|hi|id|vi|th|ms|tl)$/i;
  const words = (t) =>
    new Set(
      t
        .split(/[\s,·—–\-/|()\[\]{}"'“”‘’]+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 5 && !langNoise.test(w) && !/^\d+$/.test(w)),
    );
  const ow = words(oldBody);
  const nw = words(hay);
  const nwLower = new Set([...nw].map((w) => w.toLowerCase()));
  const lostWords = [...ow].filter((w) => !nwLower.has(w.toLowerCase()));

  log('');
  log('══════ 内容级词覆盖（改造前正文 → 当前线上正文）══════');
  log(`改造前词表 ${ow.size} 个（长度≥5，已剔除语言名噪音）`);
  log(`未在新页出现的词: ${lostWords.length}`);
  if (lostWords.length) log('   ' + lostWords.join(', '));

  writeFileSync(
    resolve(ROOT, 'key-parity-report.json'),
    JSON.stringify({ url: URL, oldRev: OLD_REV, rows, exact, caseOnly: cs, missing, skipped, lostWords, measuredAt: new Date().toISOString() }, null, 2),
  );
}
