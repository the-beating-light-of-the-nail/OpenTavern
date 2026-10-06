<script setup lang="ts">
/**
 * 世界书条目行：批量复选框 + 拖拽手柄 + 摘要徽标（关键词/常量/禁用/位置）+ 展开/收起。
 * 编辑面板（WBEntryPanel）在展开时内联渲染；重排与删除事件全部上抛给 WBEditor 处理。
 */
import type { WorldInfoEntry } from '~/utils/st/types';

const props = defineProps<{
  entry: WorldInfoEntry;
  /** 展示序号（0 起） */
  index: number;
  batchMode: boolean;
  selected: boolean;
  expanded: boolean;
  /** 本行正在被拖拽 */
  dragging: boolean;
  /** 有其他行拖悬在本行上方 */
  dragOver: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
  (e: 'select'): void;
  (e: 'move', dir: -1 | 1): void;
  (e: 'remove'): void;
  (e: 'drag-start', ev: DragEvent): void;
  (e: 'drag-over', ev: DragEvent): void;
  (e: 'drop', ev: DragEvent): void;
  (e: 'drag-end'): void;
}>();

const { t } = useI18n();

const keysPreview = computed(() => (props.entry.key || []).slice(0, 3).join(' / '));
const extraKeys = computed(() => Math.max((props.entry.key || []).length - 3, 0));
</script>

<template>
  <div
    class="rounded-xl border bg-surface transition-colors"
    :class="[
      selected || dragOver ? 'border-rose-accent' : 'border-border',
      dragging ? 'opacity-40' : '',
      expanded && !(selected || dragOver) ? 'border-rose-accent/60' : '',
    ]"
    @dragover.prevent="emit('drag-over', $event)"
    @drop.prevent="emit('drop', $event)"
  >
    <!-- 摘要行 -->
    <div
      class="flex cursor-pointer flex-wrap items-center gap-2 p-3"
      role="button"
      tabindex="0"
      :aria-label="t('wb_toggle')"
      @click="batchMode ? emit('select') : emit('toggle')"
      @keydown.enter.prevent="batchMode ? emit('select') : emit('toggle')"
    >
      <!-- 批量选择 -->
      <span v-if="batchMode" class="flex items-center" @click.stop>
        <input
          type="checkbox"
          class="accent-rose-deep"
          :checked="selected"
          :aria-label="t('wb_batch')"
          @change="emit('select')"
        >
      </span>

      <!-- 拖拽手柄（只把手柄可拖，避免影响面板内文本选择） -->
      <span
        class="cursor-grab select-none px-1 text-plum-faint hover:text-rose-accent active:cursor-grabbing"
        draggable="true"
        :title="t('wb_drag_handle')"
        :aria-label="t('wb_drag_handle')"
        @dragstart.stop="emit('drag-start', $event)"
        @dragend.stop="emit('drag-end')"
      >⠿</span>

      <span class="text-xs font-bold text-plum-muted">#{{ index + 1 }}</span>
      <span class="truncate text-sm font-semibold">{{ entry.comment || t('wb_entry_untitled') }}</span>
      <span v-if="keysPreview" class="hidden truncate rounded bg-rose-tint px-1.5 py-0.5 text-[11px] text-plum-muted sm:inline">
        {{ keysPreview }}
      </span>
      <span v-if="extraKeys > 0" class="text-[11px] text-plum-faint">+{{ extraKeys }}</span>
      <span v-if="entry.constant" class="rounded bg-rose-deep/15 px-1.5 py-0.5 text-[11px] font-semibold text-rose-deep">🔵 {{ t('wb_constant') }}</span>
      <span v-if="entry.disable" class="rounded bg-border px-1.5 py-0.5 text-[11px] text-plum-muted">{{ t('wb_disabled') }}</span>
      <span class="hidden rounded border border-border-warm px-1.5 py-0.5 text-[11px] text-plum-muted sm:inline">{{ t(`wb_pos_${entry.position}`) }}</span>

      <span class="ml-auto flex gap-1" @click.stop>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" :aria-label="t('wb_move_up')" @click="emit('move', -1)">↑</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" :aria-label="t('wb_move_down')" @click="emit('move', 1)">↓</button>
        <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" :aria-label="t('wb_del_entry')" @click="emit('remove')">🗑</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" :aria-label="t('wb_toggle')" @click="emit('toggle')">{{ expanded ? '▴' : '▾' }}</button>
      </span>
    </div>

    <!-- 展开编辑面板 -->
    <WBEntryPanel v-if="expanded" :entry="entry" />
  </div>
</template>
