<script setup lang="ts">
import { SETTINGS } from './settings'

const config = SETTINGS.filter(i => i.name === 'Font')[0]
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
    <div class="h-500px rounded">
      <n-tabs type="line" animated>
        <n-tab-pane name="oasis" tab="Oasis">
          Wonderwall
        </n-tab-pane>
        <n-tab-pane name="the beatles" tab="the Beatles">
          Hey Jude
        </n-tab-pane>
        <n-tab-pane name="jay chou" tab="周杰伦">
          七里香
        </n-tab-pane>
      </n-tabs>
    </div>
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
