/**
 * Worldbook Forge（世界书工作台）辅助函数：
 * - makeEntry：新条目默认值（补全 ST 世界书全部字段）
 * - sortedEntries / nextUid / estimateTokens：列表排序、uid 分配、token 估算
 * - worldbookFromAny / worldbookNameFrom：导入识别（detectWorldbookKind + toWorldInfo 包装）
 * - matchEntries：命中预览（常量恒命中 + 主/副关键词 + selectiveLogic 组合）
 * - mergeWorldbookI18n：wb_* 文案片段加载（fragment 独立于 locales/*.json，运行时合并进 vue-i18n）
 */

import type { WorldInfoBook, WorldInfoEntry } from './types';
import { WI_LOGIC, WI_POSITION } from './types';
import { characterBookToWorldInfo, detectWorldbookKind, toWorldInfo } from './convert';
import wbFragment from '~/i18n/fragments/worldbook-forge.json';

/* ------------------------------ i18n 片段加载 ------------------------------ */

type I18nLike = { mergeLocaleMessage?: (locale: string, message: Record<string, unknown>) => void };

/**
 * 把 worldbook-forge 的 wb_* 文案按语言合并进 vue-i18n 全局消息。
 * 幂等（重复合并同值无害）；SSR 与客户端都可安全调用。
 * 切换语言时 lazy loader 会 setLocaleMessage 整体替换该语言消息，
 * 因此调用方需在 locale 变化后重新合并（页面/组件里 watch locale）。
 */
export function mergeWorldbookI18n(i18n: unknown): void {
  const composer = i18n as I18nLike | null;
  if (!composer || typeof composer.mergeLocaleMessage !== 'function') return;
  const merge = composer.mergeLocaleMessage.bind(composer);
  for (const [locale, messages] of Object.entries(wbFragment)) {
    merge(locale, messages as Record<string, unknown>);
  }
}

/* ------------------------------ 条目默认值与排序 ------------------------------ */

/** 新条目默认值：补全 ST 世界书全部字段（uid 由调用方用 nextUid 分配） */
export function makeEntry(uid: number): WorldInfoEntry {
  return {
    uid,
    key: [],
    keysecondary: [],
    comment: '',
    content: '',
    constant: false,
    vectorized: false,
    selective: false,
    selectiveLogic: WI_LOGIC.AND_ANY,
    addMemo: true,
    order: 100,
    position: WI_POSITION.BEFORE_CHAR,
    disable: false,
    excludeRecursion: false,
    preventRecursion: false,
    delayUntilRecursion: null,
    probability: 100,
    useProbability: true,
    depth: 4,
    group: '',
    groupOverride: false,
    groupWeight: 100,
    scanDepth: null,
    caseSensitive: null,
    matchWholeWords: null,
    useGroupScoring: null,
    automationId: '',
    role: null,
    sticky: null,
    cooldown: null,
    delay: null,
    matchPersonaDescription: false,
    matchCharacterDescription: false,
    matchCharacterPersonality: false,
    matchCharacterDepthPrompt: false,
    matchScenario: false,
    matchCreatorNotes: false,
  };
}

/** 展示顺序：order 升序、uid 升序兜底（返回新数组，元素仍是 store 内对象引用） */
export function sortedEntries(book: WorldInfoBook | null | undefined): WorldInfoEntry[] {
  const raw = book?.entries ? Object.values(book.entries) : [];
  return raw
    .filter((e): e is WorldInfoEntry => !!e && typeof e === 'object')
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || (Number(a.uid) || 0) - (Number(b.uid) || 0));
}

/** 下一个可用 uid（现有最大 uid + 1，空书从 0 起） */
export function nextUid(book: WorldInfoBook | null | undefined): number {
  const ids = Object.values(book?.entries || {})
    .filter((e) => e && typeof e === 'object')
    .map((e) => Number(e.uid) || 0);
  return ids.length ? Math.max(...ids) + 1 : 0;
}

/**
 * token 估算：全部条目的内容 + 主/副关键词字符数 ÷ 4（向上取整）。
 * 粗估口径（英文 ≈4 字符/token），仅作编辑时的量级参考。
 */
export function estimateTokens(book: WorldInfoBook | null | undefined): number {
  let chars = 0;
  for (const e of Object.values(book?.entries || {})) {
    if (!e || typeof e !== 'object') continue;
    chars += String(e.content || '').length;
    chars += (Array.isArray(e.key) ? e.key : []).join('').length;
    chars += (Array.isArray(e.keysecondary) ? e.keysecondary : []).join('').length;
  }
  return Math.ceil(chars / 4);
}

/* ------------------------------ 导入识别 ------------------------------ */

