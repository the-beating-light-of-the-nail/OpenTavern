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
      <h2 class="text-lg font-bold text-zinc-100">{{ t('prompt_viewer_title') }}</h2>
      <div class="flex items-center gap-2">
        <button
          id="copyPromptBtn"
          class="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all"
          @click="onCopy"
        >{{ copied ? t('copied') : t('copy') }}</button>
      </div>
    </div>
    <div class="flex items-center gap-2 mb-3">
      <button
        id="promptStageMainBtn"
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
        :class="stage === 'main' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'"
        @click="stage = 'main'"
      >{{ t('prompt_stage_main') }}</button>
      <button
        id="promptStageSecondBtn"
        type="button"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
        :class="stage === 'second' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/20' : 'bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10'"
        @click="stage = 'second'"
      >{{ t('prompt_stage_second') }}</button>
    </div>
    <pre id="promptViewerContent" class="overflow-y-auto glass rounded-2xl p-4 text-xs text-zinc-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[60vh]">{{ content }}</pre>
  </AppModal>
</template>
