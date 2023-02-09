/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutStore } from '~/store'
let draggedEvt: MouseEvent | null = null
let currentClickedElement: any
export function initGridContainer() {
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
    currentClickedElement = getCellObjectInStoreFromPosition(store.mouseFrom)
    draggedEvt = e
  }

  function mousemove(e: MouseEvent) {
    const pt = e
    if (draggedEvt && currentClickedElement) {
      const oriPt = draggedEvt
      currentClickedElement.cfg.x = currentClickedElement.cfg.x + (pt.clientX - oriPt.clientX)
      currentClickedElement.cfg.y = currentClickedElement.cfg.y + (pt.clientY - oriPt.clientY)
      draggedEvt = e
    }
  }

  function mouseup(e: MouseEvent) {
    draggedEvt = null
    currentClickedElement = null
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
