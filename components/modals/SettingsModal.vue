<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { useWebLLM } from '~/composables/useWebLLM';
import { useComfy } from '~/composables/useComfy';
import { useLocale } from '~/composables/useLocale';
import { useRemoteAPI } from '~/composables/useRemoteAPI';
const store = useAppStore();
const ui = useUiStore();
const { t } = useI18n();
const webllm = useWebLLM();
const comfy = useComfy();
const { testApiConnection, isTesting: apiTesting, apiTest } = useRemoteAPI();
const { setLocale, supported } = useLocale();

const s = computed(() => store.settings);
const isWebLLM = computed(() => s.value.inferenceBackend === 'webllm');
function persist() { store.persist(); }

// API 测试结果（内联展示，移植自原版 #apiTestResult）
const apiTestLabel = computed(() => {
  const r = apiTest.value;
  if (r.status !== 'success') return '';
  const shown = r.models.length;
  if (r.total > shown) return t('api_test_models_prefix') + shown + t('api_test_models_total') + r.total + t('api_test_models_mid');
  return t('api_test_models_prefix') + shown + t('api_test_models_mid');
});
const apiTestBoxStyle = computed(() => {
  const st = apiTest.value.status;
  if (st === 'success') return { background: 'color-mix(in srgb,var(--color-success) 10%,transparent)', borderColor: 'color-mix(in srgb,var(--color-success) 35%,transparent)', color: 'var(--color-success)' };
  if (st === 'error') return { background: 'color-mix(in srgb,var(--color-danger) 10%,transparent)', borderColor: 'color-mix(in srgb,var(--color-danger) 35%,transparent)', color: 'var(--color-danger)' };
  return { background: 'var(--color-surface-soft)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' };
});

const prevBackend = ref(s.value.inferenceBackend || 'remote-api');
watch(() => ui.isOpen('webllmConfirm'), (open) => {
  if (!open) prevBackend.value = s.value.inferenceBackend || 'remote-api';
});

function onBackendChange() {
  const next = s.value.inferenceBackend;
  const prev = prevBackend.value;
  if (next === prev) { store.persist(); return; }
  prevBackend.value = next;
  webllm.onBackendChange(next, prev);
}
function onModelChange() {
  webllm.onModelChange(s.value.webllmModel);
}

const comfyWorkflowFile = ref<HTMLInputElement | null>(null);
function triggerImport() { comfyWorkflowFile.value?.click(); }
async function onWorkflowFile(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files && target.files[0];
  if (file) await comfy.importWorkflowFile(file);
  if (target) target.value = '';
}
function onTestComfy() { comfy.testConnection(); }

// Provider quick-fill: set endpoint + model hint
const quickProviders: { label: string; endpoint: string; model?: string }[] = [
  { label: t('provider_openrouter'), endpoint: 'https://openrouter.ai/api/v1', model: 'openai/gpt-4o-mini' },
  { label: t('provider_deepseek'), endpoint: 'https://api.deepseek.com/v1', model: 'deepseek-chat' },
  { label: t('provider_openai'), endpoint: 'https://api.openai.com/v1' },
];

function fillProvider(p: typeof quickProviders[0]) {
  s.value.apiEndpoint = p.endpoint;
  if (p.model) s.value.model = p.model;
  persist();
}

function onLangChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  setLocale(target.value);
}

