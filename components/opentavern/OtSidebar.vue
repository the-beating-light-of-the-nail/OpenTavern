<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';

const store = useAppStore();
const ui = useUiStore();
const { t, locale } = useI18n();
const { $i18n } = useNuxtApp();

const isZh = computed(() => locale.value === 'zh-CN' || locale.value === 'zh-TW');
const conv = computed(() => store.activeConversation);
const conversations = computed(() =>
  (store.conversationOrder || [])
    .map((id: string) => store.conversations[id])
    .filter(Boolean),
);

const currentChar = computed(() => {
  const id = conv.value?.characterId;
  return id ? store.characters[id] : null;
});
const currentCharName = computed(
  () => currentChar.value?.data?.name || currentChar.value?.name || conv.value?.characterName || '',
);
const currentCharTagCount = computed(() => currentChar.value?.data?.tags?.length || currentChar.value?.tags?.length || 0);

const wiCount = computed(() => Object.keys(store.worldBooks || {}).length);
const importInput = ref<HTMLInputElement | null>(null);

function closeSidebar() {
  store.sidebarOpen = false;
}

function openLibrary() {
  store.currentView = 'library';
  closeSidebar();
}

function newChat() {
  ui.open('newChatPicker');
  closeSidebar();
}

function openConv(id: string) {
  store.setActiveConv(id);
  store.currentView = 'chat';
  closeSidebar();
}

function deleteConv(id: string) {
  const c = store.conversations[id];
  if (!c) return;
  const ok = window.confirm(isZh.value ? '确定删除这个对话？' : 'Delete this conversation?');
  if (!ok) return;
  delete store.conversations[id];
  store.conversationOrder = store.conversationOrder.filter((x: string) => x !== id);
  if (store.activeConvId === id) store.setActiveConv(null);
  store.persist(true);
}

