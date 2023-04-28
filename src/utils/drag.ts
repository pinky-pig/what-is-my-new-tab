function generateUuid(a = ''): string {
  return a
    ? ((Number(a) ^ (Math.random() * 16)) >> (Number(a) / 4)).toString(16)
    : `${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`.replace(/[018]/g, generateUuid)
}

interface ElemensBoxType {
  id: string
  x: number
  y: number
  width: number
  height: number
  ele?: HTMLElement
}

export function createDragInHorizontal(
  containerElement: HTMLElement,
  elements: HTMLElement[],
  size: number,
  gap: number,
  maximumInLine: number,
) {
  let placeholderElement: HTMLElement | null = null
  let isDragging = false
  let mouseFrom = { x: 0, y: 0 }
  let mouseTo = { x: 0, y: 0 }
  const currentClickedBox = ref({ x: 0, y: 0 })
  const placeholderBox = ref<ElemensBoxType | null>(null)
  const elemensBox = ref<ElemensBoxType[]>([])

  main()

  function main() {
    initLayout()
    bindEventListener()
  }

  function initLayout() {
    // 1. 设置 containerElement 的样式
    containerElement.style.position = 'relative'
    // 2. 设置 elements 的样式
    elements.forEach((element, index) => {
      element.id = `elements${generateUuid()}`
      const row = Math.floor(index / maximumInLine)
      const column = index % maximumInLine
      element.style.position = 'absolute'
      element.style.width = `${size}px`
      element.style.height = `${size}px`

      elemensBox.value.push({
        id: element.id,
        x: column * (size + gap),
        y: row * (size + gap),
        width: size,
        height: size,
        ele: element,
      })
    })
  }

  // 监听设置当前的点击的占位元素的位置
  watch(currentClickedBox, () => {
    if (placeholderBox.value && isDragging) {
      placeholderBox.value.x = currentClickedBox.value.x
      placeholderBox.value.y = currentClickedBox.value.y
    }
  }, { deep: true })

  // 监听设置所有元素的位置
  watch(elemensBox, () => {
    elemensBox.value.forEach((item, index) => {
      item.ele!.style.transform = `
        translate3d(
          ${item.x}px,
          ${item.y}px,
        0)`
    })
  }, { deep: true, immediate: true })

  watch(placeholderBox, () => {
    // 1. 移除占位元素
    if (!placeholderBox.value) {
      containerElement.removeChild(placeholderElement!)
      return
    }

    // 2. 添加占位元素
    if (!document.querySelector(`#${placeholderBox.value.id}`) && placeholderElement) {
      placeholderElement.style.background = 'red'
      containerElement.appendChild(placeholderElement!)
    }
    // 3. 设置占位元素的位置
    if (placeholderElement && isDragging)
      placeholderElement.style.transform = `translate3d(${placeholderBox.value.x}px, ${placeholderBox.value.y}px, 0px)`
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
    placeholderElement.id = `${placeholderElement.id}-placeholder`
    placeholderBox.value = {
      id: `${placeholderElement.id}-placeholder`,
      x: Number(placeholderElement.style.transform.match(/translate3d\((?<x>-?\d+)px, (?<y>-?\d+)px, 0px\)/)?.groups?.x) || 0,
      y: Number(placeholderElement.style.transform.match(/translate3d\((?<x>-?\d+)px, (?<y>-?\d+)px, 0px\)/)?.groups?.y) || 0,
      width: Number(placeholderElement.style.width.replace('px', '')) || 0,
      height: Number(placeholderElement.style.height.replace('px', '')) || 0,
    }

    // 4. 设置当前点击元素的位置
    currentClickedBox.value.x = placeholderBox.value.x || 0
    currentClickedBox.value.y = placeholderBox.value.y || 0

    // 5. 设置拖拽状态
    isDragging = true
  }
  function handlePointermove(e: PointerEvent) {
    if (!currentClickedBox || !isDragging)
      return

    // 计算鼠标移动距离
    mouseTo = { x: e.clientX, y: e.clientY }
    const disX = mouseTo.x - mouseFrom.x
    const disY = mouseTo.y - mouseFrom.y

    // 计算当前点击元素的位置
    currentClickedBox.value.x += disX
    currentClickedBox.value.y += disY

    // 赋值给鼠标初始位置
    mouseFrom = { x: e.clientX, y: e.clientY }
  }
  function handlePointerup(e: PointerEvent) {
    isDragging = false
    placeholderBox.value = null
    mouseFrom = { x: 0, y: 0 }
    mouseTo = { x: 0, y: 0 }
  }

  // 检测碰撞
  function hitAllEle(node: ElemensBoxType, allNodes: ElemensBoxType[]) {
  }

  function checkHit(a: ElemensBoxType, b: ElemensBoxType) {
    return (
      a.x < b.x + b.width
      && a.x + a.width > b.x
      && a.y < b.y + b.height
      && a.y + a.height > b.y
    )
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

  return {
    bindEventListener,
    unbindEventListener,
  }
}
