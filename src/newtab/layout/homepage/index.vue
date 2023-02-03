<script setup lang="ts">
import { addPinedWebsite, getPinedWebsite } from './websiteData'
const pinedWebsiteList = ref<{ webName: string; type: number; url: string; property: { color: string } }[]>([])
onMounted(async () => {
  pinedWebsiteList.value = await getPinedWebsite()
})

const themes = [
  '64a6bd-90a8c3-ada7c9-d7b9d5-f4cae0'.split('-').map(a => `#${a}`),
  '4059ad-6b9ac4-97d8c4-eff2f1-f4b942'.split('-').map(a => `#${a}`),
  'd1f0b1-b6cb9e-92b4a7-8c8a93-81667a'.split('-').map(a => `#${a}`),
  '7776bc-cdc7e5-fffbdb-ffec51-ff674d'.split('-').map(a => `#${a}`),
  '628395-96897b-dbad6a-cf995f-d0ce7c'.split('-').map(a => `#${a}`),
  '28536b-c2948a-7ea8be-f6f0ed-bbb193'.split('-').map(a => `#${a}`),
  'dcc48e-eaefd3-b3c0a4-505168-27233a'.split('-').map(a => `#${a}`),
  'dab6c4-7b886f-b4dc7f-feffa5-ffa0ac'.split('-').map(a => `#${a}`),
]
const palettes = themes

const addPinedWebsiteUrl = ref('')
const addPinedWebsiteName = ref('')
const pinedPopoverRef = ref()

const handleAddPinedWebsite = () => {
  addPinedWebsite({
    url: addPinedWebsiteUrl.value,
    webName: addPinedWebsiteName.value,
    property: {
      color: palettes.flat()[Math.ceil(Math.random() * 10)],
    },
    type: 0,
  }).then(async () => {
    pinedWebsiteList.value = await getPinedWebsite()
    pinedPopoverRef.value.setShow(false)
  })
}

// 总共700，小的50，间距20
</script>

<template>
  <div class=" w-700px h-full z-1 text-white py-20px pointer-events-none">
    <!-- Pined app -->
    <div class="flex flex-col items-start py-20px gap-10px ">
      <p class="text-14px text-#767575 leading-4">
        Pined app
      </p>
      <div class=" flex flex-row gap-25px ">
        <div
          v-for="(item) in pinedWebsiteList"
          :key="item?.url || Math.random() * 100"
          :style="{ background: `${item?.property?.color}DD` }"
          class="pointer-events-auto w-45px h-45px rounded-xl cursor-pointer text-30px flex justify-center items-center hover:text-#967575"
        >
          {{ item.webName.slice(0, 1) }}
        </div>

        <n-popover v-if="pinedWebsiteList.length < 10" ref="pinedPopoverRef" :overlap="false" placement="right-start" trigger="click">
          <template #trigger>
            <svg class=" w-45px h-45px cursor-pointer hover:text-#967575 pointer-events-auto outline-none" width="32" height="32" viewBox="0 0 256 256">
              <path fill="#5A46FF" d="M 128 256 C 24.766 256 0 231.234 0 128 C 0 24.766 24.766 0 128 0 c 103.234 0 128 24.766 128 128 c 0 103.234 -24.766 128 -128 128 Z M 128 0 L 128 256 M 0 128 L 256 128" />
              <path d=" M 128 60 L 129 197 M 63 126 L 195 126" stroke="#fff" stroke-width="10" />
            </svg>
          </template>
          <div class=" w-200px flex flex-col gap-2">
            <n-input v-model:value="addPinedWebsiteUrl" type="text" placeholder="URL" />
            <n-input v-model:value="addPinedWebsiteName" type="text" placeholder="Name" />
            <n-button @click="handleAddPinedWebsite">
              保存
            </n-button>
          </div>
        </n-popover>
      </div>
    </div>

    <!-- Most used app -->
    <div class="flex flex-col items-start py-20px gap-10px">
      <p class="text-14px text-#767575 leading-4">
        Most used app
      </p>
      <div class=" flex flex-row gap-25px">
        <div v-for="(item,) in 10" :key="item" :style="{ background: palettes.flat()[Math.ceil(Math.random() * 10)] }" class=" pointer-events-auto w-45px h-45px rounded-xl cursor-pointer hover:text-#967575" />
      </div>
    </div>

    <!-- Widget -->
    <!-- <div class="flex flex-col items-start py-20px gap-10px">
      <p class="text-14px text-#767575 leading-4">
        Pined app
      </p>
      <div class=" flex flex-row gap-27px">
        <n-card v-for="(item,) in 2" :key="item">
          <div class="w-120px h-140px cursor-pointer hover:text-#967575" i-carbon:logo-facebook />
          <div>淘宝</div>
        </n-card>
      </div>
    </div> -->
  </div>
</template>

<style scoped>

</style>
