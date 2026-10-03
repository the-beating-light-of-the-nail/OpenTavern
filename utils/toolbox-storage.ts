/**
 * 工具箱持久化：OPFS 主后端 + localStorage 强快照兜底。
 *
 * 独立于 /app 的 opentavern-data（useStorage.ts）——两份数据契约互不污染：
 * 工具箱存的是卡库/世界书库/预设库（含头像 dataURL，体积可能很大），键与文件名均不同。
 */

import type { ToolboxData } from '~/stores/toolbox';

const LS_KEY = 'opentavern-toolbox-v1';
const OPFS_FILE = 'opentavern-toolbox.json';

function lsRead(): ToolboxData | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

function lsWrite(data: ToolboxData): boolean {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return true;
  } catch {
    // LS 配额溢出（头像过大）：主后端是 OPFS 时可接受
    return false;
  }
}

async function opfsAvailable(): Promise<boolean> {
  try {
    return !!(navigator.storage && navigator.storage.getDirectory) && window.isSecureContext;
  } catch {
    return false;
  }
}

async function opfsRead(): Promise<ToolboxData | null> {
  try {
    const root = await navigator.storage.getDirectory();
    const fh = await root.getFileHandle(OPFS_FILE);
    const file = await fh.getFile();
    const text = await file.text();
    if (!text) return null;
    const data = JSON.parse(text);
    return data && typeof data === 'object' ? data : null;
  } catch {
    return null;
  }
}

async function opfsWrite(data: ToolboxData): Promise<void> {
  const root = await navigator.storage.getDirectory();
  const fh = await root.getFileHandle(OPFS_FILE, { create: true });
  const writable = await (fh as any).createWritable();
  await writable.write(JSON.stringify(data));
  await writable.close();
}

/** pagehide 兜底：同步写 LS 快照（防止防抖窗口内刷新丢数据） */
export function flushToolboxToLs(data: ToolboxData): void {
  lsWrite(data);
}

/** 取最新快照（按 savedAt）；两边都没有则 null */
export async function loadToolbox(): Promise<ToolboxData | null> {
  const lsData = lsRead();
  if (await opfsAvailable()) {
    const opfsData = await opfsRead();
    const a = opfsData?.savedAt || 0;
    const b = lsData?.savedAt || 0;
    if (a > 0 || b > 0) return a >= b ? opfsData : lsData;
  }
  return lsData;
}

/** OPFS 主写 + LS 兜底镜像；OPFS 失败不影响 LS */
export async function saveToolbox(data: ToolboxData): Promise<void> {
  lsWrite(data);
  if (await opfsAvailable()) {
    try {
      await opfsWrite(data);
    } catch (e) {
      console.warn('[toolbox] OPFS save failed, LS snapshot remains:', e);
    }
  }
}
