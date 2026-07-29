<script setup lang="ts">
// Google Consent Mode v2 横幅：用户选择后镜像到 gtag('consent','update',...)。
// 默认 denied 已在 nuxt.config 的 app.head.script 里、gtag.js 加载前同步设好；
// 这里只在「接受」时翻成 granted、或「拒绝」时再次确认 denied。
const STORAGE_KEY = 'cookie-consent';
const { t } = useI18n();
const dismissed = ref(false);

function updateConsent(state: 'granted' | 'denied') {
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
}

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const accepted = stored === 'accepted';
  dismissed.value = accepted || stored === 'rejected';
  if (accepted) updateConsent('granted');
});

function accept() {
  localStorage.setItem(STORAGE_KEY, 'accepted');
  updateConsent('granted');
  dismissed.value = true;
}
function reject() {
  localStorage.setItem(STORAGE_KEY, 'rejected');
  updateConsent('denied');
  dismissed.value = true;
}
</script>

<template>
  <ClientOnly>
    <Transition name="cookie-fade">
      <aside
        v-if="!dismissed"
        class="cookie-banner fixed bottom-[max(1rem,var(--safe-bottom))] left-[max(1rem,var(--safe-left))] z-[1000] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-4 rounded-brand-lg bg-plum p-5 text-ivory shadow-[0_24px_60px_rgba(40,20,30,0.30)] ring-1 ring-ivory/10"
        role="dialog"
        aria-label="Cookie consent"
      >
        <div class="flex items-start gap-3">
          <svg
            class="mt-0.5 h-6 w-6 shrink-0 text-champagne"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.7"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M21.6 11.5a3.5 3.5 0 0 1-3.5-3.5 3.5 3.5 0 0 1-3.5-3.5 8.5 8.5 0 1 0 7 7Z" />
            <circle cx="8.5" cy="9.5" r=".7" fill="currentColor" stroke="none" />
            <circle cx="13" cy="15" r=".7" fill="currentColor" stroke="none" />
            <circle cx="9" cy="14.5" r=".7" fill="currentColor" stroke="none" />
            <circle cx="15" cy="11" r=".7" fill="currentColor" stroke="none" />
          </svg>
          <p class="cookie-text m-0 text-[13px] leading-relaxed text-ivory/85">
            <span>{{ t('cookie_message') }}</span>
            <NuxtLink to="/privacy" class="ml-1 whitespace-nowrap font-medium text-champagne underline decoration-champagne/40 underline-offset-2 hover:decoration-champagne">{{ t('nav_privacy') }}</NuxtLink>
          </p>
        </div>
        <div class="flex shrink-0 gap-2">
          <button
            class="flex-1 rounded-md border border-ivory/25 px-4 py-2 text-[13px] font-semibold text-ivory/90 transition-colors hover:bg-ivory/10"
            @click="reject"
          >
            {{ t('cookie_reject') }}
          </button>
          <button
            class="flex-1 rounded-md bg-rose-accent px-4 py-2 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-rose-deep"
            @click="accept"
          >
            {{ t('cookie_accept') }}
          </button>
        </div>
      </aside>
    </Transition>
  </ClientOnly>
</template>

<style scoped>
.cookie-text :deep(a) {
  text-decoration: underline;
}

.cookie-fade-enter-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.cookie-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.98);
}
</style>
