<template>
  <div class="entityCard-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">兑换卡</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-115"></div>
        <!-- 验证兑换卡 -->
        <div class="alert alert-convert">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <div class="zw-10"></div>
            <div class="btn2">
              <input class="input2" type="text" placeholder=" 请输入实体卡密码" ref="pass">
            </div>
            <a class="btn btn-sure" @click="toExchange">立即兑换</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 兑换成功弹层 -->
    <vtoasts v-show="success">
      <template slot="icon">兑换成功</template>
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="$router.back()">返回</a>
    </vtoasts>
    <!-- 兑换失败弹层 -->
    <vtoaste v-show="error">
      <template slot="icon">兑换失败</template>
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="error = !error">返回</a>
    </vtoaste>
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

  export default {
    data() {
      return {
        error: false,
        warning: false,
        success: false,
        tips: ''
      };
    },
    methods: {
      _initScroll() {
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
      toExchange() {
        let pass = this.$refs.pass;
        pass.blur();
        if (!pass.value.length) {
          this.warning = !this.warning;
          this.tips = '请输入合法的实体卡密码';
          return;
        }
        this.$http.post(api.cardExchange, qs.stringify({
          pass: pass.value
        })).then((res) => {
          console.log(res);
          res = res.data;
          if (res.err_code == 200) {
            this.success = !this.success;
            this.tips = '兑换成功';
          } else {
            this.error = !this.error;
            this.tips = res.err_msg;
          }
        });
      }
    },
    mounted() {
      this._initScroll();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .entityCard-wrap {
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
      .zw-115 {
        height: 115px;
      }
      .scroll-wrap {
        padding: 5px;
      }
      .alert-convert {
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
            background-image: url(i_gift.png);
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
          .btn2 {
            display: flex;
            justify-content: space-around;
            align-items: center;
            width: 274px;
            height: 48px;
            margin: 0 auto;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            overflow: hidden;
            .input2 {
              display: flex;
              width: 100%;
              height: 100%;
              padding: 0 20px;
              font-size: 13px;
              box-sizing: border-box;
            }
          }
          .btn-sure {
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
