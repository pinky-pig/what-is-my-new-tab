<script setup lang="ts">
import * as THREE from 'three'
import rainFrag from './shaders/rain.frag?raw'

const settings = { fps: 30, parallaxVal: 1 }
let scene: any, camera: any, renderer: any, material: any
let videoElement: any
let clock = new THREE.Clock()

async function init() {
  const container = document.getElementById('container')
  renderer = new THREE.WebGLRenderer({
    antialias: false,
  })
  renderer.setSize(window.innerWidth, window.innerHeight, 2)
  container!.appendChild(renderer.domElement)
  scene = new THREE.Scene()
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  material = new THREE.ShaderMaterial({
    uniforms: {
      u_tex0: { type: 't' },
      u_time: { value: 0, type: 'f' },
      u_intensity: { value: 0.4, type: 'f' },
      u_speed: { value: 0.25, type: 'f' },
      u_brightness: { value: 0.8, type: 'f' },
      u_normal: { value: 0.5, type: 'f' },
      u_zoom: { value: 2.61, type: 'f' },
      u_blur_intensity: { value: 0.5, type: 'f' },
      u_blur_iterations: { value: 16, type: 'i' },
      u_panning: { value: false, type: 'b' },
      u_post_processing: { value: true, type: 'b' },
      u_lightning: { value: false, type: 'b' },
      u_texture_fill: { value: true, type: 'b' },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight), type: 'v2' },
      u_tex0_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight), type: 'v2' },
    },
    vertexShader: `
          varying vec2 vUv;        
          void main() {
              vUv = uv;
              gl_Position = vec4( position, 1.0 );    
          }
        `,
  })
  material.fragmentShader = rainFrag

  new THREE.TextureLoader().load('/assets/image.jpg', (tex: any) => {
    material.uniforms.u_tex0_resolution.value = new THREE.Vector2(tex.image.width, tex.image.height)
    material.uniforms.u_tex0.value = tex
  })

  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 1, 1), material)
  scene.add(quad)
}

function render() {
  setTimeout(() => {
    requestAnimationFrame(render)
  }, 1000 / settings.fps)

  // reset every 6hr
  if (clock.getElapsedTime() > 21600)
    clock = new THREE.Clock()
  material.uniforms.u_time.value = clock.getElapsedTime()

  renderer.render(scene, camera)
}

onMounted(() => {
  init()
  render()

  window.addEventListener('resize', (_e) => {
    renderer.setSize(window.innerWidth, window.innerHeight, 2)
    material.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight)
  })
})

const rainSettings = reactive({
  intensityValue: 0.4,
  speedValue: 0.4,
  brightnessValue: 0.8,
  normalValue: 0.5,
  zoomValue: 2.61,
  lightningValue: false,
})
watch(rainSettings, () => {
  material.uniforms.u_intensity.value = rainSettings.intensityValue
  material.uniforms.u_speed.value = rainSettings.speedValue
  material.uniforms.u_brightness.value = rainSettings.brightnessValue
  material.uniforms.u_normal.value = rainSettings.normalValue
  material.uniforms.u_zoom.value = rainSettings.zoomValue
  material.uniforms.u_lightning.value = rainSettings.lightningValue
})

const backgroundSettings = reactive({
  blurQualityValue: 16,
  blurValue: 0.5,
  parallaxValue: 1,
  scaleToFillValue: true,
  panningValue: false,
  postProcessingValue: true,
})
watch(backgroundSettings, () => {

})

function changeBackground() {
  document.getElementById('filePicker')!.addEventListener('change', function () {
    if ((this as any).files[0] === undefined)
      return
    const file = (this as any).files[0]
    if (file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png') {
      disposeVideoElement(videoElement)
      material.uniforms.u_tex0.value?.dispose()

      new THREE.TextureLoader().load(URL.createObjectURL(file), (tex: any) => {
        material.uniforms.u_tex0.value = tex
        material.uniforms.u_tex0_resolution.value = new THREE.Vector2(tex.image.width, tex.image.height)
      })
    }
    else if (file.type === 'video/mp4' || file.type === 'video/webm') {
      disposeVideoElement(videoElement)
      material.uniforms.u_tex0.value?.dispose()

      videoElement = createVideoElement(URL.createObjectURL(file))
      const videoTexture = new THREE.VideoTexture(videoElement)
      videoElement.addEventListener(
        'loadedmetadata',
        (e: any) => {
          material.uniforms.u_tex0_resolution.value = new THREE.Vector2(
            videoTexture.image.videoWidth,
            videoTexture.image.videoHeight,
          )
        },
        false,
      )
      material.uniforms.u_tex0.value = videoTexture
    }
  })

  document.getElementById('filePicker')!.click()
}

function createVideoElement(src: any) {
  const htmlVideo = document.createElement('video')
  htmlVideo.src = src
  htmlVideo.muted = true
  htmlVideo.loop = true
  htmlVideo.play()
  return htmlVideo
}
function disposeVideoElement(video: any) {
  if (video != null && video.hasAttribute('src')) {
    video.pause()
    video.removeAttribute('src') // empty source
    video.load()
  }
}
</script>

<template>
  <div>
    <div id="container" />
    <input id="filePicker" type="file" accept=".jpg, .jpeg, .png, .mp4, .webm" style="visibility: hidden">
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
#container {
  position: absolute;
  transform: scale(1.09);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

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
