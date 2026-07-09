<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { useGroupMention } from '~/composables/useGroupMention';

const store = useAppStore();
const ui = useUiStore();
const { t } = useI18n();
const groupMention = useGroupMention();

/** 当前群组成员（原版读 conv.group.members，按 order 排序） */
const members = computed<any[]>(() => {
  const conv = store.activeConversation;
  return groupMention.membersOf(conv);
});

function choose(m: any) {
  if (!m || m.muted) return;
  groupMention.setPending(m.character);
  ui.close('groupMention');
}
</script>

<template>
  <AppModal modal-id="groupMentionModal" name="groupMention" max-width="max-w-md" closable>
    <h2 class="text-base sm:text-lg font-bold text-zinc-100 mb-3">{{ t('group_mention_title') }}</h2>
    <div id="groupMentionList" class="max-h-[55vh] overflow-y-auto pr-1 space-y-1.5">
      <div
        v-for="(m, i) in members"
        :key="i"
        class="glass rounded-xl px-3 py-2 text-sm text-zinc-200 hover:border-amber-500/30 transition-all flex items-center gap-2"
        :class="m.muted ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"
        @click="choose(m)"
      >
        <div class="w-8 h-8 rounded-lg ot-avatar-fill flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{{ (m.character?.name || '?').charAt(0) }}</div>
        <div class="min-w-0 flex-1">
          <p class="font-medium truncate">{{ m.character?.name }}</p>
          <p v-if="m.character?.personality" class="text-[10px] text-zinc-500 truncate">{{ m.character.personality }}</p>
        </div>
        <span v-if="m.muted" class="text-[10px] text-zinc-500">muted</span>
      </div>
      <p v-if="!members.length" class="text-xs text-zinc-500 text-center py-6">{{ t('group_mention_no_group') }}</p>
    </div>
    <p class="mt-4 pt-3 border-t border-white/10 text-[11px] text-zinc-500">{{ t('group_mention_hint') }}</p>
  </AppModal>
</template>
