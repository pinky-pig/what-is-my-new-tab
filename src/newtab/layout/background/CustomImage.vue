<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNewtabStore } from '~/store'

const store = useNewtabStore()
const { currentWallpaper } = storeToRefs(store)
const imgMask = computed(() => `rgba(0, 0, 0, ${store.customImageStatus.mask || 0}`)

const customWallPaper = computed(() => {
  return currentWallpaper.value.value
})
</script>

<template>
  <div id="custom-image-canvas" class="custom-image-canvas w-full h-full relative ">
    <img
      class=" custom-wallpaper-preview-img w-full h-full absolute object-cover"
      :src="customWallPaper"
      alt="未上传自定义壁纸"
    >
  </div>

  <svg>
    <defs>
      <filter id="customWallpaperContainer">
        <feGaussianBlur :stdDeviation="store.customImageStatus.blur" edgeMode="duplicate" in="SourceGraphic" />
      </filter>
    </defs>
  </svg>
</template>

<style scoped>
.custom-image-canvas{
  filter: url(#customWallpaperContainer);
}

.custom-image-canvas::after{
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  /* backdrop-filter: blur(50px); */
  background-color: v-bind(imgMask);
}
</style>
