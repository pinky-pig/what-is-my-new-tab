<script setup lang="ts">
import { SETTINGS } from './settings'

const config = SETTINGS.filter(i => i.name === 'Background')[0]

type BgType = 'random-colors' | 'linear-colors' | 'image'
interface BackgroundMode {
  type: BgType
  value: string
  name: string
}
const mode = ref<BackgroundMode[]>([
  {
    type: 'random-colors',
    value: ' random',
    name: '随机颜色',
  },
  {
    type: 'linear-colors',
    value: 'rgba(0,0,0,)',
    name: '线性渐变',

  },
  {
    type: 'image',
    value: 'https://',
    name: '图片',
  },
])

const currentMode = ref<BgType>('random-colors')

function handleSwitchBgMode(item: BackgroundMode) {
  currentMode.value = item.type
}
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
      <!-- mode -->
      <div style="flex:0 0 auto" class="p-3px h-90px rounded flex flex-row justify-between bg-[var(--primary-bg-color)] gap-2">
        <div
          v-for="item in mode"
          :key="item.type"
          :style="{ background: currentMode === item.type ? 'var(--second-bg-color )' : 'var(--primary-bg-color)' }"
          class=" mode-item cursor-pointer w-1/3 h-full rounded box-border p-6px flex justify-between flex-col"
          @click="handleSwitchBgMode(item)"
        >
          <div v-if="item.type === 'random-colors'" class="text-20px" i-material-symbols:brush />
          <div v-if="item.type === 'linear-colors'" class="text-20px" i-material-symbols:broken-image />
          <div v-if="item.type === 'image'" class="text-20px" i-ic:baseline-blur-linear />

          {{ item.name }}
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

.mode-item{
  transition: 0.2s all ease-in-out;
}
.mode-item:hover{
  background-color: var(--second-bg-color) !important;
}
</style>
