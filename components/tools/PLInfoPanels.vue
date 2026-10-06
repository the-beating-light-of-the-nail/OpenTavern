<script setup lang="ts">
/**
 * 预设编辑器下方四个可折叠面板：
 * - 采样参数：SAMPLER_FIELDS 里已存在的键，网格化编辑（写入 raw 顶层）
 * - 高级（原始字段）：其余未知顶层键的键值对编辑（合法 JSON 按类型保存，其余按字符串）
 * - 宏分析：扫描全部 prompt.content 的 {{macro}}，去重计数 + 说明（MACROS 匹配）
 * - 变量：{{setvar}} / {{getvar}} / {{addvar}} 变量表（名称/初始值/被引用次数）
 */
import {
  SAMPLER_FIELDS,
  SAMPLER_KEYS,
  analyzePresetMacros,
  analyzePresetVariables,
} from '~/utils/st/preset';
import type { SamplerField } from '~/utils/st/preset';
import type { PresetPrompt } from '~/utils/st/types';

const props = defineProps<{ raw: Record<string, any> }>();

const ui = useUiStore();
const { t } = useI18n();

const prompts = computed<PresetPrompt[]>(() =>
  Array.isArray(props.raw?.prompts) ? props.raw.prompts : [],
);

const open = ref<Record<string, boolean>>({ sampler: true, advanced: false, macros: false, vars: false });

function toggle(key: keyof typeof open.value) {
  open.value[key] = !open.value[key];
}

/* ------------------------------ 采样参数 ------------------------------ */

const samplerFields = computed<SamplerField[]>(() =>
  SAMPLER_FIELDS.filter((f) => Object.prototype.hasOwnProperty.call(props.raw, f.key)),
);

/** 数字字段：空值/非法中间态不写入，保持原值（避免把字符串写进数字键） */
function setSamplerNumber(f: SamplerField, e: Event) {
  const v = (e.target as HTMLInputElement).value.trim();
  if (v === '' || !Number.isFinite(Number(v))) return;
  props.raw[f.key] = Number(v);
}

function setSamplerString(f: SamplerField, e: Event) {
  props.raw[f.key] = (e.target as HTMLInputElement).value;
}

/* ------------------------------ 高级（原始字段） ------------------------------ */

const advancedKeys = computed<string[]>(() =>
  Object.keys(props.raw || {}).filter(
    (k) => k !== 'prompts' && k !== 'prompt_order' && !SAMPLER_KEYS.has(k),
  ),
);

/** 非字符串值以 JSON 文本显示，字符串原样显示 */
function advDisplay(v: unknown): string {
  return typeof v === 'string' ? v : JSON.stringify(v) ?? '';
}

/** 合法 JSON 按解析类型保存，其余按纯字符串（保留用户输入） */
function setAdvanced(k: string, e: Event) {
  const text = (e.target as HTMLInputElement).value;
  if (typeof props.raw[k] === 'string') {
    props.raw[k] = text;
    return;
  }
  try {
    props.raw[k] = JSON.parse(text);
  } catch {
    props.raw[k] = text;
  }
}

async function delAdvanced(k: string) {
  const ok = await ui.showDialog({
    message: t('pl_advanced_del_confirm', { key: k }),
    showCancel: true,
    danger: true,
  });
  if (ok) delete props.raw[k];
}

const newKey = ref('');
const newVal = ref('');
const newKeyDup = ref(false);

function addAdvanced() {
  const k = newKey.value.trim();
  if (!k) return;
  if (Object.prototype.hasOwnProperty.call(props.raw, k) || k === 'prompts' || k === 'prompt_order' || SAMPLER_KEYS.has(k)) {
    newKeyDup.value = true;
    return;
  }
  newKeyDup.value = false;
  let v: unknown;
  try {
    v = JSON.parse(newVal.value);
  } catch {
    v = newVal.value;
  }
  props.raw[k] = v;
  newKey.value = '';
  newVal.value = '';
}

