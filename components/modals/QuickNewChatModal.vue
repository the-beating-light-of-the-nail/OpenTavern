<script setup lang="ts">
import { useAppStore } from '~/stores/app';

const store = useAppStore();
const { t } = useI18n();
const ui = useUiStore();

function onWithCurrent() {
  const conv = store.activeConversation;
  if (!conv) {
    store.createConversation();
  } else if (conv.character) {
    store.createConversation({ data: conv.character });
  } else if (conv.group) {
    store.createConversation(conv.group.members.map((m: any) => ({ data: m.character })));
  } else {
    store.createConversation();
  }
  ui.close('quickNewChat');
}

function onNewGroup() {
  ui.close('quickNewChat');
  ui.open('newChatPicker');
}
</script>

<template>
  <AppModal modal-id="quickNewChatModal" name="quickNewChat" max-width="max-w-sm" closable>
    <h2 class="text-lg font-bold mb-4" style="color:var(--color-text)">{{ t('quick_new_chat_title') }}</h2>
    <div class="space-y-2.5">
      <button id="quickNewChatWithCurrentBtn" class="w-full btn-primary" @click="onWithCurrent">{{ t('quick_new_with_current') }}</button>
      <button id="quickReturnToLibraryBtn" class="w-full btn-secondary" @click="ui.close('quickNewChat')">{{ t('quick_return_library') }}</button>
      <button id="quickNewGroupChatBtn" class="w-full btn-ghost border" style="border-color:var(--color-border)" @click="onNewGroup">{{ t('quick_new_group') }}</button>
    </div>
  </AppModal>
</template>
