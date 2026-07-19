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
    <h2 class="ui-modal-title mb-4" style="color:var(--color-text)">{{ t('summary_manager_title') }}</h2>

    <div v-if="!conv" class="text-center py-8 text-sm" style="color:var(--color-text-muted)">
      {{ t('summary_no_conversation') }}
    </div>

    <div v-else class="flex flex-col md:flex-row gap-4">
      <div class="md:w-5/12 md:border-r flex flex-col" style="border-color:var(--color-border)">
        <span class="label-base mb-3">{{ t('summary_history_section') }}</span>
        <div id="summaryManagerList" class="space-y-3 text-sm max-h-[50vh] overflow-y-auto pr-1">
          <div v-if="!summaries.length" class="text-xs text-center py-6" style="color:var(--color-text-muted)">
            {{ t('summary_empty') }}
          </div>
          <div
            v-for="(s, i) in summaries"
            :key="i"
            class="ui-panel ui-panel-flat rounded-xl p-3"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs line-clamp-3 whitespace-pre-wrap" style="color:var(--color-text-muted)">{{ s.text }}</p>
                <p class="text-[10px] mt-1" style="color:var(--color-text-muted)">
                  {{ t('summary_range_label') }} {{ (s.coveredStart ?? 0) + 1 }}–{{ (s.coveredEnd ?? 0) + 1 }}
                </p>
              </div>
              <button
                class="ui-action-danger flex-shrink-0 transition-colors text-xs"
                style="color:var(--color-text-muted)"
                @click="deleteSummary(i)"
              >&times;</button>
            </div>
          </div>
        </div>
      </div>

      <div class="md:w-7/12 flex flex-col">
        <span class="label-base mb-3">{{ t('summary_new_section') }}</span>
        <div class="flex rounded-xl ui-panel ui-panel-flat p-1 mb-4 w-fit">
          <button
            class="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
            :style="mode === 'recent' ? 'background:var(--color-surface-soft);color:var(--color-text)' : 'color:var(--color-text-muted)'"
            @click="mode = 'recent'"
          >{{ t('summary_mode_recent') }}</button>
          <button
            class="px-4 py-1.5 text-sm rounded-lg font-medium transition-all"
            :style="mode === 'range' ? 'background:var(--color-surface-soft);color:var(--color-text)' : 'color:var(--color-text-muted)'"
            @click="mode = 'range'"
          >{{ t('summary_mode_custom') }}</button>
        </div>

        <div v-show="mode === 'recent'" class="flex items-center gap-3 mb-3">
          <span class="text-sm" style="color:var(--color-text-muted)">{{ t('summary_manual_desc') }}</span>
          <input v-model.number="recentTurns" type="number" min="2" max="60" class="ui-input ui-input-w-16 text-center">
          <span class="text-sm" style="color:var(--color-text-muted)">{{ t('summary_manual_turns') }}</span>
        </div>

        <div v-show="mode === 'range'" class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs mb-1" style="color:var(--color-text-muted)">{{ t('summary_range_start') }}</label>
            <input v-model.number="rangeStart" type="number" min="1" class="ui-input">
          </div>
          <div>
            <label class="block text-xs mb-1" style="color:var(--color-text-muted)">{{ t('summary_range_end') }}</label>
            <input v-model.number="rangeEnd" type="number" min="2" class="ui-input">
          </div>
        </div>

        <button
          id="summaryGenerateBtn"
          class="mt-2 ui-button-primary"
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
