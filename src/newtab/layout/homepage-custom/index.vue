<script setup lang="ts">
import { markRaw, ref } from 'vue'
import V3Dragblock from 'v3-dragblock'
import GridCellOne from './GridCellOne.vue'
// import { useLayoutStore } from '~/store';
// import { editAGridCell, getAllGridCellSortByIndex } from './gridCellData';
// import { useDebounceFn } from '@vueuse/core';

const gridCells = ref([
  { id: '0', index: 0, x: 20, y: 35, width: 190, height: 110, component: markRaw(GridCellOne) }, // 辫子
  { id: '1', index: 0, x: 465, y: 25, width: 170, height: 160, component: markRaw(GridCellOne) }, // 摆手
  { id: '2', index: 0, x: 385, y: 265, width: 200, height: 50, component: markRaw(GridCellOne) }, // text
  { id: '3', index: 0, x: 150, y: 195, width: 130, height: 130, component: markRaw(GridCellOne) }, // 白边
])

const adsorbLineStyle = {
  stroke: 'black',
  fill: 'black',
  strokeWidth: 2,
}

// const store = useLayoutStore()
// 1.indexDB中查询数据
// async function initGridCell() {
//   store.gridCells = await getAllGridCellSortByIndex()
// }
// await initGridCell()
// console.log(store.gridCells,'initGridCell');

function print(val: string, e: any) {

}

function save(val: string, e: any) {
  // console.log(val, e)
}

// const saveCanvasLayoutData = useDebounceFn(() => {
//   store.gridCells.forEach((cell, index) => {
//     // 存储一个index，是为了将其层级存储一下，越大越顶层
//     editAGridCell({ ...cell, index })
//   })
// }, 1000)
</script>

<template>
  <V3Dragblock
    class="V3Dragblock"
    :grid-cells="gridCells"
    :activated="true"
    :draggable="true"
    :resizable="true"
    :adsorbable="true"
    :adsorb-line-style="adsorbLineStyle"
    @dragging="print('dragging', $event)"
    @drag-start="print('drag-start', $event)"
    @drag-end="save('drag-end', $event)"
    @resizing="print('resizing', $event)"
    @resize-start="print('resize-start', $event)"
    @resize-end="save('resize-end', $event)"
  />
</template>

<style scoped>
.V3Dragblock{
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
}
</style>
