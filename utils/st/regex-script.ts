/**
 * AI Toolkit 工具层：ST 正则脚本 schema/校验 + AI 输出解析辅助。
 *
 * - REGEX_SCRIPT_TEMPLATE / normalizeRegexScript / validateRegexScript：
 *   对齐 SillyTavern 正则扩展（scripts/extensions/regex 的 RegexScriptData）字段
 * - AI_OUTPUT_LANGS / aiLangName：输出语言选项（i18n key）与提示词用英文名
 * - parseAiJson：容错解析 AI 输出里的 JSON（剥 ``` 围栏、截取首层大括号/方括号）
 * - parseWorldbookDrafts：世界书条目数组解析 + 逐字段归一化
 * - splitGreetings：开场白按 ---GREETING--- 标记切分
 * - mergeAiToolkitI18n：at_* 文案片段加载（fragment 独立于 locales/*.json，运行时合并进 vue-i18n）
 *
 * 说明：受文件白名单约束，AI Toolkit（components/tools/AIToolkit*）的解析辅助集中在本文件。
 */
import type { WorldInfoBook, WorldInfoEntry } from './types';
import { makeEntry } from './worldbook';
import atFragment from '~/i18n/fragments/ai-toolkit.json';

/* ============================ ST 正则脚本 schema ============================ */

/** SillyTavern 正则扩展脚本字段（对齐 RegexScriptData；不含 ST 自己生成的 id/uuid） */
export interface RegexScript {
  scriptName: string;
  findRegex: string;
  replaceString: string;
  trimStrings: string[];
  /** 0=用户输入 1=AI 输出 2=斜杠命令 3=世界信息（见 REGEX_PLACEMENT） */
  placement: number[];
  disabled: boolean;
  markdownOnly: boolean;
  promptOnly: boolean;
  runOnEdit: boolean;
  /** 0=禁用宏替换 1=原始替换 2=转义替换 */
  substituteRegex: number;
  minDepth: number | null;
  maxDepth: number | null;
}

/** ST 正则扩展 placement 枚举 */
export const REGEX_PLACEMENT = {
  USER_INPUT: 0,
  AI_OUTPUT: 1,
  SLASH_COMMAND: 2,
  WORLD_INFO: 3,
} as const;

/** 新脚本默认值（冻结防误改；使用方先 structuredClone / JSON round-trip 再改） */
export const REGEX_SCRIPT_TEMPLATE: Readonly<RegexScript> = Object.freeze({
  scriptName: '',
  findRegex: '',
  replaceString: '',
  trimStrings: [],
  placement: [],
  disabled: false,
  markdownOnly: false,
  promptOnly: false,
  runOnEdit: true,
  substituteRegex: 0,
  minDepth: null,
  maxDepth: null,
});

/**
 * 校验 AI 输出的正则脚本对象。
 * 核心字段（scriptName/findRegex/replaceString）缺失即报错；其余字段仅在
 * 存在但类型不对时报错（缺省由 normalizeRegexScript 补模板默认值）。
 * errors 返回 i18n key（at_rx_err_*，由调用方 t() 渲染）。
 */
export function validateRegexScript(obj: unknown): { ok: boolean; errors: string[] } {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return { ok: false, errors: ['at_rx_err_not_object'] };
  }
  const o = obj as Record<string, unknown>;
  const errors: string[] = [];
  // 核心字段：必须存在且合法
  if (typeof o.scriptName !== 'string' || !o.scriptName.trim()) errors.push('at_rx_err_name');
  if (typeof o.findRegex !== 'string' || !o.findRegex.trim()) {
    errors.push('at_rx_err_find');
  } else {
    try {
      new RegExp(o.findRegex); // 语法必须可编译（ST 导入后同样会 new RegExp）
    } catch {
      errors.push('at_rx_err_compile');
    }
  }
  if (typeof o.replaceString !== 'string') errors.push('at_rx_err_replace');
  // 其余字段：存在但类型不对才报错
  if (o.trimStrings !== undefined && (!Array.isArray(o.trimStrings) || o.trimStrings.some((x) => typeof x !== 'string'))) {
    errors.push('at_rx_err_trim');
  }
  if (
    o.placement !== undefined &&
    (!Array.isArray(o.placement) || o.placement.some((x) => typeof x !== 'number' || !Number.isInteger(x) || x < 0 || x > 3))
  ) {
    errors.push('at_rx_err_placement');
  }
  if (['disabled', 'markdownOnly', 'promptOnly', 'runOnEdit'].some((k) => o[k] !== undefined && typeof o[k] !== 'boolean')) {
    errors.push('at_rx_err_bool');
  }
  if (o.substituteRegex !== undefined && (typeof o.substituteRegex !== 'number' || ![0, 1, 2].includes(o.substituteRegex))) {
    errors.push('at_rx_err_subst');
  }
  const depthOk = (v: unknown) => v === undefined || v === null || (typeof v === 'number' && Number.isFinite(v));
  if (!depthOk(o.minDepth) || !depthOk(o.maxDepth)) errors.push('at_rx_err_depth');
  return { ok: !errors.length, errors };
}

