<template>
  <div class="loader-bar">
    <div class="block-border" />
    <div class="block-border" />
    <div class="block-border" />
    <div class="block-border" />
    <div class="block-border" />
    <div class="block-border" />
    <div class="block-border" />
    <div class="block-border" />
  </div>
</template>

<style scoped>
.loader-bar {
  width: 60vw;
  height: 12vw;
  display: grid;
  grid-template-columns: repeat(3,2vw) repeat(10, 3vw 2vw) repeat(2,2vw);
  grid-template-rows: repeat(6,2vw);
}

.block-border {
  background-color: rgb(50,50,50);
}

.block-meter {
  background-color: rgb(100,200,100);
}

.block-border:nth-of-type(1) {
  grid-row: 1;
  grid-column: 3/-3;
}

.block-border:nth-of-type(2) {
  grid-row: -2;
  grid-column: 3/-3;
}

.block-border:nth-of-type(3) {
  grid-row: 3/5;
  grid-column: 1;
}

.block-border:nth-of-type(4) {
  grid-row: 3/5;
  grid-column: -2;
}

.block-border:nth-of-type(5) {
  grid-row: 2;
  grid-column: 2;
}

.block-border:nth-of-type(6) {
  grid-row: 2;
  grid-column: -3;
}

.block-border:nth-of-type(7) {
  grid-row: 5;
  grid-column: 2;
}

.block-border:nth-of-type(8) {
  grid-row: 5;
  grid-column: -3;
}
</style>
