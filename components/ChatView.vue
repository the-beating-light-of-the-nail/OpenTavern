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
    <div id="chatTopBar" class="ui-topbar flex-shrink-0 px-5 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3 min-w-0">
        <button class="hamburger-btn" aria-label="Menu" @click="openMenu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div id="charAvatar" class="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-semibold uppercase flex-shrink-0 ot-avatar-fill" style="color:var(--color-on-primary)">{{ charName.charAt(0) || t('new_chat_title').charAt(0) }}</div>
        <div class="min-w-0 cursor-pointer" @click="backToLibrary">
          <h3 id="chatTitle" class="text-sm font-semibold truncate" style="color:var(--color-text)">{{ conv?.title || t('new_chat_title') }}</h3>
          <p id="chatSubtitle" class="text-[10px] truncate" style="color:var(--color-text-muted)">{{ charName }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0 topbar-actions">
        <NuxtLink v-if="currentSlug" :to="`/characters/${currentSlug}`" class="ui-button ui-button-sm" :title="t('profile')">
          <span class="hidden sm:inline">{{ t('profile') }}</span>
          <span class="sm:hidden text-[10px] font-semibold uppercase leading-none">Pr</span>
        </NuxtLink>
        <button id="summarizeBtn" class="ui-button ui-button-sm" @click="ui.open('summaryManager')">
          <span class="hidden sm:inline">{{ t('summary_btn') }}</span>
          <span class="sm:hidden text-[10px] font-semibold uppercase leading-none">{{ t('summary_short') }}</span>
        </button>
        <button id="topConnectBtn" class="ui-button ui-button-icon-sm text-[10px] font-bold" :title="t('connect_your_ai')" @click="ui.open('settings')">AI</button>
        <button id="topClearChatBtn" v-if="hasActiveConv" class="ui-button ui-button-icon-sm text-[10px]" :title="t('clear_chat')" @click="confirmClear">Clr</button>

      </div>
    </div>

    <!-- Messages -->
    <div id="messagesContainer" ref="messagesContainer" class="flex-1 overflow-y-auto px-4 py-4 space-y-4" style="background:var(--color-bg)">
      <div v-if="!messages.length && !streamingContent" id="emptyState" class="flex flex-col items-center justify-center h-full text-center">
        <div class="w-20 h-20 rounded-3xl ui-panel flex items-center justify-center text-3xl mb-4">RC</div>
        <p class="text-sm font-medium mb-1" style="color:var(--color-text-muted)">{{ t('welcome_title') }}</p>
        <p class="text-xs max-w-xs" style="color:var(--color-text-faint)">{{ t('welcome_hint') }}</p>
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
    <div class="ui-topbar flex-shrink-0 px-4 py-3">
      <!-- @ 提及气泡（群聊选择后显示） -->
      <div v-if="groupMention.hasPending.value" id="mentionPill" class="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium" style="background:color-mix(in srgb,var(--color-primary) 20%,transparent);border:1px solid color-mix(in srgb,var(--color-primary) 40%,transparent);color:var(--color-primary)">
        <span id="mentionPillName">{{ groupMention.pillDisplayName.value }}</span>
        <button id="mentionPillClear" class="text-sm leading-none" style="color:color-mix(in srgb,var(--color-primary) 70%,var(--color-text))" @click="groupMention.clear()">&times;</button>
      </div>
      <div class="flex items-center gap-2 sm:gap-2.5">
        <button id="mentionBtn" class="ui-button ui-button-icon text-xl font-bold touch-manipulation" :title="t('mention_button_title')" aria-label="Mention Character" @click="onMentionClick">@</button>
        <textarea
          ref="textarea"
          id="messageInput"
          v-model="inputText"
          rows="1"
          class="ui-input ui-input-chat flex-1"
          :placeholder="t('input_placeholder')"
          :disabled="!hasActiveConv"
          @keydown="onKeydown"
          @input="autoGrow"
        />
        <!-- ComfyUI 生成按钮（启用时显示） -->
        <button
          v-if="showComfyBtn"
          id="comfyGenerateBtn"
          class="ui-button ui-button-icon"
          :class="{ 'animate-pulse': comfy.isGenerating.value }"
          :disabled="!comfy.canGenerate()"
          :title="t('comfy_generate_title')"
          @click="onComfyGenerate"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
        </button>
        <!-- 停止按钮（生成中显示） -->
        <button v-if="isGenerating" id="stopBtn" class="ui-button ui-button-icon" style="color:var(--color-danger)" @click="stopGeneration">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2" /></svg>
        </button>
        <!-- 重新生成按钮（最后一条是助手消息且非生成中） -->
        <button v-else-if="messages.length && messages[messages.length - 1].role === 'assistant'" class="ui-button ui-button-icon" @click="regenerate">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
        </button>
        <!-- 发送按钮 -->
        <button
          v-else
          id="sendBtn"
          class="ui-button-primary ui-button-icon"
          :disabled="!inputText.trim() || !hasActiveConv"
          @click="handleSend"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
        </button>
      </div>
    </div>
  </div>
</template>
