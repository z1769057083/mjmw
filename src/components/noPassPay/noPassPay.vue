<template>
  <div class="noPassPay-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">免密支付</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-110"></div>
        <!-- 验证绑定手机 -->
        <div class="alert alert-code">
          <div class="title">验证手机号</div>
          <div class="cont">
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="text" :placeholder="'请输入手机尾号' + phone.substr(-4) + '接收的短信验证码'" ref="code">
            </div>
            <a class="btn btn-countdown" @click="getCode" v-if="num == 60">点击发送验证码</a>
            <a class="btn btn-countdown" @click="toBlur" v-else>{{num}}秒后 重新发送</a>
            <a class="btn btn-sure" @click="toBack">确认</a>
          </div>
        </div>
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
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import local from 'vue-cookie';
  import {countDown, clearTimer} from '../../common/js/util';

  export default {
    data() {
      return {
        phone: local.get('_bindPhone'),
        num: 60,
        warning: false,
        tips: ''
      };
    },
    mounted() {
      // 解决安卓输入框上移露白问题
      document.body.style.background = '#ecf0f3';
      this.initScroll();
    },
    methods: {
      getCode() {
        this.toBlur();
        this.$http.post(api.nonePayPass, qs.stringify({
          is_pass: 0,
          step: 1,
          mobile: this.phone
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.startCount();
          } else {
            this.warning = true;
            this.tips = res.err_msg;
          }
        });
      },
      toBack() {
        this.toBlur();
        this.code = this.$refs.code.value;
        if (this.code == '') {
          this.warning = true;
          this.tips = '验证码不能为空';
          return;
        }
        this.$http.post(api.nonePayPass, qs.stringify({
          is_pass: 0,
          step: 3,
          code: this.code,
          mobile: this.phone
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            local.set('_paypass', -1, 365);
            this.$router.go(-1);
          } else {
            this.warning = true;
            this.tips = res.err_msg;
          }
        });
      },
      toBlur() {
        // 解决安卓软件盘问题
        this.$refs.code.blur();
      },
      startCount() {
        --this.num;
        countDown(function (res) {
          this.num = res;
        }.bind(this), () => {
          this.num = 60;
          clearTimer();
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

  .noPassPay-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
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
      background: $bgec;
      .zw-10 {
        height: 10px;
      }
      .zw-110 {
        height: 110px;
      }
      .scroll-wrap {
        padding: 5px;
      }
      .alert {
        width: 298px;
        margin: 0 auto;
        border-radius: $br20;
        overflow: hidden;
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          background: $bgff;
          .icon {
            width: 30px;
            height: 30px;
            @include bg;
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .btn {
            display: block;
            width: 274px;
            height: 48px;
            margin: 0 auto;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            overflow: hidden;
          }
          .input {
            display: flex;
            width: 100%;
            height: 100%;
            padding: 0 20px;
            font-size: 13px;
            box-sizing: border-box;
          }
          .btn-sure {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fse5;
          }
        }
      }
      .alert-code {
        .title {
          font-size: 15px;
          color: $fse5;
        }
        .cont {
          .txt {
            line-height: 1.3;
            text-align: center;
            padding: 10px 0;
            font-size: 13px;
            color: $fs53;
          }
          .btn-countdown {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fs44;
          }
        }
      }
    }
  }
</style>
