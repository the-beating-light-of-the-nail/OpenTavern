<script setup lang="ts">
/**
 * 单卡编辑器：全字段表单（V1 六项 + V2 元字段 + V3 增强）+ 头像 + 宏补全 + AI 逐字段写作 +
 * 完整度评分 + 导出（V2/V3 JSON、PNG 双写、独立世界书）+ 卡内世界书内联编辑。
 * 直接变更 store 内 record.raw（含未知字段无损），deep watch 触发防抖持久化。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { detectCardSpec } from '~/utils/st/convert';
import { fileToPngDataUrl } from '~/utils/st/png';
import { exportCardJson, exportCardPng, exportCardWorldbook } from '~/utils/st/export';
import { scoreCard } from '~/utils/st/score';
import type { CardBook, CardBookEntry } from '~/utils/st/types';

const props = defineProps<{ cardId: string }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const toolbox = useToolboxStore();
const ui = useUiStore();
const { t } = useI18n();

const rec = computed(() => toolbox.cardById(props.cardId));

// 任意嵌套字段变更 → 防抖持久化
watch(rec, (r) => { if (r) toolbox.persist(); }, { deep: true });

const tagsModel = computed<string[]>({
  get: () => rec.value?.raw.data.tags ?? [],
  set: (v) => { if (rec.value) rec.value.raw.data.tags = v; },
});

function aiCtx() {
  return rec.value!.raw.data;
}

const specBadge = computed(() => {
  const spec = detectCardSpec(rec.value?.raw);
  return spec === 'v3' ? 'V3' : spec === 'v2' ? 'V2' : spec === 'v1' ? 'V1' : '—';
});

/* ------------------------------ 头像 ------------------------------ */

const avatarInput = ref<HTMLInputElement | null>(null);

async function onAvatarInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = '';
  if (!file) return;
  try {
    const dataUrl = await fileToPngDataUrl(file);
    toolbox.updateCard(props.cardId, undefined, dataUrl);
  } catch {
    await ui.showDialog({ message: t('cs_avatar_error'), showCancel: false });
  }
}

function removeAvatar() {
  toolbox.updateCard(props.cardId, undefined, null);
}

/* ------------------------------ Tabs ------------------------------ */

type Tab = 'basic' | 'dialog' | 'advanced' | 'book';
const tab = ref<Tab>('basic');
const tabs = computed(() => [
  { id: 'basic' as Tab, label: t('cs_tab_basic') },
  { id: 'dialog' as Tab, label: t('cs_tab_dialog') },
  { id: 'advanced' as Tab, label: t('cs_tab_advanced') },
  { id: 'book' as Tab, label: t('cs_tab_book') },
]);

/** 进入世界书 tab 时确保 character_book 存在 */
function ensureBook(): CardBook {
  const data = rec.value!.raw.data;
  if (!data.character_book || !Array.isArray(data.character_book.entries)) {
    data.character_book = { extensions: {}, entries: [] };
  }
  return data.character_book;
}

watch(tab, (v) => { if (v === 'book') ensureBook(); });

/* ------------------------------ 备用开场白 ------------------------------ */

const agList = computed(() => rec.value?.raw.data.alternate_greetings || []);

function addAg() {
  const data = rec.value!.raw.data;
  if (!Array.isArray(data.alternate_greetings)) data.alternate_greetings = [];
  data.alternate_greetings.push('');
}

function removeAg(idx: number) {
  rec.value!.raw.data.alternate_greetings!.splice(idx, 1);
}

function moveAg(idx: number, dir: -1 | 1) {
  const list = rec.value!.raw.data.alternate_greetings!;
  const to = idx + dir;
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(idx, 1);
  list.splice(to, 0, item);
}

/* ------------------------------ 群聊专用开场白（V3） ------------------------------ */

const gogList = computed(() => rec.value?.raw.data.group_only_greetings || []);

function addGog() {
  const data = rec.value!.raw.data;
  if (!Array.isArray(data.group_only_greetings)) data.group_only_greetings = [];
  data.group_only_greetings.push('');
}

function removeGog(idx: number) {
  rec.value!.raw.data.group_only_greetings!.splice(idx, 1);
}

/* ------------------------------ 世界书内联编辑 ------------------------------ */

