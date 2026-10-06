<script setup lang="ts">
/**
 * Story to Worldbook 工作区：四步向导（① 输入 → ② 切分 → ③ 提炼设置 → ④ 批量提炼）。
 * - 输入：大 textarea + ToolFileDrop（.txt/.md 多文件按序拼接）+ 可选参考角色卡（卡库）
 * - 切分：utils/st/story-split.ts 逐章切块；标题可改、可排除、可并入上/下块、可重新切分（确认）
 * - 提炼：每块一次 useToolAI.generate（BYOK），要求严格 JSON 数组；失败标红可重试，不中断批次
 * - 暂存表：comment / keys / content 可编辑，疑似重复标记 + 合并 / 保留两条
 * - 产出：存入世界书库（可跳 Worldbook Forge）/ 下载 .json / 复制 JSON / 清空重来
 * sw_* 文案存于 i18n/fragments/story-to-worldbook.json，运行时幂等合并进 vue-i18n。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { useToolAI } from '~/composables/useToolAI';
import { downloadJson, safeFilename } from '~/utils/st/export';
import {
  aiLangName,
  buildWorldbookFromDrafts,
  copyToClipboard,
  parseAiJson,
  type ToolkitWbDraft,
} from '~/utils/st/regex-script';
import { splitChapters } from '~/utils/st/story-split';
import swFragment from '~/i18n/fragments/story-to-worldbook.json';

type I18nLike = { mergeLocaleMessage?: (locale: string, message: Record<string, unknown>) => void };

/** 把 sw_* 片段按语言合并进 vue-i18n 全局消息（幂等，SSR 与客户端都可安全调用） */
function mergeStoryToWorldbookI18n(i18n: unknown): void {
  const composer = i18n as I18nLike | null;
  if (!composer || typeof composer.mergeLocaleMessage !== 'function') return;
  const merge = composer.mergeLocaleMessage.bind(composer);
  for (const [locale, messages] of Object.entries(swFragment)) {
    merge(locale, messages as Record<string, unknown>);
  }
}

interface StoryChunk {
  id: number;
  title: string;
  content: string;
  excluded: boolean;
}

type ChunkStatus = 'pending' | 'running' | 'done' | 'failed';

interface StagedRow {
  id: number;
  /** 来源块标题 */
  source: string;
  keys: string[];
  secondaryKeys: string[];
  comment: string;
  content: string;
}

const toolbox = useToolboxStore();
const ui = useUiStore();
const i18n = useI18n();
const { t, locale } = i18n;

// 片段运行时合并：切换语言时 lazy loader 会整体替换该语言消息，需重新合并
mergeStoryToWorldbookI18n(i18n);
watch(() => locale.value, () => mergeStoryToWorldbookI18n(i18n));

onMounted(() => toolbox.load());

/* ------------------------------ 步骤导航 ------------------------------ */

const step = ref(1);
const NAV = [
  { icon: '①', key: 'sw_nav_input' },
  { icon: '②', key: 'sw_nav_split' },
  { icon: '③', key: 'sw_nav_set' },
  { icon: '④', key: 'sw_nav_run' },
];

/** 后续步骤的前置条件：切分需要文本，设置/提炼需要可用分块 */
function canGo(n: number): boolean {
  if (n <= 1) return true;
  if (n === 2) return !!fullText.value.trim();
  return includedChunks.value.length > 0;
}

function goStep(n: number) {
  if (!canGo(n)) return;
  if (n === 2 && needSplit.value) doSplit();
  step.value = n;
}

/* ------------------------------ ① 输入 ------------------------------ */

const pasted = ref('');
const files = ref<{ name: string; text: string }[]>([]);
const refCardId = ref('');
const formError = ref('');

/** 全文 = 上传文件（按序）+ 粘贴文本，文件间/与粘贴间空行分隔 */
const fullText = computed(() =>
  [...files.value.map((f) => f.text), pasted.value]
    .map((s) => s.trim())
    .filter(Boolean)
    .join('\n\n'),
);
const totalChars = computed(() => Array.from(fullText.value).length);

