<script setup lang="ts">
const { t } = useI18n();
const percent = ref(0);
const status = ref('准备中...');
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
      <button id="webllmDetectDeviceBtn" class="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-amber-300 border border-white/10 transition-all">检测设备</button>
      <button id="webllmProgressCancelBtn" class="flex-1 px-4 py-2 rounded-xl text-sm font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all">{{ t('webllm_progress_cancel') }}</button>
    </div>
    <p class="mt-2 text-[10px] text-zinc-500">{{ t('webllm_progress_hint') }}</p>
  </AppModal>
</template>
