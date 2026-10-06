<script setup lang="ts">
/**
 * 世界书编辑器：顶栏（书名行内编辑/条目计数/token 估算/导出菜单）+
 * 条目列表（HTML5 拖拽排序 + 上下移兜底 + 批量操作）+ 右侧命中预览。
 *
 * 编辑即保存：表单直接改 store 内 record.data，深 watch 用「快照比对」守卫——
 * updateWorldbook 会把 data 换成深拷贝（新对象），快照一致时跳过，避免循环触发。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { toLorebookV3 } from '~/utils/st/convert';
import { downloadJson, safeFilename } from '~/utils/st/export';
import { estimateTokens, makeEntry, nextUid, sortedEntries } from '~/utils/st/worldbook';
import type { WorldInfoEntry } from '~/utils/st/types';
import { WI_POSITION } from '~/utils/st/types';

const props = defineProps<{ bookId: string }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t } = useI18n();

const rec = computed(() => toolbox.worldbookById(props.bookId));

/* ------------------------------ 编辑即保存 ------------------------------ */

const lastSnap = ref('');

function saveBook() {
  const r = rec.value;
  if (!r) return;
  const snap = JSON.stringify(r.data);
  lastSnap.value = snap;
  toolbox.updateWorldbook(props.bookId, { data: JSON.parse(snap) });
}

watch(
  rec,
  (r) => {
    if (!r) return;
    const snap = JSON.stringify(r.data);
    if (snap === lastSnap.value) return;
    lastSnap.value = snap;
    toolbox.updateWorldbook(props.bookId, { data: JSON.parse(snap) });
  },
  { deep: true },
);

/** 书名行内编辑：名字在 record 上，不在 data 快照里，直接走 updateWorldbook */
function onNameInput(e: Event) {
  toolbox.updateWorldbook(props.bookId, { name: (e.target as HTMLInputElement).value });
}

/* ------------------------------ 派生数据 ------------------------------ */

const entries = computed<WorldInfoEntry[]>(() => sortedEntries(rec.value?.data));
const entryCount = computed(() => entries.value.length);
const tokenEst = computed(() => estimateTokens(rec.value?.data));

/* ------------------------------ 展开 / 批量选择 / 拖拽 ------------------------------ */

const expandedUid = ref<number | null>(null);
const batchMode = ref(false);
const selected = ref<Set<number>>(new Set());
const dragUid = ref<number | null>(null);
const dragOverUid = ref<number | null>(null);

function toggleExpand(uid: number) {
  expandedUid.value = expandedUid.value === uid ? null : uid;
}

function toggleSelect(uid: number) {
  const s = new Set(selected.value);
  if (s.has(uid)) s.delete(uid);
  else s.add(uid);
  selected.value = s;
}

function exitBatch() {
  batchMode.value = false;
  selected.value = new Set();
}

/** 重排后把 order 重编为 1..N */
function renumber(list: WorldInfoEntry[]) {
  list.forEach((e, i) => {
    e.order = i + 1;
  });
}

function moveEntry(from: number, to: number) {
  const list = entries.value; // computed 快照数组，元素是 store 内对象引用
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) return;
  const [moved] = list.splice(from, 1);
  list.splice(to, 0, moved);
  renumber(list);
  saveBook();
}

function onDragStart(e: DragEvent, uid: number) {
  dragUid.value = uid;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(uid)); // Firefox 需要 setData 才能发起拖拽
  }
}

function onDragOver(_e: DragEvent, uid: number) {
  if (dragUid.value !== null && dragUid.value !== uid) dragOverUid.value = uid;
}

function onDrop(_e: DragEvent, uid: number) {
  const from = entries.value.findIndex((x) => x.uid === dragUid.value);
  const to = entries.value.findIndex((x) => x.uid === uid);
  dragUid.value = null;
  dragOverUid.value = null;
  if (from < 0 || to < 0) return;
  moveEntry(from, to);
}

function onDragEnd() {
  dragUid.value = null;
  dragOverUid.value = null;
}

