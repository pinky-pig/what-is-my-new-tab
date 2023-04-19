<script setup lang="ts">
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
})

const emits = defineEmits(
  [
    'update:rainSettings',
    'update:backgroundSettings',
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

function changeBackground() {
  emits('changeBackground')
}

interface Setting {
  label: string
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
    children: [
      { label: '上传背景', value: 'changeBackground', type: 'button' },
    ],
  },
  {
    label: '渲染',
    children: [
    ],
  },
])

// 当前的选项卡
const currentItem = ref()
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
      (document.querySelector('.tab-panel') as HTMLElement).style.marginBottom = '0'
    }
    else {
      (document.querySelector('.tab-panel') as HTMLElement).style.height = `${document.querySelector('.tab-panel-dom')?.scrollHeight}px`;
      (document.querySelector('.tab-panel') as HTMLElement).style.marginBottom = '10px'
    }
  })
}
</script>

<template>
  <div>
    <Teleport to="body">
      <div class="setting-modal flex flex-col ">
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
              <div v-if="item.type === 'range'" class=" flex flex-row justify-between ">
                <div>
                  {{ item.label }}
                </div>
                <input v-model="rainSettings[item.value]" class="rounded-md" :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
                <input class="w-38px h-20px text-center text-10px bg-gray-500 rounded-md" type="text">
              </div>
              <div v-if="item.type === 'checkbox'" class=" flex flex-row justify-between ">
                <span>
                  {{ item.label }}
                </span>
                <input v-model="rainSettings[item.value]" :type="item.type" :step="item.steps" :min="item.min" :max="item.max">
              </div>
              <div v-if="item.type === 'button'" class=" flex flex-row justify-between ">
                <div>
                  {{ item.label }}
                </div>
                <button class="btn" @click="changeBackground">
                  更改
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
            class="tab-item w-60px h-45px grid place-items-center cursor-pointer relative z-1"
            @click="handleActiveTab(item, index)"
          >
            {{ item.label }}
          </div>

          <!-- tab-bg -->
          <div
            v-show="currentItem"
            ref="currentItemBgRef"
            class="
              w-60px h-45px
              absolute top-0 left-0 z-0
              pointer-events-none
              transition-transform
              duration-300
              ease-in-out
            "
          >
            <div class="animate-dom animate-jello  w-full h-full rounded-xl">
              &nbsp;
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.setting-modal{
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  height: fit-content;
  max-width: calc(100% - 200px);
  min-width: 100px;
  width: 400px;
  border-radius: 20px;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(20px);
  border: 2px solid transparent;
  transition: 0.2s ease-in-out all;
  z-index: 10;
  padding: 10px 20px;
  color: white;
}
.tab-panel {
  border-radius: 10px;
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(20px);
}
.tab-panel-dom{
  padding: 10px;
}
.animate-dom{
  background-color: rgba(0,0,0,0.1);
  backdrop-filter: blur(20px);
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

input{
  outline: none;
}
</style>
