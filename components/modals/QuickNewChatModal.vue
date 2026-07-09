<script setup lang="ts">
const { t } = useI18n();
const ui = useUiStore();
</script>

<template>
  <AppModal modal-id="quickNewChatModal" name="quickNewChat" max-width="max-w-sm" closable>
    <h2 class="text-lg font-bold mb-4">{{ t('quick_new_chat_title') }}</h2>
    <div class="space-y-2.5">
      <button id="quickNewChatWithCurrentBtn" class="w-full px-4 py-3 rounded-2xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white transition-all">{{ t('quick_new_with_current') }}</button>
      <button id="quickReturnToLibraryBtn" class="w-full px-4 py-3 rounded-2xl text-sm font-semibold bg-white/10 hover:bg-white/15 transition-all" @click="ui.close('quickNewChat')">{{ t('quick_return_library') }}</button>
      <button id="quickNewGroupChatBtn" class="w-full px-4 py-3 rounded-2xl text-sm font-semibold bg-white/5 hover:bg-white/10 border border-white/10 transition-all">{{ t('quick_new_group') }}</button>
    </div>
  </AppModal>
</template>
