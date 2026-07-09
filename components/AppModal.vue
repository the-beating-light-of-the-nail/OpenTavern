<script setup lang="ts">
import { useUiStore, type ModalName } from '~/stores/ui';

const props = withDefaults(defineProps<{
  /** 对应原版外层 modal-overlay 的 id（命中 CSS 主题规则，如 worldBookModal） */
  modalId?: string;
  /** 在 ui store 中的模态名，默认用 modalId */
  name?: ModalName;
  /** 是否显示右上角关闭按钮 */
  closable?: boolean;
  /** 点背景是否关闭 */
  backdropClose?: boolean;
  /** 容器最大宽度 class，如 'max-w-lg' */
  maxWidth?: string;
  /** 是否强制全屏样式（worldBook 移动端） */
  flush?: boolean;
}>(), {
  closable: true,
  backdropClose: true,
  maxWidth: 'max-w-lg',
  flush: false,
});

const ui = useUiStore();
const name = computed(() => (props.name || (props.modalId as ModalName)) as ModalName);
const isOpen = computed(() => ui.isOpen(name.value));

function close() {
  ui.close(name.value);
}
function onBackdrop() {
  if (props.backdropClose) close();
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) close();
}
onMounted(() => window.addEventListener('keydown', onKey));
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
  <div
    v-show="isOpen"
    :id="modalId"
    class="modal-overlay fixed inset-0 z-[100] flex items-center justify-center"
  >
    <div class="absolute inset-0 bg-black/65 backdrop-blur-sm" @click="onBackdrop" />
    <div
      class="relative glass rounded-3xl w-[92%] shadow-2xl animate-fade-in p-7 max-h-[90vh] overflow-y-auto"
      :class="[maxWidth, { '!rounded-none !w-full !max-w-none h-[100dvh] p-4': flush }]"
    >
      <slot :close="close" />
      <button
        v-if="closable"
        class="absolute top-4 right-4 w-8 h-8 rounded-full glass flex items-center justify-center text-zinc-400 hover:text-zinc-200 transition-colors"
        aria-label="Close"
        @click="close"
      >&times;</button>
    </div>
  </div>
</template>
