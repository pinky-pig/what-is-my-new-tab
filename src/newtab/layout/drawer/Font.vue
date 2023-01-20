<script setup lang="ts">
import { SETTINGS } from './settings'
import { FontFamily } from '~/types/index'
import { useNewtabStore } from '~/store'

const store = useNewtabStore()
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
    <div class="rounded">
      <div class=" flex flex-row flex-wrap gap-10px justify-center">
        <div
          v-for="item in FontFamily"
          :key="item"
          class="border cursor-pointer w-200px h-150px rounded"
          @click="store.setSystemFontFamily(item)"
        >
          {{ item }}
        </div>
      </div>
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
