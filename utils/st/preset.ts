/**
 * SillyTavern preset.json 辅助：空白骨架、采样参数字段清单、prompt 顺序操作、宏/变量分析。
 *
 * round-trip 原则：除 prompts / prompt_order / 已知采样字段（SAMPLER_FIELDS）外，
 * 其余顶层键永不自动增删改；「高级（原始字段）」面板里的显式用户操作除外。
 */
import type { PresetPrompt, PromptOrderGroup, PromptOrderItem } from './types';
import { MACROS } from './macros';

/** 新建空白预设：最小骨架（100001 为 ST 默认 character_id） */
export function emptyPreset(): Record<string, any> {
  return {
    prompts: [],
    prompt_order: [{ character_id: 100001, order: [] }],
    temperature: 1,
    top_p: 1,
  };
}

/** raw 是否为可编辑的对话补全预设（有 prompts 数组即可）；否则仅按 raw JSON 保存 */
export function isEditablePreset(raw: Record<string, any> | null | undefined): boolean {
  return !!raw && Array.isArray(raw.prompts);
}

/** 就地补齐 prompts / prompt_order 数组（仅在用户执行需要它们的修改时调用，避免污染 raw） */
export function ensurePresetArrays(raw: Record<string, any>): void {
  if (!Array.isArray(raw.prompts)) raw.prompts = [];
  if (!Array.isArray(raw.prompt_order)) raw.prompt_order = [];
}

export interface SamplerField {
  /** raw 顶层键名 */
  key: string;
  /** 标签 i18n key（pl_sampler_<key>，各语言复用英文字段名） */
  labelKey: string;
  /** number = 数字输入；string = 文本输入；boolean = 开关（ST 里 wrap_in_quotes / squash_system_messages 实为布尔） */
  type: 'number' | 'string' | 'boolean';
}

/** 已知采样/行为参数字段（存在才显示，编辑写入 raw 顶层） */
export const SAMPLER_FIELDS: SamplerField[] = [
  { key: 'temperature', labelKey: 'pl_sampler_temperature', type: 'number' },
  { key: 'top_p', labelKey: 'pl_sampler_top_p', type: 'number' },
  { key: 'top_k', labelKey: 'pl_sampler_top_k', type: 'number' },
  { key: 'typical_p', labelKey: 'pl_sampler_typical_p', type: 'number' },
  { key: 'min_p', labelKey: 'pl_sampler_min_p', type: 'number' },
  { key: 'top_a', labelKey: 'pl_sampler_top_a', type: 'number' },
  { key: 'tfs', labelKey: 'pl_sampler_tfs', type: 'number' },
  { key: 'frequency_penalty', labelKey: 'pl_sampler_frequency_penalty', type: 'number' },
  { key: 'presence_penalty', labelKey: 'pl_sampler_presence_penalty', type: 'number' },
  { key: 'repetition_penalty', labelKey: 'pl_sampler_repetition_penalty', type: 'number' },
  { key: 'mirostat_tau', labelKey: 'pl_sampler_mirostat_tau', type: 'number' },
  { key: 'mirostat_eta', labelKey: 'pl_sampler_mirostat_eta', type: 'number' },
  { key: 'openai_max_context', labelKey: 'pl_sampler_openai_max_context', type: 'number' },
  { key: 'openai_max_tokens', labelKey: 'pl_sampler_openai_max_tokens', type: 'number' },
  { key: 'max_tokens', labelKey: 'pl_sampler_max_tokens', type: 'number' },
  { key: 'names_behavior', labelKey: 'pl_sampler_names_behavior', type: 'number' },
  { key: 'wrap_in_quotes', labelKey: 'pl_sampler_wrap_in_quotes', type: 'boolean' },
  { key: 'squash_system_messages', labelKey: 'pl_sampler_squash_system_messages', type: 'boolean' },
  { key: 'send_if_empty', labelKey: 'pl_sampler_send_if_empty', type: 'string' },
  { key: 'impersonation_prompt', labelKey: 'pl_sampler_impersonation_prompt', type: 'string' },
  { key: 'new_chat_prompt', labelKey: 'pl_sampler_new_chat_prompt', type: 'string' },
  { key: 'continue_nudge_prompt', labelKey: 'pl_sampler_continue_nudge_prompt', type: 'string' },
];

