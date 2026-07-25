// scripts/i18n-localize.mjs
// Deterministic backbone for native multi-language expansion of rich content.
//
// Three iron laws are enforced STRUCTURALLY by this script:
//  1. The LLM only ever emits prose for a whitelisted set of fields. IDs, enums,
//     array lengths, key sets and structure never leave this deterministic layer.
//  2. AST-surgical injection: data/*.ts are cloned byte-for-byte from the English
//     source via magic-string; only the INNER range of prose string-literals is
//     overwritten. Every other byte (IDs, comments, formatting, quote style) is
//     identical to en.ts. JSON files preserve all keys/order; only values change.
//  3. Parity + marker checks gate every produced file.
//
// Usage:
//   node scripts/i18n-localize.mjs extract-content [--chunk N]
//   node scripts/i18n-localize.mjs extract-ui       [--chunk N]
//   node scripts/i18n-localize.mjs extract-langkeys
//   node scripts/i18n-localize.mjs inject-all --out .i18n-work/out [--locales ja,ko,...]
//   node scripts/i18n-localize.mjs verify --locale <code>
//   node scripts/i18n-localize.mjs verify-all [--locales ja,ko,...]
//
// Manifests (locale-agnostic, English source) are written to .i18n-work/manifests/.
// Native-rewrite outputs (one per locale) are read from .i18n-work/out/<locale>/.

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import * as babelParser from '@babel/parser';
import MagicString from 'magic-string';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WORK = join(ROOT, '.i18n-work');
const MANIFEST_DIR = join(WORK, 'manifests');

const TYPES = ['characters', 'guides', 'collections'];
const EXPORT_NAME = { characters: 'characters', guides: 'guides', collections: 'collections' };
const CHUNK_SIZE = { characters: 5, guides: 3, collections: 99, ui: 90 };

// The 16 brand-new locales this tool produces.
export const NEW_LOCALES = [
  'ja', 'ko', 'it', 'nl', 'sv', 'no', 'da', 'fi', 'pl', 'tr',
  'hi', 'id', 'vi', 'th', 'ms', 'tl',
];

// code -> { language (BCP-47 for nuxt.config), name (native, for switcher) }
export const NEW_LOCALE_META = {
  ja: { language: 'ja-JP', name: '日本語' },
  ko: { language: 'ko-KR', name: '한국어' },
  it: { language: 'it-IT', name: 'Italiano' },
  nl: { language: 'nl-NL', name: 'Nederlands' },
  sv: { language: 'sv-SE', name: 'Svenska' },
  no: { language: 'nb-NO', name: 'Norsk' },
  da: { language: 'da-DK', name: 'Dansk' },
  fi: { language: 'fi-FI', name: 'Suomi' },
  pl: { language: 'pl-PL', name: 'Polski' },
  tr: { language: 'tr-TR', name: 'Türkçe' },
  hi: { language: 'hi-IN', name: 'हिन्दी' },
  id: { language: 'id-ID', name: 'Bahasa Indonesia' },
  vi: { language: 'vi-VN', name: 'Tiếng Việt' },
  th: { language: 'th-TH', name: 'ไทย' },
  ms: { language: 'ms-MY', name: 'Bahasa Melayu' },
  tl: { language: 'tl-PH', name: 'Filipino' },
};

// All locale files that must receive the 16 new language-name keys (existing 9 + new 16).
const LANGKEY_TARGET_LOCALES = [
  'en', 'zh-CN', 'zh-TW', 'es', 'ar', 'pt', 'ru', 'fr', 'de', ...NEW_LOCALES,
];

const RULES = [
  'You are a NATIVE speaker of the TARGET LANGUAGE shown in the task. REWRITE every "text"/"value" field natively in that language — compose it as if originally written there. Do NOT translate word-for-word; avoid calques and translationese. The result must read natural and idiomatic to a native reader.',
  'PRESERVE EXACTLY (never alter): the count and placement of *...* action/narration wraps; the number and structure of paragraph breaks; any {{char}}/{{user}} tokens; the English character NAME and the " | RoleChat AI" brand tail inside seoTitle (rewrite ONLY the descriptive clause between/around them); any inline roleplay-syntax examples written in asterisks; vue-i18n placeholders ({name} {s} {n} {count} etc.), the literal {\'@\'} escape, <br>, and ComfyUI tokens [scene] [last_assistant] [input] [char] [user].',
  'ADAPT freely to target-language typographic convention: dialogue quote style, ellipsis, em-dash, general punctuation and casing.',
  'Keep the SAME number of array entries (tags, FAQ q/a pairs, sections, paragraphs, internal links) and the SAME field paths. Never add, remove, reorder, split, merge or rename fields.',
  'Output the SAME JSON structure back, with ONLY the "text"/"value" fields replaced by your native rewrite. Preserve every slug, key, path and context field verbatim. Output pure JSON only.',
];

