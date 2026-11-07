<script setup lang="ts">
/**
 * 小皮书童（源站 student 复刻）：
 * 上传 preset.json，本地提取 prompts + prompt_order（标识符/名称/内容/注入顺序/深度），
 * 送入 LLM 返回结构化拆解 JSON：summary / blueprint / mechanisms / stitching / snippets。
 */
import { useToolAI } from '~/composables/useToolAI';
import { studentMessages } from '~/utils/source-tool-prompts';
import { aiLangName, copyToClipboard, parseAiJson } from '~/utils/st/regex-script';
import { downloadJson, safeFilename } from '~/utils/st/export';

interface PresetModule {
  identifier: string;
  name: string;
  content: string;
  injection_order: number;
  injection_depth: number;
  enabled: boolean;
}

interface StudentReport {
  summary?: {
    title?: string;
    architecture_type?: string;
    complexity_rating?: string;
    tags?: string[];
    one_sentence_review?: string;
  };
  structure_blueprint?: {
    mermaid_code?: string;
    analysis?: string;
    pros_and_cons?: string;
  };
  mechanism_breakdown?: {
    name?: string;
    source_identifier?: string;
    how_it_works?: string;
    why_it_matters?: string;
  }[];
  stitching_guide?: {
    description?: string;
    recommendations?: { module_type?: string; suggested_position?: string; reasoning?: string }[];
  };
  brilliant_snippets?: {
    excerpt?: string;
    source_identifier?: string;
    technique?: string;
    analysis?: string;
  }[];
  learning_points?: { concept?: string; actionable_lesson?: string }[];
}

const { t, locale } = useI18n();
const ui = useUiStore();
const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

const fileName = ref('');
const presetName = ref('');
const modules = ref<PresetModule[]>([]);
const fileError = ref('');
const formError = ref('');
const parseError = ref('');
const report = ref<StudentReport | null>(null);
const copied = ref('');

function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? v as Record<string, unknown> : null;
}

async function onFiles(files: File[]) {
  const file = files[0];
  if (!file) return;
  fileError.value = '';
  formError.value = '';
  parseError.value = '';
  report.value = null;
  try {
    const raw = asRecord(JSON.parse(await file.text()));
    if (!raw || !Array.isArray(raw.prompts)) throw new Error('no prompts');
    const prompts = raw.prompts.map(asRecord).filter((p): p is Record<string, unknown> => !!p);
    const orderGroups = Array.isArray(raw.prompt_order) ? raw.prompt_order.map(asRecord).filter(Boolean) : [];
    const order = Array.isArray(orderGroups[0]?.order)
      ? orderGroups[0]!.order.map(asRecord).filter((o): o is Record<string, unknown> => !!o)
      : [];

    const byId = new Map<string, Record<string, unknown>>();
    for (const p of prompts) {
      const id = String(p.identifier ?? p.name ?? '');
      if (id) byId.set(id, p);
    }

    const list: PresetModule[] = [];
    if (order.length) {
      order.forEach((o, index) => {
        if (o.enabled === false) return;
        const id = String(o.identifier ?? '');
        const p = byId.get(id);
        if (!p) return;
        list.push({
          identifier: id,
          name: String(p.name ?? id),
          content: String(p.content ?? ''),
          injection_order: index,
          injection_depth: Number(p.injection_depth ?? 0) || 0,
          enabled: true,
        });
      });
    } else {
      for (const p of prompts) {
        const id = String(p.identifier ?? p.name ?? '');
        if (!id) continue;
        list.push({
          identifier: id,
          name: String(p.name ?? id),
          content: String(p.content ?? ''),
          injection_order: list.length,
          injection_depth: Number(p.injection_depth ?? 0) || 0,
          enabled: true,
        });
      }
    }

    if (!list.length) throw new Error('no modules');
    modules.value = list;
    presetName.value = String(raw.name ?? file.name.replace(/\.json$/i, ''));
    fileName.value = file.name;
  } catch {
    modules.value = [];
    presetName.value = '';
    fileName.value = '';
    fileError.value = t('stu_err_file');
  }
}

