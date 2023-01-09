<script setup lang="ts">
import { palettes } from '~/types/index'

function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // 含最大值，含最小值
}
// 设置画布大小 x,y,width,height
const canvasBound = [0, 0, 100, 100]

// 渲染几个多边形（这里只有一个）
const polygonList = new Array(getRandomIntInclusive(1, 1)).fill([])

// 遍历每个多边形
const polygonPathList = polygonList.map((item) => {
  // 1.首先获取每个多边形随机的边数
  const num = new Array(getRandomIntInclusive(1, 10)).fill([])

  // 2.然后计算每个角的坐标

  const coordinates = num.map((it) => {
    //  获取x坐标
    const x = getRandomIntInclusive(canvasBound[0], canvasBound[2])
    //  获取y坐标
    const y = getRandomIntInclusive(canvasBound[1], canvasBound[3])

    return [`${x}%`, `${y}%`]
  })

  // 3.根据得到的坐标，生成clip-path字符串,n条边即是n个角,n个坐标,坐标范围要在画布最大最小的范围内
  let clipPathStr = ''
  coordinates.forEach((i) => {
    const str = `${i[0]} ${i[1]},`
    clipPathStr += str
  })

  return `polygon(${clipPathStr.slice(0, clipPathStr.length - 1)})`
})

const polygonColor = palettes[getRandomIntInclusive(0, palettes.length - 1)]
</script>

<template>
  <div v-for="item, index in polygonPathList" :key="index" class="polygonPath w-full h-full">
    <div class="w-full h-full" :style="{ clipPath: item, background: polygonColor[1] }" />
  </div>
</template>

<style scoped>
.polygonPath{
  /* filter: blur(4rem); */
}
</style>
