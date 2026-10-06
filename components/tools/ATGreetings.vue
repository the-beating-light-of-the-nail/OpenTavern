<script setup lang="ts">
/**
 * AI Toolkit · 开场白生成器：
 * 角色来源（库中选卡 / 手动填写）+ 数量 + 视角 + 场景提示 → 流式生成多条开场白，
 * 输出用 ---GREETING--- 分隔，解析后逐条展示。
 * 动作：逐条复制 / 追加到卡（alternate_greetings + updateCard，带确认框）/ 下载 .txt / 重新生成。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { useToolAI } from '~/composables/useToolAI';
import { downloadBlob, safeFilename } from '~/utils/st/export';
import { aiLangName, copyToClipboard, splitGreetings } from '~/utils/st/regex-script';
import type { CharacterCard } from '~/utils/st/types';

const props = defineProps<{ lang: string; temp: number }>();

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t } = useI18n();

const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

/* ------------------------------ 表单 ------------------------------ */

const src = ref<'lib' | 'manual'>('lib');
const cardId = ref('');
const manualName = ref('');
const manualDesc = ref('');
const count = ref(2);
const pov = ref<'second' | 'third'>('second');
const scene = ref('');
const formError = ref('');

const COUNTS = [1, 2, 3];
const POVS = [
  { value: 'second' as const, desc: 'Second person — the narration addresses {{user}} as "you".' },
  { value: 'third' as const, desc: 'Third person — refer to the user as {{user}} in the narration.' },
];

/** 选中来源卡的展示名与上下文 */
const srcCard = computed(() => (src.value === 'lib' ? toolbox.cardById(cardId.value) : null));
const srcName = computed(() => {
  if (src.value === 'manual') return manualName.value.trim();
  return srcCard.value?.raw?.data?.name || '';
});
const srcDesc = computed(() => {
  if (src.value === 'manual') return manualDesc.value.trim();
  const d = srcCard.value?.raw?.data;
  if (!d) return '';
  return [
    d.description && `Description: ${String(d.description).slice(0, 700)}`,
    d.personality && `Personality: ${String(d.personality).slice(0, 300)}`,
    d.scenario && `Scenario: ${String(d.scenario).slice(0, 300)}`,
  ].filter(Boolean).join('\n');
});

/* ------------------------------ 解析与动作 ------------------------------ */

/** 逐条开场白（running 中不解析，避免流式预览被列表顶掉） */
const greetings = computed(() => (running.value ? [] : splitGreetings(output.value)));

const copiedIndex = ref(-1);
const added = ref(false);

async function onCopyOne(text: string, i: number) {
  if (!await copyToClipboard(text)) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copiedIndex.value = i;
  setTimeout(() => { copiedIndex.value = -1; }, 1500);
}

