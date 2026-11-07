<script setup lang="ts">
/**
 * 美化生成（源站 style-generator 复刻）：
 * 样式需求 + 可选原始文本 → LLM 返回 {worldinfo, regex, html} JSON。
 * 结构化展示：世界书条目可下载为 ST 世界书，正则/HTML 可复制，
 * HTML 在 sandbox iframe 中预览（allow-scripts，无 same-origin）。
 */
import { useToolAI } from '~/composables/useToolAI';
import { styleMessages } from '~/utils/source-tool-prompts';
import { aiLangName, copyToClipboard, parseAiJson } from '~/utils/st/regex-script';
import { downloadJson, safeFilename } from '~/utils/st/export';
import { makeEntry } from '~/utils/st/worldbook';

interface StyleBundle {
  worldinfo?: { key?: string; content?: string } | null;
  regex?: string;
  html?: string;
  original_text?: string;
  formatted_original_text?: string;
}

const { t, locale } = useI18n();
const ui = useUiStore();
const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

const styleReq = ref('');
const originalText = ref('');
const formError = ref('');
const parseError = ref('');
const bundle = ref<StyleBundle | null>(null);
const tab = ref<'worldbook' | 'regex' | 'html'>('worldbook');
const copied = ref('');

async function run() {
  if (running.value) return;
  formError.value = '';
  parseError.value = '';
  copied.value = '';
  if (!styleReq.value.trim()) {
    formError.value = t('stg_err_req');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  bundle.value = null;
  const started = await ai.generate(
    styleMessages(styleReq.value.trim(), originalText.value.trim(), aiLangName(locale.value)),
    { temperature: 0.4, maxTokens: 4000 },
  );
  if (!started) return;
  parseBundle();
}

function parseBundle() {
  const obj = parseAiJson(ai.output.value);
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    parseError.value = t('stg_err_parse');
    return;
  }
  const b = obj as StyleBundle;
  if (!b.html && !b.regex) {
    parseError.value = t('stg_err_parse');
    return;
  }
  bundle.value = b;
  tab.value = b.worldinfo?.content ? 'worldbook' : b.regex ? 'regex' : 'html';
}

async function copy(text: string | undefined, id: string) {
  if (!text) return;
  if (!await copyToClipboard(text)) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = id;
  setTimeout(() => { copied.value = ''; }, 1500);
}

function downloadWorldbook() {
  const wb = bundle.value?.worldinfo;
  if (!wb?.content) return;
  const entry = makeEntry(0);
  entry.key = [wb.key?.trim() || 'style'];
  entry.comment = wb.key?.trim() || 'style';
  entry.content = wb.content;
  downloadJson(`${safeFilename(wb.key || 'style-worldbook')}.json`, { entries: { 0: entry } });
}

function downloadBundle() {
  if (!bundle.value) return;
  downloadJson(`${safeFilename(bundle.value.worldinfo?.key || 'style-bundle')}.json`, bundle.value);
}

const tabs = computed(() => [
  { id: 'worldbook' as const, label: t('stg_tab_worldbook'), show: !!bundle.value?.worldinfo?.content },
  { id: 'regex' as const, label: t('stg_tab_regex'), show: !!bundle.value?.regex },
  { id: 'html' as const, label: t('stg_tab_html'), show: !!bundle.value?.html },
].filter((x) => x.show));
</script>

