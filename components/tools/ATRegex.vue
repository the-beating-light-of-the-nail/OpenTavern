<script setup lang="ts">
/**
 * AI Toolkit · 正则脚本生成器：
 * 用途描述 + 替换目标说明 + 可选示例 → 流式生成严格 JSON（SillyTavern 正则扩展字段）。
 * parseAiJson + validateRegexScript 校验通过 → 字段摘要 + findRegex 高亮块；
 * 失败 → 错误列表（at_rx_err_* i18n key）+ 原文。动作：下载 .json / 复制 / 重新生成。
 */
import { useToolAI } from '~/composables/useToolAI';
import { downloadJson, safeFilename } from '~/utils/st/export';
import {
  aiLangName,
  copyToClipboard,
  normalizeRegexScript,
  parseAiJson,
  validateRegexScript,
  type RegexScript,
} from '~/utils/st/regex-script';

const props = defineProps<{ lang: string; temp: number }>();

const ui = useUiStore();
const { t } = useI18n();

const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

/* ------------------------------ 表单 ------------------------------ */

const purpose = ref('');
const target = ref('');
const sampleIn = ref('');
const sampleOut = ref('');
const formError = ref('');

/* ------------------------------ 生成与解析 ------------------------------ */

const parsed = ref<RegexScript | null>(null);
const errors = ref<string[]>([]);
const parseFailed = ref(false);
let userStopped = false;

async function run() {
  if (running.value) return;
  formError.value = '';
  if (!purpose.value.trim()) {
    formError.value = t('at_err_required');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  parsed.value = null;
  errors.value = [];
  parseFailed.value = false;
  userStopped = false;
  await ai.generate(buildMessages(), { temperature: props.temp, maxTokens: 1200 });
  if (!userStopped) parseOutput();
}

function stop() {
  userStopped = true;
  ai.stop();
}

function parseOutput() {
  const obj = parseAiJson(ai.output.value);
  const v = validateRegexScript(obj);
  if (v.ok && obj && typeof obj === 'object' && !Array.isArray(obj)) {
    parsed.value = normalizeRegexScript(obj as Record<string, unknown>);
    errors.value = [];
    parseFailed.value = false;
  } else {
    parsed.value = null;
    errors.value = v.errors;
    parseFailed.value = true;
  }
}

function buildMessages(): { role: 'system' | 'user'; content: string }[] {
  const langName = aiLangName(props.lang); // scriptName 语言跟随输出语言（正则本身与语言无关）
  const system = [
    'You are a SillyTavern regex-script generator. From the description below, produce ONE regex script.',
    '',
    'STRICT OUTPUT RULES:',
    '1. Output a single valid JSON object and nothing else — no markdown code fences, no commentary.',
    '2. Exactly these keys:',
    '- "scriptName": short human-readable name (string).',
    '- "findRegex": JavaScript regular expression SOURCE as a string — no /slashes/, no flags.',
    '- "replaceString": replacement string; may reference captures as $1, $2…',
    '- "trimStrings": array of strings trimmed before matching (usually []).',
    '- "placement": array of ints — 0 = user input, 1 = AI output, 2 = slash commands, 3 = world info.',
    '- "disabled": false.',
    '- "markdownOnly": true to alter display only, false otherwise.',
    '- "promptOnly": true to alter only what the AI sees, false otherwise.',
    '- "runOnEdit": true to also run on edited messages.',
    '- "substituteRegex": 0 = off, 1 = raw, 2 = escaped.',
    '- "minDepth" / "maxDepth": message depth bounds as ints or null for unlimited.',
    '3. "findRegex" MUST compile as a JavaScript RegExp. Prefer robust patterns and verify them against the example.',
    `4. "scriptName" must be written in ${langName}.`,
  ].join('\n');
  const userLines = [`What the script should do: ${purpose.value.trim()}`];
  if (target.value.trim()) userLines.push(`Where it applies: ${target.value.trim()}`);
  if (sampleIn.value.trim()) userLines.push(`Example input:\n${sampleIn.value.trim()}`);
  if (sampleOut.value.trim()) userLines.push(`Expected output:\n${sampleOut.value.trim()}`);
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: userLines.join('\n\n') },
  ];
}

/* ------------------------------ 摘要与动作 ------------------------------ */

const copied = ref(false);

const placementText = computed(() => {
  const p = parsed.value?.placement || [];
  return p.length ? p.map((x) => t(`at_rx_place_${x}`)).join(' / ') : t('at_rx_place_none');
});

function depthText(v: number | null | undefined): string {
  return typeof v === 'number' ? String(v) : t('at_rx_depth_any');
}

function boolText(v: boolean): string {
  return v ? t('at_rx_yes') : t('at_rx_no');
}

function scriptJson(): string {
  return JSON.stringify(parsed.value, null, 2);
}

