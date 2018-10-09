<template>
  <div class="nick-wrap">
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">设置中心</p>
    </header>
    <div class="setup_con">
      <div class="setup_box">
        <div class="set_title">
          <div class="set_img">
            <img src="./mj_logo.png" alt="" class="set_bg">
          </div>
          <div class="set_name">
            <img src="./txt_logo.png" alt="" class="name_bg">
          </div>
          <p class="set_about">关于我们</p>
        </div>
      </div>
    </div>
    <div class="info_push">
      <span class="info_le">信息推送</span>
      <div class="info_ri">
        <input type="checkbox" id="info_chk" class="info_inp">
        <label for="info_chk" class="info_label">
          <div class="info_box"></div>
        </label>
      </div>
    </div>
    <div class="sign_out" @click="signOut">
      <a class="out_font">退出登录</a>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning" v-if="tips != 'TOKEN错误！'">关闭</a>
      <router-link slot="btn" class="btn" :to="{name: 'login'}" v-else>请重新登录</router-link>
    </vtoastw>
  </div>
</template>

<script>
  import api from '../../api';
  import {setLocal} from '../../common/js/util';
  import local from 'vue-cookie';

  export default {
    data() {
      return {
        warning: false,
        tips: ''
      };
    },
    methods: {
      signOut() {
        // 验证信息
        this.$http.post(api.userSignOut)
          .then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              local.set('_online', false, 365);
              setLocal('_address', {});
              this.$router.push({name: 'home', params: {back: true}});
            } else {
              this.warning = true;
              this.tips = res.err_msg;
            }
          })
          .catch(() => {
            this.warning = true;
            this.tips = api.warning;
          });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .nick-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgec;
    .head-wrap {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      @include bg(65px 15px);
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
    .setup_con {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .setup_box {
        padding: 5px;
      }
    }
    .set_title {
      width: 100%;
      text-align: center;
      .set_img {
        margin: 20px auto;
        width: 150px;
        height: 150px;
        .set_bg {
          height: 100%;
          width: 100%;
        }
      }
      .set_name {
        width: 65px;
        height: 15px;
        margin: 19px auto 40px;
        .name_bg {
          height: 100%;
          width: 100%;
        }
      }
      .set_about {
        text-align: center;
        font-size: 13px;
        line-height: 16px;
        color: $fs31;
      }
    }
    .info_push {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: absolute;
      left: 5px;
      right: 5px;
      bottom: 50px;
      height: 40px;
      box-sizing: border-box;
      background: $bgff;
      border-radius: $br6;
      .info_le {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
        color: $fs31;
        padding-left: 13px;
      }
      .info_ri {
        margin-right: 10px;
        height: 20px;
        width: 40px;
        .info_inp {
          display: none;
          & + .info_label {
            width: 40px;
            height: 20px;
            display: block;
            background: $bg95;
            border-radius: 100px;
            position: relative;
            transition-timing-function: ease;
            transition-duration: 0.2s;
          }
          &:checked + .info_label {
            background: $bge5;
            .info_box {
              left: 22px;
            }
          }
        }
        .info_box {
          width: 16px;
          height: 16px;
          border-radius: 100px;
          background-color: $bgff;
          position: absolute;
          top: 2px;
          left: 2px;
          transition-timing-function: ease;
          transition-duration: 0.2s;
        }
      }
    }
    .sign_out {
      position: absolute;
      right: 5px;
      left: 5px;
      bottom: 5px;
      height: 40px;
      box-sizing: border-box;
      background: $bge5;
      border-radius: $br6;
      .out_font {
        line-height: 40px;
        display: block;
        height: 100%;
        width: 100%;
        text-align: center;
        font-size: 13px;
        color: $fsff;
      }
    }
  }
</style>