function exportConv(id: string) {
  const c = store.conversations[id];
  if (!c) return;
  const blob = new Blob([JSON.stringify(c, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `opentavern-conv-${id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

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
  a.download = `opentavern-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function triggerImport() {
  importInput.value?.click();
}

async function onImportFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
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
  } finally {
    target.value = '';
  }
}

function editCurrentChar() {
  const id = conv.value?.characterId;
  if (!id) return;
  const ch = store.characters[id];
  if (!ch) return;
  ui.open('charEditor', { id, data: ch.data });
}

function fmtDate(c: any) {
  const ts = c?.updated || c?.created;
  try {
    return new Date(ts || Date.now()).toLocaleDateString(isZh.value ? 'zh-CN' : 'en-US');
  } catch {
    return '';
  }
}

async function switchLang(code: 'zh-CN' | 'zh-TW' | 'en') {
  // /opentavern 固定在根路径，不能让 $i18n.setLocale 自动加 locale 前缀（会 410）
  store.settings.lang = code;
  store.persist();
  try {
    await ($i18n as any).loadLocaleMessages?.(code);
  } catch { /* 语言包加载失败时保持当前语言 */ }
  locale.value = code;
  if (typeof document !== 'undefined') document.documentElement.lang = code;
}
</script>

<template>
  <aside class="ot-sidebar" :class="{ 'is-open': store.sidebarOpen }">
    <!-- Header -->
    <div class="flex items-center gap-3 border-b px-5 py-4" style="border-color:#d1c9bc">
      <div class="ot-logo flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold tracking-tighter">OT</div>
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2">
          <p class="truncate text-sm font-bold leading-tight" style="color:#3c3c3c">OpenTavern</p>
          <span class="rounded bg-white/70 px-1.5 py-px font-mono text-[9px]" style="color:#5a534c" title="IndexedDB">IDB</span>
        </div>
        <p class="text-[10px] leading-tight" style="color:#8e8e8e">{{ t('app_subtitle') }}</p>
      </div>
      <button class="ot-chip flex h-7 w-7 items-center justify-center rounded-lg" :title="t('card_library')" @click="openLibrary">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button class="ot-chip flex h-7 w-7 items-center justify-center rounded-lg md:hidden" aria-label="Close menu" @click="closeSidebar">&times;</button>
    </div>

    <!-- Language -->
    <div class="flex items-center gap-1 px-3 pt-2">
      <button class="ot-chip rounded-md px-2 py-1 text-[11px] font-semibold" :class="{ 'is-active': locale === 'zh-CN' }" @click="switchLang('zh-CN')">简</button>
      <button class="ot-chip rounded-md px-2 py-1 text-[11px] font-semibold" :class="{ 'is-active': locale === 'zh-TW' }" @click="switchLang('zh-TW')">繁</button>
      <button class="ot-chip rounded-md px-2 py-1 text-[11px] font-semibold" :class="{ 'is-active': locale === 'en' }" @click="switchLang('en')">EN</button>
    </div>

    <!-- New chat + context blocks -->
    <div class="space-y-2 border-b px-3 py-3" style="border-color:#d1c9bc">
      <button class="ot-chip flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium" @click="newChat">
        <span class="text-base">+</span> <span>{{ isZh ? '新对话' : 'New chat' }}</span>
      </button>

      <!-- Character card -->
      <div class="ot-panel space-y-2 p-3">
        <div class="flex items-center justify-between">
          <span class="text-[10px] uppercase tracking-wider" style="color:#8e8e8e">{{ t('char_card_title') }}</span>
          <button v-if="currentChar" class="ot-chip flex h-6 w-6 items-center justify-center rounded-lg text-xs" :title="isZh ? '编辑角色卡' : 'Edit character'" @click="editCurrentChar">✎</button>
        </div>

        <div v-if="currentCharName" class="flex items-center gap-2">
          <div class="ot-logo flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold">{{ currentCharName.charAt(0) }}</div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-medium" style="color:#3c3c3c">{{ currentCharName }}</p>
            <p class="text-[9px]" style="color:#8e8e8e">{{ currentCharTagCount }} tags</p>
          </div>
        </div>
        <p v-else class="text-[10px]" style="color:#8e8e8e">{{ t('char_card_empty') }}</p>

        <div class="flex gap-1.5">
          <button class="ot-chip flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium" @click="ui.open('charImport')">
            <span>📥</span> <span>{{ t('char_btn_import') }}</span>
          </button>
          <button class="ot-chip flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium" @click="ui.open('charEditor')">
            <span>+</span> <span>{{ t('char_btn_create') }}</span>
          </button>
        </div>
      </div>

      <!-- World book -->
      <div class="ot-panel flex items-center gap-2 px-3 py-2 text-xs">
        <span class="flex-1 truncate" style="color:#3c3c3c">{{ t('world_book') }}</span>
        <span class="rounded bg-white/70 px-1.5 py-0.5 text-[10px]" style="color:#5a534c">{{ wiCount }}</span>
        <button class="ot-chip rounded-lg px-2.5 py-1 text-[11px] font-medium" @click="ui.open('worldBook')">{{ isZh ? '策略' : 'Strategy' }}</button>
        <button class="ot-chip rounded-lg px-2.5 py-1 text-[11px] font-medium" @click="ui.open('worldBook')">{{ t('world_book_btn') }}</button>
      </div>

      <!-- Author's Note -->
      <div class="ot-panel flex items-center gap-2 px-3 py-2 text-xs">
        <span class="flex-1 truncate" style="color:#3c3c3c">Author's Note</span>
        <button class="ot-chip rounded-lg px-2.5 py-1 text-[11px] font-medium" @click="ui.open('authorNote')">{{ t('world_book_btn') }}</button>
      </div>
    </div>

    <!-- Conversations -->
    <div class="flex-1 space-y-0.5 overflow-y-auto px-2 py-2">
      <div
        v-for="c in conversations"
        :key="c.id"
        class="conv-item group flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5"
        :class="{ active: c.id === store.activeConvId }"
        @click="openConv(c.id)"
      >
        <div class="min-w-0 flex-1">
          <p class="truncate text-xs font-medium" style="color:#3c3c3c">{{ c.title || t('new_chat_title') }}</p>
          <p class="flex min-w-0 items-center gap-1 text-[10px]" style="color:#8e8e8e">
            <span class="truncate">{{ c.characterName || t('char_card_empty') }}</span>
            <span class="flex-shrink-0">· {{ fmtDate(c) }}</span>
          </p>
        </div>
        <button class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg text-[10px] opacity-0 transition-opacity hover:text-[#16a34a] group-hover:opacity-100" title="Export" @click.stop="exportConv(c.id)">📥</button>
        <button class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-lg text-xs opacity-0 transition-opacity hover:text-[#e55134] group-hover:opacity-100" title="Delete" @click.stop="deleteConv(c.id)">×</button>
      </div>
      <p v-if="!conversations.length" class="px-2 py-8 text-center text-[11px]" style="color:#8e8e8e">
        {{ t('no_conversations') }}
      </p>
    </div>

    <!-- Footer -->
    <div class="space-y-1.5 border-t px-3 py-2" style="border-color:#d1c9bc">
      <div class="flex items-center gap-1.5">
        <button class="ot-chip flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px]" @click="exportAll">{{ t('conv_export_all_btn') }}</button>
        <button class="ot-chip flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px]" @click="triggerImport">{{ t('conv_import_btn') }}</button>
      </div>
      <div class="flex items-center gap-1.5">
        <button class="ot-chip flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px]" @click="ui.open('settings')">
          <span>⚙️</span> <span>{{ t('settings') }}</span>
        </button>
        <button class="ot-chip flex flex-1 items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-[10px]" @click="ui.open('promptViewer')">
          {{ isZh ? '提示词' : 'Prompt' }}
        </button>
      </div>
    </div>

    <input ref="importInput" type="file" accept=".json" class="hidden" @change="onImportFile" />
  </aside>

  <!-- Mobile backdrop -->
  <div v-if="store.sidebarOpen" class="fixed inset-0 z-50 bg-black/30 md:hidden" @click="closeSidebar" />
</template>
