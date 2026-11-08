<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';

const store = useAppStore();
const ui = useUiStore();
const { locale } = useI18n();

const isZh = computed(() => locale.value === 'zh-CN' || locale.value === 'zh-TW');
const conv = computed(() => store.activeConversation);
const note = ref('');

watch(
  () => ui.isOpen('authorNote'),
  (open) => {
    if (open) note.value = String((conv.value as any)?.authorNote || '');
  },
);

function close() {
  ui.close('authorNote');
}

function save() {
  if (!conv.value) return;
  (conv.value as any).authorNote = note.value;
  store.persist(true);
  close();
}
</script>

<template>
  <div v-if="ui.isOpen('authorNote')" class="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4" @click.self="close">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" style="color:#3c3c3c">
      <div class="flex items-start justify-between gap-3">
        <div>
          <h2 class="text-lg font-bold">Author's Note</h2>
          <p class="mt-1 text-xs leading-relaxed" style="color:#8e8e8e">
            {{ isZh ? '附加到当前对话的系统提示，用来控制语气、视角或剧情方向。' : 'A system note appended to the current chat for tone, point of view or plot direction.' }}
          </p>
        </div>
        <button class="rounded-lg px-2 py-1 text-lg leading-none hover:bg-black/5" aria-label="Close" @click="close">&times;</button>
      </div>

      <textarea
        v-model="note"
        rows="6"
        class="mt-4 w-full rounded-xl border px-3 py-2 text-sm outline-none focus:border-[#d87557]"
        style="background:#f5f2ed;border-color:#d1c9bc;color:#3c3c3c"
        :placeholder="isZh ? '例如：保持第二人称，语气克制，不要替用户做决定。' : 'e.g. Keep second person, restrained tone, never decide for the user.'"
      />

      <p v-if="!conv" class="mt-2 text-xs" style="color:#e55134">
        {{ isZh ? '请先打开一个对话。' : 'Open a conversation first.' }}
      </p>

      <div class="mt-5 flex justify-end gap-2">
        <button class="rounded-xl border px-4 py-2 text-sm font-medium" style="border-color:#d1c9bc;color:#5a534c" @click="close">
          {{ isZh ? '取消' : 'Cancel' }}
        </button>
        <button
          class="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
          style="background:#d87557"
          :disabled="!conv"
          @click="save"
        >
          {{ isZh ? '保存' : 'Save' }}
        </button>
      </div>
    </div>
  </div>
</template>
