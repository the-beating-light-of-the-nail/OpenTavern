<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { useUiStore } from '~/stores/ui';
import { parseCharacterCard, extractCharaFromPng, fileToDataUrl, type ParsedCharacter } from '~/utils/card-import';

const store = useAppStore();
const ui = useUiStore();
const { t } = useI18n();

type Step = 'select' | 'preview' | 'success';

const step = ref<Step>('select');
const parsedChar = ref<ParsedCharacter | null>(null);
const avatarDataUrl = ref<string | null>(null);
const savedId = ref<string | null>(null);
const error = ref<string | null>(null);
const isParsing = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// 每次弹窗打开时重置状态
watch(() => ui.isOpen('charImport'), (open) => {
  if (open) {
    step.value = 'select';
    parsedChar.value = null;
    avatarDataUrl.value = null;
    savedId.value = null;
    error.value = null;
    isParsing.value = false;
  }
});

async function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files && target.files[0];
  if (!file) return;

  error.value = null;
  isParsing.value = true;

  try {
    const isJson = file.name.endsWith('.json') || file.type === 'application/json';
    const isPng = file.name.endsWith('.png') || file.type === 'image/png';

    if (isJson) {
      const text = await file.text();
      let jsonData: any;
      try {
        jsonData = JSON.parse(text);
      } catch {
        throw new Error('ERR_INVALID_JSON');
      }
      parsedChar.value = parseCharacterCard(jsonData);
      // JSON 卡可能内嵌 avatar（base64 data URL）
      const av = jsonData?.data?.avatar || jsonData?.avatar;
      avatarDataUrl.value = typeof av === 'string' && av.startsWith('data:') ? av : null;
    } else if (isPng) {
      const jsonData = await extractCharaFromPng(file);
      parsedChar.value = parseCharacterCard(jsonData);
      // PNG 文件本身作为 avatar
      avatarDataUrl.value = await fileToDataUrl(file);
    } else {
      throw new Error('ERR_UNSUPPORTED_TYPE');
    }

    step.value = 'preview';
  } catch (err: any) {
    const msg = err?.message || '';
    const errMap: Record<string, string> = {
      ERR_INVALID_CARD: t('import_invalid_format'),
      ERR_MISSING_NAME: t('import_missing_name'),
      ERR_INVALID_PNG: t('import_invalid_png'),
      ERR_NO_CHARA_DATA: t('import_no_chara_data'),
      ERR_FILE_READ: t('import_read_error'),
      ERR_INVALID_JSON: t('import_invalid_json'),
      ERR_UNSUPPORTED_TYPE: t('import_unsupported_type'),
    };
    error.value = errMap[msg] || errMap[msg.replace(/^ERR_/, '')] || t('import_parse_error');
  } finally {
    isParsing.value = false;
    // 重置 input 以便重复选择同一文件
    if (target) target.value = '';
  }
}

function confirmImport() {
  if (!parsedChar.value) return;
  const char: Record<string, any> = { ...parsedChar.value };
  if (avatarDataUrl.value) char.avatar = avatarDataUrl.value;
  savedId.value = store.addCharacter(char);
  step.value = 'success';
}

function startChat() {
  if (!savedId.value) return;
  const entry = store.characters[savedId.value];
  if (entry) store.createConversation(entry);
  ui.close('charImport');
}

function viewCharacter() {
  ui.close('charImport');
}

function cancel() {
  ui.close('charImport');
}

function triggerFileInput() {
  fileInput.value?.click();
}

function onDrop(e: DragEvent) {
  e.preventDefault();
  if (!e.dataTransfer?.files.length) return;
  // 模拟 change 事件
  const fakeEvent = { target: { files: e.dataTransfer.files, value: '' } } as unknown as Event;
  onFileChange(fakeEvent);
}
</script>

