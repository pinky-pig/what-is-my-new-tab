import { defineStore } from 'pinia'

export const useLayoutStore = defineStore({
  id: 'layoutStore',
  state: () => {
    return {
      gridCells: [] as any[],
      mouseFrom: { x: 0, y: 0 },
      mouseTo: { x: 0, y: 0 },
    }
  },
  getters: {

  },
  actions: {

  },

})
