import { defineStore } from 'pinia'
type BgType = 'random-colors' | 'linear-colors' | 'image'
interface currentWallpaperType {
  type: BgType
  value: string // 只有网络图片的时候，使用的到
  name: string // 只有网络图片的时候，使用的到

}
export const useNewtabStore = defineStore({
  id: 'newtabStore',
  state: () => {
    return {
      isOpenDrawer: false,
      currentWallpaper: {
        type: 'random-colors',
        value: ' random',
        name: '随机颜色',
      } as currentWallpaperType,

      // 自定义图片壁纸的模糊属性
      customImageStatus: {
        blur: 0,
        mask: 0,
      },
    }
  },
  getters: {

  },
  actions: {

  },
  persist: {
    // 开启数据缓存。默认session
    enabled: true,
    strategies: [
      {
        key: 'newtab',
        storage: localStorage,
        paths: ['currentWallpaper'],
      },
    ],
  },
})
