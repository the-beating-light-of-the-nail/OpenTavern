/**
 * SillyTavern 生态数据类型：角色卡 V1/V2/V3、世界书（World Info）、预设（preset.json）。
 *
 * 字段依据：
 * - V2 spec: malfoyslastname/character-card-spec-v2
 * - V3 spec: kwaroran/character-card-spec-v3
 * - 世界书/预设字段：SillyTavern 运行时格式（ST 世界书 entries 以 uid 为键的对象）
 *
 * 所有接口都带 [k: string]: unknown 索引签名——导入/导出必须无损保留未知字段
 * （V2 spec 要求 "must never destroy unknown key-value pairs"）。
 */

/* ============================ 角色卡 ============================ */

/** V2 character_book 条目（spec 定义的字段名，注意与 ST 世界书字段名不同） */
export interface CardBookEntry {
  keys: string[];
  content: string;
  extensions: Record<string, unknown>;
  enabled: boolean;
  insertion_order: number;
  case_sensitive?: boolean;
  name?: string;
  priority?: number;
  id?: number;
  comment?: string;
  selective?: boolean;
  secondary_keys?: string[];
  constant?: boolean;
  position?: 'before_char' | 'after_char';
  /** V3 新增：true 时 keys 按正则处理 */
  use_regex?: boolean;
  [k: string]: unknown;
}

/** V2/V3 character_book */
export interface CardBook {
  name?: string;
  description?: string;
  scan_depth?: number;
  token_budget?: number;
  recursive_scanning?: boolean;
  extensions: Record<string, unknown>;
  entries: CardBookEntry[];
  [k: string]: unknown;
}

/** V3 assets 条目 */
export interface CardAsset {
  type: string; // icon | background | user_icon | emotion | x_<custom>
  uri: string; // https:// | data: | embeded://path | ccdefault:
  name: string;
  ext: string;
  [k: string]: unknown;
}

/** 卡片 data 对象（V2 超集；V3 新增字段全部可选，便于统一编辑模型） */
export interface CardData {
  // V1 六字段（必填）
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  // V2
  creator_notes?: string;
  system_prompt?: string;
  post_history_instructions?: string;
  alternate_greetings?: string[];
  character_book?: CardBook;
  tags?: string[];
  creator?: string;
  character_version?: string;
  extensions: Record<string, unknown>;
  // V3
  nickname?: string;
  creator_notes_multilingual?: Record<string, string>;
  source?: string[];
  group_only_greetings?: string[];
  creation_date?: number;
  modification_date?: number;
  assets?: CardAsset[];
  [k: string]: unknown;
}

/** 完整角色卡（含 spec 包装；V1 无 spec 字段） */
export interface CharacterCard {
  spec?: 'chara_card_v2' | 'chara_card_v3' | string;
  spec_version?: string;
  data: CardData;
  [k: string]: unknown;
}

export type CardSpec = 'v1' | 'v2' | 'v3' | 'unknown';

/* ============================ 世界书（ST World Info） ============================ */

/**
 * ST 世界书条目（运行时格式）。position / selectiveLogic / role 为数字枚举，
 * 常量见 WI_POSITION / WI_LOGIC / WI_ROLE。
 */
export interface WorldInfoEntry {
  uid: number;
  key: string[];
  keysecondary: string[];
  comment: string;
  content: string;
  constant: boolean;
  vectorized?: boolean;
  selective: boolean;
  selectiveLogic: number;
  addMemo: boolean;
  order: number;
  position: number;
  disable: boolean;
  excludeRecursion: boolean;
  preventRecursion: boolean;
  delayUntilRecursion?: boolean | null;
  probability: number;
  useProbability: boolean;
  depth: number;
  group: string;
  groupOverride?: boolean;
  groupWeight?: number;
  scanDepth?: number | null;
  caseSensitive?: boolean | null;
  matchWholeWords?: boolean | null;
  useGroupScoring?: boolean | null;
  automationId: string;
  role?: number | null;
  sticky?: number | null;
  cooldown?: number | null;
  delay?: number | null;
  matchPersonaDescription?: boolean;
  matchCharacterDescription?: boolean;
  matchCharacterPersonality?: boolean;
  matchCharacterDepthPrompt?: boolean;
  matchScenario?: boolean;
  matchCreatorNotes?: boolean;
  [k: string]: unknown;
}

/** ST 世界书文件格式：{ entries: { "<uid>": entry } } */
export interface WorldInfoBook {
  entries: Record<string, WorldInfoEntry>;
  [k: string]: unknown;
}

/** V3 独立世界书文件格式：{ spec: 'lorebook_v3', data: {...} } */
export interface LorebookV3File {
  spec: 'lorebook_v3';
  data: Omit<CardBook, never> | Record<string, unknown>;
  [k: string]: unknown;
}

/** ST world_info position 枚举 */
export const WI_POSITION = {
  BEFORE_CHAR: 0,
  AFTER_CHAR: 1,
  AN_TOP: 2,
  AN_BOTTOM: 3,
  AT_DEPTH: 4,
  EM_TOP: 5,
  EM_BOTTOM: 6,
} as const;

/** ST selectiveLogic 枚举（主关键词之间恒为 OR；副关键词按此逻辑） */
export const WI_LOGIC = {
  AND_ANY: 0,
  NOT_ALL: 1,
  NOT_ANY: 2,
  AND_ALL: 3,
} as const;

/** ST role 枚举（position=atDepth 时的消息角色） */
export const WI_ROLE = {
  SYSTEM: 0,
  USER: 1,
  ASSISTANT: 2,
} as const;

/* ============================ 预设（preset.json） ============================ */

/** Chat Completion 预设的 prompts 数组项 */
export interface PresetPrompt {
  identifier: string;
  name?: string;
  role?: 'system' | 'user' | 'assistant';
  content?: string;
  system_prompt?: boolean;
  injection_position?: number;
  injection_depth?: number;
  injection_order?: number;
  /** marker prompt（如 chatHistory/worldInfoBefore 等占位符） */
  marker?: boolean;
  [k: string]: unknown;
}

export interface PromptOrderItem {
  identifier: string;
  enabled: boolean;
  [k: string]: unknown;
}

export interface PromptOrderGroup {
  character_id: number;
  order: PromptOrderItem[];
  [k: string]: unknown;
}

/** ST Chat Completion 预设；采样参数等其余字段由索引签名无损保留 */
export interface ChatCompletionPreset {
  [k: string]: unknown;
  prompts: PresetPrompt[];
  prompt_order: PromptOrderGroup[];
}
