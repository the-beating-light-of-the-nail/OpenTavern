<script setup lang="ts">
import { useAppStore } from '~/stores/app';
import { getCharacterBySlug } from '~/data/characters';
import { seoCharacterToCardEntry, findExistingConvForCharacter } from '~/utils/seo-to-card';

const store = useAppStore();
const route = useRoute();
const router = useRouter();

// 主题 / 效能模式应用（客户端，响应式跟随 settings）
const { watch: watchTheme } = useTheme();
onMounted(() => watchTheme());

/**
 * 处理 ?character=<slug>：从 SEO 角色页 / 角色卡 "Start Chat" 跳入。
 * 等 store 加载完成后：有已有会话则恢复，否则转换角色卡并新建会话。
 * 处理完清掉 query，避免刷新重复建会话。
 */
watch(
  () => store.ready,
  (ready) => {
    if (!ready) return;
    const slug = route.query.character;
    if (!slug || typeof slug !== 'string') return;
    const seo = getCharacterBySlug(slug);
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
