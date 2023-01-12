<script setup lang="ts">
import { storeToRefs } from 'pinia'
import Sidebar from './Sidebar.vue'
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
</script>

<template>
  <n-drawer
    v-model:show="isOpenDrawer"
    :width="DrawerSetting.Width"
  >
    <n-drawer-content title="设置" :native-scrollbar="false">
      <Sidebar />
    </n-drawer-content>
  </n-drawer>
</template>
