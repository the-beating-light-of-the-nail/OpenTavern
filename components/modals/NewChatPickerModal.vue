<script setup lang="ts">
import { useAppStore } from '~/stores/app';
const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();

const cards = computed<any[]>(() => Object.values(store.characters || {}));

// 多选模式（建群）
const multiMode = ref(false);
const selectedIds = ref<string[]>([]);

function close() { ui.close('newChatPicker'); resetMulti(); }

function resetMulti() { multiMode.value = false; selectedIds.value = []; }

function toggleMulti() {
  multiMode.value = !multiMode.value;
  if (!multiMode.value) selectedIds.value = [];
}

/** 单选：点击卡片。多选模式下则增删选择，单选模式下直接建会话 */
function onCardClick(c: any) {
  if (!c?.id) return;
  if (multiMode.value) {
    const i = selectedIds.value.indexOf(c.id);
    if (i >= 0) selectedIds.value.splice(i, 1);
    else selectedIds.value.push(c.id);
    return;
  }
  store.createConversation(c);
  close();
}

function isSelected(c: any): boolean {
  return !!c?.id && selectedIds.value.includes(c.id);
}

/** 确认创建群聊（>=2 人） */
function confirmCreateGroup() {
  if (selectedIds.value.length < 2) return;
  const entries = selectedIds.value
    .map((id) => store.characters[id])
    .filter(Boolean);
  if (entries.length >= 2) {
    store.createConversation(entries);
  }
  close();
}

/** 无角色开始新聊天 */
function startNoCharacter() {
  store.createConversation();
  close();
}
</script>

<template>
  <AppModal modal-id="newChatPickerModal" name="newChatPicker" max-width="max-w-lg" closable>
    <div class="flex items-center justify-between mb-4 gap-2">
      <h2 class="text-lg font-bold">{{ t('new_chat_picker_title') }}</h2>
      <button
        class="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
        :class="multiMode ? 'bg-amber-500 text-zinc-900 border-amber-400' : 'bg-white/5 text-zinc-300 hover:bg-white/10 border-white/10'"
        @click="toggleMulti"
      >
        {{ multiMode ? t('new_chat_multi_exit') : t('new_chat_multi_select') }}
      </button>
    </div>

    <div id="newChatPickerList" class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[55vh] overflow-y-auto pr-1">
      <div
        v-for="c in cards"
        :key="c.id"
        class="glass rounded-xl p-3 cursor-pointer hover:border-amber-500/30 transition-all relative"
        :class="{ 'ring-2 ring-amber-500': isSelected(c) }"
        @click="onCardClick(c)"
      >
        <div v-if="isSelected(c)" class="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-zinc-900 text-[10px] font-bold flex items-center justify-center">&#10003;</div>
        <div class="w-full aspect-square rounded-lg ot-avatar-fill flex items-center justify-center text-white font-bold mb-1.5">{{ (c.data?.name || '?').charAt(0) }}</div>
        <p class="text-xs font-medium text-zinc-200 truncate">{{ c.data?.name || 'Untitled' }}</p>
      </div>
    </div>

    <!-- 多选模式：确认条 -->
    <div v-if="multiMode" id="newChatGroupConfirmBar" class="mt-3 flex items-center justify-between gap-2">
      <span class="text-xs text-amber-300">{{ t('new_chat_multi_selected_prefix') }} {{ selectedIds.length }} {{ t('new_chat_multi_people') }}</span>
      <button
        class="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
        :class="selectedIds.length >= 2 ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-white/10 text-zinc-500 cursor-not-allowed'"
        :disabled="selectedIds.length < 2"
        @click="confirmCreateGroup"
      >
        {{ t('new_chat_create_group') }}
      </button>
    </div>
    <div v-else id="newChatPickerMultiBar" class="mt-3 px-1 text-xs text-amber-300/80">
      <span id="newChatPickerMultiHint">{{ t('new_chat_multi_hint') }}</span>
    </div>

    <div class="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
      <button id="newChatNoCharacterBtn" class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 transition-all" @click="startNoCharacter">{{ t('new_chat_no_character') }}</button>
      <button id="newChatImportCharacterBtn" class="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all" @click="ui.close('newChatPicker'); ui.open('charImport')">{{ t('new_chat_import_character') }}</button>
    </div>
  </AppModal>
</template>
