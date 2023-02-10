import { defineStore } from 'pinia'

export interface LayoutState {
  gridCells: any[]
  mouseFrom: { x: number; y: number }
  mouseTo: { x: number; y: number }
  isEditLayout: boolean
}

export const useLayoutStore = defineStore({
  id: 'layoutStore',
  state: (): LayoutState => {
    return {
      gridCells: [],
      mouseFrom: { x: 0, y: 0 },
      mouseTo: { x: 0, y: 0 },
      isEditLayout: false,
    }
  },
  getters: {

  },
  actions: {

  },

})
