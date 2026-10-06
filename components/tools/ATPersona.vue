<script setup lang="ts">
/**
 * AI Toolkit · 人设生成器：
 * 角色名 + 一句话概念 + 风格 + 补充要求 → 流式生成完整人设。
 * 输出格式单选：JSON（SillyTavern V2 data 片段）/ YAML 人设。
 * JSON 模式额外动作：下载 .json（包装成完整 V2 卡）与存入 Card Studio（toolbox.addCard）。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { useToolAI } from '~/composables/useToolAI';
import { normalizeToCard } from '~/utils/st/convert';
import { downloadJson, safeFilename } from '~/utils/st/export';
import { aiLangName, copyToClipboard, parseAiJson } from '~/utils/st/regex-script';

const props = defineProps<{ lang: string; temp: number }>();

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t } = useI18n();

const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

/* ------------------------------ 表单 ------------------------------ */

const name = ref('');
const concept = ref('');
const style = ref('sweet');
const extra = ref('');
const fmt = ref<'json' | 'yaml'>('json');
const formError = ref('');

/** 风格选项：value 供提示词使用，label 走 at_p_style_1..6 */
const STYLES = [
  { value: 'sweet', desc: 'sweet romance / heartwarming fluff' },
  { value: 'mystery', desc: 'suspense / mystery' },
  { value: 'adventure', desc: 'adventure / action' },
  { value: 'healing', desc: 'healing / slice-of-life comfort' },
  { value: 'dark', desc: 'dark fantasy' },
  { value: 'scifi', desc: 'science fiction' },
];

const copied = ref(false);
const saved = ref(false);

/* ------------------------------ 提示词 ------------------------------ */

function buildMessages(): { role: 'system' | 'user'; content: string }[] {
  const langName = aiLangName(props.lang);
  const styleDesc = STYLES.find((s) => s.value === style.value)?.desc || '';
  const fields =
    '- "description": appearance, identity, backstory, personality and behavioral habits (150-300 words).\n' +
    '- "personality": concise trait summary.\n' +
    '- "scenario": the situation where the character meets {{user}} (time, place, relationship, current state).\n' +
    '- "first_mes": an engaging opening message in the character\'s voice, ending with room for the user to respond.\n' +
    '- "mes_example": 2-3 example dialogue blocks, each starting with <START> and formatted as {{char}}: dialogue.\n' +
    '- "creator_notes": one short paragraph addressed to the card author.';
  const system = fmt.value === 'json'
    ? [
        'You are an expert character-card writer for AI roleplay (SillyTavern V2 spec).',
        'Create an original character from the brief below.',
        '',
        'STRICT OUTPUT RULES:',
        '1. Output a SINGLE valid JSON object and nothing else — no markdown code fences, no commentary.',
        '2. Required keys: "name", "description", "personality", "scenario", "first_mes", "mes_example", "tags", "creator_notes".',
        '3. Every string value MUST be written in ' + langName + '; "tags" is an array of 3-6 short strings.',
        '4. Field semantics:',
        fields,
        '5. Use {{char}} for the character and {{user}} for the user where appropriate; never speak or act for {{user}} in first_mes.',
      ].join('\n')
    : [
        'You are an expert character-profile writer for AI roleplay.',
        'Create an original character from the brief below.',
        '',
        'STRICT OUTPUT RULES:',
        '1. Output ONLY a YAML document — no markdown code fences, no commentary.',
        '2. Top-level keys: name, description, personality, scenario, first_mes, mes_example, tags, creator_notes.',
        '3. Every value MUST be written in ' + langName + '; tags is a YAML list of 3-6 short strings.',
        '4. Field semantics:',
        fields.replace(/"/g, ''),
        '5. Use {{char}} for the character and {{user}} for the user where appropriate; never speak or act for {{user}} in first_mes.',
      ].join('\n');
  const userLines = [
    `Character name: ${name.value.trim()}`,
    `One-line concept: ${concept.value.trim()}`,
    `Style: ${styleDesc}`,
  ];
  if (extra.value.trim()) userLines.push(`Extra requirements: ${extra.value.trim()}`);
  userLines.push(`Write all values in ${langName}.`);
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: userLines.join('\n') },
  ];
}

