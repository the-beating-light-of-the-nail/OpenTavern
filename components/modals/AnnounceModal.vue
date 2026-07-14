<script setup lang="ts">
import { useAppStore } from '~/stores/app';
const store = useAppStore();
const { t, locale, setLocale } = useI18n();
const ui = useUiStore();

const cards = computed(() => Object.values(store.characters || {}));
function pick(code: string) { setLocale(code as any); }
function close() { ui.close('announce'); }
</script>

<template>
  <AppModal modal-id="announceModal" name="announce" max-width="max-w-lg" closable>
    <div class="text-xs mb-1 uppercase tracking-wider text-zinc-500">RoleChat AI</div>
    <h2 class="text-xl font-bold text-zinc-100">{{ t('announce_title') }}</h2>
    <p class="text-xs text-zinc-400 mt-0.5">{{ t('announce_subtitle') }}</p>

    <div class="flex items-center justify-center gap-2 my-4">
      <span class="text-[10px] text-zinc-500 flex-shrink-0">{{ t('announce_lang_label') }}</span>
      <div class="flex items-center glass rounded-xl p-0.5 border-white/5">
        <button v-for="l in [{c:'en',n:'EN'},{c:'zh-CN',n:'简'},{c:'zh-TW',n:'繁'}]" :key="l.c" class="announce-lang-btn lang-btn px-2.5 py-1 rounded-lg text-xs font-semibold transition-all" :class="locale===l.c?'active':''" @click="pick(l.c)">{{ l.n }}</button>
      </div>
    </div>

    <div class="space-y-3 mb-5 text-sm">
      <div v-for="n in [1,2,3]" :key="n" class="flex gap-3 p-3 glass rounded-2xl">
        <div class="w-6 h-6 flex-shrink-0 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">{{ n }}</div>
        <div class="flex-1">
          <div class="font-medium text-zinc-200">{{ t(('announce_step'+n+'_title') as any) }}</div>
          <div class="text-xs text-zinc-400 mt-0.5">{{ t(('announce_step'+n+'_desc') as any) }}</div>
        </div>
      </div>
    </div>

    <div class="text-[11px] text-zinc-400 mb-4 px-1">{{ t('announce_hint') }}</div>
    <label class="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer select-none mb-4 px-1">
      <input type="checkbox" class="accent-amber-500 w-4 h-4 flex-shrink-0">
      <span>{{ t('announce_dont_show') }}</span>
    </label>
    <button id="announceGotItBtn" class="w-full px-4 py-3 rounded-2xl text-sm font-semibold bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-lg shadow-amber-500/20 transition-all" @click="close">{{ t('announce_got_it') }}</button>

    <div class="mt-5 pt-4 border-t border-white/10 text-center">
      <div class="text-[10px] text-zinc-500 leading-tight">
        <span>{{ t('announce_credits_main') }}</span><br>
        <span>{{ t('announce_credits_test') }}</span>
      </div>
    </div>
  </AppModal>
</template>
