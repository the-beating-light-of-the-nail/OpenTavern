<script setup lang="ts">
/**
 * 小皮医生（源站 doctor 复刻）：
 * 上传 JSON / PNG 角色卡，本地解析后把核心设定、开场白与内嵌世界书送入 LLM，
 * 返回结构化诊断 JSON：core_assessment + dimensions[] + prescriptions[]。
 */
import { useToolAI } from '~/composables/useToolAI';
import { doctorMessages } from '~/utils/source-tool-prompts';
import { extractCharaFromPng, parseCharacterCard, type ParsedCharacter } from '~/utils/card-import';
import { aiLangName, copyToClipboard, parseAiJson } from '~/utils/st/regex-script';
import { downloadJson, safeFilename } from '~/utils/st/export';

interface ReportDimension {
  name?: string;
  status?: string;
  issues?: string;
  suggestions?: string;
}

interface DoctorReport {
  core_assessment?: string;
  dimensions?: ReportDimension[];
  prescriptions?: string[];
}

const { t, locale } = useI18n();
const ui = useUiStore();
const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

const fileName = ref('');
const cardName = ref('');
const rawCard = ref<Record<string, unknown> | null>(null);
const parsedCard = ref<ParsedCharacter | null>(null);
const fileError = ref('');
const formError = ref('');
const parseError = ref('');
const report = ref<DoctorReport | null>(null);
const copied = ref('');

async function onFiles(files: File[]) {
  const file = files[0];
  if (!file) return;
  fileError.value = '';
  formError.value = '';
  parseError.value = '';
  report.value = null;
  try {
    let json: unknown;
    if (file.name.toLowerCase().endsWith('.png')) {
      json = await extractCharaFromPng(file);
    } else {
      json = JSON.parse(await file.text());
    }
    const parsed = parseCharacterCard(json);
    rawCard.value = json as Record<string, unknown>;
    parsedCard.value = parsed;
    cardName.value = parsed.name;
    fileName.value = file.name;
  } catch {
    rawCard.value = null;
    parsedCard.value = null;
    cardName.value = '';
    fileName.value = '';
    fileError.value = t('doc_err_card');
  }
}

function buildPayload() {
  const p = parsedCard.value;
  if (!p) return null;
  const raw = rawCard.value;
  const data = raw && typeof raw === 'object' && 'data' in raw && raw.data && typeof raw.data === 'object'
    ? raw.data as Record<string, unknown>
    : raw;
  const book = data?.character_book;
  return {
    characterInfo: `名称: ${p.name || '未知'}\n\n描述:\n${p.description || '无'}\n\n性格:\n${p.personality || '无'}`,
    worldBook: book ? JSON.stringify(book, null, 2) : '无世界书记录',
    firstMessage: p.first_mes || '无',
    alternateGreetings: p.alternate_greetings?.length ? p.alternate_greetings.join('\n\n---\n\n') : '无',
    scenario: p.scenario || '无',
  };
}

async function run() {
  if (running.value) return;
  formError.value = '';
  parseError.value = '';
  copied.value = '';
  if (!parsedCard.value) {
    formError.value = t('doc_err_nocard');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  const payload = buildPayload();
  if (!payload) return;
  report.value = null;
  const started = await ai.generate(
    doctorMessages(payload, aiLangName(locale.value)),
    { temperature: 0.7, maxTokens: 3000 },
  );
  if (!started) return;
  parseReport();
}

function parseReport() {
  const obj = parseAiJson(ai.output.value);
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    parseError.value = t('doc_err_parse');
    return;
  }
  const raw = obj as Record<string, unknown>;
  const candidate = (raw.report && typeof raw.report === 'object' ? raw.report : raw) as DoctorReport;
  if (!candidate.core_assessment && !Array.isArray(candidate.dimensions)) {
    parseError.value = t('doc_err_parse');
    return;
  }
  report.value = {
    core_assessment: candidate.core_assessment,
    dimensions: Array.isArray(candidate.dimensions) ? candidate.dimensions : [],
    prescriptions: Array.isArray(candidate.prescriptions) ? candidate.prescriptions : [],
  };
}

