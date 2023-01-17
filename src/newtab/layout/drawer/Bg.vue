<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { SETTINGS } from './settings'
import { storageWallpaperDB } from '~/logic/storage'
import { useNewtabStore } from '~/store'

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

const store = useNewtabStore()
const { currentWallpaper } = storeToRefs(store)
// 自定义壁纸
const customWallPaper = ref('')
const uploadInputRef = ref()

const currentMode = ref<BgType>(currentWallpaper.value.type)
function handleSwitchBgMode(item: BackgroundMode) {
  currentMode.value = item.type

  currentWallpaper.value = { ...item, value: customWallPaper.value }
}

// 从DB中查询数据，只能查出一个 type === 1
onMounted(async () => {
  const queryResult = await storageWallpaperDB.getItemBySQL(
    { key: 'where', value: 'type' },
    { key: 'equals', value: 1 },
    { key: 'toArray', value: null },
  )

  // 如果未查到数据，说明是第一次，DB中wallpaper为空
  if (queryResult.length !== 0)
    customWallPaper.value = URL.createObjectURL(queryResult[0].blob)
})

// 上传自定义图片壁纸
const handleUploadInput = (e: Event) => {
  // 这里其实只选择了一个文件
  const files = []
  for (let i = 0; i < uploadInputRef.value.files.length; i++)
    files.push(uploadInputRef.value.files[i])

  files.forEach(async (item, index) => {
    const reader = new FileReader()
    reader.readAsDataURL(item)
    reader.onload = async function () {
      const result = await storageWallpaperDB.getItemBySQL(
        { key: 'where', value: 'type' },
        { key: 'equals', value: 1 },
        { key: 'toArray', value: null },
      )
      // 如果已经查到了
      if (result.length !== 0) {
        storageWallpaperDB.editItem({
          id: result[0].id,
          blob: item,
          type: 1,
        })
      }
      else {
        // 存储到indexDB
        storageWallpaperDB.addItem({
          blob: item,
          type: 1,
        })
      }
      // 预览
      customWallPaper.value = URL.createObjectURL(item)
      // 存储到store中
      currentWallpaper.value = { ...currentWallpaper.value, value: customWallPaper.value }
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
          <div v-if="item.type === 'image' " class="text-20px" i-ic:baseline-blur-linear />

          {{ item.name }}
        </div>
      </div>
      <!-- panel -->
      <div v-show="currentMode === 'random-colors'">
        random-colors
      </div>
      <div v-show="currentMode === 'image' ">
        <n-card class="card" size="small">
          <div class="overflow-hidden">
            <img
              class=" custom-wallpaper-preview-img w-full h-180px rounded object-cover"
              :src="customWallPaper"
              alt="未上传自定义壁纸"
            >
          </div>

          <div class=" my-10px flex justify-around">
            <n-button class="w-1/3">
              网络壁纸
            </n-button>
            <n-button class="w-1/3" @click="uploadInputRef.click()">
              <input
                v-show="false"
                ref="uploadInputRef"
                accept="image/jpg,image/png,image/jpeg,image/webp"
                type="file"
                name="file"
                single
                @change="handleUploadInput"
              >
              自定义壁纸
            </n-button>
          </div>

          <div class="border border-[var(--n-border-color)] p-2 rounded-md flex flex-col gap-2 mt-4">
            <div class=" flex flex-row gap-4 items-center">
              <div>模糊</div>
              <div class="flex-1">
                <n-slider v-model:value="store.customImageStatus.blur" :min="0" :max="100" :step="1" :tooltip="false" />
              </div>
              <div class="w-30px">
                {{ store.customImageStatus.blur || 0 }}
              </div>
            </div>

            <div class=" flex flex-row gap-4 items-center">
              <div>遮罩</div>
              <div class="flex-1">
                <n-slider v-model:value="store.customImageStatus.mask" :min="0" :max="1" :step="0.01" :tooltip="false" />
              </div>
              <div class="w-30px">
                {{ store.customImageStatus.mask || 0 }}
              </div>
            </div>
          </div>
        </n-card>
      </div>
      <div v-show="currentMode === 'linear-colors'">
        linear-colors
      </div>
    </div>

    <svg>
      <defs>
        <filter id="customWallpaperPreviewContainer">
          <feGaussianBlur :stdDeviation="store.customImageStatus.blur" edgeMode="duplicate" in="SourceGraphic" />
        </filter>
      </defs>
    </svg>
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

.custom-wallpaper-preview-img {
  display: inline-block;
  transform: scale(1);
}
.custom-wallpaper-preview-img::before {
  content: '';
  position: absolute;
  left: 0; top: 0;
  width: 100%; height: 100%;
  color: transparent;
  background: #f5f5f5 url("data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cpath d='M304.128 456.192c48.64 0 88.064-39.424 88.064-88.064s-39.424-88.064-88.064-88.064-88.064 39.424-88.064 88.064 39.424 88.064 88.064 88.064zm0-116.224c15.36 0 28.16 12.288 28.16 28.16s-12.288 28.16-28.16 28.16-28.16-12.288-28.16-28.16 12.288-28.16 28.16-28.16z' fill='%23e6e6e6'/%3E%3Cpath d='M887.296 159.744H136.704C96.768 159.744 64 192 64 232.448v559.104c0 39.936 32.256 72.704 72.704 72.704h198.144L500.224 688.64l-36.352-222.72 162.304-130.56-61.44 143.872 92.672 214.016-105.472 171.008h335.36C927.232 864.256 960 832 960 791.552V232.448c0-39.936-32.256-72.704-72.704-72.704zm-138.752 71.68v.512H857.6c16.384 0 30.208 13.312 30.208 30.208v399.872L673.28 408.064l75.264-176.64zM304.64 792.064H165.888c-16.384 0-30.208-13.312-30.208-30.208v-9.728l138.752-164.352 104.96 124.416-74.752 79.872zm81.92-355.84l37.376 228.864-.512.512-142.848-169.984c-3.072-3.584-9.216-3.584-12.288 0L135.68 652.8V262.144c0-16.384 13.312-30.208 30.208-30.208h474.624L386.56 436.224zm501.248 325.632c0 16.896-13.312 30.208-29.696 30.208H680.96l57.344-93.184-87.552-202.24 7.168-7.68 229.888 272.896z' fill='%23e6e6e6'/%3E%3C/svg%3E") no-repeat center / 50% 50%;
}
.custom-wallpaper-preview-img::after {
  content: attr(alt);
  position: absolute;
  left: 0; bottom: 0;
  width: 100%;
  line-height: 2;
  background-color: rgba(0,0,0,.5);
  color: white;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-wallpaper-preview-img{
  filter: url(#customWallpaperPreviewContainer);
}
</style>