// ---------------------------------------------------------------------------
// AST helpers
// ---------------------------------------------------------------------------

function parseTs(src) {
  return babelParser.parse(src, {
    sourceType: 'module',
    plugins: ['typescript'],
    errorRecovery: true,
  });
}

/** Find the ArrayExpression of `export const <name> = [...]`. */
function findExportedArray(ast, name) {
  for (const stmt of ast.program.body) {
    if (stmt.type !== 'ExportNamedDeclaration' || !stmt.declaration) continue;
    const d = stmt.declaration;
    if (d.type !== 'VariableDeclaration') continue;
    for (const decl of d.declarations) {
      if (decl.id.type === 'Identifier' && decl.id.name === name && decl.init?.type === 'ArrayExpression') {
        return decl.init;
      }
    }
  }
  throw new Error(`Could not find exported array "${name}"`);
}

/** Is a property path (relative to an item object) a prose (rewritable) field? */
function isProse(type, p) {
  const top = p[0];
  if (type === 'characters') {
    if (['tagline', 'archetype', 'description', 'personality', 'relationshipSetup',
      'openingMessage', 'scenario', 'seoTitle', 'seoDescription'].includes(top)) return p.length === 1;
    if (top === 'tags' || top === 'personalityTags') return true;
    if (top === 'faq' && p.length === 3 && (p[2] === 'q' || p[2] === 'a')) return true;
    return false;
  }
  if (type === 'guides') {
    if ((top === 'title' || top === 'description') && p.length === 1) return true;
    if (top === 'sections' && p.length === 3 && p[2] === 'heading') return true;
    if (top === 'sections' && p.length === 4 && p[2] === 'paragraphs') return true;
    if (top === 'internalLinks' && p.length === 3 && p[2] === 'label') return true;
    return false;
  }
  if (type === 'collections') {
    return (top === 'title' || top === 'intro' || top === 'seoDescription') && p.length === 1;
  }
  return false;
}

const propKey = (prop) => (prop.key.type === 'Identifier' ? prop.key.name : String(prop.key.value));

/** Walk a value node, collecting every StringLiteral with its path (relative to item). */
function collectStrings(valueNode, prefix, type, out) {
  if (!valueNode) return;
  if (valueNode.type === 'StringLiteral') {
    out.push({ path: prefix, value: valueNode.value, prose: isProse(type, prefix) });
    return;
  }
  if (valueNode.type === 'ArrayExpression') {
    valueNode.elements.forEach((el, i) => collectStrings(el, [...prefix, i], type, out));
    return;
  }
  if (valueNode.type === 'ObjectExpression') {
    for (const prop of valueNode.properties) {
      if (prop.type === 'ObjectProperty' || prop.type === 'ObjectMethod') {
        collectStrings(prop.value ?? prop.body, [...prefix, propKey(prop)], type, out);
      }
    }
  }
}

/** Per item: { slug, strings: [{path, value, prose}], context } */
function readItems(src, type) {
  const ast = parseTs(src);
  const arr = findExportedArray(ast, EXPORT_NAME[type]);
  return arr.elements.map((el) => {
    const strings = [];
    collectStrings(el, [], type, strings);
    const slugNode = strings.find((s) => s.path.length === 1 && s.path[0] === 'slug');
    const slug = slugNode ? slugNode.value : null;
    const get = (k) => strings.find((s) => s.path.length === 1 && s.path[0] === k)?.value;
    const context = {
      slug,
      ...(type === 'characters' ? { name: get('name'), category: get('category'), gender: get('gender') } : {}),
      ...(type === 'guides' ? { datePublished: get('datePublished') } : {}),
    };
    return { slug, strings, context };
  });
}

