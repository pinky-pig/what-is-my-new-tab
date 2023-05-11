<script setup lang="ts">
import { createDragInHorizontal } from '~/utils/drag'

const emits = defineEmits(['handleSelectedSearchEngine'])

const searchConfig = ref([
  {
    label: 'Me',
    url: 'https://mmeme.me/',
    color: '#669AE1',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M5.926 12.496c2.063-.443 1.782-2.908 1.72-3.447c-.1-.83-1.078-2.282-2.404-2.167c-1.67.15-1.914 2.561-1.914 2.561c-.226 1.115.54 3.497 2.598 3.053Zm2.191 4.289c-.06.173-.195.616-.079 1.002c.23.866.982.905.982.905h1.08v-2.64H8.944c-.52.154-.77.559-.827.733Zm1.638-8.422c1.14 0 2.06-1.312 2.06-2.933c0-1.62-.92-2.93-2.06-2.93c-1.138 0-2.06 1.31-2.06 2.93c0 1.621.923 2.933 2.06 2.933Zm4.907.193c1.523.198 2.502-1.427 2.697-2.659c.198-1.23-.784-2.658-1.862-2.904c-1.08-.248-2.43 1.483-2.552 2.61c-.147 1.38.197 2.758 1.717 2.953Zm0 3.448c-1.865-2.905-4.513-1.723-5.399-.245c-.882 1.477-2.256 2.41-2.452 2.658c-.198.244-2.846 1.673-2.258 4.284c.588 2.609 2.653 2.56 2.653 2.56s1.521.15 3.286-.246c1.766-.391 3.286.098 3.286.098s4.124 1.38 5.253-1.278c1.127-2.66-.638-4.038-.638-4.038s-2.356-1.823-3.731-3.793Zm-6.007 7.75c-1.158-.231-1.62-1.021-1.677-1.156c-.057-.137-.386-.772-.212-1.853c.5-1.619 1.927-1.735 1.927-1.735h1.427v-1.755l1.216.02v6.479H8.655Zm4.59-.019c-1.196-.308-1.252-1.158-1.252-1.158v-3.412l1.252-.02v3.066c.076.328.482.387.482.387H15v-3.433h1.331v4.57h-3.085Zm7.453-9.11c0-.59-.49-2.364-2.305-2.364c-1.818 0-2.061 1.675-2.061 2.859c0 1.13.095 2.707 2.354 2.657c2.26-.05 2.012-2.56 2.012-3.152Z"/></svg>',
  },
  {
    label: 'Weekly',
    url: 'https://weekly.mmeme.me/',
    color: '#70CC72',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M3.064 7.51A9.996 9.996 0 0 1 12 2c2.695 0 4.959.991 6.69 2.605l-2.867 2.868C14.786 6.482 13.468 5.977 12 5.977c-2.605 0-4.81 1.76-5.595 4.123c-.2.6-.314 1.24-.314 1.9c0 .66.114 1.3.314 1.9c.786 2.364 2.99 4.123 5.595 4.123c1.345 0 2.49-.355 3.386-.955a4.6 4.6 0 0 0 1.996-3.018H12v-3.868h9.418c.118.654.182 1.336.182 2.045c0 3.046-1.09 5.61-2.982 7.35C16.964 21.105 14.7 22 12 22A9.996 9.996 0 0 1 2 12c0-1.614.386-3.14 1.064-4.49Z"/></svg>',
  },
  {
    label: '自定义',
    url: 'https://www.github.com/search?q=test',
    color: '#FC913A',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4Zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z" /></svg>',
  },
])

const box = ref<HTMLElement | null>(null)
const item = ref<HTMLElement[] | null>(null)

let isDraggedEngineList = false

onMounted(() => {
  const { isDragged } = createDragInHorizontal(box.value!, item.value!, 'my-website-item', { width: 144, height: 88 }, 20, 6, 300)
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
  <div ref="box" class="w-965px h-full -mt-10px">
    <div
      v-for="item in searchConfig.slice(0, 9)"
      ref="item"
      :key="item.label"
      class="
        my-website-item
        w-144px h-88px
        flex flex-col justify-center items-center  gap-5px flex-shrink-0 flex-grow-0
        cursor-pointer
        overflow-hidden
        rounded-10px
        "
      @click="handleSelectedSearchEngine(item)"
    >
      <div
        w-144px h-88px
      >
        {{ item.label }}
      </div>

      <!-- <span class="text-12px">{{ item.label }}</span> -->
    </div>
  </div>
</template>

<style scoped>
.my-website-item{
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(40px);
}
</style>
