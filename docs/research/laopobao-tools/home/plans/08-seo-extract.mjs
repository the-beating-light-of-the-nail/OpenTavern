/**
 * SEO 基线对比：抽取页面可索引内容（H 标签 / 正文 / 内链 / FAQ / meta）
 * 用法: $env:SEO_URL="..."; $env:SEO_NAME="old"; node scripts/clone/cdp.mjs docs/research/laopobao-tools/home/plans/08-seo-extract.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const URL = process.env.SEO_URL;
const NAME = process.env.SEO_NAME || 'page';
const ROOT = resolve('docs/research/laopobao-tools/home/seo');

export default async function ({ page, log }) {
  if (!URL) throw new Error('需要 SEO_URL');
  mkdirSync(ROOT, { recursive: true });

  await page.viewport(1440, 900);
  await page.goto(URL, { waitMs: 4000, waitFor: `document.querySelector('h1')` });
  await page.scrollSweep({ step: 700, delay: 120 });

  const data = await page.eval(`(() => {
    const txt = (el) => (el?.innerText || '').replace(/\\s+/g, ' ').trim();
    const heads = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => ({ tag: h.tagName, text: txt(h) }));
    // 可见正文（排除脚本/样式/nav/footer 重复噪音）
    const main = document.querySelector('main') || document.body;
    const bodyText = txt(main);
    const links = [...document.querySelectorAll('a[href]')].map(a => ({
      href: a.getAttribute('href'), text: txt(a).slice(0, 40),
    }));
    const internal = links.filter(l => l.href && (l.href.startsWith('/') || l.href.includes(location.host)));
    const faq = [...document.querySelectorAll('details')].map(d => ({
      q: txt(d.querySelector('summary')), a: txt(d.querySelector('p')),
    }));
    const imgs = [...document.querySelectorAll('img')].map(i => ({ src: i.getAttribute('src'), alt: i.alt }));
    return {
      url: location.href,
      title: document.title,
      metaDesc: document.querySelector('meta[name=description]')?.content,
      canonical: document.querySelector('link[rel=canonical]')?.href,
      h1: [...document.querySelectorAll('h1')].map(h => txt(h)),
      heads,
      bodyText,
      bodyChars: bodyText.length,
      wordCount: bodyText.split(/\\s+/).filter(Boolean).length,
      internalLinks: [...new Set(internal.map(l => l.href.split('#')[0]))],
      internalLinkTexts: [...new Set(internal.map(l => l.href.split('#')[0] + ' :: ' + l.text))],
      faqCount: faq.length,
      faq,
      imgCount: imgs.length,
      imgsWithAlt: imgs.filter(i => i.alt).length,
      h1Count: document.querySelectorAll('h1').length,
      h2Count: document.querySelectorAll('h2').length,
      h3Count: document.querySelectorAll('h3').length,
      ldjson: [...document.querySelectorAll('script[type="application/ld+json"]')].map(s => s.textContent.slice(0, 200)),
    };
  })()`);

  writeFileSync(resolve(ROOT, `${NAME}.json`), JSON.stringify(data, null, 2));
  log(`[${NAME}] ${data.url}`);
  log('  title:', data.title);
  log('  h1:', JSON.stringify(data.h1), '| h1Count:', data.h1Count);
  log('  heads:', data.heads.length, '| h2:', data.h2Count, '| h3:', data.h3Count);
  log('  bodyChars:', data.bodyChars, '| wordCount:', data.wordCount);
  log('  internalLinks:', data.internalLinks.length, '| faq:', data.faqCount, '| imgs:', data.imgCount);
  log('  H2/H3 列表:');
  for (const h of data.heads.filter(h => h.tag !== 'H1')) log('    ', h.tag, h.text.slice(0, 70));
}
