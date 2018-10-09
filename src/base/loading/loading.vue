<template>
  <div class="loading-wrap" v-show="loading">
    <span class="ani">加载中<i class="shadow"></i></span>
  </div>
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    computed: mapState(['loading'])
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .loading-wrap {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 9;
    .ani {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      margin: auto;
      font-size: 14px;
      color: $fse5;
      border-radius: 50%;
      border: 1px solid $bde5;
      animation: ani_up 1s infinite;
    }
    .shadow {
      position: absolute;
      left: 50%;
      bottom: -15px;
      width: 40px;
      height: 8px;
      margin-left: -20px;
      border-radius: 50%;
      background: rgba(229, 0, 79, .6);
      box-shadow: 0 0 20px $bge5;
      animation: ani_scale 1s infinite;
    }
  }

  @keyframes ani_up {
    0%, 100% {
      transform: translateY(-15px);
    }
    50% {
      transform: translateY(0);
    }
  }

  @keyframes ani_scale {
    0%, 100% {
      transform: translateY(15px) scale(.6);
    }
    50% {
      transform: translateY(0) scale(1);
    }
  }
</style>
