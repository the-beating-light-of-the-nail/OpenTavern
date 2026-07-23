<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useLocale } from '~/composables/useLocale';

const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();
const { setLocale, supported } = useLocale();

const langOptions = [
  { code: 'en', label: t('lang_en_short') },
  { code: 'zh-CN', label: t('lang_zh_cn_short') },
  { code: 'zh-TW', label: t('lang_zh_tw_short') },
  { code: 'es', label: t('lang_es_short') },
  { code: 'ar', label: t('lang_ar_short') },
  { code: 'pt', label: t('lang_pt_short') },
  { code: 'ru', label: t('lang_ru_short') },
  { code: 'fr', label: t('lang_fr_short') },
  { code: 'de', label: t('lang_de_short') },
].filter((o) => supported.includes(o.code as any));

function onLangChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  setLocale(target.value);
}

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
  <aside id="sidebar" :class="{ open: store.sidebarOpen }" class="ui-sidebar w-[270px] flex-shrink-0 flex flex-col">
    <!-- Header -->
    <div class="px-5 py-4 flex items-center gap-3 border-b border-[var(--color-border)]">
      <NuxtLink to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div class="w-9 h-9 rounded-xl ot-avatar-fill flex items-center justify-center text-[var(--color-on-primary)] text-xs font-bold tracking-tighter">RC</div>
        <div>
          <p class="text-sm font-bold leading-tight" style="color:var(--color-text)">RoleChat AI</p>
          <p class="text-[10px] leading-tight" style="color:var(--color-text-muted)">{{ t('app_subtitle') }}</p>
        </div>
      </NuxtLink>
      <div class="flex-1" />
      <select :value="store.settings.lang" class="lang-select text-xs font-semibold rounded-md px-2 py-1 border cursor-pointer appearance-none text-center transition-colors" style="background:color-mix(in srgb, var(--color-primary) 10%, transparent);color:var(--color-primary);border-color:color-mix(in srgb, var(--color-primary) 18%, transparent)" @change="onLangChange">
        <option v-for="o in langOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
      </select>
      <button class="hamburger-close-btn w-7 h-7 rounded-lg flex items-center justify-center transition-all" style="color:var(--color-text-muted)" aria-label="Close menu" @click.prevent.stop="toggleSidebar">&times;</button>
    </div>

    <!-- Site nav -->
    <div class="px-3 py-2 flex items-center gap-1 border-b border-[var(--color-border)]">
      <NuxtLink to="/characters" class="ui-button ui-button-xs flex-1">{{ t('nav_characters') }}</NuxtLink>
      <NuxtLink to="/guides" class="ui-button ui-button-xs flex-1">{{ t('nav_guides') }}</NuxtLink>
    </div>

    <!-- New Chat -->
    <div class="px-3 py-3 border-b border-[var(--color-border)]">
      <button id="newChatBtn" class="ui-button-primary ui-button-block" @click="ui.open('newChatPicker')">
        <span class="text-base">+</span> <span>{{ t('new_chat') }}</span>
      </button>
    </div>

    <!-- Conversation list -->
    <div id="convList" class="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
      <div v-if="!conversations.length" id="noConvHint" class="text-xs text-center py-8 px-2 space-y-1" style="color:var(--color-text-muted)">
        <p>{{ t('no_conversations') }}</p>
        <p style="color:var(--color-primary)">{{ t('no_conversations_hint') }}</p>
      </div>
      <div
        v-for="conv in conversations"
        :key="conv.id"
        class="conv-item px-3 py-2 rounded-lg cursor-pointer text-sm"
        :class="{ active: conv.id === store.activeConvId }"
        @click="openConv(conv.id)"
      >
        <div class="truncate font-medium">{{ conv.title || conv.name || t('new_chat_title') }}</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-3 py-2 border-t border-[var(--color-border)] space-y-1.5">
      <!-- Connect AI (primary) -->
      <button id="sidebarSettingsBtn" class="ui-button-primary ui-button-block ui-button-sm" @click="ui.open('settings')">
        {{ t('connect_ai') }}
      </button>

      <!-- Advanced section (折叠) -->
      <details class="group">
        <summary class="cursor-pointer text-[10px] font-semibold uppercase tracking-wider transition-colors select-none list-none px-1 py-1.5 flex items-center gap-1" style="color:var(--color-text-muted)">
          {{ t('nav_advanced') }}
          <span class="ml-auto transition-transform group-open:rotate-90">→</span>
        </summary>
        <div class="mt-1.5 space-y-1.5">
          <!-- Character Card -->
          <div class="ui-panel ui-panel-flat rounded-xl px-3 py-2 space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-[10px] uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('char_card_title') }}</span>
              <div id="charCardActions" class="flex items-center gap-0.5">
                <button v-if="currentCharId()" id="charEditBtn" class="w-6 h-6 rounded-lg flex items-center justify-center transition-all text-xs" style="color:var(--color-text-faint)" @click="editCurrentChar">&#9998;</button>
              </div>
            </div>

            <div v-if="currentCharName()" id="charCardPreview" class="flex items-center gap-2 mb-1">
              <CharAvatar :initial="(currentCharName()||'?').charAt(0)" size="sm" />
              <div class="min-w-0 flex-1">
                <p id="charCardName" class="text-xs font-medium truncate" style="color:var(--color-text)">{{ currentCharName() }}</p>
              </div>
            </div>
            <p v-else id="charCardEmptyHint" class="text-[10px]" style="color:var(--color-text-muted)">{{ t('char_card_empty') }}</p>

            <div class="flex gap-1.5">
              <button id="charImportBtn" class="ui-button ui-button-xs flex-1" @click="ui.open('charImport')">
                <span>&#128229;</span> <span>{{ t('char_btn_import') }}</span>
              </button>
              <button id="charCreateBtn" class="ui-button ui-button-xs flex-1" @click="ui.open('charEditor')">
                <span>+</span> <span>{{ t('char_btn_create') }}</span>
              </button>
            </div>
          </div>

          <!-- World Book -->
          <div class="ui-panel ui-panel-flat rounded-xl px-3 py-2 flex items-center gap-2 text-xs">
            <span class="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">WI</span>
            <span class="flex-1 truncate" style="color:var(--color-text)">{{ t('world_book') }}</span>
            <span id="wiEntryCount" class="text-[10px] px-1.5 py-0.5 rounded flex-shrink-0" style="background:var(--color-surface-soft);color:var(--color-text-muted)">{{ Object.keys(store.worldBooks || {}).length }}</span>
            <button id="worldBookBtn" class="ui-button ui-button-xs flex-shrink-0 min-h-[28px]" @click="ui.open('worldBook')">{{ t('world_book_btn') }}</button>
          </div>

          <!-- Export / Import / Prompt -->
          <div class="flex items-center gap-1.5">
            <input ref="exportImportInput" type="file" accept=".json" class="hidden" @change="onImportFile">
            <button id="exportAllBtn" class="ui-button ui-button-xs flex-1" @click="exportAll">{{ t('conv_export_all_btn') }}</button>
            <button id="importConvBtn" class="ui-button ui-button-xs flex-1" @click="triggerImport">{{ t('conv_import_btn') }}</button>
          </div>
          <button id="viewPromptBtn" class="ui-button ui-button-xs ui-button-block" @click="ui.open('promptViewer')">
            <span class="text-[10px] font-semibold uppercase tracking-wider">{{ t('nav_prompt') }}</span>
          </button>
        </div>
      </details>
    </div>
  </aside>

  <!-- Sidebar Backdrop (mobile) -->
  <div id="sidebarBackdrop" :class="{ open: store.sidebarOpen }" @click="toggleSidebar" />
</template>
