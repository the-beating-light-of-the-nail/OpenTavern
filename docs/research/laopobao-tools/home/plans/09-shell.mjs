/**
 * Phase 6：全幅外壳验收（左栏贴左 / 可收缩 / 顶栏通栏 / 内容占满）
 * 用法: $env:QA_URL="http://localhost:3100/"; node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/09-shell.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.env.QA_URL || 'http://localhost:3100/';
const NAME = process.env.QA_NAME || 'shell';
const ROOT = resolve('docs/research/laopobao-tools/home');
const SHOTS = resolve('docs/design-references/laopobao-tools/home');

const MEASURE = `(() => {
  const g = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x: Math.round(r.x), right: Math.round(r.right), w: Math.round(r.width), h: Math.round(r.height),
      top: Math.round(r.top + window.scrollY), display: cs.display, position: cs.position,
      width: cs.width, height: cs.height, overflowY: cs.overflowY, top_: cs.top,
    };
  };
  return {
    winW: window.innerWidth,
    winH: window.innerHeight,
    docScrollW: document.documentElement.scrollWidth,
    docScrollH: document.documentElement.scrollHeight,
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    header: g('.wb-header'),
    headerInner: g('.wb-header-inner'),
    body: g('.wb-body'),
    rail: g('.wb-rail'),
    railHead: g('.wb-rail-head'),
    railToggle: g('.wb-rail-toggle'),
    catLabel: g('.wb-rail .wb-cat-label'),
    railCta: g('.wb-rail-btn'),
    content: g('.wb-content'),
    grid: g('.wb-grid'),
    card: g('.wb-card'),
    gridCols: document.querySelector('.wb-grid') ? getComputedStyle(document.querySelector('.wb-grid')).gridTemplateColumns : null,
    cardCount: document.querySelectorAll('.wb-card').length,
    pills: g('.wb-pills'),
  };
})()`;

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });
  mkdirSync(SHOTS, { recursive: true });

  const out = {};
  for (const [w, h, tag] of [[1920, 1080, '1920'], [1440, 900, '1440'], [768, 1024, '768'], [390, 844, '390']]) {
    await page.viewport(w, h);
    await page.goto(URL, { waitMs: 3000, waitFor: `document.querySelector('.wb-card')` });
    const m = await page.eval(MEASURE);
    out[tag] = m;
    log(`[${tag}] winW=${m.winW} rail.x=${m.rail?.x} rail.w=${m.rail?.w} rail.h=${m.rail?.h} headerInner.w=${m.headerInner?.w} content.x=${m.content?.x} content.right=${m.content?.right} cols=${m.gridCols} overflowX=${m.overflowX}`);
    await page.shot(resolve(SHOTS, `shell-${NAME}-${tag}-top.png`), { scrollTo: 0 });
  }

  // 收起前
  await page.viewport(1600, 900);
  await page.goto(URL, { waitMs: 3000, waitFor: `document.querySelector('.wb-card')` });
  await page.eval(`(() => { try { localStorage.removeItem('wb_rail_collapsed'); } catch (e) {} return true; })()`);
  await page.goto(URL, { waitMs: 2500, waitFor: `document.querySelector('.wb-card')` });
  const expanded = await page.eval(MEASURE);
  await page.shot(resolve(SHOTS, `shell-${NAME}-expanded.png`), { scrollTo: 0 });

  // 点折叠开关
  await page.click('.wb-rail-toggle');
  await page.wait(600);
  const collapsed = await page.eval(MEASURE);
  const collapsedState = await page.eval(`(() => {
    const rail = document.querySelector('.wb-rail');
    return {
      hasClass: rail.className.includes('is-collapsed'),
      ariaExpanded: document.querySelector('.wb-rail-toggle')?.getAttribute('aria-expanded'),
      labelDisplay: getComputedStyle(document.querySelector('.wb-rail .wb-cat-label')).display,
      countDisplay: getComputedStyle(document.querySelector('.wb-rail .wb-cat-count')).display,
      stored: (() => { try { return localStorage.getItem('wb_rail_collapsed'); } catch { return null; } })(),
      catTitle: document.querySelector('.wb-rail .wb-cat')?.getAttribute('title'),
    };
  })()`);
  await page.shot(resolve(SHOTS, `shell-${NAME}-collapsed.png`), { scrollTo: 0 });

  // 刷新后是否记住
  await page.goto(URL, { waitMs: 2500, waitFor: `document.querySelector('.wb-card')` });
  const afterReload = await page.eval(MEASURE);
  const reloadState = await page.eval(`document.querySelector('.wb-rail').className.includes('is-collapsed')`);

  // 展开回去
  await page.click('.wb-rail-toggle');
  await page.wait(600);
  const reExpanded = await page.eval(MEASURE);

  // 滚动时左栏是否 sticky 跟随
  await page.eval(`window.scrollTo(0, 1200)`);
  await page.wait(500);
  const scrolled = await page.eval(`(() => {
    const r = document.querySelector('.wb-rail').getBoundingClientRect();
    return { railTop: Math.round(r.top), railBottom: Math.round(r.bottom), winH: window.innerHeight, scrollY: Math.round(window.scrollY) };
  })()`);
  await page.shot(resolve(SHOTS, `shell-${NAME}-scrolled.png`), { scrollTo: 1200 });

  const result = { viewports: out, expanded, collapsed, collapsedState, afterReload, reloadState, reExpanded, scrolled };
  writeFileSync(resolve(ROOT, `qa-${NAME}.json`), JSON.stringify(result, null, 2));

  log('--- 折叠 ---');
  log('expanded rail.w:', expanded.rail?.w, '| collapsed rail.w:', collapsed.rail?.w);
  log('collapsedState:', JSON.stringify(collapsedState));
  log('reload 后仍收起:', reloadState, '| rail.w:', afterReload.rail?.w);
  log('re-expanded rail.w:', reExpanded.rail?.w);
  log('滚动后 rail top/bottom:', scrolled.railTop, '/', scrolled.railBottom, '| winH:', scrolled.winH);
}
