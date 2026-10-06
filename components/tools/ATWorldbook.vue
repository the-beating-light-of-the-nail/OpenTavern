<script setup lang="ts">
/**
 * AI Toolkit · 世界书条目生成器：
 * 主题 + 条目数 + 详细度 + 关键词语言 → 流式生成严格 JSON 数组。
 * 解析容错（剥 ``` 围栏、截取首对方括号）→ 成功进暂存表格（逐行可编辑），失败显示原文 + 错误。
 * 动作：存为新世界书（toolbox.addWorldbook，WorldInfoEntry 必填字段补默认值）/ 复制 JSON / 下载 .json / 重新生成。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { useToolAI } from '~/composables/useToolAI';
import { downloadJson, safeFilename } from '~/utils/st/export';
import {
  aiLangName,
  buildWorldbookFromDrafts,
  copyToClipboard,
  parseWorldbookDrafts,
  type ToolkitWbDraft,
} from '~/utils/st/regex-script';

const props = defineProps<{ lang: string; temp: number }>();

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t } = useI18n();

const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

/* ------------------------------ 表单 ------------------------------ */

const topic = ref('');
const count = ref(5);
const detail = ref<'brief' | 'standard' | 'rich'>('standard');
const keyLang = ref('en');
const formError = ref('');

const COUNTS = [3, 4, 5, 6, 7, 8, 9, 10];
const DETAILS = [
  { value: 'brief' as const, desc: 'concise — 40-80 words per entry', len: '40-80 words' },
  { value: 'standard' as const, desc: 'balanced — 80-150 words per entry', len: '80-150 words' },
  { value: 'rich' as const, desc: 'rich — 150-280 words per entry', len: '150-280 words' },
];

/* ------------------------------ 生成与解析 ------------------------------ */

const drafts = ref<ToolkitWbDraft[]>([]);
const parseFailed = ref(false);
// 用户主动停止时不做解析（部分输出多半不完整），保留流式原文
let userStopped = false;

async function run() {
  if (running.value) return;
  formError.value = '';
  saved.value = false;
  if (!topic.value.trim()) {
    formError.value = t('at_err_required');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  drafts.value = [];
  parseFailed.value = false;
  userStopped = false;
  await ai.generate(buildMessages(), { temperature: props.temp, maxTokens: 3000 });
  if (!userStopped) parseOutput();
}

function stop() {
  userStopped = true;
  ai.stop();
}

function parseOutput() {
  const list = parseWorldbookDrafts(ai.output.value);
  if (list) {
    drafts.value = list;
    parseFailed.value = false;
  } else {
    drafts.value = [];
    parseFailed.value = true;
  }
}

function buildMessages(): { role: 'system' | 'user'; content: string }[] {
  const langName = aiLangName(props.lang);
  const keyLangName = aiLangName(keyLang.value);
  const det = DETAILS.find((d) => d.value === detail.value) || DETAILS[1];
  const system = [
    'You are a world-info (lorebook) author for AI roleplay.',
    `Write ${count.value} worldbook entries about the topic below. Detail level: ${det.desc}.`,
    '',
    'STRICT OUTPUT RULES:',
    '1. Output a single valid JSON array and nothing else — no markdown code fences, no commentary.',
    '2. Each element MUST be an object exactly like: { "keys": ["main keyword"], "secondary_keys": [], "comment": "entry title", "content": "entry body" }',
    `3. "keys": 1-3 short trigger keywords in ${keyLangName}. "secondary_keys": optional extra keywords (empty array is fine).`,
    `4. "comment": a short title in ${langName}. "content": a self-contained third-person lore description in ${langName} (${det.len}). Never reference "this entry".`,
    '5. Entries cover different facets of the topic with minimal overlap.',
  ].join('\n');
  const user = `Topic / setting: ${topic.value.trim()}\nWrite ${count.value} entries as a strict JSON array.`;
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}

/* ------------------------------ 暂存表格与动作 ------------------------------ */

const bookName = ref('');
const saved = ref(false);
const copied = ref(false);

/** 从暂存条目构建 ST 世界书（WorldInfoEntry 必填字段全部补默认值） */
const stagedBook = computed(() => buildWorldbookFromDrafts(drafts.value));

function saveBook() {
  if (!drafts.value.length) return;
  const name = bookName.value.trim() || t('at_w_default_name');
  toolbox.addWorldbook(name, JSON.parse(JSON.stringify(stagedBook.value)));
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 2500);
}

