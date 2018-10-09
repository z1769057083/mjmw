<template>
  <div class="login-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <router-link class="back pos" :to="{name: 'home'}"></router-link>
      <p class="txt">登录</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="login-logo" @click="deleguid">
          <i class="icon"></i>
        </div>
        <div class="login-box">
          <div class="zw-16"></div>
          <div class="div-input login-user">
            <input class="input" type="tel" placeholder="请输入用户名" ref="user">
          </div>
          <div class="zw-16"></div>
          <div class="div-input login-password">
            <input class="input" type="password" placeholder="请输入登录密码" ref="pass">
          </div>
          <div class="zw-16"></div>
          <a class="login-btn" @click="accountLogin">登录</a>
        </div>
        <div class="login-or">
          <span class="item"></span>
          <span class="txt">OR</span>
          <span class="item"></span>
        </div>
        <a class="login-wx" @click="wxlogin"></a>
        <div class="login-member">
          <router-link tag="span" :to="{name: 'register'}" class="item register">注册账户</router-link>
          <span class="item line"></span>
          <router-link tag="span" :to="{name: 'passwordReset'}" class="item forget">忘记密码</router-link>
        </div>
      </div>
    </div>
    <vtoaste v-show="err">
      <div slot="txt" class="txt">登录失败，请重新登录</div>
      <a slot="btn" class="btn" @click="err = !err">返回</a>
    </vtoaste>
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import local from 'vue-cookie';
  import {setLocal} from '../../common/js/util';

  export default {
    data() {
      return {
        err: false,
        warning: false,
        tips: ''
      };
    },
    mounted() {
      this.initScroll();
      setLocal('_address', {});
    },
    methods: {
      wxlogin() {
        window.location.href = api.wxLogin;
      },
      deleguid() {
        local.set('guid', '', 365);
        local.set('_token', '', 365);
      },
      // 账号登录
      accountLogin() {
        let user = this.$refs.user.value;
        let pass = this.$refs.pass.value;
        this.$refs.user.blur();
        this.$refs.pass.blur();
        // 验证帐号是否为空
        if (!user) {
          this.warning = true;
          this.tips = '请输入用户名';
          return;
        }
        // 验证密码是否为空
        if (!pass) {
          this.warning = true;
          this.tips = '请输入登录密码';
          return;
        }
        this.$http.get(api.device)
          .then((re) => {
            // 获取设备信息
            let device = re.data;
            // 匹配用户登录信息
            this.$http.post(api.userLoginData, qs.stringify({logname: user, password: pass, device: device}))
              .then((res) => {
                res = res.data;
                if (res.err_code == 200) {
                  local.set('_online', true, 365);
                  local.set('_token', res.data.account.token, 365);
                  local.set('_bindPhone', res.data.account.bind_mobile, 365);
                  local.set('_paypass', res.data.account.is_paypass, 365);
                  local.set('_isCh', res.data.account.is_ch, 365);
                  local.set('_equipmentId', res.data.account.equipment_id, 365);
                  local.set('_isWX', res.data.account.is_wx, 365);
                  let address = res.data.address;
                  for (let i = 0; i < address.length; i++) {
                    if (address[i].is_on > 0) {
                      setLocal('_address', address[i]);
                      break;
                    }
                  }
                  this.$router.replace({name: 'home', params: {back: true}});
                } else if (res.err_code == 401001) {
                  this.warning = true;
                  this.tips = res.err_msg;
                }
              })
              .catch(() => {
                this.warning = true;
                this.tips = api.warning;
              });
          })
          .catch(() => {
            this.warning = true;
            this.tips = api.warning;
          });
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
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .login-wrap {
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
      background: $bgff;
      .zw-16 {
        height: 16px;
      }
      .login-logo {
        height: 154px;
        @include bg(71px 71px);
        background-image: url(logo.png);
      }
      .login-box {
        width: 275px;
        margin: 0 auto;
        .input {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          font-size: 13px;
        }
        .div-input, .login-btn {
          position: relative;
          height: 48px;
          font-size: 13px;
          border: 1px solid $bddc;
          border-radius: $br50;
          overflow: hidden;
          &:after {
            content: "";
            position: absolute;
            left: 15px;
            top: 50%;
            width: 26px;
            height: 26px;
            margin-top: -14px;
            @include bg;
          }
        }
        .div-input {
          padding: 0 20px 0 50px;
        }
        .login-user:after {
          background-image: url(i_user.png);
        }
        .login-password:after {
          background-image: url(i_password.png);
        }
        .login-btn {
          display: block;
          line-height: 48px;
          text-align: center;
          color: $fse5;
        }
      }
      .login-or {
        display: flex;
        align-items: center;
        width: 275px;
        margin: 50px auto 0;
        .item {
          flex: 1;
          border-top: 1px solid $bddc;
        }
        .txt {
          padding: 0 5px;
          font-size: 12px;
          color: $fs95;
        }
      }
      .login-wx {
        display: block;
        width: 50px;
        height: 50px;
        margin: 15px auto 0;
        @include bg;
        background-image: url(i_wx.png);
      }
      .login-member {
        padding: 56px 0 33px;
        text-align: center;
        font-size: 0;
        color: $fs95;
        .item {
          font-size: 13px;
        }
        .line {
          margin: 0 12px;
          border-left: 1px solid $bd95;
        }
      }
    }
  }
</style>
