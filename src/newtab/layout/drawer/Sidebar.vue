<script setup lang="ts">
import { SETTINGS } from './settings'

const props = defineProps({
  modelValue: {
    default: [0] as number[],
  },
})

const emit = defineEmits(['handleDrawerBodyScrollByAnchor', 'update:modelValue'])

// 设置侧边栏弹出动画，
const sidebarAnimation = ref('translateX(-80px) translateY(-50%)')
onMounted(() => {
  sidebarAnimation.value = 'translateX(-80px) translateY(-50%)'
})

function handleSwitchItem(key: number) {
  emit('handleDrawerBodyScrollByAnchor', key)
  emit('update:modelValue', [key])
}
</script>

<template>
  <div
    class="drawer-setting-sidebar"
    style=""
  >
    <div
      v-for="item in SETTINGS"
      :key="item.key"
      class="settingTabItem "
      :style="{ opacity: props.modelValue.includes(item.key) ? 1 : 0.5 }"
      @click="handleSwitchItem(item.key)"
    >
      <div v-html="item.icon" />
    </div>
  </div>
</template>

<style scoped>
.drawer-setting-sidebar{
  border-radius: 10px;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  overflow: hidden;
  width: 50px;
  height: 80vh;
  padding: 10px 0;
  margin-top: 0px;
  position: fixed;
  top: 50%;
  transform: v-bind(sidebarAnimation);
  transition: 1s all;
}
.settingTabItem{
  width: 40px;
  height: 40px;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.5;
  cursor: pointer;
  border-radius: 5px;
  transition: 0.2s ease-out;
}
.settingTabItem:hover{
  opacity: 1;
  background-color: rgba(255, 255, 255, .1)
}
</style>
