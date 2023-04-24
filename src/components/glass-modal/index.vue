<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Title',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(
  [
    'update:modelValue',
  ],
)

const visible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
function close() {
  visible.value = false
}

defineExpose({
  close,
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="glass-modal-mask">
      <div class="glass-modal">
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
            <slot name="content" />
            modal
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.glass-modal-mask{
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 300px;
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
  padding-bottom: 10px;
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
</style>