/* ------------------------------ 条目增删 ------------------------------ */

function addEntry() {
  const r = rec.value;
  if (!r) return;
  if (!r.data.entries || typeof r.data.entries !== 'object') r.data.entries = {};
  const uid = nextUid(r.data);
  const entry = makeEntry(uid);
  entry.order = entries.value.length + 1;
  r.data.entries[String(uid)] = entry;
  expandedUid.value = uid;
  saveBook();
}

async function removeEntry(uid: number) {
  const r = rec.value;
  if (!r) return;
  delete r.data.entries[String(uid)];
  if (expandedUid.value === uid) expandedUid.value = null;
  const s = new Set(selected.value);
  s.delete(uid);
  selected.value = s;
  saveBook();
}

/* ------------------------------ 批量操作 ------------------------------ */

function batchPatch(fn: (entry: WorldInfoEntry) => void) {
  const r = rec.value;
  if (!r || !selected.value.size) return;
  for (const uid of selected.value) {
    const entry = r.data.entries?.[String(uid)];
    if (entry && typeof entry === 'object') fn(entry);
  }
  saveBook();
}

function batchSetDisabled(disable: boolean) {
  batchPatch((e) => {
    e.disable = disable;
  });
}

function batchSetPosition(pos: number) {
  batchPatch((e) => {
    e.position = pos;
  });
}

function batchSetProbability(p: number) {
  batchPatch((e) => {
    e.probability = p;
    e.useProbability = true;
  });
}

function batchRenumber() {
  renumber(entries.value);
  saveBook();
}

async function batchDelete() {
  const r = rec.value;
  if (!r || !selected.value.size) return;
  const ok = await ui.showDialog({
    message: t('wb_batch_del_confirm', { n: selected.value.size }),
    showCancel: true,
    danger: true,
  });
  if (!ok) return;
  for (const uid of selected.value) delete r.data.entries[String(uid)];
  selected.value = new Set();
  saveBook();
}

const batchPos = ref<number>(WI_POSITION.BEFORE_CHAR);
const batchProb = ref<number>(100);
const positionOptions = computed(() =>
  [
    WI_POSITION.BEFORE_CHAR,
    WI_POSITION.AFTER_CHAR,
    WI_POSITION.AN_TOP,
    WI_POSITION.AN_BOTTOM,
    WI_POSITION.AT_DEPTH,
    WI_POSITION.EM_TOP,
    WI_POSITION.EM_BOTTOM,
  ].map((v) => ({ v, label: t(`wb_pos_${v}`) })),
);

/* ------------------------------ 导出 ------------------------------ */

const exportOpen = ref(false);
const exportEl = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (exportOpen.value && exportEl.value && !exportEl.value.contains(e.target as Node)) exportOpen.value = false;
}
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

function doExport(kind: 'st' | 'v3') {
  exportOpen.value = false;
  const r = rec.value;
  if (!r) return;
  const filename = safeFilename(r.name || 'worldbook');
  if (kind === 'v3') {
    downloadJson(`${filename}_v3_lorebook.json`, toLorebookV3(r.data));
  } else {
    // ST 世界书：data 本体（深拷贝快照，避免下载过程被并发编辑影响）
    downloadJson(`${filename}.json`, JSON.parse(JSON.stringify(r.data)));
  }
}
</script>

