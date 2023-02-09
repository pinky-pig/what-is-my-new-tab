/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutStore } from '~/store'
let draggedEvt: MouseEvent | TouchEvent | null = null

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
  }

  function mousemove(e: MouseEvent) {
    // console.log(e, 'mousemove')
  }

  function mouseup(e: MouseEvent) {
    draggedEvt = null
  }

  return GridContainer
}
