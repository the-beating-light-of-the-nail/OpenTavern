import type { AppData, StorageBackend, StorageCandidate, StorageInfo } from '~/types/state';
import {
  STORAGE_KEY,
  STORAGE_CLEAR_KEY,
  OPFS_DATA_FILE,
  LEGACY_IDB_SNAPSHOT_DB,
  LEGACY_IDB_SNAPSHOT_STORE,
  LEGACY_IDB_SNAPSHOT_KEY,
  LEGACY_IDB_OLD_DB,
} from '~/utils/storageKeys';
import { createEmptyData } from '~/utils/defaults';

/**
 * 存储引擎 —— 忠实保留原版数据契约：
 *  - OPFS 文件 `opentavern-data.json` 为主后端（大容量）
 *  - localStorage 键 `opentavern-data-v1` 为强快照兜底
 *  - legacy IndexedDB（OpenTavernSnapshotDB / OpenTavernDB）仅用于恢复扫描（只读迁移）
 *  - 多源新鲜度按 `lastSaved` 取最新有效快照；清空标记 `opentavern-cleared-at` 抑制旧数据回灌
 *
 * 序列化字段与原版 persistState() 构造的 dataToSave 严格一致 → 现有用户数据无缝加载。
 */

type AnyObject = Record<string, any>;

const hasUserData = (d: any): boolean =>
  !!d && (
    Object.keys(d.conversations || {}).length > 0 ||
    Object.keys(d.characters || {}).length > 0 ||
    Object.keys(d.worldBooks || {}).length > 0
  );

const isValidSnapshot = (d: any): boolean =>
  !!d && (hasUserData(d) || (d.settings && Object.keys(d.settings || {}).length > 0));

const snapshotTime = (d: any): number => {
  const n = d && d.lastSaved ? Number(d.lastSaved) : 0;
  return Number.isFinite(n) ? n : 0;
};

function cloneForPersist<T>(d: T): T {
  return d ? JSON.parse(JSON.stringify(d)) : d;
}

