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
    <div class="relative ui-panel rounded-3xl w-[92%] max-w-md p-6 shadow-2xl animate-fade-in">
      <div class="flex items-start gap-3 mb-4">
        <div id="appDialogIcon" class="w-9 h-9 rounded-2xl flex items-center justify-center text-lg flex-shrink-0" :style="ui.dialog.danger ? 'background:color-mix(in srgb,var(--color-danger) 15%,transparent);color:var(--color-danger)' : 'background:color-mix(in srgb,var(--color-primary) 12%,transparent);color:var(--color-primary)'">{{ ui.dialog.icon }}</div>
        <div class="min-w-0">
          <h2 class="text-lg font-bold" style="color:var(--color-text)">{{ ui.dialog.title }}</h2>
          <div class="mt-2 text-sm leading-relaxed whitespace-pre-line break-words" style="color:var(--color-text)">{{ ui.dialog.message }}</div>
        </div>
      </div>
      <div class="flex gap-3 justify-end">
        <button v-if="ui.dialog.showCancel" class="btn-secondary" @click="cancel">{{ ui.dialog.cancelText || t('webllm_confirm_cancel') }}</button>
        <button
          :class="ui.dialog.danger ? 'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all' : 'btn-primary'"
          :style="ui.dialog.danger ? 'background:var(--color-danger);color:#fff' : ''"
          @click="ok"
        >{{ ui.dialog.okText || t('webllm_confirm_continue') }}</button>
      </div>
    </div>
  </div>
</template>
