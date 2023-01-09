<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <header class="header-container fixed top-0 z-40 w-full h-80px flex flex-row items-center justify-between px-8">
    <!-- logo -->
    <div class=" flex justify-center items-center w-10">
      <img src="/assets/icon.svg" class="w-10 h-10 select-none outline-none" alt="">
    </div>

    <!-- button -->
    <div class=" flex flex-row gap-2 ">
      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i-carbon:workspace />

      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i-carbon-blog />

      <div class="div-contrary">
        <a href="https://github.com/pinky-pig/what-is-my-blog.git" target="_blank" title="GitHub">
          <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i-carbon-logo-github />
        </a>
      </div>

      <div class=" div-contrary" title="切换黑暗模式" @click="toggleDark()">
        <div class="cursor-pointer" i="carbon-sun dark:carbon-moon" />
      </div>
    </div>
  </header>
</template>

<style scoped>
  .header-container{
    backdrop-filter: saturate(50%) blur(8px);
    -webkit-backdrop-filter: saturate(50%) blur(8px);
  }
</style>
