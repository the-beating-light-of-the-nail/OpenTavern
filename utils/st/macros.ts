/**
 * SillyTavern 宏：清单（自动补全用）+ 提取（高亮/分析用）。
 * 覆盖 ST 核心宏的常用子集；参数形式与 ST 文档一致。
 */

export interface MacroDef {
  /** 宏名，不含花括号，如 char / setvar */
  name: string;
  /** 参数提示（展示在补全里），如 `setvar::name::value` */
  usage?: string;
  /** 描述（i18n key 前缀 cs_macro_desc_ 之后接 name） */
  key: string;
}

export const MACROS: MacroDef[] = [
  { name: 'char', key: 'cs_macro_desc_char' },
  { name: 'user', key: 'cs_macro_desc_user' },
  { name: 'persona', key: 'cs_macro_desc_persona' },
  { name: 'time', key: 'cs_macro_desc_time' },
  { name: 'date', key: 'cs_macro_desc_date' },
  { name: 'weekday', key: 'cs_macro_desc_weekday' },
  { name: 'random', usage: 'random::a::b::c', key: 'cs_macro_desc_random' },
  { name: 'pick', usage: 'pick::a::b::c', key: 'cs_macro_desc_pick' },
  { name: 'roll', usage: 'roll:d20', key: 'cs_macro_desc_roll' },
  { name: 'setvar', usage: 'setvar::name::value', key: 'cs_macro_desc_setvar' },
  { name: 'getvar', usage: 'getvar::name', key: 'cs_macro_desc_getvar' },
  { name: 'addvar', usage: 'addvar::name::value', key: 'cs_macro_desc_addvar' },
  { name: 'original', key: 'cs_macro_desc_original' },
  { name: 'lastMessage', key: 'cs_macro_desc_lastMessage' },
  { name: 'lastUserMessage', key: 'cs_macro_desc_lastUserMessage' },
  { name: 'charPrefix', key: 'cs_macro_desc_charPrefix' },
  { name: 'charJailbreak', key: 'cs_macro_desc_charJailbreak' },
  { name: 'description', key: 'cs_macro_desc_description' },
  { name: 'personality', key: 'cs_macro_desc_personality' },
  { name: 'scenario', key: 'cs_macro_desc_scenario' },
  { name: 'mesExamples', key: 'cs_macro_desc_mesExamples' },
  { name: 'idle_duration', key: 'cs_macro_desc_idle_duration' },
  { name: '//', usage: '// 注释（不发送）', key: 'cs_macro_desc_comment' },
];

/** 提取文本中的全部宏 token */
export interface MacroToken {
  /** 花括号内原文，如 "setvar::a::b" */
  raw: string;
  /** 宏名（"//" 注释为 "//"） */
  name: string;
  /** "::" 拆分后的参数 */
  args: string[];
}

const MACRO_RE = /\{\{([^{}]*)\}\}/g;

export function extractMacroTokens(text: string): MacroToken[] {
  const out: MacroToken[] = [];
  if (!text) return out;
  const seen = new Set<string>();
  for (const m of text.matchAll(MACRO_RE)) {
    const raw = m[1] ?? '';
    if (seen.has(raw)) continue;
    seen.add(raw);
    const parts = raw.split('::').map((s) => s.trim());
    out.push({ raw, name: parts[0] || '', args: parts.slice(1) });
  }
  return out;
}

/** 提取变量名：setvar/getvar/addvar 的第一参数（预设变量管理用） */
export function usedVariableNames(text: string): string[] {
  const names = new Set<string>();
  for (const t of extractMacroTokens(text)) {
    if (['setvar', 'getvar', 'addvar'].includes(t.name) && t.args[0]) {
      names.add(t.args[0]);
    }
  }
  return [...names];
}
