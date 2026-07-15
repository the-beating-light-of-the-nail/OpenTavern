<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useSummarization } from '~/composables/useSummarization';

const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();
const { summarizeRecent, performSummarization } = useSummarization();

const conv = computed(() => store.activeConversation);
const summaries = computed(() => (conv.value as any)?.summaries || []);

const mode = ref<'recent' | 'range'>('recent');
const recentTurns = ref(8);
const rangeStart = ref(1);
const rangeEnd = ref(12);
const isGenerating = ref(false);

function deleteSummary(idx: number) {
  if (!conv.value) return;
  const list = (conv.value as any).summaries;
  if (list && idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    store.persist();
  }
}

async function onGenerate() {
  if (!conv.value || isGenerating.value) return;
  isGenerating.value = true;
  try {
    if (mode.value === 'recent') {
      await summarizeRecent(recentTurns.value);
    } else {
      const start = Math.max(0, (rangeStart.value || 1) - 1);
      const end = Math.max(start + 1, (rangeEnd.value || 12) - 1);
      await performSummarization(start, end);
    }
  } finally {
    isGenerating.value = false;
  }
}

function close() { ui.close('summaryManager'); }
</script>

<template>
  <AppModal modal-id="summaryManagerModal" name="summaryManager" max-width="max-w-3xl" closable>
    <h2 class="text-lg font-bold text-zinc-100 mb-4">{{ t('summary_manager_title') }}</h2>

    <div v-if="!conv" class="text-center py-8 text-zinc-500 text-sm">
      {{ t('summary_no_conversation') }}
    </div>

    <div v-else class="flex flex-col md:flex-row gap-4">
      <div class="md:w-5/12 md:border-r md:border-white/10 flex flex-col">
        <span class="label-base mb-3">{{ t('summary_history_section') }}</span>
        <div id="summaryManagerList" class="space-y-3 text-sm max-h-[50vh] overflow-y-auto pr-1">
          <div v-if="!summaries.length" class="text-xs text-zinc-500 text-center py-6">
            {{ t('summary_empty') }}
          </div>
          <div
            v-for="(s, i) in summaries"
            :key="i"
            class="glass rounded-xl p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs text-zinc-400 line-clamp-3 whitespace-pre-wrap">{{ s.text }}</p>
                <p class="text-[10px] text-zinc-500 mt-1">
                  {{ t('summary_range_label') }} {{ (s.coveredStart ?? 0) + 1 }}–{{ (s.coveredEnd ?? 0) + 1 }}
                </p>
              </div>
              <button
                class="flex-shrink-0 text-zinc-500 hover:text-red-400 transition-colors text-xs"
                @click="deleteSummary(i)"
              >&times;</button>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-7/12 flex flex-col">
        <span class="label-base mb-3">{{ t('summary_new_section') }}</span>
        <div class="flex rounded-xl glass p-1 mb-4 w-fit">
          <button
            class="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
            :class="mode === 'recent' ? 'bg-white/10 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'"
            @click="mode = 'recent'"
          >{{ t('summary_mode_recent') }}</button>
          <button
            class="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
            :class="mode === 'range' ? 'bg-white/10 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'"
            @click="mode = 'range'"
          >{{ t('summary_mode_custom') }}</button>
        </div>

        <div v-show="mode === 'recent'" class="flex items-center gap-3 mb-3">
          <span class="text-sm text-zinc-400">{{ t('summary_manual_desc') }}</span>
          <input v-model.number="recentTurns" type="number" min="2" max="60" class="w-16 px-2.5 py-1.5 glass rounded-lg text-sm text-zinc-200 text-center focus:outline-none focus:ring-2 focus:ring-amber-500/30">
          <span class="text-sm text-zinc-400">{{ t('summary_manual_turns') }}</span>
        </div>

        <div v-show="mode === 'range'" class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs text-zinc-400 mb-1">{{ t('summary_range_start') }}</label>
            <input v-model.number="rangeStart" type="number" min="1" class="w-full px-3 py-1.5 glass rounded-lg text-sm text-zinc-200">
          </div>
          <div>
            <label class="block text-xs text-zinc-400 mb-1">{{ t('summary_range_end') }}</label>
            <input v-model.number="rangeEnd" type="number" min="2" class="w-full px-3 py-1.5 glass rounded-lg text-sm text-zinc-200">
          </div>
        </div>

        <button
          id="summaryGenerateBtn"
          class="mt-2 btn-primary"
          :disabled="isGenerating"
          @click="onGenerate"
        >
          <span v-if="isGenerating" class="animate-pulse">{{ t('summary_generating') }}</span>
          <span v-else>{{ t('summary_generate') }}</span>
        </button>
      </div>
    </div>
  </AppModal>
</template>
