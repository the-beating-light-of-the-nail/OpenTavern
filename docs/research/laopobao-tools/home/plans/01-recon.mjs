/**
 * Phase 1 侦察：目标站首页整体结构与全局样式
 * 用法: node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/01-recon.mjs
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
  await page.goto(URL, { waitMs: 4000, waitFor: `document.querySelector('#root') && document.querySelector('#root').children.length > 0` });
  await page.scrollSweep({ step: 700, delay: 150 });

  // 1) 原始 HTML（渲染后）
  const html = await page.eval(`document.documentElement.outerHTML`);
  writeFileSync(resolve(ROOT, 'rendered.html'), html);

  // 2) 页面级布局度量
  const layout = await page.eval(`(() => {
    const de = document.documentElement;
    const body = document.body;
    return {
      title: document.title,
      htmlClass: de.className,
      bodyClass: body.className,
      bodyBg: getComputedStyle(body).backgroundColor,
      htmlBg: getComputedStyle(de).backgroundColor,
      bodyFont: getComputedStyle(body).fontFamily,
      bodyColor: getComputedStyle(body).color,
      bodyFontSize: getComputedStyle(body).fontSize,
      scrollHeight: Math.max(body.scrollHeight, de.scrollHeight),
      innerWidth: window.innerWidth,
      rootChildren: [...document.querySelector('#root').children].map(el => ({ tag: el.tagName, cls: el.className, id: el.id })),
      scrollContainer: (() => {
        // 找真正滚动的容器
        const all = [de, body, ...document.querySelectorAll('div')];
        for (const el of all) {
          const cs = getComputedStyle(el);
          if ((cs.overflowY === 'auto' || cs.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 50) {
            return { tag: el.tagName, cls: el.className, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, overflowY: cs.overflowY };
          }
        }
        return null;
      })(),
      stylesheets: [...document.styleSheets].map(s => s.href || '(inline)'),
    };
  })()`);
  writeFileSync(resolve(ROOT, 'layout.json'), JSON.stringify(layout, null, 2));

  // 3) 顶层区块拓扑（body 下 2~3 层的直接子元素）
  const topology = await page.eval(`(() => {
    const out = [];
    const walk = (el, depth, path) => {
      if (depth > 2) return;
      const r = el.getBoundingClientRect();
      if (r.height < 8) return;
      const cs = getComputedStyle(el);
      out.push({
        depth, path,
        tag: el.tagName.toLowerCase(),
        cls: typeof el.className === 'string' ? el.className : '',
        top: Math.round(r.top + window.scrollY),
        height: Math.round(r.height),
        width: Math.round(r.width),
        bg: cs.backgroundColor,
        bgImage: cs.backgroundImage === 'none' ? null : cs.backgroundImage.slice(0, 120),
        position: cs.position,
        display: cs.display,
        padding: cs.padding,
        maxWidth: cs.maxWidth,
        text: (el.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 90),
        childCount: el.children.length,
      });
      [...el.children].forEach((c, i) => walk(c, depth + 1, path + '/' + i));
    };
    walk(document.body, 0, '');
    return out;
  })()`);
  writeFileSync(resolve(ROOT, 'topology.json'), JSON.stringify(topology, null, 2));

  // 4) 全局颜色统计
  const colors = await page.eval(`(() => {
    const count = {};
    const props = ['color','backgroundColor','borderTopColor'];
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      for (const p of props) {
        const v = cs[p];
        if (!v || v === 'rgba(0, 0, 0, 0)') continue;
        const k = p + '|' + v;
        count[k] = (count[k] || 0) + 1;
      }
    }
    return Object.entries(count).sort((a,b) => b[1]-a[1]).slice(0, 60);
  })()`);
  writeFileSync(resolve(ROOT, 'colors.json'), JSON.stringify(colors, null, 2));

  // 5) 全局字体统计
  const fonts = await page.eval(`(() => {
    const count = {};
    for (const el of document.querySelectorAll('*')) {
      if (!el.innerText || !el.innerText.trim()) continue;
      const cs = getComputedStyle(el);
      const k = cs.fontFamily + ' | ' + cs.fontSize + ' | ' + cs.fontWeight;
      count[k] = (count[k] || 0) + 1;
    }
    return Object.entries(count).sort((a,b) => b[1]-a[1]).slice(0, 50);
  })()`);
  writeFileSync(resolve(ROOT, 'fonts.json'), JSON.stringify(fonts, null, 2));

  // 6) 截图
  await page.shot(resolve(SHOTS, 'desktop-1440-full.png'), { full: true });
  await page.shot(resolve(SHOTS, 'desktop-1440-top.png'), { scrollTo: 0 });
  await page.viewport(390, 844, { mobile: true });
  await page.wait(1200);
  await page.scrollSweep({ step: 600, delay: 120 });
  await page.shot(resolve(SHOTS, 'mobile-390-full.png'), { full: true });

  log('recon 完成');
  log('title:', layout.title);
  log('scrollHeight:', layout.scrollHeight, 'rootChildren:', JSON.stringify(layout.rootChildren));
  log('scrollContainer:', JSON.stringify(layout.scrollContainer));
}
