<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <AppModal modal-id="webllmConfirmModal" name="webllmConfirm" max-width="max-w-md" :backdrop-close="false" closable>
    <div class="flex items-center gap-3 mb-4">
      <span class="text-xs font-semibold uppercase tracking-wider text-amber-300">Local</span>
      <h2 class="text-lg font-bold text-zinc-100">{{ t('webllm_confirm_title') }}</h2>
    </div>
    <div id="webllmConfirmText" class="text-sm text-zinc-300 space-y-2 mb-4 leading-relaxed" />
    <div id="webllmConfirmChoice" class="mb-4">
      <div class="grid grid-cols-1 gap-2">
        <button id="webllmChoice1B" class="w-full px-3 py-2.5 rounded-xl text-sm font-medium glass border border-white/10 hover:border-amber-500/40 active:bg-amber-500/10 text-left transition-all">
          <div class="font-semibold">Llama-3.2-1B (q4f16)</div>
          <div class="text-[11px] text-amber-300">约 850 MB · 适合大多数设备</div>
        </button>
        <button id="webllmChoice3B" class="w-full px-3 py-2.5 rounded-xl text-sm font-medium glass border border-white/10 hover:border-amber-500/40 active:bg-amber-500/10 text-left transition-all">
          <div class="font-semibold">Llama-3.2-3B (q4f16)</div>
          <div class="text-[11px] text-amber-300">约 2100 MB · 需要较强 GPU</div>
        </button>
      </div>
    </div>
    <div id="webllmConfirmGenericActions" class="flex gap-3">
      <button id="webllmConfirmCancelBtn" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 transition-all">{{ t('webllm_confirm_cancel') }}</button>
      <button id="webllmConfirmContinueBtn" class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all">{{ t('webllm_confirm_continue') }}</button>
    </div>
    <p class="mt-3 text-[10px] text-center text-zinc-500">{{ t('webllm_confirm_note') }}</p>
  </AppModal>
</template>