async function run() {
  if (running.value) return;
  formError.value = '';
  added.value = false;
  if (src.value === 'lib' && !srcCard.value) {
    formError.value = t('at_err_required');
    return;
  }
  if (src.value === 'manual' && !manualName.value.trim()) {
    formError.value = t('at_err_required');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  await ai.generate(buildMessages(), { temperature: props.temp, maxTokens: 1800 });
}

function buildMessages(): { role: 'system' | 'user'; content: string }[] {
  const langName = aiLangName(props.lang);
  const povDesc = POVS.find((p) => p.value === pov.value)?.desc || '';
  const system = [
    'You are an expert greeting-writer for AI roleplay character cards.',
    `Write ${count.value} alternative opening messages (alternate_greetings) for the character below.`,
    '',
    'STRICT OUTPUT RULES:',
    '1. Separate consecutive greetings with a line containing exactly ---GREETING--- and nothing else. No numbering, no commentary, no code fences.',
    '2. Each greeting is a complete opening message: vivid action, setting or dialogue that pulls {{user}} into the scene, ending with room for the user to respond.',
    `3. Point of view: ${povDesc}`,
    '4. Use {{char}} for the character and {{user}} for the user. Never speak or act for {{user}} beyond minimal scene-setting.',
    `5. Write in ${langName}. Give each greeting a distinct situation or tone.`,
  ].join('\n');
  const userLines = [`Character name: ${srcName.value}`];
  if (srcDesc.value) userLines.push(srcDesc.value);
  if (scene.value.trim()) userLines.push(`Scene hint: ${scene.value.trim()}`);
  userLines.push(`Write ${count.value} greetings in ${langName}, separated by ---GREETING--- lines.`);
  return [
    { role: 'system' as const, content: system },
    { role: 'user' as const, content: userLines.join('\n') },
  ];
}

/** 目标卡（追加用，默认同来源卡） */
const targetId = ref('');
watchEffect(() => {
  if (!targetId.value && cardId.value) targetId.value = cardId.value;
});
const targetCardName = computed(() => toolbox.cardById(targetId.value)?.raw?.data?.name || '');

async function appendToCard() {
  const list = greetings.value;
  if (!list.length) return;
  const target = toolbox.cardById(targetId.value);
  if (!target) {
    formError.value = t('at_g_pick_target');
    return;
  }
  const ok = await ui.showDialog({
    message: t('at_g_add_confirm', { n: list.length, name: target.raw?.data?.name || t('at_g_unnamed') }),
    showCancel: true,
  });
  if (!ok) return;
  // 深拷贝后追加到 alternate_greetings，避免直接改库内引用
  const raw = JSON.parse(JSON.stringify(target.raw)) as CharacterCard;
  if (!raw.data || typeof raw.data !== 'object') raw.data = {} as CharacterCard['data'];
  if (!Array.isArray(raw.data.alternate_greetings)) raw.data.alternate_greetings = [];
  raw.data.alternate_greetings.push(...list);
  toolbox.updateCard(target.id, raw);
  added.value = true;
  setTimeout(() => { added.value = false; }, 2500);
}

function downloadTxt() {
  const base = safeFilename(srcName.value || targetCardName.value || 'greetings');
  const text = greetings.value.join('\n\n---GREETING---\n\n');
  downloadBlob(`${base}_greetings.txt`, new Blob([text], { type: 'text/plain;charset=utf-8' }));
}
</script>

<template>
  <div>
    <!-- 表单区 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <ToolField :label="t('at_g_src')">
        <select v-model="src" class="ui-input w-full">
          <option value="lib">{{ t('at_g_src_lib') }}</option>
          <option value="manual">{{ t('at_g_src_manual') }}</option>
        </select>
      </ToolField>
      <template v-if="src === 'lib'">
        <ToolField :label="t('at_g_card')" required>
          <select v-model="cardId" class="ui-input w-full">
            <option value="" disabled>{{ t('at_g_card_ph') }}</option>
            <option v-for="c in toolbox.cards" :key="c.id" :value="c.id">
              {{ c.raw?.data?.name || t('at_g_unnamed') }}
            </option>
          </select>
        </ToolField>
      </template>
      <template v-else>
        <ToolField :label="t('at_g_name')" required>
          <input v-model="manualName" type="text" class="ui-input w-full" :placeholder="t('at_g_name_ph')">
        </ToolField>
      </template>
      <ToolField :label="t('at_g_count')">
        <select v-model.number="count" class="ui-input w-full">
          <option v-for="n in COUNTS" :key="n" :value="n">{{ n }}</option>
        </select>
      </ToolField>
      <ToolField :label="t('at_g_pov')">
        <select v-model="pov" class="ui-input w-full">
          <option value="second">{{ t('at_g_pov_1') }}</option>
          <option value="third">{{ t('at_g_pov_3') }}</option>
        </select>
      </ToolField>
      <div v-if="src === 'manual'" class="sm:col-span-2">
        <ToolField :label="t('at_g_desc')">
          <textarea v-model="manualDesc" rows="3" class="ui-input w-full resize-y" :placeholder="t('at_g_desc_ph')" />
        </ToolField>
      </div>
      <div class="sm:col-span-2">
        <ToolField :label="t('at_g_scene')">
          <textarea v-model="scene" rows="2" class="ui-input w-full resize-y" :placeholder="t('at_g_scene_ph')" />
        </ToolField>
      </div>
    </div>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <!-- 生成按钮 -->
    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('at_gen') }}
      </button>
    </div>

    <!-- 流式输出（生成中） / 逐条列表（完成后） -->
    <ATOutput v-if="running || !greetings.length" :running="running" :error="error" :output="output" @stop="ai.stop()" />
    <div v-else class="mt-4">
      <p v-if="error" class="ui-alert-danger mb-2 rounded-lg px-3 py-2 text-xs leading-relaxed">{{ error }}</p>
      <p v-if="added" class="ui-status-success mb-2 rounded-lg px-3 py-2 text-xs">{{ t('at_g_added') }}</p>

      <div class="space-y-2">
        <div
          v-for="(g, i) in greetings"
          :key="i"
          class="rounded-lg border border-border bg-surface p-3"
        >
          <div class="mb-1.5 flex items-center justify-between gap-2">
            <span class="text-xs font-bold text-rose-accent">{{ t('at_g_greeting_n', { n: i + 1 }) }}</span>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" @click="onCopyOne(g, i)">
              ⧉ {{ copiedIndex === i ? t('at_copied') : t('at_copy') }}
            </button>
          </div>
          <p class="whitespace-pre-wrap text-sm leading-relaxed">{{ g }}</p>
        </div>
      </div>

      <!-- 动作按钮组 -->
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <select v-model="targetId" class="ui-input ui-input-compact max-w-48 text-sm">
          <option value="" disabled>{{ t('at_g_pick_target') }}</option>
          <option v-for="c in toolbox.cards" :key="c.id" :value="c.id">
            {{ c.raw?.data?.name || t('at_g_unnamed') }}
          </option>
        </select>
        <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="!targetId" @click="appendToCard">＋ {{ t('at_g_add_to') }}</button>
        <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="downloadTxt">⇩ {{ t('at_dl_txt') }}</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
      </div>
    </div>
  </div>
</template>
