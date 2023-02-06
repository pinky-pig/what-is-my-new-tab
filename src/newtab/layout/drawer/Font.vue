<script setup lang="ts">
import { SETTINGS } from './settings'
import { FontFamily } from '~/types/index'
import { useNewtabStore } from '~/store'

const store = useNewtabStore()
const config = SETTINGS.filter(i => i.name === 'Font')[0]
</script>

<template>
  <n-card
    class="card"
    size="small"
  >
    <!-- title -->
    <div class="text-[var(--primary-text-color)] flex flex-row h-40px w-full text-xl font-normal justify-start items-center gap-2">
      <div v-html="config.icon" />
      {{ config.name }}
    </div>
    <n-divider />
    <!-- body -->
    <div class="rounded">
      <div class=" flex flex-row flex-wrap gap-15px justify-center">
        <div
          v-for="item in FontFamily"
          :key="item"
          :class="`font-${item.replace(' ', '')}`"
          class=" cursor-pointer w-200px h-200px px-5px"
          :style="{ background: store.currentFontFamily === item ? 'var(--second-bg-color )' : 'var(--primary-bg-color)' }"
          style="outline: 5px solid var(--primary-bg-color); border-radius: 5px;"
          @click="store.setSystemFontFamily(item)"
        >
          <div class="text-xs mb-2 leading-6">
            {{ item }}
          </div>
          <div class="tracking-wide">
            不要忽视梦想，不要工作太久，说出想法，交朋友，要开心。
            Don't ignore your dreams;
            Don't work too much;
            say what you think;
            cultivate friendships;
            be happy~
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<style scoped>
.card{
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.font-DEFAULT {
  font-family: v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important;
}
.font-LXGWWenKai {
  font-family: LXGW WenKai !important;
}
.font-ZCOOLKuaiLe {
  font-family: ZCOOL KuaiLe !important
}
.font-ZCOOLXiaoWei {
  font-family: ZCOOL XiaoWei !important
}
</style>
