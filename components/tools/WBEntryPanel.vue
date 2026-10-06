<script setup lang="ts">
/**
 * 世界书条目编辑面板：基本组（关键词/内容/位置/开关）+ 进阶组（details 折叠）。
 * 直接绑定 props.entry（store 内对象）；持久化由父级 WBEditor 的深 watch 快照统一处理。
 */
import type { WorldInfoEntry } from '~/utils/st/types';
import { WI_LOGIC, WI_POSITION, WI_ROLE } from '~/utils/st/types';

const props = defineProps<{ entry: WorldInfoEntry }>();

const { t } = useI18n();

// 导入的旧数据可能缺数组字段，先补齐再交给 ToolTagInput
if (!Array.isArray(props.entry.key)) props.entry.key = [];
if (!Array.isArray(props.entry.keysecondary)) props.entry.keysecondary = [];

const positions = computed(() =>
  [
    WI_POSITION.BEFORE_CHAR,
    WI_POSITION.AFTER_CHAR,
    WI_POSITION.AN_TOP,
    WI_POSITION.AN_BOTTOM,
    WI_POSITION.AT_DEPTH,
    WI_POSITION.EM_TOP,
    WI_POSITION.EM_BOTTOM,
  ].map((v) => ({ v, label: t(`wb_pos_${v}`) })),
);

const logics = computed(() =>
  [WI_LOGIC.AND_ANY, WI_LOGIC.NOT_ALL, WI_LOGIC.NOT_ANY, WI_LOGIC.AND_ALL].map((v) => ({ v, label: t(`wb_logic_${v}`) })),
);

const roles = computed(() =>
  [WI_ROLE.SYSTEM, WI_ROLE.USER, WI_ROLE.ASSISTANT].map((v) => ({ v, label: t(`wb_role_${v}`) })),
);

/** 切到「按深度注入」时补上默认 role（ST 语义：null = system） */
watch(
  () => props.entry.position,
  (v) => {
    if (v === WI_POSITION.AT_DEPTH && props.entry.role == null) props.entry.role = WI_ROLE.SYSTEM;
  },
);

/** 副关键词非空时自动带上 selective（与 CardEditor 行为一致） */
const secondaryModel = computed<string[]>({
  get: () => props.entry.keysecondary ?? [],
  set: (v) => {
    props.entry.keysecondary = v;
    if (v.length) props.entry.selective = true;
  },
});

/** 可空数字（scanDepth/sticky/cooldown/delay）：留空 → null */
function onNullableNumber(e: Event, key: 'scanDepth' | 'sticky' | 'cooldown' | 'delay') {
  const v = (e.target as HTMLInputElement).value;
  props.entry[key] = v === '' ? null : Number(v);
}

/** 三态开关：'' = 跟随全局（null）/ true / false */
function triValue(v: boolean | null | undefined): string {
  return v === true ? 'true' : v === false ? 'false' : '';
}

function onTriChange(e: Event, key: 'caseSensitive' | 'matchWholeWords' | 'useGroupScoring') {
  const v = (e.target as HTMLSelectElement).value;
  props.entry[key] = v === '' ? null : v === 'true';
}
</script>

