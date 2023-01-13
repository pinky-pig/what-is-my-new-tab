<script setup lang="ts">
import { SETTINGS } from './settings'

const config = SETTINGS.filter(i => i.name === 'Background')[0]
</script>

<template>
  <n-card
    class="card"
    size="small"
  >
    <!-- title -->
    <div class="text-[var(--primary-text-color)] flex flex-row h-40px w-full text-xl font-normal justify-start items-center gap-2">
      <div v-html="config.icon" />
      {{ config.name }}
    </div>
    <n-divider />
    <!-- body -->
    <div class="h-500px rounded" />
  </n-card>
</template>

<style scoped>
.card{
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
