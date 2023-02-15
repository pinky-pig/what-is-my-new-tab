<script setup lang="ts">
import type { StyleValue } from 'vue'
import { generateUuid } from '~/utils/uuid'

interface GridCellType {
  id: string
  x: number
  y: number
  width: number
  height: number
  isLocked: boolean // 是否锁定
  showMode: number
  transform: string
  children?: any
}
const props = defineProps({
  modelValue: {
    default: {
      id: generateUuid(), // add 使用这个， edit 使用传入的 configuration 的
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      isLocked: false, // 是否锁定
      showMode: 0, // 0 格子 1 列表
      transform: '',
    } as GridCellType,
  },
})
const getStyle = computed(() => {
  return {
    position: 'fixed',
    width: `${props.modelValue.width}px`,
    height: `${props.modelValue.height}px`,
    background: '#fca98690',
    borderRadius: '3px',
    pointerEvents: 'auto',
    zIndex: 1,
    transform: props.modelValue.transform,
  } as StyleValue
})
</script>

<template>
  <div :id="props.modelValue.id" ref="cellRef" :style="getStyle" />
</template>

<style scoped>

</style>
