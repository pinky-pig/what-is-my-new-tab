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
  elementsClassName: string,
  size: { width: number; height: number },
  gap: number,
  maximumInLine: number,
  duration = 200,
) {
  let isDragging = false // 拖拽状态
  const isDragged = ref(false) // 是否已经拖拽过
  let mouseFrom = { x: 0, y: 0 }
  let mouseTo = { x: 0, y: 0 }

  // 当前选中的元素对象
  const currentClickedBox = ref<ElemensBoxType>({ id: '', x: 0, y: 0, width: size.width, height: size.height })
  // 全部的元素对象
  const elementsBox = ref<ElemensBoxType[]>([])

  // 占位的元素对象
  const placeholderElement = document.createElement('div')
  placeholderElement.style.position = 'absolute'
  placeholderElement.style.width = '0px'
  placeholderElement.style.height = '0px'
  const computedStyle = getComputedStyle(elements[0] as HTMLElement)
  placeholderElement.style.borderRadius = computedStyle.borderRadius
  placeholderElement.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
  placeholderElement.style.backdropFilter = 'blur(80px)'
  placeholderElement.style.zIndex = '997'

  // const knownDiv = document.querySelector('#known-div')
  // const computedStyle = getComputedStyle(knownDiv as HTMLElement)
  // const newDiv = document.createElement('div')
  // newDiv.style.cssText = computedStyle.cssText

  const placeholderBox = ref({ id: '', x: 0, y: 0, width: 0, height: 0, ele: placeholderElement })

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
      element.style.width = `${size.width}px`
      element.style.height = `${size.height}px`
      element.style.userSelect = 'none'
      element.style.transition = `transform ${duration}ms ease 0s`
      element.style.willChange = 'transform'
      element.style.zIndex = '998'

      elementsBox.value.push({
        id: element.id,
        x: column * (size.width + gap),
        y: row * (size.height + gap),
        width: size.width,
        height: size.height,
        ele: element,
      })
    })

    // 3. 创建 placeholderBox 占位元素
    containerElement.appendChild(placeholderElement)
  }

  // 1. 监听占位元素的位置
  watch(placeholderBox, () => {
    placeholderBox.value.ele.style.width = `${placeholderBox.value.width}px`
    placeholderBox.value.ele.style.height = `${placeholderBox.value.height}px`
    placeholderBox.value.ele.style.transform = `translate3d(${placeholderBox.value.x}px, ${placeholderBox.value.y}px, 0)`
  }, { deep: true })

  // 2. 监听设置所有元素的位置
  watch(elementsBox, () => {
    elementsBox.value.forEach((item, index) => {
      item.ele!.style.transform = `
        translate3d(
          ${item.x}px,
          ${item.y}px,
        0)`
    })
  }, { deep: true, immediate: true })

  function handlePointerdown(e: PointerEvent) {
    // 1. 判断点击的元素是否是 item
    if (!e.target)
      return
    let clickedItem: Element | null = null
    const clickedElement = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement
    if (clickedElement.classList.contains(elementsClassName)) {
      clickedItem = clickedElement
    }
    else {
      const parentItem = clickedElement.closest(`.${elementsClassName}`)
      if (parentItem)
        clickedItem = parentItem
    }
    if (!clickedItem)
      return

    // 2. 判断是否已经在拖拽中
    if (isDragging)
      return

    mouseFrom = { x: e.clientX, y: e.clientY }

    // 3. 设置当前点击元素的位置。并且将当前点击元素的顺序放在最后
    const index = elementsBox.value.findIndex(item => item.id === clickedItem?.id)
    if (index !== -1) {
      // currentClickedBox.value = elementsBox.value.splice(index, 1)[0]
      currentClickedBox.value = elementsBox.value[index]
      currentClickedBox.value.ele!.style.zIndex = '999'
      currentClickedBox.value.ele!.style.transition = 'unset'
    }

    // 4. 设置占位元素的位置
    placeholderBox.value = {
      ...placeholderBox.value,
      ...{
        id: `${currentClickedBox.value.id}-placeholder`,
        x: currentClickedBox.value.x,
        y: currentClickedBox.value.y,
        width: currentClickedBox.value.width,
        height: currentClickedBox.value.height,
      },
    }

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

    placeholderBox.value.ele!.style.transition = 'all 500ms ease 0s'
    placeholderBox.value!.x = Math.round(currentClickedBox.value.x / (size.width + gap)) * (size.width + gap)
    placeholderBox.value!.y = Math.round(currentClickedBox.value.y / (size.height + gap)) * (size.height + gap)

    // 设置已经状态拖拽了
    isDragged.value = true

    // 限制拖拽范围
    if (placeholderBox.value!.x < 0)
      placeholderBox.value.x = 0
    if (currentClickedBox.value.y < 0)
      placeholderBox.value.y = 0
    if (currentClickedBox.value.x + currentClickedBox.value.width > maximumInLine * (size.width + gap))
      placeholderBox.value.x = (maximumInLine - 1) * (size.width + gap)

    hitAllEle(placeholderBox.value, elementsBox.value)

    // 赋值给鼠标初始位置
    mouseFrom = { x: e.clientX, y: e.clientY }
  }
  function handlePointerup(e: PointerEvent) {
    isDragging = false
    isDragged.value = false

    if (currentClickedBox.value.ele)
      currentClickedBox.value.ele!.style.transition = 'transform 200ms ease'

    currentClickedBox.value.x = placeholderBox.value.x
    currentClickedBox.value.y = placeholderBox.value.y
    currentClickedBox.value = { id: '', x: 0, y: 0, width: size.width, height: size.height }

    placeholderBox.value = { id: '', x: 0, y: 0, width: 0, height: 0, ele: placeholderElement }
    placeholderBox.value.ele!.style.transition = 'unset'

    mouseFrom = { x: 0, y: 0 }
    mouseTo = { x: 0, y: 0 }
  }

  // 检测碰撞
  function hitAllEle(node: ElemensBoxType, allNodes: ElemensBoxType[]) {
    const hittedNodes: any = []

    // 1. 遍历所有元素，检测是否碰撞。这里碰撞的只有一个，因为所有的大小一样
    allNodes.forEach((n: ElemensBoxType, index: number) => {
      if (!node.id.startsWith(n.id) && checkHit(node, n))
        hittedNodes.push(n)
    })

    // 2.碰撞到了之后，一格一格移动
    hittedNodes.forEach((n: ElemensBoxType) => {
      // 比较当前点击的这个值 hitIndex ，跟碰撞到的元素的 nIndex
      // 1. 要是小于 hitIndex < nIndex ，就插到碰撞的值的后面
      // 2. 要是大于 hitIndex > nIndex ，就插到碰撞的值的前面
      const hitIndex = allNodes.findIndex(item => item.id === currentClickedBox.value.id)
      const nIndex = allNodes.findIndex(item => item.id === n.id)
      if (hitIndex < nIndex) {
        const origin = elementsBox.value.splice(hitIndex, 1)[0]
        elementsBox.value.splice(nIndex, 0, origin)
      }
      else {
        const origin = elementsBox.value.splice(hitIndex, 1)[0]
        elementsBox.value.splice(nIndex, 0, origin)
      }

      elementsBox.value.forEach((item: ElemensBoxType, index: number) => {
        if (item.id !== currentClickedBox.value.id) {
          const row = Math.floor(index / maximumInLine)
          const column = index % maximumInLine
          item.x = column * (size.width + gap)
          item.y = row * (size.height + gap)
        }
      })
    })

    // 3.没有碰撞，但是在末尾最后一个情况
    const row = Math.floor((elementsBox.value.length - 1) / maximumInLine)
    const column = (elementsBox.value.length - 1) % maximumInLine
    if (
      (
        placeholderBox.value.x > column * (size.width + gap)
      && placeholderBox.value.y === row * (size.height + gap)
      )
      || (
        placeholderBox.value.y > row * (size.height + gap)
      )
    ) {
      placeholderBox.value.x = (elementsBox.value.length - 1) % maximumInLine * (size.width + gap)
      placeholderBox.value.y = Math.floor((elementsBox.value.length - 1) / maximumInLine) * (size.height + gap)

      const hitIndex = allNodes.findIndex(item => item.id === currentClickedBox.value.id)
      const origin = elementsBox.value.splice(hitIndex, 1)[0]
      elementsBox.value.push(origin)
      elementsBox.value.forEach((item: ElemensBoxType, index: number) => {
        if (item.id !== currentClickedBox.value.id) {
          const row = Math.floor(index / maximumInLine)
          const column = index % maximumInLine
          item.x = column * (size.width + gap)
          item.y = row * (size.height + gap)
        }
      })
    }
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
    window.addEventListener('pointerdown', handlePointerdown)
    window.addEventListener('pointermove', handlePointermove)
    window.addEventListener('pointerup', handlePointerup)
  }

  function unbindEventListener() {
    window.removeEventListener('pointerdown', handlePointerdown)
    window.removeEventListener('pointermove', handlePointermove)
    window.removeEventListener('pointerup', handlePointerup)
  }

  return {
    isDragged,
    bindEventListener,
    unbindEventListener,
  }
}
