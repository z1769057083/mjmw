<template>
  <div class="bindChannel-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">美家钻充值</p>
    </header>
    <!-- 主体信息 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="scan-tips">
          <i class="icon"></i>
          <span class="txt">{{address}}</span>
        </div>
        <baidu-map class="map" :center="ak" :zoom="zoom" :ak="ak" @ready="bdMap"></baidu-map>
        <div class="zw-90"></div>
        <div class="code-box">
          <div class="code" @touchstart="knowCode" @touchend="clearCode">
            <img class="img" :src="list.qr_code_url" alt="">
            <div class="img-mark"></div>
          </div>
          <p class="text">请您长按屏幕中二维码<br>进行绑定充值</p>
        </div>
        <div class="img-box"></div>
        <div class="img-text">客户资金,江苏银行全程监管<br>消费更安心</div>
      </div>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
  </div>
</template>

<script>
  import {BaiduMap} from 'vue-baidu-map';
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import local from 'vue-cookie';

  export default {
    data() {
      return {
        warning: false,
        tips: '',
        me: {lng: this.$route.query.lng, lat: this.$route.query.lat},
        list: {},
        ak: 'ZIbrLPXqL4GvE9L0Emih1rwj',
        zoom: 18,
        address: ''
      };
    },
    created() {
      this.initData();
      this.___num = 0;
      this.___timer = null;
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      bdMap({BMap, map}) {
        // 保存this引用
        let _this = this;
        // 解析地当前地址
        new BMap.Geocoder().getLocation(new BMap.Point(_this.me.lng, _this.me.lat), (res) => {
          _this.address = res.address ? res.address : '数据库中暂无此地址';
        });
      },
      knowCode() {
        // 有渠道什么都不做
        if (this.list.is_ch != 0) {
          return;
        }
        this.___num = 0;
        clearInterval(this.___timer);
        this.___timer = setInterval(() => {
          this.___num += 1;
          if (this.___num == 3) {
            clearInterval(this.___timer);
            this.$http.post(api.scanQRCode, qs.stringify({
              ch: this.list.code
            })).then((res) => {
              console.log(res, 22222);
              res = res.data;
              if (res.err_code == 200) {
                local.set('_isCh', 1, 365);
                this.$router.replace({name: 'recharge', query: {lng: this.me.lng, lat: this.me.lat}});
              } else {
                this.warning = !this.warning;
                this.tips = res.err_msg;
              }
            });
          }
        }, 100);
      },
      clearCode() {
        if (this.___num < 3) {
          clearInterval(this.___timer);
        }
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      initData() {
        this.$http.post(api.getChannel, qs.stringify({
          lng: this.me.lng,
          lat: this.me.lat
        })).then((res) => {
          console.log(res);
          res = res.data;
          if (res.err_code == 200) {
            this.list = res.data;
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        });
      }
    },
    components: {
      BaiduMap
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .bindChannel-wrap {
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
      background: $bgec;
      .map {
        width: 0;
        height: 0;
      }
      .zw-90 {
        height: 90px;
      }
      .scroll-wrap {
        padding: 5px;
      }
      .scan-tips {
        display: flex;
        align-items: center;
        height: 40px;
        padding-left: 5px;
        font-size: 13px;
        color: $fsff;
        border-radius: $br6;
        overflow: hidden;
        background: $bge5;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
          background-image: url(i_gps.png);
        }
        .txt {
          flex: 1;
          height: 30px;
          line-height: 30px;
          padding-left: 5px;
          @extend .dot;
        }
      }
      .code-box {
        width: 200px;
        margin: 0 auto;
        .code {
          position: relative;
          width: 100%;
          height: 200px;
          border: 1px solid $bddc;
          border-radius: 4px;
          box-sizing: border-box;
          .img {
            display: block;
            width: 100%;
            height: 100%;
          }
          .img-mark {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }
        }
        .text {
          line-height: 20px;
          padding-top: 18px;
          text-align: center;
          font-size: 15px;
          color: $fs31;
        }
      }
      .img-box {
        width: 188px;
        height: 32px;
        margin: 100px auto 0;
        @include bg;
        background-image: url(img_tips_mjb.png);
      }
      .img-text {
        line-height: 20px;
        padding: 30px 0;
        text-align: center;
        font-size: 14px;
        color: $fs31;
      }
    }
  }
</style>
