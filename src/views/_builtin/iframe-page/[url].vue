<!--
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-19 13:48:04
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-09-19 13:48:51
 * @Description:
-->
<script setup lang="ts">
import { onActivated, onMounted } from 'vue'

interface Props {
  url: string
}

defineProps<Props>()

onMounted(() => {
})

onActivated(() => {
})
</script>

<template>
  <div class="h-full">
    <iframe id="iframePage" class="size-full" :src="url" />
  </div>
</template>

<style scoped></style>
