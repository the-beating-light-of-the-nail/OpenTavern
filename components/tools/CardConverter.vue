<script setup lang="ts">
/**
 * Card Converter 工作区：外来角色卡 → SillyTavern 角色卡。
 * 导入（文件拖放 / 粘贴 JSON）→ 来源识别 + 同义词字段映射 → 转换预览
 * （来源徽标 / 可编辑卡名 / 已填充字段与字数 / 完整度评分 / 未映射键 / 头像）
 * → 导出 V2/V3 JSON、PNG（exportCardPng，JSON 来源用占位图）或存入 Card Studio。
 * 全程浏览器本地处理，不上传。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { useUiStore } from '~/stores/ui';
import { detectForeignFormat, foreignToCardData, mergeCardConverterI18n } from '~/utils/st/foreign-cards';
import type { ForeignSource } from '~/utils/st/foreign-cards';
import { normalizeToCard } from '~/utils/st/convert';
import { readPngCard, fileToPngDataUrl } from '~/utils/st/png';
import { exportCardJson, exportCardPng } from '~/utils/st/export';
import { scoreCard } from '~/utils/st/score';
import { makeId } from '~/utils/chat-helpers';
import type { CharacterCard } from '~/utils/st/types';

const toolbox = useToolboxStore();
const ui = useUiStore();

// cc_* 文案存于 i18n/fragments/card-converter.json（独立于 locales/*.json），运行时合并；
// 切换语言时 lazy loader 会整体替换该语言消息，故 locale 变化后需重新合并
const i18n = useI18n();
const { t, locale } = i18n;
mergeCardConverterI18n(i18n);
watch(locale, () => mergeCardConverterI18n(i18n));

onMounted(() => toolbox.load());

/* ------------------------------ 转换列表 ------------------------------ */

interface ConversionItem {
  id: string;
  fileName: string;
  source: ForeignSource;
  /** 来源徽标文案（i18n key，cc_src_*） */
  sourceLabel: string;
  /** 转换后的完整卡（V2 形态，data.name 可编辑） */
  card: CharacterCard;
  /** PNG 来源头像（dataURL；JSON 来源无，导出 PNG 时用占位图） */
  avatar?: string;
  /** 没映射走的多余键名（展示给用户） */
  unmapped: string[];
  /** 是否已存入 Card Studio（行内提示，防重复入库） */
  saved: boolean;
}

const items = ref<ConversionItem[]>([]);

/* ------------------------------ 导入 ------------------------------ */

const pasteText = ref('');
const importing = ref(false);

async function handleFiles(files: File[]) {
  if (!files.length || importing.value) return;
  importing.value = true;
  for (const file of files) {
    try {
      if (file.name.toLowerCase().endsWith('.png')) {
        // PNG：读内嵌角色卡 + 保留头像
        const bytes = new Uint8Array(await file.arrayBuffer());
        const found = readPngCard(bytes);
        if (!found) {
          await ui.showDialog({ message: t('cc_err_no_card', { name: file.name }), showCancel: false });
          continue;
        }
        await stageOne(found.card, file.name, await fileToPngDataUrl(file));
      } else {
        // JSON：解析失败走统一 catch
        stageParsed(JSON.parse(await file.text()), file.name);
      }
    } catch {
      await ui.showDialog({ message: t('cc_err_parse', { name: file.name }), showCancel: false });
    }
  }
  importing.value = false;
}

/** 粘贴的 JSON → 解析并暂存（支持单个对象或数组） */
async function parsePaste() {
  const text = pasteText.value.trim();
  if (!text) return;
  try {
    stageParsed(JSON.parse(text), t('cc_pasted'));
    pasteText.value = '';
  } catch {
    await ui.showDialog({ message: t('cc_err_empty'), showCancel: false });
  }
}

function stageParsed(parsed: unknown, fileName: string) {
  if (Array.isArray(parsed)) {
    for (const p of parsed) void stageOne(p, fileName);
  } else {
    void stageOne(parsed, fileName);
  }
}

/** 单个来源 → 识别 + 映射 + 包装成完整卡 + 暂存 */
async function stageOne(raw: unknown, fileName: string, avatar?: string) {
  const fmt = detectForeignFormat(raw);
  if (fmt.source === 'unknown') {
    await ui.showDialog({ message: t('cc_err_unknown', { name: fileName }), showCancel: false });
    return;
  }
  const { data, unmapped } = foreignToCardData(raw, fmt.source);
  const card = normalizeToCard({ data });
  items.value.push({ id: makeId(), fileName, source: fmt.source, sourceLabel: fmt.label, card, avatar, unmapped, saved: false });
}

