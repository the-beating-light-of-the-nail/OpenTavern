/**
 * 源站（tools.laopobao.online）四个 AI 工具的原始提示词与消息构造。
 * 提示词逐字取自源站构建产物，仅在末尾追加输出语言指令；
 * 占位符：{{user_request_value}} / {{original_text_value}} / {{preset_json}}。
 */
import prompts from '~/data/source-tool-prompts.json';

export const STYLE_SYSTEM_PROMPT = prompts.style;
export const DOCTOR_SYSTEM_PROMPT = prompts.doctor;
export const STUDENT_SYSTEM_PROMPT = prompts.student;
export const ABSTRACT_SYSTEM_PROMPT = prompts.abstract;

type Msg = { role: 'system' | 'user'; content: string };

export function styleMessages(userRequest: string, originalText: string, langName: string): Msg[] {
  const system =
    STYLE_SYSTEM_PROMPT
      .replace('{{user_request_value}}', userRequest)
      .replace('{{original_text_value}}', originalText || 'No specific original text provided, you may invent a generic example.') +
    `\n\n### OUTPUT LANGUAGE\nWrite all user-facing prose (world info content, labels, comments) in ${langName}. Keep code identifiers, CSS classes and JSON keys in English.`;
  return [
    { role: 'system', content: system },
    { role: 'user', content: 'Generate the complete style solution immediately based on the above specifications. DO NOT wrap with markdown, provide RAW JSON only.' },
  ];
}

export function doctorMessages(payload: unknown, langName: string): Msg[] {
  const system =
    DOCTOR_SYSTEM_PROMPT +
    `\n\n### OUTPUT LANGUAGE\nWrite every human-readable value in ${langName}. Keep the JSON keys exactly as specified. Translate the dimension names naturally (e.g. Setting diagnosis, Opening diagnosis, Character consistency, World logic, OOC warning).`;
  return [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `请对以下截取的档案记录进行诊断：\n\n${JSON.stringify(payload, null, 2)}`,
    },
  ];
}

export function studentMessages(presetJson: string, langName: string): Msg[] {
  const system =
    STUDENT_SYSTEM_PROMPT
      .replace(
        'Simplified Chinese (zh-CN). All content values must be in Chinese.',
        `${langName}. All content values must be written in ${langName}.`,
      )
      .replace('{{preset_json}}', presetJson);
  return [
    { role: 'system', content: system },
    { role: 'user', content: '请对以上预设数据进行完整的结构拆解和分析。' },
  ];
}

export function abstractMessages(content: string, langName: string): Msg[] {
  const system =
    ABSTRACT_SYSTEM_PROMPT +
    `\n\n[Output language]\nWrite the output in ${langName}. Keep the narrative system above intact and adapt its linguistic texture naturally to ${langName}.`;
  return [
    { role: 'system', content: system },
    {
      role: 'user',
      content: `[User input]\n${content}\n\nRewrite (or continue) this normal content as a deliberately disjointed, fragmented first-person stream of consciousness, following the style system above.\n\nRules:\n1. Output at most 200% of the original length.\n2. Never reuse concrete nouns from the examples in the system prompt (e.g. Rolls-Royce, wishing-well frog, elephant in a fridge); re-create from the user input.\n3. Output only the body text, no explanations.`,
    },
  ];
}
