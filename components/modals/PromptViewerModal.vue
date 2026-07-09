<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <AppModal modal-id="promptViewerModal" name="promptViewer" max-width="max-w-2xl" closable>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-zinc-100">{{ t('prompt_viewer_title') }}</h2>
      <div class="flex items-center gap-2">
        <button id="copyPromptBtn" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all mr-9">{{ t('copy') }}</button>
      </div>
    </div>
    <div class="flex items-center gap-2 mb-3">
      <button id="promptStageMainBtn" type="button" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/20 transition-all">{{ t('prompt_stage_main') }}</button>
      <button id="promptStageSecondBtn" type="button" class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 transition-all">{{ t('prompt_stage_second') }}</button>
    </div>
    <pre id="promptViewerContent" class="overflow-y-auto glass rounded-2xl p-4 text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed" />
  </AppModal>
</template>
