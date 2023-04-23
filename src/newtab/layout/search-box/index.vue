<script setup lang="ts">
const searchConfig = ref([
  { label: 'baidu', url: 'https://www.baidu.com/s?wd=', color: '#669AE1', icon: 'ri-baidu-fill' },
  { label: 'google', url: 'https://www.google.com/search?q=', color: '#70CC72', icon: 'ri:google-fill' },
  { label: 'bing', url: 'https://www.bing.com/search?mkt=zh-CN&q=', color: '#FE4365', icon: 'uil:bing' },
  { label: 'zhihu', url: 'https://www.zhihu.com/search?q=', color: '#C49CDE', icon: 'ri:zhihu-fill' },
  { label: 'github', url: 'https://www.github.com/search?q=test', color: '#FC913A', icon: 'ri:github-fill' },
  { label: 'more', url: '', color: '#62C2E4', icon: 'ri:add-circle-line' },
])

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

function handleSelectedSearchEngine(item: typeof searchConfig.value[0]) {
  if (item.label !== 'more')
    currentSearchEngine.value = item
}

const isShowSearchEngine = ref(false)
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
              <div class="text-blue-500 text-2xl" i-ri-baidu-fill />
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
        class="w-70px h-64px flex flex-col justify-center items-center cursor-pointer"
        @click="handleSelectedSearchEngine(item)"
      >
        <img class="w-36px h-36px rounded-8px" src="http://placekitten.com/36/36" alt="">
        <span>{{ item.label }}</span>
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
