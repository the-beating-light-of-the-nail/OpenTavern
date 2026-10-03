/**
 * 角色卡/世界书格式转换：
 * - V1/V2/V3 识别与归一化（未知字段、extensions 无损保留）
 * - character_book（V2/V3 卡内格式）↔ ST 世界书（entries 对象格式）互转
 */

import type {
  CardBook,
  CardBookEntry,
  CardData,
  CardSpec,
  CharacterCard,
  LorebookV3File,
  WorldInfoBook,
  WorldInfoEntry,
} from './types';
import { WI_POSITION } from './types';

/* ------------------------------ 识别与归一 ------------------------------ */

/** 识别卡规格：spec 字段优先，其次看是否有 data 包装 */
export function detectCardSpec(raw: any): CardSpec {
  if (!raw || typeof raw !== 'object') return 'unknown';
  const spec = String(raw.spec || '').toLowerCase();
  if (spec === 'chara_card_v3') return 'v3';
  if (spec === 'chara_card_v2') return 'v2';
  if (spec) return 'unknown';
  // 无 spec：V1 是平铺六字段；V3 卡必须带 spec，所以到这里只可能是 V1 或裸 data
  if (typeof raw.name === 'string' || typeof raw.description === 'string') return 'v1';
  if (raw.data && typeof raw.data === 'object') return 'v2';
  return 'unknown';
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function arr(v: unknown): any[] | undefined {
  return Array.isArray(v) ? v : undefined;
}

/** 从任意卡（V1 平铺 / V2/V3 包装 / 裸 data）提取 data 对象，未知字段保留 */
export function cardDataFromAny(raw: any): CardData {
  const src: any = raw && typeof raw.data === 'object' && raw.data !== null ? raw.data : raw || {};
  const data: CardData = {
    name: str(src.name),
    description: str(src.description),
    personality: str(src.personality),
    scenario: str(src.scene ?? src.scenario),
    first_mes: str(src.first_mes ?? src.firstMes ?? src.greeting),
    mes_example: str(src.mes_example ?? src.example_dialogue),
    extensions: (src.extensions && typeof src.extensions === 'object' ? { ...src.extensions } : {}) as Record<string, unknown>,
  };
  // V2/V3 可选字段：存在才拷贝（保序、保未知键）
  const copyIf = (keys: string[]) => {
    for (const k of keys) {
      if (src[k] !== undefined) (data as any)[k] = src[k];
    }
  };
  copyIf([
    'creator_notes', 'system_prompt', 'post_history_instructions',
    'alternate_greetings', 'character_book', 'tags', 'creator', 'character_version',
    'nickname', 'creator_notes_multilingual', 'source', 'group_only_greetings',
    'creation_date', 'modification_date', 'assets', 'fav', 'favChecked',
  ]);
  // 其余未知顶层字段也保留（不覆盖已处理键）
  for (const k of Object.keys(src)) {
    if (!(k in data) && (data as any)[k] === undefined) (data as any)[k] = src[k];
  }
  // 兜底：必填数组
  if (!Array.isArray(data.tags)) data.tags = [];
  if (!Array.isArray(data.alternate_greetings)) data.alternate_greetings = [];
  if (!Array.isArray(data.group_only_greetings)) data.group_only_greetings = [];
  if (!data.character_book) delete data.character_book;
  return data;
}

/** 任意输入 → 完整 V2 包装卡（编辑器内部统一持有 V2 形态；导出 V3 时再升级） */
export function normalizeToCard(raw: any): CharacterCard {
  const spec = detectCardSpec(raw);
  const data = cardDataFromAny(raw);
  const card: CharacterCard = {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data,
  };
  // 保留原卡顶层的未知字段（如 x_ 前缀扩展）
  if (raw && typeof raw === 'object') {
    for (const k of Object.keys(raw)) {
      if (k !== 'spec' && k !== 'spec_version' && k !== 'data' && !(k in card)) {
        (card as any)[k] = raw[k];
      }
    }
  }
  if (spec === 'unknown' && !raw) return card;
  return card;
}

export function emptyCard(name = ''): CharacterCard {
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: {
      name,
      description: '',
      personality: '',
      scenario: '',
      first_mes: '',
      mes_example: '',
      creator_notes: '',
      system_prompt: '',
      post_history_instructions: '',
      alternate_greetings: [],
      tags: [],
      creator: '',
      character_version: '',
      creator_notes_multilingual: {},
      group_only_greetings: [],
      extensions: {},
    },
  };
}

/**
 * 导出 V2：spec 固定 chara_card_v2，剥离 V3 专属字段
 * （V3 spec：回填 V2 时应删除 V3-only 内容，这里直接不输出）
 */
