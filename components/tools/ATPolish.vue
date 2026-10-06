<script setup lang="ts">
/**
 * AI Toolkit · 文本优化器：
 * 原文 + 优化目标 + 保留格式开关 → 流式输出优化后的纯文本。
 * 动作：复制 / 替换输入（回填）/ 重新生成。
 */
import { useToolAI } from '~/composables/useToolAI';
import { aiLangName, copyToClipboard } from '~/utils/st/regex-script';

const props = defineProps<{ lang: string; temp: number }>();

const ui = useUiStore();
const { t } = useI18n();

const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

/* ------------------------------ 表单 ------------------------------ */

const text = ref('');
const goal = ref('readability');
const keepFmt = ref(true);
const formError = ref('');

/** 目标选项：value 供提示词使用，label 走 at_o_goal_1..4 */
const GOALS = [
  {
    value: 'token',
    desc: 'Minimize token usage: cut redundancy, filler and repetition while keeping all essential meaning. Aim for noticeably shorter text.',
  },
  {
    value: 'readability',
    desc: 'Improve readability: smoother flow, clearer sentences, natural rhythm, consistent tone.',
  },
  {
    value: 'emoji',
    desc: 'Remove ALL emojis, emoticons and decorative symbols; where an emoji carries meaning, replace it with plain words.',
  },
  {
    value: 'translationese',
    desc: 'Fix translationese: rewrite stiff, machine-translated or awkward phrasing into natural, idiomatic sentences.',
  },
];

const copied = ref(false);
const replaced = ref(false);

/* ------------------------------ 生成与动作 ------------------------------ */

async function run() {
  if (running.value) return;
  formError.value = '';
  replaced.value = false;
  if (!text.value.trim()) {
    formError.value = t('at_err_required');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  await ai.generate(buildMessages(), { temperature: props.temp, maxTokens: 2000 });
}

function buildMessages(): { role: 'system' | 'user'; content: string }[] {
  const langName = aiLangName(props.lang);
  const goalDesc = GOALS.find((g) => g.value === goal.value)?.desc || '';
  const fmtRule = keepFmt.value
    ? 'Preserve the original line breaks and formatting structure.'
    : 'You may adjust formatting freely when it serves the goal.';
  const system = [
    'You are a text editor for roleplay content. Rewrite the user\'s text according to the goal.',
    '',
    'RULES:',
    '1. Output ONLY the rewritten text itself — no explanations, no surrounding quotes.',
    `2. Goal: ${goalDesc}`,
    `3. ${fmtRule} Macros like {{char}} and {{user}} must stay intact.`,
    '4. Keep the original meaning and voice; never invent new content.',
    `5. Write the output in ${langName} (if the goal allows, keep the input's own language).`,
  ].join('\n');
  const user = text.value.trim();
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: user },
  ];
}

async function onCopy() {
  if (!await copyToClipboard(output.value)) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

/** 替换输入（回填）：用优化结果覆盖原文 */
function backfill() {
  if (!output.value) return;
  text.value = output.value;
  replaced.value = true;
  setTimeout(() => { replaced.value = false; }, 2500);
}
</script>

<template>
  <div>
    <!-- 表单区 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <ToolField :label="t('at_o_text')" required>
          <textarea v-model="text" rows="6" class="ui-input w-full resize-y" :placeholder="t('at_o_text_ph')" />
        </ToolField>
      </div>
      <ToolField :label="t('at_o_goal')">
        <select v-model="goal" class="ui-input w-full">
          <option value="token">{{ t('at_o_goal_1') }}</option>
          <option value="readability">{{ t('at_o_goal_2') }}</option>
          <option value="emoji">{{ t('at_o_goal_3') }}</option>
          <option value="translationese">{{ t('at_o_goal_4') }}</option>
        </select>
      </ToolField>
      <ToolField :label="t('at_o_keepfmt')">
        <label class="flex cursor-pointer items-center gap-2 text-sm">
          <input v-model="keepFmt" type="checkbox" class="accent-rose-deep">
          <span class="text-plum-muted">{{ t('at_o_keepfmt_hint') }}</span>
        </label>
      </ToolField>
    </div>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <!-- 生成按钮 -->
    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('at_gen') }}
      </button>
    </div>

    <!-- 流式输出面板 + 动作按钮组 -->
    <ATOutput :running="running" :error="error" :output="output" @stop="ai.stop()">
      <template v-if="!running && output">
        <p v-if="replaced" class="ui-status-success mb-2 rounded-lg px-3 py-2 text-xs">{{ t('at_o_replaced') }}</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="onCopy">⧉ {{ copied ? t('at_copied') : t('at_copy') }}</button>
          <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="backfill">↥ {{ t('at_o_replace_input') }}</button>
          <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
        </div>
      </template>
    </ATOutput>
  </div>
</template>
