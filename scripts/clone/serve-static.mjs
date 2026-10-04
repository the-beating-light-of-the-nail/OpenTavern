#!/usr/bin/env node
/**
 * 零依赖静态服务器：把 `nuxt build` 产物（.vercel/output/static）当站点跑起来，
 * 用于对「预渲染 HTML + 构建后 CSS」做最终浏览器验收。
 * 用法: node scripts/clone/serve-static.mjs [port] [root]
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const port = Number(process.argv[2] || 3200);
const root = process.argv[3] || '.vercel/output/static';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2',
};

async function resolveFile(urlPath) {
  const clean = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  const candidates = [
    join(root, clean),
    join(root, clean, 'index.html'),
    join(root, `${clean}.html`),
  ];
  for (const c of candidates) {
    try {
      const s = await stat(c);
      if (s.isFile()) return c;
    } catch {}
  }
  return null;
}

createServer(async (req, res) => {
  const file = await resolveFile(req.url || '/');
  if (!file) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
    return;
  }
  const body = await readFile(file);
  res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
  res.end(body);
}).listen(port, () => {
  console.log(`[static] http://localhost:${port}/  root=${root}`);
});
