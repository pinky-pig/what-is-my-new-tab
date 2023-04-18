<script setup lang="ts">
// <div v-if="item.key === 'baidu'" i-ri-baidu-fill />
//       <div v-else-if="item.key === 'google'" i-ri:google-fill />
//       <div v-else-if="item.key === 'bing'" i-uil:bing />
//       <div v-else-if="item.key === 'zhihu'" i-ri:zhihu-fill />
//       <div v-else-if="item.key === 'github'" i-ri:github-fill />
//       <div v-else-if="item.key === 'tiktok'" i-ic:baseline-tiktok />
//       <div v-else-if="item.key === 'more'" i-ri:add-circle-line />
//       <div v-else>自定义icon</div>
// const config = ref({
//   size: SizeStyle.Small,
//   items: [
//     { key: 'baidu', url: 'https://www.baidu.com/s?wd=', color: '#669AE1', icon: 'ri-baidu-fill' },
//     { key: 'google', url: 'https://www.google.com/search?q=', color: '#70CC72', icon: 'ri:google-fill' },
//     { key: 'bing', url: 'https://www.bing.com/search?mkt=zh-CN&q=', color: '#FE4365', icon: 'uil:bing' },
//     { key: 'zhihu', url: 'https://www.zhihu.com/search?q=', color: '#C49CDE', icon: 'ri:zhihu-fill' },
//     { key: 'github', url: 'https://www.github.com/search?q=test', color: '#FC913A', icon: 'ri:github-fill' },
//     { key: 'more', url: '', color: '#62C2E4', icon: 'ri:add-circle-line' },
//   ],
// })

const searchText = ref('')
function handleSearch(e: KeyboardEvent) {
  if (!e.isComposing) {
    setTimeout(() => {
      window.open(`https://www.baidu.com/s?wd=${searchText.value}`)
    })
  }
}

function clearSearchText() {
  searchText.value = ''
}
</script>

<template>
  <div class=" w-full flex justify-center items-center pointer-events-none top-[12vh]">
    <section
      class="w-745px max-w-[86vw] pointer-events-auto"
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
            >
              <div class="text-blue-500 text-2xl" i-ri-baidu-fill />
            </section>
          </div>
        </div>

        <!-- 输入框 -->
        <input
          v-model="searchText"
          class="text-white tracking-widest outline-none h-full grow bg-[transparent] py-[12px] pl-[4px] pr-[42px] placeholder:text-gray-500 placeholder:text-color-t1"
          placeholder="输入搜索内容"
          autocomplete="off"
          @keydown.enter="handleSearch"
        >

        <!-- 清除 icon -->
        <div class="absolute top-0 right-0 flex h-full w-[48px] items-center justify-center">
          <button v-show="searchText" tabindex="-1" type="button" class="h-[32px] w-[32px]" @click="clearSearchText">
            <div class=" bg-[rgba(0,0,0,0.3)]" i-ooui:clear />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.search-box {
  position: absolute;
  top: 130px;
  left: 0px;
  left: 50%;
  transform: translateX(-50%);
  height: 40px;
  max-width: calc(100% - 200px);
  min-width: 300px;
  width: 500px;
  border-radius: 20px;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: row;
  border: 2px solid transparent;
  transition: 0.2s ease-in-out all;
  z-index: 10;
}
</style>
