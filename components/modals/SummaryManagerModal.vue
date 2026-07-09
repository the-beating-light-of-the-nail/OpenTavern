<script setup lang="ts">
const { t } = useI18n();
const mode = ref<'recent' | 'range'>('recent');
const recentTurns = ref(8);
const rangeStart = ref(1);
const rangeEnd = ref(12);
</script>

<template>
  <AppModal modal-id="summaryManagerModal" name="summaryManager" max-width="max-w-3xl" closable>
    <h2 class="text-lg font-bold text-zinc-100 mb-4">{{ t('summary_manager_title') }}</h2>
    <div class="flex flex-col md:flex-row gap-4">
      <!-- 历史总结 -->
      <div class="md:w-5/12 md:border-r md:border-white/10 flex flex-col">
        <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{{ t('summary_history_section') }}</span>
        <div id="summaryManagerList" class="space-y-3 text-sm max-h-[50vh] overflow-y-auto pr-1">
          <p class="text-xs text-zinc-500 text-center py-6">—</p>
        </div>
      </div>
      <!-- 新建总结 -->
      <div class="md:w-7/12 flex flex-col">
        <span class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">{{ t('summary_new_section') }}</span>
        <div class="flex rounded-xl glass p-1 mb-4 w-fit">
          <button class="px-4 py-1.5 text-sm rounded-lg font-medium transition-all" :class="mode==='recent'?'bg-white/10 text-zinc-100':'text-zinc-400 hover:text-zinc-200'" @click="mode='recent'">{{ t('summary_mode_recent') }}</button>
          <button class="px-4 py-1.5 text-sm rounded-lg font-medium transition-all" :class="mode==='range'?'bg-white/10 text-zinc-100':'text-zinc-400 hover:text-zinc-200'" @click="mode='range'">{{ t('summary_mode_custom') }}</button>
        </div>
        <div v-show="mode==='recent'" class="flex items-center gap-3 mb-3">
          <span class="text-sm text-zinc-400">{{ t('summary_manual_desc') }}</span>
          <input v-model.number="recentTurns" type="number" min="2" max="60" class="w-16 px-2.5 py-1.5 glass rounded-lg text-sm text-zinc-200 text-center focus:outline-none focus:ring-2 focus:ring-amber-500/30">
          <span class="text-sm text-zinc-400">{{ t('summary_manual_turns') }}</span>
        </div>
        <div v-show="mode==='range'" class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-xs text-zinc-400 mb-1">{{ t('summary_range_start') }}</label>
            <input v-model.number="rangeStart" type="number" min="1" class="w-full px-3 py-1.5 glass rounded-lg text-sm text-zinc-200">
          </div>
          <div>
            <label class="block text-xs text-zinc-400 mb-1">{{ t('summary_range_end') }}</label>
            <input v-model.number="rangeEnd" type="number" min="2" class="w-full px-3 py-1.5 glass rounded-lg text-sm text-zinc-200">
          </div>
        </div>
        <button id="summaryGenerateBtn" class="mt-2 w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20 transition-all active:scale-[0.985]">{{ t('summary_generate') }}</button>
      </div>
    </div>
  </AppModal>
</template>
