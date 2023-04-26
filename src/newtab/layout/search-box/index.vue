<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { searchEngine } from './engine'

const searchConfig = ref(searchEngine)

const currentSearchEngine = ref(searchConfig.value[0])

const searchText = ref('')
function handleSearch(e: KeyboardEvent) {
  if (!e.isComposing) {
    setTimeout(() => {
      window.open(`${currentSearchEngine.value.url}${searchText.value}`)
    })
  }
}

function clearSearchText() {
  searchText.value = ''
}

const isShowSearchEngine = ref(false)

function handleSelectedSearchEngine(item: typeof searchConfig.value[0]) {
  currentSearchEngine.value = item
  isShowSearchEngine.value = !isShowSearchEngine.value
}

function isOpenSearchEngineList() {
  isShowSearchEngine.value = !isShowSearchEngine.value
}

const isShowEngineModal = ref(false)
function handleShowEngineModal() {
  isShowEngineModal.value = !isShowEngineModal.value
}

const target = ref(null)
onClickOutside(target, (event: PointerEvent) => {
  // 1. 如果是点击 icon ，不对其进行操作
  if ((event.target as HTMLElement).id === 'search-icon')
    return
  // 2. 如果当前正处于编辑状态，不对其进行操作
  if (isShowEngineModal.value)
    return
  // 否则，将其选择栏收起来
  isShowSearchEngine.value = false
})

const customSearchEngine = reactive({
  name: '',
  url: '',
  icon() {
    return this.name.slice(0, 1)
  },
})
function handleCloseEngineModal() {
  customSearchEngine.name = ''
  customSearchEngine.url = ''
  isShowEngineModal.value = false
}
function handleSaveEngineModal() {
  customSearchEngine.name = ''
  customSearchEngine.url = ''
  isShowEngineModal.value = false
}
</script>