const book = computed(() => rec.value?.raw.data.character_book || null);
const entries = computed(() => book.value?.entries || []);

function addEntry() {
  const b = ensureBook();
  b.entries.push({
    keys: [],
    content: '',
    extensions: {},
    enabled: true,
    insertion_order: 100,
    position: 'before_char',
  } as CardBookEntry);
}

function removeEntry(idx: number) {
  book.value!.entries.splice(idx, 1);
}

function moveEntry(idx: number, dir: -1 | 1) {
  const list = book.value!.entries;
  const to = idx + dir;
  if (to < 0 || to >= list.length) return;
  const [item] = list.splice(idx, 1);
  list.splice(to, 0, item);
}

const expandedEntry = ref<number | null>(null);

function keysText(entry: CardBookEntry): string {
  return (entry.keys || []).join(', ');
}
function setKeysText(entry: CardBookEntry, v: string) {
  entry.keys = v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
}
function secKeysText(entry: CardBookEntry): string {
  return (entry.secondary_keys || []).join(', ');
}
function setSecKeysText(entry: CardBookEntry, v: string) {
  const keys = v.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  if (keys.length) {
    entry.secondary_keys = keys;
    entry.selective = true;
  } else {
    delete entry.secondary_keys;
    entry.selective = false;
  }
}

/* ------------------------------ 评分 ------------------------------ */

const score = computed(() => (rec.value ? scoreCard(rec.value.raw) : { score: 0, suggestions: [] }));
const scorePanelOpen = ref(false);
const scoreColor = computed(() => {
  const s = score.value.score;
  return s >= 80 ? 'var(--color-success)' : s >= 50 ? 'var(--color-warning, #b8860b)' : 'var(--color-danger)';
});

/* ------------------------------ 导出 ------------------------------ */

const exportOpen = ref(false);
const exportEl = ref<HTMLElement | null>(null);

function onDocClick(e: MouseEvent) {
  if (exportOpen.value && exportEl.value && !exportEl.value.contains(e.target as Node)) exportOpen.value = false;
}
onMounted(() => document.addEventListener('click', onDocClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));

async function doExport(kind: 'v2' | 'v3' | 'png' | 'book') {
  exportOpen.value = false;
  const r = rec.value;
  if (!r) return;
  try {
    if (kind === 'book') {
      const ok = exportCardWorldbook(r.raw);
      if (!ok) await ui.showDialog({ message: t('cs_export_book_empty'), showCancel: false });
    } else if (kind === 'png') {
      await exportCardPng(r.raw, r.avatar);
    } else {
      exportCardJson(r.raw, kind);
    }
  } catch (e: any) {
    await ui.showDialog({ message: e?.message || t('cs_export_error'), showCancel: false, danger: true });
  }
}

const exportItems = computed(() => [
  { id: 'v2' as const, label: t('cs_export_v2') },
  { id: 'v3' as const, label: t('cs_export_v3') },
  { id: 'png' as const, label: t('cs_export_png') },
  { id: 'book' as const, label: t('cs_export_book') },
]);
</script>

