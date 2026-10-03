/**
 * 工具站 AI 字段写作提示词（角色卡逐字段生成）。
 * 双语模式沿用 utils/prompts.ts 的 zh/en 双份做法，按 settings.lang 选择。
 * 输出纪律：只输出字段正文本身，不带解释、不带引号。
 */

import type { CardData } from '~/utils/st/types';

export type WritableField = 'description' | 'personality' | 'scenario' | 'first_mes' | 'mes_example';

interface FieldSpec {
  /** 字段职责说明（zh/en） */
  role: { zh: string; en: string };
  /** 目标长度提示 */
  length: { zh: string; en: string };
}

const FIELD_SPECS: Record<WritableField, FieldSpec> = {
  description: {
    role: {
      zh: '角色核心设定（description）：外貌、身份、背景经历、性格特质、行为习惯的综合描述。第二人称或第三人称皆可，信息密度优先。',
      en: 'the character description: appearance, identity, backstory, personality traits and behavioral habits. Prioritize information density.',
    },
    length: { zh: '150–400 字', en: '120–300 words' },
  },
  personality: {
    role: {
      zh: '性格摘要（personality）：性格关键词与行为倾向的简明概括，可包含说话风格。',
      en: 'a personality summary: concise traits and behavioral tendencies, optionally including speech style.',
    },
    length: { zh: '30–120 字', en: '25–80 words' },
  },
  scenario: {
    role: {
      zh: '场景设定（scenario）：角色与 {{user}} 相遇时的情境，交代时间地点、关系与当前状态，给开场留下发挥空间。',
      en: 'the scenario: the situation where the character meets {{user}} — time, place, relationship and current state, leaving room for the opening.',
    },
    length: { zh: '50–200 字', en: '40–150 words' },
  },
  first_mes: {
    role: {
      zh: '开场白（first_mes）：角色的第一条消息。用生动的动作、环境或台词把 {{user}} 拉进情境，以角色视角展开，结尾留出用户接话的空间。可使用 {{char}} 与 {{user}} 宏。不要替 {{user}} 说话或行动。',
      en: 'the first message: an engaging opening in the character\'s voice — actions, setting or dialogue that pulls {{user}} into the scene, ending with room for the user to respond. Use {{char}}/{{user}} macros. Never speak or act for {{user}}.',
    },
    length: { zh: '150–400 字', en: '120–350 words' },
  },
  mes_example: {
    role: {
      zh: '对话示例（mes_example）：展示角色说话风格的示范对话。每组以 <START> 开头，格式为 {{char}}: 台词，可穿插 (动作)。写 2–3 组，风格要差异化。',
      en: 'example dialogues demonstrating the character\'s voice. Each block starts with <START>, lines formatted as {{char}}: dialogue, optionally with (actions). Provide 2–3 distinct blocks.',
    },
    length: { zh: '3–6 组对话', en: '2–4 dialogue blocks' },
  },
};

/** 卡片上下文（截断，避免提示词过长） */
function contextBlock(data: CardData, lang: string): string {
  const zh = !lang.startsWith('en');
  const pick = (label: string, v: string | undefined, cap = 700) =>
    v && v.trim() ? `${label}: ${v.trim().slice(0, cap)}` : '';
  const parts = [
    pick(zh ? '名字' : 'Name', data.name, 60),
    pick(zh ? '核心设定' : 'Description', data.description),
    pick(zh ? '性格' : 'Personality', data.personality, 400),
    pick(zh ? '场景' : 'Scenario', data.scenario, 400),
    pick(zh ? '开场白' : 'First message', data.first_mes),
    pick(zh ? '对话示例' : 'Examples', data.mes_example, 400),
    pick(zh ? '作者备注' : 'Creator notes', data.creator_notes, 300),
  ].filter(Boolean);
  return parts.join('\n');
}

/** 逐字段写作消息（把已有字段作为上下文） */
export function fieldWriteMessages(field: WritableField, data: CardData, lang: string, userHint = '') {
  const zh = !lang.startsWith('en');
  const spec = FIELD_SPECS[field];
  const system = zh
    ? '你是资深的 AI 角色卡编剧，为 AI 角色扮演撰写高质量的角色卡字段。要求：\n1. 只输出字段正文，不要任何解释、标题、引号或 Markdown 代码块。\n2. 与已有字段保持设定一致，不引入矛盾。\n3. 人物塑造具体、可信、有记忆点，避免空泛套话。\n4. 恰当使用 {{char}} 指代角色、{{user}} 指代用户。'
    : 'You are an expert character-card writer for AI roleplay. Rules:\n1. Output ONLY the field content itself — no explanations, headings, quotes or code fences.\n2. Stay consistent with the existing fields; never contradict them.\n3. Make the character concrete, believable and memorable; avoid generic filler.\n4. Use {{char}} for the character and {{user}} for the user where appropriate.';
  const context = contextBlock(data, lang);
  const userLines = [
    zh ? `请为这张卡撰写${spec.role.zh}` : `Write ${spec.role.en}`,
    zh ? `目标长度：${spec.length.zh}。` : `Target length: ${spec.length.en}.`,
  ];
  if (userHint.trim()) {
    userLines.push(zh ? `补充要求：${userHint.trim()}` : `Extra requirements: ${userHint.trim()}`);
  }
  userLines.push(zh ? '已有字段如下：' : 'Existing fields:');
  userLines.push(context || (zh ? '（暂无其他字段）' : '(no other fields yet)'));
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: userLines.join('\n') },
  ];
}
