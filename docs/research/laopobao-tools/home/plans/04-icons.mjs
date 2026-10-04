/**
 * Phase 1d 资产提取：抽取页面内全部 lucide 图标的原始 SVG 源码
 * 用法: node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/04-icons.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = 'https://tools.laopobao.online/';
const ROOT = resolve('docs/research/laopobao-tools/home');

export default async function ({ page, log }) {
  mkdirSync(ROOT, { recursive: true });
  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 4000, waitFor: `document.querySelectorAll('svg').length > 10` });

  const icons = await page.eval(`(() => {
    const out = {};
    for (const svg of document.querySelectorAll('svg')) {
      const cls = typeof svg.className === 'string' ? svg.className : (svg.className.baseVal || '');
      const m = cls.match(/lucide-([a-z0-9-]+)/);
      const name = m ? m[1] : (svg.parentElement?.innerText?.trim().slice(0, 20) || 'unknown');
      if (out[name]) continue;
      const clone = svg.cloneNode(true);
      clone.removeAttribute('class');
      clone.removeAttribute('width');
      clone.removeAttribute('height');
      clone.setAttribute('width', '24');
      clone.setAttribute('height', '24');
      out[name] = { class: cls, html: clone.outerHTML };
    }
    return out;
  })()`);
  writeFileSync(resolve(ROOT, 'icons.json'), JSON.stringify(icons, null, 2));
  log('图标提取:', Object.keys(icons).join(', '));
}
