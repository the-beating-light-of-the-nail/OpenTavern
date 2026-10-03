<script setup lang="ts">
/** 字段标签包装：label + 可选说明 + 默认插槽 */
defineProps<{
  label: string;
  hint?: string;
  required?: boolean;
}>();
</script>

<template>
  <div>
    <label class="mb-1 flex items-baseline gap-1.5 text-sm font-semibold">
      {{ label }}
      <span v-if="required" class="text-rose-deep" aria-hidden="true">*</span>
    </label>
    <p v-if="hint" class="mb-1.5 text-xs leading-relaxed text-plum-muted">{{ hint }}</p>
    <slot />
  </div>
</template>
