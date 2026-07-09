/**
 * 聊天辅助函数 —— 逐字移植自原版 index.html。
 * 这些纯函数决定了提示词构建、API 端点处理、CoT 解析的保真度。
 */

/** {{char}}/{{user}} 占位符替换（原版 7614） */
export function replacePlaceholders(text: string, charName: string, userName: string): string {
  text = String(text || '');
  if (!text) return '';
  return text
    .replace(/\{\{char\}\}/gi, charName || '')
    .replace(/\{\{user\}\}/gi, userName || 'User');
}

/**
 * 规范化 API 端点：自动补 /chat/completions（原版 6619）。
 * 兼容 DeepSeek（无 v1）、智谱 GLM、标准 OpenAI 兼容。
 */
export function normalizeApiEndpoint(raw: string): string {
  if (!raw) return raw;
  let url = String(raw).trim().replace(/\/+$/, '');
  if (url.includes('/chat/completions')) return url;
  if (/^https?:\/\/api\.deepseek\.com(\/.*)?$/.test(url)) return url + '/chat/completions';
  if (url.includes('bigmodel.cn/api/paas/v4') || url.includes('z.ai/api/paas/v4')) return url + '/chat/completions';
  if (/\/(v[0-9]+|openai\/v1)$/.test(url)) return url + '/chat/completions';
  if (!/\/v[0-9]/.test(url) && !url.includes('/paas/')) url += '/v1';
  return url + '/chat/completions';
}

export function isLikelyOllamaEndpoint(raw: string): boolean {
  if (!raw) return false;
  const s = String(raw).toLowerCase();
  return s.includes('ollama') || s.includes(':11434');
}

export function shouldUseOllamaCompat(endpoint: string, ollamaCompatMode: boolean): boolean {
  return !!ollamaCompatMode || isLikelyOllamaEndpoint(endpoint);
}

function normalizePromptRole(role: string): string {
  const r = String(role || 'user').toLowerCase();
  if (r === 'assistant' || r === 'user' || r === 'system') return r;
  return 'user';
}

/**
 * Ollama 兼容：合并多条 system 消息为一条，后置 system 降级为 user（原版 6659）。
 */
export function normalizeMessagesForOllama(messages: any[]): any[] {
  if (!Array.isArray(messages) || messages.length === 0) return messages || [];
  const systemParts: string[] = [];
  const normalized: any[] = [];
  let seenNonSystem = false;

  for (const msg of messages) {
    if (!msg) continue;
    const role = normalizePromptRole(msg.role || 'user');
    const content = msg.content == null ? '' : String(msg.content);
    if (!content.trim()) continue;
    if (role === 'system') {
      if (!seenNonSystem) systemParts.push(content);
      else normalized.push({ role: 'user', content: '[System / developer instruction]\n' + content });
      continue;
    }
    seenNonSystem = true;
    normalized.push({ role, content });
  }

  const result: any[] = [];
  if (systemParts.length > 0) result.push({ role: 'system', content: systemParts.join('\n\n') });
  result.push(...normalized);

  return result.reduce((acc: any[], msg) => {
    const last = acc[acc.length - 1];
    if (last && last.role === msg.role) last.content += '\n\n' + msg.content;
    else acc.push({ role: msg.role, content: msg.content });
    return acc;
  }, []);
}

/**
 * CoT：从 SSE delta 提取 reasoning_content / thinking / cot（原版 10003）。
 */
export function extractCotDelta(delta: any): string {
  if (!delta) return '';
  const val = delta.reasoning_content || delta.reasoning || delta.thinking || delta.cot;
  if (typeof val === 'string') return val;
  if (val && typeof val.content === 'string') return val.content;
  if (Array.isArray(val)) {
    return val.map((p: any) => {
      if (typeof p === 'string') return p;
      return p && (p.text || p.content) ? String(p.text || p.content) : '';
    }).join('');
  }
  return '';
}

/**
 * 从正文中拆出 <think>...</think> 块合并到 cot（原版 10017）。
 */
export function splitInlineCot(content: string, existingCot: string): { content: string; cot: string } {
  let text = String(content || '');
  let cot = String(existingCot || '');
  const re = /<think(?:ing)?\b[^>]*>([\s\S]*?)(?:<\/think(?:ing)?>|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m[1]) cot += (cot ? '\n' : '') + m[1].trim();
  }
  text = text.replace(re, '').trim();
  return { content: text, cot: cot.trim() };
}

/** 生成唯一 ID（原版 makeId） */
export function makeId(): string {
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

/**
 * 规范化角色卡数据：从 chara_card_v2/v3 格式提取平坦字段（原版 conv.character 用平坦结构）。
 */
export function extractCharacterFields(cardData: any): any {
  if (!cardData) return null;
  const d = cardData.data || cardData;
  return {
    name: d.name || cardData.name || '',
    description: d.description || '',
    personality: d.personality || '',
    scenario: d.scenario || '',
    first_mes: d.first_mes || d.first_message || '',
    mes_example: d.mes_example || d.message_example || '',
    system_prompt: d.system_prompt || '',
    post_history_instructions: d.post_history_instructions || '',
    creator_notes: d.creator_notes || '',
    tags: d.tags || [],
    avatar: d.avatar || cardData.avatar,
    _raw: cardData,
  };
}
