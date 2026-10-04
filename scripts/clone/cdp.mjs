#!/usr/bin/env node
/**
 * 极简 Chrome DevTools Protocol 驱动器（无第三方浏览器自动化依赖）
 *
 * 用法：
 *   node scripts/clone/cdp.mjs <plan.mjs> [--port 9333] [--keep-open]
 *
 * plan.mjs 默认导出一个 async 函数，签名：
 *   export default async function ({ page, outDir, argv, log }) { ... }
 *
 * page API：
 *   await page.viewport(width, height, { mobile, scale })
 *   await page.goto(url, { waitMs = 2500, waitFor })   // waitFor: JS 表达式字符串，轮询至真值
 *   await page.eval(fnOrString, { args })              // 返回可 JSON 序列化的值
 *   await page.wait(ms)
 *   await page.scrollSweep({ step = 600, delay = 120, max = 40000 })  // 触底滚动，唤醒懒加载
 *   await page.shot(path, { full, clip, scrollTo, format })
 *   await page.click(selector)
 *   await page.hover(selector)
 *   await page.send(method, params)                    // 原始 CDP 调用
 *
 * 依赖：本机 Chrome + 仓库内已存在的 ws 包。
 */
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, resolve, isAbsolute } from 'node:path';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const WebSocket = require('ws');

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);

function findChrome() {
  for (const p of CHROME_CANDIDATES) if (existsSync(p)) return p;
  throw new Error('未找到 Chrome/Edge，可设 CHROME_PATH 指定');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl, { perMessageDeflate: false, maxPayload: 512 * 1024 * 1024 });
    this.id = 0;
    this.pending = new Map();
    this.listeners = new Map();
    this.ready = new Promise((res, rej) => {
      this.ws.once('open', res);
      this.ws.once('error', rej);
    });
    this.ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: rs, reject: rj } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) rj(new Error(`${msg.error.message} (${JSON.stringify(msg.error.data ?? '')})`));
        else rs(msg.result);
      } else if (msg.method) {
        const ls = this.listeners.get(msg.method);
        if (ls) for (const fn of ls) fn(msg.params);
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify(payload));
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error(`CDP 超时: ${method}`));
        }
      }, 60_000);
    });
  }

  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }

  once(method, timeoutMs = 30_000) {
    return new Promise((resolve) => {
      const fn = (params) => {
        const arr = this.listeners.get(method);
        arr.splice(arr.indexOf(fn), 1);
        resolve(params);
      };
      this.on(method, fn);
      setTimeout(() => resolve(null), timeoutMs);
    });
  }

  close() {
    try { this.ws.close(); } catch {}
  }
}

async function fetchJson(url, tries = 80) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.json();
    } catch {}
    await sleep(250);
  }
  throw new Error(`无法连接 CDP: ${url}`);
}

