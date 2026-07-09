<script setup lang="ts">
import { useAppStore } from '~/stores/app';
const store = useAppStore();
const { t } = useI18n();
const members = computed<any[]>(() => {
  const conv = store.activeConversation;
  return Array.isArray(conv?.members) ? conv.members : [];
});
</script>

<template>
  <AppModal modal-id="groupMentionModal" name="groupMention" max-width="max-w-md" closable>
    <h2 class="text-base sm:text-lg font-bold text-zinc-100 mb-3">{{ t('group_mention_title') }}</h2>
    <div id="groupMentionList" class="max-h-[55vh] overflow-y-auto pr-1 space-y-1.5">
      <div v-for="m in members" :key="m.id || m.name" class="glass rounded-xl px-3 py-2 text-sm text-zinc-200 hover:border-amber-500/30 cursor-pointer">
        {{ m.name }}
      </div>
      <p v-if="!members.length" class="text-xs text-zinc-500 text-center py-6">{{ t('group_mention_no_group') }}</p>
    </div>
    <p class="mt-4 pt-3 border-t border-white/10 text-[11px] text-zinc-500">{{ t('group_mention_hint') }}</p>
  </AppModal>
</template>