/** Per item prose nodes with their live AST byte ranges (for injection). */
function proseNodesForItem(itemNode, type) {
  const strings = [];
  collectStrings(itemNode, [], type, strings);
  // Re-attach ranges by re-walking the raw node — collectStrings used decoded value;
  // ranges come from the AST node directly, so walk again capturing nodes.
  const withNodes = [];
  (function walk(node, prefix) {
    if (!node) return;
    if (node.type === 'StringLiteral') {
      if (isProse(type, prefix)) withNodes.push({ path: prefix, start: node.start, end: node.end });
      return;
    }
    if (node.type === 'ArrayExpression') {
      node.elements.forEach((el, i) => walk(el, [...prefix, i]));
      return;
    }
    if (node.type === 'ObjectExpression') {
      for (const prop of node.properties) {
        if (prop.type === 'ObjectProperty' || prop.type === 'ObjectMethod') {
          walk(prop.value ?? prop.body, [...prefix, propKey(prop)]);
        }
      }
    }
  })(itemNode, []);
  return withNodes;
}

const pathStr = (p) => p.map(String).join('.');
const escapeJsSingle = (s) => s
  .replace(/\\/g, '\\\\')
  .replace(/'/g, "\\'")
  .replace(/\n/g, '\\n')
  .replace(/\r/g, '\\r')
  .replace(/\t/g, '\\t');

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function readEn(type) {
  return readFileSync(join(ROOT, 'data', type, 'en.ts'), 'utf8');
}

function ensureDir(d) { mkdirSync(d, { recursive: true }); }

function writeJson(file, obj) {
  ensureDir(dirname(file));
  writeFileSync(file, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

// ---------------------------------------------------------------------------
// extract-content
// ---------------------------------------------------------------------------

function extractContent(chunkSize) {
  ensureDir(MANIFEST_DIR);
  for (const type of TYPES) {
    const src = readEn(type);
    const items = readItems(src, type);
    const chunks = chunk(items, chunkSize[type] ?? chunkSize ?? 5);
    chunks.forEach((its, i) => {
      const manifest = {
        type,
        source_locale: 'en',
        chunk: i,
        of: chunks.length,
        target: 'Rewrite every field below natively into the TARGET LANGUAGE.',
        rules: RULES,
        items: its.map((it) => ({
          slug: it.slug,
          context: it.context,
          fields: it.strings
            .filter((s) => s.prose)
            .map((s) => ({ path: pathStr(s.path), text: s.value })),
        })),
      };
      writeJson(join(MANIFEST_DIR, `${type}.${i}.json`), manifest);
    });
    console.log(`extract-content: ${type} → ${chunks.length} chunk(s), ${items.length} item(s)`);
  }
}

// ---------------------------------------------------------------------------
// extract-ui
// ---------------------------------------------------------------------------

function extractUi(chunkSize) {
  ensureDir(MANIFEST_DIR);
  const en = JSON.parse(readFileSync(join(ROOT, 'i18n', 'locales', 'en.json'), 'utf8'));
  const keys = Object.keys(en);
  const size = chunkSize ?? CHUNK_SIZE.ui;
  const chunks = chunk(keys, size);
  chunks.forEach((ks, i) => {
    const manifest = {
      type: 'ui',
      source_locale: 'en',
      chunk: i,
      of: chunks.length,
      target: 'Rewrite every value below natively into the TARGET LANGUAGE.',
      rules: RULES,
      entries: ks.map((k) => ({ key: k, value: en[k] })),
    };
    writeJson(join(MANIFEST_DIR, `ui.${i}.json`), manifest);
  });
  console.log(`extract-ui: ${keys.length} keys → ${chunks.length} chunk(s)`);
}

// ---------------------------------------------------------------------------
// extract-langkeys
// ---------------------------------------------------------------------------

function extractLangkeys() {
  ensureDir(MANIFEST_DIR);
  const targetKeys = [];
  for (const code of NEW_LOCALES) {
    targetKeys.push(`language_${code}`, `lang_${code}_short`);
  }
  const manifest = {
    type: 'langkeys',
    target: `For EACH target locale, produce the value of every listed key IN THAT LOCALE'S language (the names of the 16 languages as written by a native speaker of the target locale). "language_*" = full display name; "lang_*_short" = a very short label (the native endonym, <=12 chars, suitable for a compact switcher).`,
    rules: RULES,
    target_locale_codes: NEW_LOCALES,
    target_keys: targetKeys,
  };
  writeJson(join(MANIFEST_DIR, 'langkeys.json'), manifest);
  console.log(`extract-langkeys: ${targetKeys.length} keys × ${LANGKEY_TARGET_LOCALES.length} target locale files`);
}

// ---------------------------------------------------------------------------
// inject-all
// ---------------------------------------------------------------------------

function loadOutLocale(outDir, locale) {
  // Returns { content: { type: [{slug, fields:{path:text}}] }, ui: {key:value}, langkeys: {key:value} }
  const dir = join(outDir, locale);
  if (!existsSync(dir)) throw new Error(`No output dir for locale ${locale}: ${dir}`);
  const content = {};
  for (const type of TYPES) {
    content[type] = [];
    const files = readdirSync(dir).filter((f) => f.startsWith(`${type}.`) && f.endsWith('.json'));
    for (const f of files) {
      const m = JSON.parse(readFileSync(join(dir, f), 'utf8'));
      if (m.items) for (const it of m.items) {
        content[type].push({ slug: it.slug, fields: Object.fromEntries(it.fields.map((x) => [x.path, x.text])) });
      }
    }
  }
  const ui = {};
  const uiFiles = readdirSync(dir).filter((f) => f.startsWith('ui.') && f.endsWith('.json'));
  for (const f of uiFiles) {
    const m = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    if (m.entries) for (const e of m.entries) ui[e.key] = e.value;
  }
  let langkeys = null;
  if (existsSync(join(dir, 'langkeys.json'))) {
    langkeys = JSON.parse(readFileSync(join(dir, 'langkeys.json'), 'utf8'));
  }
  return { content, ui, langkeys };
}

function injectContentType(type, locale, items) {
  // items: [{slug, fields:{path:text}}]
  const src = readEn(type);
  const ast = parseTs(src);
  const arr = findExportedArray(ast, EXPORT_NAME[type]);
  const bySlug = new Map(items.map((it) => [it.slug, it.fields]));
  const ms = new MagicString(src);
  let touched = 0;
  let missing = 0;
  for (const itemNode of arr.elements) {
    const slugStr = (function findSlug(node) {
      if (!node || node.type !== 'ObjectExpression') return null;
      for (const prop of node.properties) {
        if (propKey(prop) === 'slug' && prop.value?.type === 'StringLiteral') return prop.value.value;
      }
      return null;
    })(itemNode);
    const fields = bySlug.get(slugStr);
    const nodes = proseNodesForItem(itemNode, type);
    for (const n of nodes) {
      const val = fields?.[pathStr(n.path)];
      if (val === undefined) { missing++; continue; }
      ms.overwrite(n.start + 1, n.end - 1, escapeJsSingle(val));
      touched++;
    }
  }
  if (missing > 0) throw new Error(`${type}/${locale}: ${missing} prose node(s) had no rewrite (incomplete output)`);
  const dest = join(ROOT, 'data', type, `${locale}.ts`);
  ensureDir(dirname(dest));
  writeFileSync(dest, ms.toString(), 'utf8');
  return touched;
}

function injectUi(locale, ui) {
  const en = JSON.parse(readFileSync(join(ROOT, 'i18n', 'locales', 'en.json'), 'utf8'));
  const out = {};
  let missing = 0;
  for (const k of Object.keys(en)) {
    if (ui[k] === undefined) { missing++; out[k] = en[k]; continue; }
    out[k] = ui[k];
  }
  if (missing > 0) throw new Error(`ui/${locale}: ${missing} keys missing rewrite`);
  const dest = join(ROOT, 'i18n', 'locales', `${locale}.json`);
  writeFileSync(dest, JSON.stringify(out, null, 2) + '\n', 'utf8');
  return Object.keys(out).length;
}

/** Insert the 16 new language-name keys before the final closing brace (minimal diff). */
function injectLangkeysIntoFile(locale, values) {
  const file = join(ROOT, 'i18n', 'locales', `${locale}.json`);
  if (!existsSync(file)) return 0; // locale JSON not created yet (partial run); skip
  const raw = readFileSync(file, 'utf8');
  const closeIdx = raw.lastIndexOf('\n}');
  if (closeIdx < 0) throw new Error(`langkeys/${locale}: cannot find closing brace in ${file}`);
  const existing = new Set(Object.keys(JSON.parse(raw)));
  const additions = [];
  for (const code of NEW_LOCALES) {
    for (const suffix of ['language_', 'lang_']) {
      const full = suffix === 'language_' ? `language_${code}` : `lang_${code}_short`;
      if (existing.has(full) || values[full] === undefined) continue;
      additions.push(`  ${JSON.stringify(full)}: ${JSON.stringify(values[full])}`);
    }
  }
  if (additions.length === 0) return 0;
  const head = raw.slice(0, closeIdx); // ends with last value line (no trailing comma)
  const tail = raw.slice(closeIdx);    // "\n}"
  const out = head + ',\n' + additions.join(',\n') + '\n' + tail;
  writeFileSync(file, out, 'utf8');
  return additions.length;
}

function injectAll(outDir, locales) {
  // 1) per-locale content + ui
  for (const locale of locales) {
    const { content, ui } = loadOutLocale(outDir, locale);
    for (const type of TYPES) {
      const n = injectContentType(type, locale, content[type]);
      console.log(`inject ${locale}/${type}: ${n} prose field(s)`);
    }
    const n = injectUi(locale, ui);
    console.log(`inject ${locale}/ui: ${n} key(s)`);
  }
  // 2) langkeys across all target locale files (need every locale's native values)
  const langByLocale = {};
  for (const locale of LANGKEY_TARGET_LOCALES) {
    try {
      const { langkeys } = loadOutLocale(outDir, locale);
      if (langkeys?.values) langByLocale[locale] = langkeys.values;
    } catch { /* existing locales without output yet handled separately */ }
  }
  let totalAdds = 0;
  for (const locale of LANGKEY_TARGET_LOCALES) {
    const vals = langByLocale[locale];
    if (!vals) { console.log(`langkeys ${locale}: NO native values found (skipping)`); continue; }
    const n = injectLangkeysIntoFile(locale, vals);
    totalAdds += n;
    console.log(`langkeys ${locale}: +${n} key(s)`);
  }
  console.log(`inject-all done. langkeys total additions: ${totalAdds}`);
}

// ---------------------------------------------------------------------------
// verify
// ---------------------------------------------------------------------------

function readParsed(type, locale) {
  const file = join(ROOT, 'data', type, `${locale}.ts`);
  const src = readFileSync(file, 'utf8');
  return { src, items: readItems(src, type) };
}

function countMarkers(text) {
  // *...* action segments and paragraph breaks
  const stars = (text.match(/\*[^*]*\*/g) || []).length;
  const paras = text.split(/\n\s*\n/).filter((s) => s.trim().length).length;
  return { stars, paras };
}

function verifyLocale(locale, { verbose = true } = {}) {
  const errors = [];
  const warns = [];
  for (const type of TYPES) {
    const en = readParsed(type, 'en').items;
    let loc;
    try {
      loc = readParsed(type, locale).items;
    } catch (e) {
      errors.push(`${type}: parse failed — ${e.message}`);
      continue;
    }
    if (loc.length !== en.length) errors.push(`${type}: item count ${loc.length} ≠ en ${en.length}`);
    for (let i = 0; i < Math.min(en.length, loc.length); i++) {
      const ei = en[i], li = loc[i];
      if (ei.slug !== li.slug) { errors.push(`${type}[${i}]: slug ${li.slug} ≠ en ${ei.slug}`); continue; }
      // verbatim fields must be byte-equal
      for (const s of ei.strings) {
        if (s.prose) continue;
        const match = li.strings.find((x) => pathStr(x.path) === pathStr(s.path));
        if (!match) { errors.push(`${type}[${i}].${pathStr(s.path)}: missing`); continue; }
        if (match.value !== s.value) errors.push(`${type}[${i}].${pathStr(s.path)}: verbatim changed (${JSON.stringify(s.value)} → ${JSON.stringify(match.value)})`);
      }
      // array-length parity on prose arrays
      const arrFields = ['tags', 'personalityTags', 'faq']; // characters; harmless for others
      for (const af of arrFields) {
        const ec = ei.strings.filter((s) => s.path[0] === af).length;
        const lc = li.strings.filter((s) => s.path[0] === af).length;
        if (ec !== lc) errors.push(`${type}[${i}].${af}: count ${lc} ≠ en ${ec}`);
      }
      // marker parity on openingMessage/relationshipSetup (characters) and guide paragraphs
      const markerFields = type === 'characters' ? ['openingMessage', 'relationshipSetup'] : [];
      for (const mf of markerFields) {
        const ev = ei.strings.find((s) => s.path[0] === mf)?.value;
        const lv = li.strings.find((s) => s.path[0] === mf)?.value;
        if (ev && lv) {
          const em = countMarkers(ev), lm = countMarkers(lv);
          if (em.stars !== lm.stars) errors.push(`${type}[${i}].${mf}: *…* count ${lm.stars} ≠ en ${em.stars}`);
          if (em.paras !== lm.paras) errors.push(`${type}[${i}].${mf}: paragraph count ${lm.paras} ≠ en ${em.paras}`);
        }
      }
      // seoTitle: keep English name + brand tail
      if (type === 'characters') {
        const name = ei.strings.find((s) => s.path[0] === 'name')?.value;
        const seo = li.strings.find((s) => s.path[0] === 'seoTitle')?.value;
        if (name && seo && !seo.includes(name)) warns.push(`${type}[${i}].seoTitle: English name "${name}" not present`);
        if (seo && !seo.includes('| RoleChat AI')) warns.push(`${type}[${i}].seoTitle: brand tail "| RoleChat AI" not present`);
      }
    }
  }
  // UI key-set parity (+32 langkeys)
  const enUi = JSON.parse(readFileSync(join(ROOT, 'i18n', 'locales', 'en.json'), 'utf8'));
  const locUiPath = join(ROOT, 'i18n', 'locales', `${locale}.json`);
  if (existsSync(locUiPath)) {
    const locUi = JSON.parse(readFileSync(locUiPath, 'utf8'));
    const enKeys = new Set(Object.keys(enUi));
    const locKeys = new Set(Object.keys(locUi));
    for (const k of enKeys) if (!locKeys.has(k)) errors.push(`ui: missing key ${k}`);
    for (const k of locKeys) if (!enKeys.has(k) && !NEW_LOCALES.some((c) => k === `language_${c}` || k === `lang_${c}_short`)) errors.push(`ui: extra key ${k}`);
    for (const c of NEW_LOCALES) {
      if (!locKeys.has(`language_${c}`)) errors.push(`ui: missing language_${c}`);
      if (!locKeys.has(`lang_${c}_short`)) errors.push(`ui: missing lang_${c}_short`);
    }
  } else {
    errors.push('ui: locale json missing');
  }
  if (verbose) {
    if (warns.length) console.log(`  ⚠ ${locale}: ${warns.length} warning(s): ${warns.slice(0, 5).join(' | ')}${warns.length > 5 ? ' …' : ''}`);
    if (errors.length) console.log(`  ✗ ${locale}: ${errors.length} error(s): ${errors.slice(0, 8).join(' | ')}${errors.length > 8 ? ' …' : ''}`);
    else console.log(`  ✓ ${locale}: OK`);
  }
  return { locale, errors, warns };
}

function verifyAll(locales) {
  let fail = 0;
  for (const l of locales) {
    const r = verifyLocale(l);
    if (r.errors.length) fail++;
  }
  console.log(`\nverify-all: ${locales.length - fail}/${locales.length} locales clean`);
  if (fail) process.exitCode = 1;
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseLocales(arg) {
  if (!arg) return NEW_LOCALES;
  return arg.split(',').map((s) => s.trim()).filter(Boolean);
}

function main() {
  const [, , cmd, ...rest] = process.argv;
  const opts = {};
  for (let i = 0; i < rest.length; i++) {
    if (rest[i].startsWith('--')) {
      const k = rest[i].slice(2);
      const v = rest[i + 1] && !rest[i + 1].startsWith('--') ? rest[++i] : true;
      opts[k] = v;
    }
  }
  switch (cmd) {
    case 'extract-content':
      return extractContent(opts.chunk ? { characters: +opts.chunk, guides: +opts.chunk, collections: 99 } : CHUNK_SIZE);
    case 'extract-ui':
      return extractUi(opts.chunk ? +opts.chunk : CHUNK_SIZE.ui);
    case 'extract-langkeys':
      return extractLangkeys();
    case 'inject-all': {
      const out = opts.out || join(WORK, 'out');
      const locales = parseLocales(opts.locales);
      return injectAll(out, locales);
    }
    case 'verify':
      return console.log(JSON.stringify(verifyLocale(opts.locale, { verbose: false }), null, 2));
    case 'verify-all': {
      const locales = parseLocales(opts.locales);
      return verifyAll(locales);
    }
    default:
      console.error(`Unknown command: ${cmd}`);
      console.error('Commands: extract-content | extract-ui | extract-langkeys | inject-all | verify | verify-all');
      process.exit(1);
  }
}

main();
