<script setup lang="ts">
import { useDark } from '@vueuse/core'
import type { BuiltInGlobalTheme } from 'naive-ui/es/themes/interface'

import { storeToRefs } from 'pinia'
import type { ComputedRef } from 'vue'
import { darkTheme } from 'naive-ui'
import Main from './layout/Main.vue'
import { darkThemeOverrides, lightThemeOverrides } from '~/styles/naive-ui.theme'
import { useNewtabStore } from '~/store'
import { DrawerSetting } from '~/types'
import Rain from '~/components/three-rain/index.vue'

// import { storageWallpaperDB } from '~/logic/storage'
// import { generateUuid } from '~/utils/uuid'

// storageWallpaperDB.addItem({
//   id: generateUuid(),
//   data: '1',
// })
// storageWallpaperDB.addItem({
//   id: generateUuid(),
//   data: '1',
// })
// import { storageDemo } from '~/logic/storage'

// function openOptionsPage() {
//   browser.runtime.openOptionsPage()
// }

// import { dayProgress, hourProgress, minProgress, monthProgress, yearProgress } from './helps'

// naive-ui 暗色模式
const isDark = useDark()
const naiveUIDarkTheme: ComputedRef<BuiltInGlobalTheme | undefined> = computed(() => isDark.value ? darkTheme : undefined)
const naiveUIThemeOverrides = computed(() => isDark.value ? darkThemeOverrides : lightThemeOverrides)

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
  const g = 80
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

// 设置全局fonts
onMounted(() => {
  store.setSystemFontFamily(store.currentFontFamily)
})

// 背景设置
const rainRef = ref<HTMLElement | null>(null)
provide('rainRef', rainRef)
</script>

<template>
  <Suspense>
    <n-config-provider :theme="naiveUIDarkTheme" :theme-overrides="naiveUIThemeOverrides">
      <div class="main-container w-screen h-screen">
        <main
          id="mainTest"
          ref="mainRef"
          :style="{ transform: mainRefTransform }"
          class=" w-full h-full text-center text-gray-700 absolute z-2"
          style="transition: ALl .3s cubic-bezier(0.4, 0, 0.2, 1)"
        >
          <!-- <Background /> -->
          <!-- <Header /> -->

          <Rain ref="rainRef" class="fixed top-0 left-0 right-0 bottom-0 overflow-hidden " />
          <Main />
        </main>
      </div>
    </n-config-provider>
  </Suspense>
  <NaiveProvider />
</template>

<style scoped>
.main-container {
  --bg-color: #ede9e9;

  background-image: url(/assets/main_resource.png);

  /* background-image: repeating-linear-gradient(to right,var(--bg-color),var(--bg-color) 1px,transparent 1px,transparent 30px),
  repeating-linear-gradient(to bottom,var(--bg-color),var(--bg-color) 1px,transparent 1px,transparent 30px); */
  /* background-image: url(/assets/main_resource.jpg); */
  /* background: var(--primary-bg-color); */
  /* background-image: url(/assets/noise.png);
  background-attachment: fixed; */
}
.bg-Illustration{
    position: fixed;
    top: -80px;
    left: -30px;
    z-index: 1;
    transform: scale(0.5);
  }
</style>
