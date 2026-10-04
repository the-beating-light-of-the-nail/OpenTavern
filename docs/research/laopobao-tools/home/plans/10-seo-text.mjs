/**
 * SEO 精查：区分「DOM 文本（爬虫实际读到）」与「可视文本（innerText，受 line-clamp 影响）」
 * 用法: $env:SEO_URL=...; $env:SEO_NAME=...; node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/10-seo-text.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.env.SEO_URL;
const NAME = process.env.SEO_NAME || 'page';
const ROOT = resolve('docs/research/laopobao-tools/home/seo');

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });
  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 4000, waitFor: `document.querySelector('h1')` });
  await page.scrollSweep({ step: 700, delay: 120 });

  const d = await page.eval(`(() => {
    const main = document.querySelector('main') || document.body;
    const norm = (s) => s.replace(/\\s+/g, ' ').trim();
    const domText = norm(main.textContent || '');
    const visText = norm(main.innerText || '');
    // 逐元素统计被 line-clamp 隐藏掉的字符
    let clampedChars = 0;
    const clamped = [];
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.children.length === 0) {
        const full = norm(el.textContent || '');
        const vis = norm(el.innerText || '');
        if (full.length > vis.length) { clampedChars += full.length - vis.length; clamped.push({ cls: el.className.slice(0,40), full: full.length, vis: vis.length }); }
      }
    }
    const h = (t) => [...document.querySelectorAll(t)].map(e => norm(e.textContent));
    return {
      url: location.href,
      domChars: domText.length,
      visChars: visText.length,
      clampedChars,
      clampedCount: clamped.length,
      clampedSample: clamped.slice(0, 5),
      headings: { h1: h('h1'), h2: h('h2'), h3: h('h3') },
      faqQuestions: [...document.querySelectorAll('details summary')].map(e => norm(e.textContent)),
      faqAnswers: [...document.querySelectorAll('details p')].map(e => norm(e.textContent)),
      links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).filter(h => h && (h.startsWith('/') || h.includes(location.host))).map(h => h.split('#')[0]))],
      domText,
    };
  })()`);

  writeFileSync(resolve(ROOT, `${NAME}-text.json`), JSON.stringify(d, null, 2));
  log(`[${NAME}] domChars=${d.domChars} visChars=${d.visChars} 被 clamp 隐藏=${d.clampedChars}（${d.clampedCount} 个元素）`);
  log(`  h1=${d.headings.h1.length} h2=${d.headings.h2.length} h3=${d.headings.h3.length} faq=${d.faqQuestions.length} links=${d.links.length}`);
}
