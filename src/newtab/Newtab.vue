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
import { DrawerSetting } from '~/types'

const store = useNewtabStore()
const { isOpenDrawer } = storeToRefs(store)
const mainRef = ref()
const mainRefTransform = ref('')
watch(isOpenDrawer, () => {
  if (isOpenDrawer.value) {
    mainRef.value.className += ' settingsActive'
    mainRefTransform.value = `scale(${calculateMainScale()})`
  }
  else {
    mainRef.value.className = mainRef.value.className.replace(/ settingsActive/, '')
    mainRefTransform.value = ''
  }
})

// 计算缩放比例
function calculateMainScale() {
  // 距离间隔
  const g = 50
  // 获取初始页面的宽度
  const ow = document.body.offsetWidth
  // 获取抽屉的宽度
  const w = DrawerSetting.Width
  // 页面的宽度减去抽屉的宽度再减去Gap的值，就是main缩放后的值
  const d = ow - w - g
  // 缩放后的宽度除以初始宽度，得到要缩放的比例
  const percentage = (d / ow).toFixed(6)
  return percentage
}
</script>

<template>
  <main ref="mainRef" :style="{ transform: mainRefTransform }" class="main w-full h-full text-center text-gray-700 duration-300 ease-in-out">
    <Header />
    <Main class="w-full h-full" />
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
