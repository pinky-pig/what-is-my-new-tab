<script setup lang="ts">
import { addPinedWebsite, getPinedWebsite } from './websiteData'

const pinedWebsiteList = ref([])
onMounted(async () => {
  pinedWebsiteList.value = await getPinedWebsite()
})

const addPinedWebsiteUrl = ref('')
const addPinedWebsiteName = ref('')
const pinedPopoverRef = ref()

const handleAddPinedWebsite = () => {
  addPinedWebsite({
    url: addPinedWebsiteUrl.value,
    webName: addPinedWebsiteName.value,
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
        <div v-for="(item,) in pinedWebsiteList" :key="item" class="website-item pointer-events-auto w-45px h-45px rounded-xl cursor-pointer hover:text-#967575" />

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
        <div v-for="(item,) in 10" :key="item" class="website-item pointer-events-auto w-45px h-45px rounded-xl cursor-pointer hover:text-#967575" />
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
.website-item{
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='45' height='45' viewBox='0 0 256 256'%3E%3Cpath fill='%235A46FF' d='M128 256 C24.766 256 0 231.234 0 128 C0 24.766 24.766 0 128 0c103.234 0 128 24.766 128 128c0 103.234-24.766 128-128 128Z'/%3E%3C/svg%3E");
}
</style>
