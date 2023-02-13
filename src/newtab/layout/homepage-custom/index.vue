<script setup lang="ts">
import type { Ref } from 'vue'
import type { GridCellType } from './GridCell'
import { GridCell } from './GridCell'
import { initGridContainer } from './GridContainer'
import { getAllGridCellSortByIndex } from './gridCellData'
import BoundsSVGContainer from './BoundsSVGContainer.vue'
import { useLayoutStore } from '~/store'

const attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];vh: any[];b: any[] } > = ref({ l: [], mv: [], r: [], t: [], vh: [], b: [] })
const currentClickedElement: Ref<any> = ref()
const GridContainer = initGridContainer(currentClickedElement, attachedLine)

const store = useLayoutStore()

// 1.indexDB中查询数据
const gridCellList = ref<GridCellType[]>([])
async function initGridCell() {
  gridCellList.value = await getAllGridCellSortByIndex()
}
await initGridCell()
// 2.渲染组件
gridCellList.value.forEach((item) => {
  const cell = new GridCell(item)
  store.gridCells.push(cell)
})
const gridCellComponents = computed(() => {
  return store.gridCells.map((item) => {
    const cell = new GridCell(item?.cfg)
    return {
      data: cell,
      component: cell.render(),
    }
  })
})
</script>

<template>
  <div>
    <GridContainer>
      <component :is="item.component" v-for="item in gridCellComponents" :key="item.data.cfg.value.id" />
    </GridContainer>
    <BoundsSVGContainer :current-clicked-element="currentClickedElement" :attached-line="attachedLine" />
  </div>
</template>

<style scoped>

</style>
