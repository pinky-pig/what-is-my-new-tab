<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  rainSettings: {
    default: {
      intensityValue: 0.4,
      speedValue: 0.25,
      brightnessValue: 0.8,
      normalValue: 0.5,
      zoomValue: 2.61,
      lightningValue: false,
    },
    required: true,
  },
  backgroundSettings: {
    default: {
      blurQualityValue: 16,
      blurValue: 0.5,
      parallaxValue: 1,
      scaleToFillValue: true,
      panningValue: false,
      postProcessingValue: true,
    },
    required: true,
  },
  renderSettings: {
    default: {
      fps: 30,
    },
    required: true,
  },
})

const emits = defineEmits(
  [
    'update:rainSettings',
    'update:backgroundSettings',
    'update:renderSettings',
    'changeBackground',
  ],
)

const rainSettings = computed({
  get() {
    return props.rainSettings
  },
  set(value) {
    emits('update:rainSettings', value)
  },
})
const backgroundSettings = computed({
  get() {
    return props.backgroundSettings
  },
  set(value) {
    emits('update:backgroundSettings', value)
  },
})

const renderSettings = computed({
  get() {
    return props.renderSettings
  },
  set(value) {
    emits('update:renderSettings', value)
  },
})

function changeBackground() {
  emits('changeBackground')
}

interface Setting {
  label: string
  icon: string
  background: string
  children: {
    label: string
    value: string
    type: 'range' | 'checkbox' | 'button'
    steps?: number
    min?: number
    max?: number
  }[]
}
const settingList = ref<Setting[]>([
  {
    label: '雨滴',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M16 24v-2a3.296 3.296 0 0 0 3-3h2a5.267 5.267 0 0 1-5 5Z"/><path fill="currentColor" d="M16 28a9.011 9.011 0 0 1-9-9a9.984 9.984 0 0 1 1.494-4.955l6.659-10.608a1.04 1.04 0 0 1 1.694 0l6.63 10.556A10.063 10.063 0 0 1 25 19a9.011 9.011 0 0 1-9 9Zm0-22.152l-5.782 9.208A7.977 7.977 0 0 0 9 19a7 7 0 0 0 14 0a8.062 8.062 0 0 0-1.248-3.995Z"/></svg>',
    background: '#5464931f',
    children: [
      { label: '强度', value: 'intensityValue', type: 'range', steps: 0.01, min: 0, max: 1 },
      { label: '速度', value: 'speedValue', type: 'range', steps: 0.01, min: 0, max: 1 },
      { label: '亮度', value: 'brightnessValue', type: 'range', steps: 0.01, min: 0, max: 1 },
      { label: '一般', value: 'normalValue', type: 'range', steps: 0.01, min: 0, max: 1 },
      { label: '缩放', value: 'zoomValue', type: 'range', steps: 0.01, min: 0, max: 3 },
      { label: '闪电', value: 'lightningValue', type: 'checkbox' },
    ],
  },
  {
    label: '背景',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 32 32"><path fill="currentColor" d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3Zm0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1Z"/><path fill="currentColor" d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z"/></svg>',
    background: '#3641561f',
    children: [
      { label: '模糊质量', value: 'blurQualityValue', type: 'range', steps: 1, min: 1, max: 64 },
      { label: '模糊程度', value: 'blurValue', type: 'range', steps: 0.2, min: 0, max: 10 },
      // { label: '视差', value: 'parallaxValue', type: 'range', steps: 1, min: 0, max: 5 },
      { label: '缩放', value: 'scaleToFillValue', type: 'checkbox' },
      { label: '平移', value: 'panningValue', type: 'checkbox' },
      { label: '滤镜', value: 'postProcessingValue', type: 'checkbox' },

      { label: '自定义背景', value: 'changeBackground', type: 'button' },
    ],
  },
  {
    label: '渲染',
    background: '#0B24471f',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12.03 6.3h-.06l-1.02 2.89h2.1zM3 17h2v5H3z"/><path fill="currentColor" d="M12 15c3.31 0 6-2.69 6-6s-2.69-6-6-6s-6 2.69-6 6s2.69 6 6 6zm-.63-10h1.25l2.63 7h-1.21l-.63-1.79h-2.83L9.96 12H8.74l2.63-7zM7 17h2v5H7zm4 0h2v5h-2zm4 0h6v5h-6z"/></svg>',
    children: [
      { label: 'FPS', value: 'fps', type: 'range', steps: 15, min: 15, max: 120 },
    ],
  },
])

