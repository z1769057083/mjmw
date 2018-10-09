<template>
  <div id="app">
    <vmenu></vmenu>
    <!-- 路由内容展示 -->
    <!--<transition name="slide-fade">-->
    <!--<keep-alive>-->
    <!--<router-view v-if="$route.meta.keep"></router-view>-->
    <!--</keep-alive>-->
    <!--</transition>-->
    <!--<transition name="slide-fade">-->
    <!--<router-view v-if="!$route.meta.keep"></router-view>-->
    <!--</transition>-->
    <keep-alive>
      <router-view v-if="$route.meta.keep"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keep"></router-view>
  </div>
</template>

<script>
</script>

<style scoped lang="scss">
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter {
    transform: translateX(100%);
    /*opacity: 0;*/
  }

  .slide-fade-leave-active {
    /*transform: translateX(0);*/
    opacity: 0;
  }
</style>
