<script setup lang="ts">

</script>

<template>
  <div class="setting-modal flex flex-col">
    <div>rain</div>
    <input class="rangeMain " type="range" name="volume">

    <div>background</div>
    <input class="rangeMain " type="range" name="volume">

    <div>performance</div>
    <input class="rangeMain " type="range" name="volume">
  </div>
</template>

<style scoped>
.setting-modal{
  position: absolute;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  height: 200px;
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
