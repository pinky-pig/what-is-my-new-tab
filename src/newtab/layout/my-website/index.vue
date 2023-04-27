<script setup lang="ts">
import { dragInHorizontal } from '~/utils/drag'

const box = ref<HTMLElement | null>(null)
const item = ref<HTMLElement[] | null>(null)

onMounted(() => {
  dragInHorizontal(box.value!, item.value!, 100)
})
</script>

<template>
  <div class="my-website">
    <div ref="box" class="my-website-container">
      <div v-for="item in 10" ref="item" :key="item" class="my-website-item" />
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
