<!--
 * @Author: 周恩波 zhouenbo@lx-dtx.com
 * @Date: 2024-09-02 16:25:52
 * @LastEditors: 周恩波
 * @LastEditTime: 2024-10-17 22:26:29
 * @Description:
-->
<script setup lang="ts">
// import { fetchLogin } from '@/service/api'

async function fetchSuccess() {
  // const res = await fetchLogin('admin', '123456')
  // console.log('请求成功', res)
}
async function fetchCancel() {
  // console.log('请求取消')
}
</script>

<template>
  <div>
    <button @click="fetchSuccess">
      请求成功
    </button>
    <button>请求失败</button>
    <button @click="fetchCancel">
      取消请求
    </button>
  </div>
</template>
