/**
 * 外来角色卡格式识别与映射（Card Converter 工具页专用）：
 * - detectForeignFormat：识别其他扮演平台的角色资料来源
 * - foreignToCardData：按同义词表把外来字段映射成 ST CardData，多余键报告为 unmapped
 * - mergeCardConverterI18n：cc_* 文案片段加载（fragment 独立于 locales/*.json，运行时合并）
 *
 * 纯数据操作，无网络请求；PNG 内嵌卡的读取由调用方（工作区组件）用 utils/st/png 完成。
 */

import type { CardData } from './types';
import { cardDataFromAny } from './convert';
import ccFragment from '~/i18n/fragments/card-converter.json';

/* ------------------------------ 来源识别 ------------------------------ */

/** 支持的来源（st-* 为 SillyTavern 自身格式，也走统一入口做字段清洗） */
export type ForeignSource =
  | 'st-v3' | 'st-v2' | 'st-v1' | 'risu'
  | 'agnai' | 'tgw' | 'chub' | 'text' | 'unknown';

export interface ForeignFormat {
  source: ForeignSource;
  /** 展示标签（i18n key，cc_src_*），展示时用 t(label) */
  label: string;
}

/** source → i18n 标签 key 对照表 */
const SOURCE_LABELS: Record<ForeignSource, string> = {
  'st-v3': 'cc_src_st_v3',
  'st-v2': 'cc_src_st_v2',
  'st-v1': 'cc_src_st_v1',
  risu: 'cc_src_risu',
  agnai: 'cc_src_agnai',
  tgw: 'cc_src_tgw',
  chub: 'cc_src_chub',
  text: 'cc_src_text',
  unknown: 'cc_src_unknown',
};

/** 任意顶层键含 risu 字样（RisuAI 导出特征，如 x_risuai / extensions.risuai） */
function hasRisuTrait(o: Record<string, unknown>): boolean {
  return Object.keys(o).some((k) => k.toLowerCase().includes('risu'));
}

/** 来源识别（内部实现）：chub → st/risu → tgw → agnai → st-v1 → text → unknown */
export function detectForeignSource(raw: unknown): ForeignSource {
  // 纯字符串人设
  if (typeof raw === 'string') return 'text';
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return 'unknown';
  const obj = raw as Record<string, any>;

  // chub 导出：{ card: {...} } 内层才是角色资料
  if (obj.card && typeof obj.card === 'object' && !Array.isArray(obj.card)) return 'chub';

  // V2/V3 spec 包装（含无 spec 的裸 data 包装）；extensions 有 risu 特征字段则视为 risu
  const spec = String(obj.spec || '').toLowerCase();
  const hasDataWrapper = !!(obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data));
  if (spec === 'chara_card_v3' || spec === 'chara_card_v2' || (!spec && hasDataWrapper)) {
    const data = hasDataWrapper ? obj.data : obj;
    const ext = data.extensions;
    if (hasRisuTrait(obj) || (ext && typeof ext === 'object' && !Array.isArray(ext) && hasRisuTrait(ext))) {
      return 'risu';
    }
    return spec === 'chara_card_v3' ? 'st-v3' : 'st-v2';
  }

  // TextGeneration WebUI：char_name / char_persona / world_scenario / char_greeting
  if ('char_name' in obj || 'char_persona' in obj || 'world_scenario' in obj || 'char_greeting' in obj) return 'tgw';

  // AgnAI：greeting / example_dialogue 键
  if ('greeting' in obj || 'example_dialogue' in obj) return 'agnai';

  // V1 平铺六字段
  if (typeof obj.name === 'string' || typeof obj.description === 'string' || typeof obj.first_mes === 'string') return 'st-v1';

  // 简易文本资料：{ text } / { persona }
  if (typeof obj.text === 'string' || typeof obj.persona === 'string') return 'text';

  return 'unknown';
}

/** 识别外来格式（对外入口）；label 为 i18n key，展示时用 t(label) */
export function detectForeignFormat(raw: unknown): ForeignFormat {
  const source = detectForeignSource(raw);
  return { source, label: SOURCE_LABELS[source] };
}

/* ------------------------------ 字段映射 ------------------------------ */

/** 同义词表：CardData 字段 → 按优先级排列的外来候选键 */
const SYNONYM_TABLE: Array<{ field: string; keys: string[] }> = [
  { field: 'name', keys: ['name', 'char_name', 'bot_name'] },
  { field: 'description', keys: ['description', 'persona', 'profile'] },
  { field: 'personality', keys: ['personality', 'char_persona', 'personality_summary'] },
  { field: 'scenario', keys: ['scenario', 'world_scenario', 'scene'] },
  { field: 'first_mes', keys: ['first_mes', 'greeting', 'char_greeting', 'first_message'] },
  { field: 'mes_example', keys: ['mes_example', 'example_dialogue'] },
  { field: 'creator_notes', keys: ['creator_notes', 'creatorcomment'] },
  { field: 'system_prompt', keys: ['system_prompt'] },
  { field: 'post_history_instructions', keys: ['post_history_instructions', 'jailbreak'] },
  { field: 'tags', keys: ['tags', 'tags_list'] },
  { field: 'alternate_greetings', keys: ['alternate_greetings', 'alt_greetings'] },
  { field: 'character_book', keys: ['character_book', 'book'] },
];

