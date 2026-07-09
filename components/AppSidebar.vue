<script setup lang="ts">
import { useAppStore } from '~/stores/app';

const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();

const conversations = computed(() =>
  (store.conversationOrder || [])
    .map((id: string) => store.conversations[id])
    .filter(Boolean),
);

function openConv(id: string) {
  store.setActiveConv(id);
  store.currentView = 'chat';
  store.sidebarOpen = false;
}

function toggleSidebar() {
  store.sidebarOpen = !store.sidebarOpen;
}

function currentCharName(): string {
  const conv = store.activeConversation;
  const charId = conv?.characterId || conv?.characterRef;
  const ch = charId ? store.characters[charId] : null;
  return ch?.data?.name || ch?.name || conv?.characterName || '';
}
</script>

<template>
  <aside id="sidebar" :class="{ open: store.sidebarOpen }" class="w-[270px] flex-shrink-0 flex flex-col border-r border-white/5 bg-zinc-950/25 backdrop-blur-xl">
    <!-- Header -->
    <div class="px-5 py-4 flex items-center gap-3 border-b border-white/5">
      <div class="w-9 h-9 rounded-xl ot-avatar-fill flex items-center justify-center text-white text-xs font-bold tracking-tighter">OT</div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="text-sm font-bold text-zinc-100 leading-tight">OpenTavern</p>
          <div id="storageStatus" class="text-[9px] px-1.5 py-px rounded bg-white/5 text-zinc-400 font-mono cursor-pointer select-none hover:bg-white/10 transition-colors" title="存储后端">OPFS</div>
        </div>
        <p class="text-[10px] text-zinc-500 leading-tight">{{ t('app_subtitle') }}</p>
      </div>
      <button class="hamburger-close-btn w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all" aria-label="Close menu" @click="toggleSidebar">&times;</button>
    </div>

    <!-- Actions -->
    <div class="px-3 py-3 space-y-2 border-b border-white/5">
      <button id="newChatBtn" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-300 glass hover:bg-white/10 active:bg-white/15 transition-all" @click="ui.open('newChatPicker')">
        <span class="text-base">+</span> <span>{{ t('new_chat') }}</span>
      </button>

      <!-- Character Card Block -->
      <div class="glass rounded-xl px-3 py-2 space-y-1.5">
        <div class="flex items-center justify-between">
          <span class="text-[10px] text-zinc-500 uppercase tracking-wider">{{ t('char_card_title') }}</span>
          <div id="charCardActions" class="flex items-center gap-0.5">
            <button id="charEditBtn" class="hidden w-6 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all text-xs">&#9998;</button>
            <button id="charExportBtn" class="hidden w-6 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all text-xs">&#128230;</button>
            <button id="charRemoveBtn" class="hidden w-6 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-xs">&#10005;</button>
          </div>
        </div>

        <div v-if="currentCharName()"          id="charCardPreview"
          class="flex items-center gap-2 mb-1">
          <div id="charCardAvatar" class="w-7 h-7 rounded-lg ot-avatar-fill flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">?</div>
          <div class="min-w-0 flex-1">
            <p id="charCardName" class="text-xs font-medium text-zinc-200 truncate">{{ currentCharName() }}</p>
          </div>
        </div>
        <p v-else id="charCardEmptyHint" class="text-[10px] text-zinc-500">{{ t('char_card_empty') }}</p>

        <div class="flex gap-1.5">
          <button id="charImportBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-zinc-400 bg-white/5 hover:bg-white/10 transition-all" @click="ui.open('charImport')">
            <span>&#128229;</span> <span>{{ t('char_btn_import') }}</span>
          </button>
          <button id="charCreateBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-zinc-500 bg-white/5 hover:bg-white/10 transition-all" @click="ui.open('charEditor')">
            <span>+</span> <span>{{ t('char_btn_create') }}</span>
          </button>
        </div>
      </div>

      <!-- World Book quick access -->
      <div class="glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
        <span class="text-zinc-400 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider">WI</span>
        <span class="flex-1 text-zinc-300 truncate">{{ t('world_book') }}</span>
        <span id="wiEntryCount" class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 flex-shrink-0">{{ Object.keys(store.worldBooks || {}).length }}</span>
        <button id="worldBookBtn" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 transition-all text-[11px] font-medium flex-shrink-0 min-h-[28px]" @click="ui.open('worldBook')">{{ t('world_book_btn') }}</button>
      </div>
    </div>

    <!-- Conversation list -->
    <div id="convList" class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
      <p v-if="!conversations.length" id="noConvHint" class="text-xs text-zinc-500 text-center py-8 px-2">{{ t('no_conversations') }}</p>
      <div
        v-for="conv in conversations"
        :key="conv.id"
        class="conv-item px-3 py-2 rounded-lg cursor-pointer text-sm text-zinc-300 hover:text-zinc-100"
        :class="{ active: conv.id === store.activeConvId }"
        @click="openConv(conv.id)"
      >
        <div class="truncate font-medium">{{ conv.title || conv.name || t('new_chat_title') }}</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-3 py-2 border-t border-white/5 space-y-1.5">
      <div class="flex items-center gap-1.5">
        <button id="exportAllBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all">{{ t('conv_export_all_btn') }}</button>
        <button id="importConvBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all">{{ t('conv_import_btn') }}</button>
      </div>
      <div class="flex items-center gap-1.5">
        <button id="sidebarSettingsBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all" @click="ui.open('settings')">
          <span>{{ t('settings') }}</span>
        </button>
        <button id="viewPromptBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all" @click="ui.open('promptViewer')">
          <span class="text-[10px] font-semibold uppercase tracking-wider">Prompt</span>
        </button>
      </div>
    </div>
  </aside>

  <!-- Sidebar Backdrop (mobile) -->
  <div id="sidebarBackdrop" :class="{ open: store.sidebarOpen }" @click="toggleSidebar" />
</template>
