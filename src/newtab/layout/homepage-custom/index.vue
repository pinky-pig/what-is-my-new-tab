<script setup lang="ts">
import type { Ref } from 'vue'
import type { GridCellType } from './GridCell'
import { GridCell } from './GridCell'
import { initGridContainer } from './GridContainer'
import { getAllGridCell } from './gridCellData'
import BoundsSVGContainer from './BoundsSVGContainer.vue'
import { useLayoutStore } from '~/store'

const attachedLine: Ref<{ x: any[]; y: any[] } > = ref({ x: [], y: [] })
const currentClickedElement: Ref<any> = ref()
const GridContainer = initGridContainer(currentClickedElement, attachedLine)

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
</script>

<template>
  <GridContainer>
    <component :is="item.component" v-for="item in gridCellComponents" :key="item.data.cfg.value.id" />
    <BoundsSVGContainer :current-clicked-element="currentClickedElement" :attached-line="attachedLine" />
  </GridContainer>
</template>

<style scoped>

</style>
