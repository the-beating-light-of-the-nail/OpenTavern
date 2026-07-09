<script setup lang="ts">
import { useAppStore } from '~/stores/app';
const store = useAppStore();
const { t } = useI18n();

const books = computed<any[]>(() => Object.values(store.worldBooks || {}));
const entryCount = computed(() => books.value.reduce((n, b) => n + (Array.isArray(b.entries) ? b.entries.length : 0), 0));
const selected = ref(false);
</script>

<template>
  <AppModal modal-id="worldBookModal" name="worldBook" max-width="max-w-[1080px]" :flush="false" closable>
    <!-- Header -->
    <div class="px-5 py-3 border-b border-white/10 flex items-center gap-3 bg-black/20 -mx-7 -mt-7 mb-4">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">WI</span>
        <span class="font-bold text-lg text-zinc-100">{{ t('world_book_title') }}</span>
        <input id="wiBookName" class="ml-2 flex-1 max-w-[260px] px-3 py-1.5 text-sm glass rounded-xl text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/40" placeholder="Lorebook name (optional)">
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all">{{ t('world_book_new') }}</button>
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all">{{ t('world_book_import') }}</button>
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-all">{{ t('world_book_export') }}</button>
        <button class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all">{{ t('world_book_delete_all') }}</button>
        <button class="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow shadow-amber-500/20 transition-all">{{ t('world_book_add_entry') }}</button>
      </div>
    </div>

    <!-- Body: list + editor -->
    <div class="flex flex-col md:flex-row gap-4 min-h-[50vh]">
      <!-- Entry list -->
      <div class="w-full md:w-72 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/10">
        <div class="p-2.5 border-b border-white/5">
          <input id="wiSearch" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30" :placeholder="t('world_book_search')">
        </div>
        <div id="wiEntryList" class="flex-1 overflow-y-auto p-2 space-y-1.5 text-sm max-h-40 md:max-h-none" />
        <div class="p-2 text-[10px] text-center text-zinc-500 border-t border-white/5" id="wiEntryStats">{{ entryCount }} entries</div>
      </div>

      <!-- Editor -->
      <div class="flex-1 flex flex-col" id="wiEditorContainer">
        <div v-if="!selected" id="wiNoSelection" class="flex-1 flex items-center justify-center text-center text-zinc-500 text-sm">
          <div>
            <div class="text-xs mb-3 opacity-70 uppercase tracking-wider">World Info</div>
            <div>{{ t('world_book_no_selection') }}</div>
          </div>
        </div>
        <div v-else id="wiEditorForm" class="space-y-4">
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" id="wiDisable" class="accent-amber-500">
              <span class="text-zinc-400">{{ t('wi_disable') }}</span>
            </label>
            <div class="flex gap-2">
              <button class="px-2.5 py-1 text-xs rounded-lg glass hover:bg-white/10">{{ t('world_book_duplicate') }}</button>
              <button class="px-2.5 py-1 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20">{{ t('world_book_delete') }}</button>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_comment') }}</label>
              <input id="wiComment" type="text" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/40">
            </div>
            <div>
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_order') }}</label>
              <input id="wiOrder" type="number" value="100" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500/40">
            </div>
          </div>
          <div>
            <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_keys') }}</label>
            <div id="wiKeyChips" class="mt-1 min-h-[34px] flex flex-wrap gap-1 p-2 glass rounded-xl bg-black/20" />
            <div class="flex gap-2 mt-1.5">
              <input id="wiKeyInput" type="text" class="flex-1 px-3 py-1.5 text-sm glass rounded-xl">
              <button class="px-4 text-xs font-semibold rounded-xl glass hover:bg-white/10">添加</button>
            </div>
            <div class="text-[10px] text-zinc-500 mt-0.5">{{ t('wi_keys_hint') }}</div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
            <div class="md:col-span-3">
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_secondary') }}</label>
              <div id="wiSecChips" class="mt-1 min-h-[34px] flex flex-wrap gap-1 p-2 glass rounded-xl bg-black/20" />
            </div>
            <div class="md:col-span-2">
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_selective_logic') }}</label>
              <select id="wiSelectiveLogic" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none">
                <option value="0">{{ t('logic_and_any') }}</option>
                <option value="1">{{ t('logic_and_all') }}</option>
                <option value="2">{{ t('logic_not_any') }}</option>
                <option value="3">{{ t('logic_not_all') }}</option>
              </select>
            </div>
          </div>
          <div>
            <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_content') }}</label>
            <textarea id="wiContent" rows="6" class="w-full mt-1 px-3 py-2 text-sm glass rounded-2xl text-zinc-200 font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-amber-500/30 resize-y" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_position') }}</label>
              <select id="wiPosition" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl">
                <option value="0">{{ t('pos_before_char') }}</option>
                <option value="1">{{ t('pos_after_char') }}</option>
                <option value="2">{{ t('pos_before_ex') }}</option>
                <option value="3">{{ t('pos_after_ex') }}</option>
                <option value="4">{{ t('pos_top_an') }}</option>
                <option value="5">{{ t('pos_bottom_an') }}</option>
                <option value="6">{{ t('pos_at_depth') }}</option>
                <option value="7">{{ t('pos_outlet') }}</option>
              </select>
            </div>
            <div>
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_probability') }}</label>
              <div class="flex items-center gap-2 mt-1">
                <input id="wiProbability" type="range" min="0" max="100" step="5" value="100" class="flex-1">
                <span class="w-9 text-right text-sm tabular-nums">100</span>
              </div>
            </div>
            <div>
              <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('wi_depth') }}</label>
              <input id="wiDepth" type="number" min="0" value="4" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl">
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>
