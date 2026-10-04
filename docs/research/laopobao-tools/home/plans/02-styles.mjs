/**
 * Phase 1b 侦察：可读 DOM 树 + CSS 变量 + 关键节点全量计算样式
 * 用法: node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/02-styles.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = 'https://tools.laopobao.online/';
const ROOT = resolve('docs/research/laopobao-tools/home');
const SHOTS = resolve('docs/design-references/laopobao-tools/home');

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });
  mkdirSync(SHOTS, { recursive: true });

  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 4000, waitFor: `document.querySelectorAll('a,button').length > 3` });

  // 1) CSS 变量（:root 与主题类）
  const vars = await page.eval(`(() => {
    const out = {};
    const collect = (el, label) => {
      const cs = getComputedStyle(el);
      const o = {};
      for (const name of cs) if (name.startsWith('--')) o[name] = cs.getPropertyValue(name).trim();
      out[label] = o;
    };
    collect(document.documentElement, ':root(html)');
    collect(document.body, 'body');
    const theme = [...document.querySelectorAll('[class*=theme-]')].map(e => e.className);
    return { vars: out, themeClasses: theme };
  })()`);
  writeFileSync(resolve(ROOT, 'css-variables.json'), JSON.stringify(vars, null, 2));

  // 2) 可读 DOM 树（含 class / 关键计算样式 / 文本）
  const tree = await page.eval(`(() => {
    const lines = [];
    const PROPS = ['display','position','flexDirection','gridTemplateColumns','gap','width','height','padding','margin','backgroundColor','color','border','borderRadius','boxShadow','fontSize','fontWeight','fontFamily','lineHeight','letterSpacing','textTransform','alignItems','justifyContent','overflow','backdropFilter','opacity','transition'];
    const fmt = (el, depth) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const cls = typeof el.className === 'string' ? el.className.split(/\\s+/).filter(Boolean).join('.') : '';
      const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ').slice(0, 80);
      const svg = el.tagName.toLowerCase() === 'svg' ? ' [svg ' + (el.getAttribute('viewBox')||'') + ' ' + (el.getAttribute('class')||'') + ']' : '';
      lines.push('  '.repeat(depth) + '<' + el.tagName.toLowerCase() + (cls ? ' .' + cls : '') + '>' + svg +
        ' rect=' + [r.x,r.y,r.width,r.height].map(v=>Math.round(v)).join(',') +
        ' | ' + ['display','position','backgroundColor','borderRadius','borderTopWidth','borderTopColor','padding','gap','gridTemplateColumns','fontSize','fontWeight','color','boxShadow'].map(p => p + ':' + cs[p]).join('; ') +
        (own ? ' | TEXT="' + own + '"' : ''));
      if (depth < 9) for (const c of el.children) fmt(c, depth + 1);
    };
    fmt(document.querySelector('#root'), 0);
    return lines.join('\\n');
  })()`);
  writeFileSync(resolve(ROOT, 'dom-tree.txt'), tree);

  // 3) 关键节点全量计算样式（按语义定位）
  const keyStyles = await page.eval(`(() => {
    const ALL = ['display','position','top','left','right','bottom','zIndex','flexDirection','flexWrap','alignItems','justifyContent','gap','gridTemplateColumns','gridTemplateRows','width','height','minWidth','maxWidth','minHeight','maxHeight','margin','padding','backgroundColor','backgroundImage','color','fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','textAlign','textTransform','borderWidth','borderStyle','borderColor','borderRadius','boxShadow','opacity','overflow','overflowY','backdropFilter','transition','cursor','textDecorationLine','whiteSpace','textOverflow','WebkitLineClamp','flex','flexShrink','flexGrow','aspectRatio','objectFit'];
    const grab = (el, label) => {
      if (!el) return { label, missing: true };
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const o = { label, tag: el.tagName.toLowerCase(), class: typeof el.className === 'string' ? el.className : '', rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) }, text: (el.innerText||'').replace(/\\s+/g,' ').trim().slice(0,160) };
      for (const p of ALL) o[p] = cs[p];
      return o;
    };
    const byText = (txt, tag = '*') => [...document.querySelectorAll(tag)].find(e => (e.innerText||'').trim() === txt);
    const byTextHas = (txt, tag = '*') => [...document.querySelectorAll(tag)].find(e => (e.innerText||'').includes(txt) && e.children.length < 4);
    const out = {};
    out.html = grab(document.documentElement, 'html');
    out.body = grab(document.body, 'body');
    out.root = grab(document.querySelector('#root'), '#root');
    out.appShell = grab(document.querySelector('#root > div'), 'app shell');
    // header
    const header = document.querySelector('header') || document.querySelector('nav') || document.querySelector('#root > div > div');
    out.header = grab(header, 'header');
    out.headerChildren = header ? [...header.children].map((c,i) => grab(c, 'header-child-' + i)) : [];
    out.logoText = grab(byText('小兔几', 'span') || byText('小兔几'), 'logo text');
    // nav items
    out.navHome = grab(byText('首页'), 'nav 首页 (active)');
    out.navTheater = grab(byText('小剧场'), 'nav 小剧场');
    out.navHistory = grab(byText('历史'), 'nav 历史');
    out.navSettings = grab(byText('设置'), 'nav 设置');
    // sidebar
    out.sidebarLabel = grab(byText('工具分类'), 'sidebar label 工具分类');
    out.catAll = grab(byTextHas('全部', 'button') || byText('全部'), 'cat 全部 (active)');
    out.catChar = grab(byTextHas('角色设定', 'button'), 'cat 角色设定');
    out.importBtn = grab(byTextHas('导入插件', 'button'), 'import button');
    // main
    out.mainTitle = grab(byText('探索工具'), 'main title 探索工具');
    out.mainSub = grab(byText('选择一个功能模块开始您的创作之旅'), 'main subtitle');
    out.grid = grab(document.querySelector('main') || (out.mainSub && out.mainSub.el), 'main');
    return out;
  })()`);
  writeFileSync(resolve(ROOT, 'key-styles.json'), JSON.stringify(keyStyles, null, 2));

  // 4) 卡片：全部卡片的文本 + 结构 + 样式
  const cards = await page.eval(`(() => {
    const PROPS = ['display','flexDirection','alignItems','justifyContent','gap','gridTemplateColumns','width','height','padding','backgroundColor','color','fontSize','fontWeight','lineHeight','letterSpacing','borderWidth','borderColor','borderRadius','boxShadow','transition','cursor'];
    const grab = (el) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); const o = { tag: el.tagName.toLowerCase(), class: typeof el.className === 'string' ? el.className : '', rect: {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)} }; for (const p of PROPS) o[p] = cs[p]; return o; };
    // 卡片 = 含「角色设定」类标签且可点击的容器：用网格子元素定位
    const grid = [...document.querySelectorAll('div')].find(d => {
      const cs = getComputedStyle(d);
      return cs.display === 'grid' && d.children.length >= 8;
    });
    if (!grid) return { error: 'no grid found' };
    const out = { grid: grab(grid), gridComputed: { columns: getComputedStyle(grid).gridTemplateColumns, gap: getComputedStyle(grid).gap }, cards: [] };
    for (const c of grid.children) {
      out.cards.push({
        wrapper: grab(c),
        tree: (() => { const l = []; const f = (el, d) => { const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); l.push('  '.repeat(d) + el.tagName.toLowerCase() + '.' + (typeof el.className==='string'?el.className.split(/\\s+/).join('.'):'') + ' ' + [r.width,r.height].map(Math.round).join('x') + ' fs:' + cs.fontSize + ' fw:' + cs.fontWeight + ' c:' + cs.color + ' bg:' + cs.backgroundColor + ' br:' + cs.borderRadius + ' pad:' + cs.padding + ' | ' + (el.innerText||'').replace(/\\s+/g,' ').trim().slice(0,100)); if (d < 6) [...el.children].forEach(x => f(x, d+1)); }; f(c, 0); return l.join('\\n'); })(),
      });
    }
    return out;
  })()`);
  writeFileSync(resolve(ROOT, 'cards.json'), JSON.stringify(cards, null, 2));

  // 5) 全局资产
  const assets = await page.eval(`(() => ({
    fonts: [...document.fonts].map(f => ({ family: f.family, weight: f.weight, style: f.style, status: f.status })),
    fontLinks: [...document.querySelectorAll('link[rel*=stylesheet],link[rel=preload]')].map(l => l.href),
    images: [...document.querySelectorAll('img')].map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, cls: i.className, alt: i.alt })),
    svgs: [...document.querySelectorAll('svg')].length,
    svgList: [...document.querySelectorAll('svg')].map(s => ({ cls: (typeof s.className === 'string' ? s.className : s.className.baseVal), vb: s.getAttribute('viewBox'), parentText: (s.parentElement?.innerText||'').slice(0,30) })),
    favicon: [...document.querySelectorAll('link[rel*=icon]')].map(l => l.href),
  }))()`);
  writeFileSync(resolve(ROOT, 'assets.json'), JSON.stringify(assets, null, 2));

  // 6) 卡片局部截图
  const gridBox = await page.eval(`(() => { const g = [...document.querySelectorAll('div')].find(d => getComputedStyle(d).display === 'grid' && d.children.length >= 8); if (!g) return null; const r = g.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; })()`);
  if (gridBox) {
    await page.shot(resolve(SHOTS, 'section-grid.png'), { clip: { x: Math.max(0, gridBox.x - 20), y: Math.max(0, gridBox.y - 20), width: Math.min(1440, gridBox.w + 40), height: Math.min(2000, gridBox.h + 40) } });
  }
  await page.shot(resolve(SHOTS, 'section-header.png'), { clip: { x: 0, y: 0, width: 1440, height: 70 } });
  await page.shot(resolve(SHOTS, 'section-sidebar.png'), { clip: { x: 0, y: 70, width: 320, height: 560 } });

  log('styles 提取完成');
  log('themeClasses:', JSON.stringify(vars.themeClasses));
  log('grid:', JSON.stringify(cards.gridComputed));
  log('cards:', cards.cards?.length);
  log('svg count:', assets.svgs);
}
