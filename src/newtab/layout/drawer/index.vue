<script setup lang="ts">
import { storeToRefs } from 'pinia'
import type { ComponentPublicInstance } from 'vue'
import Sidebar from './Sidebar.vue'
import { SETTINGS } from './settings'
import { useNewtabStore } from '~/store'
import { DrawerSetting } from '~/types'

const store = useNewtabStore()
const { isOpenDrawer } = storeToRefs(store)
function openDrawer() {
  isOpenDrawer.value = !isOpenDrawer.value
}

defineExpose({
  openDrawer,
})

const currentDrawerSettingsItem = ref([0])
function handleDrawerBodyScrollByAnchor(v: number) {
  const drawerBody = document.getElementsByClassName('n-scrollbar-container')
  drawerBody[0].scrollTo({ top: (document.getElementById(`card-${v}`) as any).offsetTop, behavior: 'smooth' })
}

// 当前在视野范围内的card
const currentItemArr = SETTINGS.map((item) => {
  return {
    key: item.key,
    isInView: false,
  }
})
function smoothScrollToArchor(observerObjects: any) {
  const observer = new IntersectionObserver((entries) => {
    // 主要是判断intersectionRatio是不是大于0，大于0在视野范围内，否则不在
    entries.forEach((entry) => {
      const id = entry.target.getAttribute('id')?.replace(/card-/, '')
      const idx = currentItemArr.findIndex(i => i.key === Number(id))
      currentItemArr[idx].isInView = entry.intersectionRatio > 0
      currentDrawerSettingsItem.value = currentItemArr.filter(it => it.isInView === true).map(i => i.key)
    })
  })
  Object.values(observerObjects).forEach((section: any) => {
    observer.observe(section.$el)
  })
}

type refItem = Element | ComponentPublicInstance | null
const refMap: Record<string, refItem> = {}
function setRefMap(el: refItem, item: any) {
  if (el)
    refMap[`${item.key}`] = el
}
watch(isOpenDrawer, () => {
  // 因为抽屉动画是.3s
  setTimeout(() => {
    smoothScrollToArchor(refMap)
  }, 500)
})
</script>

<template>
  <n-drawer v-model:show="isOpenDrawer" :width="DrawerSetting.Width">
    <n-drawer-content title="设置" :native-scrollbar="false">
      <Sidebar v-model="currentDrawerSettingsItem" @handleDrawerBodyScrollByAnchor="handleDrawerBodyScrollByAnchor" />

      <component
        :is="item.component"
        v-for="item in SETTINGS"
        :id="`card-${item.key}`"
        :key="item.key"
        :ref="(el: refItem) => setRefMap(el, item)"
      />
    </n-drawer-content>
  </n-drawer>
</template>