<template>
  <div v-if="rec">
    <!-- 顶栏 -->
    <div class="flex flex-wrap items-center gap-3">
      <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="emit('close')">← {{ t('cs_back_lib') }}</button>
      <span class="rounded-md bg-rose-tint px-2 py-0.5 text-xs font-bold text-plum">{{ specBadge }}</span>
      <span class="truncate text-sm text-plum-muted">{{ rec.raw?.data?.name || t('cs_unnamed') }}</span>
      <button
        type="button"
        class="ui-chip ui-chip-sm ml-auto font-bold"
        :style="{ color: scoreColor, borderColor: scoreColor }"
        :title="t('cs_score_title')"
        @click="scorePanelOpen = !scorePanelOpen"
      >{{ t('cs_score_chip', { n: score.score }) }}</button>
      <div ref="exportEl" class="relative">
        <button type="button" class="ui-button ui-button-primary ui-button-sm" @click.stop="exportOpen = !exportOpen">
          {{ t('cs_export') }} ▾
        </button>
        <div v-if="exportOpen" class="absolute right-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-lg">
          <button
            v-for="item in exportItems"
            :key="item.id"
            type="button"
            class="block w-full px-4 py-2 text-left text-sm hover:bg-rose-tint"
            @click="doExport(item.id)"
          >{{ item.label }}</button>
        </div>
      </div>
    </div>

    <!-- 评分面板 -->
    <div v-if="scorePanelOpen" class="mt-3 rounded-xl border border-border bg-surface-soft p-4">
      <div class="flex items-center gap-3">
        <span class="font-display text-2xl font-bold" :style="{ color: scoreColor }">{{ score.score }}</span>
        <div class="h-2 flex-1 overflow-hidden rounded-full bg-border">
          <div class="h-full rounded-full transition-all" :style="{ width: score.score + '%', background: scoreColor }"></div>
        </div>
        <span class="text-xs text-plum-muted">/ 100</span>
      </div>
      <div v-if="score.suggestions.length" class="mt-3 flex flex-wrap gap-1.5">
        <span v-for="sug in score.suggestions" :key="sug.key" class="rounded-md border border-border bg-surface px-2 py-1 text-xs text-plum-muted">
          {{ t(sug.key) }}
        </span>
      </div>
      <p v-else class="mt-2 text-xs" style="color: var(--color-success)">{{ t('cs_score_full') }}</p>
    </div>

    <!-- 头像 + Tab 行 -->
    <div class="mt-4 flex flex-wrap items-center gap-4">
      <div class="relative h-20 w-20 overflow-hidden rounded-xl border border-border bg-rose-tint">
        <img v-if="rec.avatar" :src="rec.avatar" :alt="rec.raw?.data?.name" class="h-full w-full object-cover">
        <div v-else class="flex h-full w-full items-center justify-center font-display text-2xl text-plum-muted">
          {{ (rec.raw?.data?.name || '?').trim().charAt(0).toUpperCase() }}
        </div>
      </div>
      <div class="flex flex-col gap-1.5">
        <button type="button" class="ui-button ui-button-secondary ui-button-xs" @click="avatarInput?.click()">{{ t('cs_avatar_change') }}</button>
        <button v-if="rec.avatar" type="button" class="ui-button ui-button-ghost ui-button-xs" @click="removeAvatar">{{ t('cs_avatar_remove') }}</button>
        <input ref="avatarInput" type="file" accept="image/*" class="hidden" @change="onAvatarInput">
      </div>
      <div class="ml-auto flex flex-wrap gap-1.5">
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          class="ui-chip"
          :class="{ active: tab === item.id }"
          @click="tab = item.id"
        >{{ item.label }}</button>
      </div>
    </div>

    <!-- 基本 -->
    <div v-if="tab === 'basic'" class="mt-5 space-y-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <ToolField :label="t('cs_f_name')" required>
          <input v-model="rec.raw.data.name" type="text" class="ui-input w-full" :placeholder="t('cs_f_name_ph')">
        </ToolField>
        <ToolField :label="t('cs_f_creator')">
          <input v-model="rec.raw.data.creator" type="text" class="ui-input w-full">
        </ToolField>
        <ToolField :label="t('cs_f_version')">
          <input v-model="rec.raw.data.character_version" type="text" class="ui-input w-full" placeholder="1.0">
        </ToolField>
      </div>
      <ToolField :label="t('cs_f_tags')" :hint="t('cs_f_tags_hint')">
        <ToolTagInput v-model="tagsModel" />
      </ToolField>
      <ToolField :label="t('cs_f_description')" :hint="t('cs_f_description_hint')">
        <ToolMacroTextarea v-model="rec.raw.data.description" :rows="8" ai-field="description" :ai-context="aiCtx" />
      </ToolField>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ToolField :label="t('cs_f_personality')">
          <ToolMacroTextarea v-model="rec.raw.data.personality" :rows="5" ai-field="personality" :ai-context="aiCtx" />
        </ToolField>
        <ToolField :label="t('cs_f_scenario')">
          <ToolMacroTextarea v-model="rec.raw.data.scenario" :rows="5" ai-field="scenario" :ai-context="aiCtx" />
        </ToolField>
      </div>
    </div>

    <!-- 对话 -->
    <div v-if="tab === 'dialog'" class="mt-5 space-y-4">
      <ToolField :label="t('cs_f_first_mes')" :hint="t('cs_macro_hint')">
        <ToolMacroTextarea v-model="rec.raw.data.first_mes" :rows="8" ai-field="first_mes" :ai-context="aiCtx" />
      </ToolField>

      <div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold">{{ t('cs_f_alternate') }}</label>
          <span class="text-xs text-plum-muted">{{ t('cs_f_alternate_hint') }}</span>
          <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="addAg">＋ {{ t('cs_ag_add') }}</button>
        </div>
        <div v-for="(g, gi) in agList" :key="gi" class="mt-2">
          <div class="mb-1 flex items-center gap-1">
            <span class="text-xs font-semibold text-plum-muted">#{{ gi + 1 }}</span>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="gi === 0" @click="moveAg(gi, -1)">↑</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="gi === agList.length - 1" @click="moveAg(gi, 1)">↓</button>
            <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs ml-auto" @click="removeAg(gi)">{{ t('cs_ag_remove') }}</button>
          </div>
          <ToolMacroTextarea v-model="rec.raw.data.alternate_greetings![gi]" :rows="5" />
        </div>
        <p v-if="!agList.length" class="mt-1 text-xs text-plum-muted">{{ t('cs_ag_empty') }}</p>
      </div>

      <ToolField :label="t('cs_f_mes_example')" :hint="t('cs_f_mes_example_hint')">
        <ToolMacroTextarea v-model="rec.raw.data.mes_example" :rows="8" ai-field="mes_example" :ai-context="aiCtx" />
      </ToolField>
    </div>

    <!-- 高级 -->
    <div v-if="tab === 'advanced'" class="mt-5 space-y-4">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ToolField :label="t('cs_f_system_prompt')" :hint="t('cs_f_original_hint')">
          <textarea v-model="rec.raw.data.system_prompt" rows="4" class="ui-input block w-full resize-y" :placeholder="t('cs_f_sp_ph')"></textarea>
        </ToolField>
        <ToolField :label="t('cs_f_php')" :hint="t('cs_f_original_hint')">
          <textarea v-model="rec.raw.data.post_history_instructions" rows="4" class="ui-input block w-full resize-y" :placeholder="t('cs_f_php_ph')"></textarea>
        </ToolField>
      </div>
      <ToolField :label="t('cs_f_creator_notes')" :hint="t('cs_f_creator_notes_hint')">
        <textarea v-model="rec.raw.data.creator_notes" rows="3" class="ui-input block w-full resize-y"></textarea>
      </ToolField>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ToolField :label="t('cs_f_nickname')" :hint="t('cs_f_nickname_hint')">
          <input v-model="rec.raw.data.nickname" type="text" class="ui-input w-full">
        </ToolField>
        <div class="rounded-lg border border-border bg-surface-soft p-3 text-xs leading-relaxed text-plum-muted">
          {{ t('cs_v3_note') }}
        </div>
      </div>

      <div>
        <div class="flex items-center gap-2">
          <label class="text-sm font-semibold">{{ t('cs_f_gog') }}</label>
          <span class="text-xs text-plum-muted">{{ t('cs_f_gog_hint') }}</span>
          <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="addGog">＋ {{ t('cs_ag_add') }}</button>
        </div>
        <div v-for="(g, gi) in gogList" :key="gi" class="mt-2 flex items-start gap-2">
          <textarea v-model="rec.raw.data.group_only_greetings![gi]" rows="3" class="ui-input block flex-1 resize-y"></textarea>
          <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" @click="removeGog(gi)">×</button>
        </div>
        <p v-if="!gogList.length" class="mt-1 text-xs text-plum-muted">{{ t('cs_ag_empty') }}</p>
      </div>
    </div>

    <!-- 世界书 -->
    <div v-if="tab === 'book' && book" class="mt-5 space-y-4">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <ToolField :label="t('cs_b_name')" class="sm:col-span-2">
          <input v-model="book.name" type="text" class="ui-input w-full">
        </ToolField>
        <ToolField :label="t('cs_b_scan_depth')">
          <input v-model.number="book.scan_depth" type="number" min="0" class="ui-input w-full">
        </ToolField>
        <ToolField :label="t('cs_b_token_budget')">
          <input v-model.number="book.token_budget" type="number" min="0" class="ui-input w-full">
        </ToolField>
      </div>
      <label class="flex items-center gap-2 text-sm">
        <input v-model="book.recursive_scanning" type="checkbox" class="accent-rose-deep">
        {{ t('cs_b_recursive') }}
      </label>

      <div class="flex items-center gap-2">
        <h3 class="text-sm font-semibold">{{ t('cs_b_entries', { n: entries.length }) }}</h3>
        <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="addEntry">＋ {{ t('cs_b_add') }}</button>
        <button type="button" class="ui-button ui-button-ghost ui-button-xs" @click="doExport('book')">{{ t('cs_b_export') }}</button>
      </div>

      <p v-if="!entries.length" class="rounded-lg border border-dashed border-border p-4 text-center text-xs text-plum-muted">{{ t('cs_b_empty') }}</p>

      <div v-for="(entry, ei) in entries" :key="ei" class="rounded-xl border border-border bg-surface">
        <div
          class="flex cursor-pointer flex-wrap items-center gap-2 p-3"
          role="button"
          tabindex="0"
          @click="expandedEntry = expandedEntry === ei ? null : ei"
          @keydown.enter.prevent="expandedEntry = expandedEntry === ei ? null : ei"
        >
          <span class="text-xs font-bold text-plum-muted">#{{ ei + 1 }}</span>
          <span class="truncate text-sm font-semibold">{{ entry.comment || entry.name || entry.keys?.[0] || t('cs_b_untitled') }}</span>
          <span v-if="entry.keys?.length" class="truncate rounded bg-rose-tint px-1.5 py-0.5 text-[11px] text-plum-muted">{{ entry.keys.slice(0, 3).join(' / ') }}</span>
          <span v-if="entry.constant" class="rounded bg-rose-deep/15 px-1.5 py-0.5 text-[11px] font-semibold text-rose-deep">{{ t('cs_b_constant') }}</span>
          <span v-if="!entry.enabled" class="rounded bg-border px-1.5 py-0.5 text-[11px] text-plum-muted">{{ t('cs_b_disabled') }}</span>
          <span class="ml-auto flex gap-1" @click.stop>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="ei === 0" @click="moveEntry(ei, -1)">↑</button>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" :disabled="ei === entries.length - 1" @click="moveEntry(ei, 1)">↓</button>
            <button type="button" class="ui-button ui-button-danger-ghost ui-button-xs" @click="removeEntry(ei)">🗑</button>
          </span>
        </div>
        <div v-if="expandedEntry === ei" class="space-y-3 border-t border-border p-3">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToolField :label="t('cs_b_comment')">
              <input v-model="entry.comment" type="text" class="ui-input w-full">
            </ToolField>
            <ToolField :label="t('cs_b_order')">
              <input v-model.number="entry.insertion_order" type="number" class="ui-input w-full">
            </ToolField>
          </div>
          <ToolField :label="t('cs_b_keys')" :hint="t('cs_b_keys_hint')">
            <input :value="keysText(entry)" type="text" class="ui-input w-full" @input="setKeysText(entry, ($event.target as HTMLInputElement).value)">
          </ToolField>
          <ToolField :label="t('cs_b_sec_keys')">
            <input :value="secKeysText(entry)" type="text" class="ui-input w-full" @input="setSecKeysText(entry, ($event.target as HTMLInputElement).value)">
          </ToolField>
          <ToolField :label="t('cs_b_content')">
            <textarea v-model="entry.content" rows="4" class="ui-input block w-full resize-y"></textarea>
          </ToolField>
          <div class="flex flex-wrap items-center gap-4">
            <ToolField :label="t('cs_b_position')">
              <select v-model="entry.position" class="ui-input w-auto text-sm">
                <option value="before_char">{{ t('cs_b_before') }}</option>
                <option value="after_char">{{ t('cs_b_after') }}</option>
              </select>
            </ToolField>
            <label class="mt-4 flex items-center gap-1.5 text-sm">
              <input v-model="entry.constant" type="checkbox" class="accent-rose-deep">{{ t('cs_b_constant') }}
            </label>
            <label class="mt-4 flex items-center gap-1.5 text-sm">
              <input v-model="entry.enabled" type="checkbox" class="accent-rose-deep">{{ t('cs_b_enabled') }}
            </label>
          </div>
        </div>
      </div>

      <p class="text-xs text-plum-muted">{{ t('cs_b_forge_note') }}</p>
    </div>
  </div>
</template>
