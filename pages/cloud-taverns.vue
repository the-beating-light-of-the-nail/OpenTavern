<script setup lang="ts">
// 「云酒馆」栏目槽已升级为 /web-tavern 在线本地酒馆方案页；
// 本路由仅为客户端兜底跳转（服务端 302 见 server/middleware/route-guard.ts）
definePageMeta({ redirect: '/web-tavern' });
</script>

<template><div /></template>
