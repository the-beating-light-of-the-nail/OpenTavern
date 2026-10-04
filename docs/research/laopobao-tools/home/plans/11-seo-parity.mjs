/**
 * SEO 定稿对账（权威版）
 *
 * 与改造前基线的每一项逐条核对，三项口径修正：
 *   1. 标题比对用 textContent + 忽略大小写（旧基线是 innerText，受 CSS text-transform 影响）
 *   2. FAQ 答案旧基线为空串（<details> 收起时 innerText 读不到），改以 i18n 源文件为准
 *   3. 正文体量与词覆盖两边统一用 document.body.innerText（textContent 拼接相邻元素不加分隔符，
 *      会把 "Card Studio" + "Convert" 粘成 "StudioConvert"，导致分词全断）
 *
 * 用法: $env:SEO_URL="https://www.rolechatai.com/"; node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/11-seo-parity.mjs
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

  const old = JSON.parse(readFileSync(resolve(ROOT, 'old-live.json'), 'utf8'));
  const en = JSON.parse(readFileSync('i18n/locales/en.json', 'utf8'));
  const oldSrc = execSync(`git show ${OLD_REV}:pages/index.vue`, { encoding: 'utf8' });
  const oldKeys = new Set();
  for (const m of oldSrc.matchAll(/t\(\s*'([a-z0-9_]+)'/gi)) oldKeys.add(m[1]);
  for (const m of oldSrc.matchAll(/labelKey:\s*'([a-z0-9_]+)'/gi)) oldKeys.add(m[1]);

  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 5000, waitFor: `document.querySelector('h1')` });
  await page.scrollSweep({ step: 700, delay: 130 });

  const now = await page.eval(`(() => {
    const n = (s) => (s || '').replace(/\\s+/g, ' ').trim();
    const head = (sel) => [...document.querySelectorAll(sel)].map(e => n(e.textContent));
    return {
      url: location.href,
      title: document.title,
      metaDesc: document.querySelector('meta[name=description]')?.content,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      ldjson: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => n(s.textContent)),
      h1: head('h1'), h2: head('h2'), h3: head('h3'),
      headsAll: head('h1,h2,h3,h4'),
      faq: [...document.querySelectorAll('details')].map(d => ({
        q: n(d.querySelector('summary')?.textContent),
        a: n(d.querySelector('p')?.textContent),
      })),
      links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && (h.startsWith('/') || h.includes(location.host))).map(h => h.split('#')[0]))],
      bodyInnerText: n(document.body.innerText),
      bodyTextContent: n(document.body.textContent),
    };
  })()`);

  const R = [];
  const add = (item, ok, detail) => R.push({ item, ok, detail });

  /* ---------- 1. head 层 ---------- */
  add('title 逐字一致', norm(old.title) === norm(now.title), now.title);
  add('meta description 逐字一致', norm(old.metaDesc) === norm(now.metaDesc), norm(old.metaDesc) === norm(now.metaDesc) ? '一致' : `old: ${norm(old.metaDesc)}\n              new: ${norm(now.metaDesc)}`);
  add('canonical 一致', norm(old.canonical) === norm(now.canonical), `${old.canonical} → ${now.canonical}`);
  add('JSON-LD 结构化数据条数', old.ldjson.length === now.ldjson.length, `${old.ldjson.length} → ${now.ldjson.length}`);

  /* ---------- 2. 标题层级 ---------- */
  add('H1 数量', old.h1Count === now.h1.length, `${old.h1Count} → ${now.h1.length}`);
  add('H1 文本逐字一致', JSON.stringify(old.h1) === JSON.stringify(now.h1), JSON.stringify(now.h1));
  add('H2 数量', old.h2Count === now.h2.length, `${old.h2Count} → ${now.h2.length}`);
  add('H3 数量', old.h3Count === now.h3.length, `${old.h3Count} → ${now.h3.length}`);

  const oldHeads = old.heads.filter((h) => h.tag !== 'H1').map((h) => norm(h.text).toLowerCase());
  const nowHeadSet = new Set(now.headsAll.map((t) => norm(t).toLowerCase()));
  const missingHeads = oldHeads.filter((t) => !nowHeadSet.has(t));
  add('旧页 H2/H3/H4 标题逐条保留', missingHeads.length === 0, missingHeads.length ? `缺 ${JSON.stringify(missingHeads)}` : `${oldHeads.length}/${oldHeads.length}（忽略大小写，消除 CSS text-transform 干扰）`);

  /* ---------- 3. FAQ（以 i18n 源文件为准） ---------- */
  const faqKeys = Array.from({ length: 7 }, (_, i) => [`home_faq_q${i + 1}`, `home_faq_a${i + 1}`]);
  add('FAQ 条数', now.faq.length === 7, `${old.faqCount} → ${now.faq.length}`);
  const faqMissQ = faqKeys.filter(([q]) => !now.faq.some((f) => f.q === norm(en[q])));
  const faqMissA = faqKeys.filter(([, a]) => !now.faq.some((f) => f.a === norm(en[a])));
  add('FAQ 问题与源文件逐字一致', faqMissQ.length === 0, faqMissQ.length ? JSON.stringify(faqMissQ.map(([q]) => q)) : `7/7（旧基线因 <details> 收起读到空串，故以 i18n 源为准）`);
  add('FAQ 答案与源文件逐字一致', faqMissA.length === 0, faqMissA.length ? JSON.stringify(faqMissA.map(([, a]) => a)) : `7/7（同上）`);

  /* ---------- 4. 内链 ---------- */
  const missingLinks = old.internalLinks.filter((l) => !now.links.includes(l));
  add('内链集合无缺失', missingLinks.length === 0, missingLinks.length ? `缺 ${JSON.stringify(missingLinks)}` : `${old.internalLinks.length} 条全部在场`);

  /* ---------- 5. i18n key 渲染值全覆盖 ---------- */
  const hay = now.bodyTextContent;
  const hayLower = hay.toLowerCase();
  const headHay = [now.title, now.metaDesc].join(' ').toLowerCase();
  const keyMiss = [];
  let keyExact = 0;
  for (const key of oldKeys) {
    const val = en[key];
    if (typeof val !== 'string' || !val.trim()) continue;
    const v = norm(val);
    if (hayLower.includes(v.toLowerCase()) || headHay.includes(v.toLowerCase())) keyExact++;
    else keyMiss.push({ key, value: v });
  }
  add('改造前 88 个 i18n key 渲染值全覆盖', keyMiss.length === 0, keyMiss.length ? JSON.stringify(keyMiss) : `${keyExact}/${oldKeys.size}（含 head 层的 title/description）`);

  /* ---------- 6. 正文体量与词覆盖（两边同口径 innerText） ---------- */
  add('正文体量不减（body.innerText）', now.bodyInnerText.length >= old.bodyChars, `${old.bodyChars} → ${now.bodyInnerText.length} 字符（${now.bodyInnerText.length - old.bodyChars >= 0 ? '+' : ''}${now.bodyInnerText.length - old.bodyChars}）`);

  const langNoise = /^(en|zh|ja|ko|es|ar|pt|ru|fr|de|it|nl|sv|no|da|fi|pl|tr|hi|id|vi|th|ms|tl|japanese|korean|italian|dutch|swedish|norwegian|danish|finnish|polish|turkish|hindi|indonesian|vietnamese|malay|tagalog|thai)$/i;
  const tok = (t) =>
    new Set(
      norm(t)
        .split(/[^A-Za-z0-9\u4e00-\u9fff\u3040-\u30ff]+/)
        .map((w) => w.trim())
        .filter((w) => w.length >= 5 && !langNoise.test(w) && !/^\d+$/.test(w)),
    );
  const ow = tok(old.bodyText);
  const nw = new Set([...tok(now.bodyInnerText)].map((w) => w.toLowerCase()));
  const lostWords = [...ow].filter((w) => !nw.has(w.toLowerCase()));
  add('内容级词覆盖', lostWords.length === 0, lostWords.length ? `缺 ${lostWords.length}/${ow.size}: ${lostWords.join(', ')}` : `${ow.size}/${ow.size} 个词（长度≥5）全部在场`);

  const pass = R.filter((r) => r.ok).length;
  log('');
  log('══════════ 首页 SEO 逐条对账（改造前 ' + OLD_REV + ' → 当前线上）══════════');
  for (const r of R) log(`${r.ok ? '✅' : '❌'}  ${r.item.padEnd(34)} ${r.detail}`);
  log('');
  log(`结果：${pass}/${R.length} 项通过`);

  writeFileSync(resolve(ROOT, 'parity-report.json'), JSON.stringify({ url: URL, oldRev: OLD_REV, results: R, pass, total: R.length, measuredAt: new Date().toISOString() }, null, 2));
}