const langOptions = computed(() => [
  { code: 'en', label: t('language_en') },
  { code: 'zh-CN', label: t('language_zh_cn') },
  { code: 'zh-TW', label: t('language_zh_tw') },
  { code: 'es', label: t('language_es') },
  { code: 'ar', label: t('language_ar') },
  { code: 'pt', label: t('language_pt') },
  { code: 'ru', label: t('language_ru') },
  { code: 'fr', label: t('language_fr') },
  { code: 'de', label: t('language_de') },
  { code: 'ja', label: t('language_ja') },
  { code: 'ko', label: t('language_ko') },
  { code: 'it', label: t('language_it') },
  { code: 'nl', label: t('language_nl') },
  { code: 'sv', label: t('language_sv') },
  { code: 'no', label: t('language_no') },
  { code: 'da', label: t('language_da') },
  { code: 'fi', label: t('language_fi') },
  { code: 'pl', label: t('language_pl') },
  { code: 'tr', label: t('language_tr') },
  { code: 'hi', label: t('language_hi') },
  { code: 'id', label: t('language_id') },
  { code: 'vi', label: t('language_vi') },
  { code: 'th', label: t('language_th') },
  { code: 'ms', label: t('language_ms') },
  { code: 'tl', label: t('language_tl') },
].filter((o) => supported.includes(o.code as any)));
</script>