async function run() {
  if (running.value) return;
  formError.value = '';
  parseError.value = '';
  copied.value = '';
  if (!modules.value.length) {
    formError.value = t('stu_err_nofile');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  report.value = null;
  const presetJson = JSON.stringify(modules.value, null, 2);
  const started = await ai.generate(
    studentMessages(presetJson, aiLangName(locale.value)),
    { temperature: 0.4, maxTokens: 4000 },
  );
  if (!started) return;
  parseReport();
}

function parseReport() {
  const obj = parseAiJson(ai.output.value);
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    parseError.value = t('stu_err_parse');
    return;
  }
  const raw = asRecord(obj);
  if (!raw) {
    parseError.value = t('stu_err_parse');
    return;
  }
  const candidate = (raw.report && typeof raw.report === 'object' ? raw.report : raw) as StudentReport;
  if (!candidate.summary && !candidate.structure_blueprint && !candidate.mechanism_breakdown) {
    parseError.value = t('stu_err_parse');
    return;
  }
  report.value = candidate;
}

function downloadReport() {
  if (!report.value) return;
  downloadJson(`${safeFilename(presetName.value || 'preset')}_analysis.json`, report.value);
}

async function copyMermaid() {
  const code = report.value?.structure_blueprint?.mermaid_code;
  if (!code) return;
  if (!await copyToClipboard(code)) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = 'mermaid';
  setTimeout(() => { copied.value = ''; }, 1500);
}
</script>