/** 校验通过后补全模板默认值，产出可直接导入 ST 的完整脚本对象 */
export function normalizeRegexScript(obj: Record<string, unknown>): RegexScript {
  const t = REGEX_SCRIPT_TEMPLATE;
  const bool = (v: unknown, d: boolean) => (typeof v === 'boolean' ? v : d);
  return {
    scriptName: typeof obj.scriptName === 'string' ? obj.scriptName : t.scriptName,
    findRegex: typeof obj.findRegex === 'string' ? obj.findRegex : t.findRegex,
    replaceString: typeof obj.replaceString === 'string' ? obj.replaceString : t.replaceString,
    trimStrings: Array.isArray(obj.trimStrings)
      ? obj.trimStrings.filter((x): x is string => typeof x === 'string')
      : [...t.trimStrings],
    placement: Array.isArray(obj.placement)
      ? obj.placement.filter((x): x is number => typeof x === 'number' && Number.isInteger(x) && x >= 0 && x <= 3)
      : [...t.placement],
    disabled: bool(obj.disabled, t.disabled),
    markdownOnly: bool(obj.markdownOnly, t.markdownOnly),
    promptOnly: bool(obj.promptOnly, t.promptOnly),
    runOnEdit: bool(obj.runOnEdit, t.runOnEdit),
    substituteRegex: typeof obj.substituteRegex === 'number' && [0, 1, 2].includes(obj.substituteRegex) ? obj.substituteRegex : t.substituteRegex,
    minDepth: typeof obj.minDepth === 'number' && Number.isFinite(obj.minDepth) ? obj.minDepth : null,
    maxDepth: typeof obj.maxDepth === 'number' && Number.isFinite(obj.maxDepth) ? obj.maxDepth : null,
  };
}

/* ============================ AI 输出解析辅助 ============================ */

/**
 * 容错解析 AI 输出中的 JSON：剥 ```json 围栏，截取首层 {...} / [...] 再试。
 * 解析失败返回 null（调用方展示原文 + 错误）。
 */
export function parseAiJson(text: string): unknown | null {
  if (!text) return null;
  let s = text.trim();
  const fence = s.match(/^```[a-zA-Z0-9]*\s*([\s\S]*?)\s*```$/);
  if (fence) s = fence[1].trim();
  const tryParse = (v: string): unknown | null => {
    try {
      return JSON.parse(v);
    } catch {
      return null;
    }
  };
  const direct = tryParse(s);
  if (direct !== null) return direct;
  // 截取首个 { 或 [ 到末个配对闭合符（容忍前后夹杂说明文字）
  const start = s.search(/[{[]/);
  if (start < 0) return null;
  const closeCh = s[start] === '{' ? '}' : ']';
  const end = s.lastIndexOf(closeCh);
  if (end <= start) return null;
  return tryParse(s.slice(start, end + 1));
}

/** 世界书暂存条目（生成器表格编辑态；secondaryKeys 对应 ST 的 keysecondary） */
export interface ToolkitWbDraft {
  keys: string[];
  secondaryKeys: string[];
  comment: string;
  content: string;
}

function toStrArr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === 'string') return v.split(/[,，;；\n]/).map((x) => x.trim()).filter(Boolean);
  return [];
}

