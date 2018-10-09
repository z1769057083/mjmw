<template>
  <div class="h5-wrap">
    <swiper :options="swiperOption" class="slide-box" ref="slideBox">
      <swiper-slide :class="checkCls(index)" :key="index" v-for="(item, index) in slideNum">
        <div class="btn-box" v-if="index == slideNum - 1">
          <router-link class="btn btn-look" :to="{name: 'goods', query: {itemid: 1}}"></router-link>
          <a class="btn btn-go" @click="checkRecharge"></a>
        </div>
      </swiper-slide>
    </swiper>
    <a class="back pos" @click="$router.back()"></a>
    <img src="./dir.png" id="dir" v-show="flag">
  </div>
</template>

<script>
  import {swiper, swiperSlide} from 'vue-awesome-swiper';
  import local from 'vue-cookie';
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        slideNum: 6,
        flag: true,
        swiperOption: {
          direction: 'vertical',
          onSlideChangeEnd(swiper) {
            if (swiper.activeIndex < document.querySelectorAll('.swiper-slide').length - 1) {
              document.getElementById('dir').style.display = 'block';
            } else {
              document.getElementById('dir').style.display = 'none';
            }
          },
          onReachEnd() {
            document.getElementById('dir').style.display = 'none';
          }
        }
      };
    },
    created() {
      this.$http.post(api.wx, qs.stringify({
        url: api.wxUrl
      })).then((res) => {
        res = res.data;
        this.$wechat.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['getNetworkType', 'getLocation']
        });
      });
    },
    methods: {
      checkRecharge() {
        if (local.get('_online') == null || local.get('_online') == 'false') {
          this.$router.push({name: 'login'});
          return;
        }
        let _this = this;
        if (local.get('_isCh') != 1) {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.push({name: 'bindChannel', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        } else {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.push({name: 'recharge', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        }
      },
      checkCls(index) {
        if (local.get('_isCh') != 0 && index == 1 && (local.get('_online') != null && local.get('_online') != 'false')) {
          return 'slide_01';
        }
        return 'slide' + index;
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .h5-wrap {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #e0d7d8 url(loading.gif) no-repeat center;
    .slide-box {
      position: relative;
      height: 100%;
      @for $i from 0 through 5 {
        .slide#{$i} {
          position: relative;
          background: url(0#{$i + 1}.jpg) no-repeat center;
          background-size: 100% 100%;
        }
      }
      .slide_01 {
        background: url(02-1.jpg) no-repeat center;
        background-size: 100% 100%;
      }
      .btn-box {
        position: absolute;
        left: 50%;
        bottom: 0;
        width: 280px;
        height: 150px;
        transform: translateX(-50%);
        .btn {
          display: block;
          width: 100%;
          height: 50px;
          background: no-repeat center;
          background-size: contain;
        }
        .btn-look {
          background-image: url(btn_01.png);
        }
        .btn-go {
          margin-top: 15px;
          background-image: url(btn_02.png);
        }
      }
    }
    .pos {
      position: absolute;
      top: 8px;
      left: 9px;
      width: 35px;
      height: 35px;
      @include bg;
      background-image: url("./i_left_arrow.png");
      z-index: 9;
    }
    #dir {
      position: absolute;
      left: 50%;
      bottom: 20px;
      z-index: 9;
      width: 30px;
      height: 30px;
      margin-left: -15px;
      animation: bounce 1.5s infinite;
    }
  }

  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(10px);
    }
  }
</style>
