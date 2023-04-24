<script setup lang="ts">
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
  if (item.label !== '更多') {
    currentSearchEngine.value = item
    isShowSearchEngine.value = !isShowSearchEngine.value
  }
}
</script>

<template>
  <div class=" w-full flex flex-col justify-center items-center pointer-events-none top-[12vh]">
    <section
      class="w-[676px] max-w-[86vw] pointer-events-auto"
      style="transition-property: top; transition-duration: 200ms; top: 50px;"
    >
      <div class="search-box w-full h-[48px] flex items-center rounded-[12px] text-[var(--primary-text-color)] bg-opacity-60 transition-colors duration-100 focus-within:bg-opacity-80 dark:focus-within:bg-opacity-70 ">
        <!-- icon -->
        <div class="current flex h-full w-[48px] items-center justify-center">
          <div
            class=" flex h-[28px] w-[28px] cursor-pointer items-center justify-center rounded-[8px] bg-opacity-80 hover:bg-color-white hover:bg-opacity-80"
          >
            <section
              class=" flex items-center justify-center overflow-hidden bg-cover h-[24px] w-[24px] rounded-[6px] bg-transparent"
              @click="isShowSearchEngine = !isShowSearchEngine"
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

    <!-- 搜索引擎 -->
    <section
      v-show="isShowSearchEngine"
      class="
        search-engine
        w-[676px] max-w-[86vw] h-[90px]
        pointer-events-auto
        rounded-[12px]
        mt-10px p-4
        flex flex-row justify-start items-center
        "
      style="transition-property: top; transition-duration: 200ms; top: 50px;"
    >
      <div
        v-for="item in searchConfig"
        :key="item.label"
        class="w-70px h-64px flex flex-col justify-center items-center cursor-pointer gap-5px"
        @click="handleSelectedSearchEngine(item)"
      >
        <div class="w-36px h-36px text-blue-500 rounded-8px bg-white flex flex-col justify-center items-center" v-html="item.icon" />

        <span class="text-12px">{{ item.label }}</span>
      </div>
    </section>
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
</style>
