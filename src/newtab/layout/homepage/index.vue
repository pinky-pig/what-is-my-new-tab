<script setup lang="ts">
import ContentDropMenu from './ContentDropMenu.vue'
import { addPinedWebsite, deletePinedWebsite, editPinedWebsite, getPinedWebsite } from './websiteData'
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

const pinedWebsiteUrlInput = ref('')
const pinedWebsiteNameInput = ref('')
const pinedPopoverModal = ref(false)
const currentClickedItem = ref<{
  id: number
  property: { color: string }
  type: number
  url: string
  webName: string
}>()

// 添加新pined网址
const handleAddPinedWebsite = () => {
  if (pinedWebsiteUrlInput.value === '') {
    window.$message.warning('请先输入网站地址')
    return
  }

  if (currentClickedItem.value) {
    editPinedWebsite({
      id: currentClickedItem.value.id,
      url: pinedWebsiteUrlInput.value,
      webName: pinedWebsiteNameInput.value,
      property: {
        color: palettes.flat()[Math.ceil(Math.random() * 10)],
      },
      type: 0,
    }).then(async () => {
      pinedWebsiteList.value = await getPinedWebsite()
      pinedPopoverModal.value = false
    })
  }
  else {
    addPinedWebsite({
      url: pinedWebsiteUrlInput.value,
      webName: pinedWebsiteNameInput.value,
      property: {
        color: palettes.flat()[Math.ceil(Math.random() * 10)],
      },
      type: 0,
    }).then(async () => {
      pinedWebsiteList.value = await getPinedWebsite()
      pinedPopoverModal.value = false
    })
  }
}

// 右键菜单
const pinedItemContextMenuOption = [
  { label: 'edit', key: 'edit' },
  { label: 'delete', key: 'delete' },
]

const showDropdownRef = ref(false)
const xRef = ref(0)
const yRef = ref(0)

// 打开右键菜单
const handlePinedContextMenu = (e: MouseEvent, item: any, index: number) => {
  e.preventDefault()
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = e.clientX
    yRef.value = e.clientY
    currentClickedItem.value = item
  })
}
// 右键菜单选项
function handleSelectedWebsite(e: string) {
  showDropdownRef.value = false
  if (e === 'edit') {
    pinedPopoverModal.value = true
    pinedWebsiteUrlInput.value = currentClickedItem?.value?.url || ''
    pinedWebsiteNameInput.value = currentClickedItem?.value?.webName || ''
  }
  else if (e === 'delete') {
    if (currentClickedItem?.value) {
      deletePinedWebsite(currentClickedItem?.value?.id)
        .then(async () => {
          pinedWebsiteList.value = await getPinedWebsite()
        })
    }
  }
}
// 新增网址modal
function handleOpenAddPinedModal() {
  pinedPopoverModal.value = true
  currentClickedItem.value = undefined
  pinedWebsiteUrlInput.value = ''
  pinedWebsiteNameInput.value = ''
}
function jumpToWebsite(item: any) {
  window.open(item.url)
}
</script>

<template>
  <div class=" w-676px h-full z-1 text-white py-20px pointer-events-none">
    <!-- Pined app -->
    <div class="flex flex-col items-start py-20px gap-10px ">
      <p class="text-14px text-#767575 leading-4">
        Pined app
      </p>
      <div class=" flex flex-row gap-25px select-none">
        <div
          v-for="(item, index) in pinedWebsiteList"
          :key="item?.url || Math.random() * 100"
          :style="{ background: `${item?.property?.color}DD` }"
          class="pointer-events-auto w-45px h-45px rounded-xl cursor-pointer text-30px flex justify-center items-center hover:text-#967575"
          @click="jumpToWebsite(item)"
          @contextmenu="v => handlePinedContextMenu(v, item, index)"
        >
          {{ item.webName.slice(0, 1) }}
        </div>

        <svg v-if="pinedWebsiteList.length < 10" class=" w-45px h-45px cursor-pointer hover:text-#967575 pointer-events-auto outline-none" width="32" height="32" viewBox="0 0 256 256" @click="handleOpenAddPinedModal">
          <path fill="#5A46FF" d="M 128 256 C 24.766 256 0 231.234 0 128 C 0 24.766 24.766 0 128 0 c 103.234 0 128 24.766 128 128 c 0 103.234 -24.766 128 -128 128 Z M 128 0 L 128 256 M 0 128 L 256 128" />
          <path d=" M 128 60 L 129 197 M 63 126 L 195 126" stroke="#fff" stroke-width="10" />
        </svg>
      </div>
    </div>

    <!-- Most used app -->
    <div class="flex flex-col items-start py-20px gap-10px">
      <p class="text-14px text-#767575 leading-4">
        Most used app
      </p>
      <div class=" flex flex-row gap-25px">
        <div
          v-for="(item,) in 3"
          :key="item"
          :style="{ 'background': palettes.flat()[Math.ceil(Math.random() * 10)], 'flex-direction': Math.random() > 0.5 ? 'row' : 'row-reverse' }"
          class="flex gap-15px p-1 pointer-events-auto w-185px h-115px rounded-xl cursor-pointer hover:text-#967575"
        >
          <div
            :style="{ background: palettes.flat()[Math.ceil(Math.random() * 10)] }"
            class="h-full w-2/3 rounded-lg"
          />
          <div>name</div>
        </div>
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

    <ContentDropMenu
      v-model:showDropdownRef="showDropdownRef"
      :x="xRef"
      :y="yRef"
      :options="pinedItemContextMenuOption"
      @d="handleSelectedWebsite"
    />

    <n-modal v-model:show="pinedPopoverModal">
      <n-card
        style="width: 600px"
        role="dialog"
        class="card "
        size="small"
      >
        <div class="flex flex-col gap-10px">
          <n-input v-model:value="pinedWebsiteUrlInput" type="text" placeholder="URL" />
          <n-input v-model:value="pinedWebsiteNameInput" type="text" placeholder="Name" />
          <div class=" my-10px flex justify-around">
            <n-button class="w-1/3" @click="handleAddPinedWebsite">
              保存
            </n-button>
            <n-button class="w-1/3" @click="pinedPopoverModal = false">
              取消
            </n-button>
          </div>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<style scoped>
.card {
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
