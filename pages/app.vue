<script setup lang="ts">
// /app 已并入 /opentavern：保留 query（?character=<slug>）以便角色页的 Start Chat 继续工作。
definePageMeta({
  redirect: (to) => ({ path: '/opentavern', query: to.query }),
});
</script>

<template><div /></template>
