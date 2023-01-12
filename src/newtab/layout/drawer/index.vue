<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Sidebar from './Sidebar.vue'
import { SETTINGS } from './settings'
import { useNewtabStore } from '~/store'
import { DrawerSetting } from '~/types'

const store = useNewtabStore()
const { isOpenDrawer } = storeToRefs(store)
const openDrawer = () => {
  isOpenDrawer.value = !isOpenDrawer.value
}

defineExpose({
  openDrawer,
})

const currentDrawerSettingsItem = ref(0)
function handleDrawerBodyScrollByAnchor(v: number) {
  const drawerBody = document.getElementsByClassName('n-scrollbar-container')
  drawerBody[0].scrollTo({ top: (document.getElementById(`card-${v}`) as any).offsetTop, behavior: 'smooth' })
}
</script>

<template>
  <n-drawer v-model:show="isOpenDrawer" :width="DrawerSetting.Width">
    <n-drawer-content title="设置" :native-scrollbar="false">
      <Sidebar
        v-model="currentDrawerSettingsItem"
        @handleDrawerBodyScrollByAnchor="handleDrawerBodyScrollByAnchor"
      />

      <component
        :is="item.component"
        v-for="item in SETTINGS"
        :id="`card-${item.key}`"
        :key="item.key"
      />
    </n-drawer-content>
  </n-drawer>
</template>
