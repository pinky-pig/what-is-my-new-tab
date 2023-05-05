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

      // 系统字体
      currentFontFamily: 'LXGW WenKai',

      browserNewTab: browser,
    }
  },
  getters: {

  },
  actions: {
    setSystemFontFamily(font: string) {
      this.currentFontFamily = font
      if (font === 'DEFAULT')
        document.body.setAttribute('style', 'font-family:v-sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" ')
      else
        document.body.setAttribute('style', `font-family:${font} !important`)
    },
  },
  persist: {
    // 开启数据缓存。默认session
    enabled: true,
    strategies: [
      {
        key: 'newtab',
        storage: localStorage,
        paths: ['currentWallpaper', 'customImageStatus', 'currentFontFamily'],
      },
    ],
  },
})
