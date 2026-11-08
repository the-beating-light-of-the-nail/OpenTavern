<script setup lang="ts">
import { useAppStore } from '~/stores/app';

const store = useAppStore();
const { locale } = useI18n();
const { $i18n } = useNuxtApp();

async function switchLang(code: 'zh-CN' | 'zh-TW' | 'en') {
  store.settings.lang = code;
  store.persist();
  try {
    await ($i18n as any).loadLocaleMessages?.(code);
  } catch { /* noop */ }
  locale.value = code;
  if (typeof document !== 'undefined') document.documentElement.lang = code;
}

const KEY = 'opentavern-welcome-dismissed';
const visible = ref(false);
const dontShow = ref(false);
const ready = ref(false);

onMounted(() => {
  try {
    visible.value = localStorage.getItem(KEY) !== '1';
  } catch {
    visible.value = true;
  }
  ready.value = true;
});

const copy = computed(() => {
  if (locale.value === 'en') {
    return {
      title: 'Welcome to OpenTavern',
      subtitle: 'Quick start guide · 3 steps',
      steps: [
        { n: '1', title: 'Import a character card', desc: 'Click “Import” on the left and upload a SillyTavern .json or .png card (recommended).' },
        { n: '2', title: 'Or create one manually', desc: 'Click “New” to make a simple character and start a conversation.' },
        { n: '3', title: 'Configure the API (required)', desc: 'Open Settings (⚙️) and enter your API Endpoint and Key. OpenAI-compatible endpoints are supported.' },
      ],
      note: 'Chats support auto-summary, World Info and multiple conversations. Have fun!',
      dontShow: 'Don’t show this again',
      start: 'Get started',
      close: 'Close',
    };
  }
  if (locale.value === 'zh-TW') {
    return {
      title: '歡迎使用 OpenTavern',
      subtitle: '快速開始指南 · 3 步上手',
      steps: [
        { n: '1', title: '匯入角色卡', desc: '點擊左側「匯入」按鈕，上傳 SillyTavern 格式的 .json 或 .png 角色卡（推薦）' },
        { n: '2', title: '或手動建立角色', desc: '點擊「新建」按鈕，快速建立一個簡單角色並開始對話' },
        { n: '3', title: '設定 API（關鍵）', desc: '點擊右上角 ⚙️ 設定，填入 API Endpoint 和 Key（支援 OpenAI 及相容介面）' },
      ],
      note: '對話支援自動總結、世界書（World Info）、多對話管理等功能。祝你玩得開心！',
      dontShow: '下次不再顯示此公告',
      start: '開始使用',
      close: '關閉',
    };
  }
  return {
    title: '欢迎使用 OpenTavern',
    subtitle: '快速开始指南 · 3 步上手',
    steps: [
      { n: '1', title: '导入角色卡', desc: '点击左侧「导入」按钮，上传 SillyTavern 格式的 .json 或 .png 角色卡（推荐）' },
      { n: '2', title: '或手动创建角色', desc: '点击「新建」按钮，快速创建一个简单角色并开始对话' },
      { n: '3', title: '配置 API（关键）', desc: '点击右上角 ⚙️ 设置，填入 API Endpoint 和 Key（支持 OpenAI 及兼容接口）' },
    ],
    note: '对话支持自动总结、世界书（World Info）、多对话管理等功能。祝你玩得开心！',
    dontShow: '下次不再显示此公告',
    start: '开始使用',
    close: '关闭',
  };
});

function close() {
  if (dontShow.value) {
    try {
      localStorage.setItem(KEY, '1');
    } catch { /* noop */ }
  }
  visible.value = false;
}

function start() {
  close();
}
</script>

<template>
  <div v-if="ready && visible" class="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4">
    <div class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" style="color:#3c3c3c">
      <div class="flex items-start gap-3">
        <span class="text-2xl">✨</span>
        <div class="min-w-0 flex-1">
          <h2 class="text-lg font-bold">{{ copy.title }}</h2>
          <p class="mt-0.5 text-xs" style="color:#8e8e8e">{{ copy.subtitle }}</p>
        </div>
        <button class="rounded-lg px-2 py-1 text-lg leading-none hover:bg-black/5" :aria-label="copy.close" @click="close">&times;</button>
      </div>

      <div class="mt-4 flex items-center gap-2">
        <span class="text-[11px] font-semibold uppercase tracking-wider" style="color:#8e8e8e">Language</span>
        <button class="ot-chip rounded-md px-2 py-1 text-[11px] font-semibold" @click="switchLang('zh-CN')">简</button>
        <button class="ot-chip rounded-md px-2 py-1 text-[11px] font-semibold" @click="switchLang('zh-TW')">繁</button>
        <button class="ot-chip rounded-md px-2 py-1 text-[11px] font-semibold" @click="switchLang('en')">EN</button>
      </div>

      <ol class="mt-5 space-y-4">
        <li v-for="step in copy.steps" :key="step.n" class="flex gap-3">
          <span class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style="background:#d87557">{{ step.n }}</span>
          <div>
            <p class="text-sm font-semibold">{{ step.title }}</p>
            <p class="mt-1 text-xs leading-relaxed" style="color:#8e8e8e">{{ step.desc }}</p>
          </div>
        </li>
      </ol>

      <p class="mt-5 rounded-xl p-3 text-xs leading-relaxed" style="background:#f5f2ed;color:#5a534c">{{ copy.note }}</p>

      <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
        <label class="flex cursor-pointer items-center gap-2 text-xs" style="color:#8e8e8e">
          <input v-model="dontShow" type="checkbox" class="h-3.5 w-3.5 accent-[#d87557]" />
          {{ copy.dontShow }}
        </label>
        <button class="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors" style="background:#d87557" @click="start">
          {{ copy.start }}
        </button>
      </div>
    </div>
  </div>
</template>
