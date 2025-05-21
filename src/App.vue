<script setup lang="ts">
import { ref } from 'vue'
import SingleChoice from '@/components/single-choice/index'

const selectedFruit = ref('apple')
const fruitOptions = ref([
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '公式1: $$x^2 + y^2 = z^2$$', value: 1 },
  { label: '公式2: $$\\frac{a}{b}$$', value: 2 },
  { label: '<img src="https://commimg.obs.cn-east-2.myhuaweicloud.com:443/uploadFilef5b1aaf28ffa4bdd8f83fea1e476825f.b725e294175d48f89c179c98adef159a.png" alt="图片1">', value: 'img1' },
])

const selectedSize = ref('medium')
const sizeOptions = ref([
  { label: '小号', value: 'small' },
  { label: '中号', value: 'medium' },
  { label: '大号', value: 'large' },
])
</script>

<template>
  <div>
    <SingleChoice
      v-model="selectedFruit"
      :options="fruitOptions"
    />
    <p>当前选择的水果: {{ selectedFruit }}</p>

    <h2>尺寸选择 (禁用状态)</h2>
    <SingleChoice
      v-model="selectedSize"
      :options="sizeOptions"
      disabled
    />
    <p>当前选择的尺寸: {{ selectedSize }}</p>
  </div>
</template>

<style scoped>

</style>
