<script setup lang="ts">
/**
 * 带宏自动补全的 textarea（Cardmak 交互模型）+ 可选的逐字段 AI 写作。
 *
 * 补全行为：光标前回扫 "{{"（遇空白/换行/"}}" 停止）→ 按已输前缀过滤宏清单 →
 * ↑↓ 导航、Enter/Tab 接受、Esc 关闭、点击接受；失焦 150ms 后收起。
 *
 * AI 写作：点按钮展开补充要求输入 → 流式预览 → 应用/放弃；
 * 未配置 API 时引导打开设置（复用全局 ModalsHost 里的 SettingsModal）。
 */
import { MACROS } from '~/utils/st/macros';
import type { WritableField } from '~/utils/ai-prompts';
import { fieldWriteMessages } from '~/utils/ai-prompts';
import { useToolAI } from '~/composables/useToolAI';

const props = withDefaults(defineProps<{
  rows?: number;
  placeholder?: string;
  /** 传入字段名时启用 AI 写作按钮 */
  aiField?: WritableField | null;
  /** AI 上下文用的卡数据（响应式由父层保证） */
  aiContext?: () => CardDataLike;
  disabled?: boolean;
}>(), { rows: 4, aiField: null, disabled: false, aiContext: undefined });

interface CardDataLike {
  name?: string;
  description?: string;
  personality?: string;
  scenario?: string;
  first_mes?: string;
  mes_example?: string;
  creator_notes?: string;
  [k: string]: unknown;
}

const model = defineModel<string>({ required: true });
const { t } = useI18n();
const ui = useUiStore();

/* ------------------------------ 宏补全 ------------------------------ */

const ta = ref<HTMLTextAreaElement | null>(null);
const sugOpen = ref(false);
const sugIndex = ref(0);
const suggestions = ref<typeof MACROS>([]);
let blurTimer: ReturnType<typeof setTimeout> | null = null;

/** 光标前回扫 "{{"，返回 {start, typed}；无进行中宏返回 null */
function scanMacro(): { start: number; typed: string } | null {
  const el = ta.value;
  if (!el) return null;
  const pos = el.selectionStart;
  const text = el.value.slice(0, pos);
  for (let i = pos - 1; i >= 0; i--) {
    const ch = text[i];
    if (ch === '{' && text[i - 1] === '{') {
      return { start: i - 1, typed: text.slice(i + 1) };
    }
    if (ch === '}' || /\s/.test(ch)) return null;
  }
  return null;
}

function refreshSuggestions() {
  const scan = scanMacro();
  if (!scan || scan.typed.includes('}}')) {
    sugOpen.value = false;
    return;
  }
  const q = scan.typed.toLowerCase();
  const list = MACROS.filter((m) => m.name.toLowerCase().startsWith(q) || (q.length > 1 && m.name.toLowerCase().includes(q)));
  if (!list.length) {
    sugOpen.value = false;
    return;
  }
  suggestions.value = list.slice(0, 8);
  sugIndex.value = 0;
  sugOpen.value = true;
}

function completionText(m: (typeof MACROS)[number]): string {
  return m.usage ? `{{${m.usage}}}` : `{{${m.name}}}`;
}

function acceptSuggestion(m?: (typeof MACROS)[number]) {
  const scan = scanMacro();
  const target = m || suggestions.value[sugIndex.value];
  if (!scan || !target || !ta.value) {
    sugOpen.value = false;
    return;
  }
  const el = ta.value;
  const after = el.value.slice(el.selectionStart);
  const insert = completionText(target);
  model.value = el.value.slice(0, scan.start) + insert + after;
  sugOpen.value = false;
  nextTick(() => {
    el.focus();
    const pos = scan.start + insert.length;
    el.setSelectionRange(pos, pos);
  });
}

function onKeydown(e: KeyboardEvent) {
  if (sugOpen.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      sugIndex.value = (sugIndex.value + 1) % suggestions.value.length;
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      sugIndex.value = (sugIndex.value - 1 + suggestions.value.length) % suggestions.value.length;
      return;
    }
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      acceptSuggestion();
      return;
    }
    if (e.key === 'Escape') {
      sugOpen.value = false;
      return;
    }
  }
}

function onBlurTa() {
  blurTimer = setTimeout(() => { sugOpen.value = false; }, 150);
}

/* ------------------------------ AI 写作 ------------------------------ */

const ai = useToolAI();
const aiPanelOpen = ref(false);
const aiHint = ref('');
const aiApplied = ref(false);

const aiAvailable = computed(() => ai.isConfigured());
const aiRunning = computed(() => ai.running.value);
const aiError = computed(() => ai.error.value);
const previewText = computed(() => ai.output.value);