<template>
  <AppModal modal-id="settingsModal" name="settings" max-width="max-w-lg" closable>
    <h2 class="ui-modal-title mb-1" style="color:var(--color-text)">{{ t('connect_your_ai') }}</h2>
    <p class="text-xs mb-6 leading-relaxed" style="color:var(--color-text-muted)">{{ t('connect_ai_explanation') }}</p>

    <div class="space-y-5">
      <!-- Provider quick-fill -->
      <div>
        <label class="label-base">{{ t('provider') }}</label>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <button
            v-for="p in quickProviders"
            :key="p.label"
            type="button"
            class="ui-button ui-button-sm"
            @click="fillProvider(p)"
          >{{ p.label }}</button>
        </div>
      </div>

      <!-- API Endpoint -->
      <div>
        <label class="label-base">{{ t('settings_api_endpoint') }}</label>
        <input v-model="s.apiEndpoint" type="text" class="ui-input mt-1.5" placeholder="https://api.openai.com/v1" @change="persist">
      </div>

      <!-- API Key -->
      <div>
        <label class="label-base">{{ t('settings_api_key') }}</label>
        <input v-model="s.apiKey" type="password" class="ui-input mt-1.5" placeholder="sk-..." @change="persist">
        <label class="flex items-center gap-2 text-[11px] cursor-pointer select-none mt-1.5" style="color:var(--color-text)">
          <input v-model="s.saveApiKey" type="checkbox" class="w-3.5 h-3.5 flex-shrink-0" style="accent-color:var(--color-primary)" @change="persist">
          <span>{{ t('settings_save_api_key') }}</span>
        </label>
      </div>

      <!-- Model -->
      <div>
        <label class="label-base">{{ t('settings_model') }}</label>
        <input v-model="s.model" type="text" class="ui-input mt-1.5" @change="persist">
      </div>

      <!-- Test API Connection -->
      <div>
        <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="apiTesting" @click="testApiConnection">
          {{ apiTesting ? t('api_test_testing') : t('api_test_button') }}
        </button>

        <!-- API 测试结果（内联，移植自原版 #apiTestResult） -->
        <div v-if="apiTest.status !== 'idle'"
             class="mt-2 text-xs rounded-xl p-2 border leading-relaxed"
             :style="apiTestBoxStyle">
          <template v-if="apiTest.status === 'testing'">{{ t('api_test_testing') }}</template>
          <template v-else-if="apiTest.status === 'need'">{{ t('api_test_need_endpoint') }}</template>
          <div v-else-if="apiTest.status === 'success'">
            <div class="font-semibold">{{ t('api_test_success_title') }}</div>
            <template v-if="apiTest.models.length">
              <div class="mt-1 opacity-90">{{ apiTestLabel }}</div>
              <div class="mt-0.5 break-all font-mono opacity-80">{{ apiTest.models.join(', ') }}</div>
              <div v-if="apiTest.total > apiTest.models.length" class="mt-0.5 opacity-70">{{ t('api_test_more_omitted') }}</div>
            </template>
            <div v-else class="mt-1 opacity-80">{{ t('api_test_models_empty_note') }}</div>
          </div>
          <div v-else>
            <div class="font-semibold">{{ t('api_test_failed_title') }}</div>
            <div class="mt-1 whitespace-pre-wrap">{{ apiTest.detail }}</div>
            <div v-if="apiTest.testedUrls.length" class="mt-1 opacity-80">
              {{ t('api_test_tested_urls_label') }}
              <div v-for="u in apiTest.testedUrls" :key="u">• {{ u }}</div>
            </div>
            <div v-if="apiTest.suggestions.length" class="mt-1.5">
              <div class="font-medium opacity-90">{{ t('api_test_suggest_title') }}</div>
              <ul class="list-disc ml-4 opacity-80">
                <li v-for="(sg, i) in apiTest.suggestions" :key="i">{{ sg }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Advanced Settings (折叠) -->
      <details class="group mt-4 border-t pt-4" style="border-color:var(--color-border)">
        <summary class="cursor-pointer text-xs font-semibold uppercase tracking-wider transition-colors select-none list-none flex items-center gap-1" style="color:var(--color-text-muted)">
          {{ t('advanced_settings') }}
          <span class="ml-auto transition-transform group-open:rotate-90">→</span>
        </summary>
        <div class="settings-advanced mt-4 space-y-5">
          <!-- Inference backend -->
          <div>
            <label class="label-base">{{ t('settings_inference_backend') }}</label>
            <select v-model="s.inferenceBackend" class="ui-input mt-1.5" @change="onBackendChange">
              <option value="remote-api">{{ t('settings_backend_remote') }}</option>
              <option value="webllm">{{ t('settings_backend_webllm') }}</option>
            </select>
            <div v-show="isWebLLM" class="mt-2">
              <label class="text-xs font-semibold" style="color:var(--color-text-muted)">{{ t('settings_webllm_model') }}</label>
              <select v-model="s.webllmModel" class="ui-input ui-input-compact mt-1" @change="onModelChange">
                <option value="Llama-3.2-1B-Instruct-q4f16_1-MLC">Llama-3.2-1B (q4f16)</option>
                <option value="Llama-3.2-3B-Instruct-q4f16_1-MLC">Llama-3.2-3B (q4f16)</option>
              </select>
              <p class="ui-help-text mt-1" style="color:var(--color-primary)">{{ t('settings_webllm_hint') }}</p>
            </div>
          </div>

          <!-- Ollama compat -->
          <div class="ui-panel ui-panel-flat rounded-2xl p-3">
            <div class="flex items-center justify-between gap-3">
              <div>
                <label class="label-base">{{ t('settings_ollama_compat_label') }}</label>
                <p class="ui-help-text mt-0.5">{{ t('settings_ollama_compat_hint') }}</p>
              </div>
              <input v-model="s.ollamaCompatMode" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
            </div>
          </div>

          <hr style="border-color:var(--color-border)">

          <!-- Generation params -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label-base">{{ t('settings_context_length') }}</label>
              <span class="text-xs px-2 py-0.5 rounded-full" style="color:var(--color-text-muted);background:var(--color-surface-soft)">{{ s.contextLength }}</span>
            </div>
            <input v-model.number="s.contextLength" type="range" min="1" max="50" class="w-full" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label-base">{{ t('settings_max_tokens') }}</label>
              <span class="text-xs px-2 py-0.5 rounded-full" style="color:var(--color-text-muted);background:var(--color-surface-soft)">{{ s.maxTokens }}</span>
            </div>
            <input v-model.number="s.maxTokens" type="range" min="64" max="8192" class="w-full" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label-base">{{ t('settings_temperature') }}</label>
              <span class="text-xs px-2 py-0.5 rounded-full" style="color:var(--color-text-muted);background:var(--color-surface-soft)">{{ s.temperature }}</span>
            </div>
            <input v-model.number="s.temperature" type="range" min="0" max="2" step="0.05" class="w-full" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label-base">{{ t('settings_top_p') }}</label>
              <span class="text-xs px-2 py-0.5 rounded-full" style="color:var(--color-text-muted);background:var(--color-surface-soft)">{{ s.topP }}</span>
            </div>
            <input v-model.number="s.topP" type="range" min="0" max="1" step="0.05" class="w-full" @change="persist">
          </div>

          <hr style="border-color:var(--color-border)">

          <!-- Persona -->
          <div>
            <label class="label-base">{{ t('settings_user_name') }}</label>
            <input v-model="s.userName" type="text" class="ui-input mt-1.5" @change="persist">
          </div>
          <div>
            <label class="label-base">{{ t('settings_user_description') }}</label>
            <textarea v-model="s.userDescription" rows="3" class="ui-input mt-1.5 resize-none" @change="persist" />
          </div>

          <!-- System prompt + post history -->
          <div>
            <label class="label-base">{{ t('settings_system_prompt') }}</label>
            <textarea v-model="s.systemPrompt" rows="4" class="ui-input mt-1.5 resize-none" @change="persist" />
          </div>
          <div>
            <label class="label-base">{{ t('settings_post_history_instructions') }}</label>
            <textarea v-model="s.postHistoryInstructions" rows="4" class="ui-input mt-1.5 resize-none" @change="persist" />
          </div>

          <!-- Two stage -->
          <div class="ui-panel ui-panel-flat rounded-2xl p-3">
            <div class="flex items-center justify-between gap-3 mb-2">
              <label class="label-base">{{ t('settings_two_stage_label') }}</label>
              <input v-model="s.twoStageEnabled" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
            </div>
            <p class="ui-help-text">{{ t('settings_two_stage_hint') }}</p>
          </div>

          <!-- CoT -->
          <div class="ui-panel ui-panel-flat rounded-2xl p-3 space-y-3">
            <label class="flex items-center justify-between gap-3">
              <span class="label-base">{{ t('settings_cot_request_label') }}</span>
              <input v-model="s.requestCotEnabled" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
            </label>
            <label class="flex items-center justify-between gap-3">
              <span class="label-base">{{ t('settings_cot_show_label') }}</span>
              <input v-model="s.showCotEnabled" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
            </label>
          </div>

          <hr style="border-color:var(--color-border)">

          <!-- Summary -->
          <div class="flex items-center justify-between">
            <label class="label-base">{{ t('summary_auto_label') }}</label>
            <input v-model="s.summaryEnabled" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-semibold" style="color:var(--color-text-muted)">{{ t('settings_summary_threshold') }}</label>
              <span class="text-xs px-2 py-0.5 rounded-full" style="color:var(--color-text-muted);background:var(--color-surface-soft)">{{ s.summaryThreshold }}</span>
            </div>
            <input v-model.number="s.summaryThreshold" type="range" min="1" max="100" class="w-full" @change="persist">
          </div>
          <div>
            <label class="text-xs font-semibold" style="color:var(--color-text-muted)">{{ t('settings_summary_max_words') }}</label>
            <input v-model.number="s.summaryMaxWords" type="number" min="0" max="10000" step="50" class="ui-input ui-input-compact ui-input-w-24 mt-1" @change="persist">
          </div>
          <div>
            <label class="label-base">{{ t('settings_summary_prompt') }}</label>
            <textarea v-model="s.summaryPrompt" rows="4" class="ui-input mt-1.5 resize-y" @change="persist" />
          </div>

          <hr style="border-color:var(--color-border)">

          <!-- WI budget -->
          <div class="flex items-center justify-between mb-2">
            <label class="label-base">{{ t('settings_wi_budget') }}</label>
            <input v-model="s.worldInfoBudgetEnabled" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="label-base">{{ t('settings_wi_budget_max') }}</label>
              <span class="text-xs px-2 py-0.5 rounded-full" style="color:var(--color-text-muted);background:var(--color-surface-soft)">{{ s.worldInfoBudget }}</span>
            </div>
            <input v-model.number="s.worldInfoBudget" type="range" min="256" max="8192" step="256" class="w-full" @change="persist">
          </div>

          <!-- ST preset -->
          <div>
            <label class="label-base">{{ t('settings_st_preset_title') }}</label>
            <p class="ui-help-text mt-0.5">{{ t('settings_st_preset_hint') }}</p>
          </div>

          <hr style="border-color:var(--color-border)">

          <!-- UI theme -->
          <div>
            <label class="label-base">{{ t('settings_ui_theme_label') }}</label>
            <select v-model="s.uiTheme" class="ui-input ui-input-compact mt-2" @change="persist">
              <option value="classic">{{ t('settings_ui_theme_classic') }}</option>
              <option value="new-light">{{ t('settings_ui_theme_new_light') }}</option>
              <option value="new-dark">{{ t('settings_ui_theme_new_dark') }}</option>
            </select>
          </div>

          <!-- Language -->
          <div>
            <label class="label-base">{{ t('announce_lang_label') }}</label>
            <select :value="s.lang" class="ui-input ui-input-compact mt-2" @change="onLangChange">
              <option v-for="o in langOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <label class="label-base">{{ t('settings_low_power_label') }}</label>
            <input v-model="s.lowPowerMode" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
          </div>

          <!-- ComfyUI -->
          <hr style="border-color:var(--color-border)">
          <div class="ui-panel ui-panel-flat rounded-2xl p-3">
            <div class="flex items-center justify-between gap-3">
              <label class="label-base">{{ t('settings_comfy_title') }}</label>
              <input v-model="s.comfyEnabled" type="checkbox" style="accent-color:var(--color-primary)" @change="persist">
            </div>
            <p class="ui-help-text mt-1">{{ t('settings_comfy_hint') }}</p>
            <div class="mt-3 space-y-2">
              <div>
                <label class="text-[11px]" style="color:var(--color-text-muted)">{{ t('settings_comfy_server') }}</label>
                <input v-model="s.comfyServer" type="text" class="ui-input ui-input-compact mt-1" placeholder="http://127.0.0.1:8188" @change="persist">
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[11px]" style="color:var(--color-text-muted)">{{ t('settings_comfy_positive_node') }}</label>
                  <input v-model="s.comfyPositiveNodeId" type="text" class="ui-input ui-input-compact mt-1" placeholder="6" @change="persist">
                </div>
                <div>
                  <label class="text-[11px]" style="color:var(--color-text-muted)">{{ t('settings_comfy_negative_node') }}</label>
                  <input v-model="s.comfyNegativeNodeId" type="text" class="ui-input ui-input-compact mt-1" placeholder="7" @change="persist">
                </div>
                <div>
                  <label class="text-[11px]" style="color:var(--color-text-muted)">{{ t('settings_comfy_seed_node') }}</label>
                  <input v-model="s.comfySeedNodeId" type="text" class="ui-input ui-input-compact mt-1" placeholder="3" @change="persist">
                </div>
              </div>
              <div>
                <label class="text-[11px]" style="color:var(--color-text-muted)">{{ t('settings_comfy_negative_prompt') }}</label>
                <input v-model="s.comfyNegativePrompt" type="text" class="ui-input ui-input-compact mt-1" placeholder="low quality, blurry" @change="persist">
              </div>
              <div>
                <label class="text-[11px]" style="color:var(--color-text-muted)">{{ t('settings_comfy_prompt_template_placeholder') }}</label>
                <textarea v-model="s.comfyPromptTemplate" rows="3" class="ui-input ui-input-compact mt-1 resize-y" @change="persist" />
              </div>
              <input ref="comfyWorkflowFile" type="file" accept=".json,application/json" class="hidden" @change="onWorkflowFile">
              <div class="flex flex-wrap gap-2 items-center">
                <button class="ui-button ui-button-sm" @click="triggerImport">{{ t('settings_comfy_import_workflow') }}</button>
                <button class="ui-button ui-button-sm" @click="onTestComfy">{{ t('settings_comfy_test') }}</button>
              </div>
              <div class="text-[11px]" :style="{ color: comfy.hasWorkflow.value ? 'var(--color-success)' : 'var(--color-text-muted)' }">
                {{ comfy.workflowStatus.value }}
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  </AppModal>
</template>
