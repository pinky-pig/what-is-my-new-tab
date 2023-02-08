/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMagicKeys } from '@vueuse/core'
import type { StyleValue } from 'vue'
import { defineCustomElement, h } from 'vue'

export const watchContextMenuEvent = () => {
  let events: any = []
  let elements: any
  browser.runtime.onMessage.addListener(
    (e) => {
      if (e.cmd === 'start') {
        const { e, ele } = addMouseEvent()
        events = e
        elements = ele
      }
    },
  )

  // 移除事件监听
  const { Escape } = useMagicKeys()
  watch(Escape, (v) => {
    if (v)
      removeMouseEvent(events, elements)
  })
}

// 1. 定义选择框，框子尺寸位置，根据bounds控制
const selectBoxBounds = ref([0, 0, 0, 0]) // x,y,width,height
const SelectBoxElement = defineCustomElement({
  setup() {
    const getStyle = computed(() => {
      return {
        position: 'fixed',
        left: `${selectBoxBounds.value[0]}px`,
        top: `${selectBoxBounds.value[1]}px`,
        width: `${selectBoxBounds.value[2]}px`,
        height: `${selectBoxBounds.value[3]}px`,
        background: '#ffffff',
        outline: '1px solid #000000',
        zIndex: 99999,
      } as StyleValue
    })
    return () => {
      return h('div', {
        key: 'selectBoxElement',
        style: getStyle.value,
        id: 'selectBoxElement',
      })
    }
  },
})
// 放置重复多次创建
if (!customElements.get('select-box-element'))
  customElements.define('select-box-element', SelectBoxElement)

function createBoxComponent() {
  const boxElement = new SelectBoxElement()
  window.document.body.appendChild(
    boxElement,
  )
  return boxElement
}
function addMouseEvent() {
  const boxElement = createBoxComponent()

  function mousedown(_e: MouseEvent) {
  }
  function mouseup(_e: MouseEvent) {
  }
  function mousemove(e: MouseEvent) {
    // const point = { x: e.clientX, y: e.clientY }
    // const initElement = document.elementFromPoint(point.x, point.y)

    // const { x, y, width, height } = (initElement as HTMLElement).getBoundingClientRect()
    // selectBoxBounds.value = [x, y, width, height]
    // console.log(selectBoxBounds.value)

    // if (e.target) {
    //   const { x, y, width, height } = (e.target as HTMLElement).getBoundingClientRect()
    //   selectBoxBounds.value = [x, y, width, height]
    // }
  }
  function mouseover(_e: MouseEvent) {
  }
  function wheel(_e: MouseEvent) {
  }
  function click(_e: MouseEvent) {
  }

  window.addEventListener('mousedown', mousedown, false)
  window.addEventListener('mouseup', mouseup, false)
  window.addEventListener('mousemove', mousemove, false)
  window.addEventListener('mouseover', mouseover, false)
  window.addEventListener('wheel', wheel, false)
  window.addEventListener('click', click, false)

  return {
    e: [mousedown, mouseup, mousemove, mouseover, wheel, click],
    ele: boxElement,
  }
}

function removeMouseEvent(events: any[], elements: any) {
  events?.length > 0 && events.forEach((event) => {
    window.removeEventListener(event.name, event)
  })

  window.document.body.removeChild(
    elements,
  )
}
