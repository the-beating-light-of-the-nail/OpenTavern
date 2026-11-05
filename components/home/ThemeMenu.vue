<script setup lang="ts">
/**
 * 主题菜单（复刻 tools.laopobao.online 顶栏）：
 * 亮色主题 / 暗色主题 / 跟随系统，当前项左侧显示 check。
 */
type ThemeChoice = 'new-light' | 'new-dark' | 'system';

const { t } = useI18n();
const { themeMode, setTheme } = useTheme();
const route = useRoute();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

const options: { value: ThemeChoice; labelKey: string }[] = [
  { value: 'new-light', labelKey: 'theme_light' },
  { value: 'new-dark', labelKey: 'theme_dark' },
  { value: 'system', labelKey: 'theme_system' },
];

/** classic 是历史深色玻璃主题；在菜单里按暗色显示勾选 */
const activeMode = computed<ThemeChoice>(() =>
  themeMode.value === 'classic' ? 'new-dark' : (themeMode.value as ThemeChoice),
);

function choose(mode: ThemeChoice) {
  setTheme(mode);
  open.value = false;
}

function onPointerDown(e: PointerEvent) {
  if (!open.value) return;
  if (root.value && !root.value.contains(e.target as Node)) open.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false;
}

watch(() => route.fullPath, () => { open.value = false; });

onMounted(() => {
  document.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onPointerDown);
  document.removeEventListener('keydown', onKeydown);
});
</script>

<template>
  <div ref="root" class="wb-theme">
    <button
      type="button"
      class="wb-theme-trigger"
      :aria-label="t('theme_menu_label')"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span class="wb-theme-icons" aria-hidden="true">
        <HubIcon name="sun" size="1.1rem" class="wb-theme-icon wb-theme-sun" />
        <HubIcon name="moon" size="1.1rem" class="wb-theme-icon wb-theme-moon" />
      </span>
    </button>

    <div v-if="open" class="wb-theme-menu" role="menu">
      <button
        v-for="opt in options"
        :key="opt.value"
        type="button"
        role="menuitemradio"
        :aria-checked="activeMode === opt.value"
        class="wb-theme-item"
        @click="choose(opt.value)"
      >
        <HubIcon
          name="check"
          size="1rem"
          class="wb-theme-check"
          :class="{ 'is-visible': activeMode === opt.value }"
        />
        <span>{{ t(opt.labelKey) }}</span>
      </button>
    </div>
  </div>
</template>
