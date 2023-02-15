<script setup lang="ts">
import type { Ref } from 'vue'
import { initGridContainer } from './GridContainer'
import { getAllGridCellSortByIndex } from './gridCellData'
import BoundsSVGContainer from './BoundsSVGContainer.vue'
import GridCell from './GridCell.vue'
import { useLayoutStore } from '~/store'

const attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];mh: any[];b: any[] } > = ref({ l: [], mv: [], r: [], t: [], mh: [], b: [] })
const currentClickedElement: Ref<any> = ref()
const GridContainer = initGridContainer(currentClickedElement, attachedLine)

const store = useLayoutStore()

// 1.indexDB中查询数据
async function initGridCell() {
  store.gridCells = await getAllGridCellSortByIndex()
}
await initGridCell()
</script>

<template>
  <div>
    <GridContainer>
      <GridCell v-for="item, index in store.gridCells" :key="item?.id" v-model="store.gridCells[index]" />
    </GridContainer>
    <BoundsSVGContainer v-model="currentClickedElement" :current-clicked-element="currentClickedElement" :attached-line="attachedLine" />
  </div>
</template>

<style scoped>

</style>
