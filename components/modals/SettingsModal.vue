<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { useWebLLM } from '~/composables/useWebLLM';
import { useComfy } from '~/composables/useComfy';
const store = useAppStore();
const ui = useUiStore();
const { t } = useI18n();
const webllm = useWebLLM();
const comfy = useComfy();

const s = computed(() => store.settings);
const isWebLLM = computed(() => s.value.inferenceBackend === 'webllm');
function persist() { store.persist(); }

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
</script>

<template>
  <AppModal modal-id="settingsModal" name="settings" max-width="max-w-lg" closable>
    <h2 class="text-lg font-bold text-zinc-100 mb-1">{{ t('connect_your_ai') }}</h2>
    <p class="text-xs text-zinc-400 mb-6 leading-relaxed">{{ t('connect_ai_explanation') }}</p>

    <div class="space-y-5">
      <!-- Provider quick-fill -->
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Provider</label>
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <button
            v-for="p in quickProviders"
            :key="p.label"
            type="button"
            class="px-3 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 active:bg-amber-500/30 text-zinc-300 hover:text-amber-300 transition-all border border-white/10 font-medium"
            @click="fillProvider(p)"
          >{{ p.label }}</button>
        </div>
      </div>

      <!-- API Key -->
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_api_key') }}</label>
        <input v-model="s.apiKey" type="password" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" placeholder="sk-..." @change="persist">
        <label class="flex items-center gap-2 text-[11px] text-zinc-300 cursor-pointer select-none mt-1.5">
          <input v-model="s.saveApiKey" type="checkbox" class="accent-amber-500 w-3.5 h-3.5 flex-shrink-0" @change="persist">
          <span>{{ t('settings_save_api_key') }}</span>
        </label>
      </div>

      <!-- Model -->
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_model') }}</label>
        <input v-model="s.model" type="text" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" @change="persist">
      </div>

      <!-- Advanced Settings (折叠) -->
      <details class="group mt-4 border-t border-white/5 pt-4">
        <summary class="cursor-pointer text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-zinc-200 transition-colors select-none list-none flex items-center gap-1">
          {{ t('advanced_settings') }}
          <span class="ml-auto transition-transform group-open:rotate-90">→</span>
        </summary>
        <div class="mt-4 space-y-5">
          <!-- Raw API Endpoint -->
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_api_endpoint') }}</label>
            <input v-model="s.apiEndpoint" type="text" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" placeholder="https://api.openai.com/v1" @change="persist">
            <div class="mt-1.5 flex flex-wrap gap-1.5">
              <button type="button" class="px-3 py-1 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-300 border border-white/10 font-medium" @click="fillProvider(quickProviders[0])">{{ t('provider_openrouter') }}</button>
              <button type="button" class="px-3 py-1 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/10 font-medium">{{ t('api_test_button') }}</button>
            </div>
          </div>

          <hr class="border-white/5">

          <!-- Inference backend -->
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_inference_backend') }}</label>
            <select v-model="s.inferenceBackend" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" @change="onBackendChange">
              <option value="remote-api">{{ t('settings_backend_remote') }}</option>
              <option value="webllm">{{ t('settings_backend_webllm') }}</option>
            </select>
            <div v-show="isWebLLM" class="mt-2">
              <label class="text-xs font-semibold text-zinc-400">{{ t('settings_webllm_model') }}</label>
              <select v-model="s.webllmModel" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" @change="onModelChange">
                <option value="Llama-3.2-1B-Instruct-q4f16_1-MLC">Llama-3.2-1B (q4f16)</option>
                <option value="Llama-3.2-3B-Instruct-q4f16_1-MLC">Llama-3.2-3B (q4f16)</option>
              </select>
              <p class="mt-1 text-[10px] text-amber-400/90">{{ t('settings_webllm_hint') }}</p>
            </div>
          </div>

          <!-- Ollama compat -->
          <div class="glass rounded-2xl p-3 border border-white/5">
            <div class="flex items-center justify-between gap-3">
              <div>
                <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_ollama_compat_label') }}</label>
                <p class="text-[10px] text-zinc-600 mt-0.5">{{ t('settings_ollama_compat_hint') }}</p>
              </div>
              <input v-model="s.ollamaCompatMode" type="checkbox" class="accent-amber-500" @change="persist">
            </div>
          </div>

          <hr class="border-white/5">

          <!-- Generation params -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_context_length') }}</label>
              <span class="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{{ s.contextLength }}</span>
            </div>
            <input v-model.number="s.contextLength" type="range" min="1" max="50" class="w-full" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_max_tokens') }}</label>
              <span class="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{{ s.maxTokens }}</span>
            </div>
            <input v-model.number="s.maxTokens" type="range" min="64" max="8192" class="w-full" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_temperature') }}</label>
              <span class="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{{ s.temperature }}</span>
            </div>
            <input v-model.number="s.temperature" type="range" min="0" max="2" step="0.05" class="w-full" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_top_p') }}</label>
              <span class="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{{ s.topP }}</span>
            </div>
            <input v-model.number="s.topP" type="range" min="0" max="1" step="0.05" class="w-full" @change="persist">
          </div>

          <hr class="border-white/5">

          <!-- Persona -->
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_user_name') }}</label>
            <input v-model="s.userName" type="text" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" @change="persist">
          </div>
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_user_description') }}</label>
            <textarea v-model="s.userDescription" rows="3" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" @change="persist" />
          </div>

          <!-- System prompt + post history -->
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_system_prompt') }}</label>
            <textarea v-model="s.systemPrompt" rows="4" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" @change="persist" />
          </div>
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_post_history_instructions') }}</label>
            <textarea v-model="s.postHistoryInstructions" rows="4" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" @change="persist" />
          </div>

          <!-- Two stage -->
          <div class="glass rounded-2xl p-3 border border-white/5">
            <div class="flex items-center justify-between gap-3 mb-2">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_two_stage_label') }}</label>
              <input v-model="s.twoStageEnabled" type="checkbox" class="accent-amber-500" @change="persist">
            </div>
            <p class="text-[10px] text-zinc-600">{{ t('settings_two_stage_hint') }}</p>
          </div>

          <!-- CoT -->
          <div class="glass rounded-2xl p-3 border border-white/5 space-y-3">
            <label class="flex items-center justify-between gap-3">
              <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_cot_request_label') }}</span>
              <input v-model="s.requestCotEnabled" type="checkbox" class="accent-amber-500" @change="persist">
            </label>
            <label class="flex items-center justify-between gap-3">
              <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_cot_show_label') }}</span>
              <input v-model="s.showCotEnabled" type="checkbox" class="accent-amber-500" @change="persist">
            </label>
          </div>

          <hr class="border-white/5">

          <!-- Summary -->
          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('summary_auto_label') }}</label>
            <input v-model="s.summaryEnabled" type="checkbox" class="accent-amber-500" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1">
              <label class="text-xs font-semibold text-zinc-400">{{ t('settings_summary_threshold') }}</label>
              <span class="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{{ s.summaryThreshold }}</span>
            </div>
            <input v-model.number="s.summaryThreshold" type="range" min="1" max="100" class="w-full" @change="persist">
          </div>
          <div>
            <label class="text-xs font-semibold text-zinc-400">{{ t('settings_summary_max_words') }}</label>
            <input v-model.number="s.summaryMaxWords" type="number" min="0" max="10000" step="50" class="w-24 mt-1 px-2 py-1.5 glass rounded-xl text-sm text-zinc-200" @change="persist">
          </div>
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_summary_prompt') }}</label>
            <textarea v-model="s.summaryPrompt" rows="4" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-y" @change="persist" />
          </div>

          <hr class="border-white/5">

          <!-- WI budget -->
          <div class="flex items-center justify-between mb-2">
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_wi_budget') }}</label>
            <input v-model="s.worldInfoBudgetEnabled" type="checkbox" class="accent-amber-500" @change="persist">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_wi_budget_max') }}</label>
              <span class="text-xs text-zinc-500 bg-white/5 px-2 py-0.5 rounded-full">{{ s.worldInfoBudget }}</span>
            </div>
            <input v-model.number="s.worldInfoBudget" type="range" min="256" max="8192" step="256" class="w-full" @change="persist">
          </div>

          <!-- ST preset -->
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_st_preset_title') }}</label>
            <p class="text-[10px] text-zinc-500 mt-0.5">{{ t('settings_st_preset_hint') }}</p>
          </div>

          <hr class="border-white/5">

          <!-- UI theme -->
          <div>
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_ui_theme_label') }}</label>
            <select v-model="s.uiTheme" class="w-full mt-2 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" @change="persist">
              <option value="classic">{{ t('settings_ui_theme_classic') }}</option>
              <option value="new-light">{{ t('settings_ui_theme_new_light') }}</option>
              <option value="new-dark">{{ t('settings_ui_theme_new_dark') }}</option>
            </select>
          </div>

          <div class="flex items-center justify-between">
            <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_low_power_label') }}</label>
            <input v-model="s.lowPowerMode" type="checkbox" class="accent-amber-500" @change="persist">
          </div>

          <!-- ComfyUI -->
          <hr class="border-white/5">
          <div class="glass rounded-2xl p-3 border border-white/5">
            <div class="flex items-center justify-between gap-3">
              <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_comfy_title') }}</label>
              <input v-model="s.comfyEnabled" type="checkbox" class="accent-amber-500" @change="persist">
            </div>
            <p class="text-[10px] text-zinc-600 mt-1">{{ t('settings_comfy_hint') }}</p>
            <div class="mt-3 space-y-2">
              <div>
                <label class="text-[11px] text-zinc-500">{{ t('settings_comfy_server') }}</label>
                <input v-model="s.comfyServer" type="text" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="http://127.0.0.1:8188" @change="persist">
              </div>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[11px] text-zinc-500">{{ t('settings_comfy_positive_node') }}</label>
                  <input v-model="s.comfyPositiveNodeId" type="text" class="w-full mt-1 px-2 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="6" @change="persist">
                </div>
                <div>
                  <label class="text-[11px] text-zinc-500">{{ t('settings_comfy_negative_node') }}</label>
                  <input v-model="s.comfyNegativeNodeId" type="text" class="w-full mt-1 px-2 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="7" @change="persist">
                </div>
                <div>
                  <label class="text-[11px] text-zinc-500">{{ t('settings_comfy_seed_node') }}</label>
                  <input v-model="s.comfySeedNodeId" type="text" class="w-full mt-1 px-2 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="3" @change="persist">
                </div>
              </div>
              <div>
                <label class="text-[11px] text-zinc-500">{{ t('settings_comfy_negative_prompt') }}</label>
                <input v-model="s.comfyNegativePrompt" type="text" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="low quality, blurry" @change="persist">
              </div>
              <div>
                <label class="text-[11px] text-zinc-500">{{ t('settings_comfy_prompt_template_placeholder') }}</label>
                <textarea v-model="s.comfyPromptTemplate" rows="3" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 resize-y" @change="persist" />
              </div>
              <input ref="comfyWorkflowFile" type="file" accept=".json,application/json" class="hidden" @change="onWorkflowFile">
              <div class="flex flex-wrap gap-2 items-center">
                <button class="px-3 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/10 font-medium" @click="triggerImport">{{ t('settings_comfy_import_workflow') }}</button>
                <button class="px-3 py-1.5 text-xs rounded-xl bg-white/5 hover:bg-amber-500/20 text-zinc-300 border border-white/10 font-medium" @click="onTestComfy">{{ t('settings_comfy_test') }}</button>
              </div>
              <div class="text-[11px]" :class="comfy.hasWorkflow.value ? 'text-emerald-300' : 'text-zinc-500'">
                {{ comfy.workflowStatus.value }}
              </div>
            </div>
          </div>
        </div>
      </details>
    </div>
  </AppModal>
</template>
