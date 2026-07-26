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
        class="cookie-banner fixed inset-x-0 bottom-0 z-[1000] flex flex-wrap items-center justify-center gap-4 border-t border-border-warm bg-ivory px-6 py-4 text-sm shadow-[0_-6px_24px_rgba(0,0,0,0.10)]"
        role="dialog"
        aria-label="Cookie consent"
      >
        <p class="cookie-text m-0 max-w-[640px] text-plum-faint">
          <span>{{ t('cookie_message') }}</span>
          <NuxtLink to="/privacy" class="ml-1 whitespace-nowrap text-plum underline hover:text-plum-light">{{ t('nav_privacy') }}</NuxtLink>
        </p>
        <div class="flex shrink-0 gap-3">
          <button
            class="rounded-md border border-border-warm px-5 py-1.5 text-sm font-semibold text-plum transition-colors hover:bg-rose-tint"
            @click="reject"
          >
            {{ t('cookie_reject') }}
          </button>
          <button
            class="rounded-md bg-rose-accent px-5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-rose-deep"
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.cookie-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.cookie-fade-enter-from,
.cookie-fade-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