/* ------------------------------ 生成与动作 ------------------------------ */

async function run() {
  if (running.value) return;
  formError.value = '';
  saved.value = false;
  if (!name.value.trim() || !concept.value.trim()) {
    formError.value = t('at_err_required');
    return;
  }
  // 未配置 API：引导打开设置（BYOK）
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  await ai.generate(buildMessages(), { temperature: props.temp, maxTokens: 2000 });
}

async function onCopy() {
  if (!await copyToClipboard(output.value)) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

/** 从输出解析出卡 data 对象（JSON 模式）；失败返回 null */
function parsedCardData(): Record<string, unknown> | null {
  const obj = parseAiJson(output.value);
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
  const raw = { ...(obj as Record<string, unknown>) };
  if (typeof raw.name !== 'string' || !raw.name.trim()) raw.name = name.value.trim();
  return raw;
}

function download() {
  const raw = parsedCardData();
  if (!raw) {
    formError.value = t('at_p_parse_err');
    return;
  }
  const card = normalizeToCard(raw);
  downloadJson(`${safeFilename(card.data?.name || 'character')}.json`, card);
}

function saveToStudio() {
  const raw = parsedCardData();
  if (!raw) {
    formError.value = t('at_p_parse_err');
    return;
  }
  toolbox.addCard(normalizeToCard(raw));
  saved.value = true;
  setTimeout(() => { saved.value = false; }, 2500);
}
</script>

<template>
  <div>
    <!-- 表单区 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <ToolField :label="t('at_p_name')" required>
        <input v-model="name" type="text" class="ui-input w-full" :placeholder="t('at_p_name_ph')">
      </ToolField>
      <ToolField :label="t('at_p_style')">
        <select v-model="style" class="ui-input w-full">
          <option v-for="(s, i) in STYLES" :key="s.value" :value="s.value">{{ t(`at_p_style_${i + 1}`) }}</option>
        </select>
      </ToolField>
      <div class="sm:col-span-2">
        <ToolField :label="t('at_p_concept')" required>
          <textarea v-model="concept" rows="2" class="ui-input w-full resize-y" :placeholder="t('at_p_concept_ph')" />
        </ToolField>
      </div>
      <div class="sm:col-span-2">
        <ToolField :label="t('at_p_extra')">
          <textarea v-model="extra" rows="2" class="ui-input w-full resize-y" :placeholder="t('at_p_extra_ph')" />
        </ToolField>
      </div>
      <ToolField :label="t('at_p_fmt')">
        <div class="flex gap-4 text-sm">
          <label class="flex cursor-pointer items-center gap-1.5">
            <input v-model="fmt" type="radio" value="json" class="accent-rose-deep"> {{ t('at_p_fmt_json') }}
          </label>
          <label class="flex cursor-pointer items-center gap-1.5">
            <input v-model="fmt" type="radio" value="yaml" class="accent-rose-deep"> {{ t('at_p_fmt_yaml') }}
          </label>
        </div>
      </ToolField>
    </div>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <!-- 生成按钮（生成中禁止重复提交） -->
    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('at_gen') }}
      </button>
    </div>

    <!-- 流式输出面板 + 动作按钮组 -->
    <ATOutput :running="running" :error="error" :output="output" @stop="ai.stop()">
      <template v-if="!running && output">
        <p v-if="saved" class="ui-status-success mb-2 rounded-lg px-3 py-2 text-xs">{{ t('at_p_saved') }}</p>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="onCopy">⧉ {{ copied ? t('at_copied') : t('at_copy') }}</button>
          <button v-if="fmt === 'json'" type="button" class="ui-button ui-button-secondary ui-button-sm" @click="download">⇩ {{ t('at_dl_json') }}</button>
          <button v-if="fmt === 'json'" type="button" class="ui-button ui-button-primary ui-button-sm" @click="saveToStudio">♥ {{ t('at_p_save') }}</button>
          <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
        </div>
      </template>
    </ATOutput>
  </div>
</template>
