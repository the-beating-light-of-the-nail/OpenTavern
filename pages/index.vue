<script setup lang="ts">
import { useAppStore } from '~/stores/app';

const store = useAppStore();

// 主题 / 效能模式应用（客户端，响应式跟随 settings）
const { watch: watchTheme } = useTheme();
onMounted(() => watchTheme());
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
