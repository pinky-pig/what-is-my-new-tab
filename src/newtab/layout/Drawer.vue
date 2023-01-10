<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNewtabStore } from '~/store'

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
  <n-drawer v-model:show="isOpenDrawer" :width="480">
    <n-drawer-content title="Stoner" :native-scrollbar="false">
      抽屉
    </n-drawer-content>
  </n-drawer>
</template>
