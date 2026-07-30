<script setup lang="ts">
// 广告切换面板：仅 ?adpanel=1 时显示（只自己可见）。
// 每个广告一个独立 toggle，选择存 localStorage（自己浏览器记住）。Social Bar 等脚本型关闭后可能需刷新。
import { useAdPanel } from '~/composables/useAdPanel';

const route = useRoute();
const visible = computed(() => route.query.adpanel === '1');
const { state, set, reset, registry } = useAdPanel();
const collapsed = ref(false);
</script>

<template>
  <ClientOnly>
    <div v-if="visible" class="ad-panel">
      <div class="ad-panel__head">
        <span class="ad-panel__title">广告切换</span>
        <button class="ad-panel__toggle" @click="collapsed = !collapsed">
          {{ collapsed ? '展开' : '收起' }}
        </button>
      </div>

      <ul v-show="!collapsed" class="ad-panel__list">
        <li v-for="ad in registry" :key="ad.id">
          <label class="ad-panel__row">
            <input
              type="checkbox"
              :checked="state[ad.id]"
              @change="set(ad.id, !state[ad.id])"
            />
            <span>{{ ad.label }}</span>
          </label>
        </li>
      </ul>

      <button v-show="!collapsed" class="ad-panel__reset" @click="reset">恢复默认</button>
    </div>
  </ClientOnly>
</template>

<style scoped>
.ad-panel {
  position: fixed;
  right: 12px;
  bottom: 12px;
  z-index: 60;
  width: 230px;
  max-height: 70vh;
  overflow: auto;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid var(--color-border-warm, #e7d9c9);
  background: color-mix(in srgb, var(--color-bg, #fff) 92%, transparent);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.18);
  font-size: 12px;
  color: var(--color-text, #3a2f28);
}
.ad-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.ad-panel__title { font-weight: 700; }
.ad-panel__toggle {
  padding: 2px 8px;
  font-size: 11px;
  border: 1px solid var(--color-border-warm, #e7d9c9);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}
.ad-panel__list { margin: 0; padding: 0; list-style: none; }
.ad-panel__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 4px;
  border-radius: 6px;
  cursor: pointer;
}
.ad-panel__row:hover { background: color-mix(in srgb, var(--color-primary, #b66) 8%, transparent); }
.ad-panel__reset {
  margin-top: 6px;
  width: 100%;
  padding: 5px;
  font-size: 11px;
  border: 1px solid var(--color-border-warm, #e7d9c9);
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}
</style>
