<script lang="ts" setup>
import { computed, reactive } from 'vue'
import { useElementBounding, useElementByPoint, useEventListener, useMouse } from '@vueuse/core'
import { onMessage, sendMessage } from 'webext-bridge'
import { openWindow } from './OpenLittleWindow.module'

const { x, y } = useMouse({ type: 'client' })
const { element } = useElementByPoint({ x, y })
const bounding = reactive(useElementBounding(element))

useEventListener('scroll', bounding.update, true)

const boxStyles = computed(() => {
  if (element.value) {
    return {
      display: 'block',
      width: `${bounding.width}px`,
      height: `${bounding.height}px`,
      left: `${bounding.left}px`,
      top: `${bounding.top}px`,
      backgroundColor: '#3eaf7c44',
      transition: 'all 0.05s linear',
      outline: 'none',
    } as Record<string, string | number>
  }
  return {
    display: 'none',
  }
})

const pointStyles = computed<Record<string, string | number>>(() => ({
  transform: `translate(calc(${x.value}px - 50%), calc(${y.value}px - 50%))`,
}))

// 监听右键菜单事件
const isShow = ref(false)
const openWindowTabId = ref(0)

/**
 * msg: send 的数据
 * sender: 发送者 {id: string, origin: string}
 */
browser.runtime.onMessage.addListener(async (msg, sender) => {
  const { cmd, tabId } = msg
  openWindowTabId.value = tabId
  if (cmd === 'openWindow') {
    isShow.value = true
    openWindowTabId.value = tabId
    const cleanup = useEventListener('click', (e) => {
      isShow.value = false;

      (e.target as HTMLElement).classList.add('__target__')
      setTimeout(() => {
        sendMessage('createWindow', {
          tabId,
          width: bounding.width,
          height: bounding.height,
          left: bounding.left,
          top: bounding.top,
          className: '__target__',
        })

        cleanup()
      })
      // browser.runtime.sendMessage({ url: '1111' })
    })
  }
})
onMessage('open-tab-prev', ({ data }) => {
  const { className } = data as { className: string }
  openWindow((document.querySelector(`.${className}`) as HTMLElement), openWindowTabId.value)
})
</script>

<template>
  <div
    v-if="isShow"
    :style="boxStyles"
    fixed
    pointer-events-none
    z-9999
    border="1 $vp-c-brand"
  />
  <div
    v-if="isShow"
    :style="pointStyles"
    fixed
    top-0
    left-0
    pointer-events-none
    w-10px
    h-10px
    rounded-full
    bg-green-400
    shadow
    z-999
  />
</template>

<style>
@import url(./windows.css);
</style>
