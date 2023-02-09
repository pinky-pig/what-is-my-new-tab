<script setup lang="ts">
import { GridCell } from './GridCell'
import { GridContainer } from './GridContainer'
const cellClass = new GridCell()
const CellComponent = cellClass.render()
</script>

<template>
  <GridContainer>
    <CellComponent />
  </GridContainer>
</template>

<style scoped>

</style>
