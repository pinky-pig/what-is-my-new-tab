<script setup lang="ts">
import { GridCell } from './GridCell'
import { initGridContainer } from './GridContainer'
import { useLayoutStore } from '~/store'

const cellClass = new GridCell()
const store = useLayoutStore()
store.gridCells.push(cellClass)

// onMounted(() => {
//   setTimeout(() => {
//     store.gridCells[0].cfg.width = 500
//     // cellClass.cfg.value.width = 500
//   }, 3000)
// })
const CellComponent = cellClass.render()

const GridContainer = initGridContainer()
</script>

<template>
  <GridContainer>
    <CellComponent />
  </GridContainer>
</template>

<style scoped>

</style>