function downloadReport() {
  if (!report.value) return;
  downloadJson(`${safeFilename(cardName.value || 'card')}_diagnosis.json`, report.value);
}

async function copyReport() {
  if (!report.value) return;
  const lines: string[] = [];
  if (report.value.core_assessment) lines.push(`# ${t('doc_core')}\n${report.value.core_assessment}`);
  if (report.value.dimensions?.length) {
    lines.push(`\n## ${t('doc_dimensions')}`);
    for (const d of report.value.dimensions) {
      lines.push(`\n### ${d.name || '-'}`);
      if (d.status) lines.push(`${t('doc_status')}: ${d.status}`);
      if (d.issues) lines.push(`${t('doc_issues')}: ${d.issues}`);
      if (d.suggestions) lines.push(`${t('doc_suggestions')}: ${d.suggestions}`);
    }
  }
  if (report.value.prescriptions?.length) {
    lines.push(`\n## ${t('doc_prescriptions')}`);
    for (const p of report.value.prescriptions) lines.push(`- ${p}`);
  }
  if (!await copyToClipboard(lines.join('\n'))) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = 'report';
  setTimeout(() => { copied.value = ''; }, 1500);
}
</script>

<template>
  <div>
    <ToolField :label="t('doc_upload_label')" required>
      <ToolFileDrop accept=".json,.png" hint-key="doc_upload_hint" sub-key="doc_file_hint" @files="onFiles" />
    </ToolField>

    <p v-if="fileName" class="mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs">
      {{ t('doc_loaded', { name: cardName }) }} · {{ fileName }}
    </p>
    <p v-if="fileError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ fileError }}</p>
    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('doc_run') }}
      </button>
    </div>

    <ATOutput :running="running" :error="error" :notice="parseError" :output="output" @stop="ai.stop()">
      <template v-if="!running && (report || output)">
        <div v-if="report" class="space-y-3">
          <div v-if="report.core_assessment" class="rounded-xl border border-border bg-surface p-4">
            <p class="text-xs font-semibold text-plum-muted">{{ t('doc_core') }}</p>
            <p class="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{{ report.core_assessment }}</p>
          </div>

          <div v-if="report.dimensions?.length" class="space-y-3">
            <p class="text-sm font-bold">{{ t('doc_dimensions') }}</p>
            <div v-for="(d, i) in report.dimensions" :key="i" class="rounded-xl border border-border bg-surface p-4">
              <p class="font-display text-base font-semibold">{{ d.name }}</p>
              <p v-if="d.status" class="mt-2 text-xs leading-relaxed text-plum-muted">{{ t('doc_status') }}：{{ d.status }}</p>
              <p v-if="d.issues" class="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{{ t('doc_issues') }}：{{ d.issues }}</p>
              <p v-if="d.suggestions" class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-rose-deep">{{ t('doc_suggestions') }}：{{ d.suggestions }}</p>
            </div>
          </div>

          <div v-if="report.prescriptions?.length" class="rounded-xl border border-border bg-surface p-4">
            <p class="text-sm font-bold">{{ t('doc_prescriptions') }}</p>
            <ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-plum-muted">
              <li v-for="(p, i) in report.prescriptions" :key="i">{{ p }}</li>
            </ul>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="copyReport">⧉ {{ copied === 'report' ? t('at_copied') : t('at_copy') }}</button>
            <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="downloadReport">⇩ {{ t('doc_download') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
          </div>
        </div>

        <details v-if="output" class="mt-4">
          <summary class="cursor-pointer text-xs font-semibold text-plum-muted">{{ t('doc_raw') }}</summary>
          <pre class="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed">{{ output }}</pre>
        </details>
      </template>
    </ATOutput>
  </div>
</template>
