<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import type { WIEntry } from '~/composables/useWorldInfo';
import { makeId } from '~/utils/chat-helpers';

const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();

const search = ref('');
const selectedUid = ref<string | null>(null);
const keyInput = ref('');
const secKeyInput = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

function ensureBook(): any {
  const books = store.worldBooks || {};
  const existing: any = Object.values(books)[0];
  if (existing) return existing;
  const uid = makeId();
  const book = { uid, name: 'Lorebook', entries: {} };
  books[uid] = book;
  return book;
}

const currentBook = computed<any>(() => ensureBook());
const entryList = computed<WIEntry[]>(() => {
  const entries = currentBook.value?.entries || {};
  const q = search.value.trim().toLowerCase();
  return Object.values(entries)
    .map((e: any) => ({ ...e, uid: e.uid || String(e.uid) }))
    .filter((e: WIEntry) => {
      if (!q) return true;
      const hay = [(e.comment || ''), (e.content || ''), ...(e.key || [])].join(' ').toLowerCase();
      return hay.includes(q);
    })
    .sort((a: any, b: any) => (a.order ?? 100) - (b.order ?? 100));
});

const selectedEntry = computed<WIEntry | null>(() => {
  const uid = selectedUid.value;
  if (!uid) return null;
  return currentBook.value?.entries?.[uid] || null;
});

function selectEntry(uid: string | number | undefined) { if (uid != null) selectedUid.value = String(uid); }

function makeDefaultEntry(): WIEntry {
  const uid: string = makeId();
  return {
    uid,
    key: [],
    keysecondary: [],
    content: '',
    comment: '',
    order: 100,
    disable: false,
    constant: false,
    selectiveLogic: 0,
    position: 1,
    depth: 4,
    probability: 100,
    useProbability: false,
    group: '',
    groupWeight: 0,
    useGroupScoring: false,
    scanDepth: 4,
    caseSensitive: false,
    matchWholeWords: false,
    excludeRecursion: false,
    preventRecursion: false,
    sticky: 0,
    cooldown: 0,
    delay: 0,
  };
}

function onBookNameChange() { store.persist(); }

function onAddEntry() {
  const entry = makeDefaultEntry();
  const eid = String(entry.uid ?? '');
  currentBook.value.entries[eid] = entry;
  selectedUid.value = eid;
  store.persist();
}

function onDuplicateEntry() {
  const entry = selectedEntry.value;
  if (!entry) return;
  const copy: WIEntry = JSON.parse(JSON.stringify(entry));
  const cid = makeId();
  copy.uid = cid;
  currentBook.value.entries[cid] = copy;
  selectedUid.value = cid;
  store.persist();
}

function onDeleteEntry() {
  const uid = selectedUid.value;
  if (!uid) return;
  delete currentBook.value.entries[uid];
  selectedUid.value = null;
  store.persist();
}

function onDeleteAll() {
  store.worldBooks = {};
  selectedUid.value = null;
  store.persist();
}

function onDeleteAllConfirm() {
  ui.showDialog({
    title: t('world_book_delete_all'),
    message: t('world_book_delete_all_confirm'),
    danger: true,
    showCancel: true,
  }).then((ok) => { if (ok) onDeleteAll(); });
}

function onNewBook() {
  const uid = makeId();
  store.worldBooks[uid] = { uid, name: 'Lorebook', entries: {} };
  selectedUid.value = null;
  store.persist();
}

function onImport() { fileInput.value?.click(); }

async function onImportFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const json = JSON.parse(text);
    let entries: Record<string, any> = {};
    let name = file.name?.replace(/\.json$/i, '') || 'Imported Lorebook';
    if (json && typeof json === 'object' && !Array.isArray(json)) {
      if (json.name) name = json.name;
      if (json.entries && typeof json.entries === 'object') {
        entries = json.entries;
      } else {
        entries = json;
      }
    }
    const uid = makeId();
    const normalized: Record<string, WIEntry> = {};
    for (const [key, val] of Object.entries(entries)) {
      const e: any = typeof val === 'object' && val ? val : { content: String(val) };
      e.uid = e.uid || makeId();
      normalized[e.uid] = e;
    }
    store.worldBooks[uid] = { uid, name, entries: normalized };
    selectedUid.value = null;
    store.persist();
    ui.showDialog({ message: t('world_book_import_success'), showCancel: false });
  } catch {
    ui.showDialog({ message: t('world_book_import_error'), showCancel: false });
  }
  if (target) target.value = '';
}

