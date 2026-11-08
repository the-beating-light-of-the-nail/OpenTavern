<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { getCharacterBySlug } from '~/data';
import { seoCharacterToCardEntry, findExistingConvForCharacter } from '~/utils/seo-to-card';

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const { $i18n } = useNuxtApp();
const { locale } = useI18n();

useSeoMeta({
  title: 'OpenTavern — AI Character Chat',
  description:
    'OpenTavern is a browser-based AI character chat app with a card library, World Info, conversation summaries and your own API key. No install.',
  ogTitle: 'OpenTavern — AI Character Chat',
  ogDescription:
    'Import SillyTavern character cards, edit world books, summarize long chats and bring your own API key. Everything stays in your browser.',
  ogType: 'website',
});

useHead({
  link: [{ rel: 'canonical', key: 'canonical', href: 'https://www.rolechatai.com/opentavern' }],
});

onMounted(async () => {
  // 恢复用户上次在应用内选择的 UI 语言；/opentavern 固定在根路径，不能触发 locale 前缀导航
  const saved = store.settings.lang;
  const appLocales = new Set(['en', 'zh-CN', 'zh-TW']);
  if (appLocales.has(saved) && saved !== locale.value) {
    try {
      await ($i18n as any).loadLocaleMessages?.(saved);
    } catch { /* 语言包失败时保持当前语言 */ }
    locale.value = saved;
    if (typeof document !== 'undefined') document.documentElement.lang = saved;
  }

  // opentavern.app 首次进入落在 “New Chat” 对话页，而不是卡片库
  store.currentView = 'chat';
});

// 保留页 /app?character=<slug> 301 过来后，直接建立/复用该角色的会话
watch(
  () => [store.ready, route.query.character] as const,
  ([ready, slug]) => {
    if (!ready) return;
    if (!slug || typeof slug !== 'string') return;
    const seo = getCharacterBySlug(slug, $i18n.locale.value);
    if (!seo) {
      router.replace({ query: { ...route.query, character: undefined } });
      return;
    }
    const existing = findExistingConvForCharacter(store, slug);
    if (existing) {
      store.setActiveConv(existing);
      store.currentView = 'chat';
    } else {
      store.createConversation(seoCharacterToCardEntry(seo));
    }
    router.replace({ query: { ...route.query, character: undefined } });
  },
  { immediate: true },
);
</script>

<template>
  <div class="ot-app h-[100dvh] overflow-hidden">
    <h1 class="sr-only">OpenTavern — AI Character Chat</h1>

    <ClientOnly>
      <div class="flex h-full">
        <OtSidebar />
        <div class="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <LibraryView v-if="store.currentView === 'library'" />
          <ChatView v-else />
        </div>
      </div>

      <ModalsHost />
      <OtAuthorNoteModal />
      <OtWelcomeModal />

      <template #fallback>
        <div class="flex h-full items-center justify-center text-sm" style="color:#8e8e8e">OpenTavern</div>
      </template>
    </ClientOnly>

    <noscript>
      <div class="p-8">
        <h2>OpenTavern — AI Character Chat</h2>
        <p>OpenTavern needs JavaScript for the chat interface. Enable JavaScript to import character cards and start a conversation.</p>
      </div>
    </noscript>
  </div>
</template>
