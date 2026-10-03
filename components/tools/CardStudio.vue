<script setup lang="ts">
/**
 * 角色卡工作室工作区：角色库（创建/导入/搜索/标签/收藏/复制/删除）+ 编辑器入口。
 * 数据存 stores/toolbox（OPFS+localStorage，浏览器本地，不上传）。
 * 弹窗：挂 SettingsModal / AppDialogModal 复用全局 BYOK 设置与确认对话框。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { normalizeToCard, emptyCard, detectCardSpec } from '~/utils/st/convert';
import { readPngCard, fileToPngDataUrl } from '~/utils/st/png';
import type { CharacterCard } from '~/utils/st/types';

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t, locale } = useI18n();

const editingId = ref<string | null>(null);

onMounted(() => toolbox.load());

/* ------------------------------ 库视图状态 ------------------------------ */

const search = ref('');
const activeTag = ref('');
const sortBy = ref<'updated' | 'name'>('updated');

const allTags = computed(() => {
  const set = new Set<string>();
  for (const c of toolbox.cards) {
    for (const tag of c.raw?.data?.tags || []) set.add(tag);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
});

const filteredCards = computed(() => {
  const q = search.value.trim().toLowerCase();
  let list = toolbox.cards.filter((c) => {
    if (activeTag.value && !(c.raw?.data?.tags || []).includes(activeTag.value)) return false;
    if (!q) return true;
    const hay = `${c.raw?.data?.name || ''} ${c.raw?.data?.description || ''} ${(c.raw?.data?.tags || []).join(' ')}`.toLowerCase();
    return hay.includes(q);
  });
  if (sortBy.value === 'name') {
    list = [...list].sort((a, b) => (a.raw?.data?.name || '').localeCompare(b.raw?.data?.name || ''));
  } else {
    list = [...list].sort((a, b) => b.updated - a.updated);
  }
  // 收藏置顶
  return [...list.filter((c) => c.favorite), ...list.filter((c) => !c.favorite)];
});

function specLabel(rec: { raw: CharacterCard }): string {
  const spec = detectCardSpec(rec.raw);
  return spec === 'v3' ? 'V3' : spec === 'v2' ? 'V2' : spec === 'v1' ? 'V1' : '—';
}

function fmtDate(ts: number): string {
  try {
    return new Date(ts).toLocaleDateString(locale.value);
  } catch {
    return '';
  }
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
    try {
      if (file.name.toLowerCase().endsWith('.png')) {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const found = readPngCard(bytes);
        if (!found) {
          await ui.showDialog({ message: t('cs_import_no_card', { name: file.name }), showCancel: false });
          continue;
        }
        const card = normalizeToCard(found.card);
        const avatar = await fileToPngDataUrl(file);
        lastId = toolbox.addCard(card, avatar).id;
      } else {
        const json = JSON.parse(await file.text());
        const card = normalizeToCard(json);
        if (!card.data.name && !card.data.description) {
          await ui.showDialog({ message: t('cs_import_invalid', { name: file.name }), showCancel: false });
          continue;
        }
        lastId = toolbox.addCard(card).id;
      }
    } catch {
      await ui.showDialog({ message: t('cs_import_parse_error', { name: file.name }), showCancel: false });
    }
  }
  importing.value = false;
  if (lastId) editingId.value = lastId;
}

/* ------------------------------ 库操作 ------------------------------ */

function createNew() {
  const rec = toolbox.addCard(emptyCard(''));
  editingId.value = rec.id;
}

function duplicate(id: string) {
  const rec = toolbox.duplicateCard(id);
  if (rec) editingId.value = rec.id;
}

async function remove(id: string) {
  const rec = toolbox.cardById(id);
  const ok = await ui.showDialog({
    message: t('cs_del_confirm', { name: rec?.raw?.data?.name || '—' }),
    showCancel: true,
    danger: true,
  });
  if (ok) toolbox.removeCard(id);
}
</script>

