<template>
  <div class="passwordEdit-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">修改登录密码</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-35"></div>
        <!-- 填写密码 -->
        <div class="alert alert-password">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="password" placeholder="输入旧密码" ref="old_pass">
            </div>
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="password" placeholder="输入新密码" ref="new_pass1">
            </div>
            <p class="tip">密码长度6-20位字符组成，包含数字、字母、<br>区分大小写，不含有特殊字符。</p>
            <div class="zw-10"></div>
            <div class="btn">
              <input class="input" type="password" placeholder="确认新密码" ref="new_pass2">
            </div>
            <a class="btn btn-sure" @click="goNext">下一步</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
    <!-- 成功框 -->
    <vtoasts v-show="success">
      <div slot="txt" class="txt">{{tips}}</div>
      <router-link slot="btn" class="btn" :to="{name: 'account'}">返回</router-link>
    </vtoasts>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        warning: false,
        tips: '',
        success: false
      };
    },
    mounted() {
      // 解决安卓输入框上移露白问题
      document.body.style.background = '#ecf0f3';
      this.initScroll();
    },
    methods: {
      goNext() {
        this.$refs.old_pass.blur();
        this.$refs.new_pass1.blur();
        this.$refs.new_pass2.blur();
        let oldPass = this.$refs.old_pass.value;
        // 判断是否输入旧密码
        if (oldPass === '') {
          this.warning = !this.warning;
          this.tips = '旧密码不能为空';
          return;
        }
        let newPass1 = this.$refs.new_pass1.value;
        // 是否输入密码
        if (!(/^[a-zA-Z0-9]{6,20}$/.test(newPass1))) {
          this.warning = true;
          this.tips = '请按提示输入新密码';
          return;
        }
        let newPass2 = this.$refs.new_pass2.value;
        // 比较两次输入的密码是否一致
        if (newPass1 !== newPass2) {
          this.warning = true;
          this.tips = '两次输入的密码不一致';
          return;
        }
        this.$http.post(api.resetPassword, qs.stringify({
          old_pass: oldPass,
          new_pass: newPass2
        })).then((res) => {
          res = res.data;
          if (res.err_code !== 200) {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          } else {
            this.success = !this.success;
            this.tips = '密码修改成功';
          }
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

  .passwordEdit-wrap {
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
      .zw-35 {
        height: 35px;
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
            background-image: url(i_key.png);
          }
        }
        .cont {
          .tip {
            width: 210px;
            line-height: 1.2;
            margin: 10px auto 0;
            font-size: 10px;
            color: $fs95;
          }
        }
      }
    }
  }
</style>
