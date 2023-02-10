/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Ref } from 'vue'
import { useLayoutStore } from '~/store'

enum IMode {
  Drag = 'Drag',
  Rotate = 'Rotate',
  Scale = 'Scale',
}
 type ModeTypes = keyof typeof IMode

const transformMode: ModeTypes | null = null
let draggedEvt: MouseEvent | null = null

export function initGridContainer(currentClickedElement: Ref<any>) {
  const store = useLayoutStore()

  const GridContainer = defineComponent({
    setup(_props, { slots }) {
      const gridContainerRef = ref<HTMLElement>()
      function addMouseEvent() {
        window.addEventListener('mousedown', mousedown, false)
        window.addEventListener('mouseup', mouseup, false)
        window.addEventListener('mousemove', mousemove, false)
      }
      // 1.添加监听事件
      onMounted(() => {
        addMouseEvent()
      })

      return () => h(
        'div',
        {
          id: 'cellContainer',
          ref: gridContainerRef,
          class: 'w-screen h-screen fixed top-0 left-0',
        },
        slots,
      )
    },
  })

  function mousedown(e: MouseEvent) {
    store.mouseFrom = { x: e.clientX, y: e.clientY }
    draggedEvt = e

    const initElement = document.elementFromPoint(e.clientX, e.clientY)
    if (initElement && initElement?.id.startsWith('bounds_') && currentClickedElement.value) {
      // 进行尺寸改变的点
      console.log(initElement?.id)
    }
    else {
      // 点击的是block
      currentClickedElement.value = getCellObjectInStoreFromPosition(store.mouseFrom)
    }
  }

  function mousemove(e: MouseEvent) {
    const pt = e
    if (draggedEvt && currentClickedElement.value) {
      const oriPt = draggedEvt
      currentClickedElement.value.cfg.x = currentClickedElement.value.cfg.x + (pt.clientX - oriPt.clientX)
      currentClickedElement.value.cfg.y = currentClickedElement.value.cfg.y + (pt.clientY - oriPt.clientY)

      // currentClickedElement.cfg.translate = [
      //   currentClickedElement.cfg.translate[0] + (pt.clientX - oriPt.clientX),
      //   currentClickedElement.cfg.translate[1] + (pt.clientY - oriPt.clientY),
      // ]
      draggedEvt = e
    }
  }

  function mouseup(e: MouseEvent) {
    draggedEvt = null
    // currentClickedElement.value = null
  }
  /**
   * 通过坐标位置获取当前对象
   * @param position 坐标
   * @returns 点击的对象
   */
  function getCellObjectInStoreFromPosition(position: { x: number; y: number }) {
    let result = null
    const point = { x: position.x, y: position.y }
    const initElement = document.elementFromPoint(point.x, point.y)
    if (initElement)
      result = store.gridCells.filter(ele => ele.cfg.id === initElement.id)

    return result ? result[0] : null
  }

  return GridContainer
}
