<script setup lang="ts">
/**
 * 旧收录页顶部引流横幅。
 *
 * 用途：旧 URL 已被搜索引擎收录，保留 200 继续承接自然搜索流量；
 * 页首醒目位置把用户与内链权重导向新版页面。注意：不要给旧页加
 * 301/canonical 指向新版（会合并收录、丢掉旧 URL 的搜索入口），
 * 引流只靠这条普通内链。
 *
 * 文案内建 en/zh-CN 双语，其余语言回退英文（与 tools_* 键现状一致）。
 */
const props = defineProps<{
  /** 新版页面路由（经 localePath 本地化） */
  to: string;
  /** 新版页面名称，用于标题与按钮文案 */
  nameZh: string;
  nameEn: string;
}>();

const { locale } = useI18n();
const localePath = useLocalePath();
const isZh = computed(() => locale.value === 'zh-CN');
const name = computed(() => (isZh.value ? props.nameZh : props.nameEn));
const href = computed(() => localePath(props.to));
</script>

<template>
  <aside class="pub-banner">
    <span class="pub-banner-badge">{{ isZh ? '全新升级' : 'UPDATED' }}</span>
    <div class="pub-banner-body">
      <strong>{{ isZh ? `本页已升级为「${name}」` : `This page has been rebuilt as the ${name}` }}</strong>
      <p>
        {{
          isZh
            ? '新版内容更全、体验更好，并已加入站内导航；本页仍保留给搜索访问。'
            : 'The new hub is richer, faster and linked across the site. This legacy page stays online for search traffic.'
        }}
      </p>
    </div>
    <NuxtLink :to="href" class="rc-btn-primary rc-btn-compact">
      {{ isZh ? `前往新版${name} →` : `Open the new ${name} →` }}
    </NuxtLink>
  </aside>
</template>

<style scoped>
.pub-banner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem 1.15rem;
  padding: 1.05rem 1.3rem;
  border-radius: 1.1rem;
  border: 1px solid color-mix(in srgb, var(--color-primary) 42%, transparent);
  background:
    radial-gradient(64% 120% at 0% 0%, color-mix(in srgb, var(--color-primary) 13%, transparent), transparent 72%),
    var(--color-surface-soft);
  box-shadow: 0 14px 38px -18px color-mix(in srgb, var(--color-primary) 34%, transparent);
}
.pub-banner-badge {
  flex-shrink: 0;
  padding: 0.28rem 0.62rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: var(--color-on-primary);
}
.pub-banner-body {
  flex: 1 1 260px;
  min-width: 0;
}
.pub-banner-body strong {
  display: block;
  font-size: 1rem;
  color: var(--color-text);
}
.pub-banner-body p {
  margin: 0.3rem 0 0;
  font-size: 0.8rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}
.pub-banner .rc-btn-primary {
  flex-shrink: 0;
  white-space: nowrap;
}
</style>
