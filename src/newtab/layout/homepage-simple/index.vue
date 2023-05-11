<script setup lang="ts">
import SearchBox from '../search-box/index.vue'
import MyWebsit from '../my-website/index.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div
    w-full h-full
    flex flex-col justify-start items-center
    z-2
    pt-24
    relative
  >
    <SearchBox />

    <div class="absolute top-200px left-0 w-full flex justify-center items-center">
      <MyWebsit />
    </div>

    <div class=" fixed bottom-30px left-0 w-full flex justify-center items-center">
      <Footer />
    </div>
  </div>
</template>

<style scoped>

</style>
