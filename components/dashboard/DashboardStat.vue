<script setup lang="ts">
defineProps<{
  stat: {
    label: string;
    value: number;
    icon: string;
    color: string;
    to: string;
  };
}>();
</script>

<template>
  <NuxtLink :to="stat.to" class="cp-stat">
    <span class="cp-stat-icon" :class="`is-${stat.color}`">
      <HubIcon :name="stat.icon as any" size="21" />
    </span>
    <span class="cp-stat-info">
      <span class="cp-stat-number">{{ stat.value }}</span>
      <span class="cp-stat-label">{{ stat.label }}</span>
    </span>
  </NuxtLink>
</template>
