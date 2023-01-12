<template>
  <div class="gradient-bg">
    <div class="gradient-top" />
    <div class="gradient-bottom" />
  </div>
</template>

<style  scoped>
.gradient-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.gradient-top {
  position: absolute;
  width: 100vh;
  height: 100vh;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(4rem);
  background-color: hsl(241, 99%, 70%);
  top: -50%;
  right: -20%;
}

.gradient-bottom {
  position: absolute;
  width: 100vh;
  height: 100vh;
  border-radius: 50%;
  opacity: 0.2;
  filter: blur(4rem);
  background-color: hsl(186, 84%, 74%);
  bottom: -50%;
  left: -20%;
}
</style>
