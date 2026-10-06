<script setup lang="ts">
/**
 * AI Toolkit 工作区：5 个 AI 生成器（人设 / 开场白 / 世界书条目 / 正则脚本 / 文本优化）。
 * BYOK：复用 /app 的设置（useToolAI + stores/app.settings），key 只存浏览器本地；
 * 未配置时顶部显示提示条并引导打开 SettingsModal（ui.open('settings')）。
 * at_* 文案存于 i18n/fragments/ai-toolkit.json，运行时合并进 vue-i18n（locale 切换后重合并）。
 * 生成选项（输出语言 / 温度）放在骨架层，五个生成器共享；面板用 v-show 保持各生成器状态。
 */
import { useToolboxStore } from '~/stores/toolbox';
import { useToolAI } from '~/composables/useToolAI';
import { AI_OUTPUT_LANGS, mergeAiToolkitI18n } from '~/utils/st/regex-script';

const toolbox = useToolboxStore();
const ui = useUiStore();
const i18n = useI18n();
const { t } = i18n;

// 片段运行时合并：SSR 与客户端都执行；切换语言时 lazy loader 会整体替换该语言消息，需重新合并
mergeAiToolkitI18n(i18n);
watch(() => i18n.locale.value, () => mergeAiToolkitI18n(i18n));

onMounted(() => toolbox.load());

/* ------------------------------ tab 导航（5 个生成器） ------------------------------ */

const TABS = [
  { id: 'persona', icon: '🎭', key: 'at_tab_persona' },
  { id: 'greetings', icon: '💬', key: 'at_tab_greetings' },
  { id: 'worldbook', icon: '📖', key: 'at_tab_worldbook' },
  { id: 'regex', icon: '⚡', key: 'at_tab_regex' },
  { id: 'polish', icon: '✨', key: 'at_tab_polish' },
];
const tab = ref('persona');

/* ------------------------------ 生成选项（输出语言 / 温度） ------------------------------ */

/** 输出语言默认跟随界面语言（站点支持的语言里没有的回退英文） */
const lang = ref(AI_OUTPUT_LANGS.some((l) => l.value === i18n.locale.value) ? i18n.locale.value : 'en');
const temp = ref(0.8);

const TEMPS = [
  { value: 0.6, key: 'at_temp_low' },
  { value: 0.8, key: 'at_temp_mid' },
  { value: 1.1, key: 'at_temp_high' },
];

/* ------------------------------ BYOK ------------------------------ */

const aiProbe = useToolAI();
const configured = computed(() => aiProbe.isConfigured());

function openSettings() {
  ui.open('settings');
}
</script>

<template>
  <div class="ui-panel-flat">
    <!-- BYOK 提示条 -->
    <div v-if="!configured" class="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-champagne/50 bg-rose-tint px-3 py-2.5">
      <span class="text-sm text-plum">🔑 {{ t('at_byok_hint') }}</span>
      <button type="button" class="ui-button ui-button-secondary ui-button-xs ml-auto" @click="openSettings">
        {{ t('at_byok_open') }}
      </button>
    </div>

    <!-- tab 导航 -->
    <div class="flex flex-wrap items-center gap-1.5 border-b border-border-warm pb-3">
      <button
        v-for="tb in TABS"
        :key="tb.id"
        type="button"
        class="ui-chip"
        :class="{ active: tab === tb.id }"
        @click="tab = tb.id"
      >{{ tb.icon }} {{ t(tb.key) }}</button>
    </div>

    <!-- 生成选项：输出语言 / 温度（五个生成器共享） -->
    <div class="mt-3 flex flex-wrap items-center gap-4">
      <label class="flex items-center gap-1.5 text-sm">
        <span class="font-semibold">{{ t('at_opt_lang') }}</span>
        <select v-model="lang" class="ui-input ui-input-compact">
          <option v-for="l in AI_OUTPUT_LANGS" :key="l.value" :value="l.value">{{ t(l.labelKey) }}</option>
        </select>
      </label>
      <label class="flex items-center gap-1.5 text-sm">
        <span class="font-semibold">{{ t('at_opt_temp') }}</span>
        <select v-model="temp" class="ui-input ui-input-compact">
          <option v-for="op in TEMPS" :key="op.value" :value="op.value">{{ t(op.key) }} · {{ op.value }}</option>
        </select>
      </label>
    </div>

    <!-- 生成器面板（v-show 保持各生成器表单与输出状态） -->
    <div class="mt-4">
      <ATPersona v-show="tab === 'persona'" :lang="lang" :temp="temp" />
      <ATGreetings v-show="tab === 'greetings'" :lang="lang" :temp="temp" />
      <ATWorldbook v-show="tab === 'worldbook'" :lang="lang" :temp="temp" />
      <ATRegex v-show="tab === 'regex'" :lang="lang" :temp="temp" />
      <ATPolish v-show="tab === 'polish'" :lang="lang" :temp="temp" />
    </div>

    <p class="mt-6 text-center text-xs text-plum-muted">{{ t('at_local_note') }}</p>

    <!-- 全局弹窗（BYOK 设置 / 确认框） -->
    <SettingsModal />
    <AppDialogModal />
  </div>
</template>
