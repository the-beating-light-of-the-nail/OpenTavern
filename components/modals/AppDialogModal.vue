<script setup lang="ts">
import { useUiStore } from '~/stores/ui';
const { t } = useI18n();
const ui = useUiStore();

const open = computed(() => ui.dialog.open);
function ok() { ui.resolveDialog(true); }
function cancel() { ui.resolveDialog(false); }
function onBackdrop() { if (ui.dialog.showCancel) cancel(); else ok(); }
</script>

<template>
  <div v-show="open" id="appDialogModal" class="modal-overlay fixed inset-0 z-[220] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="onBackdrop" />
    <div class="relative glass rounded-3xl w-[92%] max-w-md p-6 shadow-2xl animate-fade-in">
      <div class="flex items-start gap-3 mb-4">
        <div id="appDialogIcon" class="w-9 h-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0" :class="ui.dialog.danger ? 'bg-red-500/15 text-red-300' : 'bg-amber-500/15 text-amber-300'">{{ ui.dialog.icon }}</div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold text-zinc-100">{{ ui.dialog.title }}</h2>
          <div class="mt-2 text-sm text-zinc-300 leading-relaxed whitespace-pre-line break-words">{{ ui.dialog.message }}</div>
        </div>
      </div>
      <div class="flex gap-3 justify-end">
        <button v-if="ui.dialog.showCancel" class="px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 transition-all" @click="cancel">{{ ui.dialog.cancelText || t('webllm_confirm_cancel') }}</button>
        <button class="px-4 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all" :class="ui.dialog.danger ? 'bg-red-500 hover:bg-red-400 text-white shadow-red-500/20' : 'bg-amber-500 hover:bg-amber-400 text-white shadow-amber-500/20'" @click="ok">{{ ui.dialog.okText || t('webllm_confirm_continue') }}</button>
      </div>
    </div>
  </div>
</template>
