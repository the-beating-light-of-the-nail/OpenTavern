<script setup lang="ts">
const { t } = useI18n();
const ui = useUiStore();
function close() { ui.close('announce'); }
</script>

<template>
  <AppModal modal-id="announceModal" name="announce" max-width="max-w-lg" closable>
    <div class="text-xs mb-1 uppercase tracking-wider" style="color:var(--color-text-muted)">RoleChat AI</div>
    <h2 class="ui-modal-title" style="color:var(--color-text)">{{ t('announce_title') }}</h2>
    <p class="text-xs mt-0.5" style="color:var(--color-text-muted)">{{ t('announce_subtitle') }}</p>



    <div class="space-y-3 mb-5 text-sm">
      <div v-for="n in [1,2,3]" :key="n" class="flex gap-3 p-3 ui-panel ui-panel-flat rounded-xl">
        <div class="w-6 h-6 flex-shrink-0 rounded-xl flex items-center justify-center text-xs font-bold" style="background:color-mix(in srgb,var(--color-primary) 12%,transparent);color:var(--color-primary)">{{ n }}</div>
        <div class="flex-1">
          <div class="font-medium" style="color:var(--color-text)">{{ t(('announce_step'+n+'_title') as any) }}</div>
          <div class="text-xs mt-0.5" style="color:var(--color-text-muted)">{{ t(('announce_step'+n+'_desc') as any) }}</div>
        </div>
      </div>
    </div>

    <div class="text-[11px] mb-4 px-1" style="color:var(--color-text-muted)">{{ t('announce_hint') }}</div>
    <label class="flex items-center gap-2 text-sm cursor-pointer select-none mb-4 px-1" style="color:var(--color-text)">
      <input type="checkbox" class="w-4 h-4 flex-shrink-0" style="accent-color:var(--color-primary)">
      <span>{{ t('announce_dont_show') }}</span>
    </label>
    <button id="announceGotItBtn" class="w-full ui-button-primary" @click="close">{{ t('announce_got_it') }}</button>

    <div class="mt-5 pt-4 border-t text-center" style="border-color:var(--color-border)">
      <div class="text-[10px] leading-tight" style="color:var(--color-text-muted)">
        <span>{{ t('announce_credits_main') }}</span><br>
        <span>{{ t('announce_credits_test') }}</span>
      </div>
    </div>
  </AppModal>
</template>
