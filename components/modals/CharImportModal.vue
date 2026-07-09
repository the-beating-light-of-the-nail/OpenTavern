<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <AppModal modal-id="importModal" name="charImport" max-width="max-w-md" closable>
    <h2 class="text-lg font-bold text-zinc-100 mb-5">{{ t('import_title') }}</h2>
    <p class="text-sm text-zinc-400 mb-4">
      <span>{{ t('import_desc') }}</span>
      <code class="text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">chara_card_v1 / v2 / v3</code>
      <span>{{ t('import_desc2') }}</span>
    </p>
    <label class="flex flex-col items-center gap-3 p-8 glass rounded-2xl border-dashed border-2 border-white/10 hover:border-amber-500/30 cursor-pointer transition-all">
      <span class="text-xs font-semibold uppercase tracking-wider text-zinc-500">Prompt</span>
      <span class="text-sm text-zinc-400">{{ t('import_click_hint') }}</span>
      <input type="file" id="importFileInput" accept=".json,.png" class="hidden">
    </label>
    <p id="importStatus" class="text-xs text-zinc-500 mt-3 text-center hidden" />
  </AppModal>
</template>