export function toV2(card: CharacterCard): Record<string, any> {
  const data = cardDataFromAny(card);
  const { nickname, creator_notes_multilingual, source, group_only_greetings, creation_date, modification_date, assets, ...v2data } = data as any;
  return {
    spec: 'chara_card_v2',
    spec_version: '2.0',
    data: v2data,
    // 原卡顶层未知字段保留
    ...Object.fromEntries(Object.entries(card).filter(([k]) => !['spec', 'spec_version', 'data'].includes(k))),
  };
}

/** 导出 V3：spec 升级 + V3 必需默认值 */
export function toV3(card: CharacterCard): Record<string, any> {
  const data = cardDataFromAny(card);
  const now = Math.floor(Date.now() / 1000);
  const v3data: Record<string, any> = {
    ...data,
    creation_date: typeof data.creation_date === 'number' && data.creation_date > 0 ? data.creation_date : now,
    modification_date: now,
  };
  if (!Array.isArray(v3data.group_only_greetings) || !v3data.group_only_greetings.length) {
    v3data.group_only_greetings = [];
  }
  // assets 缺省时按 spec 视为 { type:'icon', uri:'ccdefault:', name:'main', ext:'png' }——不写全等缺省，仅在已有资产时输出
  return {
    spec: 'chara_card_v3',
    spec_version: '3.0',
    data: v3data,
    ...Object.fromEntries(Object.entries(card).filter(([k]) => !['spec', 'spec_version', 'data'].includes(k))),
  };
}

/* --------------------- character_book ↔ ST 世界书 --------------------- */

function emptyStEntry(uid: number): WorldInfoEntry {
  return {
    uid,
    key: [],
    keysecondary: [],
    comment: '',
    content: '',
    constant: false,
    selective: false,
    selectiveLogic: 0,
    addMemo: true,
    order: 100,
    position: WI_POSITION.BEFORE_CHAR,
    disable: false,
    excludeRecursion: false,
    preventRecursion: false,
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

/**
 * 卡内 character_book → ST 世界书。
 * ST-only 行为字段（depth/role/probability/递归开关/高阶 position 等）在 ST 世界书中
 * 有真实列，而 character_book 没有对应字段——从 entry.extensions 里的 x_st_* 恢复，
 * 恢复不了就用 ST 默认值。
 */
export function characterBookToWorldInfo(book: CardBook): WorldInfoBook {
  const entries: Record<string, WorldInfoEntry> = {};
  const list = Array.isArray(book.entries) ? book.entries : [];
  let uid = 0;
  for (const e of list) {
    if (!e || (!Array.isArray(e.keys) && !e.content)) continue;
    const ext = (e.extensions && typeof e.extensions === 'object' ? e.extensions : {}) as Record<string, any>;
    const st = ext.x_st && typeof ext.x_st === 'object' ? ext.x_st : {};
    const entry = emptyStEntry(uid);
    entry.key = (e.keys || []).map(String);
    entry.keysecondary = (e.secondary_keys || []).map(String);
    entry.comment = str(e.comment ?? e.name);
    entry.content = str(e.content);
    entry.constant = !!e.constant;
    entry.selective = !!e.selective;
    entry.disable = !e.enabled;
    entry.order = typeof e.insertion_order === 'number' ? e.insertion_order : 100;
    entry.position = e.position === 'after_char' ? WI_POSITION.AFTER_CHAR : WI_POSITION.BEFORE_CHAR;
    if (typeof e.use_regex === 'boolean') (entry as any).useRegex = e.use_regex;
    // 恢复 ST-only 字段（characterBookToWorldInfo 的逆向写入端见 worldInfoToCharacterBook）
    if (typeof st.position === 'number') entry.position = st.position;
    if (typeof st.depth === 'number') entry.depth = st.depth;
    if (typeof st.role === 'number') entry.role = st.role;
    if (typeof st.probability === 'number') entry.probability = st.probability;
    if (typeof st.useProbability === 'boolean') entry.useProbability = st.useProbability;
    if (typeof st.selectiveLogic === 'number') entry.selectiveLogic = st.selectiveLogic;
    if (typeof st.excludeRecursion === 'boolean') entry.excludeRecursion = st.excludeRecursion;
    if (typeof st.preventRecursion === 'boolean') entry.preventRecursion = st.preventRecursion;
    if (typeof st.delayUntilRecursion === 'boolean') entry.delayUntilRecursion = st.delayUntilRecursion;
    if (typeof st.caseSensitive === 'boolean') entry.caseSensitive = st.caseSensitive;
    if (typeof st.matchWholeWords === 'boolean') entry.matchWholeWords = st.matchWholeWords;
    if (typeof st.scanDepth === 'number') entry.scanDepth = st.scanDepth;
    if (typeof st.group === 'string') entry.group = st.group;
    if (typeof st.automationId === 'string') entry.automationId = st.automationId;
    if (typeof st.sticky === 'number') entry.sticky = st.sticky;
    if (typeof st.cooldown === 'number') entry.cooldown = st.cooldown;
    if (typeof st.delay === 'number') entry.delay = st.delay;
    if (typeof e.priority === 'number') (entry as any).priority = e.priority;
    entries[String(uid)] = entry;
    uid++;
  }
  const out: WorldInfoBook = { entries };
  // 书级字段映射（ST 世界书没有全局 scan_depth/token_budget，仅保留原值在顶层扩展键）
  if (typeof book.scan_depth === 'number') (out as any).scan_depth = book.scan_depth;
  if (typeof book.token_budget === 'number') (out as any).token_budget = book.token_budget;
  if (typeof book.recursive_scanning === 'boolean') (out as any).recursive_scanning = book.recursive_scanning;
  if (book.name) (out as any).name = book.name;
  return out;
}

/** ST 世界书 → 卡内 character_book（x_st 扩展键保存 ST-only 字段，回转无损） */
export function worldInfoToCharacterBook(wi: WorldInfoBook): CardBook {
  const entries: CardBookEntry[] = [];
  const raw = wi && wi.entries ? Object.values(wi.entries) : [];
  const sorted = [...raw].sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0) || (a?.uid ?? 0) - (b?.uid ?? 0));
  let id = 0;
  for (const e of sorted) {
    if (!e || typeof e !== 'object') continue;
    const stOnly: Record<string, unknown> = {
      position: e.position,
      depth: e.depth,
      role: e.role,
      probability: e.probability,
      useProbability: e.useProbability,
      selectiveLogic: e.selectiveLogic,
      excludeRecursion: e.excludeRecursion,
      preventRecursion: e.preventRecursion,
      delayUntilRecursion: e.delayUntilRecursion ?? undefined,
      caseSensitive: e.caseSensitive,
      matchWholeWords: e.matchWholeWords,
      scanDepth: e.scanDepth ?? undefined,
      group: e.group ?? '',
      automationId: e.automationId ?? '',
      sticky: e.sticky ?? undefined,
      cooldown: e.cooldown ?? undefined,
      delay: e.delay ?? undefined,
    };
    const entry: CardBookEntry = {
      keys: Array.isArray(e.key) ? e.key.map(String) : [],
      content: str(e.content),
      extensions: { ...(e as any).extensions, x_st: stOnly },
      enabled: !e.disable,
      insertion_order: typeof e.order === 'number' ? e.order : 100,
      id,
    };
    if (Array.isArray(e.keysecondary) && e.keysecondary.length) {
      entry.secondary_keys = e.keysecondary.map(String);
      entry.selective = true;
    }
    if (e.constant) entry.constant = true;
    entry.position = e.position === WI_POSITION.AFTER_CHAR ? 'after_char' : 'before_char';
    if (str(e.comment)) entry.comment = str(e.comment);
    if (typeof e.caseSensitive === 'boolean') entry.case_sensitive = e.caseSensitive;
    if (typeof (e as any).useRegex === 'boolean') entry.use_regex = (e as any).useRegex;
    if (typeof (e as any).priority === 'number') entry.priority = (e as any).priority;
    entries.push(entry);
    id++;
  }
  const book: CardBook = { extensions: {}, entries };
  if ((wi as any).name) book.name = (wi as any).name;
  if (typeof (wi as any).scan_depth === 'number') book.scan_depth = (wi as any).scan_depth;
  if (typeof (wi as any).token_budget === 'number') book.token_budget = (wi as any).token_budget;
  if (typeof (wi as any).recursive_scanning === 'boolean') book.recursive_scanning = (wi as any).recursive_scanning;
  return book;
}

