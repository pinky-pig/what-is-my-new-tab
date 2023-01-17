<script lang="ts" setup>
import { useDark } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import RandomPolygon from './RandomPolygon.vue'
import CustomImage from './CustomImage.vue'
import Gradient from './Gradient.vue'
import { useNewtabStore } from '~/store'

// 0 彩色模糊背景
// 1 自定义图片背景
// 2 黑暗模式背景
const store = useNewtabStore()
const { currentWallpaper } = storeToRefs(store)

const isDark = useDark()
</script>

<template>
  <!-- 彩色模糊背景 -->
  <div v-if=" !isDark && currentWallpaper.type === 'random-colors'" class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden bg-[var(--primary-bg-color)]">
    <RandomPolygon />
  </div>
  <!-- 自定义图片背景 -->
  <div
    v-else-if=" !isDark && currentWallpaper.type === 'image' "
    class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden bg-[var(--primary-bg-color)]"
  >
    <CustomImage />
  </div>

  <!-- 自定义图片背景 -->
  <div v-else-if="!isDark && currentWallpaper.type === 'linear-colors'">
    线性渐变背景
  </div>

  <!-- 黑暗模式背景 -->
  <div v-else-if="isDark" class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden bg-[var(--primary-bg-color)]" />

  <Gradient v-else />
</template>
