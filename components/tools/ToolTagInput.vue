<script setup lang="ts">
/** 标签输入：chips + 回车/逗号添加，退格删除末位 */
const model = defineModel<string[]>({ required: true });

const { t } = useI18n();
const input = ref('');
const inputEl = ref<HTMLInputElement | null>(null);

function commit() {
  const v = input.value.trim().replace(/,+$/, '');
  if (v && !model.value.includes(v)) model.value = [...model.value, v];
  input.value = '';
}

function removeTag(tag: string) {
  model.value = model.value.filter((x) => x !== tag);
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    commit();
  } else if (e.key === 'Backspace' && !input.value && model.value.length) {
    model.value = model.value.slice(0, -1);
  }
}

function onBlur() {
  commit();
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5" @click="inputEl?.focus()">
    <span
      v-for="tag in model"
      :key="tag"
      class="inline-flex items-center gap-1 rounded-md bg-rose-tint px-2 py-0.5 text-xs font-medium text-plum"
    >
      {{ tag }}
      <button type="button" class="text-plum-muted hover:text-rose-deep" :aria-label="t('cs_tag_remove')" @click.stop="removeTag(tag)">×</button>
    </span>
    <input
      ref="inputEl"
      v-model="input"
      type="text"
      class="min-w-[7rem] flex-1 border-0 bg-transparent p-0.5 text-sm outline-none"
      :placeholder="model.length ? '' : t('cs_tags_ph')"
      @keydown="onKeydown"
      @blur="onBlur"
    >
  </div>
</template>
