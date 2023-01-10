<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import RandomPolygon from './RandomPolygon.vue'
import Gradient from './Gradient.vue'

// 0 彩色模糊背景
// 1 自定义图片背景
// 2 黑暗模式背景
const mode = ref(0)

const isDark = useDark()
watchEffect(() => {
  mode.value = isDark ? 2 : 0
})
</script>

<template>
  <!-- 彩色模糊背景 -->
  <div v-if="mode === 0" class=" w-screen h-screen overflow-hidden">
    <RandomPolygon />
  </div>
  <!-- 自定义图片背景 -->
  <div v-else-if="mode === 1">
    自定义图片背景
  </div>

  <!-- 黑暗模式背景 -->
  <div v-else-if="mode === 2" />

  <Gradient v-else />
</template>
