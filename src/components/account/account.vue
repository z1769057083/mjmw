<script src="../../../../vue-jhmw/src/api.js"></script>
<template>
  <div class="account-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">账户安全</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="item edit-password">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">修改登录密码</span>
          </div>
          <div class="right" @click="toChangeLogiPass">
            <i class="icon"></i>
          </div>
        </div>
        <div class="item bind-tel">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">修改绑定手机</span>
          </div>
          <router-link tag="div" class="right" :to="{name: !bindPhone ? 'phoneBind' : 'phoneEdit'}">
            <span class="txt">{{!bindPhone ? '立即绑定' : bindPhone}}</span>
            <i class="icon"></i>
          </router-link>
        </div>
        <div class="pay-ways">
          <div class="pay-password">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">支付密码</span>
            </div>
            <div class="right" @click="toChangePass">
              <span class="txt">{{paypass == 0 || paypass == -2 ? '设置密码' : '修改密码'}}</span>
              <i class="icon"></i>
            </div>
          </div>
          <div class="pay-item">
            <div class="secret">
              <span class="left">免密支付</span>
              <!-- 开启免密码是-1，关闭是1 -->
              <span class="switch-box" :class="{on: paypass == -1}" @click="changeSwitch">
                <span class="switch-dot"></span>
              </span>
            </div>
            <!--<div class="finger">-->
            <!--<span class="left">指纹支付</span>-->
            <!--<span class="switch-box off">-->
            <!--<span class="switch-dot"></span>-->
            <!--</span>-->
            <!--</div>-->
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
  import local from 'vue-cookie';
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        isWX: local.get('_isWX'),
        paypass: local.get('_paypass'),
        warning: false,
        tips: '',
        bindPhone: local.get('_bindPhone'),
        num: 5
      };
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      toChangeLogiPass() {
        if (!this.bindPhone) {
          this.warning = !this.warning;
          this.tips = '请先绑定手机';
          return;
        } else {
          if (this.isWX > 0) {
            this.warning = !this.warning;
            this.tips = '微信账户无法修改登录密码，请使用绑定手机号登录修改';
            return;
          }
          this.$router.push({name: 'passwordEdit'});
        }
      },
      toChangePass() {
        if (!this.bindPhone) {
          this.warning = !this.warning;
          this.tips = '请先绑定手机';
          return;
        }
        if (this.paypass == 0) {
          this.$router.push({name: 'paySetting'});
        } else {
          this.$router.push({name: 'paySettingEdit'});
        }
      },
      changeSwitch() {
        if (this.paypass == 0) {
          this.warning = !this.warning;
          this.tips = '请先设置支付密码';
          return;
        }
        if (!this.bindPhone) {
          this.warning = !this.warning;
          this.tips = '请先绑定手机';
          return;
        }
        if (this.paypass == -1) {
          this.$http.post(api.nonePayPass, qs.stringify({
            is_pass: 1
          })).then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              this.paypass = 1;
              local.set('_paypass', 1, 365);
            }
          });
          return;
        }
        this.$router.push({name: 'noPassPay'});
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

  .account-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
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
        height: 30px;
        margin-top: -16px;
        @include bg(23px 23px);
      }
      .back {
        left: 9px;
        width: 30px;
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
      .scroll-wrap {
        padding: 5px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        margin-top: 5px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
        &:first-child {
          margin-top: 0;
        }
        .left {
          display: flex;
          align-items: center;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            color: $fs1b;
          }
        }
        .right {
          display: flex;
          align-items: center;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url(i_right_arrow.png);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            color: $fse5;
          }
        }
      }
      .edit-password {
        .left {
          .icon {
            background-image: url(i_avatar.png);
          }
        }
      }
      .bind-tel {
        .left {
          .icon {
            background-image: url(i_phone.png);
          }
        }
      }
      .pay-ways {
        margin-top: 5px;
        font-size: 13px;
        border-radius: $br6;
        overflow: hidden;
        .pay-password {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-bottom: 1px;
          background: $bgff;
          .left {
            display: flex;
            align-items: center;
            .icon {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
              background-image: url(i_lock.png);
            }
            .txt {
              height: 30px;
              line-height: 30px;
              color: $fs1b;
            }
          }
          .right {
            display: flex;
            align-items: center;
            .icon {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
              background-image: url(i_right_arrow.png);
            }
            .txt {
              height: 30px;
              line-height: 30px;
              color: $fse5;
            }
          }
        }
        .pay-item {
          position: relative;
          padding-left: 30px;
          &:after {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 30px;
            height: 100%;
            background: $bgff;
          }
          .secret {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            background: $bgff;
          }
          .finger {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            margin-top: 1px;
            background: $bgff;
          }
          .switch-box {
            position: relative;
            display: block;
            width: 40px;
            height: 20px;
            margin-right: 10px;
            border-radius: $br20;
            background: $bg95;
            &.on {
              background: $bge5;
              .switch-dot {
                left: 22px;
              }
            }
            .switch-dot {
              position: absolute;
              left: 2px;
              top: 2px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: $bgff;
              transition: left .2s cubic-bezier(.4, .4, .25, 1.35);
            }
          }
        }
      }
    }
  }
</style>
