<template>
  <div class="phoneNo-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">安全验证</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="zw-110"></div>
        <!-- 登录密码验证 -->
        <div class="alert alert-pass" v-if="step == 1">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <p class="txt">输入登录密码进行验证</p>
            <div class="btn">
              <input class="input" type="password" placeholder="请输入登录密码" ref="pass">
            </div>
            <a class="btn btn-sure" @click="toStep1">下一步</a>
          </div>
        </div>
        <!-- 验证绑定手机 -->
        <div class="alert alert-newtel" v-else-if="step == 2">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <p class="txt">请输入手机号</p>
            <div class="btn">
              <input class="input" type="text" placeholder="请输入手机号" ref="tel">
            </div>
            <a class="btn btn-sure" @click="toStep2">下一步</a>
          </div>
        </div>
        <!-- 绑定成功 -->
        <div class="alert alert-success" v-else-if="step == 3">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="zw-10"></div>
            <p class="txt">绑定新手机成功</p>
            <router-link :to="{name: 'personal'}" class="btn btn-sure" replace>返回</router-link>
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
        step: 1,
        warning: false,
        tips: '',
        success: false
      };
    },
    methods: {
      toStep1() {
        this.toBlur('pass');
        this.pass = this.$refs.pass.value;
        if (this.pass == '') {
          this.warning = true;
          this.tips = '登录密码不能为空';
          return;
        }
        this.$http.post(api.bdPhoneSurePassword, qs.stringify({
          step: 1,
          password: this.pass
        })).then((res) => {
          res = res.data;
          console.log(res);
          if (res.err_code == 200) {
            this.step = 2;
            this.tmp = res.data.tmp;
          } else {
            this.warning = true;
            this.tips = res.err_msg;
          }
        });
      },
      toStep2() {
        this.toBlur('tel');
        let tel = this.$refs.tel.value;
        // 验证手机号
        if (!(/^1[34578]\d{9}$/.test(tel))) {
          this.warning = true;
          this.tips = '请输入正确的手机号';
          return;
        }
        this.$http.post(api.bdPhoneSurePassword, qs.stringify({
          step: 2,
          tmp: this.tmp,
          mobile: tel
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.step = 3;
            local.set('_bindPhone', tel);
          } else {
            this.warning = true;
            this.tips = res.err_msg;
          }
        });
      },
      toBlur(obj) {
        // 解决安卓软件盘问题
        this.$refs[obj].blur();
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

  .phoneNo-wrap {
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
      .alert-pass {
        .title {
          .icon {
            background-image: url(i_link.png);
          }
        }
        .cont {
          .txt {
            text-align: center;
            padding: 20px 0;
            font-size: 13px;
            color: $fs31;
          }
        }
      }
      .alert-newtel {
        .title {
          .icon {
            background-image: url(i_link.png);
          }
        }
        .cont {
          .txt {
            text-align: center;
            padding: 20px 0;
            font-size: 13px;
            color: $fs31;
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
          .btn-sure {
            margin-top: 0;
          }
        }
      }
    }
  }
</style>
