<template>
  <div class="paySetting-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">支付密码</p>
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
            <div class="btn">
              <input class="input" v-model="pass" type="password" placeholder="请输入6位数字支付密码">
            </div>
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" v-model="pass2" type="password" placeholder="请再次输入密码">
            </div>
            <a class="btn btn-sure" @click="setPass">提交</a>
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

  export default {
    data() {
      return {
        pass: '',
        pass2: '',
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
      },
      setPass() {
        // 验证是否输入6位纯数字密码
        if (!/^\d{6}$/.test(this.pass)) {
          this.warning = !this.warning;
          this.tips = '请输入6位纯数字密码';
          return;
        }
        // 验证两次输入的密码是否一致
        if (this.pass !== this.pass2) {
          this.warning = !this.warning;
          this.tips = '两次输入的密码不一致';
          return;
        }
        this.$http.post(api.setPayPass, qs.stringify({
          password: this.pass
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            // 更改本地支付密码状态
            local.set('_paypass', 1);
            this.$router.back();
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        }).catch(() => {
          this.warning = !this.warning;
          this.tips = api.warning;
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .paySetting-wrap {
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
      .alert-password {
        .title {
          .icon {
            background-image: url(i_lock.png);
          }
        }
      }
    }
  }
</style>
