<template>
  <div class="phoneBind-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap" v-if="step == 1">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">绑定手机</p>
    </header>
    <!-- 头部信息 -->
    <header class="head-wrap" v-else>
      <a class="back pos" @click.prevent="step--"></a>
      <p class="txt">验证绑定手机</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-110"></div>
        <!-- 绑定手机号 -->
        <div class="alert alert-bind" v-if="step == 1">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <p class="txt">验证手机号，您的账户更安全</p>
            <div class="btn">
              <input class="input" type="tel" v-model="tel" placeholder="请输入11位有效手机号" ref="phone">
            </div>
            <a class="btn btn-sure" @click="checkPhone">下一步</a>
          </div>
        </div>
        <!-- 修改绑定手机 -->
        <div class="alert alert-validate" v-else>
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <div class="zw-10"></div>
            <p class="tel-num">手机号：{{phone}}</p>
            <p class="txt">为保障您的财产安全<br>请验证并确保该手机号为本人所有<br><br>如该手机号错误请返回上层进行修改</p>
            <router-link class="btn btn-sure" :to="{name: 'wxBindPhone', query: {bindPhone: tel}}">确认 / 验证</router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{ tips }}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        step: 1,
        tel: '',
        warning: false,
        tips: ''
      };
    },
    computed: {
      phone() {
        return this.tel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
      }
    },
    mounted() {
      // 解决安卓输入框上移露白问题
      document.body.style.background = '#ecf0f3';
      this.initScroll();
    },
    methods: {
      // 验证输入手机
      checkPhone() {
        this.$refs.phone.blur();
        // 验证手机号
        if (!(/^1[34578]\d{9}$/.test(this.tel))) {
          this.warning = true;
          this.tips = '请输入正确的手机号';
          return;
        }
        this.step += 1;
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

  .phoneBind-wrap {
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
      .alert-bind {
        .title {
          .icon {
            background-image: url(i_link.png);
          }
        }
        .cont {
          .txt {
            text-align: center;
            padding: 25px 0;
            font-size: 13px;
            color: $fs53;
          }
        }
      }
      .alert-validate {
        .title {
          .icon {
            background-image: url(i_right.png);
          }
        }
        .cont {
          .tel-num {
            text-align: center;
            font-size: 16px;
            color: $fse5;
          }
          .txt {
            line-height: 1.3;
            text-align: center;
            padding: 10px 0;
            font-size: 13px;
            color: $fs95;
          }
        }
      }
    }
  }
</style>
