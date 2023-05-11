<script setup lang="ts">
import type { WebsiteParams } from '../homepage/websiteData'
import { addPinedWebsite, getPinedWebsite } from '../homepage/websiteData'
import { createDragInHorizontal } from '~/utils/drag'
import { DEFAULT_SITES } from '~/config/param'

const emits = defineEmits(['handleSelectedSearchEngine'])

const addSitePlaceholder = {
  id: -1,
  url: 'https://www.github.com/search?q=test',
  type: 0,
  index: -1,
  webName: '自定义',
  property: {
    color: '#FC913A',
  },
  icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4Zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z" /></svg>',
}
const myWebSites = ref<WebsiteParams[]>([])

const box = ref<HTMLElement | null>(null)
const item = ref<HTMLElement[] | null>(null)
let isDraggedWebSitesList = false

onMounted(async () => {
  const websitesFromIndexDB = await getPinedWebsite()

  // 如果没获取到，那么将默认的填充进去，然后再获取，再布局
  // 如果获取到了，那么直接布局
  if (!websitesFromIndexDB.length) {
    const addSitesPromise: Promise<number>[] = []
    DEFAULT_SITES.forEach((item) => {
      addSitesPromise.push(
        new Promise((resolve) => {
          addPinedWebsite(item)
            .then(() => {
              resolve(1)
            })
        }),
      )
    })
    Promise.all(addSitesPromise)
      .then(() => {
        getPinedWebsite()
          .then((res) => {
            myWebSites.value = res
            myWebSites.value.push(addSitePlaceholder)
          })
      })
  }
  else {
    myWebSites.value = websitesFromIndexDB.concat(myWebSites.value)
    myWebSites.value.push(addSitePlaceholder)
  }

  nextTick(() => {
    const { isDragged } = createDragInHorizontal(box.value!, item.value!, 'my-website-item', { width: 144, height: 88 }, 20, 6, 300)
    watch(isDragged, (val) => {
      isDraggedWebSitesList = true
    })
  })
})

function handleSelectedSearchEngine(item: typeof myWebSites.value[0]) {
  if (isDraggedWebSitesList)
    isDraggedWebSitesList = false
  else
    emits('handleSelectedSearchEngine', item)
}
</script>

<template>
  <div ref="box" class="w-965px h-full -mt-10px">
    <div
      v-for="item in myWebSites.slice(0, 9)"
      ref="item"
      :key="item.webName"
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
        {{ item.webName }}
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
