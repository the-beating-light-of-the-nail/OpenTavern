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
      <h2 class="text-lg font-bold text-zinc-100">{{ t('webllm_progress_title') }}</h2>
    </div>
    <div id="webllmProgressStatus" class="text-sm text-zinc-300 mb-2">{{ status }}</div>
    <div class="h-2.5 bg-white/10 rounded-full overflow-hidden mb-1">
      <div id="webllmProgressBar" class="h-full bg-amber-500 transition-all duration-200" :style="{ width: percent + '%' }" />
    </div>
    <div id="webllmProgressPercent" class="text-xs text-right text-zinc-400 tabular-nums">{{ percent }}%</div>
    <div class="mt-4 flex gap-2">
      <button id="webllmDetectDeviceBtn" class="flex-1 btn-ghost text-amber-300 border border-white/10" @click="onDetect">{{ t('webllm_detect_device') }}</button>
      <button id="webllmProgressCancelBtn" class="flex-1 btn-danger" @click="onCancel">{{ t('webllm_progress_cancel') }}</button>
    </div>
    <p class="mt-2 text-[10px] text-zinc-500">{{ t('webllm_progress_hint') }}</p>
  </AppModal>
</template>
