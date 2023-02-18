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
const DEVIATION = 5

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
    // 1. 设置模式 drag or scale
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

      // 将点击的 block 置顶
      if (currentClickedElement.value) {
        transformMode = 'Drag'

        const index = store.gridCells.findIndex(ele => ele.id === currentClickedElement.value.id)
        if (index !== -1) {
          const ele = store.gridCells.splice(index, 1)
          store.gridCells.push(ele[0])
        }
      }
    }
  }

  function mousemove(e: MouseEvent) {
    store.mouseTo = { x: e.clientX, y: e.clientY }

    if (store.mouseFrom.x !== 0 && store.mouseFrom.y !== 0 && currentClickedElement.value) {
      if (transformMode === 'Drag') {
        const disX = (store.mouseTo.x - store.mouseFrom.x)
        const disY = (store.mouseTo.y - store.mouseFrom.y)

        // currentClickedElement.value.x += disX
        // currentClickedElement.value.y += disY
        // store.mouseFrom = { x: e.clientX, y: e.clientY }
        // createAttachedLineForDrag()

        // 左右的线的代码逻辑是相同的，所以不能重新赋值一样的。
        // 1. 两个都没有线 --- 正常赋值拖拽
        // 2. 只有左线    --- 按照左线的吸附线逻辑
        // 3. 只有右线    --- 按照右线的吸附线逻辑
        // 4. 有两条线    --- 按照任意一条吸附线逻辑就行

        if (attachedLine.value.l.length === 0 && attachedLine.value.r.length === 0) {
          currentClickedElement.value.x += disX
          attachedLine.value.l = []
          attachedLine.value.r = []
          store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
          createAttachedLineForDrag('l')
          createAttachedLineForDrag('r')
        }
        else if (attachedLine.value.l.length > 0 && attachedLine.value.r.length === 0) {
          const left = attachedLine.value.l[0]
          if (
            ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
            || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
            currentClickedElement.value.x += disX
            attachedLine.value.l = []
            store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
            createAttachedLineForDrag('l')
          }
        }
        else if (attachedLine.value.l.length === 0 && attachedLine.value.r.length > 0) {
          const right = attachedLine.value.r[0]
          if (
            ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            currentClickedElement.value.x += disX
            attachedLine.value.r = []
            store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
            createAttachedLineForDrag('r')
          }
        }
        else if (attachedLine.value.l.length > 0 && attachedLine.value.r.length > 0) {
          const left = attachedLine.value.l[0]
          if (
            ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
            || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
            currentClickedElement.value.x += disX
            attachedLine.value.l = []
            store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
            createAttachedLineForDrag('l')
          }
        }

        // 上下的线的代码逻辑是相同的，所以不能重新赋值一样的。
        // 1. 两个都没有线 --- 正常赋值拖拽
        // 2. 只有上线    --- 按照上线的吸附线逻辑
        // 3. 只有下线    --- 按照下线的吸附线逻辑
        // 4. 有两条线    --- 按照任意一条吸附线逻辑就行

        if (attachedLine.value.t.length === 0 && attachedLine.value.b.length === 0) {
          currentClickedElement.value.y += disY
          attachedLine.value.t = []
          attachedLine.value.b = []
          store.mouseFrom = Object.assign(store.mouseFrom, { y: e.clientY })
          createAttachedLineForDrag('t')
          createAttachedLineForDrag('b')
        }
        else if (attachedLine.value.t.length > 0 && attachedLine.value.b.length === 0) {
          const top = attachedLine.value.t[0]
          if (
            ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
            || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
            currentClickedElement.value.y += disY
            attachedLine.value.t = []
            store.mouseFrom = Object.assign(store.mouseFrom, { y: e.clientY })
            createAttachedLineForDrag('t')
          }
        }
        else if (attachedLine.value.t.length === 0 && attachedLine.value.b.length > 0) {
          const bottom = attachedLine.value.b[0]
          if (
            ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            currentClickedElement.value.y += disY
            attachedLine.value.b = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForDrag('b')
          }
        }
        else if (attachedLine.value.t.length > 0 && attachedLine.value.b.length > 0) {
          const bottom = attachedLine.value.b[0]
          if (
            ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
          ) {
            // 在误差内。不能缩放了
          }
          else {
            currentClickedElement.value.y += disY
            attachedLine.value.b = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForDrag('b')
          }
        }
      }
      else if (transformMode === 'Scale') {
        const disX = (store.mouseTo.x - store.mouseFrom.x)
        const disY = (store.mouseTo.y - store.mouseFrom.y)

        // 😅 开始变形！~
        if (currentScaleType === 'left') {
          if (attachedLine.value.l.length === 0) {
            // 说明没有左边线
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            attachedLine.value.l = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有左边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const left = attachedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              attachedLine.value.l = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'right') {
          if (attachedLine.value.r.length === 0) {
            // 说明没有右边线
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
            attachedLine.value.r = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有右边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const right = attachedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
              attachedLine.value.r = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'top') {
          if (attachedLine.value.t.length === 0) {
            // 说明没有左边线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            attachedLine.value.t = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有左边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const top = attachedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              attachedLine.value.t = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'bottom') {
          if (attachedLine.value.b.length === 0) {
            // 说明没有右边线
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
            attachedLine.value.b = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else {
            // 说明有右边线。因为左边线可能出现在其他元素的左边或者右边，所以有两个判断，加其他元素的宽度
            const bottom = attachedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
            }
            else {
              currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
              attachedLine.value.b = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }

        // 😅 角落两个同时变形！~ （就是将上面单个的两个为一组组合一下）

        // 1. 两条线都没有
        // 2. 碰到左边线
        // 3. 碰到右边线
        // 4. 两条线都碰到

        // 修改方法 ( 以 top_left 举例 )
        // 1 - 零条边 - 直接将两条边的拷贝 - 将 top 的代码和 left 拷贝，并只保留一句重复代码
        // 2 - 一条边 ( left ) - 直接将一条边的代码拷贝 - 拷贝 left 的代码
        //   --- 这里当在范围内的时候限制移动是通过不给 store.mouseFrom 赋值，使其一直在范围内，进不了判断所进行的
        //   --- 因为要考虑 top 的正常移动，所以将 top 的正常移动的代码挪到顶部
        //   --- 当在 left 范围内的时候，top 正常移动，这里需要将 store.mouseFrom 的 y 方向的值正常赋值。所以有Object.assign
        // 3 - 一条边 ( top ) 同上
        // 4 - 两条边 - 综合 2 和 3 ，然后将限制的 Object.assign 这行代码删掉
        if (currentScaleType === 'top_left') {
          if (attachedLine.value.l.length === 0 && attachedLine.value.t.length === 0) {
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            attachedLine.value.l = []
            attachedLine.value.t = []
            createAttachedLineForScale()
          }
          else if (attachedLine.value.l.length > 0 && attachedLine.value.t.length === 0) {
            // 碰到了左边线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY

            const left = attachedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              store.mouseFrom = Object.assign(store.mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              attachedLine.value.l = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.l.length === 0 && attachedLine.value.t.length > 0) {
            // 碰到了上边线
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const top = attachedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              attachedLine.value.t = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.l.length > 0 && attachedLine.value.t.length > 0) {
            // 碰到了两条线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const left = attachedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              attachedLine.value.l = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            const top = attachedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              attachedLine.value.t = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'top_right') {
          if (attachedLine.value.r.length === 0 && attachedLine.value.t.length === 0) {
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
            attachedLine.value.r = []
            attachedLine.value.t = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else if (attachedLine.value.r.length > 0 && attachedLine.value.t.length === 0) {
            // 碰到了右边线
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY

            const right = attachedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              store.mouseFrom = Object.assign(store.mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
              attachedLine.value.r = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.r.length === 0 && attachedLine.value.t.length > 0) {
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)

            const top = attachedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              attachedLine.value.t = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.r.length > 0 && attachedLine.value.t.length > 0) {
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)

            const right = attachedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
              || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
              attachedLine.value.r = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            const top = attachedLine.value.t[0]
            if (
              ((Math.abs(top.y) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y) + DEVIATION))
              || ((Math.abs(top.y + top.height) - DEVIATION) < (currentClickedElement.value.y + disY) && (currentClickedElement.value.y + disY) < (Math.abs(top.y + top.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.y += disY
              currentClickedElement.value.height -= disY
              attachedLine.value.t = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'bottom_left') {
          if (attachedLine.value.l.length === 0 && attachedLine.value.b.length === 0) {
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)

            attachedLine.value.l = []
            attachedLine.value.b = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else if (attachedLine.value.l.length > 0 && attachedLine.value.b.length === 0) {
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)

            const left = attachedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              store.mouseFrom = Object.assign(store.mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              attachedLine.value.l = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.l.length === 0 && attachedLine.value.b.length > 0) {
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const bottom = attachedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
              attachedLine.value.b = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.l.length > 0 && attachedLine.value.b.length > 0) {
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX

            const left = attachedLine.value.l[0]
            if (
              ((Math.abs(left.x) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x) + DEVIATION))
              || ((Math.abs(left.x + left.width) - DEVIATION) < (currentClickedElement.value.x + disX) && (currentClickedElement.value.x + disX) < (Math.abs(left.x + left.width) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              // disX是当前的减去上次的。偏移值和宽度一个增加一个必然就减小
              currentClickedElement.value.x += disX
              currentClickedElement.value.width -= disX
              attachedLine.value.l = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            const bottom = attachedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
              attachedLine.value.b = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
        if (currentScaleType === 'bottom_right') {
          if (attachedLine.value.r.length === 0 && attachedLine.value.b.length === 0) {
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
            attachedLine.value.b = []
            attachedLine.value.r = []
            store.mouseFrom = { x: e.clientX, y: e.clientY }
            createAttachedLineForScale()
          }
          else if (attachedLine.value.r.length > 0 && attachedLine.value.b.length === 0) {
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)

            const right = attachedLine.value.r[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
                || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              store.mouseFrom = Object.assign(store.mouseFrom, { y: e.clientY })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
              attachedLine.value.r = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.r.length === 0 && attachedLine.value.b.length > 0) {
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)

            const bottom = attachedLine.value.b[0]
            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              store.mouseFrom = Object.assign(store.mouseFrom, { x: e.clientX })
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
              attachedLine.value.b = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
          else if (attachedLine.value.r.length > 0 && attachedLine.value.b.length > 0) {
            currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
            currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)

            const right = attachedLine.value.r[0]
            const bottom = attachedLine.value.b[0]
            if (
              ((Math.abs(right.x) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x) + DEVIATION))
                || ((Math.abs(right.x + right.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width + disX) && (currentClickedElement.value.x + currentClickedElement.value.width + disX) < (Math.abs(right.x + right.width) + DEVIATION))
            ) {
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.width += (store.mouseTo.x - store.mouseFrom.x)
              attachedLine.value.r = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }

            if (
              ((Math.abs(bottom.y) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y) + DEVIATION))
              || ((Math.abs(bottom.y + bottom.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height + disY) && (currentClickedElement.value.y + currentClickedElement.value.height + disY) < (Math.abs(bottom.y + bottom.height) + DEVIATION))
            ) {
              // 在误差内。不能缩放了
              createAttachedLineForScale()
            }
            else {
              currentClickedElement.value.height += (store.mouseTo.y - store.mouseFrom.y)
              attachedLine.value.b = []
              store.mouseFrom = { x: e.clientX, y: e.clientY }
              createAttachedLineForScale()
            }
          }
        }
      }
      else if (transformMode === 'Rotate') {
        // console.log('Rotate')
      }
    }
  }

  function mouseup(e: MouseEvent) {
    store.mouseFrom.x = 0
    store.mouseFrom.y = 0
    saveCanvasLayoutData()

    for (const key in attachedLine.value)
      attachedLine.value[key] = []
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

  function createAttachedLineForScale() {
    // 每个块有六条线

    store.gridCells.forEach((cell, index) => {
      if (cell?.id !== currentClickedElement.value?.id) {
        if (currentScaleType === 'left')
          generateLeftLine()
        else if (currentScaleType === 'right')
          generateRightLine()
        else if (currentScaleType === 'top')
          generateTopLine()
        else if (currentScaleType === 'bottom')
          generateBottomLine()
        else if (currentScaleType === 'top_left')
          generateTopLeftLine()
        else if (currentScaleType === 'top_right')
          generateTopRightLine()
        else if (currentScaleType === 'bottom_left')
          generateBottomLeftLine()
        else if (currentScaleType === 'bottom_right')
          generateBottomRightLine()

        function generateLeftLine() {
          if ((Math.abs(cell.x) - DEVIATION) < currentClickedElement.value?.x && currentClickedElement.value?.x < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            attachedLine.value.l.push({ ...cell, type: 0 })
          }
          // cell的右边
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < currentClickedElement.value?.x
              && currentClickedElement.value?.x < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = cell.x + cell.width - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            currentClickedElement.value.width -= disX
            attachedLine.value.l.push({ ...cell, type: 1 })
          }
        }

        function generateRightLine() {
          // cell的左边
          if ((Math.abs(cell.x) - DEVIATION) < (currentClickedElement.value?.x + currentClickedElement.value?.width) && (currentClickedElement.value?.x + currentClickedElement.value?.width) < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.width += disX
            attachedLine.value.r.push({ ...cell, type: 0 })
          }
          // cell的右边
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width)
              && (currentClickedElement.value.x + currentClickedElement.value.width) < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = (cell.x + cell.width) - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.width += disX
            attachedLine.value.r.push({ ...cell, type: 1 })
          }
        }

        function generateTopLine() {
          // cell的上边
          if ((Math.abs(cell.y) - DEVIATION) < currentClickedElement.value?.y && currentClickedElement.value?.y < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            attachedLine.value.t.push({ ...cell, type: 0 })
          }
          // cell的下边
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < currentClickedElement.value?.y
              && currentClickedElement.value?.y < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = cell.y + cell.height - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            currentClickedElement.value.height -= disY
            attachedLine.value.t.push({ ...cell, type: 1 })
          }
        }

        function generateBottomLine() {
          // 2.当前元素的右吸附线
          // cell的左边
          if ((Math.abs(cell.y) - DEVIATION) < (currentClickedElement.value?.y + currentClickedElement.value?.height) && (currentClickedElement.value?.y + currentClickedElement.value?.height) < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.height += disY
            attachedLine.value.b.push({ ...cell, type: 0 })
          }
          // cell的右边
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height)
              && (currentClickedElement.value.y + currentClickedElement.value.height) < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = (cell.y + cell.height) - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.height += disY
            attachedLine.value.b.push({ ...cell, type: 1 })
          }
        }

        function generateTopLeftLine() {
          generateLeftLine()
          generateTopLine()
        }
        function generateTopRightLine() {
          generateTopLine()
          generateRightLine()
        }
        function generateBottomLeftLine() {
          generateBottomLine()
          generateLeftLine()
        }
        function generateBottomRightLine() {
          generateBottomLine()
          generateRightLine()
        }
      }
    })
  }

  function createAttachedLineForDrag(type?: string) {
    store.gridCells.forEach((cell, index) => {
      if (cell?.id !== currentClickedElement.value?.id) {
        if (type === 'l')
          generateLeftLine()
        else if (type === 't')
          generateTopLine()
        else if (type === 'r')
          generateRightLine()
        else if (type === 'b')
          generateBottomLine()

        function generateLeftLine() {
          if ((Math.abs(cell.x) - DEVIATION) < currentClickedElement.value?.x && currentClickedElement.value?.x < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            attachedLine.value.l.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < currentClickedElement.value?.x
              && currentClickedElement.value?.x < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = cell.x + cell.width - currentClickedElement.value.x
            currentClickedElement.value.x += disX
            attachedLine.value.l.push({ ...cell, type: 1 })
          }
        }
        function generateRightLine() {
          if ((Math.abs(cell.x) - DEVIATION) < (currentClickedElement.value?.x + currentClickedElement.value?.width) && (currentClickedElement.value?.x + currentClickedElement.value?.width) < (Math.abs(cell.x) + DEVIATION)) {
            const disX = cell.x - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.x = currentClickedElement.value.x + disX
            attachedLine.value.r.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.x + cell.width) - DEVIATION) < (currentClickedElement.value.x + currentClickedElement.value.width)
              && (currentClickedElement.value.x + currentClickedElement.value.width) < (Math.abs(cell.x + cell.width) + DEVIATION)
          ) {
            const disX = (cell.x + cell.width) - (currentClickedElement.value.x + currentClickedElement.value.width)
            currentClickedElement.value.x = currentClickedElement.value.x + disX
            attachedLine.value.r.push({ ...cell, type: 1 })
          }
        }
        function generateTopLine() {
          if ((Math.abs(cell.y) - DEVIATION) < currentClickedElement.value?.y && currentClickedElement.value?.y < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            attachedLine.value.t.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < currentClickedElement.value?.y
              && currentClickedElement.value?.y < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = cell.y + cell.height - currentClickedElement.value.y
            currentClickedElement.value.y += disY
            attachedLine.value.t.push({ ...cell, type: 1 })
          }
        }
        function generateBottomLine() {
          if ((Math.abs(cell.y) - DEVIATION) < (currentClickedElement.value?.y + currentClickedElement.value?.height) && (currentClickedElement.value?.y + currentClickedElement.value?.height) < (Math.abs(cell.y) + DEVIATION)) {
            const disY = cell.y - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.y += disY
            attachedLine.value.b.push({ ...cell, type: 0 })
          }
          if (
            (Math.abs(cell.y + cell.height) - DEVIATION) < (currentClickedElement.value.y + currentClickedElement.value.height)
              && (currentClickedElement.value.y + currentClickedElement.value.height) < (Math.abs(cell.y + cell.height) + DEVIATION)
          ) {
            const disY = (cell.y + cell.height) - (currentClickedElement.value.y + currentClickedElement.value.height)
            currentClickedElement.value.y += disY
            attachedLine.value.b.push({ ...cell, type: 1 })
          }
        }
      }
    })
  }

  return GridContainer
}
