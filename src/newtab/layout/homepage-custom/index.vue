<script setup lang="ts">
import type { GridCellType } from './GridCell'
import { GridCell } from './GridCell'
import { initGridContainer } from './GridContainer'
import { getAllGridCell } from './gridCellData'
import { useLayoutStore } from '~/store'
// import { storageCustomLayoutDB } from '~/logic'
// import { generateUuid } from '~/utils/uuid'
const GridContainer = initGridContainer()

const store = useLayoutStore()

// 1.indexDB中查询数据
const gridCellList = ref<GridCellType[]>([])
async function initGridCell() {
  gridCellList.value = await getAllGridCell()
}
await initGridCell()
// 2.渲染组件
const gridCellComponents = gridCellList.value.map((item) => {
  const cell = new GridCell(item)

  store.gridCells.push(cell)
  return {
    data: cell,
    component: cell.render(),
  }
})

// onMounted(() => {
//   setTimeout(() => {
//     store.gridCells[0].cfg.width = 500
//     // cellClass.cfg.value.width = 500
//   }, 3000)
// })
// 存储到indexDB
// storageCustomLayoutDB.addItem({
//   id: generateUuid(),
//   x: 0,
//   y: 0,
//   width: 200,
//   height: 200,
//   rotate: 0,
//   scale: 1,
//   isLocked: false, // 是否锁定
//   showMode: 0, // 0 格子 1 列表
// })
</script>

<template>
  <GridContainer>
    <component :is="item.component" v-for="item in gridCellComponents" :key="item.data.cfg.value.id" />
  </GridContainer>
</template>

<style scoped>

</style>
