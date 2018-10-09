<template>
  <div class="phoneEdit-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">绑定手机号</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-110"></div>
        <!-- 修改绑定手机 -->
        <div class="alert alert-validate">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <p class="txt">您正在修改每家美物账户绑定的手机号，<br>请进行身份验证</p>
            <router-link class="btn btn-ok" :to="{name: 'phoneCan'}">原手机号能接收验证码</router-link>
            <router-link class="btn btn-no" :to="{name: 'phoneNo'}">原手机号不能接收验证码</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    mounted() {
      // 解决安卓输入框上移露白问题
      document.body.style.background = '#ecf0f3';
      this.initScroll();
    },
    methods: {
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

  .phoneEdit-wrap {
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
      overflow: hidden;
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
      .alert-validate {
        .title {
          .icon {
            background-image: url(i_warp.png);
          }
        }
        .cont {
          .txt {
            line-height: 1.3;
            text-align: center;
            padding: 10px 0;
            font-size: 13px;
            color: $fs53;
          }
          .btn-ok {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fs44;
          }
          .btn-no {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fse5;
          }
        }
      }
    }
  }
</style>
