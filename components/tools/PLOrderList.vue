<script setup lang="ts">
/**
 * 预设编辑器左栏：prompt_order 可视化编排。
 * - 顶部 character_id 分组 tabs（ST 通常 100001 默认 / 100000 群聊）
 * - 有序列表：原生 HTML5 拖拽排序 + ↑↓ 按钮兜底、enabled 复选框
 * - 标识符在 prompts 里不存在的项显示为「缺失」灰项，点击可创建对应 prompt
 * - 底部 ＋ 新增 prompt（同时写入 prompts + 当前分组 order）
 * 所有修改直接就地变更 props.raw（编辑器统一 deep watch → updatePreset）。
 */
import { ensurePresetArrays, genPromptIdentifier, moveArrayItem } from '~/utils/st/preset';
import type { PresetPrompt, PromptOrderGroup, PromptOrderItem } from '~/utils/st/types';

const props = defineProps<{
  /** 工作副本 raw（编辑器持有的深拷贝，直接变更） */
  raw: Record<string, any>;
  /** 当前选中 prompt 的 identifier（高亮用） */
  selectedId: string | null;
}>();

const emit = defineEmits<{ (e: 'select', identifier: string): void }>();

const { t } = useI18n();

const groups = computed<PromptOrderGroup[]>(() =>
  Array.isArray(props.raw?.prompt_order) ? props.raw.prompt_order : [],
);
const prompts = computed<PresetPrompt[]>(() =>
  Array.isArray(props.raw?.prompts) ? props.raw.prompts : [],
);

/* ------------------------------ 分组 tabs ------------------------------ */

const activeIdx = ref(0);
watch(
  () => groups.value.length,
  (n) => {
    if (activeIdx.value >= n) activeIdx.value = Math.max(n - 1, 0);
  },
);

const activeGroup = computed<PromptOrderGroup | null>(
  () => groups.value[Math.min(activeIdx.value, Math.max(groups.value.length - 1, 0))] || null,
);

function addGroup() {
  ensurePresetArrays(props.raw);
  props.raw.prompt_order.push({ character_id: 100001, order: [] });
  activeIdx.value = props.raw.prompt_order.length - 1;
}

/* ------------------------------ 顺序列表 ------------------------------ */

interface OrderRow {
  item: PromptOrderItem;
  idx: number;
  prompt: PresetPrompt | null;
}

const rows = computed<OrderRow[]>(() => {
  const order = activeGroup.value?.order;
  if (!Array.isArray(order)) return [];
  const byId = new Map<string, PresetPrompt>();
  for (const p of prompts.value) {
    if (p && typeof p.identifier === 'string') byId.set(p.identifier, p);
  }
  return order.map((item, idx) => ({
    item,
    idx,
    prompt: typeof item?.identifier === 'string' ? byId.get(item.identifier) || null : null,
  }));
});

function rowCls(row: OrderRow): string {
  const cls: string[] = [];
  if (row.idx === dragOver.value && dragFrom.value !== null && dragFrom.value !== row.idx) {
    cls.push('border-primary');
  } else if (row.prompt && row.item.identifier === props.selectedId) {
    cls.push('border-primary bg-rose-tint');
  } else {
    cls.push('border-border bg-surface');
  }
  if (!row.prompt) cls.push('border-dashed opacity-60');
  return cls.join(' ');
}

function onRowClick(row: OrderRow) {
  if (row.prompt) {
    emit('select', row.item.identifier);
    return;
  }
  // 缺失项：点击创建对应 prompt（最小骨架），并选中它
  if (typeof row.item?.identifier !== 'string' || !row.item.identifier) return;
  ensurePresetArrays(props.raw);
  props.raw.prompts.push({
    identifier: row.item.identifier,
    name: '',
    role: 'system',
    content: '',
    system_prompt: false,
    marker: false,
  });
  emit('select', row.item.identifier);
}

/* ------------------------------ 拖拽 / 排序 ------------------------------ */

const dragFrom = ref<number | null>(null);
const dragOver = ref<number | null>(null);

function onDragStart(idx: number, e: DragEvent) {
  dragFrom.value = idx;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  }
}

function onDragOver(idx: number, e: DragEvent) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  dragOver.value = idx;
}

function onDrop(idx: number, e: DragEvent) {
  e.preventDefault();
  const from = dragFrom.value;
  clearDrag();
  if (from === null || from === idx) return;
  const order = activeGroup.value?.order;
  if (!Array.isArray(order)) return;
  moveArrayItem(order, from, idx);
}

