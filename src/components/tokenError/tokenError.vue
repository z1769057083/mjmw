<template>
  <div class="tokenError-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <p class="txt">TOKEN错误</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-110"></div>
        <!-- 填写密码 -->
        <div class="alert alert-password">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <p class="text">TOKEN错误！</p>
            <router-link class="btn btn-sure" :to="{name: 'login'}">请重新登录</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import local from 'vue-cookie';
  import {setLocal} from '../../common/js/util';

  export default {
    mounted() {
      local.set('_online', false, 365);
      setLocal('_address', {});
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .tokenError-wrap {
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
      overflow: hidden;
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
          .text {
            padding: 10px;
            text-align: center;
            font-size: 14px;
            color: $fse5;
          }
          .input {
            display: flex;
            width: 100%;
            height: 100%;
            padding: 0 20px;
            font-size: 13px;
            box-sizing: border-box;
          }
          .btn-forget {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fs3d;
          }
          .btn-sure {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fse5;
          }
        }
      }
      .alert-password {
        .title {
          .icon {
            background-image: url(i_warp.png);
          }
        }
      }
    }
  }
</style>
