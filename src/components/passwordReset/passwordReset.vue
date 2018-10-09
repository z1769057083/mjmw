<template>
  <div class="passwordReset-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">登录密码重置</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <ul class="reset-bar">
          <li class="item" :class="{now: step > 0}">
            <span class="num">1</span>
            <span class="txt">验证手机号</span>
          </li>
          <li class="item" :class="{now: step > 1}">
            <span class="num">2</span>
            <span class="txt">输入新密码</span>
          </li>
          <li class="item" :class="{now: step > 2}">
            <span class="num">3</span>
            <span class="txt">重置成功</span>
          </li>
        </ul>
        <div class="zw-115"></div>
        <!-- 验证手机号 -->
        <div class="alert alert-tel" v-show="step == 1">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="tel" placeholder="请输入已绑定手机号" ref="tel">
            </div>
            <div class="zw-10"></div>
            <div class="btn2">
              <input class="input2" type="text" placeholder="输入验证码" ref="code">
              <a class="btn-code" v-if="num == 60" @click="getCode">获取验证码</a>
              <a class="btn-code" v-else>{{num}}秒后重新<br>获取验证码</a>
            </div>
            <a class="btn btn-sure" @click="stepOne">下一步</a>
          </div>
        </div>
        <!-- 填写密码 -->
        <div class="alert alert-password" v-show="step == 2">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="password" placeholder="请输入新的登录密码" ref="pass">
            </div>
            <p class="tip">密码长度6-20位字符组成，包含数字、字母、<br>区分大小写，不含有特殊字符。</p>
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="password" placeholder="请再次输入新的登录密码" ref="pass2">
            </div>
            <a class="btn btn-sure" @click="stepTwo">下一步</a>
          </div>
        </div>
        <!-- 重置成功 -->
        <div class="alert alert-success" v-if="res_ok && step == 3">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <p class="txt">恭喜您，登录密码重置成功！</p>
            <router-link :to="{name: 'home'}" class="btn btn-sure">返回登录</router-link>
          </div>
        </div>
        <!-- 重置失败 -->
        <div class="alert alert-error" v-else-if="!res_ok && step == 3">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <p class="txt">很遗憾，登录密码重置失败！</p>
            <a class="btn btn-sure" @click="startAgain">重新重置</a>
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
  import {countDown, clearTimer} from '../../common/js/util';

  export default {
    data() {
      return {
        step: 1,
        num: 60,
        tips: '',
        warning: false,
        res_ok: null
      };
    },
    methods: {
      startCount() {
        --this.num;
        countDown(function (res) {
          this.num = res;
        }.bind(this), () => {
          this.num = 60;
        });
      },
      startAgain() {
        this.step = 1;
        this.res_ok = null;
        this.$refs.tel.value = '';
        this.$refs.code.value = '';
        this.$refs.pass.value = '';
        this.$refs.pass2.value = '';
      },
      getCode() {
        // 解决安卓软件盘问题
        this.$refs.tel.blur();
        this.tel = this.$refs.tel.value;
        // 验证手机号
        if (!(/^1[34578]\d{9}$/.test(this.tel))) {
          this.warning = true;
          this.tips = '请输入正确的手机号';
          return;
        }
        // 验证手机号是否被注册
        this.$http.post(api.forgetPassword, qs.stringify({
          step: 1,
          mobile: this.tel
        }))
          .then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              this.startCount();
            } else {
              this.warning = true;
              this.tips = res.err_msg;
            }
          })
          .catch(() => {
            this.warning = true;
            this.tips = api.warning;
          });
      },
      stepOne() {
        // 解决安卓软件盘问题
        this.$refs.tel.blur();
        this.$refs.code.blur();
        this.tel = this.$refs.tel.value;
        this.code = this.$refs.code.value;
        // 验证手机号
        if (!(/^1[34578]\d{9}$/.test(this.tel))) {
          this.warning = true;
          this.tips = '请输入正确的手机号';
          return;
        }
        // 验证手机号和注册码
        this.$http.post(api.forgetPassword, qs.stringify({
          step: 2,
          mobile: this.tel,
          code: this.code
        }))
          .then((res) => {
            res = res.data;
            if (res.err_code * 1 == 200) {
              this.step = 2;
              clearTimer();
              this.num = 60;
            } else {
              this.warning = true;
              this.tips = res.err_msg;
            }
          })
          .catch(() => {
            this.warning = true;
            this.tips = api.warning;
          });
      },
      stepTwo() {
        // 解决安卓软件盘问题
        this.$refs.pass.blur();
        this.$refs.pass2.blur();
        this.pass = this.$refs.pass.value;
        this.pass2 = this.$refs.pass2.value;
        // 是否输入密码
        if (!(/^[a-zA-Z0-9]{6,20}$/.test(this.pass))) {
          this.warning = true;
          this.tips = '请按提示输入密码';
          return;
        }
        // 比较两次输入的密码是否一致
        if (this.pass !== this.pass2) {
          this.warning = true;
          this.tips = '两次输入的密码不一致';
          return;
        }
        // 校验验证码是否存在
        this.$http.post(api.forgetPassword, qs.stringify({
          step: 3,
          mobile: this.tel,
          code: this.code,
          password: this.pass
        }))
          .then((res) => {
            res = res.data;
            if (res.err_code * 1 == 200) {
              this.step = 3;
              this.res_ok = true;
            } else {
              this.step = 3;
              this.res_ok = false;
            }
          })
          .catch(() => {
            this.warning = true;
            this.tips = api.warning;
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
    },
    mounted() {
      // 解决安卓输入框上移露白问题
      document.body.style.background = '#ecf0f3';
      this.initScroll();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .passwordReset-wrap {
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
      .reset-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 12px;
        color: $fs95;
        border-radius: $br6;
        background: $bgff;
        .item {
          position: relative;
          display: flex;
          flex-direction: column;
          flex: 1;
          text-align: center;
          &:first-child {
            &:after {
              border-top: 0 none;
            }
          }
          &.now {
            .num {
              color: $fsff;
              background: $fse5;
            }
            &:after {
              border-top-color: $bde5;
            }
          }
          &:after {
            content: "";
            position: absolute;
            left: -50%;
            top: 6px;
            width: 100%;
            border-top: 1px solid $bddc;
          }
          .num {
            position: relative;
            z-index: 1;
            width: 15px;
            height: 15px;
            line-height: 15px;
            margin: 0 auto 3px;
            color: $fsff;
            border-radius: 50%;
            background: $bg95;
          }
        }
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
      .alert-tel {
        .title {
          .icon {
            background-image: url(i_phone.png);
          }
        }
        .cont {
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
              flex: 1;
              width: 100%;
              height: 100%;
              padding-left: 20px;
              font-size: 13px;
              box-sizing: border-box;
            }
            .btn-code {
              display: flex;
              justify-content: center;
              align-items: center;
              flex: 0 0 105px;
              width: 105px;
              height: 100%;
              color: $fs3d;
            }
          }
        }
      }
      .alert-password {
        .title {
          .icon {
            background-image: url(i_key.png);
          }
        }
        .cont {
          .tip {
            width: 210px;
            line-height: 1.2;
            margin: 10px auto 0;
            font-size: 10px;
            color: $fse5;
          }
        }
      }
      .alert-success {
        .title {
          .icon {
            background-image: url(i_right.png);
          }
        }
        .cont {
          .txt {
            height: 46px;
            line-height: 46px;
            text-align: center;
            font-size: 13px;
            color: $fs31;
          }
        }
      }
      .alert-error {
        .title {
          .icon {
            background-image: url(i_wrong.png);
          }
        }
        .cont {
          .txt {
            height: 46px;
            line-height: 46px;
            text-align: center;
            font-size: 13px;
            color: $fs31;
          }
        }
      }
    }
  }
</style>
