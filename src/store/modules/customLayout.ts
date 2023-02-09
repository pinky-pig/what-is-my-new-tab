import { defineStore } from 'pinia'
import { GridCell } from '~/newtab/layout/homepage-custom/GridCell'

export interface LayoutState {
  gridCells: any[]
  mouseFrom: { x: number; y: number }
  mouseTo: { x: number; y: number }
}

const a = new GridCell({} as any)
export const useLayoutStore = defineStore({
  id: 'layoutStore',
  state: (): LayoutState => {
    return {
      gridCells: [a],
      mouseFrom: { x: 0, y: 0 },
      mouseTo: { x: 0, y: 0 },
    }
  },
  getters: {

  },
  actions: {

  },

})
