/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useDebounceFn } from '@vueuse/core'
import type { Ref } from 'vue'
import { editAGridCell } from './gridCellData'
import { useLayoutStore } from '~/store'

enum IMode {
  Drag = 'Drag',
  Rotate = 'Rotate',
  Scale = 'Scale',
}
type ModeTypes = keyof typeof IMode

type ScaleType = 'top' | 'bottom' | 'left' | 'right' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | null

let transformMode: ModeTypes | null = null
let currentScaleType: ScaleType = null
let previousEvent: MouseEvent | null = null
const DEVIATION = 10

export function initGridContainer(
  currentClickedElement: Ref<any>,
  attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];mh: any[];b: any[] }>,
) {
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
  const saveCanvasLayoutData = useDebounceFn(() => {
    store.gridCells.forEach((cell, index) => {
      // 存储一个index，是为了将其层级存储一下，越大越顶层
      editAGridCell({ ...cell, index })
    })
  }, 1000)

  // watch(currentClickedElement, (nVal) => {
  //   // 设置吸附线误差为5px
  //   const DEVIATION = 5
  //   if (nVal) {
  //     // 0.设置将当前点击的要素为最顶层
  //     const index = store.gridCells.findIndex(ele => ele.cfg.id === nVal.id)
  //     if (index !== -1) {
  //       const ele = store.gridCells.splice(index, 1)
  //       store.gridCells.push(ele[0])
  //     }

  //     // 1.获取当前元素的偏移值
  //     let clickedTX = 0
  //     let clickedTY = 0
  //     const clickedWidth = currentClickedElement.value?.width
  //     const clickedHeight = currentClickedElement.value?.height
  //     if (currentClickedElement.value.transform) {
  //       const matrixVariable = currentClickedElement.value.transform.match(/matrix\((.*)\)/)[1]?.split(',')
  //       clickedTX = Number(matrixVariable.at(-2))
  //       clickedTY = Number(matrixVariable.at(-1))
  //     }
  //     else {
  //       return
  //     }

  //     // 其实应该是更新。这里粗暴先置空
  //     for (const key in attachedLine.value)
  //       attachedLine.value[key] = []

  //     store.gridCells.forEach((cell) => {
  //       // 首先将它自己排除
  //       if (cell?.id === currentClickedElement.value?.id)
  //         return

  //       // 2.获取所有偏移的x和y值
  //       let cellTX = 0 // cell translate x
  //       let cellTY = 0 // cell translate y
  //       const cellWidth = cell?.width // cell translate y
  //       const cellHeight = cell?.height // cell translate y
  //       if (cell?.transform) {
  //         const matrixVariable = cell?.transform.match(/matrix\((.*)\)/)[1]?.split(',')
  //         cellTX = Number(matrixVariable.at(-2))
  //         cellTY = Number(matrixVariable.at(-1))
  //       }

  //       // 3.比较，如果有return出去。这里的左中右上中下都是对于当前点击的元素来说
  //       // 这里的吸附功能挪到了BoundsSVGContainer.vue中
  //       /* -------------------------------------------------- */
  //       /*                    竖向吸附线                       */
  //       /* -------------------------------------------------- */
  //       // l - 都是左侧
  //       if ((Math.abs(cellTX) - DEVIATION) < clickedTX && clickedTX < (Math.abs(cellTX) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${cellTX}, ${clickedTY})`
  //           attachedLine.value.l.push({ ...cell, type: 0 })
  //         })
  //       }
  //       // l - 点击的要素是左侧，跟其他的可能有边可以吸附
  //       if ((Math.abs(cellTX + cellWidth) - DEVIATION) < clickedTX && clickedTX < (Math.abs(cellTX + cellWidth) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${cellTX + cellWidth}, ${clickedTY})`
  //           attachedLine.value.l.push({ ...cell, type: 1 })
  //         })
  //       }
  //       // r
  //       if ((Math.abs(cellTX) - DEVIATION) < (clickedTX + clickedWidth) && (clickedTX + clickedWidth) < (Math.abs(cellTX) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${cellTX - clickedWidth}, ${clickedTY})`
  //           attachedLine.value.r.push({ ...cell, type: 0 })
  //         })
  //       }
  //       // r - 点击的要素还是右侧
  //       if ((Math.abs(cellTX + cellWidth) - DEVIATION) < (clickedTX + clickedWidth) && (clickedTX + clickedWidth) < (Math.abs(cellTX + cellWidth) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${cellTX + cellWidth - clickedWidth}, ${clickedTY})`
  //           attachedLine.value.r.push({ ...cell, type: 1 })
  //         })
  //       }
  //       // mv
  //       if ((Math.abs(cellTX + (cellWidth) / 2) - DEVIATION) < (clickedTX + (clickedWidth) / 2) && (clickedTX + (clickedWidth) / 2) < (Math.abs(cellTX + (cellWidth) / 2) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${cellTX + (cellWidth) / 2 - (clickedWidth) / 2}, ${clickedTY})`
  //           attachedLine.value.mv.push(cell)
  //         })
  //       }

  //       /* -------------------------------------------------- */
  //       /*                    横向吸附线                       */
  //       /* -------------------------------------------------- */
  //       // t
  //       if ((Math.abs(cellTY) - DEVIATION) < clickedTY && clickedTY < (Math.abs(cellTY) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${clickedTX}, ${cellTY})`
  //           attachedLine.value.t.push({ ...cell, type: 0 })
  //         })
  //       }
  //       // t - 点击的要素是上，跟其他的可能有边可以吸附
  //       if ((Math.abs(cellTY + cellHeight) - DEVIATION) < clickedTY && clickedTY < (Math.abs(cellTY + cellHeight) + DEVIATION)) {
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${clickedTX}, ${cellTY + cellHeight})`
  //           attachedLine.value.t.push({ ...cell, type: 1 })
  //         })
  //       }

  //       // b
  //       if ((Math.abs(cellTY) - DEVIATION) < (clickedTY + clickedHeight) && (clickedTY + clickedHeight) < (Math.abs(cellTY) + DEVIATION)) {
  //         // 设置当前元素吸附
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${clickedTX}, ${cellTY - clickedHeight})`
  //           attachedLine.value.b.push({ ...cell, type: 0 })
  //         })
  //       }
  //       // b - 点击的要素还是下面
  //       if ((Math.abs(cellTY + cellHeight) - DEVIATION) < (clickedTY + clickedHeight) && (clickedTY + clickedHeight) < (Math.abs(cellTY + cellHeight) + DEVIATION)) {
  //         // 设置当前元素吸附
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${clickedTX}, ${cellTY + cellHeight - clickedHeight})`
  //           attachedLine.value.b.push({ ...cell, type: 1 })
  //         })
  //       }
  //       // mh
  //       if ((Math.abs(cellTY + (cellHeight) / 2) - DEVIATION) < (clickedTY + (clickedHeight) / 2) && (clickedTY + (clickedHeight) / 2) < (Math.abs(cellTY + (cellHeight) / 2) + DEVIATION)) {
  //         // 设置当前元素吸附
  //         nextTick(() => {
  //           // currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${clickedTX}, ${cellTY + (cellHeight) / 2 - (clickedHeight) / 2})`
  //           attachedLine.value.mh.push(cell)
  //         })
  //       }
  //     })
  //   }
  // }, {
  //   deep: true,
  // })

  function mousedown(e: MouseEvent) {
    store.mouseFrom = { x: e.clientX, y: e.clientY }
    previousEvent = e

    const initElement = document.elementFromPoint(e.clientX, e.clientY)
    if (initElement && initElement?.id.startsWith('bounds_') && currentClickedElement.value) {
      // 进行尺寸改变的点
      if (initElement?.id.endsWith('_scale')) {
        transformMode = 'Scale'
        const tp = initElement?.id?.slice(7).match(/_(.*)_/)
        currentScaleType = tp && tp[1] as ScaleType
      }
      else if (initElement?.id.endsWith('_rotate')) {
        transformMode = 'Rotate'
      }
    }
    else {
      // 点击的是block
      currentClickedElement.value = getCellObjectInStoreFromPosition(store.mouseFrom)
      transformMode = 'Drag'
    }
  }

  function mousemove(e: MouseEvent) {
    const pt = e

    if (previousEvent && currentClickedElement.value) {
      if (transformMode === 'Drag') {
        const oriPt = previousEvent

        // 1.直接修改x和y比较简单的方式
        // currentClickedElement.value.x = currentClickedElement.value.x + (pt.clientX - oriPt.clientX)
        // currentClickedElement.value.y = currentClickedElement.value.y + (pt.clientY - oriPt.clientY)

        // 2.使用css transform方式
        const lastTranslateX = currentClickedElement.value.x
        const lastTranslateY = currentClickedElement.value.y
        const offsetX = lastTranslateX + (pt.clientX - oriPt.clientX)
        const offsetY = lastTranslateY + (pt.clientY - oriPt.clientY)

        currentClickedElement.value.x = offsetX
        currentClickedElement.value.y = offsetY
        currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${offsetX}, ${offsetY})`
      }
      else if (transformMode === 'Scale') {
        const oriPt = previousEvent
        const lastTranslateX = currentClickedElement.value.x
        const lastTranslateY = currentClickedElement.value.y
        const disX = (pt.clientX - oriPt.clientX)

        // 😅 开始变形！~
        if (currentScaleType === 'left') {
          if (attachedLine.value.l.length === 0) {
            // 说明没有左边线
            // const disX = (pt.clientX - oriPt.clientX)
            currentClickedElement.value.x = lastTranslateX + disX
            currentClickedElement.value.y = lastTranslateY
            currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${lastTranslateX + disX}, ${lastTranslateY})`
            currentClickedElement.value.width = currentClickedElement.value.width - disX
            createAttachedLineForScale(e)
          }
          else {
            // 说明有左边线
            const left = attachedLine.value.l[0]
            if ((Math.abs(left.x) - DEVIATION) < (lastTranslateX + disX) && (lastTranslateX + disX) < (Math.abs(left.x) + DEVIATION)) {
              // 在误差内。不能缩放了
              return
            }
            else {
              // disX是当前的减去上次的。
              // 如果是正数，说明是向右移动了，宽度减少了，x增加了。宽度减少多少，x增加多少
              // 如果是负数，说明是向左移动了，宽度增加了，x减小了。宽度增加多少，x减少多少
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${currentClickedElement.value.x}, ${lastTranslateY})`

              createAttachedLineForScale(e)
            }
          }
        }

        if (currentScaleType === 'right')
          currentClickedElement.value.width = currentClickedElement.value.width + (pt.clientX - oriPt.clientX)

        if (currentScaleType === 'top') {
          const disY = (pt.clientY - oriPt.clientY)
          currentClickedElement.value.x = lastTranslateX
          currentClickedElement.value.y = lastTranslateY + disY
          currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${lastTranslateX}, ${lastTranslateY + disY})`
          currentClickedElement.value.height = currentClickedElement.value.height - disY
        }
        if (currentScaleType === 'bottom')
          currentClickedElement.value.height = currentClickedElement.value.height + (pt.clientY - oriPt.clientY)

        // 😅 角落两个同时变形！~ （就是将上面单个的两个为一组组合一下）
        if (currentScaleType === 'bottom_left') {
          const disX = (pt.clientX - oriPt.clientX)
          currentClickedElement.value.x = lastTranslateX + disX
          currentClickedElement.value.y = lastTranslateY

          currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${lastTranslateX + disX}, ${lastTranslateY})`
          currentClickedElement.value.width = currentClickedElement.value.width - disX
          currentClickedElement.value.height = currentClickedElement.value.height + (pt.clientY - oriPt.clientY)
        }
        if (currentScaleType === 'bottom_right') {
          currentClickedElement.value.width = currentClickedElement.value.width + (pt.clientX - oriPt.clientX)
          currentClickedElement.value.height = currentClickedElement.value.height + (pt.clientY - oriPt.clientY)
        }
        if (currentScaleType === 'top_left') {
          const disX = (pt.clientX - oriPt.clientX)
          const disY = (pt.clientY - oriPt.clientY)
          currentClickedElement.value.x = lastTranslateX + disX
          currentClickedElement.value.y = lastTranslateY + disY
          currentClickedElement.value.transform = `matrix(1, 0, 0, 1,  ${lastTranslateX + disX}, ${lastTranslateY + disY})`
          currentClickedElement.value.width = currentClickedElement.value.width - disX
          currentClickedElement.value.height = currentClickedElement.value.height - disY
        }
        if (currentScaleType === 'top_right') {
          const disY = (pt.clientY - oriPt.clientY)
          currentClickedElement.value.x = lastTranslateX
          currentClickedElement.value.y = lastTranslateY + disY
          currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${lastTranslateX}, ${lastTranslateY + disY})`
          currentClickedElement.value.height = currentClickedElement.value.height - disY
          currentClickedElement.value.width = currentClickedElement.value.width + (pt.clientX - oriPt.clientX)
        }
      }
      else if (transformMode === 'Rotate') {
        console.log('Rotate')
      }
      previousEvent = e
    }
  }

  function mouseup(e: MouseEvent) {
    previousEvent = null
    // currentClickedElement.value = null
    saveCanvasLayoutData()
  }
  /**
   * 通过坐标位置获取当前对象
   * @param position 坐标
   * @returns 点击的对象
   */
  function getCellObjectInStoreFromPosition(position: { x: number; y: number }): Object | null {
    let result = null
    const point = { x: position.x, y: position.y }
    const initElement = document.elementFromPoint(point.x, point.y)
    if (initElement)
      result = store.gridCells.filter(ele => ele.id === initElement.id)

    return result ? result[0] : null
  }

  function createAttachedLineForScale(e: MouseEvent) {
    // 每个块有六条线
    // 1.如果当前某条线已经出现，那么就不再吸附那个线
    // 2.如果当前某条线没有出现，那么就还可以吸附
    // 3.设置的主要是x,y,width,height。这里的x,y是为了逻辑显示，实际使用transform代替x,y

    for (const cell of store.gridCells) {
      if (cell?.id === currentClickedElement.value?.id)
        return [0, 0, 0, 0, 0, 0]

      // 2.获取所有偏移的x和y值
      if ((Math.abs(cell.x) - DEVIATION) < currentClickedElement.value?.x && currentClickedElement.value?.x < (Math.abs(cell.x) + DEVIATION)) {
        if (attachedLine.value.l.length > 0) {
          console.log('已经有吸附线')
        }
        else {
          const disX = cell.x - currentClickedElement.value.x
          currentClickedElement.value.x += disX
          currentClickedElement.value.width -= disX
          currentClickedElement.value.transform = `matrix(1, 0, 0, 1, ${currentClickedElement.value.x}, ${currentClickedElement.value?.y})`
          attachedLine.value.l.push({ ...cell, type: 0 })
        }

        break
      }
      else {
        attachedLine.value.l = []
      }
    }
  }

  return GridContainer
}
