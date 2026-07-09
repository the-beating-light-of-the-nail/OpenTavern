<script setup lang="ts">
import { useAppStore } from '~/stores/app';
const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();

const cards = computed<any[]>(() => Object.values(store.characters || {}));
function close() { ui.close('newChatPicker'); }
</script>

<template>
  <AppModal modal-id="newChatPickerModal" name="newChatPicker" max-width="max-w-lg" closable>
    <h2 class="text-lg font-bold mb-4">{{ t('new_chat_picker_title') }}</h2>
    <div id="newChatPickerList" class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
      <div v-for="c in cards" :key="c.id" class="glass rounded-xl p-3 cursor-pointer hover:border-amber-500/30 transition-all">
        <div class="w-full aspect-square rounded-lg ot-avatar-fill flex items-center justify-center text-white font-bold mb-1.5">{{ (c.data?.name || '?').charAt(0) }}</div>
        <p class="text-xs font-medium text-zinc-200 truncate">{{ c.data?.name || 'Untitled' }}</p>
      </div>
    </div>
    <div id="newChatPickerMultiBar" class="mt-3 hidden px-1 text-xs text-amber-300 flex items-center justify-between">
      <span id="newChatPickerMultiHint">{{ t('new_chat_multi_hint') }}</span>
    </div>
    <div class="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
      <button id="newChatNoCharacterBtn" class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 transition-all">{{ t('new_chat_no_character') }}</button>
      <button id="newChatImportCharacterBtn" class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all">{{ t('new_chat_import_character') }}</button>
    </div>
  </AppModal>
</template>