function makePage(cdp, sessionId) {
  const send = (m, p) => cdp.send(m, p, sessionId);
  const page = {
    sessionId,
    send,
    async viewport(width, height, { mobile = false, scale = 1 } = {}) {
      await send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: scale, mobile,
      });
    },
    async wait(ms) { await sleep(ms); },
    async goto(url, { waitMs = 2500, waitFor = null, timeout = 45_000 } = {}) {
      const loaded = cdp.once('Page.loadEventFired', timeout);
      await send('Page.navigate', { url });
      await loaded;
      if (waitFor) {
        const deadline = Date.now() + timeout;
        while (Date.now() < deadline) {
          const ok = await page.eval(waitFor).catch(() => false);
          if (ok) break;
          await sleep(300);
        }
      }
      await sleep(waitMs);
    },
    async eval(fnOrString, { args = [] } = {}) {
      const expr = typeof fnOrString === 'function'
        ? `(${fnOrString.toString()})(${args.map((a) => JSON.stringify(a)).join(',')})`
        : `(${fnOrString})`;
      const r = await send('Runtime.evaluate', {
        expression: expr, returnByValue: true, awaitPromise: true,
        userGesture: true, allowUnsafeEvalBlockedByCSP: true,
      });
      if (r.exceptionDetails) {
        throw new Error('页面内异常: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
      }
      return r.result?.value;
    },
    async scrollSweep({ step = 600, delay = 120, max = 60_000 } = {}) {
      await page.eval(`(async () => {
        const H = () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const total = Math.min(H(), ${max});
        for (let y = 0; y < total; y += ${step}) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, ${delay}));
        }
        window.scrollTo(0, 0);
        await new Promise(r => setTimeout(r, 300));
      })()`);
    },
    async shot(path, { full = false, clip = null, scrollTo = null, format = 'png' } = {}) {
      const abs = resolve(path);
      mkdirSync(dirname(abs), { recursive: true });
      if (scrollTo != null) {
        await page.eval(`window.scrollTo(0, ${scrollTo})`);
        await sleep(500);
      }
      const params = { format };
      if (format === 'jpeg') params.quality = 90;
      if (clip) params.clip = { ...clip, scale: 1 };
      if (full) params.captureBeyondViewport = true;
      const { data } = await send('Page.captureScreenshot', params);
      writeFileSync(abs, Buffer.from(data, 'base64'));
      return abs;
    },
    async click(selector) {
      return page.eval(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        el.scrollIntoView({ block: 'center' });
        el.click();
        return true;
      })()`);
    },
    async hover(selector) {
      return page.eval(`(() => {
        const el = document.querySelector(${JSON.stringify(selector)});
        if (!el) return false;
        const r = el.getBoundingClientRect();
        for (const type of ['pointerover','pointerenter','mouseover','mouseenter','mousemove']) {
          el.dispatchEvent(new MouseEvent(type, {
            bubbles: type.includes('over') || type === 'mousemove' || type === 'mouseover',
            clientX: r.left + r.width / 2, clientY: r.top + r.height / 2,
          }));
        }
        return true;
      })()`);
    },
    async metrics() {
      return send('Page.getLayoutMetrics');
    },
  };
  return page;
}

async function main() {
  const argv = process.argv.slice(2);
  const planPath = argv.find((a) => !a.startsWith('--'));
  if (!planPath) {
    console.error('用法: node scripts/clone/cdp.mjs <plan.mjs> [--port 9333] [--keep-open]');
    process.exit(1);
  }
  const flag = (name, def) => {
    const i = argv.indexOf(`--${name}`);
    return i >= 0 ? argv[i + 1] : def;
  };
  const port = Number(flag('port', 9333));
  const keepOpen = argv.includes('--keep-open');

  const chrome = findChrome();
  const userDataDir = resolve(tmpdir(), `dsh-cdp-${port}`);
  rmSync(userDataDir, { recursive: true, force: true });

  const proc = spawn(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--force-device-scale-factor=1',
    '--hide-scrollbars',
    '--mute-audio',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,900',
    'about:blank',
  ], { stdio: 'ignore', detached: false });

  let cdp;
  try {
    const version = await fetchJson(`http://127.0.0.1:${port}/json/version`);
    cdp = new CDP(version.webSocketDebuggerUrl);
    await cdp.ready;

    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride',
      { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);

    const page = makePage(cdp, sessionId);
    const planUrl = pathToFileURL(isAbsolute(planPath) ? planPath : resolve(process.cwd(), planPath)).href;
    const mod = await import(planUrl);
    const outDir = process.env.CLONE_OUT || resolve(process.cwd(), 'docs');
    const log = (...a) => console.log('[cdp]', ...a);
    process.on('exit', () => { try { cdp.close(); } catch {} });

    await mod.default({ page, argv, log, outDir });

    console.log('[cdp] 计划执行完成');
  } catch (err) {
    console.error('[cdp] 失败:', err?.stack || err);
    process.exitCode = 1;
  } finally {
    cdp?.close();
    if (!keepOpen) {
      try { proc.kill(); } catch {}
      await sleep(300);
      rmSync(userDataDir, { recursive: true, force: true });
    }
  }
}

main();
