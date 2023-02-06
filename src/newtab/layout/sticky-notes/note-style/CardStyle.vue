<script setup lang="ts">

</script>

<template>
  <div class="wrapper clearfix">
    <aside class="note-wrap note-yellow">
      <p>
        Driving along on the plastic dream,
        Heart beats fast like a tiny machine
      </p>
      <a href="http://youtu.be/vFYaFT0q6Uw">The Mighty Boosh</a>
    </aside>
    <aside class="note-wrap note-blue">
      <p>So we back in the mine, got our pick axe swinging from side to side</p>
      <a href="http://youtu.be/cPJUBQd-PNM">CaptainSparklez</a>
    </aside>
    <aside class="note-wrap note-pink">
      <p>Ice skating and shit in NORWAY</p>
      <a href="http://youtu.be/EF1V8HFfpTE">apetor</a>
    </aside>
    <aside class="note-wrap note-green">
      <p>
        One pill makes you larger,
        And one pill makes you small
      </p>
      <a href="http://youtu.be/i2LhAeFutxk">Jefferson Airplane</a>
    </aside>
  </div>
</template>

<style scoped>
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

::-moz-selection {
  background: #C6FF91;
  text-shadow: none;
}

::selection {
  background: #C6FF91;
  text-shadow: none;
}

.clearfix:before,
.clearfix:after {
  content: " ";
  display: table;
}

.clearfix:after {
  clear: both;
}

.clearfix {
  *zoom: 1;
}

body {
  background: url(https://i.imgur.com/2BdQt0g.jpg);
  margin: 0;
  padding: 0;
}

.wrapper {
  margin: 60px auto 0 auto;
}

/* Note styles */
.note-wrap {
  width: 235px;
  min-height: 235px;
  padding: 35px;
  margin: 0 22px 44px 22px;
  position: relative;
  font-size: 24px;
  vertical-align: top;
  display: inline-block;
  font-family: Englebert, Arial;
  color: #4b453c;
  background: #F7E999;
  line-height: 34px;
  text-align: center;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.2);
}

.note-wrap::before {
  display: block;
  content: "";
  background: rgba(227, 200, 114, 0.40);
  width: 130px;
  height: 28px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  border-radius: 6px/18px 0;
  position: absolute;
  top: -13px;
  left: 50px;
  -webkit-transform: rotate(-2deg);
  -moz-transform: rotate(-2deg);
  -o-transform: rotate(-2deg);
  -ms-transform: rotate(-2deg);
  transform: rotate(-2deg);
}

.note-yellow {
  background: #F7E999;
  -webkit-transform: rotate(2deg);
  -moz-transform: rotate(2deg);
  -o-transform: rotate(2deg);
  -ms-transform: rotate(2deg);
  transform: rotate(2deg);
}

.note-blue {
  background: #b9dcf4;
  -webkit-transform: rotate(-2deg);
  -moz-transform: rotate(-2deg);
  -o-transform: rotate(-2deg);
  -ms-transform: rotate(-2deg);
  transform: rotate(-2deg);
}

.note-pink {
  background: #FFBDA3;
  -webkit-transform: rotate(1deg);
  -moz-transform: rotate(1deg);
  -o-transform: rotate(1deg);
  -ms-transform: rotate(1deg);
  transform: rotate(1deg);
}

.note-green {
  background: #CAF4B9;
  -webkit-transform: rotate(-1deg);
  -moz-transform: rotate(-1deg);
  -o-transform: rotate(-1deg);
  -ms-transform: rotate(-1deg);
  transform: rotate(-1deg);
}
</style>