/* ----------------------------- OPFS 后端 ----------------------------- */
const opfs = {
  _root: null as FileSystemDirectoryHandle | null,
  _writeLock: Promise.resolve() as Promise<void>,
  _warnedUnsupported: false,
  _probeResult: null as { ok: boolean; reason: string | null } | null,
  _probePromise: null as Promise<{ ok: boolean; reason: string | null }> | null,

  _isAvailableEnv(): boolean {
    if (typeof location !== 'undefined' && location.protocol === 'file:') return false;
    // @ts-ignore secureContext
    if (typeof window !== 'undefined' && !window.isSecureContext) return false;
    return !!(navigator.storage && navigator.storage.getDirectory);
  },

  async _getRoot(): Promise<FileSystemDirectoryHandle> {
    if (this._root) return this._root;
    if (location.protocol === 'file:') {
      throw new Error('OPFS blocked on file:// protocol (open via http://localhost or deploy to HTTPS)');
    }
    // @ts-ignore
    if (!window.isSecureContext) throw new Error('OPFS requires secure context (HTTPS or localhost)');
    if (!navigator.storage || !navigator.storage.getDirectory) {
      throw new Error('OPFS not supported in this browser');
    }
    this._root = await navigator.storage.getDirectory();
    return this._root;
  },

  async probeWritable(): Promise<{ ok: boolean; reason: string | null }> {
    if (this._probeResult) return this._probeResult;
    if (this._probePromise) return this._probePromise;
    this._probePromise = (async () => {
      const probeName = '__opentavern-opfs-probe__.json';
      const payload = JSON.stringify({ ok: true, t: Date.now() });
      try {
        const root = await this._getRoot();
        const fh = await root.getFileHandle(probeName, { create: true });
        const writable = await (fh as any).createWritable();
        await writable.write(payload);
        await writable.close();
        const file = await fh.getFile();
        const text = await file.text();
        if (text !== payload) throw new Error('OPFS probe verification failed');
        try { await root.removeEntry(probeName); } catch (_) { /* noop */ }
        this._probeResult = { ok: true, reason: null };
        return this._probeResult;
      } catch (e: any) {
        this._probeResult = { ok: false, reason: e && e.message ? e.message : String(e) };
        return this._probeResult;
      } finally {
        this._probePromise = null;
      }
    })();
    return this._probePromise;
  },

  async loadAll(): Promise<AppData | null> {
    try {
      const root = await this._getRoot();
      let fh: FileSystemFileHandle;
      try {
        fh = await root.getFileHandle(OPFS_DATA_FILE);
      } catch {
        return null;
      }
      const file = await fh.getFile();
      const text = await file.text();
      if (!text) return null;
      const data = JSON.parse(text);
      if (!data.lastSaved) data.lastSaved = Date.now();
      return data as AppData;
    } catch (e: any) {
      if (!(e && (e.name === 'SecurityError' || /file:|unsafe|OPFS (blocked|unavailable)/i.test(e.message || '')))) {
        console.error('[OPFS] loadAll failed:', e);
      }
      return null;
    }
  },

  /** 写锁串行化所有写入，防止并发 createWritable 冲突 */
  saveAll(data: AppData): Promise<void> {
    const doWrite = () => this._doSaveAll(data);
    const prev = this._writeLock;
    this._writeLock = prev.then(doWrite, doWrite);
    return this._writeLock;
  },

  async _doSaveAll(data: AppData): Promise<void> {
    const root = await this._getRoot();
    const fh = await root.getFileHandle(OPFS_DATA_FILE, { create: true });
    const writable = await (fh as any).createWritable();
    await writable.write(JSON.stringify(data));
    await writable.close();
  },

  async getStorageInfo(): Promise<{ used: number; quota: number | null; originUsed: number }> {
    try {
      const est = (navigator.storage && navigator.storage.estimate)
        ? await navigator.storage.estimate()
        : { usage: 0, quota: null };
      let ourSize = 0;
      try {
        const root = await this._getRoot();
        const fh = await root.getFileHandle(OPFS_DATA_FILE);
        const f = await fh.getFile();
        ourSize = f.size || 0;
      } catch { /* 文件不存在 */ }
      return { used: ourSize, quota: est.quota ?? null, originUsed: est.usage ?? 0 };
    } catch {
      return { used: 0, quota: null, originUsed: 0 };
    }
  },

  async clear(): Promise<void> {
    try {
      const root = await navigator.storage.getDirectory();
      try {
        await root.removeEntry(OPFS_DATA_FILE);
      } catch (removeErr: any) {
        if (removeErr && removeErr.name !== 'NotFoundError') {
          // 覆盖为空数据，确保 load 拿不到旧用户数据
          try {
            const fh = await root.getFileHandle(OPFS_DATA_FILE, { create: true });
            const w = await (fh as any).createWritable();
            await w.write(JSON.stringify(createEmptyData()));
            await w.close();
          } catch { /* noop */ }
        }
      }
      this._root = null;
    } catch { /* noop */ }
  },
};

/* --------------------------- localStorage 快照 --------------------------- */
const ls = {
  read(): AppData | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return isValidSnapshot(data) ? data : null;
    } catch {
      return null;
    }
  },
  write(data: AppData): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch {
      return false;
    }
  },
  remove() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }
  },
};