const refCard = computed(() => (refCardId.value ? toolbox.cardById(refCardId.value) : null));

async function onFiles(list: File[]) {
  formError.value = '';
  for (const f of list) {
    try {
      const text = await f.text();
      if (text.trim()) files.value.push({ name: f.name, text });
    } catch {
      // 单个文件读取失败时跳过，不打断其余文件
    }
  }
}

function clearInput() {
  pasted.value = '';
  files.value = [];
  refCardId.value = '';
  chunks.value = [];
  statuses.value = {};
  splitSource.value = null;
  formError.value = '';
}

function goSplit() {
  if (!fullText.value.trim()) {
    formError.value = t('sw_err_empty');
    return;
  }
  goStep(2);
}

/* ------------------------------ ② 切分 ------------------------------ */

const chunks = ref<StoryChunk[]>([]);
const splitSource = ref<string | null>(null);
let chunkSeq = 0;

/** 原文变化或尚未切分时需要重切 */
const needSplit = computed(() => !chunks.value.length || splitSource.value !== fullText.value);

const includedChunks = computed(() => chunks.value.filter((c) => !c.excluded && c.content.trim()));

function doSplit() {
  const parts = splitChapters(fullText.value, (n: number) => t('sw_sp_fallback', { n }));
  chunks.value = parts.map((p) => ({ id: ++chunkSeq, title: p.title, content: p.content, excluded: false }));
  splitSource.value = fullText.value;
  statuses.value = {};
}

async function onResplit() {
  const ok = await ui.showDialog({ message: t('sw_sp_resplit_confirm'), showCancel: true, danger: true });
  if (ok) doSplit();
}

/** 并入上块：当前块内容拼到上一块（保留上一块标题） */
function mergeUp(i: number) {
  if (i <= 0) return;
  const target = chunks.value[i - 1];
  const cur = chunks.value[i];
  target.content = target.content ? `${target.content}\n\n${cur.content}` : cur.content;
  delete statuses.value[cur.id];
  chunks.value.splice(i, 1);
}

/** 并入下块：当前块内容拼到下一块前面（保留下一块标题） */
function mergeDown(i: number) {
  if (i >= chunks.value.length - 1) return;
  const cur = chunks.value[i];
  const target = chunks.value[i + 1];
  target.content = cur.content ? `${cur.content}\n\n${target.content}` : target.content;
  delete statuses.value[cur.id];
  chunks.value.splice(i, 1);
}

/* ------------------------------ ③ 提炼设置 ------------------------------ */

const entriesPerChunk = ref(3);
const focus = ref<'all' | 'char' | 'place' | 'event' | 'setting' | 'item'>('all');
const detail = ref<'brief' | 'standard' | 'rich'>('standard');
const extra = ref('');

/** 关键词语言默认跟随界面语言（站点支持的语言里没有的回退英文） */
const KEY_LANGS = [
  { value: 'en', labelKey: 'sw_lang_en' },
  { value: 'zh-CN', labelKey: 'sw_lang_zhcn' },
  { value: 'zh-TW', labelKey: 'sw_lang_zhtw' },
  { value: 'ja', labelKey: 'sw_lang_ja' },
  { value: 'ko', labelKey: 'sw_lang_ko' },
];
const keyLang = ref(KEY_LANGS.some((l) => l.value === locale.value) ? locale.value : 'en');

const DETAILS = [
  { value: 'brief' as const, desc: 'concise — 40-80 words per entry', len: '40-80 words' },
  { value: 'standard' as const, desc: 'balanced — 80-150 words per entry', len: '80-150 words' },
  { value: 'rich' as const, desc: 'rich — 150-280 words per entry', len: '150-280 words' },
];

/** 关注重点 → 提示词英文描述 */
const FOCUS_EN: Record<string, string> = {
  all: 'everything notable (characters, locations, events, world settings, items)',
  char: 'characters (identity, personality, abilities, relationships, current status)',
  place: 'locations, geography, buildings and travel routes',
  event: 'key events, plot developments and their consequences',
  setting: 'world rules, factions, organizations, systems and background lore',
  item: 'notable items, artifacts, weapons and treasures',
};

