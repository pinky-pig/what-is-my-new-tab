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
  <div class=" w-700px h-full z-1 text-white py-20px ">
    <!-- Pined app -->
    <div class="flex flex-col items-start py-20px gap-10px">
      <p class="text-14px text-#767575 leading-4">
        Pined app
      </p>
      <div class=" flex flex-row gap-20px">
        <div v-for="(item,) in pinedWebsiteList" :key="item" class="w-50px h-50px cursor-pointer hover:text-#967575" i-carbon:logo-facebook />

        <n-popover ref="pinedPopoverRef" :overlap="false" placement="right-start" trigger="click">
          <template #trigger>
            <div class="w-50px h-50px cursor-pointer hover:text-#967575" i-carbon:add-alt />
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
      <div class=" flex flex-row gap-20px">
        <div v-for="(item,) in 10" :key="item" class="w-50px h-50px cursor-pointer hover:text-#967575" i-carbon:logo-facebook />
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
