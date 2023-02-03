<script lang="ts" setup>
import SearchBox from './search-box/index.vue'
import homepage from './homepage/index.vue'
</script>

<template>
  <div class="mx-auto w-4/5 h-full flex flex-col py-10 justify-center items-center">
    <SearchBox class="mt-10 z-2" />

    <homepage class="flex-1" />
  </div>
</template>
