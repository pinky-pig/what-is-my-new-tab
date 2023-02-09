export const GridContainer = defineComponent({
  setup(_props, { slots }) {
    const gridContainerRef = ref<HTMLElement>()
    function addMouseEvent() {
      // 单个框的监听。在编辑模式下增加鼠标的监听，退出的时候移除
      if (gridContainerRef.value instanceof HTMLElement) {
        gridContainerRef.value.addEventListener('mousedown', mousedown, false)
        gridContainerRef.value.addEventListener('mouseup', mouseup, false)
        gridContainerRef.value.addEventListener('mousemove', mousemove, false)
      }
    }
    // 1.添加监听事件
    addMouseEvent()

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

function mousedown(_e: MouseEvent) {

}

function mousemove(_e: MouseEvent) {

}

function mouseup(_e: MouseEvent) {

}