<template>
  <div class=" w-full flex flex-col justify-center items-center pointer-events-none top-[12vh]">
    <section
      class="w-[676px] max-w-[86vw] pointer-events-auto"
      style="transition-property: top; transition-duration: 200ms; top: 50px;"
    >
      <div class="search-box overflow-hidden w-full h-[48px] flex items-center rounded-[12px] text-[var(--primary-text-color)] bg-opacity-60 transition-colors duration-100 focus-within:bg-opacity-80 dark:focus-within:bg-opacity-70 ">
        <!-- icon -->
        <div id="search-icon" class="cursor-pointer flex h-full w-[48px] items-center justify-center" @click="isOpenSearchEngineList">
          <div
            class="pointer-events-none flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[8px] bg-opacity-80 hover:bg-color-white hover:bg-opacity-80"
          >
            <section
              class=" flex items-center justify-center overflow-hidden bg-cover h-[24px] w-[24px] rounded-[6px] bg-transparent"
            >
              <div class="text-blue-500 " v-html="currentSearchEngine.icon" />
            </section>
          </div>
        </div>

        <!-- 输入框 -->
        <input
          v-model="searchText"
          class=" outline-none h-full grow bg-[transparent] py-[12px] pl-[4px] pr-[42px] placeholder:text-color-t1 placeholder:text-opacity-40"
          placeholder="输入搜索内容"
          autocomplete="off"
          @keydown.enter="handleSearch"
        >

        <!-- 清除 icon -->
        <div class="absolute top-0 right-0 flex h-full w-[48px] items-center justify-center">
          <button v-show="searchText" tabindex="-1" type="button" class="h-[32px] w-[32px]" @click="clearSearchText">
            <div i-ooui:clear />
          </button>
        </div>
      </div>
    </section>

    <!-- 搜索引擎 ，最多 9 个 -->
    <section
      ref="target"
      :style="{
        height: isShowSearchEngine ? '90px' : '0px',
        padding: isShowSearchEngine ? '1rem 1.4rem' : '0 1.4rem',
      }"
      class="
        search-engine
        w-[676px] max-w-[86vw] overflow-hidden
        pointer-events-auto
        rounded-[12px]
        mt-10px p-4
        select-none
        flex flex-row justify-start items-center
        transition-all ease-in duration-200
        "
    >
      <div
        v-for="item in searchConfig.slice(0, 9)"
        :key="item.label"
        class="search-engine-item w-70px h-64px flex flex-col justify-center items-center cursor-pointer gap-5px flex-shrink-0 flex-grow-0"
        @click="handleSelectedSearchEngine(item)"
      >
        <div class="w-36px h-36px text-blue-500 rounded-8px bg-white flex flex-col justify-center items-center" v-html="item.icon" />

        <span class="text-12px">{{ item.label }}</span>
      </div>

      <div
        v-show="searchConfig.length < 10"
        class="search-engine-item w-70px h-64px flex flex-col justify-center items-center cursor-pointer gap-5px flex-shrink-0 flex-grow-0"
        @click="handleShowEngineModal"
      >
        <div class="w-36px h-36px text-blue-500 rounded-8px bg-white flex flex-col justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M11 11V7h2v4h4v2h-4v4h-2v-4H7v-2h4Zm1 11C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10Zm0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16Z" /></svg>
        </div>
        <span class="text-12px"> 更多 </span>
      </div>
    </section>

    <GlassModal v-model="isShowEngineModal" class="pointer-events-auto">
      <div>
        <div class=" flex flex-col mb-15px">
          <span class="h-36px text-16px flex justify-start items-center">名称</span>
          <input v-model="customSearchEngine.name" type="text" class=" border rounded-md h-40px px-2 outline-none">
        </div>
        <div class=" flex flex-col mb-15px">
          <span class="h-36px text-16px flex justify-start items-center relative z-999">地址</span>
          <div class=" flex flex-row">
            <div
              class="
                tag-box
                w-75px h-40px
                px-2 mr-2
                rounded-md border-white border
                flex-shrink-0 flex-grow-0
                flex justify-center items-center
                font-semibold
                text-blue-400
               "
            >
              https://
            </div>
            <input v-model="customSearchEngine.url" type="text" class=" border w-full rounded-md h-40px px-2 outline-none">
          </div>
        </div>
        <div class=" flex flex-col ">
          <span class="h-36px text-12px flex justify-start items-center">预览</span>
          <div class=" flex flex-row justify-between">
            <div class=" w-80px h-80px flex flex-col justify-center items-center rounded-[25%] tag-box">
              <div class="w-36px h-36px text-blue-500 rounded-8px bg-white flex flex-col justify-center items-center">
                {{ customSearchEngine.icon() }}
              </div>
              <span class="text-12px">{{ customSearchEngine.name.slice(0, 4) || '名称' }}</span>
            </div>
            <div class="flex gap-20px justify-center items-center">
              <button
                class="btn-box w-80px h-40px bg-blue-500 rounded-md text-white font-semibold "
                @click="handleCloseEngineModal"
              >
                取消
              </button>
              <button
                class="btn-box w-80px h-40px bg-blue-500 rounded-md text-white font-semibold "
                @click="handleSaveEngineModal"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>
    </GlassModal>
  </div>
</template>

<style scoped>
.search-box {
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  border: 1px solid #ffffff1a;
  box-shadow: 0 4px 16px 0 #0000001a;
}
.search-engine{
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
}
.search-engine-item:hover{
  border-radius: 10px;
  overflow: hidden;
  height: 70px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(80px);
}
#search-icon:hover{
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(80px);
}
.tag-box{
  border: 2px solid white;
  background: #d6dbf9;
  box-shadow:  20px 20px 60px #d5d4d4,
             -20px -20px 60px #ffffff;
}
.btn-box{
  box-shadow:  20px 20px 60px #d5d4d4,
             -20px -20px 60px #ffffff;
}
</style>
