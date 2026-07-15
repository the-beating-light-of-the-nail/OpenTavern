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
  const charId = conv?.characterId;
  const ch = charId ? store.characters[charId] : null;
  return ch?.data?.name || ch?.name || conv?.characterName || '';
}

function currentCharId(): string | null {
  const conv = store.activeConversation;
  return conv?.characterId || null;
}

function editCurrentChar() {
  const id = currentCharId();
  if (!id) return;
  const ch = store.characters[id];
  if (!ch) return;
  ui.open('charEditor', { id, data: ch.data });
}

const exportImportInput = ref<HTMLInputElement | null>(null);

function exportAll() {
  const data = {
    settings: store.settings,
    conversations: store.conversations,
    conversationOrder: store.conversationOrder,
    characters: store.characters,
    worldBooks: store.worldBooks,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'rolechat-export-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
}

function triggerImport() { exportImportInput.value?.click(); }

async function onImportFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    if (data.conversations) Object.assign(store.conversations, data.conversations);
    if (data.conversationOrder) {
      for (const id of data.conversationOrder) {
        if (!store.conversationOrder.includes(id)) store.conversationOrder.unshift(id);
      }
    }
    if (data.characters) Object.assign(store.characters, data.characters);
    if (data.worldBooks) Object.assign(store.worldBooks, data.worldBooks);
    store.persist(true);
    ui.showDialog({ message: t('import_success'), showCancel: false });
  } catch {
    ui.showDialog({ message: t('import_error'), showCancel: false, danger: true });
  }
  if (target) target.value = '';
}
</script>

<template>
  <aside id="sidebar" :class="{ open: store.sidebarOpen }" class="w-[270px] flex-shrink-0 flex flex-col border-r border-white/5 bg-zinc-950/25 backdrop-blur-xl">
    <!-- Header -->
    <NuxtLink to="/" class="px-5 py-4 flex items-center gap-3 border-b border-white/5 hover:bg-white/[0.03] transition-colors">
      <div class="w-9 h-9 rounded-xl ot-avatar-fill flex items-center justify-center text-white text-xs font-bold tracking-tighter">RC</div>
      <div class="flex-1">
        <div class="flex items-center gap-2">
          <p class="text-sm font-bold text-zinc-100 leading-tight">RoleChat AI</p>
        </div>
        <p class="text-[10px] text-zinc-500 leading-tight">{{ t('app_subtitle') }}</p>
      </div>
      <button class="hamburger-close-btn w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-all" aria-label="Close menu" @click.prevent.stop="toggleSidebar">&times;</button>
    </NuxtLink>

    <!-- Site nav -->
    <div class="px-3 py-2 flex items-center gap-1 border-b border-white/5">
      <NuxtLink to="/characters" class="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-zinc-400 text-center glass hover:text-zinc-200 hover:bg-white/5 transition-all">Characters</NuxtLink>
      <NuxtLink to="/guides" class="flex-1 px-2 py-1.5 rounded-lg text-[11px] font-medium text-zinc-400 text-center glass hover:text-zinc-200 hover:bg-white/5 transition-all">Guides</NuxtLink>
    </div>

    <!-- New Chat -->
    <div class="px-3 py-3 border-b border-white/5">
      <button id="newChatBtn" class="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-300 glass hover:bg-white/10 active:bg-white/15 transition-all" @click="ui.open('newChatPicker')">
        <span class="text-base">+</span> <span>{{ t('new_chat') }}</span>
      </button>
    </div>

    <!-- Conversation list -->
    <div id="convList" class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
      <div v-if="!conversations.length" id="noConvHint" class="text-xs text-zinc-500 text-center py-8 px-2 space-y-1">
        <p>{{ t('no_conversations') }}</p>
        <p class="text-amber-400/70">{{ t('no_conversations_hint') }}</p>
      </div>
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
      <!-- Connect AI (primary) -->
      <button id="sidebarSettingsBtn" class="w-full flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-semibold text-zinc-300 glass hover:text-zinc-100 hover:bg-white/5 transition-all" @click="ui.open('settings')">
        Connect AI
      </button>

      <!-- Advanced section (折叠) -->
      <details class="group">
        <summary class="cursor-pointer text-[10px] font-semibold uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors select-none list-none px-1 py-1.5 flex items-center gap-1">
          Advanced
          <span class="ml-auto transition-transform group-open:rotate-90">→</span>
        </summary>
        <div class="mt-1.5 space-y-1.5">
          <!-- Character Card -->
          <div class="glass rounded-xl px-3 py-2 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] text-zinc-500 uppercase tracking-wider">{{ t('char_card_title') }}</span>
              <div id="charCardActions" class="flex items-center gap-0.5">
                <button v-if="currentCharId()" id="charEditBtn" class="w-6 h-6 rounded-lg flex items-center justify-center text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all text-xs" @click="editCurrentChar">&#9998;</button>
              </div>
            </div>

            <div v-if="currentCharName()" id="charCardPreview" class="flex items-center gap-2 mb-1">
              <CharAvatar :initial="(currentCharName()||'?').charAt(0)" size="sm" />
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

          <!-- World Book -->
          <div class="glass rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
            <span class="text-zinc-400 flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider">WI</span>
            <span class="flex-1 text-zinc-300 truncate">{{ t('world_book') }}</span>
            <span id="wiEntryCount" class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 flex-shrink-0">{{ Object.keys(store.worldBooks || {}).length }}</span>
            <button id="worldBookBtn" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-500/20 hover:text-amber-300 text-zinc-300 transition-all text-[11px] font-medium flex-shrink-0 min-h-[28px]" @click="ui.open('worldBook')">{{ t('world_book_btn') }}</button>
          </div>

          <!-- Export / Import / Prompt -->
          <div class="flex items-center gap-1.5">
            <input ref="exportImportInput" type="file" accept=".json" class="hidden" @change="onImportFile">
            <button id="exportAllBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all" @click="exportAll">{{ t('conv_export_all_btn') }}</button>
            <button id="importConvBtn" class="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all" @click="triggerImport">{{ t('conv_import_btn') }}</button>
          </div>
          <button id="viewPromptBtn" class="w-full flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] text-zinc-500 glass hover:text-zinc-300 hover:bg-white/5 transition-all" @click="ui.open('promptViewer')">
            <span class="text-[10px] font-semibold uppercase tracking-wider">Prompt</span>
          </button>
        </div>
      </details>
    </div>
  </aside>

  <!-- Sidebar Backdrop (mobile) -->
  <div id="sidebarBackdrop" :class="{ open: store.sidebarOpen }" @click="toggleSidebar" />
</template>