function clearDrag() {
  dragFrom.value = null;
  dragOver.value = null;
}

/** ↑↓ 按钮兜底排序 */
function moveRow(idx: number, dir: -1 | 1) {
  const order = activeGroup.value?.order;
  if (!Array.isArray(order)) return;
  moveArrayItem(order, idx, idx + dir);
}

/* ------------------------------ 新增 prompt ------------------------------ */

function addPrompt() {
  ensurePresetArrays(props.raw);
  const id = genPromptIdentifier(prompts.value.map((p) => p?.identifier));
  props.raw.prompts.push({
    identifier: id,
    name: t('pl_new_prompt_name'),
    role: 'system',
    content: '',
    system_prompt: false,
    marker: false,
  });
  const group = activeGroup.value;
  if (group) {
    if (!Array.isArray(group.order)) group.order = [];
    group.order.push({ identifier: id, enabled: true });
  }
  emit('select', id);
}
</script>

<template>
  <div class="rounded-xl border border-border bg-surface-soft self-start">
    <h3 class="px-3 pt-3 text-sm font-bold">🔀 {{ t('pl_order_title') }}</h3>

    <!-- character_id 分组 tabs -->
    <div v-if="groups.length" class="flex flex-wrap items-center gap-1 px-3 pt-2">
      <button
        v-for="(g, gi) in groups"
        :key="gi"
        type="button"
        class="ui-chip ui-chip-sm"
        :class="{ active: gi === activeIdx }"
        :aria-label="t('pl_group_aria', { n: g?.character_id ?? '—' })"
        @click="activeIdx = gi"
      >{{ g?.character_id ?? '—' }}</button>
    </div>

    <div class="p-3">
      <!-- 无分组：提示 + 建默认分组 -->
      <div v-if="!groups.length" class="rounded-lg border border-dashed border-border p-4 text-center">
        <p class="text-xs leading-relaxed text-plum-muted">{{ t('pl_order_empty') }}</p>
        <button type="button" class="ui-button ui-button-secondary ui-button-xs mt-2" @click="addGroup">＋ {{ t('pl_add_group') }}</button>
      </div>

      <template v-else>
        <p v-if="!rows.length" class="rounded-lg border border-dashed border-border p-3 text-center text-xs text-plum-muted">
          {{ t('pl_order_hint') }}
        </p>

        <ul v-else class="space-y-1.5">
          <li
            v-for="row in rows"
            :key="(row.item.identifier || '?') + '-' + row.idx"
            draggable="true"
            class="flex cursor-grab select-none items-center gap-2 rounded-lg border px-2 py-1.5 text-sm transition-colors"
            :class="rowCls(row)"
            :title="row.prompt ? row.item.identifier : ''"
            @click="onRowClick(row)"
            @dragstart="onDragStart(row.idx, $event)"
            @dragover="onDragOver(row.idx, $event)"
            @drop.prevent="onDrop(row.idx, $event)"
            @dragend="clearDrag"
          >
            <span class="cursor-grab text-xs leading-none text-plum-faint" aria-hidden="true">⠿</span>
            <input
              v-model="row.item.enabled"
              type="checkbox"
              class="accent-rose-deep"
              :aria-label="t('pl_enabled')"
              @click.stop
            >
            <span class="min-w-0 flex-1 truncate">
              <template v-if="row.prompt">{{ row.prompt.name || row.item.identifier }}</template>
              <template v-else><span class="italic text-plum-muted">{{ row.item.identifier || '—' }}</span> · {{ t('pl_order_missing') }}</template>
            </span>
            <span v-if="row.prompt?.marker" :title="t('pl_f_marker')" aria-hidden="true">📍</span>
            <span class="flex gap-0.5" @click.stop>
              <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="row.idx === 0" :aria-label="t('pl_move_up')" @click="moveRow(row.idx, -1)">↑</button>
              <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="row.idx === rows.length - 1" :aria-label="t('pl_move_down')" @click="moveRow(row.idx, 1)">↓</button>
            </span>
          </li>
        </ul>

        <button type="button" class="ui-button ui-button-secondary ui-button-sm mt-3 w-full" @click="addPrompt">＋ {{ t('pl_add_prompt') }}</button>
      </template>
    </div>
  </div>
</template>
