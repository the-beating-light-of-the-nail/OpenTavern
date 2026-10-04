/**
 * Phase 1c 行为提取：hover 两态 diff / 分类点击 / 移动端 390 布局
 * 用法: node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/03-behaviors.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = 'https://tools.laopobao.online/';
const ROOT = resolve('docs/research/laopobao-tools/home');
const SHOTS = resolve('docs/design-references/laopobao-tools/home');

const DIFF_PROPS = [
  'backgroundColor', 'color', 'borderTopColor', 'borderTopWidth', 'borderRadius', 'boxShadow',
  'transform', 'opacity', 'padding', 'fontSize', 'fontWeight', 'textDecorationLine', 'cursor',
  'transition', 'width', 'height', 'gap', 'outlineColor', 'outlineWidth', 'filter',
];

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });
  mkdirSync(SHOTS, { recursive: true });

  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 4000, waitFor: `document.querySelectorAll('a,button').length > 3` });

  /** 真实鼠标悬停（合成事件不触发 CSS :hover，必须走 CDP Input 域） */
  const realHover = async (sel) => {
    const box = await page.eval(`(() => {
      const el = document.querySelector(${JSON.stringify(sel)});
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2) };
    })()`);
    if (!box) return false;
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y, buttons: 0 });
    await page.wait(120);
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y, buttons: 0 });
    return true;
  };
  const realUnhover = async () => {
    await page.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 400, buttons: 0 });
    await page.wait(250);
  };

  const snapshot = (sel) => page.eval(`(() => {
    const el = document.querySelector(${JSON.stringify(sel)});
    if (!el) return null;
    const cs = getComputedStyle(el);
    const o = {};
    for (const p of ${JSON.stringify(DIFF_PROPS)}) o[p] = cs[p];
    return o;
  })()`);

  const diff = (a, b) => {
    if (!a || !b) return null;
    const out = {};
    for (const k of Object.keys(a)) if (a[k] !== b[k]) out[k] = { from: a[k], to: b[k] };
    return out;
  };

  const CARD = 'div.grid.gap-3 > div';
  const ACTIVE_NAV = 'header nav a:first-child';
  const IDLE_NAV = 'header nav a:nth-child(2)';
  const CAT_IDLE = 'aside button:not([class*="bg-primary"])';
  const IMPORT = 'aside button.w-full.gap-2';
  const CARD_TITLE = 'div.grid.gap-3 > div h3';
  const CARD_TAG = 'div.grid.gap-3 > div span.rounded-full';

  const behaviors = {};

  // --- hover 两态 ---
  const hoverCases = [
    ['card', CARD], ['card-title', CARD_TITLE], ['card-tag', CARD_TAG],
    ['nav-idle', IDLE_NAV], ['sidebar-cat-idle', CAT_IDLE], ['import-btn', IMPORT],
  ];
  for (const [name, sel] of hoverCases) {
    await realUnhover();
    const before = await snapshot(sel);
    const ok = await realHover(sel);
    await page.wait(450);
    const after = await snapshot(sel);
    behaviors['hover:' + name] = { selector: sel, hovered: ok, diff: diff(before, after), transition: before?.transition };
  }
  await realHover(CARD);
  await page.wait(400);
  await page.shot(resolve(SHOTS, 'hover-card.png'), { clip: { x: 300, y: 150, width: 560, height: 170 } });
  await realUnhover();

  // --- 分类点击（交互模型：click-driven 筛选） ---
  const beforeClick = await page.eval(`(() => {
    const cards = [...document.querySelectorAll('div.grid.gap-3 > div')];
    return { count: cards.length, titles: cards.map(c => c.querySelector('h3')?.innerText) };
  })()`);
  await page.click('aside button:nth-of-type(2)');
  await page.wait(700);
  const afterClick = await page.eval(`(() => {
    const cards = [...document.querySelectorAll('div.grid.gap-3 > div')];
    const btns = [...document.querySelectorAll('aside button')];
    return {
      count: cards.length, titles: cards.map(c => c.querySelector('h3')?.innerText),
      activeCat: btns.find(b => b.className.includes('bg-primary'))?.innerText,
      activeCatStyle: (() => { const b = btns.find(b => b.className.includes('bg-primary')); if (!b) return null; const cs = getComputedStyle(b); return { bg: cs.backgroundColor, color: cs.color, fw: cs.fontWeight }; })(),
    };
  })()`);
  behaviors.categoryFilter = { before: beforeClick, after: afterClick };
  await page.shot(resolve(SHOTS, 'state-filtered.png'), { scrollTo: 0 });

  // 恢复全部
  await page.click('aside button:nth-of-type(1)');
  await page.wait(500);

  // --- 卡片 footer 右侧元素（箭头/图标） ---
  behaviors.cardFooterRight = await page.eval(`(() => {
    const card = document.querySelector('div.grid.gap-3 > div');
    const box = card.querySelector('div.flex.items-center.justify-between.pt-2 > div');
    if (!box) return null;
    return { html: box.outerHTML.slice(0, 600), childCount: box.children.length, innerText: box.innerText };
  })()`);

  // --- 卡片标题右侧作者徽标 ---
  behaviors.cardAuthorBadge = await page.eval(`(() => {
    const badge = document.querySelector('div.grid.gap-3 > div span.bg-muted\\\\/30') || [...document.querySelectorAll('div.grid.gap-3 > div span')].find(s => s.querySelector('svg'));
    return badge ? badge.outerHTML.slice(0, 700) : null;
  })()`);

  // --- header 隐藏/显示与滚动 ---
  await page.eval(`window.scrollTo(0, 500)`);
  await page.wait(400);
  behaviors.headerOnScroll = await snapshot('header');

  // --- 移动端 390 ---
  await page.viewport(390, 844, { mobile: true });
  await page.wait(1200);
  await page.eval(`window.scrollTo(0,0)`);
  await page.wait(400);
  behaviors.mobile = await page.eval(`(() => {
    const q = (s) => document.querySelector(s);
    const g = (el) => { if (!el) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { display: cs.display, w: Math.round(r.width), h: Math.round(r.height), font: cs.fontSize, pad: cs.padding, bg: cs.backgroundColor, br: cs.borderRadius, gridTemplateColumns: cs.gridTemplateColumns, gap: cs.gap, overflowX: cs.overflowX }; };
    return {
      headerInner: g(q('header > div')),
      logoText: g(q('header span.font-bold')),
      navDesktop: g(q('header nav')),
      themeBtn: g(q('header button')),
      aside: g(q('aside')),
      mobileCatRow: g(q('main main div.md\\\\:hidden')),
      pillRow: g(q('main main div.flex.gap-2.overflow-x-auto')),
      mainPadding: g(q('main')),
      layoutRow: g(q('main > div')),
      grid: g(q('div.grid.gap-3')),
      card: g(q('div.grid.gap-3 > div')),
      title: g(q('main main h1')),
      bodyScrollW: document.body.scrollWidth,
      winW: window.innerWidth,
    };
  })()`);
  await page.shot(resolve(SHOTS, 'mobile-390-top.png'), { scrollTo: 0 });
  const mh = await page.eval(`Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)`);
  log('mobile scrollHeight:', mh);

  // --- 768 平板 ---
  await page.viewport(768, 1024);
  await page.wait(1000);
  behaviors.tablet768 = await page.eval(`(() => {
    const g = (s) => { const el = document.querySelector(s); if (!el) return null; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return { display: cs.display, w: Math.round(r.width), gridTemplateColumns: cs.gridTemplateColumns, gap: cs.gap, flexDirection: cs.flexDirection }; };
    return { aside: g('aside'), nav: g('header nav'), grid: g('div.grid.gap-3'), layoutRow: g('main > div'), mobileCatRow: g('main main div.md\\\\:hidden') };
  })()`);
  await page.shot(resolve(SHOTS, 'tablet-768-top.png'), { scrollTo: 0 });

  writeFileSync(resolve(ROOT, 'behaviors-raw.json'), JSON.stringify(behaviors, null, 2));
  log('behaviors 提取完成');
  log('categoryFilter:', JSON.stringify(behaviors.categoryFilter));
  log('cardFooterRight:', JSON.stringify(behaviors.cardFooterRight));
}
