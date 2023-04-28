/* eslint-disable no-console */
import type { StyleValue } from 'vue'

function generateUuid(a = ''): string {
  return a
    ? ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, generateUuid)
}

export function createDragInHorizontal(
  containerElement: HTMLElement,
  elements: HTMLElement[],
  size: number,
  gap: number,
) {
  function main() {
    bindEventListener()

    elements.forEach((element, index) => {
      element.id = generateUuid()
    })
  }
  main()

  function getContainerStyle() {
    return {
      position: 'relative',
    } as StyleValue
  }

  function getElementsStyle(index: number) {
    return {
      position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      transform: `translate3d(${index * size}px, 0px, 0px)`,
    } as StyleValue
  }

  function bindEventListener() {
    containerElement.addEventListener('pointerdown', handlePointerdown)
    containerElement.addEventListener('pointermove', handlePointermove)
    containerElement.addEventListener('pointerup', handlePointerup)
  }

  function unbindEventListener() {
    containerElement.removeEventListener('pointerdown', handlePointerdown)
    containerElement.removeEventListener('pointermove', handlePointermove)
    containerElement.removeEventListener('pointerup', handlePointerup)
  }

  let placeholderElement: HTMLElement | null = null
  let isDragging = false
  let mouseFrom = { x: 0, y: 0 }
  let mouseTo = { x: 0, y: 0 }
  const currentClickedElement = ref({ x: 0, y: 0 })

  watch(currentClickedElement, () => {
    if (placeholderElement && isDragging)
      placeholderElement.style.transform = `translate3d(${currentClickedElement.value.x}px, ${currentClickedElement.value.y}px, 0px)`
  }, { deep: true })

  function handlePointerdown(e: PointerEvent) {
    // 1. 判断点击的元素是否是 item
    if (!e.target || !(e.target as HTMLElement).classList.contains('my-website-item'))
      return

    // 2. 判断是否已经在拖拽中
    if (isDragging)
      return

    mouseFrom = { x: e.clientX, y: e.clientY }

    // 3. 添加克隆元素
    placeholderElement = e.target && (e.target as HTMLElement).cloneNode(true) as HTMLElement
    placeholderElement.style.background = 'red'
    containerElement.appendChild(placeholderElement)

    // 4. 设置当前点击元素的位置
    currentClickedElement.value.x = Number(placeholderElement.style.transform.match(/translate3d\((?<x>-?\d+)px, (?<y>-?\d+)px, 0px\)/)?.groups?.x) || 0
    currentClickedElement.value.y = Number(placeholderElement.style.transform.match(/translate3d\((?<x>-?\d+)px, (?<y>-?\d+)px, 0px\)/)?.groups?.y) || 0

    // 5. 设置拖拽状态
    isDragging = true
  }
  function handlePointermove(e: PointerEvent) {
    if (!placeholderElement || !isDragging)
      return

    // 计算鼠标移动距离
    mouseTo = { x: e.clientX, y: e.clientY }
    const disX = mouseTo.x - mouseFrom.x
    const disY = mouseTo.y - mouseFrom.y

    // 计算当前点击元素的位置
    currentClickedElement.value.x += disX
    currentClickedElement.value.y += disY
    hitAllEle()

    // 赋值给鼠标初始位置
    mouseFrom = { x: e.clientX, y: e.clientY }
  }
  function handlePointerup(e: PointerEvent) {
    isDragging = false
    placeholderElement && containerElement.removeChild(placeholderElement)
    placeholderElement = null
    mouseFrom = { x: 0, y: 0 }
    mouseTo = { x: 0, y: 0 }
  }

  // 检测碰撞

  function hitAllEle() {
    elements.forEach((element) => {
      if (!placeholderElement)
        return
      if (element.id !== placeholderElement!.id) {
        const rect1 = placeholderElement!.getBoundingClientRect()
        const rect2 = element.getBoundingClientRect()

        if (!(rect1.right < rect2.left
          || rect1.left > rect2.right
          || rect1.bottom < rect2.top
          || rect1.top > rect2.bottom))
          console.log('碰撞了', element)
        else
          console.log('没碰撞')
      }
    })
  }

  interface BentoCellsType {
    id: string
    x: number
    y: number
    width: number
    height: number
  }

  // 检查两个元素是否发生碰撞的功能函数
  // 元素 a 的左侧坐标小于元素 b 的右侧坐标。
  // 元素 a 的右侧坐标大于元素 b 的左侧坐标。
  // 元素 a 的上方坐标小于元素 b 的下方坐标。
  // 元素 a 的下方坐标大于元素 b 的上方坐标
  function checkHit(a: any, b: BentoCellsType) {
    return (
      a.x < b.x + b.width
          && a.x + a.width > b.x
          && a.y < b.y + b.height
          && a.y + a.height > b.y
    )
  }

  return {
    getContainerStyle,
    getElementsStyle,
    bindEventListener,
    unbindEventListener,
  }
}