watch(() => ai.running.value, (running) => {
  if (running) aiApplied.value = false;
});

function toggleAiPanel() {
  aiPanelOpen.value = !aiPanelOpen.value;
  if (!aiPanelOpen.value) ai.stop();
}

async function startAi() {
  aiApplied.value = false;
  const ctx = props.aiContext ? props.aiContext() : {};
  const lang = useAppStore().settings.lang || 'en';
  const messages = fieldWriteMessages(props.aiField as WritableField, ctx as any, lang, aiHint.value);
  await ai.generate(messages);
}

function applyAi() {
  model.value = previewText.value;
  aiApplied.value = true;
  ai.output.value = '';
  aiPanelOpen.value = false;
  aiHint.value = '';
}

function discardAi() {
  ai.stop();
  ai.output.value = '';
  aiPanelOpen.value = false;
}

function openSettings() {
  ui.open('settings');
}
</script>

<template>
  <div class="relative">
    <div class="relative">
      <textarea
        ref="ta"
        :value="model"
        :rows="rows"
        :placeholder="placeholder"
        :disabled="disabled"
        class="ui-input block w-full resize-y"
        @input="model = ($event.target as HTMLTextAreaElement).value; refreshSuggestions()"
        @keydown="onKeydown"
        @blur="onBlurTa"
      />
      <button
        v-if="aiField"
        type="button"
        class="ui-button ui-button-ghost ui-button-xs absolute right-2 top-2"
        :title="t('cs_ai_write')"
        @click="toggleAiPanel"
      >✦ {{ t('cs_ai_write') }}</button>
    </div>

    <!-- 宏补全下拉 -->
    <ul
      v-if="sugOpen"
      class="absolute bottom-full left-0 z-20 mb-1 max-h-56 w-72 overflow-auto rounded-lg border border-border bg-surface py-1 shadow-lg"
      role="listbox"
    >
      <li
        v-for="(m, i) in suggestions"
        :key="m.name"
        class="cursor-pointer px-3 py-1.5 text-sm"
        :class="i === sugIndex ? 'bg-rose-tint font-semibold' : ''"
        role="option"
        :aria-selected="i === sugIndex"
        @mousedown.prevent="acceptSuggestion(m)"
        @mousemove="sugIndex = i"
      >
        <span class="font-mono text-rose-deep">{{ completionText(m) }}</span>
        <span class="ml-2 text-xs text-plum-muted">{{ t(m.key) }}</span>
      </li>
    </ul>

    <!-- AI 写作面板 -->
    <div v-if="aiField && aiPanelOpen" class="mt-2 rounded-lg border border-border bg-surface-soft p-3">
      <template v-if="!aiAvailable && !aiRunning">
        <p class="text-xs text-plum-muted">{{ t('cs_ai_need_key') }}</p>
        <button type="button" class="ui-button ui-button-secondary ui-button-xs mt-2" @click="openSettings">
          {{ t('cs_ai_open_settings') }}
        </button>
      </template>
      <template v-else>
        <div class="flex items-center gap-2">
          <input
            v-model="aiHint"
            type="text"
            class="ui-input ui-input-compact flex-1 text-sm"
            :placeholder="t('cs_ai_hint_ph')"
            @keydown.enter.prevent="!aiRunning && startAi()"
          >
          <button v-if="!aiRunning && !previewText" type="button" class="ui-button ui-button-primary ui-button-xs" @click="startAi">
            {{ t('cs_ai_start') }}
          </button>
          <button v-if="aiRunning" type="button" class="ui-button ui-button-danger-ghost ui-button-xs" @click="ai.stop()">
            {{ t('cs_ai_stop') }}
          </button>
        </div>
        <p v-if="aiError" class="ui-alert-danger mt-2 rounded-md px-2 py-1 text-xs">{{ aiError }}</p>
        <div v-if="previewText || aiRunning" class="mt-2">
          <pre class="max-h-48 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-surface p-2 text-xs leading-relaxed">{{ previewText }}<span v-if="aiRunning" class="animate-pulse">▌</span></pre>
          <div v-if="!aiRunning && previewText" class="mt-2 flex gap-2">
            <button type="button" class="ui-button ui-button-primary ui-button-xs" @click="applyAi">{{ t('cs_ai_apply') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" @click="discardAi">{{ t('cs_ai_discard') }}</button>
          </div>
        </div>
        <p v-if="aiApplied && !previewText" class="ui-status-success mt-2 text-xs">{{ t('cs_ai_done') }}</p>
      </template>
    </div>
  </div>
</template>
