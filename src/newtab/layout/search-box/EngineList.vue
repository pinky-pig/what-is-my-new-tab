<script setup lang="ts">
import { searchEngine } from './engine'
import { createDragInHorizontal } from '~/utils/drag'

const emits = defineEmits(['handleSelectedSearchEngine'])

const searchConfig = ref(searchEngine)

const box = ref<HTMLElement | null>(null)
const item = ref<HTMLElement[] | null>(null)

let isDraggedEngineList = false

onMounted(() => {
  const { isDragged } = createDragInHorizontal(box.value!, item.value!, 'search-engine-item', { width: 70, height: 70 }, 0, 9)
  watch(isDragged, (val) => {
    isDraggedEngineList = true
  })
})

function handleSelectedSearchEngine(item: typeof searchConfig.value[0]) {
  if (isDraggedEngineList)
    isDraggedEngineList = false
  else
    emits('handleSelectedSearchEngine', item)
}
</script>

<template>
  <div ref="box" class="w-full h-full -mt-10px">
    <div
      v-for="item in searchConfig.slice(0, 9)"
      ref="item"
      :key="item.label"
      class="search-engine-item w-70px h-64px flex flex-col justify-center items-center cursor-pointer gap-5px flex-shrink-0 flex-grow-0"
      @click="handleSelectedSearchEngine(item)"
    >
      <div class="w-36px h-36px text-blue-500 rounded-8px bg-white flex flex-col justify-center items-center" v-html="item.icon" />

      <span class="text-12px">{{ item.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.search-engine-item{
  overflow: hidden;
  border-radius: 10px;
}
.search-engine-item:hover{
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(80px);
}
</style>
