<script setup lang="ts">
const props = defineProps(['currentClickedElement'])

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
    },
  },
])

const rectCornerScaleData = ref([
  {
    name: 'corner_left_top_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nwse-resize',
    },
  },
  {
    name: 'corner_right_top_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x + props.currentClickedElement?.cfg?.width - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nesw-resize',
    },
  },
  {
    name: 'corner_left_bottom_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y + props.currentClickedElement?.cfg?.height - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nesw-resize',
    },
  },
  {
    name: 'corner_right_bottom_scale',
    bounds: {
      x: computed(() => (props.currentClickedElement?.cfg?.x + props.currentClickedElement?.cfg?.width - borderWidth / 2) || 0),
      y: computed(() => (props.currentClickedElement?.cfg?.y + props.currentClickedElement?.cfg?.height - borderWidth / 2) || 0),
      width: 10,
      height: 10,
    },
    style: {
      cursor: 'nwse-resize',
    },
  },
])
</script>

<template>
  <svg v-show="props.currentClickedElement" id="boundsSVGContainer" class="w-screen h-screen fixed top-0 left-0">
    <!-- 缩放四边 line -->
    <g>
      <rect
        v-for="(item) in rectLineData"
        :id="`bounds_${item.name}`"
        :key="item.name"
        :style="{ opacity: 1, cursor: item.style.cursor }"
        :x="item.bounds.x"
        :y="item.bounds.y"
        :width="item.bounds.width"
        :height="item.bounds.height"
        fill="transparent"
        stroke="#2f80ed"
        stroke-width="2px"
      />
    </g>
    <!-- 缩放四角 -->
    <g>
      <rect
        v-for="(item) in rectCornerScaleData"
        :id="`bounds_${item.name}`"
        :key="item.name"
        :style="{ opacity: 1, cursor: item.style.cursor }"
        :x="item.bounds.x"
        :y="item.bounds.y"
        :width="item.bounds.width"
        :height="item.bounds.height"
        fill="white"
        stroke="#2f80ed"
        stroke-width="2px"
      />
    </g>
    <!-- 旋转四角 -->

  </svg>
</template>