function onExport() {
  const book = currentBook.value;
  if (!book) return;
  const blob = new Blob([JSON.stringify({ name: book.name, entries: book.entries }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = (book.name || 'lorebook') + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function onEntryFieldChange() { store.persist(); }

function addKey() {
  const entry = selectedEntry.value as any;
  if (!entry) return;
  if (!Array.isArray(entry.key)) entry.key = [];
  const val = keyInput.value.trim();
  if (val && !entry.key.includes(val)) {
    entry.key.push(val);
    keyInput.value = '';
    store.persist();
  }
}

function removeKey(idx: number) {
  const entry = selectedEntry.value as any;
  if (!entry) return;
  entry.key.splice(idx, 1);
  store.persist();
}

function addSecKey() {
  const entry = selectedEntry.value as any;
  if (!entry) return;
  if (!Array.isArray(entry.keysecondary)) entry.keysecondary = [];
  const val = secKeyInput.value.trim();
  if (val && !entry.keysecondary.includes(val)) {
    entry.keysecondary.push(val);
    secKeyInput.value = '';
    store.persist();
  }
}

function removeSecKey(idx: number) {
  const entry = selectedEntry.value as any;
  if (!entry) return;
  entry.keysecondary.splice(idx, 1);
  store.persist();
}
</script>

<template>
  <AppModal modal-id="worldBookModal" name="worldBook" max-width="max-w-[1080px]" :flush="false" closable>
    <div class="px-5 py-3 border-b flex items-center gap-3 -mx-7 -mt-7 mb-4" style="border-color:var(--color-border);background:var(--color-surface-soft)">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xs font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">WI</span>
        <span class="ui-modal-title" style="color:var(--color-text)">{{ t('world_book_title') }}</span>
        <input
          id="wiBookName"
          v-model="currentBook.name"
          class="ml-2 flex-1 max-w-[260px] ui-input"
          placeholder="Lorebook name"
          @change="onBookNameChange"
        >
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button class="ui-button" @click="onNewBook">{{ t('world_book_new') }}</button>
        <button class="ui-button" @click="onImport">{{ t('world_book_import') }}</button>
        <button class="ui-button" @click="onExport">{{ t('world_book_export') }}</button>
        <button class="ui-button-danger-ghost ui-button-sm" @click="onDeleteAllConfirm">{{ t('world_book_delete_all') }}</button>
        <button class="ui-button-primary" @click="onAddEntry">{{ t('world_book_add_entry') }}</button>
      </div>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onImportFile">
    </div>

    <div class="flex flex-col md:flex-row gap-4 min-h-[50vh]">
      <div class="w-full md:w-72 border-b md:border-b-0 md:border-r flex flex-col" style="border-color:var(--color-border);background:var(--color-surface-soft)">
        <div class="p-2.5 border-b" style="border-color:var(--color-border)">
          <input v-model="search" type="text" class="ui-input" :placeholder="t('world_book_search')">
        </div>
        <div id="wiEntryList" class="flex-1 overflow-y-auto p-2 space-y-1.5 text-sm max-h-40 md:max-h-none">
          <div
            v-for="e in entryList"
            :key="e.uid"
            class="px-3 py-2 rounded-lg cursor-pointer transition-all text-xs"
            style="color:var(--color-text)"
            :style="selectedUid === e.uid ? 'background:color-mix(in srgb,var(--color-primary) 15%,transparent);box-shadow:0 0 0 1px color-mix(in srgb,var(--color-primary) 30%,transparent)' : ''"
            @click="selectEntry(e.uid)"
          >
            <span style="color:var(--color-text-muted)" :style="selectedUid === e.uid ? 'color:var(--color-text)' : ''">{{ e.comment || e.content?.slice(0, 30) || t('wi_untitled') }}</span>
          </div>
          <div v-if="!entryList.length" class="text-xs text-center py-6" style="color:var(--color-text-muted)">
            {{ search ? t('world_book_search_empty') : t('world_book_no_entries') }}
          </div>
        </div>
        <div class="p-2 text-[10px] text-center border-t" style="color:var(--color-text-muted);border-color:var(--color-border)">{{ entryList.length }} entries</div>
      </div>

      <div class="flex-1 flex flex-col">
        <div v-if="!selectedEntry" class="flex-1 flex items-center justify-center text-center text-sm" style="color:var(--color-text-muted)">
          <div>
            <div class="text-xs mb-3 opacity-70 uppercase tracking-wider">World Info</div>
            <div>{{ t('world_book_no_selection') }}</div>
          </div>
        </div>
        <template v-else>
          <div class="flex items-center justify-between mb-3">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input v-model="(selectedEntry as any).disable" type="checkbox" style="accent-color:var(--color-primary)" @change="onEntryFieldChange">
              <span style="color:var(--color-text-muted)">{{ t('wi_disable') }}</span>
            </label>
            <div class="flex gap-2">
              <button class="ui-button" @click="onDuplicateEntry">{{ t('world_book_duplicate') }}</button>
              <button class="ui-button-danger-ghost ui-button-xs" @click="onDeleteEntry">{{ t('world_book_delete') }}</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_comment') }}</label>
              <input v-model="(selectedEntry as any).comment" type="text" class="ui-input mt-1" @change="onEntryFieldChange">
            </div>
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_order') }}</label>
              <input v-model.number="(selectedEntry as any).order" type="number" class="ui-input mt-1" @change="onEntryFieldChange">
            </div>
          </div>

          <div class="mt-3">
            <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_keys') }}</label>
            <div class="mt-1 min-h-[34px] flex flex-wrap gap-1 p-2 ui-panel ui-panel-flat rounded-xl">
              <span v-for="(k, i) in (selectedEntry as any).key || []" :key="i" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]" style="background:color-mix(in srgb,var(--color-primary) 15%,transparent);color:var(--color-primary)">
                {{ k }}
                <button class="ui-action-danger text-xs leading-none" @click="removeKey(i)">&times;</button>
              </span>
            </div>
            <div class="flex gap-2 mt-1.5">
              <input v-model="keyInput" type="text" class="flex-1 ui-input" placeholder="Add key..." @keydown.enter.prevent="addKey">
              <button class="ui-button" @click="addKey">{{ t('add') }}</button>
            </div>
            <div class="text-[10px] mt-0.5" style="color:var(--color-text-muted)">{{ t('wi_keys_hint') }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end mt-3">
            <div class="md:col-span-3">
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_secondary') }}</label>
              <div class="mt-1 min-h-[34px] flex flex-wrap gap-1 p-2 ui-panel ui-panel-flat rounded-xl">
                <span v-for="(k, i) in (selectedEntry as any).keysecondary || []" :key="i" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]" style="background:color-mix(in srgb,var(--color-primary) 15%,transparent);color:var(--color-primary)">
                  {{ k }}
                  <button class="ui-action-danger text-xs leading-none" @click="removeSecKey(i)">&times;</button>
                </span>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_selective_logic') }}</label>
              <select v-model.number="(selectedEntry as any).selectiveLogic" class="ui-input mt-1" @change="onEntryFieldChange">
                <option :value="0">{{ t('logic_and_any') }}</option>
                <option :value="1">{{ t('logic_and_all') }}</option>
                <option :value="2">{{ t('logic_not_any') }}</option>
                <option :value="3">{{ t('logic_not_all') }}</option>
              </select>
            </div>
          </div>

          <div class="mt-3">
            <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_content') }}</label>
            <textarea v-model="(selectedEntry as any).content" rows="6" class="ui-input mt-1 font-mono leading-relaxed resize-y" @change="onEntryFieldChange" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_position') }}</label>
              <select v-model.number="(selectedEntry as any).position" class="ui-input mt-1" @change="onEntryFieldChange">
                <option :value="0">{{ t('pos_before_char') }}</option>
                <option :value="1">{{ t('pos_after_char') }}</option>
                <option :value="2">{{ t('pos_before_ex') }}</option>
                <option :value="3">{{ t('pos_after_ex') }}</option>
                <option :value="4">{{ t('pos_top_an') }}</option>
                <option :value="5">{{ t('pos_bottom_an') }}</option>
                <option :value="6">{{ t('pos_at_depth') }}</option>
                <option :value="7">{{ t('pos_outlet') }}</option>
              </select>
            </div>
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_probability') }}</label>
              <div class="flex items-center gap-2 mt-1">
                <input v-model.number="(selectedEntry as any).probability" type="range" min="0" max="100" step="5" class="flex-1" @change="onEntryFieldChange">
                <span class="w-9 text-right text-sm tabular-nums">{{ (selectedEntry as any).probability }}</span>
              </div>
            </div>
            <div>
              <label class="text-[11px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('wi_depth') }}</label>
              <input v-model.number="(selectedEntry as any).depth" type="number" min="0" class="ui-input mt-1" @change="onEntryFieldChange">
            </div>
          </div>
        </template>
      </div>
    </div>
  </AppModal>
</template>
