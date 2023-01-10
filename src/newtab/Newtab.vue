<script setup lang="ts">
// import { storageDemo } from '~/logic/storage'

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

// import { dayProgress, hourProgress, minProgress, monthProgress, yearProgress } from './helps'

import Header from './layout/Header.vue'
import Main from './layout/Main.vue'
</script>

<template>
  <main class="main w-full h-full text-center text-gray-700">
    <Header />
    <Main />
    <!-- <StickyNote>
      年{{ yearProgress }}
      月{{ monthProgress }}
      日{{ dayProgress }}
      时{{ hourProgress }}
      分{{ minProgress }}
    </StickyNote> -->
  </main>
</template>

<style>
.main {
  background: #EDEDED;
  background-image: url(/assets/noise.png);
  background-attachment: fixed;
}
</style>
