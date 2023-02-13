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

export function initGridContainer(
  currentClickedElement: Ref<any>,
  attachedLine: Ref<{ l: any[]; mv: any[];r: any[];t: any[];vh: any[];b: any[] }>,
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
      editAGridCell({ ...cell.cfg, index })
    })
  }, 1000)

  watch(currentClickedElement, (nVal) => {
    // 设置吸附线误差为5px
    const DEVIATION = 5
    if (nVal) {
      // 0.设置将当前点击的要素为最顶层
      const index = store.gridCells.findIndex(ele => ele.cfg.id === nVal.cfg?.id)
      if (index !== -1) {
        const ele = store.gridCells.splice(index, 1)
        store.gridCells.push(ele[0])
      }

      // 1.获取当前元素的偏移值
      let clickedTX = 0
      let clickedTY = 0
      const clickedWidth = currentClickedElement.value?.cfg?.width
      const clickedHeight = currentClickedElement.value?.cfg?.height
      if (currentClickedElement.value.cfg.transform) {
        const matrixVariable = currentClickedElement.value.cfg.transform.match(/matrix\((.*)\)/)[1]?.split(',')
        clickedTX = Number(matrixVariable.at(-2))
        clickedTY = Number(matrixVariable.at(-1))
      }
      else {
        return
      }

      // 其实应该是更新。这里粗暴先置空
      for (const key in attachedLine.value)
        attachedLine.value[key] = []

      store.gridCells.forEach((cell) => {
        // 首先将它自己排除
        if (cell?.cfg?.id === currentClickedElement.value?.cfg?.id)
          return

        // 2.获取所有偏移的x和y值
        let cellTX = 0 // cell translate x
        let cellTY = 0 // cell translate y
        const cellWidth = cell?.cfg?.width // cell translate y
        const cellHeight = cell?.cfg?.height // cell translate y
        if (cell?.cfg?.transform) {
          const matrixVariable = cell?.cfg?.transform.match(/matrix\((.*)\)/)[1]?.split(',')
          cellTX = Number(matrixVariable.at(-2))
          cellTY = Number(matrixVariable.at(-1))
        }

        // 3.比较，如果有return出去。这里的左中右上中下都是对于当前点击的元素来说
        // l - 都是左侧
        if ((Math.abs(cellTX) - DEVIATION) < clickedTX && clickedTX < (Math.abs(cellTX) + DEVIATION)) {
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${cellTX}, ${clickedTY})`
          attachedLine.value.l.push(cell.cfg)
        }
        // l - 点击的要素是左侧，跟其他的可能有边可以吸附
        if ((Math.abs(cellTX + cellWidth) - DEVIATION) < clickedTX && clickedTX < (Math.abs(cellTX + cellWidth) + DEVIATION)
        ) {
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${cellTX + cellWidth}, ${clickedTY})`
          attachedLine.value.l.push(cell.cfg)
        }
        // r
        if ((Math.abs(cellTX) - DEVIATION) < (clickedTX + clickedWidth) && (clickedTX + clickedWidth) < (Math.abs(cellTX) + DEVIATION)) {
          // 设置当前元素吸附
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${cellTX - clickedWidth}, ${clickedTY})`
          attachedLine.value.r.push(cell.cfg)
        }
        // r - 点击的要素还是右侧
        if ((Math.abs(cellTX + cellWidth) - DEVIATION) < (clickedTX + clickedWidth) && (clickedTX + clickedWidth) < (Math.abs(cellTX + cellWidth) + DEVIATION)) {
          // 设置当前元素吸附
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${cellTX + cellWidth - clickedWidth}, ${clickedTY})`
          attachedLine.value.r.push(cell.cfg)
        }
      })
    }
  }, {
    deep: true,
  })

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
        // currentClickedElement.value.cfg.x = currentClickedElement.value.cfg.x + (pt.clientX - oriPt.clientX)
        // currentClickedElement.value.cfg.y = currentClickedElement.value.cfg.y + (pt.clientY - oriPt.clientY)

        // 2.使用css transform方式
        let lastTranslateX = 0
        let lastTranslateY = 0
        if (currentClickedElement.value.cfg.transform) {
          const matrixVariable = currentClickedElement.value.cfg.transform.match(/matrix\((.*)\)/)[1]?.split(',')
          lastTranslateX = Number(matrixVariable.at(-2))
          lastTranslateY = Number(matrixVariable.at(-1))
        }
        const offsetX = lastTranslateX + (pt.clientX - oriPt.clientX)
        const offsetY = lastTranslateY + (pt.clientY - oriPt.clientY)
        currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${offsetX}, ${offsetY})`
      }
      else if (transformMode === 'Scale') {
        const oriPt = previousEvent
        let lastTranslateX = 0
        let lastTranslateY = 0
        if (currentClickedElement.value.cfg.transform) {
          const matrixVariable = currentClickedElement.value.cfg.transform.match(/matrix\((.*)\)/)[1]?.split(',')
          lastTranslateX = Number(matrixVariable.at(-2))
          lastTranslateY = Number(matrixVariable.at(-1))
        }
        // 😅 开始变形！~
        if (currentScaleType === 'left') {
          const disX = (pt.clientX - oriPt.clientX)
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${lastTranslateX + disX}, ${lastTranslateY})`
          currentClickedElement.value.cfg.width = currentClickedElement.value.cfg.width - disX
        }
        if (currentScaleType === 'right')
          currentClickedElement.value.cfg.width = currentClickedElement.value.cfg.width + (pt.clientX - oriPt.clientX)
        if (currentScaleType === 'top') {
          const disY = (pt.clientY - oriPt.clientY)
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${lastTranslateX}, ${lastTranslateY + disY})`
          currentClickedElement.value.cfg.height = currentClickedElement.value.cfg.height - disY
        }
        if (currentScaleType === 'bottom')
          currentClickedElement.value.cfg.height = currentClickedElement.value.cfg.height + (pt.clientY - oriPt.clientY)

        // 😅 角落两个同时变形！~ （就是将上面单个的两个为一组组合一下）
        if (currentScaleType === 'bottom_left') {
          const disX = (pt.clientX - oriPt.clientX)
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${lastTranslateX + disX}, ${lastTranslateY})`
          currentClickedElement.value.cfg.width = currentClickedElement.value.cfg.width - disX
          currentClickedElement.value.cfg.height = currentClickedElement.value.cfg.height + (pt.clientY - oriPt.clientY)
        }
        if (currentScaleType === 'bottom_right') {
          currentClickedElement.value.cfg.width = currentClickedElement.value.cfg.width + (pt.clientX - oriPt.clientX)
          currentClickedElement.value.cfg.height = currentClickedElement.value.cfg.height + (pt.clientY - oriPt.clientY)
        }
        if (currentScaleType === 'top_left') {
          const disX = (pt.clientX - oriPt.clientX)
          const disY = (pt.clientY - oriPt.clientY)
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1,  ${lastTranslateX + disX}, ${lastTranslateY + disY})`
          currentClickedElement.value.cfg.width = currentClickedElement.value.cfg.width - disX
          currentClickedElement.value.cfg.height = currentClickedElement.value.cfg.height - disY
        }
        if (currentScaleType === 'top_right') {
          const disY = (pt.clientY - oriPt.clientY)
          currentClickedElement.value.cfg.transform = `matrix(1, 0, 0, 1, ${lastTranslateX}, ${lastTranslateY + disY})`
          currentClickedElement.value.cfg.height = currentClickedElement.value.cfg.height - disY
          currentClickedElement.value.cfg.width = currentClickedElement.value.cfg.width + (pt.clientX - oriPt.clientX)
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
      result = store.gridCells.filter(ele => ele.cfg.id === initElement.id)

    return result ? result[0] : null
  }

  return GridContainer
}
