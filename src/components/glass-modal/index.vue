<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: 'Title',
    required: false,
  },
  // modelValue: {
  //   type: Boolean,
  //   default: false,
  // },
})

// const emits = defineEmits(
//   [
//     'update:modelValue',
//   ],
// )

// const visible = computed({
//   get() {
//     return props.modelValue
//   },
//   set(value) {
//     emits('update:modelValue', value)
//   },
// })

const visible = ref(false)
function close() {
  const animateDom = document.querySelectorAll('.glass-modal-mask')[0] as HTMLElement
  animateDom.classList.add('fade-out')

  const animateOutDom1 = document.querySelectorAll('.glass-modal')[0] as HTMLElement
  animateOutDom1.classList.remove('scale-up-center')
  animateOutDom1.classList.add('scale-down-center')

  setTimeout(() => {
    visible.value = false
  }, 300)

  // visible.value = false
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
  <Teleport to="body">
    <div v-if="visible" class="glass-modal-mask">
      <div class="glass-modal scale-up-center">
        <div class="modal-box">
          <div class="modal-header">
            <span class="font-medium">
              {{ props.title }}
            </span>
            <div
              class="
                cursor-pointer
               text-blue-600 hover:bg-blue-400 hover:text-white
                rounded-full
               "
            >
              <div i-carbon-close @click="close" />
            </div>
          </div>
          <div class="modal-content">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.glass-modal-mask{
  @apply flex justify-center items-center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  box-shadow: 0 0 1px 1px #ffffff, 0 1px 5px 0px #ffffff;
  padding: 12px;
  z-index: 99;
}
.glass-modal{
  min-height: 300px;
  width: 500px;
  height: auto;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(40px);
  box-shadow: 0 0 1px 1px #ffffff, 0 1px 5px 0px #ffffff;
  padding: 12px;
  z-index: 100;
}
.modal-box{
  width: 100%;
  height: 100%;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 1);
  backdrop-filter: blur(2px);
  z-index: 100;
  padding-top: 10px;
}
.modal-header{
  @apply flex flex-row justify-between items-center;
  height: 40px;
  border-bottom: 1px solid #f4f4f4;
  padding: 0 20px;
  font-size: 20px;
}
.modal-content{
  height: calc(100% - 40px);
  padding: 20px;
}

.scale-up-center{
  animation:scale-up-center 0.2s;
}
@keyframes scale-up-center{
  0%{
    transform:scale(.5)
  }
  100%{
    transform:scale(1)
  }
}

.scale-down-center{
  animation:scale-down-center 0.2s forwards;
}
@keyframes scale-down-center{
  0%{
    transform:scale(1);
  }
  100%{
    transform:scale(.5);
  }
}

.fade-out{
  animation-name: fade-out;
  animation-duration: 0.2s;
  animation-fill-mode: forwards; /* 动画结束后停留在最终状态 */
}
@keyframes fade-out{
  0%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}
</style>
