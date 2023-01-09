<script lang="ts" setup>
import { StickyNoteColorStyle } from '~/types/index'
</script>

<template>
  <div
    :style="{ background: StickyNoteColorStyle.backgroundColor }"
    class=" w-400px h-200px rounded-xl shadow-md"
  >
    <!-- title -->
    <div class="text-xl tracking-widest h-10 w-full border-[#eb951799] border-b flex justify-center items-center">
      Year Progress
    </div>
    <!-- body -->
    <div class=" w-full h-full">
      <slot />
    </div>
  </div>
</template>
