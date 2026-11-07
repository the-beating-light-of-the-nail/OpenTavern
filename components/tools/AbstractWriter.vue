<script setup lang="ts">
/**
 * 抽象内容生成（源站 abstract_content 复刻）：
 * 单段正常文本 → 碎片化第一人称意识流改写，输出上限为原文 200%。
 */
import { useToolAI } from '~/composables/useToolAI';
import { abstractMessages } from '~/utils/source-tool-prompts';
import { aiLangName, copyToClipboard } from '~/utils/st/regex-script';
import { downloadBlob, safeFilename } from '~/utils/st/export';

const { t, locale } = useI18n();
const ui = useUiStore();
const ai = useToolAI();
const running = computed(() => ai.running.value);
const output = computed(() => ai.output.value);
const error = computed(() => ai.error.value);

const input = ref('');
const formError = ref('');
const copied = ref(false);

async function run() {
  if (running.value) return;
  formError.value = '';
  copied.value = false;
  if (!input.value.trim()) {
    formError.value = t('abs_err_req');
    return;
  }
  if (!ai.isConfigured()) {
    ui.open('settings');
    return;
  }
  await ai.generate(
    abstractMessages(input.value.trim(), aiLangName(locale.value)),
    { temperature: 0.9, maxTokens: 2000 },
  );
}

async function copy() {
  if (!await copyToClipboard(output.value)) {
    ui.showDialog({ message: t('at_copy_fail'), showCancel: false });
    return;
  }
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 1500);
}

function download() {
  downloadBlob(`${safeFilename('abstract')}.txt`, new Blob([output.value], { type: 'text/plain;charset=utf-8' }));
}
</script>

<template>
  <div>
    <ToolField :label="t('abs_input')" required :hint="t('abs_input_ph')">
      <textarea v-model="input" rows="7" class="ui-input w-full resize-y" :placeholder="t('abs_input_ph')" />
    </ToolField>

    <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>

    <div class="mt-4">
      <button type="button" class="ui-button ui-button-primary ui-button-sm" :disabled="running" @click="run">
        ✦ {{ t('abs_run') }}
      </button>
    </div>

    <ATOutput :running="running" :error="error" :output="output" @stop="ai.stop()">
      <template v-if="!running && output">
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="copy">⧉ {{ copied ? t('at_copied') : t('at_copy') }}</button>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="download">⇩ {{ t('abs_download') }}</button>
          <button type="button" class="ui-button ui-button-ghost ui-button-sm" @click="run">↻ {{ t('at_regen') }}</button>
        </div>
      </template>
    </ATOutput>
  </div>
</template>
