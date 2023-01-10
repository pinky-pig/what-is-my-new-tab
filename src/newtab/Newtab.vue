<script setup lang="ts">
// import { storageDemo } from '~/logic/storage'

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

// import { dayProgress, hourProgress, minProgress, monthProgress, yearProgress } from './helps'

import { storeToRefs } from 'pinia'
import Header from './layout/Header.vue'
import Main from './layout/Main.vue'
import { useNewtabStore } from '~/store'

const store = useNewtabStore()
const { isOpenDrawer } = storeToRefs(store)
const mainRef = ref()
const mainRefTransform = ref('')
watch(isOpenDrawer, () => {
  if (isOpenDrawer.value) {
    mainRef.value.className += ' settingsActive'
    mainRefTransform.value = 'scale(0.545126)'
  }
  else {
    mainRef.value.className = mainRef.value.className.replace(/ settingsActive/, '')
    mainRefTransform.value = ''
  }
})
</script>

<template>
  <main ref="mainRef" :style="{ transform: mainRefTransform }" class="main w-full h-full text-center text-gray-700 duration-300 ease-in-out">
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
  <NaiveProvider />
</template>

<style>
.main {
  background: #EDEDED;
  background-image: url(/assets/noise.png);
  background-attachment: fixed;
}
</style>
