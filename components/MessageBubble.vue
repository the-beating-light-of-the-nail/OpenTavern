<script setup lang="ts">
import DOMPurify from 'dompurify';
import { useChat } from '~/composables/useChat';

const props = defineProps<{
  role: 'user' | 'assistant' | string;
  content: string;
  cot?: string;
  senderName?: string;
  streaming?: boolean;
}>();

/** 将消息内容净化为安全 HTML（DOMPurify），保留换行 */
const safeHtml = computed(() => {
  const raw = String(props.content || '');
  if (!raw) return '';
  // 保留纯文本的换行（whitespace-pre-wrap 在 CSS 中处理）
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS: ['br', 'b', 'i', 'em', 'strong', 'span'], ALLOWED_ATTR: [] });
});
</script>

<template>
  <div class="msg-wrapper flex flex-col w-full" :class="role === 'user' ? 'msg-user items-end' : 'msg-assistant items-start'">
    <div v-if="senderName" class="text-[11px] text-zinc-500 mb-1 px-1">{{ senderName }}</div>
    <div class="msg-bubble max-w-[85%] sm:max-w-[78%]" :class="{ 'typing-cursor': streaming }">
      <details v-if="cot" class="msg-cot" :class="{ streaming }">
        <summary>思考过程</summary>
        <div class="msg-cot-content">{{ cot }}</div>
      </details>
      <div class="whitespace-pre-wrap" v-html="safeHtml" />
    </div>
  </div>
</template>