async function onCopyJson() {
  if (!await copyToClipboard(JSON.stringify(stagedBook.value, null, 2))) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

function downloadBook() {
  const name = safeFilename(bookName.value.trim() || 'worldbook');
  downloadJson(`${name}.json`, JSON.parse(JSON.stringify(stagedBook.value)));
}
</script>

<template>
  <div>
    <!-- 表单区 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <ToolField :label="t('at_w_topic')" required>
          <textarea v-model="topic" rows="3" class="ui-input w-full resize-y" :placeholder="t('at_w_topic_ph')" />
        </ToolField>
      </div>
      <ToolField :label="t('at_w_count')">
        <select v-model.number="count" class="ui-input w-full">
          <option v-for="n in COUNTS" :key="n" :value="n">{{ n }}</option>
        </select>
      </ToolField>
      <ToolField :label="t('at_w_detail')">
        <select v-model="detail" class="ui-input w-full">
          <option value="brief">{{ t('at_w_det_1') }}</option>
          <option value="standard">{{ t('at_w_det_2') }}</option>
          <option value="rich">{{ t('at_w_det_3') }}</option>
        </select>
      </ToolField>
      <ToolField :label="t('at_w_keylang')" :hint="t('at_w_keylang_hint')">
        <select v-model="keyLang" class="ui-input w-full">
          <option value="en">{{ t('at_lang_en') }}</option>
          <option value="zh-CN">{{ t('at_lang_zhcn') }}</option>
          <option value="zh-TW">{{ t('at_lang_zhtw') }}</option>
          <option value="ja">{{ t('at_lang_ja') }}</option>
          <option value="ko">{{ t('at_lang_ko') }}</option>
        </select>
      </ToolField>
    </div>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <!-- 生成按钮 -->
    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('at_gen') }}
      </button>
    </div>

    <!-- 流式输出（生成中或解析失败） / 暂存表格（解析成功） -->
    <ATOutput
      v-if="running || !drafts.length"
      :running="running"
      :error="error"
      :notice="!running && parseFailed ? t('at_w_parse_err') : ''"
      :output="output"
      @stop="stop"
    >
      <template v-if="!running">
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
        </div>
      </template>
    </ATOutput>

    <div v-else class="mt-4">
      <p v-if="error" class="ui-alert-danger mb-2 rounded-lg px-3 py-2 text-xs leading-relaxed">{{ error }}</p>
      <p v-if="saved" class="ui-status-success mb-2 rounded-lg px-3 py-2 text-xs">{{ t('at_w_saved') }}</p>

      <!-- 暂存表格：逐行编辑关键词 / 副关键词 / 标题 / 内容 -->
      <div class="space-y-3">
        <div
          v-for="(d, i) in drafts"
          :key="i"
          class="rounded-lg border border-border bg-surface p-3"
        >
          <p class="mb-2 text-xs font-bold text-rose-accent">{{ t('at_w_entry_n', { n: i + 1 }) }}</p>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <ToolField :label="t('at_w_keys')">
              <ToolTagInput v-model="d.keys" />
            </ToolField>
            <ToolField :label="t('at_w_secondary')">
              <ToolTagInput v-model="d.secondaryKeys" />
            </ToolField>
          </div>
          <div class="mt-2.5">
            <ToolField :label="t('at_w_comment')">
              <input v-model="d.comment" type="text" class="ui-input w-full">
            </ToolField>
          </div>
          <div class="mt-2.5">
            <ToolField :label="t('at_w_content')">
              <textarea v-model="d.content" rows="4" class="ui-input w-full resize-y" />
            </ToolField>
          </div>
        </div>
      </div>

      <!-- 动作按钮组：存为新世界书 / 复制 JSON / 下载 .json / 重新生成 -->
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input
          v-model="bookName"
          type="text"
          class="ui-input ui-input-compact max-w-48 text-sm"
          :placeholder="t('at_w_book_name_ph')"
        >
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="saveBook">📖 {{ t('at_w_save_book') }}</button>
        <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="onCopyJson">⧉ {{ copied ? t('at_copied') : t('at_w_copy_json') }}</button>
        <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="downloadBook">⇩ {{ t('at_dl_json') }}</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
      </div>
    </div>
  </div>
</template>
