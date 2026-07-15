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
    <h2 class="text-base sm:text-lg font-bold mb-3" style="color:var(--color-text)">{{ t('group_mention_title') }}</h2>
    <div id="groupMentionList" class="max-h-[55vh] overflow-y-auto pr-1 space-y-1.5">
      <div
        v-for="(m, i) in members"
        :key="i"
        class="ui-panel rounded-xl !shadow-none px-3 py-2 text-sm transition-all flex items-center gap-2"
        style="color:var(--color-text);border-color:var(--color-primary)"
        :class="m.muted ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'"
        @click="choose(m)"
      >
        <div class="w-8 h-8 rounded-lg ot-avatar-fill flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{{ (m.character?.name || '?').charAt(0) }}</div>
        <div class="min-w-0 flex-1">
          <p class="font-medium truncate">{{ m.character?.name }}</p>
          <p v-if="m.character?.personality" class="text-[10px] truncate" style="color:var(--color-text-muted)">{{ m.character.personality }}</p>
        </div>
        <span v-if="m.muted" class="text-[10px]" style="color:var(--color-text-muted)">muted</span>
      </div>
      <p v-if="!members.length" class="text-xs text-center py-6" style="color:var(--color-text-muted)">{{ t('group_mention_no_group') }}</p>
    </div>
    <p class="mt-4 pt-3 border-t text-[11px]" style="border-color:var(--color-border);color:var(--color-text-muted)">{{ t('group_mention_hint') }}</p>
  </AppModal>
</template>
