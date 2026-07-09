<script setup lang="ts">
import { useAppStore } from '~/stores/app';
const store = useAppStore();
const { t } = useI18n();

const s = computed(() => store.settings);
const isWebLLM = computed(() => s.value.inferenceBackend === 'webllm');
function persist() { store.persist(); }
</script>

<template>
  <AppModal modal-id="settingsModal" name="settings" max-width="max-w-lg" closable>
    <h2 class="text-lg font-bold text-zinc-100 mb-6">{{ t('settings_title') }}</h2>
    <div class="space-y-5">
      <!-- API Endpoint -->
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_api_endpoint') }}</label>
        <input v-model="s.apiEndpoint" type="text" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" placeholder="https://api.openai.com/v1" @change="persist">
        <div class="mt-1.5 flex flex-wrap gap-1.5">
          <button type="button" class="px-3 py-1 text-xs rounded-lg bg-white/5 hover:bg-amber-500/20 active:bg-amber-500/30 text-zinc-300 hover:text-amber-300 transition-all border border-white/10 font-medium">DeepSeek</button>
          <button type="button" class="px-3 py-1 text-xs rounded-lg bg-white/5 hover:bg-amber-500/20 active:bg-amber-500/30 text-amber-300 hover:text-amber-200 transition-all border border-white/10 font-medium">{{ t('api_test_button') }}</button>
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

      <!-- Model -->
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_model') }}</label>
        <input v-model="s.model" type="text" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" @change="persist">
      </div>

      <!-- Inference backend -->
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_inference_backend') }}</label>
        <select v-model="s.inferenceBackend" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" @change="persist">
          <option value="remote-api">{{ t('settings_backend_remote') }}</option>
          <option value="webllm">{{ t('settings_backend_webllm') }}</option>
        </select>
        <div v-show="isWebLLM" class="mt-2">
          <label class="text-xs font-semibold text-zinc-400">{{ t('settings_webllm_model') }}</label>
          <select v-model="s.webllmModel" class="w-full mt-1 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" @change="persist">
            <option value="Llama-3.2-1B-Instruct-q4f16_1-MLC">Llama-3.2-1B (q4f16，约 850 MB)</option>
            <option value="Llama-3.2-3B-Instruct-q4f16_1-MLC">Llama-3.2-3B (q4f16，约 2100 MB)</option>
          </select>
          <p class="mt-1 text-[10px] text-amber-400/90">{{ t('settings_webllm_hint') }}</p>
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

      <!-- Auto summary -->
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
        <input v-model.number="s.summaryMaxWords" type="number" min="0" max="10000" step="50" class="w-24 mt-1 px-2 py-1.5 glass rounded-lg text-sm text-zinc-200" @change="persist">
      </div>
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_summary_prompt') }}</label>
        <textarea v-model="s.summaryPrompt" rows="4" class="w-full mt-1.5 px-3 py-2.5 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-y" @change="persist" />
      </div>

      <!-- WI budget -->
      <hr class="border-white/5">
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

      <!-- UI theme -->
      <hr class="border-white/5">
      <div>
        <label class="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{{ t('settings_ui_theme_label') }}</label>
        <select v-model="s.uiTheme" class="w-full mt-2 px-3 py-2 text-sm glass rounded-xl text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30" @change="persist">
          <option value="classic">{{ t('settings_ui_theme_classic') }}</option>
          <option value="new-light">{{ t('settings_ui_theme_new_light') }}</option>
          <option value="new-dark">{{ t('settings_ui_theme_new_dark') }}</option>
        </select>
      </div>

      <!-- Low power -->
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
        <div class="mt-3 space-y-2">
          <input v-model="s.comfyServer" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="http://127.0.0.1:8188" @change="persist">
          <input v-model="s.comfyPositiveNodeId" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="正向节点 ID" @change="persist">
          <input v-model="s.comfyNegativeNodeId" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="负向节点 ID" @change="persist">
          <input v-model="s.comfySeedNodeId" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="Seed 节点 ID" @change="persist">
          <input v-model="s.comfyNegativePrompt" type="text" class="w-full px-3 py-2 text-sm glass rounded-xl text-zinc-200" placeholder="low quality, blurry" @change="persist">
          <textarea v-model="s.comfyPromptTemplate" rows="3" class="w-full px-3 py-2 text-sm glass rounded-xl text-zinc-200 resize-y" @change="persist" />
          <div class="flex flex-wrap gap-2">
            <button class="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/10 font-medium">{{ t('settings_comfy_import_workflow') }}</button>
            <button class="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-amber-500/20 text-zinc-300 border border-white/10 font-medium">{{ t('settings_comfy_test') }}</button>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>