<template>
  <div>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <ToolField :label="t('stg_style_req')" required :hint="t('stg_style_req_ph')">
          <textarea v-model="styleReq" rows="3" class="ui-input w-full resize-y" :placeholder="t('stg_style_req_ph')" />
        </ToolField>
      </div>
      <div class="sm:col-span-2">
        <ToolField :label="t('stg_original')" :hint="t('stg_original_ph')">
          <textarea v-model="originalText" rows="4" class="ui-input w-full resize-y" :placeholder="t('stg_original_ph')" />
        </ToolField>
      </div>
    </div>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('stg_gen') }}
      </button>
    </div>

    <ATOutput :running="running" :error="error" :notice="parseError" :output="output" @stop="ai.stop()">
      <template v-if="!running && (bundle || output)">
        <div v-if="bundle">
          <div class="mb-3 flex flex-wrap gap-2">
            <button
              v-for="tb in tabs"
              :key="tb.id"
              type="button"
              class="ui-button ui-button-sm"
              :class="tab === tb.id ? 'ui-button-primary' : 'ui-button-secondary'"
              @click="tab = tb.id"
            >{{ tb.label }}</button>
          </div>

          <div v-if="tab === 'worldbook' && bundle.worldinfo?.content" class="space-y-3">
            <div class="rounded-xl border border-border bg-surface p-4">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-xs font-semibold text-plum-muted">{{ t('stg_worldbook_key') }}</p>
                <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="copy(bundle.worldinfo?.key, 'wb-key')">
                  ⧉ {{ copied === 'wb-key' ? t('at_copied') : t('at_copy') }}
                </button>
              </div>
              <p class="mt-1 font-semibold">{{ bundle.worldinfo.key }}</p>
              <div class="mt-4 flex items-center justify-between gap-2">
                <p class="text-xs font-semibold text-plum-muted">{{ t('stg_worldbook_content') }}</p>
                <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="copy(bundle.worldinfo?.content, 'wb-content')">
                  ⧉ {{ copied === 'wb-content' ? t('at_copied') : t('at_copy') }}
                </button>
              </div>
              <pre class="mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-3 text-xs leading-relaxed">{{ bundle.worldinfo.content }}</pre>
            </div>
            <div v-if="bundle.original_text || bundle.formatted_original_text" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div v-if="bundle.original_text" class="rounded-xl border border-border bg-surface p-4">
                <p class="mb-1 text-xs font-semibold text-plum-muted">{{ t('stg_sample') }}</p>
                <pre class="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">{{ bundle.original_text }}</pre>
              </div>
              <div v-if="bundle.formatted_original_text" class="rounded-xl border border-border bg-surface p-4">
                <p class="mb-1 text-xs font-semibold text-plum-muted">{{ t('stg_formatted') }}</p>
                <pre class="max-h-48 overflow-auto whitespace-pre-wrap text-xs leading-relaxed">{{ bundle.formatted_original_text }}</pre>
              </div>
            </div>
          </div>

          <div v-else-if="tab === 'regex' && bundle.regex" class="rounded-xl border border-border bg-surface p-4">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-plum-muted">{{ t('stg_regex_label') }}</p>
              <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="copy(bundle.regex, 'regex')">
                ⧉ {{ copied === 'regex' ? t('at_copied') : t('at_copy') }}
              </button>
            </div>
            <pre class="mt-1 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-3 text-xs leading-relaxed">{{ bundle.regex }}</pre>
          </div>

          <div v-else-if="tab === 'html' && bundle.html">
            <iframe
              :srcdoc="bundle.html"
              sandbox="allow-scripts"
              class="h-80 w-full rounded-xl border border-border bg-white"
              :title="t('stg_tab_html')"
            />
            <p class="mt-2 text-xs text-plum-muted">{{ t('stg_preview_note') }}</p>
            <details class="mt-3">
              <summary class="cursor-pointer text-xs font-semibold text-plum-muted">{{ t('stg_html_code') }}</summary>
              <div class="mt-2">
                <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="copy(bundle.html, 'html')">
                  ⧉ {{ copied === 'html' ? t('at_copied') : t('at_copy') }}
                </button>
                <pre class="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded-lg bg-bg p-3 text-xs leading-relaxed">{{ bundle.html }}</pre>
              </div>
            </details>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <button v-if="bundle.worldinfo?.content" type="button" class="ui-button ui-button-secondary ui-button-sm" @click="downloadWorldbook">⇩ {{ t('stg_download_worldbook') }}</button>
            <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="downloadBundle">⇩ {{ t('stg_download_bundle') }}</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
          </div>
        </div>

        <details v-if="output" class="mt-4">
          <summary class="cursor-pointer text-xs font-semibold text-plum-muted">{{ t('stg_raw') }}</summary>
          <pre class="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-xs leading-relaxed">{{ output }}</pre>
        </details>
      </template>
    </ATOutput>
  </div>
</template>
