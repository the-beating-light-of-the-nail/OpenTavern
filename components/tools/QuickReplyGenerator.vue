<script setup lang="ts">
/**
 * 快速回复生成器（源站 qr_generator 复刻）：
 * 可视化配置 ST Quick Reply v2 组：组名、禁止自动发送、全局颜色/不透明度/仅边框、
 * 任意数量按钮（文本/提示/发送内容），实时聊天预览，导出可直接导入的 JSON。
 */
import { downloadJson, safeFilename } from '~/utils/st/export';

interface QrButton {
  id: number;
  label: string;
  title: string;
  message: string;
}

const { t } = useI18n();

const name = ref('');
const disableSend = ref(true);
const hex = ref('#000000');
const opacity = ref(0);
const onlyBorderColor = ref(false);
const buttons = ref<QrButton[]>([{ id: 1, label: '', title: '', message: '' }]);
const nextId = ref(2);

const formError = ref('');
const downloaded = ref('');

const messages = ref<string[]>([]);
const previewInput = ref('');

const color = computed(() => {
  if (opacity.value <= 0) return 'rgba(0, 0, 0, 0)';
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.value);
  if (!m) return `rgba(0, 0, 0, ${opacity.value / 100})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${opacity.value / 100})`;
});

const hasColor = computed(() => color.value !== 'rgba(0, 0, 0, 0)' && color.value !== 'transparent');

const buttonStyle = computed(() => {
  if (!hasColor.value) return {};
  if (onlyBorderColor.value) {
    return { borderColor: color.value, borderWidth: '1px', borderStyle: 'solid', color: color.value, backgroundColor: 'transparent' };
  }
  return { backgroundColor: color.value, borderColor: color.value, color: '#fff' };
});

function addButton() {
  buttons.value.push({ id: nextId.value++, label: '', title: '', message: '' });
}

function removeButton(id: number) {
  if (buttons.value.length <= 1) return;
  buttons.value = buttons.value.filter((b) => b.id !== id);
}

function resetTransparent() {
  opacity.value = 0;
}

function clickButton(btn: QrButton) {
  const text = btn.message;
  if (!text) return;
  if (disableSend.value) previewInput.value = text;
  else messages.value.push(text);
}

function download() {
  formError.value = '';
  downloaded.value = '';
  const scriptName = name.value.trim();
  if (!scriptName) {
    formError.value = t('qr_err_name');
    return;
  }
  const payload = {
    version: 2,
    name: scriptName,
    disableSend: disableSend.value,
    placeBeforeInput: false,
    injectInput: false,
    color: color.value,
    onlyBorderColor: onlyBorderColor.value,
    qrList: buttons.value.map((b) => ({
      id: b.id,
      icon: '',
      showLabel: false,
      label: b.label,
      title: b.title,
      message: b.message,
      contextList: [],
      preventAutoExecute: true,
      isHidden: false,
      executeOnStartup: false,
      executeOnUser: false,
      executeOnAi: false,
      executeOnChatChange: false,
      executeOnGroupMemberDraft: false,
      executeOnNewChat: false,
      executeBeforeGeneration: false,
      automationId: '',
    })),
    idIndex: nextId.value,
  };
  downloadJson(`${safeFilename(scriptName)}.json`, payload);
  downloaded.value = t('qr_downloaded', { name: scriptName });
}
</script>

