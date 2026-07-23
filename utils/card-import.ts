/**
 * 角色卡导入解析 —— 从遗留 index.html 移植（importCharacterCard + extractCharaFromPng）。
 * 仅客户端使用（依赖 atob / TextDecoder / ArrayBuffer）；/app 为 ssr:false，安全。
 */

/** 归一化后的平坦角色对象（与聊天 store createConversation 读取的 entry.data 形状一致） */
export interface ParsedCharacter {
  name: string;
  description: string;
  personality: string;
  scenario: string;
  first_mes: string;
  mes_example: string;
  system_prompt: string;
  post_history_instructions: string;
  creator_notes: string;
  tags: string[];
  alternate_greetings: string[];
  extensions: Record<string, any>;
}

/**
 * 解析 JSON 角色卡（支持 chara_card_v1/v2/v3 + 扁平 name 格式）。
 * 无效格式或缺 name 抛 Error。
 */
export function parseCharacterCard(jsonData: any): ParsedCharacter {
  if (!jsonData) throw new Error('ERR_INVALID_CARD');

  let data: any = null;

  // V3
  if (jsonData.spec === 'chara_card_v3' && jsonData.data) {
    data = jsonData.data;
  }
  // V2
  else if (jsonData.spec === 'chara_card_v2' && jsonData.data) {
    data = jsonData.data;
  }
  // V1（扁平）或无 spec 的旧格式
  else if (jsonData.name && (jsonData.description || jsonData.personality || jsonData.first_mes)) {
    data = jsonData;
  }
  // 兜底：尝试从 data 里拿
  else if (jsonData.data && jsonData.data.name) {
    data = jsonData.data;
  }

  if (!data) throw new Error('ERR_INVALID_CARD');
  if (!data.name) throw new Error('ERR_MISSING_NAME');

  // 强制字符串化，防止非字符串值导致后续 .replace 报错
  return {
    name: String(data.name || ''),
    description: String(data.description || ''),
    personality: String(data.personality || ''),
    scenario: String(data.scenario || ''),
    first_mes: String(data.first_mes || ''),
    mes_example: String(data.mes_example || ''),
    system_prompt: String(data.system_prompt || ''),
    post_history_instructions: String(data.post_history_instructions || ''),
    creator_notes: String(data.creator_notes || ''),
    tags: Array.isArray(data.tags) ? data.tags : [],
    alternate_greetings: Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [],
    extensions: data.extensions || {},
  };
}

/**
 * 从 SillyTavern PNG 角色卡文件中提取嵌入的 character JSON 数据。
 * 支持常见的 "chara" / "ccv3" tEXt / iTXt chunk（base64 编码的 JSON）。
 * 返回可直接传给 parseCharacterCard 的 JSON 对象。
 */
export async function extractCharaFromPng(file: File): Promise<any> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // PNG signature check
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== sig[i]) throw new Error('ERR_INVALID_PNG');
  }

  let offset = 8;
  while (offset < bytes.length) {
    const length = (bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3];
    const type = String.fromCharCode(bytes[offset + 4], bytes[offset + 5], bytes[offset + 6], bytes[offset + 7]);
    const chunkData = bytes.slice(offset + 8, offset + 8 + length);

    if (type === 'tEXt' || type === 'iTXt') {
      // keyword is null-terminated
      let keywordEnd = 0;
      while (keywordEnd < chunkData.length && chunkData[keywordEnd] !== 0) keywordEnd++;
      const keyword = new TextDecoder('utf-8').decode(chunkData.slice(0, keywordEnd));
      if (keyword === 'chara' || keyword === 'ccv3') {
        const valueBytes = chunkData.slice(keywordEnd + 1);
        const b64 = new TextDecoder('utf-8').decode(valueBytes);
        // base64 → bytes → string
        const binary = atob(b64);
        const decoded = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          decoded[i] = binary.charCodeAt(i);
        }
        const jsonStr = new TextDecoder('utf-8').decode(decoded);
        return JSON.parse(jsonStr);
      }
    }

    offset += 12 + length;
    if (type === 'IEND') break;
  }

  throw new Error('ERR_NO_CHARA_DATA');
}

/**
 * 将 File 读为 data URL（用于 PNG 导入时把图片本身作为 avatar）。
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('ERR_FILE_READ'));
    reader.readAsDataURL(file);
  });
}
