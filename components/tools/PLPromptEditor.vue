<script setup lang="ts">
/**
 * 预设编辑器右栏：选中 prompt 的字段编辑器。
 * - identifier（marker / system_prompt 项只读；改名同步所有 order 分组里的引用）
 * - name / role / content（ToolMacroTextarea 带宏自动补全）
 * - system_prompt / marker 开关；marker 时隐藏内容区显示提示
 * - injection_position 0 相对 / 1 绝对；绝对时显示 depth + order 数字输入
 * - 操作：复制 prompt（连带插入 order）、删除（从 prompts + 所有 order 移除，确认框）
 */
import { ensurePresetArrays, genPromptIdentifier } from '~/utils/st/preset';
import type { PresetPrompt } from '~/utils/st/types';

const props = defineProps<{
  raw: Record<string, any>;
  /** 选中 prompt 的 identifier */
  identifier: string;
}>();

const emit = defineEmits<{ (e: 'select', identifier: string): void }>();

const ui = useUiStore();
const { t } = useI18n();

const prompt = computed<PresetPrompt | null>(
  () => (props.raw?.prompts || []).find((p: PresetPrompt) => p?.identifier === props.identifier) || null,
);

const readonlyId = computed(() => !!prompt.value && (!!prompt.value.marker || !!prompt.value.system_prompt));

/* ------------------------------ identifier / name / content ------------------------------ */

const idModel = ref(props.identifier);
watch(
  () => props.identifier,
  (v) => { idModel.value = v; },
);

/** 提交 identifier 改名：同步所有 order 分组里的引用，选中态跟随 */
function commitIdentifier() {
  const p = prompt.value;
  if (!p || readonlyId.value) {
    if (p) idModel.value = p.identifier;
    return;
  }
  const v = idModel.value.trim();
  if (!v || v === p.identifier) {
    idModel.value = p.identifier;
    return;
  }
  const dup = (props.raw?.prompts || []).some((x: PresetPrompt) => x !== p && x?.identifier === v);
  if (dup) {
    idModel.value = p.identifier;
    ui.showDialog({ message: t('pl_identifier_dup'), showCancel: false });
    return;
  }
  const old = p.identifier;
  p.identifier = v;
  for (const g of props.raw?.prompt_order || []) {
    for (const it of g?.order || []) {
      if (it?.identifier === old) it.identifier = v;
    }
  }
  emit('select', v);
}

const nameModel = computed<string>({
  get: () => (typeof prompt.value?.name === 'string' ? prompt.value.name : ''),
  set: (v) => { if (prompt.value) prompt.value.name = v; },
});

const contentModel = computed<string>({
  get: () => (typeof prompt.value?.content === 'string' ? prompt.value.content : ''),
  set: (v) => { if (prompt.value) prompt.value.content = v; },
});

/** 绝对注入的数字字段：空值/非法中间态不写入，保持原值 */
function setPromptNum(key: 'injection_depth' | 'injection_order', e: Event) {
  const p = prompt.value;
  if (!p) return;
  const v = (e.target as HTMLInputElement).value.trim();
  if (v === '' || !Number.isFinite(Number(v))) return;
  p[key] = Number(v);
}

/* ------------------------------ 复制 / 删除 ------------------------------ */

function duplicatePrompt() {
  const p = prompt.value;
  if (!p) return;
  ensurePresetArrays(props.raw);
  const list: PresetPrompt[] = props.raw.prompts;
  const idx = list.indexOf(p);
  const copy: PresetPrompt = JSON.parse(JSON.stringify(p));
  copy.identifier = genPromptIdentifier(list.map((x) => x?.identifier));
  if (typeof p.name === 'string' && p.name) copy.name = `${p.name} (${t('pl_copy_suffix')})`;
  list.splice(idx + 1, 0, copy);
  // 在包含原 prompt 的每个分组里，紧跟原位置插入启用项，保证副本可被发送
  for (const g of props.raw?.prompt_order || []) {
    if (!Array.isArray(g?.order)) continue;
    const at = g.order.findIndex((it: { identifier: string }) => it?.identifier === p.identifier);
    if (at >= 0) g.order.splice(at + 1, 0, { identifier: copy.identifier, enabled: true });
  }
  emit('select', copy.identifier);
}

