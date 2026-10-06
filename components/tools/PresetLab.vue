<script setup lang="ts">
/**
 * Preset Lab 工作区：预设库（导入/新建/重命名/复制/删除）+ 编辑器入口。
 * 数据存 stores/toolbox（OPFS+localStorage，浏览器本地，不上传）。
 * 导入：任何 JSON 都收——有 prompts 数组按正常预设编辑；没有先 ui.showDialog 警告，
 * 仍导入为 raw 保存（round-trip：raw 永远是完整原始 JSON）。
 * 弹窗：挂 SettingsModal / AppDialogModal 复用全局确认对话框。
 */
import { useToolboxStore } from '~/stores/toolbox';
import type { PresetRecord } from '~/stores/toolbox';
import { emptyPreset, isEditablePreset } from '~/utils/st/preset';

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t, locale } = useI18n();

const editingId = ref<string | null>(null);

onMounted(() => toolbox.load());

/* ------------------------------ 库视图 ------------------------------ */

const presets = computed<PresetRecord[]>(() => [...toolbox.presets].sort((a, b) => b.updated - a.updated));

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(locale.value);
  } catch {
    return '';
  }
}

/** prompts 数量；无 prompts 数组返回 -1（显示 raw 徽标） */
function promptCount(rec: PresetRecord): number {
  return Array.isArray(rec.raw?.prompts) ? rec.raw.prompts.length : -1;
}

/* ------------------------------ 导入 ------------------------------ */

const fileInput = ref<HTMLInputElement | null>(null);
const importing = ref(false);

function pickImport() {
  fileInput.value?.click();
}

async function onImportInput(e: Event) {
  const input = e.target as HTMLInputElement;
  await handleFiles(Array.from(input.files || []));
  input.value = '';
}

async function handleFiles(files: File[]) {
  if (!files.length || importing.value) return;
  importing.value = true;
  let lastId: string | null = null;
  for (const file of files) {
    let parsed: Record<string, any>;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      await ui.showDialog({ message: t('pl_import_parse_error', { name: file.name }), showCancel: false });
      continue;
    }
    // 有 prompts 数组 → 正常预设；没有 → 警告后仍按 raw JSON 导入保存
    if (!isEditablePreset(parsed)) {
      await ui.showDialog({ message: t('pl_import_raw_warning', { name: file.name }), showCancel: false });
    }
    const name = file.name.replace(/\.json$/i, '').trim() || t('pl_unnamed');
    lastId = toolbox.addPreset(name, parsed).id;
  }
  importing.value = false;
  if (lastId) editingId.value = lastId;
}

/* ------------------------------ 库操作 ------------------------------ */

function createNew() {
  const rec = toolbox.addPreset(t('pl_unnamed'), emptyPreset());
  editingId.value = rec.id;
}

function duplicate(id: string) {
  const src = toolbox.presetById(id);
  if (!src) return;
  const name = src.name ? `${src.name} (${t('pl_copy_suffix')})` : t('pl_unnamed');
  const rec = toolbox.addPreset(name, JSON.parse(JSON.stringify(src.raw)));
  editingId.value = rec.id;
}

async function remove(id: string) {
  const rec = toolbox.presetById(id);
  const ok = await ui.showDialog({
    message: t('pl_del_confirm', { name: rec?.name || t('pl_unnamed') }),
    showCancel: true,
    danger: true,
  });
  if (ok) toolbox.removePreset(id);
}

/* ------------------------------ 重命名（卡片内联） ------------------------------ */

const renamingId = ref<string | null>(null);
const renameValue = ref('');
const renameInput = ref<HTMLInputElement | null>(null);

/** 函数式 ref：v-for 内的模板 ref 会变成数组，改用回调确保拿到单个元素 */
function setRenameEl(el: any) {
  renameInput.value = el;
}

function startRename(rec: PresetRecord) {
  renamingId.value = rec.id;
  renameValue.value = rec.name;
  nextTick(() => renameInput.value?.focus());
}

