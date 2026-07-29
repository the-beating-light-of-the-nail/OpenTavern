<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { getCharacterBySlug } from '~/data';
import { seoCharacterToCardEntry, findExistingConvForCharacter } from '~/utils/seo-to-card';

const store = useAppStore();
const route = useRoute();
const router = useRouter();
const { $i18n } = useNuxtApp();

// 主题 / 效能模式应用（客户端，响应式跟随 settings）
const { watch: watchTheme } = useTheme();
onMounted(() => watchTheme());

/**
 * 处理 ?character=<slug>：从 SEO 角色页 / 角色卡 "Start Chat" 跳入。
 * 同时监听 store.ready 与 route.query.character：
 * - ready 首次翻 true：覆盖“首次进入 /app?character=slug（SPA 冷启动）”场景；
 * - query 变化：覆盖“已在 /app 内（Public Library）再点 Start Chat”场景——此时 ready 已是
 *   true、不再翻转，单纯监听 ready 不会触发，旧实现在这里静默失效。
 * 处理完清掉 query，避免刷新重复建会话。
 */
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
  <div>
    <ShaderBackground />
    <div id="main-layout" class="flex h-[100dvh] min-h-[100dvh] relative z-10">
      <AppSidebar />
      <div class="flex-1 flex flex-col overflow-hidden">
        <LibraryView v-if="store.currentView === 'library'" />
        <ChatView v-else />
      </div>
    </div>
    <ModalsHost />
  </div>
</template>