/* ------------------------ legacy IndexedDB 只读 ------------------------ */
function idbOpen(dbName: string, storeName?: string): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null);
    try {
      const req = indexedDB.open(dbName);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
      req.onupgradeneeded = () => {
        // 旧库可能不存在期望 store；不主动创建
        try { req.transaction?.abort(); } catch { /* noop */ }
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

function idbReadAll(db: IDBDatabase, storeName: string): Promise<AnyObject[] | null> {
  return new Promise((resolve) => {
    try {
      if (!db.objectStoreNames.contains(storeName)) return resolve(null);
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve((req.result as AnyObject[]) || null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** 从 legacy IDB 快照后端恢复数据（OpenTavernSnapshotDB） */
async function readLegacyIDBSnapshot(): Promise<AppData | null> {
  try {
    const db = await idbOpen(LEGACY_IDB_SNAPSHOT_DB);
    if (!db) return null;
    const rows = await idbReadAll(db, LEGACY_IDB_SNAPSHOT_STORE);
    try { db.close(); } catch { /* noop */ }
    if (!rows || !rows.length) return null;
    // store 内以 'main' 为键存整体快照；兜底取最后一行
    const main = rows.find((r) => r && (r.id === LEGACY_IDB_SNAPSHOT_KEY || r.key === LEGACY_IDB_SNAPSHOT_KEY)) as any;
    const candidate = main?.data || main || rows[rows.length - 1];
    return isValidSnapshot(candidate) ? candidate as AppData : null;
  } catch {
    return null;
  }
}

/** 从更早期的 OpenTavernDB 恢复（键结构未知，尽力扫描） */
async function readLegacyIDBOld(): Promise<AppData | null> {
  try {
    const db = await idbOpen(LEGACY_IDB_OLD_DB);
    if (!db) return null;
    let best: AppData | null = null;
    for (const storeName of Array.from(db.objectStoreNames)) {
      const rows = await idbReadAll(db, storeName);
      for (const row of rows || []) {
        const candidate = (row as any)?.data || row;
        if (isValidSnapshot(candidate) && snapshotTime(candidate) > snapshotTime(best)) {
          best = candidate as AppData;
        }
      }
    }
    try { db.close(); } catch { /* noop */ }
    return best;
  } catch {
    return null;
  }
}

/* ------------------------------ 编排层 ------------------------------ */
const service = {
  _activeBackend: 'localStorage' as StorageBackend,
  _lastSaveSnapshot: null as AppData | null,
  _pageHideInstalled: false,

  getBackend(): StorageBackend {
    return this._activeBackend;
  },

  _clearMarkerTime(): number {
    try {
      const n = Number(localStorage.getItem(STORAGE_CLEAR_KEY) || 0);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  },

  _pickNewest(candidates: StorageCandidate[]): StorageCandidate | null {
    const valid = candidates.filter((c) => c && isValidSnapshot(c.data));
    const withUserData = valid.filter((c) => hasUserData(c.data));
    const pool = withUserData.length ? withUserData : valid;
    return pool.sort((a, b) => snapshotTime(b.data) - snapshotTime(a.data))[0] || null;
  },

  /**
   * 加载流程（与原版语义一致）：
   *  1. 若清空标记晚于某快照的 lastSaved，则该快照视为已被清除，跳过。
   *  2. 在 OPFS / LS / legacy IDB 中取最新有效快照。
   *  3. 优先 OPFS；选定后把数据同步镜像到其余可用后端。
   */
  async load(): Promise<{ data: AppData | null; backend: StorageBackend }> {
    const clearMarker = this._clearMarkerTime();

    const candidates: StorageCandidate[] = [];

    // OPFS（主）
    if (opfs._isAvailableEnv()) {
      const probe = await opfs.probeWritable();
      if (probe.ok) {
        const d = await opfs.loadAll();
        if (d && (!clearMarker || snapshotTime(d) > clearMarker)) {
          candidates.push({ backend: 'opfs', data: d });
        }
      }
    }

    // localStorage 强快照
    const lsData = ls.read();
    if (lsData && (!clearMarker || snapshotTime(lsData) > clearMarker)) {
      candidates.push({ backend: 'localStorage', data: lsData });
    }

    // legacy IDB（恢复扫描）
    const idbSnap = await readLegacyIDBSnapshot();
    if (idbSnap && (!clearMarker || snapshotTime(idbSnap) > clearMarker)) {
      candidates.push({ backend: 'idb', data: idbSnap });
    }
    const idbOld = await readLegacyIDBOld();
    if (idbOld && (!clearMarker || snapshotTime(idbOld) > clearMarker)) {
      candidates.push({ backend: 'legacy-idb', data: idbOld });
    }

    const picked = this._pickNewest(candidates);
    if (!picked) {
      this._activeBackend = opfs._isAvailableEnv() ? 'opfs' : 'localStorage';
      return { data: null, backend: this._activeBackend };
    }

    this._activeBackend = picked.backend;
    // 镜像到其余后端，使后续 save 路径稳定
    await this._syncToBackends(picked.data, picked.backend);
    return { data: picked.data, backend: picked.backend };
  },

  async _syncToBackends(data: AppData, source: StorageBackend): Promise<void> {
    if (!isValidSnapshot(data)) return;
    if (source !== 'localStorage') ls.write(cloneForPersist(data));
    if (source !== 'opfs' && opfs._isAvailableEnv()) {
      const probe = await opfs.probeWritable();
      if (probe.ok) {
        try { await opfs.saveAll(cloneForPersist(data)); } catch (e) { console.warn('[Storage] OPFS sync failed:', e); }
      }
    }
  },

  /** 保存：OPFS 主 + LS 强快照；OPFS 不可用时落 LS */
  async saveAll(data: AppData): Promise<void> {
    this._lastSaveSnapshot = data;
    // 先同步写 LS 强快照（pagehide 兜底靠它）
    ls.write(data);
    if (opfs._isAvailableEnv()) {
      const probe = await opfs.probeWritable();
      if (probe.ok) {
        try {
          await opfs.saveAll(data);
          this._activeBackend = 'opfs';
          return;
        } catch (e) {
          console.warn('[Storage] OPFS save failed, LS snapshot remains:', e);
        }
      }
    }
    this._activeBackend = 'localStorage';
  },

  async getStorageInfo(): Promise<StorageInfo> {
    if (opfs._isAvailableEnv()) {
      const probe = await opfs.probeWritable();
      if (probe.ok) {
        const info = await opfs.getStorageInfo();
        return { backend: 'opfs', used: info.used, quota: info.quota, originUsed: info.originUsed };
      }
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      return { backend: 'localStorage', used: raw.length, quota: null };
    } catch {
      return { backend: 'localStorage', used: 0, quota: null };
    }
  },

  /** 清空所有后端（含 legacy IDB 删除） */
  async clearAll(): Promise<void> {
    const empty = createEmptyData();
    try { await opfs.clear(); } catch { /* noop */ }
    try {
      localStorage.setItem(STORAGE_CLEAR_KEY, String(empty.lastSaved));
      ls.write(empty);
    } catch { /* noop */ }
    // 删除 legacy IDB
    for (const dbName of [LEGACY_IDB_SNAPSHOT_DB, LEGACY_IDB_OLD_DB]) {
      try {
        await new Promise<void>((resolve) => {
          const req = indexedDB.deleteDatabase(dbName);
          req.onsuccess = req.onerror = req.onblocked = () => resolve();
        });
      } catch { /* noop */ }
    }
    this._lastSaveSnapshot = empty;
  },

  /** pagehide 时把最近一次 save 快照同步刷写到 LS，防止数据丢失 */
  installPageHideFlush(): void {
    if (this._pageHideInstalled || typeof window === 'undefined') return;
    this._pageHideInstalled = true;
    const flush = () => {
      const snap = this._lastSaveSnapshot;
      if (snap) ls.write(snap);
    };
    window.addEventListener('pagehide', flush);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush();
    });
  },
};

export function useStorage() {
  return {
    service,
    opfs,
    /** 用于恢复工具 UI 列出所有可恢复后端 */
    async scanAll(): Promise<StorageCandidate[]> {
      const out: StorageCandidate[] = [];
      const push = async (backend: StorageBackend, data: AppData | null) => {
        if (data && isValidSnapshot(data)) out.push({ backend, data });
      };
      if (opfs._isAvailableEnv()) await push('opfs', await opfs.loadAll());
      await push('localStorage', ls.read());
      await push('idb', await readLegacyIDBSnapshot());
      await push('legacy-idb', await readLegacyIDBOld());
      return out.sort((a, b) => snapshotTime(b.data) - snapshotTime(a.data));
    },
  };
}
