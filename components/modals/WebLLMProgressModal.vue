<script setup lang="ts">
import { useWebLLM } from '~/composables/useWebLLM';

const { t } = useI18n();
const webllm = useWebLLM();
const percent = computed(() => webllm.progressPercent.value);
const status = computed(() => webllm.progressStatus.value);

function onCancel() { webllm.cancelInit(); }
function onDetect() { webllm.detectWebGPUDevice({ showDialog: true }).catch(() => {}); }
</script>

<template>
  <AppModal modal-id="webllmProgressModal" name="webllmProgress" max-width="max-w-md" :backdrop-close="false" :closable="false">
    <div class="flex items-center justify-between mb-3">
      <h2 class="ui-modal-title" style="color:var(--color-text)">{{ t('webllm_progress_title') }}</h2>
    </div>
    <div id="webllmProgressStatus" class="text-sm mb-2" style="color:var(--color-text-muted)">{{ status }}</div>
    <div class="h-2.5 rounded-full overflow-hidden mb-1" style="background:var(--color-surface-soft)">
      <div id="webllmProgressBar" class="h-full transition-all duration-200" style="background:var(--color-primary)" :style="{ width: percent + '%' }" />
    </div>
    <div id="webllmProgressPercent" class="text-xs text-right tabular-nums" style="color:var(--color-text-muted)">{{ percent }}%</div>
    <div class="mt-4 flex gap-2">
      <button id="webllmDetectDeviceBtn" class="flex-1 ui-button-ghost border" style="color:var(--color-primary);border-color:var(--color-border)" @click="onDetect">{{ t('webllm_detect_device') }}</button>
      <button id="webllmProgressCancelBtn" class="flex-1 ui-button-danger" @click="onCancel">{{ t('webllm_progress_cancel') }}</button>
    </div>
    <p class="mt-2 text-[10px]" style="color:var(--color-text-muted)">{{ t('webllm_progress_hint') }}</p>
  </AppModal>
</template>