async function deletePrompt() {
  const p = prompt.value;
  if (!p) return;
  const ok = await ui.showDialog({
    message: t('pl_delete_confirm', { name: p.name || p.identifier }),
    showCancel: true,
    danger: true,
  });
  if (!ok) return;
  const list: PresetPrompt[] = props.raw.prompts;
  const i = list.indexOf(p);
  if (i >= 0) list.splice(i, 1);
  // 从所有 order 分组里移除引用
  for (const g of props.raw?.prompt_order || []) {
    if (!Array.isArray(g?.order)) continue;
    g.order = g.order.filter((it: { identifier: string }) => it?.identifier !== p.identifier);
  }
  emit('select', '');
}
</script>

<template>
  <div v-if="prompt" class="rounded-xl border border-border bg-surface-soft">
    <!-- 头部：名称 + 操作 -->
    <div class="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
      <h3 class="min-w-0 truncate text-sm font-bold">📝 {{ nameModel || identifier }}</h3>
      <span v-if="prompt.marker" class="rounded bg-rose-tint px-1.5 py-0.5 text-[11px] font-semibold text-plum-muted">📍 {{ t('pl_f_marker') }}</span>
      <span class="ml-auto flex shrink-0 gap-1">
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" @click="duplicatePrompt">⧉ {{ t('pl_duplicate') }}</button>
        <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" @click="deletePrompt">🗑 {{ t('pl_delete') }}</button>
      </span>
    </div>

    <div class="space-y-3 px-4 py-3">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToolField :label="t('pl_f_identifier')" :hint="readonlyId ? t('pl_f_identifier_ro') : ''">
          <input
            v-model="idModel"
            type="text"
            class="ui-input w-full font-mono text-sm"
            :class="{ 'opacity-60': readonlyId }"
            :readonly="readonlyId"
            @change="commitIdentifier"
          >
        </ToolField>
        <ToolField :label="t('pl_f_name')">
          <input v-model="nameModel" type="text" class="ui-input w-full">
        </ToolField>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ToolField :label="t('pl_f_role')">
          <select
            class="ui-input w-auto text-sm"
            :value="prompt.role || 'system'"
            @change="prompt.role = ($event.target as HTMLSelectElement).value as PresetPrompt['role']"
          >
            <option value="system">{{ t('pl_role_system') }}</option>
            <option value="user">{{ t('pl_role_user') }}</option>
            <option value="assistant">{{ t('pl_role_assistant') }}</option>
          </select>
        </ToolField>
        <ToolField :label="t('pl_f_injection')">
          <select
            class="ui-input w-auto text-sm"
            :value="prompt.injection_position ?? 0"
            @change="prompt.injection_position = Number(($event.target as HTMLSelectElement).value)"
          >
            <option :value="0">{{ t('pl_inj_relative') }}</option>
            <option :value="1">{{ t('pl_inj_absolute') }}</option>
          </select>
        </ToolField>
      </div>

      <!-- 绝对注入：深度 + 排序 -->
      <div v-if="(prompt.injection_position ?? 0) === 1" class="grid grid-cols-2 gap-3">
        <ToolField :label="t('pl_f_depth')">
          <input type="number" class="ui-input w-full" :value="prompt.injection_depth ?? ''" @change="setPromptNum('injection_depth', $event)">
        </ToolField>
        <ToolField :label="t('pl_f_order')">
          <input type="number" class="ui-input w-full" :value="prompt.injection_order ?? ''" @change="setPromptNum('injection_order', $event)">
        </ToolField>
      </div>

      <div class="flex flex-wrap gap-x-5 gap-y-2">
        <label class="flex items-center gap-1.5 text-sm">
          <input v-model="prompt.system_prompt" type="checkbox" class="accent-rose-deep">
          {{ t('pl_f_system_prompt') }}
        </label>
        <label class="flex items-center gap-1.5 text-sm">
          <input v-model="prompt.marker" type="checkbox" class="accent-rose-deep">
          {{ t('pl_f_marker') }}
        </label>
      </div>

      <!-- marker 项没有正文：显示提示 -->
      <ToolField v-if="!prompt.marker" :label="t('pl_f_content')">
        <ToolMacroTextarea v-model="contentModel" :rows="8" />
      </ToolField>
      <p v-else class="rounded-lg border border-dashed border-border p-3 text-xs leading-relaxed text-plum-muted">
        {{ t('pl_marker_hint') }}
      </p>
    </div>
  </div>
</template>
