<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useChat } from '~/composables/useChat';
import { nextTick } from 'vue';

const store = useAppStore();
const ui = useUiStore();
const { t, locale, locales, setLocale } = useI18n();
const { sendMessage, stopGeneration, regenerate, isGenerating, streamingContent, streamingCot } = useChat();

const availableLocales = computed(() => (locales.value as any[]).map((l) => ({ code: l.code, name: l.name })));
const conv = computed(() => store.activeConversation);
const messages = computed<any[]>(() => conv.value?.messages || []);
const inputText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const textarea = ref<HTMLTextAreaElement | null>(null);

const charName = computed(() => {
  const c = conv.value;
  const ch = c?.characterId ? store.characters[c.characterId] : null;
  return ch?.data?.name || ch?.name || c?.characterName || (c?.character?.name) || t('no_character');
});

const hasActiveConv = computed(() => !!conv.value);

function switchLang(code: string) {
  setLocale(code as any);
  if (store.settings) store.settings.lang = code;
}
function openMenu() { store.sidebarOpen = true; }
function backToLibrary() { store.currentView = 'library'; }

/** 自适应输入框高度 */
function autoGrow() {
  const el = textarea.value;
  if (!el) return;
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

async function handleSend() {
  const text = inputText.value;
  if (!text.trim() || isGenerating.value) return;
  inputText.value = '';
  await nextTick();
  autoGrow();
  await sendMessage(text);
  await scrollToBottom();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

async function scrollToBottom() {
  await nextTick();
  const c = messagesContainer.value;
  if (c) c.scrollTop = c.scrollHeight;
}

// 流式内容变化时自动滚到底
watch(streamingContent, () => { scrollToBottom(); });
</script>

<template>
  <div id="chatView" class="flex-1 flex flex-col overflow-hidden">
    <!-- Top Bar -->
    <div id="chatTopBar" class="flex-shrink-0 px-5 py-3 flex items-center justify-between border-b border-white/5 bg-zinc-950/15 backdrop-blur-2xl">
      <div class="flex items-center gap-3 min-w-0">
        <button class="hamburger-btn" aria-label="Menu" @click="openMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div id="charAvatar" class="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-zinc-500 text-[10px] font-semibold uppercase flex-shrink-0 ot-avatar-fill">{{ charName.charAt(0) || 'Chat' }}</div>
        <div class="min-w-0 cursor-pointer" @click="backToLibrary">
          <h3 id="chatTitle" class="text-sm font-semibold text-zinc-200 truncate">{{ conv?.title || t('new_chat_title') }}</h3>
          <p id="chatSubtitle" class="text-[10px] text-zinc-500 truncate">{{ charName }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 topbar-actions">
        <div class="flex items-center glass rounded-xl p-0.5 border-white/5">
          <button v-for="l in availableLocales" :key="l.code" class="lang-btn px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200" :class="locale === l.code ? 'active text-zinc-900' : 'text-zinc-400'" @click="switchLang(l.code)">{{ l.name }}</button>
        </div>
        <button id="summarizeBtn" class="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-500 glass hover:text-zinc-300 hover:bg-white/10 transition-all flex items-center justify-center" @click="ui.open('summaryManager')">
          <span class="hidden sm:inline">{{ t('summary_btn') }}</span>
          <span class="sm:hidden text-[10px] font-semibold uppercase leading-none">Sum</span>
        </button>
        <button id="topSettingsBtn" class="w-8 h-8 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors" @click="ui.open('settings')">Set</button>
        <a id="githubBtn" href="https://github.com/Hajimides/OpenTavern" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors" title="GitHub Repository">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" /></svg>
        </a>
      </div>
    </div>

    <!-- Messages -->
    <div id="messagesContainer" ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <div v-if="!messages.length && !streamingContent" id="emptyState" class="flex flex-col items-center justify-center h-full text-center">
        <div class="w-20 h-20 rounded-3xl glass flex items-center justify-center text-3xl mb-4">OT</div>
        <p class="text-zinc-400 text-sm font-medium mb-1">{{ t('welcome_title') }}</p>
        <p class="text-zinc-600 text-xs max-w-xs">{{ t('welcome_hint') }}</p>
      </div>
      <MessageBubble
        v-for="(m, i) in messages"
        :key="i"
        :role="m.role"
        :content="m.content"
        :cot="m.cot"
        :sender-name="m.role === 'assistant' ? charName : store.settings.userName"
      />
      <!-- 流式生成中的临时气泡 -->
      <MessageBubble
        v-if="streamingContent || streamingCot"
        role="assistant"
        :content="streamingContent"
        :cot="streamingCot"
        :sender-name="charName"
        :streaming="true"
      />
    </div>

    <!-- Input Area -->
    <div class="flex-shrink-0 px-4 py-3 border-t border-white/5 bg-zinc-950/15 backdrop-blur-2xl">
      <div class="flex items-center gap-2 sm:gap-2.5">
        <button id="mentionBtn" class="flex-shrink-0 w-11 h-11 rounded-xl glass text-zinc-400 hover:text-amber-300 hover:bg-white/10 active:bg-white/15 transition-all flex items-center justify-center text-xl font-bold touch-manipulation" aria-label="Mention Character">@</button>
        <textarea
          ref="textarea"
          id="messageInput"
          v-model="inputText"
          rows="1"
          class="flex-1 px-4 py-3 glass rounded-2xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-all min-h-[44px]"
          :placeholder="t('input_placeholder')"
          :disabled="!hasActiveConv"
          @keydown="onKeydown"
          @input="autoGrow"
        />
        <!-- 停止按钮（生成中显示） -->
        <button v-if="isGenerating" id="stopBtn" class="flex-shrink-0 w-11 h-11 rounded-2xl glass text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center" @click="stopGeneration">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        </button>
        <!-- 重新生成按钮（最后一条是助手消息且非生成中） -->
        <button v-else-if="messages.length && messages[messages.length - 1].role === 'assistant'" class="flex-shrink-0 w-11 h-11 rounded-2xl glass text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all duration-200 flex items-center justify-center" @click="regenerate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
        </button>
        <!-- 发送按钮 -->
        <button
          v-else
          id="sendBtn"
          class="flex-shrink-0 w-11 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!inputText.trim() || !hasActiveConv"
          @click="handleSend"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
