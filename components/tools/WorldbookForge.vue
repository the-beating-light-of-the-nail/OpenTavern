<script setup lang="ts">
/**
 * Worldbook Forge 工作区：世界书库（新建/导入/重命名/复制/删除）+ 编辑器入口。
 * 数据存 stores/toolbox（OPFS+localStorage，浏览器本地，不上传）。
 * 弹窗：挂 AppDialogModal 复用全局确认对话框。
 * 深链接：支持 ?id=<bookId> 自动进入该书编辑视图（供其他工具带参跳转）。
 */
import { useToolboxStore } from '~/stores/toolbox';
import type { WorldbookRecord } from '~/stores/toolbox';
import { mergeWorldbookI18n, worldbookFromAny, worldbookNameFrom } from '~/utils/st/worldbook';

const toolbox = useToolboxStore();
const ui = useUiStore();
const route = useRoute();
const router = useRouter();

// wb_* 文案存于 i18n/fragments/worldbook-forge.json（独立于 locales/*.json），运行时合并；
// 切换语言时 lazy loader 会整体替换该语言消息，故 locale 变化后需重新合并
const i18n = useI18n();
const { t, locale } = i18n;
mergeWorldbookI18n(i18n);
watch(locale, () => mergeWorldbookI18n(i18n));

const editingId = ref<string | null>(null);

onMounted(async () => {
  await toolbox.load();
  // 深链接：?id=<bookId> 直接进入编辑视图（消费后清除参数，防止刷新重复跳入）
  const qid = route.query.id;
  if (typeof qid === 'string' && qid && toolbox.worldbookById(qid)) {
    editingId.value = qid;
    router.replace({ query: {} });
  }
});

/* ------------------------------ 库操作 ------------------------------ */

function createNew() {
  const rec = toolbox.addWorldbook(t('wb_default_book_name'), { entries: {} });
  editingId.value = rec.id;
}

function duplicate(id: string) {
  const rec = toolbox.worldbookById(id);
  if (!rec) return;
  toolbox.addWorldbook(rec.name + t('wb_copy_suffix'), JSON.parse(JSON.stringify(rec.data)));
}

async function remove(id: string) {
  const rec = toolbox.worldbookById(id);
  const ok = await ui.showDialog({
    message: t('wb_del_confirm', { name: rec?.name || t('wb_unnamed') }),
    showCancel: true,
    danger: true,
  });
  if (ok) toolbox.removeWorldbook(id);
}

/* ------------------------------ 重命名（行内） ------------------------------ */

const renamingId = ref<string | null>(null);
const renameDraft = ref('');
const renameOriginal = ref('');
const renameInputEl = ref<HTMLInputElement | null>(null);

function setRenameInput(el: unknown) {
  renameInputEl.value = (el as HTMLInputElement) || null;
}

function startRename(w: WorldbookRecord) {
  renamingId.value = w.id;
  renameDraft.value = w.name;
  renameOriginal.value = w.name;
  nextTick(() => renameInputEl.value?.focus());
}

function commitRename() {
  const id = renamingId.value;
  const name = renameDraft.value.trim();
  if (id && name && name !== renameOriginal.value) toolbox.updateWorldbook(id, { name });
  renamingId.value = null;
}

/* ------------------------------ 导入 ------------------------------ */

const fileInput = ref<HTMLInputElement | null>(null);

function pickImport() {
  fileInput.value?.click();
}

async function onImportInput(e: Event) {
  const input = e.target as HTMLInputElement;
  await handleFiles(Array.from(input.files || []));
  input.value = '';
}

async function handleFiles(files: File[]) {
  if (!files.length) return;
  let lastId: string | null = null;
  for (const file of files) {
    try {
      const raw = JSON.parse(await file.text());
      const book = worldbookFromAny(raw);
      if (!book) {
        await ui.showDialog({ message: t('wb_import_invalid', { name: file.name }), showCancel: false });
        continue;
      }
      const fallbackName = file.name.replace(/\.json$/i, '').trim();
      const name = worldbookNameFrom(raw) || fallbackName || t('wb_default_book_name');
      lastId = toolbox.addWorldbook(name, book).id;
    } catch {
      await ui.showDialog({ message: t('wb_import_parse_error', { name: file.name }), showCancel: false });
    }
  }
  if (lastId) editingId.value = lastId;
}

