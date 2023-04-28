<script setup lang="ts">
import { createDragInHorizontal } from '~/utils/drag'

const box = ref<HTMLElement | null>(null)
const item = ref<HTMLElement[] | null>(null)

const dragObj = ref<ReturnType<typeof createDragInHorizontal> | null>(null)
onMounted(() => {
  dragObj.value = createDragInHorizontal(box.value!, item.value!, 100, 20)
})
</script>

<template>
  <div class="my-website">
    <div
      ref="box"
      class="my-website-container"
      :style="dragObj?.getContainerStyle()"
    >
      <div
        v-for="item, index in 10"
        ref="item"
        :key="item"
        :style="dragObj?.getElementsStyle(index)"
        class="my-website-item"
      >
        {{ index }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-website{
  width: 100%;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(40px);
}
.my-website-container{
  width: 80%;
  height: 80%;
  background: #ffffff90;
}
.my-website-item{
  background: rgba(209, 250, 229,1);
}
</style>
