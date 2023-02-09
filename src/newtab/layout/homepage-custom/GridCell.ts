/* eslint-disable @typescript-eslint/no-this-alias */
import type { Ref, StyleValue } from 'vue'
import { generateUuid } from '~/utils/uuid'
export class GridCell {
  // configuration
  cfg: Ref<{
    id: string
    x: number
    y: number
    width: number
    height: number
    rotate: number
    scale: number
    isLocked: boolean // 是否锁定
    showMode: number
    children?: any
  }>

  cellRef: Ref<HTMLElement | undefined>

  constructor() {
    this.cfg = ref({
      id: generateUuid(),
      x: 0,
      y: 0,
      width: 200,
      height: 200,
      rotate: 0,
      scale: 1,
      isLocked: false, // 是否锁定
      showMode: 0, // 0 格子 1 列表
    })

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
            background: 'rgba(59, 130, 246, 0.3)',
            outline: '1px solid rgba(59, 130, 246, 0.6)',
            borderRadius: '3px',
            pointerEvents: 'auto',
            transition: 'all 0.3s ease',
            zIndex: 99999,
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