// 当前的选项卡
const currentItem = ref<Setting | null>()
// 当前的选项卡的背景颜色
const currentItemBgRef = ref<HTMLElement>()
// 选中当前选项卡
function handleActiveTab(item: Setting, index: number) {
  const animateDom = document.querySelectorAll('.animate-dom')[0] as HTMLElement
  animateDom.classList.remove('animate-jello')
  currentItem.value = item
  currentItemBgRef.value!.style.transform = `translateX(${(document.querySelectorAll('.tab-item')[index] as HTMLElement).offsetLeft}px)`
  animateDom.classList.add('animate-jello')

  nextTick(() => {
    const computedStyle = getComputedStyle((document.querySelector('.tab-panel-dom') as HTMLElement), null)

    if (document.querySelector('.tab-panel-dom')?.scrollHeight === parseInt(computedStyle.paddingTop) + parseInt(computedStyle.paddingBottom)) {
      (document.querySelector('.tab-panel') as HTMLElement).style.height = '0';
      (document.querySelector('.tab-panel') as HTMLElement).style.marginBottom = '0';
      (document.querySelector('.tab-panel') as HTMLElement).style.marginTop = '0'
    }
    else {
      (document.querySelector('.tab-panel') as HTMLElement).style.height = `${document.querySelector('.tab-panel-dom')?.scrollHeight}px`;
      (document.querySelector('.tab-panel') as HTMLElement).style.marginBottom = '10px';
      (document.querySelector('.tab-panel') as HTMLElement).style.marginTop = '5px'
    }
  })
}

const target = ref(null)
onClickOutside(target, (event) => {
  currentItem.value = null;
  (document.querySelector('.tab-panel') as HTMLElement).style.height = '0';
  (document.querySelector('.tab-panel') as HTMLElement).style.marginBottom = '0';
  (document.querySelector('.tab-panel') as HTMLElement).style.marginTop = '0'
})

const visible = ref(false)
function close() {
  const animateDom = document.querySelector('.setting-modal') as HTMLElement
  animateDom.classList.add('scale-down-center')

  setTimeout(() => {
    visible.value = false
  }, 600)
}

function open() {
  visible.value = true
}

defineExpose({
  visible,
  close,
  open,
})
</script>

