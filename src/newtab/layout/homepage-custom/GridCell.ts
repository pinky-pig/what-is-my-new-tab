/* eslint-disable @typescript-eslint/no-this-alias */
import type { Ref, StyleValue } from 'vue'
import { generateUuid } from '~/utils/uuid'

export interface GridCellType {
  id: string
  x: number
  y: number
  width: number
  height: number
  isLocked: boolean // 是否锁定
  showMode: number
  transform: string
  children?: any
}
export class GridCell {
  // configuration
  cfg: Ref<GridCellType>
  cellRef: Ref<HTMLElement | undefined>

  constructor(configuration: GridCellType) {
    this.cfg = ref(Object.assign({
      id: generateUuid(), // add 使用这个， edit 使用传入的 configuration 的
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      isLocked: false, // 是否锁定
      showMode: 0, // 0 格子 1 列表
      transform: '',
    } as GridCellType, configuration))

    this.cellRef = ref<HTMLElement>()

    this.initCell()
  }

  initCell() {

  }

  render() {
    const _this = this
    return defineComponent({
      setup() {
        const getStyle = computed(() => {
          return {
            position: 'fixed',
            left: `${_this.cfg.value.x}px`,
            top: `${_this.cfg.value.y}px`,
            width: `${_this.cfg.value.width}px`,
            height: `${_this.cfg.value.height}px`,
            background: '#fca98690',
            borderRadius: '3px',
            pointerEvents: 'auto',
            // transform: translate( calc(642.73px - var(--tl-padding)), calc(90.22px - var(--tl-padding)) )
            zIndex: 99999,
            transform: _this.cfg.value.transform,
          } as StyleValue
        })
        return () => {
          return h('div', {
            style: getStyle.value,
            ref: _this.cellRef,
            id: _this.cfg.value.id,
          })
        }
      },
    })
  }
}
