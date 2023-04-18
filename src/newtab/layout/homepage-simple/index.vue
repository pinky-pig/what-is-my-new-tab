<script setup lang="ts">
import SearchBox from '../search-box/index.vue'
import Footer from './Footer.vue'
</script>

<template>
  <div
    w-full h-full
    flex flex-col justify-start items-center
    z-2
    pt-24
  >
    <SearchBox />
    <div
      class="
      fixed bottom-30px left-0
      w-full
      flex justify-center items-center"
    >
      <Footer />
    </div>

    <!-- <div
      class="
      fixed bottom-30px left-0
      w-full
      flex justify-center items-center"
    >
      <Dockbar>
        <DockbarItem :has-divide-line="false" tooltip="地球模式">
          <div i-carbon:earth-southeast-asia class=" text-[var(--dockbar-text)] w-full h-full" />
        </DockbarItem>
        <DockbarItem :has-divide-line="true" tooltip="当前位置">
          <div i-carbon:location class=" text-[var(--dockbar-text)] w-full h-full" />
        </DockbarItem>
        <DockbarItem :has-divide-line="false" tooltip="更多">
          <div i-carbon:settings class=" text-[var(--dockbar-text)] w-full h-full" />
        </DockbarItem>
      </Dockbar>
    </div> -->
  </div>
</template>

<style scoped>

</style>
