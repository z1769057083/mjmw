<template>
  <div class="bindFridge-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">绑定智能设备</p>
    </header>
    <!-- 主体信息 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="scan-tips">
          <i class="icon"></i>
          <span class="txt">请将二维码对准扫码框进行冰箱绑定</span>
        </div>
        <div class="zw-90"></div>
        <div class="alert">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="item">
              <s class="color">冰箱编码:</s>{{info.equipment.uuid}}


            </div>
            <div class="item">
              <s class="color">姓名:</s>
            </div>
            <div class="item">
              <s class="color">家庭地址:</s>
            </div>
            <div class="item">
              <s class="color">联系电话:</s>
            </div>
            <div class="item">
              <s class="color">专属服务店地址:</s>{{info.store.address}}


            </div>
            <div class="item">
              <s class="color">专属服务店电话:</s>{{info.store.phone}}


            </div>
            <a class="btn btn-back" @click="$router.back()">返回</a>
            <a class="btn btn-sure" @click="bindFridge">确认</a>
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
  import local from 'vue-cookie';
  import qs from 'qs';

  export default {
    data() {
      return {
        info: this.$route.query.info,
        warning: false,
        tips: ''
      };
    },
    mounted() {
      this.initScroll();
      if (!this.info) {
        this.$router.replace({name: 'home'});
      }
    },
    methods: {
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
      },
      bindFridge() {
        this.$http.post(api.scanFridgeLogin, qs.stringify({
          fridge: this.info._str,
          do: 1
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            local.set('_equipmentId', res.data.account.equipment_id, 365);
            this.$router.replace({name: 'fridgeSetting'});
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .bindFridge-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgff;
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
      .zw-90 {
        height: 90px;
      }
      .scroll-wrap {
        padding: 5px;
      }
      .scan-tips {
        display: flex;
        align-items: center;
        height: 30px;
        padding-left: 5px;
        font-size: 13px;
        color: $fsff;
        border-radius: $br6;
        overflow: hidden;
        background: $bge5;
        .icon {
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
          background-image: url(i_scan.png);
        }
        .txt {
          height: 30px;
          line-height: 30px;
          padding-left: 5px;
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
            background-image: url(i_fridge.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          font-size: 13px;
          background: $bgff;
          .item {
            height: 30px;
            line-height: 30px;
            padding: 0 5px 0 23px;
            color: $fs53;
            border-bottom: 1px solid $bddc;
            @extend .dot;
            .color {
              margin-right: 10px;
              color: $fs95;
            }
          }
          .btn {
            display: block;
            width: 274px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin: 10px auto 0;
            border: 1px solid $bddc;
            border-radius: $br50;
            overflow: hidden;
          }
          .btn-back {
            color: $fs95;
          }
          .btn-sure {
            color: $fse5;
          }
        }
      }
    }
  }
</style>
