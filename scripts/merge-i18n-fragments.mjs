/**
 * 合并 i18n/fragments/*.json（builder 产物）到主 locale 文件。
 *
 * 片段格式：{ "<locale>": { "<key>": "<value>" }, ... }（locale ∈ en/zh-CN/zh-TW/ja/ko）
 * 规则：
 * - 只补缺：主文件已有同名 key 时以主文件为准并打印冲突警告
 * - 新 key 追加到主文件末尾（保持既有键序不动）
 * - 某语言缺 key 时打印提示（运行时由 fallbackLocale:'en' 兜底）
 *
 * 用法：node scripts/merge-i18n-fragments.mjs [--force]
 *   --force 时片段覆盖主文件同名 key（默认只补缺）
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fragDir = path.join(root, 'i18n', 'fragments');
const localesDir = path.join(root, 'i18n', 'locales');
const LOCALES = ['en', 'zh-CN', 'zh-TW', 'ja', 'ko'];
const FORCE = process.argv.includes('--force');

const files = fs.readdirSync(fragDir).filter((f) => f.endsWith('.json'));
if (!files.length) {
  console.log('no fragments found in', fragDir);
  process.exit(0);
}

for (const file of files) {
  const frag = JSON.parse(fs.readFileSync(path.join(fragDir, file), 'utf8'));
  console.log(`\n=== ${file} ===`);
  for (const loc of LOCALES) {
    const keys = frag[loc];
    if (!keys) {
      console.log(`  [${loc}] MISSING locale block — skipped`);
      continue;
    }
    const target = path.join(localesDir, `${loc}.json`);
    const main = JSON.parse(fs.readFileSync(target, 'utf8'));
    let added = 0;
    let conflicted = 0;
    for (const [k, v] of Object.entries(keys)) {
      if (Object.prototype.hasOwnProperty.call(main, k)) {
        if (FORCE) {
          main[k] = v;
          conflicted++;
        } else {
          console.log(`  [${loc}] conflict (kept main): ${k}`);
          conflicted++;
        }
        continue;
      }
      main[k] = v;
      added++;
    }
    fs.writeFileSync(target, JSON.stringify(main, null, 2) + '\n');
    console.log(`  [${loc}] +${added} added${FORCE ? `, ${conflicted} overwritten` : conflicted ? `, ${conflicted} conflicts` : ''}`);
    // 语言块缺失 key 提示（相对 en）
    if (loc !== 'en' && frag.en) {
      const missing = Object.keys(frag.en).filter((k) => !(k in keys));
      if (missing.length) console.log(`  [${loc}] missing vs en (fallback ok): ${missing.length} → ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}`);
    }
  }
}
console.log('\ndone.');
