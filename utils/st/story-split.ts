/**
 * Story to Worldbook —— 长篇小说 / 长文本的章节切分：
 * - splitChapters(text)：按章节标题模式依次尝试切分，无命中时按 ~2000 字符在段落边界切块
 * - 标题 = 命中行文本；无标题块 = 首行截断或调用方提供的兜底标签（如「第 N 段」）
 * 纯函数，无副作用；供 StoryToWorldbook 工作区调用。
 */

export interface StoryChapter {
  title: string;
  content: string;
}

/** 无标题切分时的目标块大小（字符数） */
const CHUNK_SIZE = 2000;
/** 超过该倍数的大块会在更细的边界（单换行 / 硬切）再分 */
const CHUNK_MAX = CHUNK_SIZE * 1.5;

/** 章节标题模式（按优先级依次尝试，命中最优先的即采用） */
const SPLIT_PATTERNS: RegExp[] = [
  /^第[一二三四五六七八九十百千零〇0-9０-９]+[章节回卷部]/m,
  /^Chapter\s+\d+/im,
  /^#{1,3}\s+/m,
  /^-{3,}$/m,
];

/**
 * 切分长文本为章节块。
 * @param text 原文（\r\n 会归一化为 \n）
 * @param fallbackLabel 无标题块（按大小切分 / 无首行）时的兜底标签生成器，默认「第 N 段」
 */
export function splitChapters(text: string, fallbackLabel?: (n: number) => string): StoryChapter[] {
  const norm = String(text || '').replace(/\r\n?/g, '\n');
  if (!norm.trim()) return [];
  for (const p of SPLIT_PATTERNS) {
    if (!p.test(norm)) continue;
    const chapters = splitByHeading(norm, p);
    if (chapters.length) return chapters;
  }
  return splitBySize(norm, fallbackLabel);
}

/* ============================ 按标题行切分 ============================ */

/** 分隔线行（如 --- ）本身没有标题语义，标题退用内容首行 */
const SEPARATOR_LINE = /^-{3,}$/;

/**
 * 按标题模式切分：找出所有命中行作为分界。
 * 首个标题前若还有前言内容，保留为第一块（标题取首行截断），保证不丢文本。
 */
function splitByHeading(text: string, pattern: RegExp): StoryChapter[] {
  const flags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g';
  const global = new RegExp(pattern.source, flags);
  // 每个命中行记录 { 行起点, 标题 }；同一行多次命中只记一次
  const marks: { start: number; title: string }[] = [];
  for (const m of text.matchAll(global)) {
    if (m.index === undefined) continue;
    const lineStart = text.lastIndexOf('\n', m.index - 1) + 1;
    let lineEnd = text.indexOf('\n', m.index);
    if (lineEnd < 0) lineEnd = text.length;
    const title = text.slice(lineStart, lineEnd).trim();
    if (!title) continue;
    if (marks.length && marks[marks.length - 1].start === lineStart) continue;
    marks.push({ start: lineStart, title });
  }
  if (!marks.length) return [];

  const chapters: StoryChapter[] = [];
  // 标题前的前言块（可选，可能不存在）
  if (marks[0].start > 0) {
    const pre = text.slice(0, marks[0].start).trim();
    if (pre) {
      chapters.push({ title: truncateTitle(firstLine(pre)) || pre.slice(0, 16), content: pre });
    }
  }
  for (let i = 0; i < marks.length; i++) {
    const nl = text.indexOf('\n', marks[i].start);
    const contentStart = nl < 0 ? text.length : nl + 1;
    const to = i + 1 < marks.length ? marks[i + 1].start : text.length;
    const content = text.slice(contentStart, to).trim();
    // 分隔线行（---）作为标题无意义：改用内容首行截断
    const title = SEPARATOR_LINE.test(marks[i].title) ? truncateTitle(firstLine(content)) || marks[i].title : marks[i].title;
    chapters.push({ title, content });
  }
  return chapters;
}

/* ============================ 按大小切分（段落边界） ============================ */

/**
 * 无标题模式命中时按 ~CHUNK_SIZE 字符切块：
 * 优先在双换行（段落边界）落刀，其次单换行，最后硬切，保证单块不超限且不丢文本。
 */
function splitBySize(text: string, fallbackLabel?: (n: number) => string): StoryChapter[] {
  const label = fallbackLabel || ((n: number) => `第 ${n} 段`);
  let cuts = boundaryPositions(text, /\n\s*\n/g);
  if (cuts.length < 2) cuts = boundaryPositions(text, /\n/g); // 无段落边界时退化为单换行
  if (!cuts.length) cuts = [CHUNK_SIZE, CHUNK_SIZE * 2, CHUNK_SIZE * 3, CHUNK_SIZE * 4, CHUNK_SIZE * 5]; // 全文无换行：硬切位置

  const raw: string[] = [];
  let from = 0;
  let cursor = 0;
  while (text.length - from > CHUNK_SIZE) {
    let cut = -1;
    while (cursor < cuts.length && cuts[cursor] <= from + CHUNK_SIZE) {
      if (cuts[cursor] > from) cut = cuts[cursor];
      cursor++;
    }
    if (cut < 0) {
      // 窗口内没有边界：取下一个边界（若不至于过远），否则硬切
      const next = cuts[cursor];
      if (next !== undefined && next - from <= CHUNK_MAX) {
        cut = next;
        cursor++;
      } else {
        cut = from + CHUNK_SIZE;
      }
    }
    if (cut >= text.length) break;
    raw.push(text.slice(from, cut));
    from = cut;
  }
  const tail = text.slice(from);
  if (tail.trim()) raw.push(tail);

  return raw
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c, i) => ({ title: truncateTitle(firstLine(c)) || label(i + 1), content: c }));
}

/** 收集正则所有匹配的结束位置（即下一行/下一段的起点），升序 */
function boundaryPositions(text: string, re: RegExp): number[] {
  const out: number[] = [];
  for (const m of text.matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))) {
    const idx = (m.index ?? 0) + m[0].length;
    if (idx > 0 && idx < text.length) out.push(idx);
  }
  return out;
}

/* ============================ 小工具 ============================ */

/** 取文本首行（截断后作标题用） */
function firstLine(s: string): string {
  return (s.split('\n')[0] || '').trim();
}

/** 标题截断（默认 32 字符，超出加省略号） */
function truncateTitle(s: string, max = 32): string {
  const t = s.trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + '…';
}