function commitRename() {
  const id = renamingId.value;
  renamingId.value = null;
  if (!id) return;
  const v = renameValue.value.trim();
  if (v) toolbox.updatePreset(id, { name: v });
}
</script>

<template>
  <div class="ui-panel-flat relative">
    <!-- 编辑器视图（:key 保证切换预设时重建工作副本） -->
    <PLPresetEditor v-if="editingId" :key="editingId" :preset-id="editingId" @close="editingId = null" />

    <!-- 库视图 -->
    <template v-else>
      <!-- 工具栏 -->
      <div class="flex flex-wrap items-center gap-2">
        <h2 class="mr-auto font-display text-lg font-semibold tracking-wide">🧪 {{ t('pl_lib_title') }}</h2>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="pickImport">⇪ {{ t('pl_import') }}</button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="createNew">＋ {{ t('pl_new') }}</button>
        <input ref="fileInput" type="file" accept=".json" multiple class="hidden" @change="onImportInput">
      </div>

      <!-- 空状态 -->
      <div v-if="!toolbox.presets.length" class="mt-6">
        <ToolFileDrop accept=".json" multiple hint-key="pl_drop_hint" sub-key="pl_drop_local" @files="handleFiles" />
        <div class="mt-4 flex flex-col items-center gap-1 text-center">
          <p class="text-sm font-semibold">{{ t('pl_empty_title') }}</p>
          <p class="max-w-md text-xs leading-relaxed text-plum-muted">{{ t('pl_empty_desc') }}</p>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm mt-2" @click="createNew">＋ {{ t('pl_new') }}</button>
        </div>
      </div>

      <!-- 预设卡网格 -->
      <template v-else>
        <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="rec in presets"
            :key="rec.id"
            class="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            role="button"
            tabindex="0"
            @click="editingId = rec.id"
            @keydown.enter.prevent="editingId = rec.id"
          >
            <!-- 头部装饰带 -->
            <div class="relative flex h-16 items-center justify-center bg-rose-tint">
              <span class="font-display text-3xl" aria-hidden="true">🎚️</span>
              <span
                class="absolute left-2 top-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm"
              >{{ promptCount(rec) >= 0 ? t('pl_prompts_count', { n: promptCount(rec) }) : t('pl_raw_badge') }}</span>
            </div>
            <div class="p-2.5">
              <input
                v-if="renamingId === rec.id"
                :ref="setRenameEl"
                v-model="renameValue"
                type="text"
                class="ui-input ui-input-compact w-full text-sm"
                :placeholder="t('pl_rename_ph')"
                @click.stop
                @keydown.enter.prevent="commitRename"
                @blur="commitRename"
              >
              <p v-else class="truncate text-sm font-semibold">{{ rec.name || t('pl_unnamed') }}</p>
              <p class="mt-0.5 text-[11px] text-plum-muted">
                {{ isEditablePreset(rec.raw) ? t('pl_kind_preset') : t('pl_raw_badge') }} · {{ fmtDate(rec.updated) }}
              </p>
              <div class="absolute bottom-2.5 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" class="ui-button ui-button-ghost ui-button-xs !bg-surface" :title="t('pl_rename')" @click.stop="startRename(rec)">✎</button>
                <button type="button" class="ui-button ui-button-ghost ui-button-xs !bg-surface" :title="t('pl_dup')" @click.stop="duplicate(rec.id)">⧉</button>
                <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs !bg-surface" :title="t('pl_del')" @click.stop="remove(rec.id)">🗑</button>
              </div>
            </div>
          </div>
        </div>

        <p class="mt-6 text-center text-xs text-plum-muted">{{ t('pl_local_note') }}</p>
      </template>
    </template>

    <!-- 全局弹窗（确认框） -->
    <SettingsModal />
    <AppDialogModal />
  </div>
</template>
