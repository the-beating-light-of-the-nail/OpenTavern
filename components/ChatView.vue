<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useChat } from '~/composables/useChat';
import { useGroupMention } from '~/composables/useGroupMention';
import { useComfy } from '~/composables/useComfy';
import { isGroupChat } from '~/utils/group-helpers';
import { nextTick } from 'vue';

const store = useAppStore();
const ui = useUiStore();
const { t } = useI18n();
const { sendMessage, stopGeneration, regenerate, isGenerating, streamingContent, streamingCot } = useChat();
const groupMention = useGroupMention();
const comfy = useComfy();

const conv = computed(() => store.activeConversation);
const messages = computed<any[]>(() => conv.value?.messages || []);
const inputText = ref('');
const messagesContainer = ref<HTMLElement | null>(null);
const textarea = ref<HTMLTextAreaElement | null>(null);

const isGroup = computed(() => isGroupChat(conv.value));
const groupMembers = computed(() => (isGroup.value && conv.value?.group?.members) ? conv.value.group.members : []);

const charName = computed(() => {
  const c = conv.value;
  if (isGroup.value) {
    const sp = c?._nextGroupSpeaker?.name || c?.group?.members?.[0]?.character?.name;
    if (sp) return sp;
  }
  const ch = c?.characterId ? store.characters[c.characterId] : null;
  return ch?.data?.name || ch?.name || c?.characterName || (c?.character?.name) || t('no_character');
});

/** 群聊发言者名（消息展示用）：优先 speaker，否则 charName */
function senderFor(m: any): string {
  if (m.role === 'user') return store.settings.userName;
  if (m.speaker) return m.speaker;
  return charName.value;
}

const hasActiveConv = computed(() => !!conv.value);

// ComfyUI 生成按钮可见性：启用 + 有会话；可用性由 comfy.canGenerate()
const showComfyBtn = computed(() => !!store.settings.comfyEnabled && hasActiveConv.value);

/** 当前角色是否来自 SEO 静态角色库（characterId 以 'seo-' 开头） */
const currentSlug = computed(() => {
  const id = conv.value?.characterId;
  return id?.startsWith('seo-') ? id.slice(4) : null;
});

function openMenu() { store.sidebarOpen = true; }
function backToLibrary() { store.currentView = 'library'; }
function confirmClear() {
  if (window.confirm(t('clear_chat_confirm'))) {
    store.setActiveConv(null);
  }
}

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

/** @ 提及按钮：群聊打开面板，否则提示 */
function onMentionClick() {
  groupMention.openPanel(conv.value, t('group_mention_no_group'));
}

/** ComfyUI 生成（带当前输入文本） */
function onComfyGenerate() {
  comfy.generateForCurrentChat(inputText.value).then(scrollToBottom);
}
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
        <NuxtLink v-if="currentSlug" :to="`/characters/${currentSlug}`" class="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-500 glass hover:text-rose-accent hover:bg-white/10 transition-all flex items-center justify-center" title="View Character Profile">
          <span class="hidden sm:inline">Profile</span>
          <span class="sm:hidden text-[10px] font-semibold uppercase leading-none">Pr</span>
        </NuxtLink>
        <button id="summarizeBtn" class="px-2 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-500 glass hover:text-zinc-300 hover:bg-white/10 transition-all flex items-center justify-center" @click="ui.open('summaryManager')">
          <span class="hidden sm:inline">{{ t('summary_btn') }}</span>
          <span class="sm:hidden text-[10px] font-semibold uppercase leading-none">Sum</span>
        </button>
        <button id="topConnectBtn" class="w-8 h-8 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-amber-300 transition-colors text-[10px] font-bold" title="Connect Your AI" @click="ui.open('settings')">AI</button>
        <button id="topClearChatBtn" v-if="hasActiveConv" class="w-8 h-8 rounded-xl glass flex items-center justify-center text-zinc-400 hover:text-red-400 transition-colors" title="Clear Chat" @click="confirmClear">Clr</button>

      </div>
    </div>

    <!-- Messages -->
    <div id="messagesContainer" ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      <div v-if="!messages.length && !streamingContent" id="emptyState" class="flex flex-col items-center justify-center h-full text-center">
        <div class="w-20 h-20 rounded-3xl glass flex items-center justify-center text-3xl mb-4">RC</div>
        <p class="text-zinc-400 text-sm font-medium mb-1">{{ t('welcome_title') }}</p>
        <p class="text-zinc-600 text-xs max-w-xs">{{ t('welcome_hint') }}</p>
      </div>
      <MessageBubble
        v-for="(m, i) in messages"
        :key="i"
        :role="m.role"
        :content="m.content"
        :cot="m.cot"
        :attachments="m.attachments"
        :sender-name="senderFor(m)"
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
      <!-- @ 提及气泡（群聊选择后显示，原版 mentionPill，byte ~2650） -->
      <div v-if="groupMention.hasPending.value" id="mentionPill" class="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs font-medium">
        <span id="mentionPillName">{{ groupMention.pillDisplayName.value }}</span>
        <button id="mentionPillClear" class="text-amber-300/70 hover:text-amber-100 text-sm leading-none" @click="groupMention.clear()">&times;</button>
      </div>
      <div class="flex items-center gap-2 sm:gap-2.5">
        <button id="mentionBtn" class="flex-shrink-0 w-11 h-11 rounded-xl glass text-zinc-400 hover:text-amber-300 hover:bg-white/10 active:bg-white/15 transition-all flex items-center justify-center text-xl font-bold touch-manipulation" :title="t('mention_button_title')" aria-label="Mention Character" @click="onMentionClick">@</button>
        <textarea
          ref="textarea"
          id="messageInput"
          v-model="inputText"
          rows="1"
          class="flex-1 px-4 py-3 glass rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none transition-all min-h-[44px]"
          :placeholder="t('input_placeholder')"
          :disabled="!hasActiveConv"
          @keydown="onKeydown"
          @input="autoGrow"
        />
        <!-- ComfyUI 生成按钮（启用时显示） -->
        <button
          v-if="showComfyBtn"
          id="comfyGenerateBtn"
          class="flex-shrink-0 w-11 h-11 rounded-xl glass text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all duration-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          :class="{ 'animate-pulse': comfy.isGenerating.value }"
          :disabled="!comfy.canGenerate()"
          :title="t('comfy_generate_title')"
          @click="onComfyGenerate"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
        </button>
        <!-- 停止按钮（生成中显示） -->
        <button v-if="isGenerating" id="stopBtn" class="flex-shrink-0 w-11 h-11 rounded-xl glass text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 flex items-center justify-center" @click="stopGeneration">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        </button>
        <!-- 重新生成按钮（最后一条是助手消息且非生成中） -->
        <button v-else-if="messages.length && messages[messages.length - 1].role === 'assistant'" class="flex-shrink-0 w-11 h-11 rounded-xl glass text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all duration-200 flex items-center justify-center" @click="regenerate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
        </button>
        <!-- 发送按钮 -->
        <button
          v-else
          id="sendBtn"
          class="flex-shrink-0 w-11 h-11 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-200 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
          :disabled="!inputText.trim() || !hasActiveConv"
          @click="handleSend"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
