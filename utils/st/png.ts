/**
 * PNG 角色卡编解码：读写 tEXt 块中的角色卡数据。
 *
 * 规范（V3 spec + 社区约定）：
 * - V2 卡：tEXt keyword `chara`，值为 UTF-8 JSON 的 base64
 * - V3 卡：tEXt keyword `ccv3`，值为 UTF-8 JSON 的 base64；读取时 ccv3 优先于 chara
 * - 导出双写：chara（V2 包装）+ ccv3（V3 卡），旧客户端读 chara、新客户端读 ccv3
 * - 其余 tEXt 块原样保留；只移除旧的 chara/ccv3 再插入新块
 */

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] as const;

/* ------------------------------ CRC-32（表驱动） ------------------------------ */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/* ------------------------------ chunk 读写 ------------------------------ */

interface PngChunk {
  type: string;
  data: Uint8Array;
}

function isPng(bytes: Uint8Array): boolean {
  if (bytes.length < 8) return false;
  return PNG_SIGNATURE.every((b, i) => bytes[i] === b);
}

function parseChunks(bytes: Uint8Array): PngChunk[] {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const chunks: PngChunk[] = [];
  let off = 8;
  while (off + 12 <= bytes.length) {
    const length = view.getUint32(off);
    const type = String.fromCharCode(bytes[off + 4], bytes[off + 5], bytes[off + 6], bytes[off + 7]);
    const dataStart = off + 8;
    const dataEnd = dataStart + length;
    if (dataEnd + 4 > bytes.length) break; // 结构损坏，停止
    chunks.push({ type, data: bytes.slice(dataStart, dataEnd) });
    if (type === 'IEND') break;
    off = dataEnd + 4;
  }
  return chunks;
}

function encodeChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const view = new DataView(out.buffer);
  view.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  const crcTarget = out.subarray(4, 8 + data.length);
  view.setUint32(8 + data.length, crc32(crcTarget));
  return out;
}

function assemblePng(chunks: PngChunk[]): Uint8Array {
  const total = 8 + chunks.reduce((sum, c) => sum + 12 + c.data.length, 0);
  const out = new Uint8Array(total);
  out.set(PNG_SIGNATURE, 0);
  let off = 8;
  for (const c of chunks) {
    const enc = encodeChunk(c.type, c.data);
    out.set(enc, off);
    off += enc.length;
  }
  return out;
}

/** tEXt 块解析：keyword\0text（PNG 规范 keyword/text 为 Latin-1 字节） */
function readTextChunks(chunks: PngChunk[]): { keyword: string; text: string }[] {
  const out: { keyword: string; text: string }[] = [];
  for (const c of chunks) {
    if (c.type !== 'tEXt') continue;
    const zero = c.data.indexOf(0);
    if (zero < 0) continue;
    const keyword = latin1Decode(c.data.subarray(0, zero));
    const text = latin1Decode(c.data.subarray(zero + 1));
    out.push({ keyword, text });
  }
  return out;
}

function latin1Decode(bytes: Uint8Array): string {
  let s = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    s += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return s;
}

function latin1Encode(s: string): Uint8Array {
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i) & 0xff;
  return bytes;
}

/* ------------------------------ base64（分块防栈溢出） ------------------------------ */

export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

export function base64ToUtf8(b64: string): string {
  // 兼容旧卡的 URL-encoded base64 变体
  let raw = b64.trim();
  if (raw.includes('%')) {
    try { raw = decodeURIComponent(raw); } catch { /* 保持原样 */ }
  }
  const binary = atob(raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

/* ------------------------------ 角色卡读写 ------------------------------ */

export interface PngCardReadResult {
  card: Record<string, any>;
  source: 'ccv3' | 'chara';
}

/** 从 PNG 读取角色卡：ccv3 优先，chara 回退；无卡数据返回 null */
export function readPngCard(bytes: Uint8Array): PngCardReadResult | null {
  if (!isPng(bytes)) return null;
  const texts = readTextChunks(parseChunks(bytes));
  const find = (kw: string) => texts.find((t) => t.keyword.toLowerCase() === kw);
  const ccv3 = find('ccv3');
  const chara = find('chara');
  for (const entry of [ccv3, chara]) {
    if (!entry) continue;
    try {
      const card = JSON.parse(base64ToUtf8(entry.text));
      if (card && typeof card === 'object') {
        return { card, source: entry.keyword.toLowerCase() as 'ccv3' | 'chara' };
      }
    } catch { /* 尝试下一个 chunk */ }
  }
  return null;
}

export interface PngCardWriteOptions {
  /** 完整 V3 卡（写入 ccv3 chunk） */
  v3Card: Record<string, any>;
  /** V2 包装卡（写入 chara chunk；缺省则只写 ccv3） */
  v2Card?: Record<string, any> | null;
}

/**
 * 把角色卡写入 PNG（双写 chara + ccv3），返回新的 PNG 字节。
 * 非输入必须是合法 PNG；先剥掉已有 chara/ccv3，其余 tEXt 保留，新块插在 IEND 之前。
 */
export function writePngCard(bytes: Uint8Array, opts: PngCardWriteOptions): Uint8Array {
  if (!isPng(bytes)) throw new Error('Not a valid PNG file');
  const chunks = parseChunks(bytes);
  const stripped = chunks.filter((c) => {
    if (c.type !== 'tEXt') return true;
    const zero = c.data.indexOf(0);
    if (zero < 0) return true;
    const kw = latin1Decode(c.data.subarray(0, zero)).toLowerCase();
    return kw !== 'chara' && kw !== 'ccv3';
  });

  const makeText = (keyword: string, value: string): PngChunk => {
    const kwBytes = latin1Encode(keyword);
    const valBytes = latin1Encode(value);
    const data = new Uint8Array(kwBytes.length + 1 + valBytes.length);
    data.set(kwBytes, 0);
    data[kwBytes.length] = 0;
    data.set(valBytes, kwBytes.length + 1);
    return { type: 'tEXt', data };
  };

  const cardChunks: PngChunk[] = [];
  // chara 永远写 V2 包装（旧客户端兼容）；v2Card 为 null 时退化为只写 ccv3
  if (opts.v2Card) {
    cardChunks.push(makeText('chara', utf8ToBase64(JSON.stringify(opts.v2Card))));
  }
  cardChunks.push(makeText('ccv3', utf8ToBase64(JSON.stringify(opts.v3Card))));

  // 插在 IEND 之前
  const iendIdx = stripped.findIndex((c) => c.type === 'IEND');
  const insertAt = iendIdx < 0 ? stripped.length : iendIdx;
  stripped.splice(insertAt, 0, ...cardChunks);
  return assemblePng(stripped);
}

/* ------------------------------ 头像处理 ------------------------------ */

/** 任意图片文件 → 缩放为 maxSize 见方的 PNG dataURL（头像统一规格） */
export function fileToPngDataUrl(file: File | Blob, maxSize = 512): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image decode failed'));
    };
    img.src = url;
  });
}

/** dataURL → 字节（PNG 导出用） */
export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const b64 = dataUrl.slice(dataUrl.indexOf(',') + 1);
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** 无头像时的兜底 PNG：纯色底 + 名字首字符，512×512 */
export function makePlaceholderPng(name: string, bg = '#f5eee4', fg = '#8a5a6a'): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return reject(new Error('Canvas not supported'));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 512);
    const ch = (name || '?').trim().charAt(0).toUpperCase() || '?';
    ctx.fillStyle = fg;
    ctx.font = '600 240px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, 256, 276);
    resolve(canvas.toDataURL('image/png'));
  });
}