async function onCopy() {
  if (!parsed.value) return;
  if (!await copyToClipboard(scriptJson())) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

function download() {
  if (!parsed.value) return;
  const base = safeFilename(parsed.value.scriptName || 'regex-script');
  downloadJson(`${base}.json`, JSON.parse(scriptJson()));
}
</script>

<template>
  <div>
    <!-- 表单区 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <ToolField :label="t('at_rx_purpose')" required>
          <textarea v-model="purpose" rows="2" class="ui-input w-full resize-y" :placeholder="t('at_rx_purpose_ph')" />
        </ToolField>
      </div>
      <div class="sm:col-span-2">
        <ToolField :label="t('at_rx_target')">
          <textarea v-model="target" rows="2" class="ui-input w-full resize-y" :placeholder="t('at_rx_target_ph')" />
        </ToolField>
      </div>
      <ToolField :label="t('at_rx_sample_in')">
        <textarea v-model="sampleIn" rows="3" class="ui-input w-full resize-y font-mono text-xs" :placeholder="t('at_rx_sample_ph')" />
      </ToolField>
      <ToolField :label="t('at_rx_sample_out')">
        <textarea v-model="sampleOut" rows="3" class="ui-input w-full resize-y font-mono text-xs" :placeholder="t('at_rx_sample_ph')" />
      </ToolField>
    </div>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <!-- 生成按钮 -->
    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('at_gen') }}
      </button>
    </div>

    <!-- 流式输出（生成中或校验失败） / 摘要视图（校验通过） -->
    <ATOutput
      v-if="running || !parsed"
      :running="running"
      :error="error"
      :notice="!running && parseFailed ? t('at_rx_parse_err') : ''"
      :output="output"
      @stop="stop"
    >
      <template v-if="!running && parseFailed && errors.length">
        <ul class="mt-3 space-y-1 rounded-lg border border-border-warm bg-rose-tint px-3 py-2 text-xs text-plum">
          <li v-for="e in errors" :key="e">· {{ t(e) }}</li>
        </ul>
      </template>
      <template v-if="!running && output">
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
        </div>
      </template>
    </ATOutput>

    <div v-else class="mt-4">
      <p v-if="error" class="ui-alert-danger mb-2 rounded-lg px-3 py-2 text-xs leading-relaxed">{{ error }}</p>

      <!-- 字段摘要 -->
      <div class="rounded-lg border border-border bg-surface p-3">
        <p class="text-sm font-bold">{{ parsed.scriptName }}</p>
        <dl class="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
          <div class="flex gap-2">
            <dt class="flex-shrink-0 font-semibold text-plum-muted">{{ t('at_rx_f_placement') }}</dt>
            <dd>{{ placementText }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="flex-shrink-0 font-semibold text-plum-muted">{{ t('at_rx_f_display') }}</dt>
            <dd>{{ boolText(parsed.markdownOnly) }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="flex-shrink-0 font-semibold text-plum-muted">{{ t('at_rx_f_prompt') }}</dt>
            <dd>{{ boolText(parsed.promptOnly) }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="flex-shrink-0 font-semibold text-plum-muted">{{ t('at_rx_f_edit') }}</dt>
            <dd>{{ boolText(parsed.runOnEdit) }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="flex-shrink-0 font-semibold text-plum-muted">{{ t('at_rx_f_subst') }}</dt>
            <dd>{{ t(`at_rx_subst_${parsed.substituteRegex}`) }}</dd>
          </div>
          <div class="flex gap-2">
            <dt class="flex-shrink-0 font-semibold text-plum-muted">{{ t('at_rx_f_depth') }}</dt>
            <dd>{{ depthText(parsed.minDepth) }} ~ {{ depthText(parsed.maxDepth) }}</dd>
          </div>
        </dl>
        <p v-if="parsed.trimStrings.length" class="mt-2 text-xs text-plum-muted">
          {{ t('at_rx_f_trim') }}: {{ parsed.trimStrings.join(' | ') }}
        </p>
      </div>

      <!-- findRegex 高亮块 + replaceString -->
      <div class="mt-3">
        <p class="mb-1 text-xs font-semibold">{{ t('at_rx_f_find') }}</p>
        <pre class="overflow-auto whitespace-pre-wrap rounded-lg border border-champagne/50 bg-rose-tint p-3 font-mono text-sm leading-relaxed text-rose-deep">{{ parsed.findRegex }}</pre>
      </div>
      <div class="mt-3">
        <p class="mb-1 text-xs font-semibold">{{ t('at_rx_f_replace') }}</p>
        <pre class="overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 font-mono text-sm leading-relaxed">{{ parsed.replaceString }}</pre>
      </div>

      <!-- 动作按钮组 -->
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="onCopy">⧉ {{ copied ? t('at_copied') : t('at_copy') }}</button>
        <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="download">⇩ {{ t('at_dl_json') }}</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
      </div>
    </div>
  </div>
</template>
