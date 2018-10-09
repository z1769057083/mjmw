<template>
  <div class="shop-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
    </header>
    <!-- 主体信息 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="img-box">
          <img class="img" src="./half_store.png" alt="">
        </div>
        <!-- 文字 -->
        <p class="txt">真正用心的人才会知道，<br>土壤、气温、水分、日照对于橄榄油品质的影响，<br>我们甚至寻味西班牙，为您甄选百年好品质......</p>
        <p class="txt">现在，足不出户，身边小店送货上门<br>品质生活，从每家美物智能冰箱开始</p>
        <p class="txt">此刻，“万元冰箱抱回家”活动风暴</p>
        <p class="txt">商城充值¥6999，等值购物无忧，<br>另送万元智能冰箱，智慧生活掌控在手！</p>
        <!-- 活动按钮 -->
        <a @click="toStore" class="attend-btn">前往小店参与活动</a>
        <!-- 占位元素 -->
        <div class="zw-25"></div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import local from 'vue-cookie';
  import api from '../../api';
  import qs from 'qs';

  export default {
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
          jsApiList: ['getLocation']
        });
      });
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      toStore() {
        let _this = this;
        if (local.get('_online') == null || local.get('_online') == 'false') {
          this.$router.push({name: 'login'});
          return;
        }
        this.$wechat.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success(res1) {
            _this.$router.push({name: 'nearbyStore', query: {lng: res1.longitude, lat: res1.latitude}});
          }
        });
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            // 主体滚动
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              probeType: 3,
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .shop-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgff;
    .head-wrap {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      background-color: $bgff;
      box-shadow: inset 0 -1px 0 $bsdc;
      .pos {
        position: absolute;
        top: 50%;
        width: 30px;
        height: 30px;
        margin-top: -16px;
        @include bg(23px 23px);
      }
      .back {
        left: 9px;
        background-image: url(i_left_arrow.png);
      }
      .txt {
        text-align: center;
        padding: 0 40px;
        color: $fse5;
        @extend .dot;
      }
    }
    .main {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .img-box {
        position: relative;
        width: 100%;
        height: 0;
        margin-bottom: 2px;
        padding-top: 90.666%;
        overflow: hidden;
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .txt {
        line-height: 14px;
        text-align: center;
        padding-top: 15px;
        font-size: 13px;
        color: $fs53;
      }
      .attend-btn {
        display: block;
        width: 277px;
        height: 52px;
        line-height: 52px;
        text-align: center;
        margin: 30px auto 0;
        font-size: 13px;
        color: $fse5;
        @include bg(277px 52px);
        background-image: url(go_btn.png);
      }
      .zw-25 {
        height: 25px;
      }
    }
  }
</style>