<template>
  <div v-if="visible" class=" absolute bottom-50px flex justify-center items-center w-full ">
    <!-- <Teleport to="#mainTest"> -->
    <div
      ref="target"
      :style="{ background: currentItem?.background }"
      class="setting-modal animate-jello flex flex-col "
    >
      <div
        class="
          tab-panel
          w-full h-0 overflow-hidden
          transition-all
          duration-500
          ease-in-out"
      >
        <div class="tab-panel-dom">
          <div
            v-for="item in currentItem?.children"
            :key="item.label"
            class=" w-full relative my-10px"
          >
            <div v-if="item.type === 'range'">
              <div class=" flex flex-row justify-between px-2">
                {{ item.label }}
                <input v-if="currentItem?.label === '雨滴'" v-model="rainSettings[item.value] " class="slider-number w-45px h-25px text-center text-10px rounded-md" type="text">
                <input v-if="currentItem?.label === '背景'" v-model="backgroundSettings[item.value] " class="slider-number w-45px h-25px text-center text-10px rounded-md" type="text">
                <input v-if="currentItem?.label === '渲染'" v-model="renderSettings[item.value] " class="slider-number w-45px h-25px text-center text-10px rounded-md" type="text">
              </div>

              <input v-if="currentItem?.label === '雨滴'" v-model="rainSettings[item.value]" style="width:calc(100% - 20px)" class="slider-bar rounded-md my-10px " :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
              <input v-if="currentItem?.label === '背景'" v-model="backgroundSettings[item.value]" style="width:calc(100% - 20px)" class="slider-bar rounded-md my-10px " :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
              <input v-if="currentItem?.label === '渲染'" v-model="renderSettings[item.value]" style="width:calc(100% - 20px)" class="slider-bar rounded-md my-10px " :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
            </div>
            <div v-if="item.type === 'checkbox'" class=" flex flex-row justify-between px-2">
              <span>
                {{ item.label }}
              </span>
              <input v-if="currentItem?.label === '雨滴'" v-model="rainSettings[item.value]" :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
              <input v-if="currentItem?.label === '背景'" v-model="backgroundSettings[item.value]" :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
              <input v-if="currentItem?.label === '渲染'" v-model="renderSettings[item.value]" :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
            </div>

            <div v-if="item.type === 'button'" class=" flex flex-row justify-between px-2">
              <div>
                {{ item.label }}
              </div>
              <button
                class="px-4 py-1 rounded inline-block bg-[rgba(0,0,0,0.1)] text-white cursor-pointer hover:bg-[rgba(0,0,0,0.5)] disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50"
                @click="changeBackground"
              >
                上传
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- tab -->
      <div class=" flex flex-row w-full justify-between relative">
        <div
          v-for="item, index in settingList"
          :key="item.label"
          :style="{ color: currentItem?.label === item.label ? currentItem?.background.slice(0, 7) : 'white' }"
          :class="currentItem?.label === item.label ? 'text-blue-400' : 'text-white'"
          class="tab-item w-50px h-36px grid place-items-center cursor-pointer relative z-1"
          @click="handleActiveTab(item, index)"
        >
          <div v-html="item.icon" />
        </div>

        <!-- tab-bg -->
        <div
          v-show="currentItem"
          ref="currentItemBgRef"
          class="
              w-50px h-36px
              absolute top-0 left-0 z-0
              pointer-events-none
              transition-transform
              duration-300
              ease-in-out
            "
        >
          <div class="animate-dom animate-jello w-full h-full rounded-xl">
              &nbsp;
          </div>
        </div>
      </div>
    </div>
    <!-- </Teleport> -->
  </div>
</template>

<style scoped>
.setting-modal{
  height: fit-content;
  max-width: calc(100% - 200px);
  min-width: 100px;
  width: 400px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  border: 2px solid transparent;
  transition: 0.2s ease-in-out all;
  z-index: 10;
  padding: 10px;
  color: white;
  /* box-shadow: rgb(255, 255, 255) 0px 0px 1px 1px, rgb(255, 255, 255) 0px 1px 5px 0px; */
}
.tab-panel {
  border-radius: 10px;
  background-color: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
}
.tab-panel-dom{
  padding: 5px;
}
.animate-dom{
  background-color: white;
  /* background-color: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px); */
}
.animate-jello {
  animation: jello-horizontal 0.9s both;
}
@keyframes jello-horizontal{
  0% {
    transform: scale3d(1, 1, 1);
  }
  30% {
    transform: scale3d(1.25, 0.75, 1);
  }
  40% {
    transform: scale3d(0.75, 1.25, 1);
  }
  50% {
    transform: scale3d(1.15, 0.85, 1);
  }
  65% {
    transform: scale3d(0.95, 1.05, 1);
  }
  75% {
    transform: scale3d(1.05, 0.95, 1);
  }
  100% {
    transform: scale3d(1, 1, 1);
  }
}

.scale-down-center{
  animation:scale-down-center 0.5s forwards;
}
@keyframes scale-down-center{
  0%{
    transform-origin: bottom center;
    transform:scale(1);
  }
  100%{
    transform-origin: bottom center;
    transform:scale(0);
  }
}

.slider-number{
  background-color: rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
}
input{
  outline: none;
}
.slider-bar{
  @apply dark:bg-[#e5e7eb];
  margin: auto;
  width: 100%;
  background: #C2C5C7;
  outline: none;
  -webkit-appearance: none;
  /*清除系统默认样式*/
  height: 3px;
  /*横条的高度*/
}
input[type="range"]::-webkit-slider-thumb {
  @apply dark:bg-[#e5e7eb];
  width: 15px;
  height: 15px;
  border-radius: 50%;
  outline: 5px solid #C2C5C790;
  background-color: #ececec;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3),
    0 3px 5px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  -webkit-appearance: none;
  border: 0;
}
</style>
