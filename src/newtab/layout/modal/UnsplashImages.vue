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
</script>

<template>
  <n-card
    style="width: 600px;"
    :bordered="false"
    size="huge"
    role="dialog"
    aria-modal="true"
  >
    <div> unsplash</div>
  </n-card>
</template>

<style lang="less" scoped>

</style>