/* ------------------------------ ④ 批量提炼 ------------------------------ */

const ai = useToolAI();
const aiRunning = computed(() => ai.running.value);
const aiError = computed(() => ai.error.value);
const configured = computed(() => ai.isConfigured());

const statuses = ref<Record<number, ChunkStatus>>({});
const staged = ref<StagedRow[]>([]);
const ignoredPairs = ref<string[]>([]);
const batchAbort = ref(false);
const batchDone = ref(false);
const batchStopped = ref(false);
const runNotice = ref('');
let rowSeq = 0;

/** 待提炼目标：未排除、内容非空、未完成 */
const targets = computed(() => includedChunks.value.filter((c) => statuses.value[c.id] !== 'done'));
/** 进度条口径：全部可提炼块 */
const allTargets = computed(() => includedChunks.value);
const progressDone = computed(() => allTargets.value.filter((c) => statuses.value[c.id] === 'done').length);
const progressPct = computed(() =>
  allTargets.value.length ? Math.round((progressDone.value / allTargets.value.length) * 100) : 0,
);
const currentChunk = computed(() => allTargets.value.find((c) => statuses.value[c.id] === 'running') || null);

function openSettings() {
  ui.open('settings');
}

function stopBatch() {
  batchAbort.value = true;
  ai.stop();
}

async function startBatch() {
  if (aiRunning.value) return;
  if (!configured.value) {
    openSettings();
    return;
  }
  if (!targets.value.length) {
    runNotice.value = t('sw_ex_none');
    return;
  }
  batchAbort.value = false;
  batchDone.value = false;
  batchStopped.value = false;
  runNotice.value = '';
  const list = [...targets.value];
  for (const c of list) {
    if (batchAbort.value) break;
    statuses.value[c.id] = 'running';
    await runChunk(c);
  }
  batchDone.value = true;
  batchStopped.value = batchAbort.value;
}

/** 重试单个失败块（不跑整批） */
async function retryChunk(c: StoryChunk) {
  if (aiRunning.value) return;
  runNotice.value = '';
  statuses.value[c.id] = 'running';
  await runChunk(c);
}

/** 单块提炼：生成 → 容错解析 → 入暂存表（失败标红，不中断批次） */
async function runChunk(c: StoryChunk) {
  runNotice.value = '';
  const ok = await ai.generate(buildMessages(c), { temperature: 0.8, maxTokens: 3200 });
  if (!ok || aiError.value || batchAbort.value) {
    statuses.value[c.id] = 'failed';
    return;
  }
  const drafts = parseChunkEntries(ai.output.value);
  if (!drafts) {
    statuses.value[c.id] = 'failed';
    runNotice.value = t('sw_ex_parse_err', { name: c.title });
    return;
  }
  for (const d of drafts) {
    staged.value.push({ id: ++rowSeq, source: c.title, keys: d.keys, secondaryKeys: d.secondaryKeys, comment: d.comment, content: d.content });
  }
  statuses.value[c.id] = 'done';
}