/* ------------------------------ 预览 ------------------------------ */

/** 完整度分（0-100） */
function scoreOf(item: ConversionItem): number {
  return scoreCard(item.card).score;
}

/** 评分颜色：语义 CSS 变量（分档对齐 CardEditor） */
function scoreColor(item: ConversionItem): string {
  const s = scoreOf(item);
  return s >= 80 ? 'var(--color-success)' : s >= 50 ? 'var(--color-rose-accent)' : 'var(--color-danger)';
}

/** 头像兜底：名字首字符 */
function initial(item: ConversionItem): string {
  return (item.card.data.name || '?').trim().charAt(0).toUpperCase() || '?';
}

/** 已填充字段定义（name 单独可编辑，不进列表） */
const FIELD_DEFS: Array<{ key: string; field: string }> = [
  { key: 'cc_f_description', field: 'description' },
  { key: 'cc_f_personality', field: 'personality' },
  { key: 'cc_f_scenario', field: 'scenario' },
  { key: 'cc_f_first_mes', field: 'first_mes' },
  { key: 'cc_f_mes_example', field: 'mes_example' },
  { key: 'cc_f_creator_notes', field: 'creator_notes' },
  { key: 'cc_f_system_prompt', field: 'system_prompt' },
  { key: 'cc_f_phi', field: 'post_history_instructions' },
  { key: 'cc_f_alt_greetings', field: 'alternate_greetings' },
  { key: 'cc_f_tags', field: 'tags' },
  { key: 'cc_f_book', field: 'character_book' },
];

interface FilledField { label: string; count: string }

/** 已填充字段列表：字符串报字数、数组报条数、世界书报条目数 */
function filledFields(item: ConversionItem): FilledField[] {
  const out: FilledField[] = [];
  const d = item.card.data as Record<string, any>;
  for (const def of FIELD_DEFS) {
    const v = d[def.field];
    if (def.field === 'character_book') {
      const n = Array.isArray(v?.entries) ? v.entries.length : 0;
      if (n) out.push({ label: t(def.key), count: t('cc_len_count', { n }) });
      continue;
    }
    if (Array.isArray(v)) {
      if (v.length) out.push({ label: t(def.key), count: t('cc_len_count', { n: v.length }) });
    } else if (typeof v === 'string' && v.trim()) {
      out.push({ label: t(def.key), count: t('cc_len_chars', { n: v.length }) });
    }
  }
  return out;
}

/* ------------------------------ 动作 ------------------------------ */

function exportJson(item: ConversionItem, spec: 'v2' | 'v3') {
  exportCardJson(item.card, spec);
}

async function exportPng(item: ConversionItem) {
  try {
    // JSON 来源没有头像时，exportCardPng 内部会生成名字首字符占位图
    await exportCardPng(item.card, item.avatar || null);
  } catch {
    await ui.showDialog({ message: t('cc_err_png'), showCancel: false });
  }
}

/** 逐个导出 V2 JSON（间隔触发，避免浏览器拦截多文件下载） */
async function exportAll() {
  let first = true;
  for (const item of items.value) {
    if (!first) await new Promise((r) => setTimeout(r, 250));
    exportCardJson(item.card, 'v2');
    first = false;
  }
}

function saveItem(item: ConversionItem) {
  // 深拷贝入库：暂存项改名不影响已入库的卡
  toolbox.addCard(JSON.parse(JSON.stringify(item.card)), item.avatar);
  item.saved = true;
}

async function saveAll() {
  let n = 0;
  for (const item of items.value) {
    if (item.saved) continue;
    toolbox.addCard(JSON.parse(JSON.stringify(item.card)), item.avatar);
    item.saved = true;
    n++;
  }
  if (n) await ui.showDialog({ message: t('cc_saved_all', { n }), showCancel: false });
}

function removeItem(id: string) {
  items.value = items.value.filter((x) => x.id !== id);
}
</script>

