<script setup lang="ts">
const show = ref(false)
const openDrawer = () => {
  show.value = !show.value
}

defineExpose({
  openDrawer,
})
</script>

<template>
  <n-drawer v-model:show="show" :width="480">
    <n-drawer-content title="Stoner" :native-scrollbar="false">
      抽屉
    </n-drawer-content>
  </n-drawer>
</template>
