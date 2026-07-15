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
    <div class="px-5 py-3 border-b border-white/10 flex items-center gap-3 bg-black/20 -mx-7 -mt-7 mb-4">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">WI</span>
        <span class="font-bold text-lg text-zinc-100">{{ t('world_book_title') }}</span>
        <input
          id="wiBookName"
          v-model="currentBook.name"
          class="ml-2 flex-1 max-w-[260px] px-3 py-1.5 text-sm glass rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
          placeholder="Lorebook name"
          @change="onBookNameChange"
        >
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all" @click="onNewBook">{{ t('world_book_new') }}</button>
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all" @click="onImport">{{ t('world_book_import') }}</button>
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all" @click="onExport">{{ t('world_book_export') }}</button>
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all" @click="onDeleteAllConfirm">{{ t('world_book_delete_all') }}</button>
        <button class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow shadow-amber-500/20 transition-all" @click="onAddEntry">{{ t('world_book_add_entry') }}</button>
      </div>
      <input ref="fileInput" type="file" accept=".json" class="hidden" @change="onImportFile">
    </div>

    <div class="flex flex-col md:flex-row gap-4 min-h-[50vh]">
      <div class="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/10">
        <div class="p-2.5 border-b border-white/5">
          <input v-model="search" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30" :placeholder="t('world_book_search')">
        </div>
        <div id="wiEntryList" class="flex-1 overflow-y-auto p-2 space-y-1.5 text-sm max-h-40 md:max-h-none">
          <div
            v-for="e in entryList"
            :key="e.uid"
            class="px-3 py-2 rounded-lg cursor-pointer transition-all text-xs text-zinc-300 hover:bg-white/5"
            :class="selectedUid === e.uid ? 'bg-amber-500/15 ring-1 ring-amber-500/30' : ''"
            @click="selectEntry(e.uid)"
          >
            <span class="text-zinc-400" :class="{ 'text-zinc-200': selectedUid === e.uid }">{{ e.comment || e.content?.slice(0, 30) || t('wi_untitled') }}</span>
          </div>
          <div v-if="!entryList.length" class="text-xs text-zinc-500 text-center py-6">
            {{ search ? t('world_book_search_empty') : t('world_book_no_entries') }}
          </div>
        </div>
        <div class="p-2 text-[10px] text-center text-zinc-500 border-t border-white/5">{{ entryList.length }} entries</div>
      </div>

      <div class="flex-1 flex flex-col">
        <div v-if="!selectedEntry" class="flex-1 flex items-center justify-center text-center text-zinc-500 text-sm">
          <div>
            <div class="text-xs mb-3 opacity-70 uppercase tracking-wider">World Info</div>
            <div>{{ t('world_book_no_selection') }}</div>
          </div>
        </div>
        <template v-else>
          <div class="flex items-center justify-between mb-3">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input v-model="(selectedEntry as any).disable" type="checkbox" class="accent-amber-500" @change="onEntryFieldChange">
              <span class="text-zinc-400">{{ t('wi_disable') }}</span>
            </label>
            <div class="flex gap-2">
              <button class="px-2.5 py-1 text-xs rounded-lg glass hover:bg-white/10" @click="onDuplicateEntry">{{ t('world_book_duplicate') }}</button>
              <button class="px-2.5 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20" @click="onDeleteEntry">{{ t('world_book_delete') }}</button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_comment') }}</label>
              <input v-model="(selectedEntry as any).comment" type="text" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/40" @change="onEntryFieldChange">
            </div>
            <div>
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_order') }}</label>
              <input v-model.number="(selectedEntry as any).order" type="number" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/40" @change="onEntryFieldChange">
            </div>
          </div>

          <div class="mt-3">
            <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_keys') }}</label>
            <div class="mt-1 min-h-[34px] flex flex-wrap gap-1 p-2 glass rounded-xl bg-black/20">
              <span v-for="(k, i) in (selectedEntry as any).key || []" :key="i" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px]">
                {{ k }}
                <button class="hover:text-red-400 text-xs leading-none" @click="removeKey(i)">&times;</button>
              </span>
            </div>
            <div class="flex gap-2 mt-1.5">
              <input v-model="keyInput" type="text" class="flex-1 px-3 py-1.5 text-sm glass rounded-xl" placeholder="Add key..." @keydown.enter.prevent="addKey">
              <button class="px-4 text-xs font-semibold rounded-xl glass hover:bg-white/10" @click="addKey">{{ t('add') }}</button>
            </div>
            <div class="text-[10px] text-zinc-500 mt-0.5">{{ t('wi_keys_hint') }}</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end mt-3">
            <div class="md:col-span-3">
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_secondary') }}</label>
              <div class="mt-1 min-h-[34px] flex flex-wrap gap-1 p-2 glass rounded-xl bg-black/20">
                <span v-for="(k, i) in (selectedEntry as any).keysecondary || []" :key="i" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[11px]">
                  {{ k }}
                  <button class="hover:text-red-400 text-xs leading-none" @click="removeSecKey(i)">&times;</button>
                </span>
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_selective_logic') }}</label>
              <select v-model.number="(selectedEntry as any).selectiveLogic" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none" @change="onEntryFieldChange">
                <option :value="0">{{ t('logic_and_any') }}</option>
                <option :value="1">{{ t('logic_and_all') }}</option>
                <option :value="2">{{ t('logic_not_any') }}</option>
                <option :value="3">{{ t('logic_not_all') }}</option>
              </select>
            </div>
          </div>

          <div class="mt-3">
            <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_content') }}</label>
            <textarea v-model="(selectedEntry as any).content" rows="6" class="w-full mt-1 px-3 py-2 text-sm glass rounded-2xl text-zinc-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-y" @change="onEntryFieldChange" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
            <div>
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_position') }}</label>
              <select v-model.number="(selectedEntry as any).position" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl" @change="onEntryFieldChange">
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
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_probability') }}</label>
              <div class="flex items-center gap-2 mt-1">
                <input v-model.number="(selectedEntry as any).probability" type="range" min="0" max="100" step="5" class="flex-1" @change="onEntryFieldChange">
                <span class="w-9 text-right text-sm tabular-nums">{{ (selectedEntry as any).probability }}</span>
              </div>
            </div>
            <div>
              <label class="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_depth') }}</label>
              <input v-model.number="(selectedEntry as any).depth" type="number" min="0" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl" @change="onEntryFieldChange">
            </div>
          </div>
        </template>
      </div>
    </div>
  </AppModal>
</template>