/**
 * 任意世界书 JSON → ST 世界书形态。
 * 兼容：ST entries 对象 / lorebook_v3 文件 / character_book（entries 数组），
 * 额外兜底 V2/V3 完整角色卡内嵌的 character_book。不可识别返回 null。
 */
export function worldbookFromAny(raw: any): WorldInfoBook | null {
  if (!raw || typeof raw !== 'object') return null;
  if (detectWorldbookKind(raw) !== 'unknown') return toWorldInfo(raw);
  const data = raw.data;
  if (data && typeof data === 'object' && data.character_book) {
    return characterBookToWorldInfo(data.character_book);
  }
  return null;
}

/** 从导入 JSON 提取书名（书级 name / 卡名 / 内嵌书 name），取不到返回空串 */
export function worldbookNameFrom(raw: any): string {
  const candidates = [raw?.name, raw?.data?.name, raw?.data?.character_book?.name];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim()) return c.trim();
  }
  return '';
}

/* ------------------------------ 命中预览 ------------------------------ */

export interface WIMatchOptions {
  /** 扫描深度：只取示例文本最后 N 行（不传或 ≤0 = 全文） */
  scanDepth?: number | null;
  /** 全局大小写敏感开关（条目级 caseSensitive 非 null 时优先） */
  caseSensitive?: boolean;
  /** 全局全词匹配开关（条目级 matchWholeWords 非 null 时优先） */
  matchWholeWords?: boolean;
}

export interface WIMatchResult {
  entry: WorldInfoEntry;
  /** 命中的主关键词 */
  matchedKeys: string[];
  /** 命中的副关键词 */
  matchedSecondary: string[];
}

/** 正则转义：只转义语法字符（保证 u 标志下不会因 \- 之类报错） */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** 单个关键词是否命中（全词模式用 Unicode 字母/数字边界，兼容中日韩文本） */
function keyHit(key: string, text: string, caseSensitive: boolean, wholeWords: boolean): boolean {
  const k = String(key || '').trim();
  if (!k) return false;
  if (!wholeWords) {
    return caseSensitive ? text.includes(k) : text.toLowerCase().includes(k.toLowerCase());
  }
  try {
    const re = new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegExp(k)}(?![\\p{L}\\p{N}_])`, caseSensitive ? 'u' : 'iu');
    return re.test(text);
  } catch {
    // 罕见转义/边界异常时退回子串匹配
    return caseSensitive ? text.includes(k) : text.toLowerCase().includes(k.toLowerCase());
  }
}

/**
 * 命中预览：按 order 升序返回命中的条目及命中关键词。
 * 规则：禁用条目跳过；常量（constant）恒命中；主关键词任一命中即候选；
 * selective 且有副关键词时按 selectiveLogic 组合（0 AND_ANY / 1 NOT_ALL / 2 NOT_ANY / 3 AND_ALL）。
 */
export function matchEntries(
  book: WorldInfoBook | null | undefined,
  text: string,
  opts: WIMatchOptions = {},
): WIMatchResult[] {
  const results: WIMatchResult[] = [];
  const sample = String(text || '');
  if (!sample.trim()) return results;
  // 扫描深度：只取最后 N 行
  let scan = sample;
  if (opts.scanDepth && opts.scanDepth > 0) {
    scan = sample.split(/\r?\n/).slice(-Math.floor(opts.scanDepth)).join('\n');
  }
  for (const entry of sortedEntries(book)) {
    if (entry.disable) continue;
    const cs = typeof entry.caseSensitive === 'boolean' ? entry.caseSensitive : !!opts.caseSensitive;
    const ww = typeof entry.matchWholeWords === 'boolean' ? entry.matchWholeWords : opts.matchWholeWords !== false;
    const keys = Array.isArray(entry.key) ? entry.key : [];
    const sec = Array.isArray(entry.keysecondary) ? entry.keysecondary : [];
    const matchedKeys = keys.filter((k) => keyHit(k, scan, cs, ww));
    const matchedSecondary = sec.filter((k) => keyHit(k, scan, cs, ww));
    let hit = false;
    if (entry.constant) {
      hit = true;
    } else if (matchedKeys.length > 0) {
      if (entry.selective && sec.length > 0) {
        switch (entry.selectiveLogic) {
          case WI_LOGIC.NOT_ALL:
            hit = matchedSecondary.length < sec.length;
            break;
          case WI_LOGIC.NOT_ANY:
            hit = matchedSecondary.length === 0;
            break;
          case WI_LOGIC.AND_ALL:
            hit = matchedSecondary.length === sec.length;
            break;
          case WI_LOGIC.AND_ANY:
          default:
            hit = matchedSecondary.length > 0;
            break;
        }
      } else {
        hit = true;
      }
    }
    if (hit) results.push({ entry, matchedKeys, matchedSecondary });
  }
  return results;
}