/** 单块消息：system 严格 JSON 数组契约；user = 块全文 + 设置 + 参考卡上下文 */
function buildMessages(c: StoryChunk): { role: 'system' | 'user'; content: string }[] {
  const langName = aiLangName(locale.value);
  const keyLangName = aiLangName(keyLang.value);
  const det = DETAILS.find((d) => d.value === detail.value) || DETAILS[1];
  const focusEn = FOCUS_EN[focus.value] || FOCUS_EN.all;

  const system = [
    'You are a world-info (lorebook) author for AI roleplay.',
    `Extract up to ${entriesPerChunk.value} worldbook entries from the chapter text below.`,
    `Focus on: ${focusEn}. Detail level: ${det.desc}.`,
    '',
    'STRICT OUTPUT RULES:',
    '1. Output a single valid JSON array and nothing else — no markdown code fences, no commentary.',
    '2. Each element MUST be an object exactly like: { "keys": ["main keyword"], "secondary_keys": [], "comment": "entry title", "content": "entry body" }',
    `3. "keys": 1-3 short trigger keywords that appear in the chapter text, in ${keyLangName}. "secondary_keys": optional extra keywords (empty array is fine).`,
    `4. "comment": a short entry title in ${langName}. "content": a self-contained third-person lore description in ${langName} (${det.len}), based ONLY on facts stated in the text.`,
    '5. If the chapter offers fewer distinct topics than requested, output fewer entries rather than inventing facts.',
  ].join('\n');

  const parts: string[] = [
    `[CHAPTER: ${c.title || '-'}]`,
    c.content,
    '',
    'SETTINGS:',
    `- Entries to extract: ${entriesPerChunk.value}`,
    `- Focus: ${focusEn}`,
    `- Detail level: ${det.value}`,
    `- Keyword language: ${keyLangName}`,
  ];
  if (extra.value.trim()) parts.push(`- Extra instructions: ${extra.value.trim()}`);
  if (refCard.value) {
    const cd = refCard.value.raw?.data;
    parts.push(
      '',
      'REFERENCE CHARACTER CARD (context only — do not extract entries from it):',
      `Name: ${cd?.name || ''}`,
      `Description: ${String(cd?.description || '').slice(0, 800)}`,
    );
  }
  parts.push('', 'Output the JSON array now.');

  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: parts.join('\n') },
  ];
}

/* ------------------------------ 输出解析（容错） ------------------------------ */

function toStrArr(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === 'string') return v.split(/[,，;；\n]/).map((x) => x.trim()).filter(Boolean);
  return [];
}

/** 解析单块 AI 输出：剥 ``` 围栏 / 截取首对方括号 / 单对象包装成数组 / 兼容别名键名 */
function parseChunkEntries(text: string): ToolkitWbDraft[] | null {
  const parsed = parseAiJson(text);
  let list: unknown[] | null = null;
  if (Array.isArray(parsed)) list = parsed;
  else if (parsed && typeof parsed === 'object') {
    const o = parsed as Record<string, unknown>;
    if (Array.isArray(o.entries)) list = o.entries;
    else list = [parsed]; // 单对象包装成数组
  }
  if (!list || !list.length) return null;
  const drafts: ToolkitWbDraft[] = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    const keys = toStrArr(o.keys ?? o.key);
    const secondaryKeys = toStrArr(o.secondary_keys ?? o.keysecondary ?? o.secondaryKeys);
    const comment = typeof o.comment === 'string' ? o.comment : typeof o.title === 'string' ? o.title : '';
    const content = typeof o.content === 'string' ? o.content : '';
    if (!keys.length && !content) continue;
    drafts.push({ keys, secondaryKeys, comment, content });
  }
  return drafts.length ? drafts : null;
}

/* ------------------------------ 暂存表：查重 / 合并 ------------------------------ */

const pairKey = (a: number, b: number) => (a < b ? `${a}:${b}` : `${b}:${a}`);

function sameKeys(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((k, i) => k.trim() === b[i].trim());
}

/** 疑似重复：comment 归一（trim/小写）相同，或 keys 完全一致 */
function isDupPair(a: StagedRow, b: StagedRow): boolean {
  const ca = a.comment.trim().toLowerCase();
  const cb = b.comment.trim().toLowerCase();
  if (ca && ca === cb) return true;
  return a.keys.length > 0 && sameKeys(a.keys, b.keys);
}

const dupIds = computed(() => {
  const set = new Set<number>();
  const rows = staged.value;
  for (let i = 0; i < rows.length; i++) {
    for (let j = i + 1; j < rows.length; j++) {
      if (!isDupPair(rows[i], rows[j])) continue;
      if (ignoredPairs.value.includes(pairKey(rows[i].id, rows[j].id))) continue;
      set.add(rows[i].id);
      set.add(rows[j].id);
    }
  }
  return set;
});

/** 当前行的首个未忽略重复对象（供合并 / 保留两条定位） */
function firstDupPartner(r: StagedRow): StagedRow | null {
  for (const other of staged.value) {
    if (other.id === r.id) continue;
    if (!isDupPair(r, other)) continue;
    if (ignoredPairs.value.includes(pairKey(r.id, other.id))) continue;
    return other;
  }
  return null;
}

