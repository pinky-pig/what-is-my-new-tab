import { useMagicKeys } from '@vueuse/core'

/* eslint-disable no-console */
export const watchContextMenuEvent = () => {
  let events: any = []
  browser.runtime.onMessage.addListener(
    (e) => {
      if (e.cmd === 'start') {
        console.log(e)
        events = addMouseEvent()
      }
    },
  )

  // 移除事件监听
  const { Escape } = useMagicKeys()
  watch(Escape, (v) => {
    if (v)
      removeMouseEvent(events)
  })
}

function addMouseEvent() {
  function mousedown(_e: MouseEvent) {
  }
  function mouseup(_e: MouseEvent) {
  }
  function mousemove(_e: MouseEvent) {
    console.log('move')
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

  return [mousedown, mouseup, mousemove, mouseover, wheel, click]
}

function removeMouseEvent(events: any[]) {
  events?.length > 0 && events.forEach((event) => {
    window.removeEventListener(event.name, event)
  })
}
