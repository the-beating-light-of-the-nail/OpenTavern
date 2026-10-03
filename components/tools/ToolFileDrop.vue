<script setup lang="ts">
/**
 * 文件投放区：拖拽 / 点击选择。emits files(File[])。
 * accept 例：".json,.png" / "image/*"；multiple 允许多选。
 */
const props = withDefaults(defineProps<{
  accept?: string;
  multiple?: boolean;
  compact?: boolean;
}>(), { accept: '.json,.png', multiple: false, compact: false });

const emit = defineEmits<{ (e: 'files', files: File[]): void }>();

const { t } = useI18n();
const dragging = ref(false);
const inputEl = ref<HTMLInputElement | null>(null);

function pick() {
  inputEl.value?.click();
}

function onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  deliver(input.files);
  input.value = '';
}

function deliver(list: FileList | null) {
  if (!list || !list.length) return;
  const files = Array.from(list);
  if (props.accept) {
    const exts = props.accept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
    const ok = files.filter((f) => {
      const name = f.name.toLowerCase();
      return exts.some((ext) => (ext.startsWith('.') ? name.endsWith(ext) : f.type.match(ext.replace(/\*/g, '.*'))));
    });
    if (ok.length) emit('files', ok);
    return;
  }
  emit('files', files);
}

function onDrop(e: DragEvent) {
  dragging.value = false;
  deliver(e.dataTransfer?.files ?? null);
}
</script>

<template>
  <div
    class="tool-drop"
    :class="{ 'tool-drop--drag': dragging, 'tool-drop--compact': compact }"
    role="button"
    tabindex="0"
    :aria-label="t('cs_drop_hint')"
    @click="pick"
    @keydown.enter.prevent="pick"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="onDrop"
  >
    <input ref="inputEl" type="file" :accept="accept" :multiple="multiple" class="hidden" @change="onInput">
    <div class="pointer-events-none flex flex-col items-center gap-1 text-center">
      <span class="text-xl leading-none" aria-hidden="true">⇪</span>
      <span class="text-sm font-semibold">{{ t('cs_drop_hint') }}</span>
      <span v-if="!compact" class="text-xs text-plum-muted">{{ t('cs_drop_local') }}</span>
    </div>
  </div>
</template>

<style scoped>
.tool-drop {
  cursor: pointer;
  border: 1.5px dashed var(--color-border-strong, var(--color-border));
  border-radius: 0.9rem;
  background: var(--color-surface);
  padding: 1.4rem 1rem;
  transition: border-color 0.15s ease, background 0.15s ease;
  outline: none;
}
.tool-drop:hover,
.tool-drop:focus-visible { border-color: var(--color-primary); }
.tool-drop--drag { border-color: var(--color-primary); background: color-mix(in srgb, var(--color-primary) 7%, var(--color-surface)); }
.tool-drop--compact { padding: 0.8rem 0.75rem; }
</style>