<template>
  <AppModal modal-id="importModal" name="charImport" max-width="max-w-md" closable>
    <h2 class="ui-modal-title mb-5" style="color:var(--color-text)">{{ t('import_title') }}</h2>

    <!-- Step: select -->
    <div v-if="step === 'select'">
      <p class="text-sm mb-4" style="color:var(--color-text-muted)">
        <span>{{ t('import_desc') }}</span>
        <code class="px-1.5 py-0.5 rounded" style="color:var(--color-primary);background:color-mix(in srgb,var(--color-primary) 12%,transparent)">chara_card_v1 / v2 / v3</code>
        <span>{{ t('import_desc2') }}</span>
      </p>
      <label
        class="flex flex-col items-center gap-3 p-8 ui-panel rounded-2xl border-dashed border-2 cursor-pointer transition-all"
        @dragover.prevent
        @drop="onDrop"
        @click="triggerFileInput"
      >
        <div v-if="isParsing" class="text-sm animate-pulse" style="color:var(--color-primary)">{{ t('import_parsing') }}</div>
        <template v-else>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--color-text-muted)"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
          <span class="text-sm" style="color:var(--color-text-muted)">{{ t('import_click_hint') }}</span>
          <span class="text-[10px]" style="color:var(--color-text-muted)">{{ t('import_format_hint') }}</span>
        </template>
        <input ref="fileInput" type="file" accept=".json,.png" class="hidden" @change="onFileChange">
      </label>
      <div v-if="error" class="ui-alert-danger mt-3 rounded-xl px-4 py-2.5 text-xs">{{ error }}</div>
    </div>

    <!-- Step: preview -->
    <div v-else-if="step === 'preview' && parsedChar">
      <div class="flex items-center gap-3 mb-4">
        <div v-if="avatarDataUrl" class="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <img :src="avatarDataUrl" :alt="parsedChar.name" class="w-full h-full object-cover">
        </div>
        <div v-else class="w-14 h-14 rounded-xl ot-avatar-fill flex items-center justify-center text-xl font-bold text-[var(--color-on-primary)] flex-shrink-0">{{ parsedChar.name.charAt(0) }}</div>
        <div class="min-w-0">
          <h3 class="text-base font-bold truncate" style="color:var(--color-text)">{{ parsedChar.name }}</h3>
          <p v-if="parsedChar.tags.length" class="text-xs truncate" style="color:var(--color-primary)">{{ parsedChar.tags.join(' · ') }}</p>
        </div>
      </div>

      <div class="space-y-3">
        <div v-if="parsedChar.description">
          <label class="text-[10px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('char_editor_description') }}</label>
          <p class="mt-1 text-xs line-clamp-4 leading-relaxed" style="color:var(--color-text-muted)">{{ parsedChar.description }}</p>
        </div>
        <div v-if="parsedChar.first_mes">
          <label class="text-[10px] font-semibold uppercase tracking-wider" style="color:var(--color-text-muted)">{{ t('char_editor_first_mes') }}</label>
          <p class="mt-1 text-xs line-clamp-4 leading-relaxed whitespace-pre-wrap" style="color:var(--color-text-muted)">{{ parsedChar.first_mes }}</p>
        </div>
      </div>

      <div v-if="error" class="ui-alert-danger mt-3 rounded-xl px-4 py-2.5 text-xs">{{ error }}</div>

      <div class="flex gap-3 mt-5">
        <button class="flex-1 ui-button-secondary" @click="cancel">{{ t('char_import_cancel') }}</button>
        <button class="flex-1 ui-button-primary" @click="confirmImport">{{ t('char_import_confirm') }}</button>
      </div>
    </div>

    <!-- Step: success -->
    <div v-else-if="step === 'success'" class="text-center py-4">
      <div class="ui-status-success w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <h3 class="text-base font-bold" style="color:var(--color-text)">{{ t('char_import_success') }}</h3>
      <p class="text-xs mt-1" style="color:var(--color-text-muted)">{{ t('char_import_in_library', { name: parsedChar?.name }) }}</p>
      <div class="flex gap-3 mt-6">
        <button class="flex-1 ui-button-secondary" @click="viewCharacter">{{ t('char_import_view') }}</button>
        <button class="flex-1 ui-button-primary" @click="startChat">{{ t('start_chat') }}</button>
      </div>
    </div>
  </AppModal>
</template>
