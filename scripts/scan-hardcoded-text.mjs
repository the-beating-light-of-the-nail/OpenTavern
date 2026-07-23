/**
 * 扫描 .vue 文件中 <template> 内的硬编码 UI 文本
 *
 * 检测逻辑：
 * 1. 遍历 components/ 和 pages/ 下所有 .vue 文件（含子目录）
 * 2. 提取 <template> 块
 * 3. 用状态机提取 >tag< 之间的纯文本节点
 * 4. 排除：
 *    - {{ t('...') }} 或 {{ $t('...') }} 翻译调用
 *    - 纯 Vue 动态表达式（如 {{ name }}、{{ c.name }}）
 *    - HTML 实体（&times; 等）、纯数字、符号装饰
 *    - 无法渲染的空白节点
 *
 * 输出：文件路径（相对根目录）、原始文件行号、匹配到的文本片段
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const TARGET_DIRS = ['components', 'pages'];
const ROOT_VUE_FILES = ['app.vue'];

// ── 收集文件 ──────────────────────────────────────────────

function collectVueFiles(dir) {
  const results = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectVueFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.vue')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── 提取 <template> 块 ──────────────────────────────────

function extractTemplate(content) {
  const match = content.match(/<template\b[^>]*>([\s\S]*?)<\/template>/);
  return match ? { template: match[1], templateOffset: match.index } : null;
}

// ── 状态机提取文本节点 ──────────────────────────────────
// 正确跳过属性值内的 >、< 字符，避免误将 >= / => 当作标签边界

function* extractTextNodes(html) {
  let i = 0;
  let inTag = false;
  let inQuote = null; // null / '"' / "'"
  let textStart = -1;
  let textLine = 1;
  let lineNum = 1;

  while (i < html.length) {
    const ch = html[i];

    if (ch === '\n') lineNum++;

    if (inQuote) {
      // 在属性值引号内 → 一切字符都按原义处理
      if (ch === inQuote) inQuote = null;
    } else if (ch === '<' && !inTag) {
      // 标签开始 → 提交已累计的文本
      inTag = true;
      if (textStart >= 0) {
        yield { text: html.slice(textStart, i), line: textLine };
        textStart = -1;
      }
    } else if (inTag) {
      // 标签内 → 关注引号和标签结束
      if (ch === '"' || ch === "'") {
        inQuote = ch;
      } else if (ch === '>') {
        inTag = false;
      }
    } else {
      // 文本节点
      if (textStart < 0) {
        textStart = i;
        textLine = lineNum;
      }
    }

    i++;
  }

  // 文件末尾可能还有未提交的文本
  if (textStart >= 0) {
    yield { text: html.slice(textStart), line: textLine };
  }
}

// ── 检测是否属于已翻译 / 动态表达式 ─────────────────────

function isTranslated(text) {
  // 纯 Vue 表达式 {{ ... }}
  if (/^\s*\{\{.*?\}\}\s*$/.test(text)) {
    // t() 或 $t() 调用 → 已翻译
    if (/\bt\s*\(/.test(text) || /\$\s*t\s*\(/.test(text)) return true;
    // 其他表达式（变量、计算等）→ 不是硬编码
    return true; // 当作安全，跳过
  }
  return false;
}

function hasEnglishLetters(text) {
  return /[a-zA-Z]/.test(text);
}

// ── 排除 HTML 实体（&times; &amp; 等）───────────────────

function isOnlyHtmlEntities(text) {
  return /^(&[a-zA-Z]+[\d]*;[\s]*)+$/.test(text.trim());
}

// ── 检测硬编码文本（对单个文本节点） ───────────────────

function checkHardcoded(rawText, absLineNum, filePath) {
  const trimmed = rawText.trim();
  if (!trimmed) return null;

  // 没有英文字母 → 跳过（纯符号/数字）
  if (!hasEnglishLetters(trimmed)) return null;

  // 纯 HTML 实体 → 跳过
  if (isOnlyHtmlEntities(trimmed)) return null;

  // 纯 Vue 表达式 → 跳过（无论是否翻译）
  if (/^\s*\{\{.*?\}\}\s*$/.test(trimmed)) return null;

  // 混合内容（如 "← Home"、"Page {{ n }}"）
  // 去掉 Vue 表达式部分，检查纯文本部分
  const parts = trimmed.split(/\{\{.*?\}\}/gs);
  const plainText = parts
    .map((p) => p.trim())
    .filter(Boolean)
    .join(' ');

  if (!plainText) return null;
  if (!hasEnglishLetters(plainText)) return null;

  return {
    file: filePath,
    line: absLineNum,
    text: trimmed,
  };
}

// ── 主逻辑 ──────────────────────────────────────────────

function main() {
  const allFiles = [];

  for (const dirName of TARGET_DIRS) {
    const dirPath = path.join(ROOT, dirName);
    allFiles.push(...collectVueFiles(dirPath));
  }
  for (const fname of ROOT_VUE_FILES) {
    const fpath = path.join(ROOT, fname);
    if (fs.existsSync(fpath)) allFiles.push(fpath);
  }

  console.log(`\n🔍 扫描 ${allFiles.length} 个 .vue 文件...\n`);

  let totalFindings = 0;
  let hasAny = false;

  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const extracted = extractTemplate(content);
    if (!extracted) continue;

    const { template, templateOffset } = extracted;
    // 计算模板在原始文件中的起始行号（1-indexed）
    const templateStartLine = (content.slice(0, templateOffset).match(/\n/g) || []).length + 1;

    // 跳过没有真实内容的模板（例如仅 <NuxtPage />）
    if (/^\s*<[\w-/]+\s*\/>\s*$/.test(template)) continue;

    const findings = [];

    // 先去掉 HTML 注释（避免干扰）
    const cleaned = template.replace(/<!--[\s\S]*?-->/g, '');

    for (const node of extractTextNodes(cleaned)) {
      // node.line 是相对模板块的行号（1-indexed）
      const absLineNum = templateStartLine + node.line - 1;
      const result = checkHardcoded(node.text, absLineNum, filePath);
      if (result) findings.push(result);
    }

    if (findings.length > 0) {
      hasAny = true;
      const relPath = path.relative(ROOT, filePath);
      console.log(`📄 ${relPath}`);
      for (const f of findings) {
        console.log(`   L${f.line}  ${f.text}`);
        totalFindings++;
      }
      console.log('');
    }
  }

  if (!hasAny) {
    console.log('✅ 未发现硬编码文本。所有文本均已通过 t() 翻译。');
  } else {
    console.log(`📊 总计：${totalFindings} 处可能的硬编码文本\n`);
    console.log('⚠️  以上列表包含可能的硬编码 UI 文本。请逐条确认：');
    console.log('   - 若为品牌名/标识（如 "RoleChat AI"、"RC"），可忽略');
    console.log('   - 若为用户可见的 UI 文字，建议迁移至 i18n 翻译');
  }
}

main();