<template>
  <div v-if="rec">
    <!-- 顶栏 -->
    <div class="flex flex-wrap items-center gap-2 sm:gap-3">
      <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="emit('close')">← {{ t('wb_back_lib') }}</button>
      <input
        :value="rec.name"
        type="text"
        class="ui-input ui-input-compact min-w-0 flex-1 text-sm font-semibold sm:max-w-xs"
        :aria-label="t('wb_book_name')"
        :placeholder="t('wb_unnamed')"
        @input="onNameInput"
      >
      <span class="whitespace-nowrap text-xs text-plum-muted">{{ t('wb_entries_count', { n: entryCount }) }}</span>
      <span class="whitespace-nowrap rounded-md bg-rose-tint px-2 py-0.5 text-xs font-medium text-plum-muted">{{ t('wb_tokens', { n: tokenEst }) }}</span>
      <div ref="exportEl" class="relative ml-auto">
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click.stop="exportOpen = !exportOpen">
          {{ t('wb_export') }} ▾
        </button>
        <div v-if="exportOpen" class="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
          <button type="button" class="block w-full px-4 py-2 text-left text-sm hover:bg-rose-tint" @click="doExport('st')">{{ t('wb_export_st') }}</button>
          <button type="button" class="block w-full px-4 py-2 text-left text-sm hover:bg-rose-tint" @click="doExport('v3')">{{ t('wb_export_v3') }}</button>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="mt-3 flex flex-wrap items-center gap-2">
      <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="addEntry">＋ {{ t('wb_add_entry') }}</button>
      <button type="button" class="ui-chip ui-chip-sm" :class="{ active: batchMode }" @click="batchMode ? exitBatch() : (batchMode = true)">
        ☑ {{ t('wb_batch') }}
      </button>

      <!-- 批量工具条 -->
      <template v-if="batchMode">
        <span class="text-xs font-semibold text-plum-muted">{{ t('wb_batch_selected', { n: selected.size }) }}</span>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="!selected.size" @click="batchSetDisabled(false)">{{ t('wb_batch_enable') }}</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="!selected.size" @click="batchSetDisabled(true)">{{ t('wb_batch_disable') }}</button>
        <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" :disabled="!selected.size" @click="batchDelete">{{ t('wb_batch_delete') }}</button>
        <span class="flex items-center gap-1">
          <select v-model.number="batchPos" class="ui-input ui-input-compact w-auto text-xs" :aria-label="t('wb_batch_position')">
            <option v-for="p in positionOptions" :key="p.v" :value="p.v">{{ p.label }}</option>
          </select>
          <button type="button" class="ui-button ui-button-secondary ui-button-xs" :disabled="!selected.size" @click="batchSetPosition(batchPos)">{{ t('wb_apply') }}</button>
        </span>
        <span class="flex items-center gap-1">
          <input v-model.number="batchProb" type="number" min="0" max="100" class="ui-input ui-input-compact w-16 text-xs" :aria-label="t('wb_batch_probability')">
          <button type="button" class="ui-button ui-button-secondary ui-button-xs" :disabled="!selected.size" @click="batchSetProbability(batchProb)">{{ t('wb_apply') }}</button>
        </span>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="!entries.length" @click="batchRenumber">{{ t('wb_batch_renumber') }}</button>
      </template>
    </div>

    <!-- 条目列表 + 命中预览（窄屏上下、宽屏左右） -->
    <div class="mt-4 flex flex-col gap-4 xl:flex-row xl:items-start">
      <div class="min-w-0 flex-1 space-y-2">
        <p v-if="!entries.length" class="rounded-lg border border-dashed border-border p-4 text-center text-xs text-plum-muted">
          {{ t('wb_entries_empty') }}
        </p>
        <WBEntryCard
          v-for="(entry, i) in entries"
          :key="entry.uid"
          :entry="entry"
          :index="i"
          :batch-mode="batchMode"
          :selected="selected.has(entry.uid)"
          :expanded="expandedUid === entry.uid"
          :dragging="dragUid === entry.uid"
          :drag-over="dragOverUid === entry.uid"
          @toggle="toggleExpand(entry.uid)"
          @select="toggleSelect(entry.uid)"
          @move="(d) => moveEntry(i, i + d)"
          @remove="removeEntry(entry.uid)"
          @drag-start="onDragStart($event, entry.uid)"
          @drag-over="onDragOver($event, entry.uid)"
          @drop="onDrop($event, entry.uid)"
          @drag-end="onDragEnd"
        />
      </div>
      <div class="w-full flex-shrink-0 xl:w-80">
        <WBPreview v-if="rec" :book="rec.data" />
      </div>
    </div>
  </div>
</template>
