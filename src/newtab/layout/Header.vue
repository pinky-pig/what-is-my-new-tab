<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <!-- logo -->
  <!-- <div class=" flex justify-center items-center w-10">
      <img src="/assets/icon.svg" class="w-10 h-10 select-none outline-none" alt="">
    </div> -->

  <!-- button -->
  <header class="header-container h-50px fixed top-0 right-0 z-40 flex flex-row items-center justify-between px-8">
    <div class=" flex flex-row gap-2 text-2xl ">
      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i-carbon:workspace />

      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i-carbon-blog />

      <a href="https://github.com/pinky-pig/what-is-my-blog.git" target="_blank" title="GitHub">
        <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i-carbon-logo-github />
      </a>

      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i="carbon-sun dark:carbon-moon" title="切换黑暗模式" @click="toggleDark()" />
    </div>
  </header>
</template>

<style scoped>
.header-container {
  backdrop-filter: saturate(50%) blur(8px);
  -webkit-backdrop-filter: saturate(50%) blur(8px);
}
</style>