/**
 * 解析 AI 输出为世界书暂存条目数组（严格 JSON 数组，容错剥围栏/别名键名）。
 * 失败返回 null。
 */
export function parseWorldbookDrafts(text: string): ToolkitWbDraft[] | null {
  const parsed = parseAiJson(text);
  let arr: unknown[] | null = null;
  if (Array.isArray(parsed)) arr = parsed;
  else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as Record<string, unknown>).entries)) {
    arr = (parsed as { entries: unknown[] }).entries;
  }
  if (!arr || !arr.length) return null;
  const drafts: ToolkitWbDraft[] = [];
  for (const item of arr) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const keys = toStrArr(o.keys ?? o.key);
    const secondaryKeys = toStrArr(o.secondary_keys ?? o.keysecondary ?? o.secondaryKeys);
    const comment = typeof o.comment === 'string' ? o.comment : typeof o.title === 'string' ? o.title : '';
    const content = typeof o.content === 'string' ? o.content : '';
    if (!keys.length && !content) continue;
    drafts.push({ keys, secondaryKeys, comment, content });
  }
  return drafts.length ? drafts : null;
}

/** 暂存条目 → 完整 ST 世界书（WorldInfoEntry 必填字段全部补默认值，uid 从 0 递增） */
export function buildWorldbookFromDrafts(drafts: ToolkitWbDraft[]): WorldInfoBook {
  const entries: Record<string, WorldInfoEntry> = {};
  drafts.forEach((d, i) => {
    const e = makeEntry(i);
    e.key = [...d.keys];
    e.keysecondary = [...d.secondaryKeys];
    e.comment = d.comment;
    e.content = d.content;
    e.selective = d.secondaryKeys.length > 0;
    e.order = i + 1;
    entries[String(i)] = e;
  });
  return { entries };
}

/** 按 ---GREETING--- 标记切分开场白（容错空段；无标记时整段作为一条） */
export function splitGreetings(text: string): string[] {
  if (!text.trim()) return [];
  const parts = text.split(/^[ \t]*-{3,}[ \t]*GREETING[ \t]*-{3,}[ \t]*$/im);
  return parts.map((p) => p.trim()).filter(Boolean);
}

/** 复制文本到剪贴板；成功返回 true（AI Toolkit 各生成器共用，失败由调用方提示） */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/* ============================ i18n / 语言辅助 ============================ */

/** AI Toolkit 输出语言选项（labelKey 为 at_lang_* i18n key） */
export const AI_OUTPUT_LANGS = [
  { value: 'en', labelKey: 'at_lang_en' },
  { value: 'zh-CN', labelKey: 'at_lang_zhcn' },
  { value: 'zh-TW', labelKey: 'at_lang_zhtw' },
  { value: 'ja', labelKey: 'at_lang_ja' },
  { value: 'ko', labelKey: 'at_lang_ko' },
] as const;

const AI_OUTPUT_LANG_NAME: Record<string, string> = {
  en: 'English',
  'zh-CN': 'Simplified Chinese',
  'zh-TW': 'Traditional Chinese',
  ja: 'Japanese',
  ko: 'Korean',
};

/** 语言代码 → 提示词用英文名（未知代码回退 English） */
export function aiLangName(code: string): string {
  return AI_OUTPUT_LANG_NAME[code] || 'English';
}

type I18nLike = { mergeLocaleMessage?: (locale: string, message: Record<string, unknown>) => void };

/**
 * 把 ai-toolkit 的 at_* 文案按语言合并进 vue-i18n 全局消息（对齐 mergeWorldbookI18n）。
 * 幂等；SSR 与客户端都可安全调用。切换语言时 lazy loader 会整体替换该语言消息，
 * 调用方需 watch locale 重新合并。
 */
export function mergeAiToolkitI18n(i18n: unknown): void {
  const composer = i18n as I18nLike | null;
  if (!composer || typeof composer.mergeLocaleMessage !== 'function') return;
  const merge = composer.mergeLocaleMessage.bind(composer);
  for (const [locale, messages] of Object.entries(atFragment)) {
    merge(locale, messages as Record<string, unknown>);
  }
}