<template>
  <div class="ui-panel-flat relative">
    <!-- 导入区：文件拖放 + 粘贴 JSON -->
    <ToolFileDrop accept=".json,.png" multiple hint-key="cc_drop_hint" sub-key="cc_drop_local" @files="handleFiles" />
    <div class="mt-3">
      <textarea
        v-model="pasteText"
        rows="3"
        class="ui-input w-full font-mono text-xs"
        :placeholder="t('cc_paste_ph')"
        @keydown.enter.ctrl.prevent="parsePaste"
        @keydown.enter.meta.prevent="parsePaste"
      ></textarea>
      <div class="mt-2 flex justify-end">
        <button type="button" class="ui-button ui-button-secondary ui-button-sm" :disabled="importing" @click="parsePaste">✓ {{ t('cc_parse') }}</button>
      </div>
    </div>

    <!-- 转换列表 -->
    <template v-if="items.length">
      <div class="mt-5 flex flex-wrap items-center gap-2">
        <h3 class="mr-auto font-display text-base font-semibold tracking-wide">
          {{ t('cc_list_title') }}
          <span class="ml-1 text-xs font-normal text-plum-muted">{{ t('cc_count', { n: items.length }) }}</span>
        </h3>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="exportAll">⇪ {{ t('cc_btn_export_all') }}</button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="saveAll">＋ {{ t('cc_btn_save_all') }}</button>
      </div>

      <div class="mt-3 flex flex-col gap-3">
        <div v-for="item in items" :key="item.id" class="rounded-xl border border-border bg-surface p-4">
          <!-- 头部：头像 / 来源徽标 / 文件名 / 评分 -->
          <div class="flex items-start gap-3">
            <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-rose-tint">
              <img v-if="item.avatar" :src="item.avatar" :alt="item.card.data.name" class="h-full w-full object-cover">
              <div v-else class="flex h-full w-full items-center justify-center font-display text-xl text-plum-muted">{{ initial(item) }}</div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <span class="rounded-full bg-rose-tint px-2 py-0.5 text-[11px] font-semibold text-plum">{{ t(item.sourceLabel) }}</span>
                <span class="truncate text-[11px] text-plum-muted">{{ item.fileName }}</span>
                <span
                  class="ml-auto rounded-md border px-1.5 py-0.5 text-[11px] font-bold"
                  :style="{ color: scoreColor(item), borderColor: scoreColor(item) }"
                  :title="t('cc_score_title')"
                >{{ t('cc_score', { n: scoreOf(item) }) }}</span>
              </div>
              <!-- 卡名（可编辑） -->
              <label class="mt-2 flex items-center gap-2">
                <span class="flex-shrink-0 text-xs font-semibold text-plum-muted">{{ t('cc_name_label') }}</span>
                <input
                  v-model="item.card.data.name"
                  type="text"
                  class="ui-input ui-input-compact min-w-0 flex-1 text-sm"
                  :placeholder="t('cc_unnamed')"
                  :aria-label="t('cc_name_label')"
                >
              </label>
            </div>
            <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" :title="t('cc_del')" :aria-label="t('cc_del')" @click="removeItem(item.id)">🗑</button>
          </div>

          <!-- 已填充字段（字段名 + 字数/条数） -->
          <div class="mt-3 flex flex-wrap gap-1.5">
            <template v-if="filledFields(item).length">
              <span
                v-for="f in filledFields(item)"
                :key="f.label"
                class="rounded-md border border-border-warm bg-bg px-2 py-0.5 text-[11px] text-plum-muted"
              >{{ f.label }} · {{ f.count }}</span>
            </template>
            <span v-else class="text-[11px] text-plum-muted">{{ t('cc_fields_empty') }}</span>
          </div>

          <!-- 未映射键提示 -->
          <div v-if="item.unmapped.length" class="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-plum-muted">
            <span class="font-semibold">{{ t('cc_unmapped_title') }}:</span>
            <code v-for="k in item.unmapped" :key="k" class="rounded bg-rose-tint px-1.5 py-0.5 text-[10px] text-plum">{{ k }}</code>
          </div>

          <!-- 单卡动作 -->
          <div class="mt-3 flex flex-wrap items-center gap-2">
            <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="exportJson(item, 'v2')">{{ t('cc_btn_export_v2') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="exportJson(item, 'v3')">{{ t('cc_btn_export_v3') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="exportPng(item)">{{ t('cc_btn_export_png') }}</button>
            <button v-if="!item.saved" type="button" class="ui-button ui-button-secondary ui-button-sm" @click="saveItem(item)">＋ {{ t('cc_btn_save') }}</button>
            <span v-else class="text-xs font-semibold text-rose-accent">✓ {{ t('cc_saved') }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 空态 -->
    <div v-else class="mt-6 flex flex-col items-center gap-1 text-center">
      <p class="text-sm font-semibold">{{ t('cc_empty_title') }}</p>
      <p class="max-w-md text-xs leading-relaxed text-plum-muted">{{ t('cc_empty_desc') }}</p>
    </div>

    <p class="mt-6 text-center text-xs text-plum-muted">{{ t('cc_local_note') }}</p>

    <!-- 全局确认/提示对话框 -->
    <AppDialogModal />
  </div>
</template>