<template>
  <div class="space-y-3 border-t border-border p-3">
    <!-- 标题 + 顺序 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <ToolField :label="t('wb_f_comment')">
        <input v-model="entry.comment" type="text" class="ui-input w-full" :placeholder="t('wb_f_comment_ph')">
      </ToolField>
      <ToolField :label="t('wb_f_order')">
        <input v-model.number="entry.order" type="number" class="ui-input w-full">
      </ToolField>
    </div>

    <!-- 关键词 -->
    <ToolField :label="t('wb_f_key')" :hint="t('wb_f_key_hint')">
      <ToolTagInput v-model="entry.key" />
    </ToolField>
    <ToolField :label="t('wb_f_keysecondary')" :hint="t('wb_f_keysecondary_hint')">
      <ToolTagInput v-model="secondaryModel" />
    </ToolField>

    <!-- 内容 -->
    <ToolField :label="t('wb_f_content')">
      <textarea v-model="entry.content" rows="5" class="ui-input block w-full resize-y" :placeholder="t('wb_f_content_ph')"></textarea>
    </ToolField>

    <!-- 位置 / 逻辑 / 深度 -->
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <ToolField :label="t('wb_f_position')">
        <select v-model.number="entry.position" class="ui-input w-full text-sm">
          <option v-for="p in positions" :key="p.v" :value="p.v">{{ p.label }}</option>
        </select>
      </ToolField>
      <ToolField :label="t('wb_f_selectiveLogic')">
        <select v-model.number="entry.selectiveLogic" class="ui-input w-full text-sm">
          <option v-for="l in logics" :key="l.v" :value="l.v">{{ l.label }}</option>
        </select>
      </ToolField>
      <div v-if="entry.position === WI_POSITION.AT_DEPTH" class="grid grid-cols-2 gap-3">
        <ToolField :label="t('wb_f_depth')">
          <input v-model.number="entry.depth" type="number" min="0" class="ui-input w-full">
        </ToolField>
        <ToolField :label="t('wb_f_role')">
          <select v-model.number="entry.role" class="ui-input w-full text-sm">
            <option v-for="r in roles" :key="r.v" :value="r.v">{{ r.label }}</option>
          </select>
        </ToolField>
      </div>
    </div>

    <!-- 常用开关 -->
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <label class="flex items-center gap-1.5 text-sm">
        <input v-model="entry.constant" type="checkbox" class="accent-rose-deep">{{ t('wb_constant') }}
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <input v-model="entry.selective" type="checkbox" class="accent-rose-deep">{{ t('wb_f_selective') }}
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <input v-model="entry.disable" type="checkbox" class="accent-rose-deep">{{ t('wb_disabled') }}
      </label>
    </div>

    <!-- 进阶（折叠） -->
    <details class="rounded-lg border border-border bg-surface-soft px-3 py-2">
      <summary class="cursor-pointer select-none text-sm font-semibold">{{ t('wb_adv_title') }}</summary>
      <div class="mt-3 space-y-3">
        <!-- 概率 / 分组 -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ToolField :label="t('wb_f_probability')">
            <input v-model.number="entry.probability" type="number" min="0" max="100" class="ui-input w-full">
          </ToolField>
          <ToolField :label="t('wb_f_group')">
            <input v-model="entry.group" type="text" class="ui-input w-full">
          </ToolField>
          <ToolField :label="t('wb_f_groupWeight')">
            <input v-model.number="entry.groupWeight" type="number" min="0" max="100" class="ui-input w-full">
          </ToolField>
        </div>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.useProbability" type="checkbox" class="accent-rose-deep">{{ t('wb_f_useProbability') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.groupOverride" type="checkbox" class="accent-rose-deep">{{ t('wb_f_groupOverride') }}
          </label>
        </div>

        <!-- 递归 -->
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.excludeRecursion" type="checkbox" class="accent-rose-deep">{{ t('wb_f_excludeRecursion') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.preventRecursion" type="checkbox" class="accent-rose-deep">{{ t('wb_f_preventRecursion') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.delayUntilRecursion" type="checkbox" class="accent-rose-deep">{{ t('wb_f_delayUntilRecursion') }}
          </label>
        </div>

        <!-- 扫描行为：可空数字 + 三态开关（null = 跟随全局） -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ToolField :label="t('wb_f_scanDepth')">
            <input :value="entry.scanDepth ?? ''" type="number" min="0" class="ui-input w-full" @input="onNullableNumber($event, 'scanDepth')">
          </ToolField>
          <ToolField :label="t('wb_f_caseSensitive')">
            <select :value="triValue(entry.caseSensitive)" class="ui-input w-full text-sm" @change="onTriChange($event, 'caseSensitive')">
              <option value="">{{ t('wb_tri_default') }}</option>
              <option value="true">{{ t('wb_tri_on') }}</option>
              <option value="false">{{ t('wb_tri_off') }}</option>
            </select>
          </ToolField>
          <ToolField :label="t('wb_f_matchWholeWords')">
            <select :value="triValue(entry.matchWholeWords)" class="ui-input w-full text-sm" @change="onTriChange($event, 'matchWholeWords')">
              <option value="">{{ t('wb_tri_default') }}</option>
              <option value="true">{{ t('wb_tri_on') }}</option>
              <option value="false">{{ t('wb_tri_off') }}</option>
            </select>
          </ToolField>
          <ToolField :label="t('wb_f_useGroupScoring')">
            <select :value="triValue(entry.useGroupScoring)" class="ui-input w-full text-sm" @change="onTriChange($event, 'useGroupScoring')">
              <option value="">{{ t('wb_tri_default') }}</option>
              <option value="true">{{ t('wb_tri_on') }}</option>
              <option value="false">{{ t('wb_tri_off') }}</option>
            </select>
          </ToolField>
        </div>

        <!-- 计时器 / 自动化 -->
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <ToolField :label="t('wb_f_sticky')">
            <input :value="entry.sticky ?? ''" type="number" min="0" class="ui-input w-full" @input="onNullableNumber($event, 'sticky')">
          </ToolField>
          <ToolField :label="t('wb_f_cooldown')">
            <input :value="entry.cooldown ?? ''" type="number" min="0" class="ui-input w-full" @input="onNullableNumber($event, 'cooldown')">
          </ToolField>
          <ToolField :label="t('wb_f_delay')">
            <input :value="entry.delay ?? ''" type="number" min="0" class="ui-input w-full" @input="onNullableNumber($event, 'delay')">
          </ToolField>
          <ToolField :label="t('wb_f_automationId')">
            <input v-model="entry.automationId" type="text" class="ui-input w-full">
          </ToolField>
        </div>

        <!-- 扫描来源 -->
        <div class="grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.matchPersonaDescription" type="checkbox" class="accent-rose-deep">{{ t('wb_f_m_persona') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.matchCharacterDescription" type="checkbox" class="accent-rose-deep">{{ t('wb_f_m_chardesc') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.matchCharacterPersonality" type="checkbox" class="accent-rose-deep">{{ t('wb_f_m_personality') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.matchCharacterDepthPrompt" type="checkbox" class="accent-rose-deep">{{ t('wb_f_m_depthprompt') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.matchScenario" type="checkbox" class="accent-rose-deep">{{ t('wb_f_m_scenario') }}
          </label>
          <label class="flex items-center gap-1.5 text-sm">
            <input v-model="entry.matchCreatorNotes" type="checkbox" class="accent-rose-deep">{{ t('wb_f_m_notes') }}
          </label>
        </div>
      </div>
    </details>
  </div>
</template>
