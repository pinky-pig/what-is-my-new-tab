<script setup lang="ts">
import { SETTINGS } from './settings'
import { storageWallpaperDB } from '~/logic/storage'

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
    type: 'image',
    value: 'https://',
    name: '图片',
  },
  {
    type: 'linear-colors',
    value: 'rgba(0,0,0,)',
    name: '线性渐变',

  },
])

const currentMode = ref<BgType>('random-colors')

function handleSwitchBgMode(item: BackgroundMode) {
  currentMode.value = item.type
}

// 自定义壁纸
const customWallPaper = ref('')
const uploadInputRef = ref()

storageWallpaperDB.getItemBySQL()

const handleUploadInput = (e: Event) => {
  // 这里其实只选择了一个文件
  const files = []
  for (let i = 0; i < uploadInputRef.value.files.length; i++)
    files.push(uploadInputRef.value.files[i])

  files.forEach(async (item, index) => {
    const reader = new FileReader()
    reader.readAsDataURL(item)
    reader.onload = await function () {
      // 存储到indexDB
      storageWallpaperDB.addItem({
        blob: item,
        type: 1,
      })
      // 预览
      customWallPaper.value = URL.createObjectURL(item)
    }
  })
}
</script>

<template>
  <n-card class="card" size="small">
    <!-- title -->
    <div
      class="text-[var(--primary-text-color)] flex flex-row h-40px w-full text-xl font-normal justify-start items-center gap-2"
    >
      <div v-html="config.icon" />
      {{ config.name }}
    </div>
    <n-divider />
    <!-- body -->
    <div class="rounded">
      <!-- mode -->
      <div
        style="flex:0 0 auto"
        class="p-3px h-90px rounded flex flex-row justify-between bg-[var(--primary-bg-color)] gap-2"
      >
        <div
          v-for="item in mode" :key="item.type"
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
      <!-- panel -->
      <div v-show="currentMode === 'random-colors'">
        random-colors
      </div>
      <div v-show="currentMode === 'image'">
        <n-card class="card" size="small">
          <img class="w-full h-180px rounded object-cover" :src="customWallPaper" alt="自定义壁纸缩略图">

          <div class=" my-10px flex justify-around">
            <n-button class="w-1/3">
              网络壁纸
            </n-button>
            <n-button class="w-1/3" @click="uploadInputRef.click()">
              <input
                v-show="false" ref="uploadInputRef" accept="image/*" type="file" name="file"
                @change="handleUploadInput"
              >
              自定义壁纸
            </n-button>
          </div>

          <div class="border border-[var(--n-border-color)] p-2 rounded-md flex flex-col gap-2 mt-4">
            <div class=" flex flex-row gap-4 items-center">
              <div>模糊</div>
              <div class="flex-1">
                <n-slider :tooltip="false" />
              </div>
              <div>
                60
              </div>
            </div>

            <div class=" flex flex-row gap-4 items-center">
              <div>遮罩</div>
              <div class="flex-1">
                <n-slider :tooltip="false" />
              </div>
              <div>
                30
              </div>
            </div>
          </div>
        </n-card>
      </div>
      <div v-show="currentMode === 'linear-colors'">
        linear-colors
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.card {
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}

.mode-item {
  transition: 0.2s all ease-in-out;
}

.mode-item:hover {
  background-color: var(--second-bg-color) !important;
}
</style>
