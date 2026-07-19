<script setup lang="ts">
import { useChat } from '~/composables/useChat';

const { t } = useI18n();
const ui = useUiStore();
const { buildMessagesForAPI, buildSecondStageMessages } = useChat();

const stage = ref<'main' | 'second'>('main');
const copied = ref(false);

const content = computed(() => {
  let messages: { role: string; content: string }[] = [];
  try {
    messages = stage.value === 'main' ? buildMessagesForAPI() : buildSecondStageMessages();
  } catch {
    messages = [];
  }
  return messages
    .map((m) => `[${m.role.toUpperCase()}]\n${m.content}`)
    .join('\n\n')
    || t('prompt_viewer_empty');
});

async function onCopy() {
  try {
    await navigator.clipboard.writeText(content.value);
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 1500);
  } catch {
    ui.showDialog({ message: t('copy_failed'), showCancel: false });
  }
}

// 打开时刷新到 main 阶段
watch(() => ui.isOpen('promptViewer'), (open) => {
  if (open) { stage.value = 'main'; copied.value = false; }
});
</script>

<template>
  <AppModal modal-id="promptViewerModal" name="promptViewer" max-width="max-w-2xl" closable>
    <div class="flex items-center justify-between mb-4">
      <h2 class="ui-modal-title" style="color:var(--color-text)">{{ t('prompt_viewer_title') }}</h2>
      <div class="flex items-center gap-2">
        <button
          id="copyPromptBtn"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
          style="background:color-mix(in srgb,var(--color-primary) 12%,transparent);color:var(--color-primary)"
          @click="onCopy"
        >{{ copied ? t('copied') : t('copy') }}</button>
      </div>
    </div>
    <div class="flex items-center gap-2 mb-3">
      <button
        id="promptStageMainBtn"
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
        :style="stage === 'main' ? 'background:color-mix(in srgb,var(--color-primary) 12%,transparent);color:var(--color-primary);border-color:var(--color-primary)' : 'background:var(--color-surface-soft);color:var(--color-text-muted);border-color:var(--color-border)'"
        @click="stage = 'main'"
      >{{ t('prompt_stage_main') }}</button>
      <button
        id="promptStageSecondBtn"
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border"
        :style="stage === 'second' ? 'background:color-mix(in srgb,var(--color-primary) 12%,transparent);color:var(--color-primary);border-color:var(--color-primary)' : 'background:var(--color-surface-soft);color:var(--color-text-muted);border-color:var(--color-border)'"
        @click="stage = 'second'"
      >{{ t('prompt_stage_second') }}</button>
    </div>
    <pre id="promptViewerContent" class="overflow-y-auto ui-panel rounded-2xl p-4 text-xs whitespace-pre-wrap font-mono leading-relaxed max-h-[60vh]" style="color:var(--color-text)">{{ content }}</pre>
  </AppModal>
</template>
