<script setup lang="ts">
import DOMPurify from 'dompurify';
import { useChat } from '~/composables/useChat';

const { t } = useI18n();

const props = defineProps<{
  role: 'user' | 'assistant' | string;
  content: string;
  cot?: string;
  attachments?: any[];
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

/** 图片附件（原版 renderMessageAttachments，仅渲染 type=image） */
const imageAttachments = computed(() => {
  if (!props.attachments || !Array.isArray(props.attachments)) return [];
  return props.attachments.filter((a: any) => a && a.type === 'image' && a.dataUrl);
});
</script>

<template>
  <div class="msg-wrapper flex flex-col w-full" :class="role === 'user' ? 'msg-user items-end' : 'msg-assistant items-start'">
    <div v-if="senderName" class="text-[11px] text-zinc-500 mb-1 px-1">{{ senderName }}</div>
    <div class="msg-bubble max-w-[85%] sm:max-w-[78%]" :class="{ 'typing-cursor': streaming }">
      <details v-if="cot" class="msg-cot" :class="{ streaming }">
        <summary>{{ t('cot_block_title') }}</summary>
        <div class="msg-cot-content">{{ cot }}</div>
      </details>
      <!-- 图片附件（ComfyUI 生成结果等） -->
      <div v-for="(att, i) in imageAttachments" :key="i" class="msg-attachment-image my-1">
        <img :src="att.dataUrl" :alt="att.filename || 'image'" loading="lazy" class="rounded-xl max-w-full max-h-80 object-cover">
      </div>
      <div v-if="safeHtml" class="whitespace-pre-wrap" v-html="safeHtml" />
    </div>
  </div>
</template>