<template>
  <div class="ui-panel-flat relative">
    <!-- 编辑器视图 -->
    <CardEditor v-if="editingId" :card-id="editingId" @close="editingId = null" />

    <!-- 库视图 -->
    <template v-else>
      <!-- 工具栏 -->
      <div class="flex flex-wrap items-center gap-2">
        <h2 class="mr-auto font-display text-lg font-semibold tracking-wide">{{ t('cs_lib_title') }}</h2>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="pickImport">⇪ {{ t('cs_import') }}</button>
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="createNew">＋ {{ t('cs_new') }}</button>
        <input ref="fileInput" type="file" accept=".json,.png" multiple class="hidden" @change="onImportInput">
      </div>

      <!-- 空状态 -->
      <div v-if="!toolbox.cards.length" class="mt-6">
        <ToolFileDrop accept=".json,.png" multiple @files="handleFiles" />
        <div class="mt-4 flex flex-col items-center gap-1 text-center">
          <p class="text-sm font-semibold">{{ t('cs_empty_title') }}</p>
          <p class="max-w-md text-xs leading-relaxed text-plum-muted">{{ t('cs_empty_desc') }}</p>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm mt-2" @click="createNew">＋ {{ t('cs_new') }}</button>
        </div>
      </div>

      <!-- 搜索/筛选 -->
      <template v-else>
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <input v-model="search" type="search" class="ui-input ui-input-compact w-52 text-sm" :placeholder="t('cs_search_ph')">
          <select v-model="sortBy" class="ui-input ui-input-compact w-auto text-sm" :aria-label="t('cs_sort')">
            <option value="updated">{{ t('cs_sort_updated') }}</option>
            <option value="name">{{ t('cs_sort_name') }}</option>
          </select>
          <span v-if="allTags.length" class="mx-1 h-5 w-px bg-border" aria-hidden="true"></span>
          <button
            type="button"
            class="ui-chip ui-chip-sm"
            :class="{ active: !activeTag }"
            @click="activeTag = ''"
          >{{ t('cs_tag_all') }}</button>
          <button
            v-for="tag in allTags"
            :key="tag"
            type="button"
            class="ui-chip ui-chip-sm"
            :class="{ active: activeTag === tag }"
            @click="activeTag = activeTag === tag ? '' : tag"
          >{{ tag }}</button>
        </div>

        <!-- 卡片网格 -->
        <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          <div
            v-for="rec in filteredCards"
            :key="rec.id"
            class="group relative cursor-pointer overflow-hidden rounded-xl border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md"
            role="button"
            tabindex="0"
            @click="editingId = rec.id"
            @keydown.enter.prevent="editingId = rec.id"
          >
            <div class="relative aspect-square w-full overflow-hidden bg-rose-tint">
              <img v-if="rec.avatar" :src="rec.avatar" :alt="rec.raw?.data?.name" class="h-full w-full object-cover">
              <div v-else class="flex h-full w-full items-center justify-center font-display text-5xl text-plum-muted">
                {{ (rec.raw?.data?.name || '?').trim().charAt(0).toUpperCase() }}
              </div>
              <span class="absolute left-2 top-2 rounded-md bg-black/45 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                {{ specLabel(rec) }}
              </span>
              <button
                type="button"
                class="absolute right-2 top-2 text-lg leading-none transition-transform hover:scale-110"
                :class="rec.favorite ? 'text-amber-400' : 'text-white/70'"
                :aria-label="t('cs_fav')"
                @click.stop="toolbox.toggleCardFavorite(rec.id)"
              >{{ rec.favorite ? '★' : '☆' }}</button>
            </div>
            <div class="p-2.5">
              <p class="truncate text-sm font-semibold">{{ rec.raw?.data?.name || t('cs_unnamed') }}</p>
              <p class="mt-0.5 truncate text-[11px] text-plum-muted">
                {{ fmtDate(rec.updated) }}<span v-if="(rec.raw?.data?.tags || []).length"> · {{ (rec.raw?.data?.tags || []).slice(0, 2).join(' · ') }}</span>
              </p>
              <div class="absolute bottom-2.5 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button type="button" class="ui-button ui-button-ghost ui-button-xs !bg-surface" :title="t('cs_dup')" @click.stop="duplicate(rec.id)">⧉</button>
                <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs !bg-surface" :title="t('cs_del')" @click.stop="remove(rec.id)">🗑</button>
              </div>
            </div>
          </div>
        </div>

        <p v-if="!filteredCards.length" class="mt-6 text-center text-sm text-plum-muted">{{ t('cs_filter_empty') }}</p>

        <p class="mt-6 text-center text-xs text-plum-muted">{{ t('cs_local_note') }}</p>
      </template>
    </template>

    <!-- 全局弹窗（BYOK 设置 / 确认框） -->
    <SettingsModal />
    <AppDialogModal />
  </div>
</template>