/* ------------------------------ 宏 / 变量 ------------------------------ */

const macros = computed(() => analyzePresetMacros(prompts.value));
const vars = computed(() => analyzePresetVariables(prompts.value));

/** 模板里安全渲染 {{token}}（避免与 Vue 插值冲突） */
function wrapMacro(rawToken: string): string {
  return `{{${rawToken}}}`;
}
</script>

<template>
  <div class="space-y-3">
    <!-- 采样参数 -->
    <section class="rounded-xl border border-border bg-surface-soft">
      <button
        type="button"
        class="flex w-full items-center gap-2 px-4 py-3 text-left"
        :aria-expanded="open.sampler"
        @click="toggle('sampler')"
      >
        <span class="text-sm font-bold">🎚️ {{ t('pl_sampler_title') }}</span>
        <span class="ml-auto text-xs text-plum-muted">{{ open.sampler ? '▾' : '▸' }}</span>
      </button>
      <div v-show="open.sampler" class="border-t border-border px-4 py-3">
        <p class="text-xs leading-relaxed text-plum-muted">{{ t('pl_sampler_hint') }}</p>
        <div v-if="samplerFields.length" class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="f in samplerFields" :key="f.key">
            <label class="mb-1 block text-xs font-semibold text-plum-light">{{ t(f.labelKey) }}</label>
            <input
              v-if="f.type === 'number'"
              type="number"
              step="any"
              class="ui-input ui-input-compact w-full text-sm"
              :value="raw[f.key] ?? ''"
              @change="setSamplerNumber(f, $event)"
            >
            <input
              v-else-if="f.type === 'string'"
              type="text"
              class="ui-input ui-input-compact w-full text-sm"
              :value="raw[f.key] ?? ''"
              @change="setSamplerString(f, $event)"
            >
            <label v-else class="mt-1 flex items-center gap-2 text-sm">
              <input v-model="raw[f.key]" type="checkbox" class="accent-rose-deep">
              <span class="text-plum-muted">{{ raw[f.key] ? '✓' : '✗' }}</span>
            </label>
          </div>
        </div>
        <p v-else class="mt-2 text-xs text-plum-muted">{{ t('pl_sampler_empty') }}</p>
      </div>
    </section>

    <!-- 高级（原始字段） -->
    <section class="rounded-xl border border-border bg-surface-soft">
      <button
        type="button"
        class="flex w-full items-center gap-2 px-4 py-3 text-left"
        :aria-expanded="open.advanced"
        @click="toggle('advanced')"
      >
        <span class="text-sm font-bold">🧬 {{ t('pl_advanced_title') }}</span>
        <span class="rounded bg-rose-tint px-1.5 py-0.5 text-[11px] font-semibold text-plum-muted">{{ advancedKeys.length }}</span>
        <span class="ml-auto text-xs text-plum-muted">{{ open.advanced ? '▾' : '▸' }}</span>
      </button>
      <div v-show="open.advanced" class="space-y-2 border-t border-border px-4 py-3">
        <p class="text-xs leading-relaxed text-plum-muted">{{ t('pl_advanced_note') }}</p>

        <p v-if="!advancedKeys.length" class="text-xs text-plum-muted">{{ t('pl_advanced_empty') }}</p>

        <div v-for="k in advancedKeys" :key="k" class="flex items-center gap-2">
          <code class="w-36 shrink-0 truncate rounded bg-rose-tint px-2 py-1.5 font-mono text-xs text-plum-light" :title="k">{{ k }}</code>
          <input
            type="text"
            class="ui-input ui-input-compact min-w-0 flex-1 font-mono text-xs"
            :value="advDisplay(raw[k])"
            @change="setAdvanced(k, $event)"
          >
          <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs shrink-0" :title="t('pl_advanced_del')" @click="delAdvanced(k)">×</button>
        </div>

        <!-- 新增字段 -->
        <div class="flex flex-wrap items-center gap-2 border-t border-border pt-2">
          <input v-model="newKey" type="text" class="ui-input ui-input-compact w-36 shrink-0 font-mono text-xs" :placeholder="t('pl_advanced_key_ph')">
          <input v-model="newVal" type="text" class="ui-input ui-input-compact min-w-0 flex-1 font-mono text-xs" :placeholder="t('pl_advanced_value_ph')" @keydown.enter.prevent="addAdvanced">
          <button type="button" class="ui-button ui-button-secondary ui-button-xs shrink-0" @click="addAdvanced">＋ {{ t('pl_advanced_add') }}</button>
        </div>
        <p v-if="newKeyDup" class="ui-alert-danger rounded-md px-2 py-1 text-xs">{{ t('pl_advanced_dup_key') }}</p>
      </div>
    </section>

    <!-- 宏分析 -->
    <section class="rounded-xl border border-border bg-surface-soft">
      <button
        type="button"
        class="flex w-full items-center gap-2 px-4 py-3 text-left"
        :aria-expanded="open.macros"
        @click="toggle('macros')"
      >
        <span class="text-sm font-bold">🧩 {{ t('pl_macro_title') }}</span>
        <span class="rounded bg-rose-tint px-1.5 py-0.5 text-[11px] font-semibold text-plum-muted">{{ macros.length }}</span>
        <span class="ml-auto text-xs text-plum-muted">{{ open.macros ? '▾' : '▸' }}</span>
      </button>
      <div v-show="open.macros" class="border-t border-border px-4 py-3">
        <p v-if="!macros.length" class="text-xs text-plum-muted">{{ t('pl_macro_empty') }}</p>
        <ul v-else class="space-y-1.5">
          <li
            v-for="m in macros"
            :key="m.raw"
            class="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-1.5"
          >
            <code class="font-mono text-xs text-rose-deep">{{ wrapMacro(m.raw) }}</code>
            <span class="ml-auto rounded bg-rose-tint px-1.5 py-0.5 text-[11px] font-semibold text-plum-muted">{{ t('pl_macro_count', { n: m.count }) }}</span>
            <span class="w-full text-xs text-plum-muted sm:w-auto sm:flex-1 sm:pl-2">
              {{ m.descKey ? t(m.descKey) : t('pl_macro_unknown') }}
            </span>
          </li>
        </ul>
      </div>
    </section>

    <!-- 变量 -->
    <section class="rounded-xl border border-border bg-surface-soft">
      <button
        type="button"
        class="flex w-full items-center gap-2 px-4 py-3 text-left"
        :aria-expanded="open.vars"
        @click="toggle('vars')"
      >
        <span class="text-sm font-bold">🔡 {{ t('pl_var_title') }}</span>
        <span class="rounded bg-rose-tint px-1.5 py-0.5 text-[11px] font-semibold text-plum-muted">{{ vars.length }}</span>
        <span class="ml-auto text-xs text-plum-muted">{{ open.vars ? '▾' : '▸' }}</span>
      </button>
      <div v-show="open.vars" class="border-t border-border px-4 py-3">
        <p v-if="!vars.length" class="text-xs text-plum-muted">{{ t('pl_var_empty') }}</p>
        <table v-else class="w-full text-sm">
          <thead>
            <tr class="text-left text-xs text-plum-muted">
              <th class="py-1 pr-3 font-semibold">{{ t('pl_var_name') }}</th>
              <th class="py-1 pr-3 font-semibold">{{ t('pl_var_init') }}</th>
              <th class="py-1 text-right font-semibold">{{ t('pl_var_refs') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in vars" :key="v.name" class="border-t border-border">
              <td class="py-1.5 pr-3 font-mono text-xs font-semibold text-plum-light">{{ v.name }}</td>
              <td class="py-1.5 pr-3 text-xs text-plum-muted">{{ v.init === null ? '—' : v.init }}</td>
              <td class="py-1.5 text-right text-xs text-plum-muted">{{ v.refs }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
