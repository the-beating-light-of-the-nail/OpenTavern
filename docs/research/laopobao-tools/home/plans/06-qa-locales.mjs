/**
 * Phase 5b 补充 QA：多语言路由 + 横向溢出 + 分类计数一致性
 * 用法: node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/06-qa-locales.mjs
 */
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const BASE = process.env.QA_BASE || 'http://localhost:3100';
const ROOT = resolve('docs/research/laopobao-tools/home');
const SHOTS = resolve('docs/design-references/laopobao-tools/home');

const ROUTES = [
  ['/', 'en'],
  ['/zh-CN/', 'zh-CN'],
  ['/ja/', 'ja'],
  ['/ar/', 'ar'],
  ['/fr/', 'fr'],
];

export default async function ({ page, log }) {
  const out = {};
  await page.viewport(1440, 900);
  await page.send('Network.enable');

  for (const [r, loc] of ROUTES) {
    await page.send('Network.setExtraHTTPHeaders', { headers: { 'Accept-Language': `${loc},en;q=0.5` } });
    // i18n 的 detectBrowserLanguage 用 cookie 优先（cookieKey: rolechat_locale），
    // 不显式种 cookie 的话第二次访问会被 alwaysRedirect 拽回首次检测到的语言
    await page.send('Network.setCookie', { name: 'rolechat_locale', value: loc, url: BASE });
    await page.goto(BASE + r, { waitMs: 3000, waitFor: `document.querySelector('h1')` });
    const m = await page.eval(`(() => {
      const cats = [...document.querySelectorAll('.wb-rail .wb-cat, aside .wb-cat')].map(b => ({
        label: b.querySelector('.wb-cat-label')?.innerText, count: b.querySelector('.wb-cat-count')?.innerText,
      }));
      const pills = [...document.querySelectorAll('.wb-pill')].map(b => b.innerText);
      const cards = [...document.querySelectorAll('.wb-card')];
      return {
        lang: document.documentElement.lang,
        dir: document.documentElement.dir || getComputedStyle(document.documentElement).direction,
        h1: document.querySelector('h1')?.innerText,
        subLines: Math.round(document.querySelector('h1 + p').getBoundingClientRect().height / 20),
        subWidth: Math.round(document.querySelector('h1 + p').getBoundingClientRect().width),
        cats, pills, cards: cards.length,
        navLabels: [...document.querySelectorAll('.wb-nav-label')].map(s => s.innerText),
        cta: document.querySelector('.wb-cta-label')?.innerText,
        railCta: document.querySelector('.wb-rail-btn span:last-child')?.innerText,
        scrollW: document.body.scrollWidth, winW: window.innerWidth,
        overflowX: document.body.scrollWidth > window.innerWidth + 1,
        title: document.title,
      };
    })()`);
    out[r] = m;
    log(r, '->', m.h1, '| cards:', m.cards, '| subLines:', m.subLines, '| overflowX:', m.overflowX, '| lang:', m.lang);
  }

  // 阿拉伯语 RTL 截图
  await page.send('Network.setCookie', { name: 'rolechat_locale', value: 'ar', url: BASE });
  await page.send('Network.setExtraHTTPHeaders', { headers: { 'Accept-Language': 'ar-SA,ar;q=0.9' } });
  await page.goto(BASE + '/ar/', { waitMs: 2500, waitFor: `document.querySelector('h1')` });
  await page.shot(resolve(SHOTS, 'qa-local-ar-1440-top.png'), { scrollTo: 0 });

  // 分类计数一致性：点每个分类，验证卡片数 === 侧栏计数；全部 = 总卡片数
  await page.send('Network.setCookie', { name: 'rolechat_locale', value: 'en', url: BASE });
  await page.send('Network.setExtraHTTPHeaders', { headers: { 'Accept-Language': 'en-US,en;q=0.9' } });
  await page.goto(BASE + '/', { waitMs: 2500, waitFor: `document.querySelector('h1')` });
  const filterCheck = await page.eval(`(async () => {
    const btns = [...document.querySelectorAll('aside .wb-cat')];
    const res = [];
    for (let i = 0; i < btns.length; i++) {
      btns[i].click();
      await new Promise(r => setTimeout(r, 250));
      res.push({
        label: btns[i].querySelector('.wb-cat-label').innerText,
        declared: Number(btns[i].querySelector('.wb-cat-count').innerText),
        rendered: document.querySelectorAll('.wb-card').length,
      });
    }
    return res;
  })()`);
  out.filterCheck = filterCheck;
  log('分类计数一致性:', JSON.stringify(filterCheck));

  // 控制台错误收集
  const errs = await page.eval(`window.__vueErrors || []`);
  out.vueErrors = errs;

  writeFileSync(resolve(ROOT, 'qa-locales.json'), JSON.stringify(out, null, 2));
  log('多语言 QA 完成');
}
