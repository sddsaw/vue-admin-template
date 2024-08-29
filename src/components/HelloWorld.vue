<!--
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-08-29 14:07:07
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-08-29 14:49:51
 * @Description: 
-->
<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <h1>{{ msg }}</h1>
  <div class="card">
    <button type="button" @click="count++">
      count is {{ count }}
    </button>
  </div>
  <div data-a="1" data-b='2' data-c="3" data-d="4" data-e="5" data-r="6"></div>
</template>

<style scoped>

</style>
