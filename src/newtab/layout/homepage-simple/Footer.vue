<script setup lang="ts">
import Drawer from '../drawer/index.vue'

const drawerRef = ref()
function handleOpenDrawer() {
  const { openDrawer } = drawerRef.value
  openDrawer()
}

const rainRef = inject('rainRef') as Ref<boolean>
function handleOpenRainSettings() {
  (rainRef.value as any).handleIsOpenSettingsPanel()
}
</script>

<template>
  <header class="header-container h-50px fixed bottom-0 right-0 z-40 flex flex-row items-center justify-between px-8">
    <div class=" flex flex-row gap-2 text-2xl ">
      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i="carbon-image" title="Rain Settings" @click="handleOpenRainSettings" />
      <div class="cursor-pointer bg-gray-700 dark:bg-gray-200" i="carbon-settings " title="打开抽屉" @click="handleOpenDrawer" />
    </div>
  </header>
  <Drawer ref="drawerRef" />
</template>
