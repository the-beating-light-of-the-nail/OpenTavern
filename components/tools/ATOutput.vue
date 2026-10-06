<script setup lang="ts">
/**
 * AI Toolkit 生成器共用输出面板：
 * - 错误条（ai.error）与提示条（解析失败等 notice）显示在输出区上方
 * - 流式输出 pre（running 时末尾光标闪烁 + 右上角停止按钮）
 * - 完成后（!running）渲染默认插槽：父级放动作按钮组 / 解析结果（自行用 v-if 控制）
 */
defineProps<{
  running: boolean;
  error?: string;
  notice?: string;
  output?: string;
}>();

defineEmits<{ stop: [] }>();

const { t } = useI18n();
</script>

<template>
  <div class="mt-4">
    <p v-if="error" class="ui-alert-danger mb-2 rounded-lg px-3 py-2 text-xs leading-relaxed">{{ error }}</p>
    <p v-if="notice" class="ui-alert-danger mb-2 rounded-lg px-3 py-2 text-xs leading-relaxed">{{ notice }}</p>

    <div v-if="output || running" class="relative">
      <pre class="max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-surface p-3 text-sm leading-relaxed">{{ output }}<span v-if="running" class="animate-pulse text-rose-accent" aria-hidden="true">▌</span></pre>
      <button
        v-if="running"
        type="button"
        class="ui-button ui-button-danger-ghost ui-button-xs absolute right-2 top-2"
        @click="$emit('stop')"
      >■ {{ t('at_stop') }}</button>
    </div>

    <slot v-if="!running" />
  </div>
</template>
