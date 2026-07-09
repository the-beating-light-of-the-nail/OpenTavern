<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <AppModal modal-id="charEditorModal" name="charEditor" max-width="max-w-2xl">
    <h2 class="text-lg font-bold text-zinc-100 mb-5">{{ t('char_editor_title') }}</h2>
    <div class="space-y-4 pr-1">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_name') }}</label>
          <input id="charEditName" type="text" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all">
        </div>
        <div>
          <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_tags') }}</label>
          <input id="charEditTags" type="text" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all" placeholder="tag1, tag2, tag3">
        </div>
      </div>
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_description') }}</label>
        <textarea id="charEditDescription" rows="6" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_personality') }}</label>
          <textarea id="charEditPersonality" rows="3" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
        </div>
        <div>
          <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_scenario') }}</label>
          <textarea id="charEditScenario" rows="3" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
        </div>
      </div>
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_first_mes') }}</label>
        <textarea id="charEditFirstMes" rows="4" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
      </div>
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_mes_example') }}</label>
        <textarea id="charEditMesExample" rows="4" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
      </div>
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_system_prompt') }}</label>
        <textarea id="charEditSystemPrompt" rows="2" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
      </div>
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_post_history') }}</label>
        <textarea id="charEditPostHistory" rows="2" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
      </div>
      <div>
        <label class="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">{{ t('char_editor_creator_notes') }}</label>
        <textarea id="charEditCreatorNotes" rows="2" class="w-full mt-1 px-3 py-2 glass rounded-xl text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all resize-none" />
      </div>
    </div>
    <div class="flex gap-3 mt-5">
      <button class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-zinc-300 transition-all">{{ t('char_editor_cancel') }}</button>
      <button class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all">{{ t('char_editor_save') }}</button>
    </div>
  </AppModal>
</template>