<template>
  <div>
    <ToolField :label="t('stu_upload_label')" required>
      <ToolFileDrop accept=".json" hint-key="stu_upload_hint" sub-key="stu_file_hint" @files="onFiles" />
    </ToolField>

    <p v-if="fileName" class="mt-3 rounded-lg border border-border bg-surface px-3 py-2 text-xs">
      {{ t('stu_loaded', { name: presetName }) }} · {{ fileName }} · {{ modules.length }}
    </p>
    <p v-if="fileError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ fileError }}</p>
    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('stu_run') }}
      </button>
    </div>

    <ATOutput :running="running" :error="error" :notice="parseError" :output="output" @stop="ai.stop()">
      <template v-if="!running && (report || output)">
        <div v-if="report" class="space-y-4">
          <div v-if="report.summary" class="rounded-xl border border-border bg-surface p-4">
            <p class="text-xs font-semibold text-plum-muted">{{ t('stu_summary') }}</p>
            <h3 class="mt-1 font-display text-xl font-semibold">{{ report.summary.title }}</h3>
            <p v-if="report.summary.one_sentence_review" class="mt-2 text-sm leading-relaxed text-plum-muted">{{ report.summary.one_sentence_review }}</p>
            <dl class="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div v-if="report.summary.architecture_type" class="rounded-lg bg-bg p-2.5">
                <dt class="text-plum-muted">{{ t('stu_architecture') }}</dt>
                <dd class="mt-0.5 font-semibold">{{ report.summary.architecture_type }}</dd>
              </div>
              <div v-if="report.summary.complexity_rating" class="rounded-lg bg-bg p-2.5">
                <dt class="text-plum-muted">{{ t('stu_complexity') }}</dt>
                <dd class="mt-0.5 font-semibold">{{ report.summary.complexity_rating }}</dd>
              </div>
            </dl>
            <div v-if="report.summary.tags?.length" class="mt-3 flex flex-wrap gap-1.5">
              <span v-for="tag in report.summary.tags" :key="tag" class="rc-tag">{{ tag }}</span>
            </div>
          </div>

          <div v-if="report.structure_blueprint" class="rounded-xl border border-border bg-surface p-4">
            <p class="text-sm font-bold">{{ t('stu_blueprint') }}</p>
            <div v-if="report.structure_blueprint.mermaid_code" class="mt-3">
              <div class="flex items-center justify-between gap-2">
                <p class="text-xs font-semibold text-plum-muted">{{ t('stu_mermaid') }}</p>
                <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="copyMermaid">
                  ⧉ {{ copied === 'mermaid' ? t('at_copied') : t('at_copy') }}
                </button>
              </div>
              <pre class="mt-1 max-h-72 overflow-auto rounded-lg bg-bg p-3 text-xs leading-relaxed">{{ report.structure_blueprint.mermaid_code }}</pre>
            </div>
            <div v-if="report.structure_blueprint.analysis" class="mt-3">
              <p class="text-xs font-semibold text-plum-muted">{{ t('stu_analysis') }}</p>
              <p class="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{{ report.structure_blueprint.analysis }}</p>
            </div>
            <div v-if="report.structure_blueprint.pros_and_cons" class="mt-3">
              <p class="text-xs font-semibold text-plum-muted">{{ t('stu_proscons') }}</p>
              <p class="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{{ report.structure_blueprint.pros_and_cons }}</p>
            </div>
          </div>

          <div v-if="report.mechanism_breakdown?.length">
            <p class="mb-2 text-sm font-bold">{{ t('stu_mechanisms') }}</p>
            <div class="space-y-2">
              <div v-for="(m, i) in report.mechanism_breakdown" :key="i" class="rounded-xl border border-border bg-surface p-4">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-display text-base font-semibold">{{ m.name }}</p>
                  <span v-if="m.source_identifier" class="rc-tag font-mono">{{ m.source_identifier }}</span>
                </div>
                <p v-if="m.how_it_works" class="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{{ m.how_it_works }}</p>
                <p v-if="m.why_it_matters" class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-plum-muted">{{ m.why_it_matters }}</p>
              </div>
            </div>
          </div>

          <div v-if="report.stitching_guide" class="rounded-xl border border-border bg-surface p-4">
            <p class="text-sm font-bold">{{ t('stu_stitching') }}</p>
            <p v-if="report.stitching_guide.description" class="mt-2 text-sm leading-relaxed text-plum-muted">{{ report.stitching_guide.description }}</p>
            <div v-if="report.stitching_guide.recommendations?.length" class="mt-3 space-y-2">
              <div v-for="(r, i) in report.stitching_guide.recommendations" :key="i" class="rounded-lg bg-bg p-3">
                <p class="text-sm font-semibold">{{ r.module_type }}</p>
                <p v-if="r.suggested_position" class="mt-1 text-xs leading-relaxed"><span class="text-plum-muted">{{ t('stu_position') }}：</span>{{ r.suggested_position }}</p>
                <p v-if="r.reasoning" class="mt-1 text-xs leading-relaxed text-plum-muted">{{ r.reasoning }}</p>
              </div>
            </div>
          </div>

          <div v-if="report.brilliant_snippets?.length">
            <p class="mb-2 text-sm font-bold">{{ t('stu_snippets') }}</p>
            <div class="space-y-2">
              <div v-for="(s, i) in report.brilliant_snippets" :key="i" class="rounded-xl border border-border bg-surface p-4">
                <p class="whitespace-pre-wrap border-l-2 border-rose-deep pl-3 text-sm leading-relaxed italic">{{ s.excerpt }}</p>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span v-if="s.technique" class="rc-tag">{{ s.technique }}</span>
                  <span v-if="s.source_identifier" class="rc-tag font-mono">{{ s.source_identifier }}</span>
                </div>
                <p v-if="s.analysis" class="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-plum-muted">{{ s.analysis }}</p>
              </div>
            </div>
          </div>

          <div v-if="report.learning_points?.length" class="rounded-xl border border-border bg-surface p-4">
            <p class="text-sm font-bold">{{ t('stu_learning') }}</p>
            <div class="mt-2 space-y-2">
              <div v-for="(l, i) in report.learning_points" :key="i">
                <p class="text-sm font-semibold">{{ l.concept }}</p>
                <p class="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-plum-muted">{{ l.actionable_lesson }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="downloadReport">⇩ {{ t('stu_download') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
          </div>
        </div>

        <details v-if="output" class="mt-4">
          <summary class="cursor-pointer text-xs font-semibold text-plum-muted">{{ t('stu_raw') }}</summary>
          <pre class="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed">{{ output }}</pre>
        </details>
      </template>
    </ATOutput>
  </div>
</template>
