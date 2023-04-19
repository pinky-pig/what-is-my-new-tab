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
</script>

<template>
  <div>
    <Teleport to="body">
      <div class="setting-modal flex flex-col ">
        Rain:
        <div>Intensity</div>
        <input v-model="rainSettings.intensityValue" class="rangeMain " type="range" :step="0.01" :min="0" :max="1" name="Intensity">
        <div>Speed</div>
        <input v-model="rainSettings.speedValue" class="rangeMain " type="range" :step="0.01" :min="0" :max="1" name="Speed">
        <div>Brightness</div>
        <input v-model="rainSettings.brightnessValue" class="rangeMain " type="range" :step="0.01" :min="0" :max="1" name="Brightness">
        <div>Normal</div>
        <input v-model="rainSettings.normalValue" class="rangeMain " type="range" :step="0.01" :min="0" :max="1" name="Normal">
        <div>Zoom</div>
        <input v-model="rainSettings.zoomValue" class="rangeMain " type="range" :step="0.01" :min="0" :max="3" name="Zoom">
        <div>Lightning</div>
        <input v-model="rainSettings.lightningValue" class="rangeMain " type="checkbox" name="Lightning">
        Background:

        <button class="btn" @click="changeBackground">
          更改背景
        </button>
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
  padding: 20px;
  color: white;
}
</style>
