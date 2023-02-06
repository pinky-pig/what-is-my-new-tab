<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'

const noteDragBarRef = ref<HTMLElement | null>(null)
const { x, y } = useDraggable(noteDragBarRef, {
  initialValue: { x: 40, y: 400 },
})
const notesStyleOption = ref({
  // width: '300px',
  // height: '200px',
  background: '#FEDD9D',
  // background: 'linear-gradient(#F9EEAD,#F7E98E)',
  borderRadius: '10px',
})
const notesContentStyle = ref({
  maxWidth: '500px',
  maxHeight: '500px',
})
const notesContent = ref(
  '你好你好',
)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const isReadonly = ref(true)

// 设置可编辑模式
function handleEditContent() {
  isReadonly.value = !isReadonly.value
  if (textareaRef.value && !isReadonly.value)
    textareaRef?.value?.focus()
}
// 设置不可编辑模式
// onClickOutside(textareaRef, (e) => {
//   isReadonly.value = true
// })
const isShowNote = ref(true)
function handleCloseNotes() {
  isShowNote.value = false
}
</script>

<template>
  <div
    v-show="isShowNote"
    :style="{ ...notesStyleOption, left: `${x}px`, top: `${y}px` }"
    class="p-2 bg-blue-300 cursor-pointer z-10 fixed"
  >
    <!-- title -->
    <div ref="noteDragBarRef" class="h-35px flex flex-row justify-between border-b border-#EEC780">
      <div class="text-#A56B0E text-20px font-bold ml-4 mr-4">
        Note
      </div>
      <div class="flex flex-row ">
        <div class="w-90px h-25px rounded-2xl px-15px flex flex-row justify-between items-center bg-#EEC780 text-#A56B0E" @click="handleEditContent">
          <div v-show="isReadonly">
            编辑
          </div>
          <div v-show="isReadonly" i-carbon:edit />

          <div v-show="!isReadonly" class="text-#b0aaaa">
            完成
          </div>
          <div v-show="!isReadonly" i-carbon:checkmark-filled />
        </div>
        <div class="text-26px text-#A56B0E" i-carbon:close @click="handleCloseNotes" />
      </div>
    </div>

    <!-- body -->
    <div class="mt-10px flex flex-row justify-start items-center">
      <textarea ref="textareaRef" v-model="notesContent" :readonly="isReadonly" :style="notesContentStyle" />
    </div>
  </div>
</template>

<style scoped>
textarea {
  font:20px 'Gloria Hallelujah', cursive;
  line-height:1.5;
  border:0;
  border-radius:3px;
  background: transparent;
  /* background: linear-gradient(#F9EFAF, #F7E98D); */
  /* box-shadow:0 4px 6px rgba(0,0,0,0.1); */
  overflow:hidden;
  transition:box-shadow 0.5s ease;
  font-smooth:subpixel-antialiased;
  min-width: 235px;
  min-height: 50px;
  outline: none;
  resize: both !important;
}

textarea:hover { box-shadow:0 5px 8px rgba(0,0,0,0.15); }
textarea:focus { box-shadow:0 5px 12px rgba(0,0,0,0.2); outline:none; }
</style>