/** 已知采样字段的键集合（高级面板排除用） */
export const SAMPLER_KEYS: ReadonlySet<string> = new Set(SAMPLER_FIELDS.map((f) => f.key));

/** 生成不与现有 prompt 冲突的新 identifier */
export function genPromptIdentifier(existing: unknown[]): string {
  const taken = new Set(existing.filter((s): s is string => typeof s === 'string' && !!s));
  let id = '';
  do {
    id = `prompt_${Math.random().toString(36).slice(2, 8)}`;
  } while (taken.has(id));
  return id;
}

/** 数组内移动元素（拖拽 / ↑↓ 排序共用） */
export function moveArrayItem<T>(list: T[], from: number, to: number): void {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
  const [item] = list.splice(from, 1);
  list.splice(to, 0, item);
}

/* ============================ 宏 / 变量分析 ============================ */

const MACRO_TOKEN_RE = /\{\{([^{}]*)\}\}/g;

export interface PresetMacroStat {
  /** 花括号内原文，如 setvar::stage::1 */
  raw: string;
  /** 宏名（"::" 前的第一段） */
  name: string;
  /** 出现次数（全部 prompt 内容合计） */
  count: number;
  /** MACROS 匹配到的描述 key（cs_macro_desc_*），未知宏为 null */
  descKey: string | null;
}

/** 扫描全部 prompt.content 的 {{macro}}：按原文去重 + 计数（出现多者在前） */
export function analyzePresetMacros(prompts: PresetPrompt[] | null | undefined): PresetMacroStat[] {
  const counts = new Map<string, number>();
  for (const p of prompts || []) {
    const text = typeof p?.content === 'string' ? p.content : '';
    if (!text) continue;
    for (const m of text.matchAll(MACRO_TOKEN_RE)) {
      const raw = m[1] ?? '';
      counts.set(raw, (counts.get(raw) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([raw, count]) => {
      const name = raw.split('::')[0].trim();
      const def = MACROS.find((m) => m.name.toLowerCase() === name.toLowerCase());
      return { raw, name, count, descKey: def ? def.key : null };
    })
    .sort((a, b) => b.count - a.count || a.raw.localeCompare(b.raw));
}

export interface PresetVarStat {
  /** 变量名（setvar/getvar/addvar 第一参数） */
  name: string;
  /** setvar 写入的初始值（多次 setvar 取第一次；仅 getvar 引用时为 null） */
  init: string | null;
  /** 被引用次数（setvar/getvar/addvar 合计） */
  refs: number;
}

/** 扫描 {{setvar::name::value}} / {{getvar::name}} / {{addvar::name::value}} → 变量表 */
export function analyzePresetVariables(prompts: PresetPrompt[] | null | undefined): PresetVarStat[] {
  const map = new Map<string, PresetVarStat>();
  for (const p of prompts || []) {
    const text = typeof p?.content === 'string' ? p.content : '';
    if (!text) continue;
    for (const m of text.matchAll(MACRO_TOKEN_RE)) {
      const parts = (m[1] ?? '').split('::').map((s) => s.trim());
      if (!['setvar', 'getvar', 'addvar'].includes(parts[0]) || !parts[1]) continue;
      const name = parts[1];
      let stat = map.get(name);
      if (!stat) {
        stat = { name, init: null, refs: 0 };
        map.set(name, stat);
      }
      stat.refs += 1;
      if (parts[0] === 'setvar' && stat.init === null) stat.init = parts[2] ?? '';
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** 类型再出口：order 分组 / 顺序项（组件里免 import paths 重复） */
export type { PresetPrompt, PromptOrderGroup, PromptOrderItem };
