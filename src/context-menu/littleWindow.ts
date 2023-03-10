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
const selectBoxBounds = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
}) // x,y,width,height
const SelectBoxElement = defineCustomElement({
  setup() {
    const getStyle = computed(() => {
      return {
        position: 'fixed',
        left: `${selectBoxBounds.value.x}px`,
        top: `${selectBoxBounds.value.y}px`,
        width: `${selectBoxBounds.value.width}px`,
        height: `${selectBoxBounds.value.height}px`,
        background: 'rgba(59, 130, 246, 0.3)',
        outline: '1px solid rgba(59, 130, 246, 0.6)',
        borderRadius: '3px',
        pointerEvents: 'none',
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
    if (e.target)
      selectBoxBounds.value = (e.target as HTMLElement).getBoundingClientRect()
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
