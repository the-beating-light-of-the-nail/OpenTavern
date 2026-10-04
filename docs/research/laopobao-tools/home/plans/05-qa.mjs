/**
 * Phase 5 视觉 QA：对本地克隆页做与原站同视口、同区块的截图 + 结构测量
 * 用法:
 *   $env:QA_URL="http://localhost:3100/"; node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/05-qa.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.env.QA_URL || 'http://localhost:3100/';
const OUTNAME = process.env.QA_NAME || 'local';
const ROOT = resolve('docs/research/laopobao-tools/home');
const SHOTS = resolve('docs/design-references/laopobao-tools/home');

const MEASURE = `(() => {
  const g = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      display: cs.display, position: cs.position, fontSize: cs.fontSize, fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, padding: cs.padding,
      margin: cs.margin, gap: cs.gap, gridTemplateColumns: cs.gridTemplateColumns,
      backgroundColor: cs.backgroundColor, color: cs.color, borderTopWidth: cs.borderTopWidth,
      borderTopColor: cs.borderTopColor, borderRadius: cs.borderRadius, boxShadow: cs.boxShadow,
      backdropFilter: cs.backdropFilter, maxWidth: cs.maxWidth, width: cs.width, height: cs.height,
      overflowX: cs.overflowX, textTransform: cs.textTransform, flexDirection: cs.flexDirection,
    };
  };
  return {
    url: location.href,
    title: document.title,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    scrollHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
    scrollWidth: document.body.scrollWidth,
    winW: window.innerWidth,
    header: g('header'),
    headerInner: g('header > div'),
    brand: g('header a'),
    navLink: g('header nav a'),
    navLinkActive: g('header nav a[aria-current], header nav a.is-active, header nav a.wb-nav-link.is-active'),
    rail: g('aside'),
    railTitle: g('aside h3'),
    cat: g('aside button'),
    catActive: g('aside button.is-active, aside button[aria-pressed="true"]'),
    railCta: g('aside a'),
    pills: g('.wb-pills, .md\\\\:hidden'),
    main: g('main'),
    layoutRow: g('main > div'),
    content: g('main > div > div:last-child'),
    h1: g('h1'),
    sub: g('h1 + p'),
    grid: g('.wb-grid, div.grid'),
    card: g('.wb-card, div.grid > div'),
    cardTitle: g('.wb-card-title, div.grid > div h3'),
    cardDesc: g('.wb-card-desc, div.grid > div p'),
    cardTag: g('.wb-card-tag, div.grid > div span.rounded-full'),
    cardCount: document.querySelectorAll('.wb-card, div.grid > div').length,
  };
})()`;

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });
  mkdirSync(SHOTS, { recursive: true });

  // 桌面 1440
  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 3500, waitFor: `document.querySelector('h1')` });
  await page.scrollSweep({ step: 700, delay: 120 });

  const desktop = await page.eval(MEASURE);
  writeFileSync(resolve(ROOT, `qa-${OUTNAME}-1440.json`), JSON.stringify(desktop, null, 2));
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-top.png`), { scrollTo: 0 });
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-full.png`), { full: true });
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-header.png`), { clip: { x: 0, y: 0, width: 1440, height: 70 } });
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-rail.png`), { clip: { x: 60, y: 60, width: 340, height: 560 } });
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-grid.png`), { clip: { x: 300, y: 120, width: 1140, height: 460 } });

  // 分类筛选两态
  const beforeFilter = await page.eval(`[...document.querySelectorAll('.wb-card, div.grid > div')].map(c => c.querySelector('h3')?.innerText)`);
  await page.click('aside button:nth-of-type(2)');
  await page.wait(600);
  const afterFilter = await page.eval(`(() => {
    const btns = [...document.querySelectorAll('aside button')];
    const a = btns.find(b => b.className.includes('is-active') || b.getAttribute('aria-pressed') === 'true');
    return {
      titles: [...document.querySelectorAll('.wb-card, div.grid > div')].map(c => c.querySelector('h3')?.innerText),
      activeText: a?.innerText,
      activeBg: a ? getComputedStyle(a).backgroundColor : null,
      activeColor: a ? getComputedStyle(a).color : null,
      activeFw: a ? getComputedStyle(a).fontWeight : null,
    };
  })()`);
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-filtered.png`), { scrollTo: 0 });
  await page.click('aside button:nth-of-type(1)');
  await page.wait(400);

  // 悬停两态
  const hoverBefore = await page.eval(`(() => { const c = document.querySelector('.wb-card, div.grid > div'); const cs = getComputedStyle(c); return { borderTopColor: cs.borderTopColor, boxShadow: cs.boxShadow, transform: cs.transform }; })()`);
  const box = await page.eval(`(() => { const c = document.querySelector('.wb-card, div.grid > div'); const r = c.getBoundingClientRect(); return { x: Math.round(r.left + r.width/2), y: Math.round(r.top + r.height/2) }; })()`);
  await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y, buttons: 0 });
  await page.wait(500);
  const hoverAfter = await page.eval(`(() => { const c = document.querySelector('.wb-card, div.grid > div'); const cs = getComputedStyle(c); const t = c.querySelector('h3'); return { borderTopColor: cs.borderTopColor, boxShadow: cs.boxShadow, transform: cs.transform, titleColor: t ? getComputedStyle(t).color : null }; })()`);
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-1440-hover.png`), { clip: { x: 300, y: 140, width: 580, height: 180 } });
  await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 400, buttons: 0 });

  // 移动端 390
  await page.viewport(390, 844, { mobile: true });
  await page.wait(1200);
  await page.eval(`window.scrollTo(0,0)`);
  await page.wait(400);
  const mobile = await page.eval(MEASURE);
  writeFileSync(resolve(ROOT, `qa-${OUTNAME}-390.json`), JSON.stringify(mobile, null, 2));
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-390-top.png`), { scrollTo: 0 });
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-390-full.png`), { full: true });

  // 平板 768
  await page.viewport(768, 1024);
  await page.wait(1000);
  await page.eval(`window.scrollTo(0,0)`);
  const tablet = await page.eval(MEASURE);
  writeFileSync(resolve(ROOT, `qa-${OUTNAME}-768.json`), JSON.stringify(tablet, null, 2));
  await page.shot(resolve(SHOTS, `qa-${OUTNAME}-768-top.png`), { scrollTo: 0 });

  writeFileSync(resolve(ROOT, `qa-${OUTNAME}-interactions.json`), JSON.stringify({ beforeFilter, afterFilter, hoverBefore, hoverAfter }, null, 2));

  log(`QA 完成 [${OUTNAME}] ${URL}`);
  log('title:', desktop.title, '| scrollHeight:', desktop.scrollHeight);
  log('grid columns:', desktop.grid?.gridTemplateColumns, '| cardCount:', desktop.cardCount);
  log('rail width:', desktop.rail?.width, '| header h:', desktop.header?.rect?.h);
  log('filter:', beforeFilter?.length, '->', afterFilter?.titles?.length, '| active bg:', afterFilter.activeBg);
  log('hover:', JSON.stringify(hoverBefore), '->', JSON.stringify(hoverAfter));
  log('mobile scrollW:', mobile.scrollWidth, 'winW:', mobile.winW, '| pills display:', mobile.pills?.display, '| aside display:', mobile.rail?.display);
}
