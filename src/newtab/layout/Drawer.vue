<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNewtabStore } from '~/store'
// import { DrawerSetting } from '~/types'
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
  <!-- <n-drawer
    v-model:show="isOpenDrawer"
    :width="DrawerSetting.Width"
  >
    <n-drawer-content title="Stoner" :native-scrollbar="false">
      抽屉
    </n-drawer-content>
  </n-drawer> -->

  <Teleport to="body">
    <div v-if="isOpenDrawer" class="modal">
      <!-- 蒙版 -->
      <div class="drawMask" @click="isOpenDrawer = false" />
      <!-- 抽屉 -->
      <div class="drawPanel" />
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
}
.drawMask{
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
}
.drawPanel{
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 480px;
  background: indianred;
}
</style>