/** 合并重复：keys / 副关键词并集，content 拼接，保留靠前一行 */
function mergeDup(r: StagedRow) {
  const p = firstDupPartner(r);
  if (!p) return;
  const target = staged.value.indexOf(p) < staged.value.indexOf(r) ? p : r;
  const donor = target === p ? r : p;
  for (const k of donor.keys) {
    if (!target.keys.some((x) => x.trim() === k.trim())) target.keys.push(k);
  }
  for (const k of donor.secondaryKeys) {
    if (!target.secondaryKeys.some((x) => x.trim() === k.trim())) target.secondaryKeys.push(k);
  }
  target.content = target.content.trim() && donor.content.trim() ? `${target.content}\n\n${donor.content}` : target.content + donor.content;
  ignoredPairs.value = ignoredPairs.value.filter((k) => k !== pairKey(r.id, p.id));
  removeRow(donor);
}

/** 保留两条：忽略这一对，取消重复标记 */
function keepBoth(r: StagedRow) {
  const p = firstDupPartner(r);
  if (p) ignoredPairs.value.push(pairKey(r.id, p.id));
}

function removeRow(r: StagedRow) {
  staged.value = staged.value.filter((x) => x.id !== r.id);
}

/* ------------------------------ 产出：保存 / 导出 / 清空 ------------------------------ */

const bookName = ref('');
const savedId = ref('');
const saved = ref(false);
const copied = ref(false);
const localePath = useLocalePath();

function buildBook() {
  return buildWorldbookFromDrafts(
    staged.value.map((r) => ({ keys: r.keys, secondaryKeys: r.secondaryKeys, comment: r.comment, content: r.content })),
  );
}

function saveBook() {
  if (!staged.value.length) return;
  const rec = toolbox.addWorldbook(bookName.value.trim() || t('sw_out_default_name'), JSON.parse(JSON.stringify(buildBook())));
  savedId.value = rec.id;
  saved.value = true;
}

/** 带参跳转 Worldbook Forge（Forge 端消费 ?id=<bookId> 自动打开） */
function openInForge() {
  if (!savedId.value) return;
  navigateTo({ path: localePath('/tools/worldbook-forge'), query: { id: savedId.value } });
}

function downloadBook() {
  if (!staged.value.length) return;
  const name = safeFilename(bookName.value.trim() || t('sw_out_default_name'));
  downloadJson(`${name}.json`, JSON.parse(JSON.stringify(buildBook())));
}

