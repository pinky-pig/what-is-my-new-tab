<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import RandomPolygon from './RandomPolygon.vue'
import Gradient from './Gradient.vue'
import SearchBox from './SearchBox/index.vue'

// 0 彩色模糊背景
// 1 自定义图片背景
// 2 黑暗模式背景
const mode = ref(0)

const isDark = useDark()
watchEffect(() => {
  mode.value = isDark.value ? 2 : 0
})
</script>

<template>
  <!-- 彩色模糊背景 -->
  <div v-if="mode === 0" class="fixed top-0 left-0 w-full h-full overflow-hidden bg-[var(--primary-bg-color)]">
    <RandomPolygon />
  </div>
  <!-- 自定义图片背景 -->
  <div v-else-if="mode === 1">
    自定义图片背景
  </div>

  <!-- 黑暗模式背景 -->
  <div v-else-if="mode === 2" class="fixed top-0 left-0 w-full h-full overflow-hidden bg-[var(--primary-bg-color)]" />

  <Gradient v-else />

  <!-- 搜索框 -->
  <SearchBox class="absolute top-40 left-0 z-2" />
</template>
