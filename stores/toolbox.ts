import { defineStore } from 'pinia';
import { makeId } from '~/utils/chat-helpers';
import type { CharacterCard, WorldInfoBook } from '~/utils/st/types';
import { saveToolbox, loadToolbox, flushToolboxToLs } from '~/utils/toolbox-storage';

/**
 * 工具箱库存储：角色卡 / 世界书 / 预设 三个库 + 防抖持久化。
 * 数据契约独立于 /app 的 opentavern-data（见 utils/toolbox-storage.ts）。
 *
 * raw 永远保存完整原始卡（含未知字段）；编辑直接改 raw 内的字段。
 */

export interface CardRecord {
  id: string;
  /** 完整卡 JSON（V2 形态 + 原始未知字段） */
  raw: CharacterCard;
  /** 头像 PNG dataURL（可空） */
  avatar?: string;
  favorite: boolean;
  created: number;
  updated: number;
}

export interface WorldbookRecord {
  id: string;
  name: string;
  data: WorldInfoBook;
  created: number;
  updated: number;
}

export interface PresetRecord {
  id: string;
  name: string;
  /** 完整 preset JSON（round-trip 保留所有字段） */
  raw: Record<string, any>;
  created: number;
  updated: number;
}

export interface ToolboxData {
  savedAt: number;
  cards: CardRecord[];
  worldbooks: WorldbookRecord[];
  presets: PresetRecord[];
}

export function emptyToolboxData(): ToolboxData {
  return { savedAt: 0, cards: [], worldbooks: [], presets: [] };
}

let _persistTimer: ReturnType<typeof setTimeout> | null = null;
// 最近一次待存快照：pagehide/隐藏时同步刷写 LS，防止快速刷新丢数据（对齐 useStorage 的兜底策略）
let _lastData: ToolboxData | null = null;
let _flushInstalled = false;

function installFlush() {
  if (_flushInstalled || typeof window === 'undefined') return;
  _flushInstalled = true;
  const flush = () => {
    if (_lastData) flushToolboxToLs(_lastData);
  };
  window.addEventListener('pagehide', flush);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

export const useToolboxStore = defineStore('toolbox', {
  state: () => ({
    cards: [] as CardRecord[],
    worldbooks: [] as WorldbookRecord[],
    presets: [] as PresetRecord[],
    loaded: false,
  }),

  getters: {
    cardById: (s) => (id: string) => s.cards.find((c) => c.id === id) || null,
    worldbookById: (s) => (id: string) => s.worldbooks.find((w) => w.id === id) || null,
    presetById: (s) => (id: string) => s.presets.find((p) => p.id === id) || null,
  },

  actions: {
    async load() {
      if (this.loaded) return;
      installFlush();
      const data = await loadToolbox();
      if (data) {
        this.cards = Array.isArray(data.cards) ? data.cards : [];
        this.worldbooks = Array.isArray(data.worldbooks) ? data.worldbooks : [];
        this.presets = Array.isArray(data.presets) ? data.presets : [];
      }
      this.loaded = true;
    },

    persist(immediate = false) {
      const snapshot = (): ToolboxData => JSON.parse(JSON.stringify({
        savedAt: Date.now(),
        cards: this.cards,
        worldbooks: this.worldbooks,
        presets: this.presets,
      }));
      const doSave = () => {
        _lastData = snapshot();
        return saveToolbox(_lastData).catch((e) => console.error('[toolbox] save error:', e));
      };
      if (immediate) {
        if (_persistTimer) { clearTimeout(_persistTimer); _persistTimer = null; }
        return doSave();
      }
      // 防抖窗口内先持有一份快照，供 pagehide 兜底刷写
      _lastData = snapshot();
      if (_persistTimer) clearTimeout(_persistTimer);
      _persistTimer = setTimeout(() => { _persistTimer = null; doSave(); }, 450);
    },

    /* ---------- 角色卡库 ---------- */

    addCard(raw: CharacterCard, avatar?: string): CardRecord {
      const now = Date.now();
      const rec: CardRecord = { id: makeId(), raw, avatar, favorite: false, created: now, updated: now };
      this.cards.unshift(rec);
      this.persist();
      return rec;
    },

    updateCard(id: string, raw?: CharacterCard, avatar?: string | null) {
      const rec = this.cards.find((c) => c.id === id);
      if (!rec) return;
      if (raw !== undefined) rec.raw = raw;
      if (avatar !== undefined) rec.avatar = avatar === null ? undefined : avatar;
      rec.updated = Date.now();
      this.persist();
    },

    duplicateCard(id: string): CardRecord | null {
      const src = this.cards.find((c) => c.id === id);
      if (!src) return null;
      const now = Date.now();
      const rec: CardRecord = {
        id: makeId(),
        raw: JSON.parse(JSON.stringify(src.raw)),
        avatar: src.avatar,
        favorite: false,
        created: now,
        updated: now,
      };
      const idx = this.cards.findIndex((c) => c.id === id);
      this.cards.splice(idx + 1, 0, rec);
      this.persist();
      return rec;
    },

    removeCard(id: string) {
      this.cards = this.cards.filter((c) => c.id !== id);
      this.persist();
    },

    toggleCardFavorite(id: string) {
      const rec = this.cards.find((c) => c.id === id);
      if (rec) {
        rec.favorite = !rec.favorite;
        this.persist();
      }
    },

    /* ---------- 世界书库 / 预设库（Phase 2/3 使用，先立契约） ---------- */

    addWorldbook(name: string, data: WorldInfoBook): WorldbookRecord {
      const now = Date.now();
      const rec: WorldbookRecord = { id: makeId(), name, data, created: now, updated: now };
      this.worldbooks.unshift(rec);
      this.persist();
      return rec;
    },

    updateWorldbook(id: string, patch: { name?: string; data?: WorldInfoBook }) {
      const rec = this.worldbooks.find((w) => w.id === id);
      if (!rec) return;
      if (patch.name !== undefined) rec.name = patch.name;
      if (patch.data !== undefined) rec.data = patch.data;
      rec.updated = Date.now();
      this.persist();
    },

    removeWorldbook(id: string) {
      this.worldbooks = this.worldbooks.filter((w) => w.id !== id);
      this.persist();
    },

    addPreset(name: string, raw: Record<string, any>): PresetRecord {
      const now = Date.now();
      const rec: PresetRecord = { id: makeId(), name, raw, created: now, updated: now };
      this.presets.unshift(rec);
      this.persist();
      return rec;
    },

    updatePreset(id: string, patch: { name?: string; raw?: Record<string, any> }) {
      const rec = this.presets.find((p) => p.id === id);
      if (!rec) return;
      if (patch.name !== undefined) rec.name = patch.name;
      if (patch.raw !== undefined) rec.raw = patch.raw;
      rec.updated = Date.now();
      this.persist();
    },

    removePreset(id: string) {
      this.presets = this.presets.filter((p) => p.id !== id);
      this.persist();
    },
  },
});