async function onCopy() {
  if (!staged.value.length) return;
  if (!await copyToClipboard(JSON.stringify(buildBook(), null, 2))) {
    ui.showDialog({ message: t('sw_out_copy_fail'), showCancel: false });
    return;
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

async function resetAll() {
  const ok = await ui.showDialog({ message: t('sw_out_reset_confirm'), showCancel: true, danger: true });
  if (!ok) return;
  clearInput();
  staged.value = [];
  ignoredPairs.value = [];
  rowSeq = 0;
  bookName.value = '';
  savedId.value = '';
  saved.value = false;
  copied.value = false;
  batchAbort.value = false;
  batchDone.value = false;
  batchStopped.value = false;
  runNotice.value = '';
  extra.value = '';
  step.value = 1;
}
</script>

<template>
  <div class="ui-panel-flat">
    <!-- BYOK 提示条 -->
    <div v-if="!configured" class="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-champagne/50 bg-rose-tint px-3 py-2.5">
      <span class="text-sm text-plum">🔑 {{ t('sw_byok_hint') }}</span>
      <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="openSettings">
        {{ t('sw_byok_open') }}
      </button>
    </div>

    <!-- 步骤导航 -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-border-warm pb-3">
      <button
        v-for="(nv, i) in NAV"
        :key="nv.key"
        type="button"
        class="ui-chip"
        :class="{ active: step === i + 1 }"
        :disabled="!canGo(i + 1)"
        @click="goStep(i + 1)"
      >{{ nv.icon }} {{ t(nv.key) }}</button>
    </div>

    <!-- ① 输入 -->
    <div v-if="step === 1" class="mt-4">
      <ToolField :label="t('sw_in_paste_label')">
        <textarea v-model="pasted" rows="10" class="ui-input w-full resize-y" :placeholder="t('sw_in_paste_ph')" />
      </ToolField>

      <div class="mt-3">
        <ToolField :label="t('sw_in_files_label')">
          <ToolFileDrop accept=".txt,.md" multiple hint-key="sw_drop_hint" sub-key="sw_drop_local" @files="onFiles" />
        </ToolField>
        <div v-if="files.length" class="mt-2 flex flex-wrap items-center gap-1.5">
          <span v-for="(f, i) in files" :key="`${f.name}-${i}`" class="ui-chip ui-chip-sm">
            📄 {{ f.name }}
            <button type="button" class="text-plum-muted hover:text-rose-deep" :aria-label="t('sw_file_remove')" @click="files.splice(i, 1)">×</button>
          </span>
        </div>
      </div>

      <div class="mt-3">
        <ToolField :label="t('sw_in_ref_label')" :hint="t('sw_in_ref_hint')">
          <select v-model="refCardId" class="ui-input w-full">
            <option value="">{{ t('sw_in_ref_none') }}</option>
            <option v-for="c in toolbox.cards" :key="c.id" :value="c.id">{{ c.raw?.data?.name || c.id }}</option>
          </select>
        </ToolField>
      </div>

      <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-xs text-plum-muted">{{ t('sw_in_chars', { n: totalChars.toLocaleString() }) }}</span>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" :disabled="!fullText && !files.length" @click="clearInput">
          ✕ {{ t('sw_in_clear') }}
        </button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm ml-auto" :disabled="!fullText.trim()" @click="goSplit">
          {{ t('sw_in_next') }} →
        </button>
      </div>
    </div>

    <!-- ② 切分 -->
    <div v-else-if="step === 2" class="mt-4">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-bold">{{ t('sw_sp_count', { n: chunks.length }) }}</span>
        <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="onResplit">↻ {{ t('sw_sp_resplit') }}</button>
      </div>

      <p v-if="!chunks.length" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ t('sw_sp_empty') }}</p>

      <div class="mt-3 space-y-2">
        <div
          v-for="(c, i) in chunks"
          :key="c.id"
          class="rounded-lg border p-3"
          :class="c.excluded ? 'border-border-warm bg-surface opacity-60' : 'border-border-warm bg-surface'"
        >
          <div class="flex flex-wrap items-center gap-2">
            <input
              v-model="c.title"
              type="text"
              class="ui-input ui-input-compact min-w-0 flex-1 text-sm"
              :placeholder="t('sw_sp_title_ph')"
              :aria-label="t('sw_sp_title_ph')"
            >
            <span class="whitespace-nowrap text-xs text-plum-muted">{{ t('sw_sp_chars', { n: c.content.length.toLocaleString() }) }}</span>
            <label class="flex cursor-pointer select-none items-center gap-1 whitespace-nowrap text-xs">
              <input v-model="c.excluded" type="checkbox" class="accent-rose-accent">
              {{ t('sw_sp_exclude') }}
            </label>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="i === 0" @click="mergeUp(i)">↑ {{ t('sw_sp_merge_up') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="i === chunks.length - 1" @click="mergeDown(i)">↓ {{ t('sw_sp_merge_down') }}</button>
            <details v-if="c.content" class="ml-auto min-w-0 flex-1">
              <summary class="cursor-pointer select-none text-xs font-semibold text-rose-accent">{{ t('sw_sp_preview') }}</summary>
              <p class="mt-1.5 max-h-40 overflow-auto whitespace-pre-wrap rounded border border-border-warm bg-bg p-2 text-xs leading-relaxed text-plum-muted">{{ c.content }}</p>
            </details>
          </div>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="goStep(1)">← {{ t('sw_back') }}</button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm ml-auto" :disabled="!includedChunks.length" @click="goStep(3)">
          {{ t('sw_sp_next') }} →
        </button>
      </div>
    </div>

    <!-- ③ 提炼设置 -->
    <div v-else-if="step === 3" class="mt-4">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToolField :label="t('sw_st_entries')">
          <select v-model.number="entriesPerChunk" class="ui-input w-full">
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </ToolField>
        <ToolField :label="t('sw_st_focus')">
          <select v-model="focus" class="ui-input w-full">
            <option value="all">{{ t('sw_st_focus_all') }}</option>
            <option value="char">{{ t('sw_st_focus_char') }}</option>
            <option value="place">{{ t('sw_st_focus_place') }}</option>
            <option value="event">{{ t('sw_st_focus_event') }}</option>
            <option value="setting">{{ t('sw_st_focus_setting') }}</option>
            <option value="item">{{ t('sw_st_focus_item') }}</option>
          </select>
        </ToolField>
        <ToolField :label="t('sw_st_keylang')" :hint="t('sw_st_keylang_hint')">
          <select v-model="keyLang" class="ui-input w-full">
            <option v-for="l in KEY_LANGS" :key="l.value" :value="l.value">{{ t(l.labelKey) }}</option>
          </select>
        </ToolField>
        <ToolField :label="t('sw_st_detail')">
          <select v-model="detail" class="ui-input w-full">
            <option value="brief">{{ t('sw_st_det_brief') }}</option>
            <option value="standard">{{ t('sw_st_det_standard') }}</option>
            <option value="rich">{{ t('sw_st_det_rich') }}</option>
          </select>
        </ToolField>
        <div class="sm:col-span-2">
          <ToolField :label="t('sw_st_extra')">
            <textarea v-model="extra" rows="2" class="ui-input w-full resize-y" :placeholder="t('sw_st_extra_ph')" />
          </ToolField>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="goStep(2)">← {{ t('sw_back') }}</button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm ml-auto" :disabled="!includedChunks.length" @click="goStep(4); startBatch()">
          ✦ {{ t('sw_st_start') }}
        </button>
      </div>
    </div>

    <!-- ④ 批量提炼 + 暂存表 + 产出 -->
    <div v-else class="mt-4">
      <!-- 进度 -->
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-bold">{{ t('sw_ex_progress', { i: progressDone, n: allTargets.length }) }}</span>
        <span v-if="currentChunk" class="min-w-0 truncate text-xs text-plum-muted">{{ t('sw_ex_current', { name: currentChunk.title }) }}</span>
        <button v-if="aiRunning" type="button" class="ui-button ui-button-danger-ghost ui-button-xs ml-auto" @click="stopBatch">■ {{ t('sw_ex_stop') }}</button>
        <button
          v-else-if="targets.length"
          type="button"
          class="ui-button ui-button-primary ui-button-xs ml-auto"
          @click="startBatch"
        >✦ {{ t('sw_st_start') }}</button>
      </div>
      <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-rose-tint">
        <div class="h-full rounded-full bg-rose-accent transition-all duration-300" :style="{ width: `${progressPct}%` }" />
      </div>

      <!-- 逐块状态 -->
      <div class="mt-3 space-y-1.5">
        <div
          v-for="c in allTargets"
          :key="c.id"
          class="flex flex-wrap items-center gap-2 rounded-lg border border-border-warm bg-surface px-2.5 py-1.5 text-xs"
        >
          <span class="min-w-0 flex-1 truncate font-semibold">{{ c.title }}</span>
          <span v-if="statuses[c.id] === 'done'" class="ui-chip ui-chip-success">✓ {{ t('sw_ex_status_done') }}</span>
          <span v-else-if="statuses[c.id] === 'running'" class="ui-chip ui-chip-sm animate-pulse">▌ {{ t('sw_ex_status_running') }}</span>
          <span
            v-else-if="statuses[c.id] === 'failed'"
            class="ui-chip ui-chip-sm"
            style="color: var(--color-danger); border-color: color-mix(in srgb, var(--color-danger) 40%, transparent)"
          >✗ {{ t('sw_ex_status_failed') }}</span>
          <span v-else class="ui-chip ui-chip-sm text-plum-muted">· {{ t('sw_ex_status_pending') }}</span>
          <button
            v-if="statuses[c.id] === 'failed' && !aiRunning"
            type="button"
            class="ui-button ui-button-danger-ghost ui-button-xs"
            @click="retryChunk(c)"
          >↻ {{ t('sw_ex_retry') }}</button>
        </div>
      </div>

      <!-- 错误 / 提示 / 批次结果 -->
      <p v-if="aiError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs leading-relaxed">{{ aiError }}</p>
      <p v-if="runNotice" class="ui-alert-danger mt-2 rounded-lg px-3 py-2 text-xs">{{ runNotice }}</p>
      <p v-if="batchDone && !aiRunning" class="ui-status-success mt-2 rounded-lg px-3 py-2 text-xs">
        {{ batchStopped ? t('sw_ex_stopped') : t('sw_ex_done') }}
      </p>

      <!-- 暂存表 -->
      <div v-if="staged.length" class="mt-5">
        <p class="text-sm font-bold">{{ t('sw_ex_staging', { n: staged.length }) }}</p>
        <div class="mt-2 space-y-2">
          <div v-for="(r, idx) in staged" :key="r.id" class="rounded-lg border border-border-warm bg-surface p-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-xs font-bold text-rose-accent">#{{ idx + 1 }}</span>
              <span class="min-w-0 truncate text-xs text-plum-muted">{{ t('sw_row_source') }}: {{ r.source }}</span>
              <span
                v-if="dupIds.has(r.id)"
                class="ui-chip ui-chip-sm"
                style="color: var(--color-danger); border-color: color-mix(in srgb, var(--color-danger) 40%, transparent)"
              >⚠ {{ t('sw_dup_badge') }}</span>
              <span class="ml-auto flex items-center gap-1.5">
                <template v-if="dupIds.has(r.id)">
                  <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="mergeDup(r)">⇉ {{ t('sw_dup_merge') }}</button>
                  <button type="button" class="ui-button ui-button-ghost ui-button-xs" @click="keepBoth(r)">{{ t('sw_dup_keep') }}</button>
                </template>
                <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" :aria-label="t('sw_row_delete')" @click="removeRow(r)">🗑</button>
              </span>
            </div>
            <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ToolField :label="t('sw_row_comment')">
                <input v-model="r.comment" type="text" class="ui-input w-full">
              </ToolField>
              <ToolField :label="t('sw_row_keys')">
                <ToolTagInput v-model="r.keys" />
              </ToolField>
            </div>
            <div class="mt-2">
              <ToolField :label="t('sw_row_content')">
                <textarea v-model="r.content" rows="3" class="ui-input w-full resize-y" />
              </ToolField>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="mt-5 text-center text-xs text-plum-muted">{{ t('sw_out_empty') }}</p>

      <!-- 产出动作 -->
      <div class="mt-4 border-t border-border-warm pt-4">
        <div class="flex flex-wrap items-center gap-2">
          <input
            v-model="bookName"
            type="text"
            class="ui-input ui-input-compact max-w-56 text-sm"
            :placeholder="t('sw_out_name_ph')"
          >
          <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="!staged.length" @click="saveBook">📖 {{ t('sw_out_save') }}</button>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" :disabled="!staged.length" @click="downloadBook">⇩ {{ t('sw_out_download') }}</button>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" :disabled="!staged.length" @click="onCopy">⧉ {{ copied ? t('sw_out_copied') : t('sw_out_copy') }}</button>
          <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="resetAll">↺ {{ t('sw_out_reset') }}</button>
        </div>
        <p v-if="saved" class="ui-status-success mt-2 rounded-lg px-3 py-2 text-xs">
          {{ t('sw_out_saved') }}
          <button type="button" class="ml-1 font-bold text-rose-accent underline" @click="openInForge">{{ t('sw_out_open_forge') }} →</button>
        </p>
      </div>
    </div>

    <p class="mt-6 text-center text-xs text-plum-muted">{{ t('sw_local_note') }}</p>

    <!-- 全局弹窗（BYOK 设置 / 确认框） -->
    <SettingsModal />
    <AppDialogModal />
  </div>
</template>
