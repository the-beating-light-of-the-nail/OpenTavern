/**
 * 群组聊天纯函数 —— 逐字移植自原版 index.html（byte 371900 起）。
 * 不依赖响应式/i18n，便于 useChat 与组件复用。
 */

/** 是否群组聊天（原版 isGroupChat，byte 371950） */
export function isGroupChat(conv: any): boolean {
  return !!(conv && conv.group && Array.isArray(conv.group.members) && conv.group.members.length >= 2);
}

/** 取按 order 排序的成员列表（原版 getGroupMembers，byte 372020） */
export function getGroupMembers(conv: any): any[] {
  if (!conv || !conv.group || !Array.isArray(conv.group.members)) return [];
  return conv.group.members.slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * 轮询决定下一个发言者（原版 getNextGroupSpeaker，byte 372600）。
 * 跳过 muted 成员，基于最后一条 assistant 消息的 speaker 循环推进。
 */
export function getNextGroupSpeaker(conv: any): any {
  if (!isGroupChat(conv)) return null;
  const members = getGroupMembers(conv).filter((m: any) => !m.muted);
  if (members.length === 0) return null;

  const lastAssistant = [...(conv.messages || [])].reverse().find((m: any) => m.role === 'assistant' && m.speaker);
  let lastIndex = -1;
  if (lastAssistant && lastAssistant.speaker) {
    const sp = lastAssistant.speaker;
    lastIndex = members.findIndex((m: any) => m.character.name === sp);
    if (lastIndex === -1) {
      const lower = sp.toLowerCase();
      lastIndex = members.findIndex((m: any) => (m.character.name || '').toLowerCase() === lower);
    }
  }
  const nextIndex = (lastIndex + 1) % members.length;
  return members[nextIndex] ? members[nextIndex].character : members[0].character;
}

/** 当前本轮发言角色（原版 getCurrentSpeakerCharacter，byte 374663） */
export function getCurrentSpeakerCharacter(conv: any): any {
  if (!isGroupChat(conv)) return conv?.character || null;
  if (conv._nextGroupSpeaker) return conv._nextGroupSpeaker;
  return getNextGroupSpeaker(conv);
}

/**
 * 解析输入文本里的 @名字 兜底匹配（原版 parseGroupMention，byte 375704）。
 * 仅匹配第一个 @xxx，返回对应角色的完整卡；找不到返回 null。
 */
export function parseGroupMention(text: string, conv: any): any {
  if (!isGroupChat(conv) || !text) return null;
  const match = String(text).match(/@([^\s@，,。.!?]+)/);
  if (!match) return null;
  const mentionedName = match[1].trim();
  const members = getGroupMembers(conv);
  let found = members.find((m: any) => m.character.name === mentionedName);
  if (!found) {
    const lower = mentionedName.toLowerCase();
    found = members.find((m: any) => m.character.name.toLowerCase() === lower);
  }
  return found ? found.character : null;
}

/** 规范化会话的群组字段（原版 normalizeConversation，byte 372300） */
export function normalizeConversation(conv: any): any {
  if (!conv) return conv;
  if (typeof conv.group === 'undefined') conv.group = null;
  if (conv.group && Array.isArray(conv.group.members)) {
    conv.group.members.forEach((m: any, idx: number) => {
      if (typeof m.order !== 'number') m.order = idx;
      if (typeof m.muted !== 'boolean') m.muted = false;
    });
  }
  return conv;
}

/**
 * 取生效的 post-history 指令（原版 getEffectivePostHistoryInstructions，byte 410796）。
 * 自定义优先，回退到角色卡的 post_history_instructions。
 */
export function getEffectivePostHistoryInstructions(character: any, settings: any, stage?: string): string {
  const s = settings || {};
  const customPostHistory = stage === 'second'
    ? String(s.twoStagePostHistoryInstructions || '').trim()
    : String(s.postHistoryInstructions || '').trim();
  if (customPostHistory) return customPostHistory;
  return character ? String(character.post_history_instructions || '') : '';
}

/**
 * 取消息发送者显示名（原版 getMessageSenderName，byte 372900，t 由调用方传入）。
 */
export function getMessageSenderName(msg: any, conv: any, userName: string, tAssistant: string, tYou: string): string {
  if (!msg) return tAssistant;
  if (msg.role === 'user') return userName || tYou;
  if (msg.speaker) return msg.speaker;
  if (isGroupChat(conv)) {
    const members = getGroupMembers(conv);
    if (members.length > 0) return members[0].character.name;
    return 'Assistant';
  }
  return conv && conv.character ? conv.character.name : tAssistant;
}