/* ------------------------------ 世界书文件识别 ------------------------------ */

export type WorldbookFileKind = 'st_world_info' | 'lorebook_v3' | 'card_book' | 'unknown';

/** 识别世界书 JSON 文件形态 */
export function detectWorldbookKind(raw: any): WorldbookFileKind {
  if (!raw || typeof raw !== 'object') return 'unknown';
  if (raw.spec === 'lorebook_v3' && raw.data) return 'lorebook_v3';
  if (raw.entries && typeof raw.entries === 'object') return 'st_world_info';
  if (Array.isArray(raw.entries)) return 'card_book';
  return 'unknown';
}

/** 任意世界书 JSON → ST 世界书形态（工具内部统一持有 ST 形态） */
export function toWorldInfo(raw: any): WorldInfoBook {
  switch (detectWorldbookKind(raw)) {
    case 'st_world_info':
      return raw as WorldInfoBook;
    case 'lorebook_v3':
      return characterBookToWorldInfo((raw as LorebookV3File).data as CardBook);
    case 'card_book':
      return characterBookToWorldInfo({ ...(raw as CardBook), entries: raw.entries });
    default:
      return { entries: {} };
  }
}

/** ST 世界书 → V3 独立世界书文件 */
export function toLorebookV3(wi: WorldInfoBook): LorebookV3File {
  return { spec: 'lorebook_v3', data: worldInfoToCharacterBook(wi) };
}
