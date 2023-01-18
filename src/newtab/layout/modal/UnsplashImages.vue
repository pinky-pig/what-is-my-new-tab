<script setup lang="ts">
// unsplash api document: https://unsplash.com/documentation
import { createApi } from 'unsplash-js'
import { UnsplashSetting } from '~/types'

const unsplash = createApi({
  accessKey: UnsplashSetting.AccessKey,
})

unsplash.search.getPhotos({
  query: 'cat',
  page: 1,
  perPage: 10,
  color: 'green',
  orientation: 'portrait',
})
  .then((json) => {
    // eslint-disable-next-line no-console
    console.log(json)
  })

const searchInputText = ref('')
const page = ref(2)
</script>

<template>
  <n-card
    style="width: 1000px;height: 600px; padding: 10px; "
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <div class=" flex flex-col gap-4">
      <n-input v-model:value="searchInputText" type="text" placeholder="检索壁纸" />

      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="Oasis">
          <n-card>
            <div class=" flex flex-row flex-wrap gap-10px ">
              <div v-for="it in 2" :key="it" class="w-200px h-200px">
                <img class=" w-full h-full" src="https://images.unsplash.com/photo-1560009571-bbf900a1131b?ixid=Mnw0MDAwMDF8MHwxfHNlYXJjaHwyfHxjYXR8ZW58MHwxfHxncmVlbnwxNjc0MDExMzc0&ixlib=rb-4.0.3" alt="">
              </div>
            </div>
          </n-card>
        </n-tab-pane>
        <n-tab-pane name="the beatles" tab="the Beatles">
          Hey Jude
        </n-tab-pane>
        <n-tab-pane name="jay chou" tab="周杰伦">
          七里香
        </n-tab-pane>
      </n-tabs>
    </div>

    <template #footer>
      <n-pagination v-model:page="page" class="float-right" :page-count="100" simple />
    </template>
  </n-card>
</template>

<style lang="less" scoped>

</style>