/** 全部同义词键的集合（这些键视为已消费，不进 unmapped） */
const SYNONYM_KEYS = new Set(SYNONYM_TABLE.flatMap((s) => s.keys));

/** CardData 标准字段（cardDataFromAny 已处理，保留在 data 里，不算多余键） */
const STANDARD_KEYS = new Set([
  // V2/V3 包装层（cardDataFromAny 在 data 层看不到，保险起见一并列出）
  'spec', 'spec_version', 'data',
  // V1 六字段
  'name', 'description', 'personality', 'scenario', 'first_mes', 'mes_example',
  // V2 可选字段
  'creator_notes', 'system_prompt', 'post_history_instructions', 'alternate_greetings',
  'character_book', 'tags', 'creator', 'character_version', 'extensions',
  // V3 可选字段
  'nickname', 'creator_notes_multilingual', 'source', 'group_only_greetings',
  'creation_date', 'modification_date', 'assets', 'fav', 'favChecked',
]);

/** 字段是否已有可用内容（空串 / 空数组 / 空对象视为未填） */
function fieldHasValue(v: unknown): boolean {
  if (v === undefined || v === null) return false;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'string') return v.trim().length > 0;
  if (typeof v === 'object') return Object.keys(v as object).length > 0;
  return true;
}

/** 取第一个有内容的字符串字段值 */
function pickString(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k];
    if (typeof v === 'string' && v.trim()) return v;
  }
  return '';
}

/**
 * 平铺对象 → CardData：
 * 先走 convert 的通用归一（已兼容 greeting/scene/example_dialogue 与 V2 可选字段），
 * 再按同义词表补齐空字段；最后把没映射走的多余键从 data 剔除并报告给用户，
 * 保证产出的 data 只有 SillyTavern 认识的字段（干净导出）。
 */
function mapFlatObject(flat: Record<string, unknown>): { data: CardData; unmapped: string[] } {
  const data = cardDataFromAny(flat);

  // 同义词补齐：通用归一没填上的字段，按候选键顺序取第一个有内容的值
  for (const { field, keys } of SYNONYM_TABLE) {
    if (fieldHasValue((data as any)[field])) continue;
    for (const k of keys) {
      const v = flat[k];
      if (v === undefined || v === null) continue;
      if (Array.isArray(v)) {
        (data as any)[field] = v.map((x) => String(x));
        break;
      }
      if (typeof v === 'object') {
        (data as any)[field] = v; // 如 character_book / book
        break;
      }
      if (String(v).trim()) {
        (data as any)[field] = String(v);
        break;
      }
    }
  }

  // 清洗：cardDataFromAny 会把未知键与同义词键无损保留进 data，
  // 这里把非 CardData 标准字段的键全部剔除（值已映射进对应字段），
  // 其中未被同义词表消费的键报告给用户
  const unmapped: string[] = [];
  for (const k of Object.keys(flat)) {
    if (STANDARD_KEYS.has(k)) continue;
    if (!SYNONYM_KEYS.has(k)) unmapped.push(k);
    delete (data as any)[k];
  }
  return { data, unmapped };
}

/** 外来资料 → CardData（没映射走的多余键收集进 unmapped，展示给用户） */
export function foreignToCardData(raw: unknown, source: ForeignSource): { data: CardData; unmapped: string[] } {
  // 纯文本资料：整段当 description（纯字符串 / { text } / { persona }）
  if (source === 'text') {
    const text = typeof raw === 'string'
      ? raw
      : raw && typeof raw === 'object'
        ? pickString(raw as Record<string, unknown>, ['text', 'persona'])
        : '';
    const rest: Record<string, unknown> = raw && typeof raw === 'object' && !Array.isArray(raw)
      ? { ...(raw as Record<string, unknown>) }
      : {};
    delete rest.text;
    delete rest.persona;
    const { data, unmapped } = mapFlatObject(rest);
    if (text.trim()) data.description = text;
    return { data, unmapped };
  }

  // chub：内层 card 对象才是角色资料
  if (source === 'chub') {
    const inner = (raw as any)?.card;
    if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
      return mapFlatObject(inner as Record<string, unknown>);
    }
    return mapFlatObject({});
  }

  // st / risu / agnai / tgw：取 data 包装层或平铺层
  const obj = raw && typeof raw === 'object' && !Array.isArray(raw) ? (raw as Record<string, any>) : {};
  const flat = obj.data && typeof obj.data === 'object' && !Array.isArray(obj.data) ? obj.data : obj;
  return mapFlatObject(flat);
}

/* ------------------------------ i18n 片段加载 ------------------------------ */

type I18nLike = { mergeLocaleMessage?: (locale: string, message: Record<string, unknown>) => void };

/**
 * 把 card-converter 的 cc_* 文案按语言合并进 vue-i18n 全局消息。
 * 幂等（重复合并同值无害）；页面与工作区组件挂载时各调用一次，
 * locale 变化后需重新合并（调用方 watch locale）。
 */
export function mergeCardConverterI18n(i18n: unknown): void {
  const composer = i18n as I18nLike | null;
  if (!composer || typeof composer.mergeLocaleMessage !== 'function') return;
  const merge = composer.mergeLocaleMessage.bind(composer);
  for (const [locale, messages] of Object.entries(ccFragment)) {
    merge(locale, messages as Record<string, unknown>);
  }
}
