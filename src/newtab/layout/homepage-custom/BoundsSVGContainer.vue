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
</script>

<template>
  <svg v-show="props.currentClickedElement" id="boundsSVGContainer" class="w-screen h-screen fixed top-0 left-0">
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
    <g>
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
    <g>
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
        stroke-width="2px"
      />
    </g>
    <!-- 旋转四角 -->

  </svg>
</template>