<template>
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
    <div class="min-w-0">
      <!-- 基础设置 -->
      <section class="rounded-xl border border-border bg-surface p-4">
        <h3 class="font-display text-base font-semibold">{{ t('qr_basic') }}</h3>
        <div class="mt-3">
          <ToolField :label="t('qr_name')" required>
            <input v-model="name" type="text" class="ui-input w-full" :placeholder="t('qr_name_ph')">
          </ToolField>
        </div>

        <label class="mt-4 flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-border bg-bg p-3">
          <span class="min-w-0">
            <span class="block text-sm font-semibold">{{ t('qr_disable_send') }}</span>
            <span class="mt-0.5 block text-xs leading-relaxed text-plum-muted">{{ t('qr_disable_send_desc') }}</span>
          </span>
          <input v-model="disableSend" type="checkbox" class="mt-1 h-4 w-4 flex-shrink-0 accent-rose-deep">
        </label>

        <div class="mt-4 rounded-lg border border-border bg-bg p-3">
          <p class="text-sm font-semibold">{{ t('qr_color') }}</p>
          <div class="mt-2 flex flex-wrap items-center gap-3">
            <input v-model="hex" type="color" class="h-9 w-12 cursor-pointer rounded border border-border bg-transparent">
            <code class="text-xs text-plum-muted">{{ color }}</code>
            <button type="button" class="ui-button ui-button-ghost ui-button-xs" @click="resetTransparent">{{ t('qr_transparent') }}</button>
          </div>
          <div class="mt-3 flex items-center gap-3">
            <span class="text-xs font-semibold">{{ t('qr_opacity') }}</span>
            <input v-model.number="opacity" type="range" min="0" max="100" step="1" class="min-w-0 flex-1 accent-rose-deep">
            <span class="w-10 text-right text-xs tabular-nums">{{ opacity }}%</span>
          </div>
          <label class="mt-3 flex cursor-pointer items-start justify-between gap-3">
            <span class="min-w-0">
              <span class="block text-sm font-semibold">{{ t('qr_border_only') }}</span>
              <span class="mt-0.5 block text-xs leading-relaxed text-plum-muted">{{ t('qr_border_only_desc') }}</span>
            </span>
            <input v-model="onlyBorderColor" type="checkbox" class="mt-1 h-4 w-4 flex-shrink-0 accent-rose-deep">
          </label>
        </div>
      </section>

      <!-- 按钮列表 -->
      <section class="mt-4 rounded-xl border border-border bg-surface p-4">
        <div class="flex items-center justify-between gap-3">
          <h3 class="font-display text-base font-semibold">{{ t('qr_buttons') }}</h3>
          <button type="button" class="ui-button ui-button-secondary ui-button-sm" @click="addButton">＋ {{ t('qr_add') }}</button>
        </div>

        <div class="mt-3 space-y-3">
          <div v-for="(btn, i) in buttons" :key="btn.id" class="rounded-lg border border-border bg-bg p-3">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold text-plum-muted">{{ t('qr_button_n', { n: i + 1 }) }}</span>
              <button
                v-if="buttons.length > 1"
                type="button"
                class="ui-button ui-button-danger-ghost ui-button-xs"
                @click="removeButton(btn.id)"
              >{{ t('qr_remove') }}</button>
            </div>
            <div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <ToolField :label="t('qr_label')">
                <input v-model="btn.label" type="text" class="ui-input w-full" :placeholder="t('qr_label_ph')">
              </ToolField>
              <ToolField :label="t('qr_title')">
                <input v-model="btn.title" type="text" class="ui-input w-full" :placeholder="t('qr_title_ph')">
              </ToolField>
              <div class="sm:col-span-2">
                <ToolField :label="t('qr_message')">
                  <textarea v-model="btn.message" rows="2" class="ui-input w-full resize-y" :placeholder="t('qr_message_ph')" />
                </ToolField>
              </div>
            </div>
          </div>
        </div>

        <p v-if="formError" class="ui-alert-danger mt-3 rounded-lg px-3 py-2 text-xs">{{ formError }}</p>
        <p v-if="downloaded" class="ui-status-success mt-3 rounded-lg px-3 py-2 text-xs">{{ downloaded }}</p>

        <div class="mt-4">
          <button type="button" class="ui-button ui-button-primary ui-button-sm" @click="download">⇩ {{ t('qr_download') }}</button>
          <p class="mt-2 text-xs text-plum-muted">{{ t('qr_download_note') }}</p>
        </div>
      </section>
    </div>

    <!-- 预览 -->
    <aside class="lg:sticky lg:top-20 lg:self-start">
      <div class="rounded-xl border border-border bg-surface p-4">
        <h3 class="font-display text-base font-semibold">{{ t('qr_preview') }}</h3>
        <p class="mt-1 text-xs text-plum-muted">{{ t('qr_preview_hint') }}</p>

        <div class="mt-3 flex min-h-[180px] flex-col justify-end gap-2 rounded-lg border border-dashed border-border bg-bg p-3">
          <p v-for="(m, i) in messages" :key="i" class="ml-auto max-w-[85%] rounded-2xl bg-rose-tint px-3 py-2 text-xs leading-relaxed">{{ m }}</p>
          <p v-if="!messages.length" class="text-center text-xs text-plum-muted">…</p>
        </div>

        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="btn in buttons"
            :key="btn.id"
            type="button"
            class="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium shadow-sm"
            :class="hasColor ? '' : 'border border-border bg-surface text-plum-muted hover:bg-rose-tint'"
            :style="buttonStyle"
            :title="btn.title || btn.message || btn.label"
            @click="clickButton(btn)"
          >{{ btn.label || t('qr_empty') }}</button>
        </div>

        <textarea v-model="previewInput" rows="2" class="ui-input mt-3 w-full resize-none text-xs" :placeholder="t('qr_input_ph')" />
      </div>
    </aside>
  </div>
</template>
