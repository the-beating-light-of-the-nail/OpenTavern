/**
 * Phase 5c：中日文（较长标签）布局验证截图
 * 用法: node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/07-qa-cjk.mjs
 */
import { resolve } from 'node:path';

const BASE = process.env.QA_BASE || 'http://localhost:3100';
const SHOTS = resolve('docs/design-references/laopobao-tools/home');

export default async function ({ page, log }) {
  await page.viewport(1440, 900);
  await page.send('Network.enable');

  for (const [loc, file] of [['zh-CN', 'qa-local-zh-1440-top.png'], ['ja', 'qa-local-ja-1440-top.png']]) {
    // i18n detectBrowserLanguage 以 cookie 优先（cookieKey: rolechat_locale）+ alwaysRedirect:true，
    // 用 CDP Network.setCookie 显式种 cookie，否则任何语言路由都会被拽回首次检测到的 en
    const res = await page.send('Network.setCookie', {
      name: 'rolechat_locale', value: loc,
      domain: 'localhost', path: '/', httpOnly: false, secure: false,
    });
    log('setCookie', loc, JSON.stringify(res));
    await page.goto(`${BASE}/${loc}/`, { waitMs: 2500, waitFor: `document.querySelector('h1')` });

    const m = await page.eval(`(() => {
      const rail = document.querySelector('.wb-rail');
      const railScrollW = rail ? rail.scrollWidth : null;
      const cards = document.querySelectorAll('.wb-card');
      const clipped = [...document.querySelectorAll('.wb-cat-label')].filter(e => e.scrollWidth > e.clientWidth + 1).map(e => e.innerText);
      return {
        url: location.href,
        h1: document.querySelector('h1')?.innerText,
        sub: document.querySelector('h1 + p')?.innerText.slice(0, 60),
        railScrollW, railClientW: rail ? rail.clientWidth : null,
        clippedCatLabels: clipped,
        cardCount: cards.length,
        cardRows: new Set([...cards].map(c => Math.round(c.getBoundingClientRect().top))).size,
        overflowX: document.body.scrollWidth > window.innerWidth + 1,
        firstCardTitle: cards[0]?.querySelector('h3')?.innerText,
        firstCardTag: cards[0]?.querySelector('.wb-card-tag')?.innerText,
      };
    })()`);
    log(loc, JSON.stringify(m));
    await page.shot(resolve(SHOTS, file), { scrollTo: 0 });
  }
}
