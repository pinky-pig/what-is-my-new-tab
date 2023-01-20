<script setup lang="ts">
// unsplash api document: https://unsplash.com/documentation
import { createApi } from 'unsplash-js'
import type { Basic as IBasic } from 'unsplash-js/dist/methods/photos/types'
import { UnsplashSetting } from '~/types'

// 检索
const emit = defineEmits(['handleSetInternetImage'])

const unsplash = createApi({
  accessKey: UnsplashSetting.AccessKey,
})

const pageNum = ref(1)
const pageSize = ref(9)
const resultTotal = ref(9)

const imageList = ref<IBasic[]>([])
watch(pageNum, () => {
  getList()
})

getList()
function getList() {
  unsplash.photos.list({
    page: pageNum.value,
    perPage: pageSize.value,
  }).then((res) => {
    if (res.status === 200 && res.type === 'success') {
      imageList.value = res.response.results
      resultTotal.value = res.response.total
    }
  })
}

const searchInputText = ref('')
function selectInternetImage(item: IBasic) {
  emit('handleSetInternetImage', item.urls.regular)
}

function handleSearchUnsplashImage() {
  unsplash.search.getPhotos({
    query: searchInputText.value,
    page: pageNum.value,
    perPage: pageSize.value,
  }).then((res) => {
    if (res.status === 200 && res.type === 'success')
      imageList.value = res.response.results
  })
}

const pageCount = computed(() => {
  return resultTotal.value / 9
})
</script>

<template>
  <n-card
    style="width: 60%;height: 600px; padding: 10px;min-width: 750px; "
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <div class=" flex flex-col gap-4 overflow-auto">
      <n-input v-model:value="searchInputText" type="text" placeholder="检索壁纸" @keydown.enter="handleSearchUnsplashImage" />

      <div class=" flex flex-row flex-wrap gap-10px justify-evenly">
        <div v-for="item in imageList" :key="item.id" class="w-200px h-150px border cursor-pointer" @dblclick="selectInternetImage(item)">
          <img class=" w-full h-full object-contain" :src="item.urls.regular" alt="">
        </div>
      </div>
    </div>

    <template #footer>
      <n-pagination v-model:page="pageNum" class="float-right" :page-count="pageCount" simple />
    </template>
  </n-card>
</template>

<style lang="less" scoped>

</style>
