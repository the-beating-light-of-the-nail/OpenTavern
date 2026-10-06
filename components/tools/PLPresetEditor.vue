<script setup lang="ts">
/**
 * 预设编辑器：进入时深拷贝 store 的 raw 作为本地工作副本，
 * 编辑就地改副本，deep watch → updatePreset(id, { raw: 深拷贝 })（store 内部防抖持久化）。
 * 三段布局：左栏 prompt_order（PLOrderList）+ 右栏 prompt 编辑器（PLPromptEditor）
 * 与采样/高级/宏/变量面板（PLInfoPanels）；桌面双栏，移动堆叠。
 * 导出 = downloadJson(<name>.json, raw)，未知字段原样保留（无损 round-trip）。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { downloadJson, safeFilename } from '~/utils/st/export';
import { isEditablePreset } from '~/utils/st/preset';
import type { PresetPrompt } from '~/utils/st/types';

const props = defineProps<{ presetId: string }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const toolbox = useToolboxStore();
const { t } = useI18n();

const rec = computed(() => toolbox.presetById(props.presetId));

// 本地工作副本：所有编辑先落在这份深拷贝上
const raw = ref<Record<string, any>>(JSON.parse(JSON.stringify(rec.value?.raw ?? {})));

// 编辑即保存：任何深层变更 → 深拷贝写回 store（内部防抖持久化）
watch(
  raw,
  () => {
    toolbox.updatePreset(props.presetId, { raw: JSON.parse(JSON.stringify(raw.value)) });
  },
  { deep: true },
);

/* ------------------------------ 选中 prompt ------------------------------ */

const selectedId = ref<string | null>(null);
const selectedPrompt = computed<PresetPrompt | null>(() => {
  if (!selectedId.value) return null;
  return (Array.isArray(raw.value?.prompts) ? raw.value.prompts : []).find(
    (p) => p?.identifier === selectedId.value,
  ) || null;
});

function onSelect(identifier: string) {
  selectedId.value = identifier || null;
}

/* ------------------------------ 导出 ------------------------------ */

function exportPreset() {
  // store 的 raw 与工作副本同步；直接导出工作副本（含全部未知字段）
  downloadJson(`${safeFilename(rec.value?.name || 'preset')}.json`, JSON.parse(JSON.stringify(raw.value)));
}
</script>

<template>
  <div v-if="rec">
    <!-- 顶栏 -->
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="emit('close')">← {{ t('pl_back_lib') }}</button>
      <span class="min-w-0 truncate text-sm font-semibold">{{ rec.name || t('pl_unnamed') }}</span>
      <span
        v-if="!isEditablePreset(raw)"
        class="rounded bg-rose-tint px-1.5 py-0.5 text-[11px] font-bold text-plum-muted"
      >{{ t('pl_raw_badge') }}</span>
      <button type="button" class="ui-button ui-button-primary ui-button-sm ml-auto" @click="exportPreset">⇩ {{ t('pl_export') }}</button>
    </div>

    <!-- 三段布局：左 order / 右 prompt 编辑 + 面板 -->
    <div class="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
      <PLOrderList :raw="raw" :selected-id="selectedId" @select="onSelect" />

      <div class="min-w-0 space-y-4">
        <PLPromptEditor
          v-if="selectedId && selectedPrompt"
          :raw="raw"
          :identifier="selectedId"
          @select="onSelect"
        />
        <div v-else class="rounded-xl border border-dashed border-border p-8 text-center text-sm text-plum-muted">
          {{ t('pl_no_selection') }}
        </div>

        <PLInfoPanels :raw="raw" />
      </div>
    </div>
  </div>
</template>