/* ------------------------------ 书卡展示 ------------------------------ */

function entryCount(w: WorldbookRecord): number {
  return w.data?.entries ? Object.keys(w.data.entries).length : 0;
}

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(locale.value);
  } catch {
    return '';
  }
}
</script>

<template>
  <div class="ui-panel-flat relative">
    <!-- 编辑器视图 -->
    <WBEditor v-if="editingId && toolbox.worldbookById(editingId)" :book-id="editingId" @close="editingId = null" />

    <!-- 库视图 -->
    <template v-else>
      <!-- 工具栏 -->
      <div class="flex flex-wrap items-center gap-2">
        <h2 class="mr-auto font-display text-lg font-semibold tracking-wide">{{ t('wb_lib_title') }}</h2>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="pickImport">⇪ {{ t('wb_import') }}</button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="createNew">＋ {{ t('wb_new') }}</button>
        <input ref="fileInput" type="file" accept=".json" multiple class="hidden" @change="onImportInput">
      </div>

      <!-- 空状态 -->
      <div v-if="!toolbox.worldbooks.length" class="mt-6">
        <ToolFileDrop accept=".json" multiple hint-key="wb_drop_hint" sub-key="wb_drop_local" @files="handleFiles" />
        <div class="mt-4 flex flex-col items-center gap-1 text-center">
          <p class="text-sm font-semibold">{{ t('wb_empty_title') }}</p>
          <p class="max-w-md text-xs leading-relaxed text-plum-muted">{{ t('wb_empty_desc') }}</p>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm mt-2" @click="createNew">＋ {{ t('wb_new') }}</button>
        </div>
      </div>

      <!-- 书卡网格 -->
      <template v-else>
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="w in toolbox.worldbooks"
            :key="w.id"
            class="group relative cursor-pointer rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            role="button"
            tabindex="0"
            @click="editingId = w.id"
            @keydown.enter.prevent="editingId = w.id"
          >
            <div class="flex items-start gap-2 pr-16">
              <span class="text-xl leading-none" aria-hidden="true">📖</span>
              <div class="min-w-0 flex-1">
                <!-- 重命名态 -->
                <input
                  v-if="renamingId === w.id"
                  v-model="renameDraft"
                  :ref="setRenameInput"
                  type="text"
                  class="ui-input w-full text-sm"
                  :aria-label="t('wb_book_name')"
                  @click.stop
                  @keydown.enter.prevent="commitRename"
                  @keydown.escape="renamingId = null"
                  @blur="commitRename"
                >
                <template v-else>
                  <p class="truncate text-sm font-semibold">{{ w.name || t('wb_unnamed') }}</p>
                </template>
                <p class="mt-0.5 text-[11px] text-plum-muted">
                  {{ t('wb_entries_count', { n: entryCount(w) }) }} · {{ fmtDate(w.updated) }}
                </p>
              </div>
            </div>
            <div class="absolute bottom-2.5 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" class="ui-button ui-button-ghost ui-button-xs !bg-surface" :title="t('wb_rename')" @click.stop="startRename(w)">✎</button>
              <button type="button" class="ui-button ui-button-ghost ui-button-xs !bg-surface" :title="t('wb_dup')" @click.stop="duplicate(w.id)">⧉</button>
              <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs !bg-surface" :title="t('wb_del')" @click.stop="remove(w.id)">🗑</button>
            </div>
          </div>
        </div>

        <p class="mt-6 text-center text-xs text-plum-muted">{{ t('wb_local_note') }}</p>
      </template>
    </template>

    <!-- 全局确认对话框 -->
    <AppDialogModal />
  </div>
</template>
