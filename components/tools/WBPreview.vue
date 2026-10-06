<script setup lang="ts">
/**
 * 命中预览：粘贴示例聊天文本 → 实时模拟 ST 世界信息激活。
 * 全局开关（大小写/全词）可被条目级 caseSensitive / matchWholeWords 覆盖（见 matchEntries）。
 */
import type { WorldInfoBook } from '~/utils/st/types';
import { matchEntries } from '~/utils/st/worldbook';

const props = defineProps<{ book: WorldInfoBook }>();

const { t } = useI18n();

const text = ref('');
const scanLines = ref<number | null>(null);
const caseSensitive = ref(false);
const wholeWords = ref(true);

const results = computed(() =>
  matchEntries(props.book, text.value, {
    scanDepth: scanLines.value,
    caseSensitive: caseSensitive.value,
    matchWholeWords: wholeWords.value,
  }),
);

function onLinesInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  const n = Math.floor(Number(v) || 0);
  scanLines.value = n > 0 ? n : null;
}

/** 内容摘要：压平空白，截断 80 字 */
function snippet(s: string): string {
  const clean = String(s || '').replace(/\s+/g, ' ').trim();
  return clean.length > 80 ? `${clean.slice(0, 80)}…` : clean;
}
</script>

<template>
  <div class="rounded-xl border border-border bg-surface p-4">
    <h3 class="font-display text-base font-semibold tracking-wide">🔎 {{ t('wb_preview_title') }}</h3>

    <textarea
      v-model="text"
      rows="5"
      class="ui-input mt-3 block w-full resize-y text-sm"
      :placeholder="t('wb_preview_ph')"
    ></textarea>

    <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
      <label class="flex items-center gap-1.5">
        <input v-model="caseSensitive" type="checkbox" class="accent-rose-deep">{{ t('wb_preview_case') }}
      </label>
      <label class="flex items-center gap-1.5">
        <input v-model="wholeWords" type="checkbox" class="accent-rose-deep">{{ t('wb_preview_whole') }}
      </label>
      <label class="flex items-center gap-1.5">
        {{ t('wb_preview_depth') }}
        <input
          :value="scanLines ?? ''"
          type="number"
          min="1"
          class="ui-input ui-input-compact w-16 text-xs"
          :aria-label="t('wb_preview_depth')"
          @input="onLinesInput"
        >
      </label>
    </div>
    <p class="mt-2 text-xs leading-relaxed text-plum-muted">{{ t('wb_preview_hint') }}</p>

    <!-- 结果列表（order 升序） -->
    <div class="mt-3 border-t border-border pt-3">
      <p class="text-sm font-semibold">
        {{ text.trim() ? t('wb_preview_hits', { n: results.length }) : t('wb_preview_empty') }}
      </p>
      <p v-if="text.trim() && !results.length" class="mt-2 text-xs text-plum-muted">{{ t('wb_preview_none') }}</p>

      <ul class="mt-2 space-y-2">
        <li v-for="r in results" :key="r.entry.uid" class="rounded-lg border border-border bg-surface-soft p-2.5">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-bold text-plum-muted">#{{ r.entry.order ?? r.entry.uid }}</span>
            <span class="truncate text-sm font-semibold">{{ r.entry.comment || t('wb_entry_untitled') }}</span>
            <span v-if="r.entry.constant" class="rounded bg-rose-deep/15 px-1.5 py-0.5 text-[11px] font-semibold text-rose-deep">🔵 {{ t('wb_constant') }}</span>
            <span v-if="r.entry.disable" class="rounded bg-border px-1.5 py-0.5 text-[11px] text-plum-muted">{{ t('wb_disabled') }}</span>
          </div>
          <!-- 命中的关键词（主 / 副） -->
          <div v-if="r.matchedKeys.length || r.matchedSecondary.length" class="mt-1.5 flex flex-wrap gap-1">
            <span
              v-for="(k, ki) in r.matchedKeys"
              :key="`k-${ki}`"
              class="rounded bg-rose-deep/15 px-1.5 py-0.5 text-[11px] font-medium text-rose-deep"
            >{{ k }}</span>
            <span
              v-for="(k, ki) in r.matchedSecondary"
              :key="`s-${ki}`"
              class="rounded border border-champagne/50 px-1.5 py-0.5 text-[11px] text-plum-muted"
            >{{ k }}</span>
          </div>
          <p v-if="r.entry.content" class="mt-1.5 text-xs leading-relaxed text-plum-muted">{{ snippet(r.entry.content) }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
