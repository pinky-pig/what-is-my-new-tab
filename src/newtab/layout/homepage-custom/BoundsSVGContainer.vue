<!-- eslint-disable no-console -->
<script setup lang="ts">
import type { GridCellType } from './GridCell'

const props = defineProps(['currentClickedElement', 'attachedLine'])

const borderWidth = 10

// 1.四条边 scale 四个角落点 scale 四个旋转角落点 rotate
const rectLineData = ref([
  {
    name: 'line_top_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y - borderWidth / 2) || 0),
      width: computed(() => props.currentClickedElement?.cfg?.width || 0),
      height: 10,
    },
    style: {
      cursor: 'ns-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
  {
    name: 'line_bottom_scale',
    bounds: {
      x: computed(() => props.currentClickedElement?.cfg?.x || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y + props.currentClickedElement?.cfg?.height - borderWidth / 2) || 0),
      width: computed(() => props.currentClickedElement?.cfg?.width || 0),
      height: 10,
    },
    style: {
      cursor: 'ns-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
  {
    name: 'line_left_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x - borderWidth / 2) || 0),
      y: computed(() => props.currentClickedElement?.cfg?.y || 0),
      width: 10,
      height: computed(() => props.currentClickedElement?.cfg?.height || 0),
    },
    style: {
      cursor: 'ew-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
  {
    name: 'line_right_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x + props.currentClickedElement?.cfg?.width - borderWidth / 2) || 0),
      y: computed(() => props.currentClickedElement?.cfg?.y || 0),
      width: 10,
      height: computed(() => props.currentClickedElement?.cfg?.height || 0),
    },
    style: {
      cursor: 'ew-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
])

// 2.缩放四角
const rectCornerScaleData = ref([
  {
    name: 'corner_top_left_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nwse-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
  {
    name: 'corner_top_right_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x + props.currentClickedElement?.cfg?.width - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nesw-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
  {
    name: 'corner_bottom_left_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y + props.currentClickedElement?.cfg?.height - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nesw-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
  {
    name: 'corner_bottom_right_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x + props.currentClickedElement?.cfg?.width - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y + props.currentClickedElement?.cfg?.height - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nwse-resize',
      transform: computed(() => (props.currentClickedElement?.cfg?.transform)),
    },
  },
])

// 3.旋转四角

// 4.六条吸附线，左中右上中下
const defaultAttachedLine = { x1: 0, y1: 0, x2: 0, y2: 0 }
const attachedLineData = ref({
  l: { name: 'left', ...defaultAttachedLine },
  mv: { name: 'middleVertical', ...defaultAttachedLine },
  r: { name: 'right', ...defaultAttachedLine },
  t: { name: 'top', ...defaultAttachedLine },
  mh: { name: 'middleHorizontal', ...defaultAttachedLine },
  b: { name: 'bottom', ...defaultAttachedLine },
})
watch(props.attachedLine, (v) => {
  handleAttachedLineLeft(v.l)
  handleAttachedLineRight(v.r)
  handleAttachedLineMiddleVertical(v.mv)
  handleAttachedLineTop(v.t)
})

// 从单个cell获取其坐标位置大小
function getXYFromTransform(cellCfg: GridCellType) {
  const matchResult = cellCfg?.transform.match(/matrix\((.*)\)/)
  const result = { x: 0, y: 0, width: cellCfg.width, height: cellCfg.height }
  if (matchResult) {
    const matrixVariable = matchResult[1]?.split(',')
    result.x = Number(matrixVariable.at(-2))
    result.y = Number(matrixVariable.at(-1))
  }
  return result
}
// 监听左吸附线的位置
function handleAttachedLineLeft(leftArr: []) {
  // 如果数组不为空，说明有左吸附线
  if (leftArr.length > 0) {
    // 1.计算x值
    const clickedElementRect = getXYFromTransform(props.currentClickedElement?.cfg)
    const xPosition = clickedElementRect.x

    // 2.计算y值
    let minY = clickedElementRect.y
    let maxY = clickedElementRect.y + clickedElementRect.height
    const lLineArr = [...leftArr, props.currentClickedElement?.cfg]
    if (lLineArr.length > 0) {
      // 获取每个对象的matrix值
      for (let i = 0; i < lLineArr.length; i++) {
        const rect = getXYFromTransform(lLineArr[i])
        minY = Math.min(minY, rect.y)
        maxY = Math.max(maxY, rect.y + rect.height)
      }
    }
    attachedLineData.value.l.x1 = xPosition
    attachedLineData.value.l.y1 = minY
    attachedLineData.value.l.x2 = xPosition
    attachedLineData.value.l.y2 = maxY
  }
  else {
    // 将线条位置置为0
    for (const key in attachedLineData.value.l)
      attachedLineData.value.l[key] = 0
  }
}
// 监听右吸附线的位置
function handleAttachedLineRight(rightArr: []) {
  // 如果数组不为空，说明有左吸附线
  if (rightArr.length > 0) {
    // 1.计算x值
    const clickedElementRect = getXYFromTransform(props.currentClickedElement?.cfg)
    const xPosition = clickedElementRect.x + clickedElementRect.width

    // 2.计算y值
    let minY = clickedElementRect.y
    let maxY = clickedElementRect.y + clickedElementRect.height
    const lLineArr = [...rightArr, props.currentClickedElement?.cfg]
    if (lLineArr.length > 0) {
      // 获取每个对象的matrix值
      for (let i = 0; i < lLineArr.length; i++) {
        const rect = getXYFromTransform(lLineArr[i])
        minY = Math.min(minY, rect.y)
        maxY = Math.max(maxY, rect.y + rect.height)
      }
    }
    attachedLineData.value.r.x1 = xPosition
    attachedLineData.value.r.y1 = minY
    attachedLineData.value.r.x2 = xPosition
    attachedLineData.value.r.y2 = maxY
  }
  else {
    // 将线条位置置为0
    for (const key in attachedLineData.value.l)
      attachedLineData.value.r[key] = 0
  }
}
// 监听中间吸附线的位置
function handleAttachedLineMiddleVertical(middleVerticalArr: []) {
  // 如果数组不为空，说明有左吸附线
  if (middleVerticalArr.length > 0) {
    // 1.计算x值
    const clickedElementRect = getXYFromTransform(props.currentClickedElement?.cfg)
    const xPosition = clickedElementRect.x + clickedElementRect.width / 2

    // 2.计算y值
    let minY = clickedElementRect.y
    let maxY = clickedElementRect.y + clickedElementRect.height
    const lLineArr = [...middleVerticalArr, props.currentClickedElement?.cfg]
    if (lLineArr.length > 0) {
      // 获取每个对象的matrix值
      for (let i = 0; i < lLineArr.length; i++) {
        const rect = getXYFromTransform(lLineArr[i])
        minY = Math.min(minY, rect.y)
        maxY = Math.max(maxY, rect.y + rect.height)
      }
    }
    attachedLineData.value.mv.x1 = xPosition
    attachedLineData.value.mv.y1 = minY
    attachedLineData.value.mv.x2 = xPosition
    attachedLineData.value.mv.y2 = maxY
  }
  else {
    // 将线条位置置为0
    for (const key in attachedLineData.value.l)
      attachedLineData.value.mv[key] = 0
  }
}
// 监听上吸附线的位置
function handleAttachedLineTop(topArr: []) {
  // 如果数组不为空，说明有左吸附线
  if (topArr.length > 0) {
    // 1.计算y值
    const clickedElementRect = getXYFromTransform(props.currentClickedElement?.cfg)
    const yPosition = clickedElementRect.y

    // 2.计算x值
    let minX = clickedElementRect.x
    let maxX = clickedElementRect.x + clickedElementRect.width
    const lLineArr = [...topArr, props.currentClickedElement?.cfg]
    if (lLineArr.length > 0) {
      // 获取每个对象的matrix值
      for (let i = 0; i < lLineArr.length; i++) {
        const rect = getXYFromTransform(lLineArr[i])
        minX = Math.min(minX, rect.x)
        maxX = Math.max(maxX, rect.x + rect.width)
      }
    }
    attachedLineData.value.t.x1 = minX
    attachedLineData.value.t.y1 = yPosition
    attachedLineData.value.t.x2 = maxX
    attachedLineData.value.t.y2 = yPosition
  }
  else {
    // 将线条位置置为0
    for (const key in attachedLineData.value.l)
      attachedLineData.value.t[key] = 0
  }
}
</script>

<template>
  <svg v-show="props.currentClickedElement" id="boundsSVGContainer" class="pointer-events-none w-screen h-screen fixed top-0 left-0">
    <!-- bounds -->
    <g>
      <rect
        :style="{ opacity: 1, transform: props.currentClickedElement?.cfg.transform }"
        :x="props.currentClickedElement?.cfg.x"
        :y="props.currentClickedElement?.cfg.y"
        :width="props.currentClickedElement?.cfg.width"
        :height="props.currentClickedElement?.cfg.height"
        fill="#2f80ed40"
        stroke="#2f80ed"
        stroke-width="3px"
      />
    </g>
    <!-- 缩放四边 line -->
    <g class="pointer-events-auto">
      <rect
        v-for="(item) in rectLineData"
        :id="`bounds_${item.name}`"
        :key="item.name"
        :style="{ opacity: 1, cursor: item.style.cursor, transform: item.style.transform }"
        :x="item.bounds.x"
        :y="item.bounds.y"
        :width="item.bounds.width"
        :height="item.bounds.height"
        fill="transparent"
        stroke="transparent"
        stroke-width="2px"
      />
    </g>

    <!-- 缩放四角 -->
    <g class="pointer-events-auto">
      <rect
        v-for="(item) in rectCornerScaleData"
        :id="`bounds_${item.name}`"
        :key="item.name"
        :style="{ opacity: 1, cursor: item.style.cursor, transform: item.style.transform }"
        :rx="3"
        :ry="3"
        :x="item.bounds.x"
        :y="item.bounds.y"
        :width="item.bounds.width"
        :height="item.bounds.height"
        fill="white"
        stroke="#2f80ed"
        stroke-width="2"
      />
    </g>
    <!-- 旋转四角 -->

    <!-- 吸附线 -->
    <g class="pointer-events-auto">
      <line
        v-for="(item, index) in Object.values(attachedLineData)"
        :key="item.name + index"
        :x1="item.x1"
        :y1="item.y1"
        :x2="item.x2 "
        :y2="item.y2 "
        stroke="#58815790"
        fill="#58815790"
        stroke-width="2"
      />
    </g>

  </svg>
</template>
