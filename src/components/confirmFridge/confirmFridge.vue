<template>
  <div class="confirmFridge-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">订单确认</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 无地址 -->
        <router-link class="address-wrap" tag="div" :to="{name: 'deliveryAddress', query: {fridge: true}}"
                     v-if="!addressObj.id">
          <p class="txt">请输入收货地址</p>
          <i class="btn-go"></i>
        </router-link>
        <!-- 有地址 -->
        <router-link class="address-wrap" tag="div" :to="{name: 'deliveryAddress', query: {fridge: true}}" v-else>
          <div class="txt-wrap">
            <p class="txt">
              <span class="name">姓名：<s class="color">{{addressObj.name}}</s></span>
              <span class="tel">电话：<s class="color">{{addressObj.phone}}</s></span>
            </p>
            <p class="txt">
              <span>地址：<s
                class="color">{{addressObj.province + '' + addressObj.city + '' + addressObj.district + '' + addressObj.address}}</s></span>
            </p>
          </div>
          <i class="btn-go"></i>
        </router-link>
        <div class="pro-show">
          <div class="pro-wrap">
            <ul class="list">
              <li class="list-item">
                <img class="img" src="./fridge.jpg" alt="">
              </li>
            </ul>
          </div>
          <div class="info-wrap">
            <div class="left">共 <s class="color">1</s> 件商品</div>
            <div class="center"><s class="color"></s></div>
            <router-link tag="div" :to="{name: 'orderList'}" class="right">
              <span class="txt">商品清单</span>
              <i class="icon"></i>
            </router-link>
          </div>
        </div>
        <div class="com song-info">
          <div class="left" @click="freightMark = !freightMark">
            <span class="txt">配送信息</span>
            <i class="icon"></i>
          </div>
          <router-link tag="div" class="right" :to="{name: 'dispatch', query: {fridge: true}}">
            <span class="txt">
              运费 <s class="color">到货后物流公司收取</s>
            </span>
            <i class="icon"></i>
          </router-link>
        </div>
        <div class="pay-type">
          <h4 class="title">支付方式</h4>
          <div class="item quan">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">冰箱兑换券</span>
            </div>
            <div class="right">
              <i class="icon on"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-wrap" @click="toExchange">
      <div class="right">确认兑换</div>
    </div>
    <!-- 运费说明 -->
    <div class="mark3" v-show="freightMark">
      <div class="alert">
        <div class="title">
          <i class="icon"></i>
          <i class="close" @click="freightMark = !freightMark"></i>
        </div>
        <div class="cont">
          <p class="item-tip">
            <s class="color">运费说明：</s>
            <br>为保障商品安全配送，您的冰箱由物流公司为您配送。根据您填写的配送地址，预计配送费用为￥430元（如需搬运上楼，需另支付搬运费用￥50元）。冰箱到货后，会由物流公司向您收取配送费用，实际配送费用以物流公司收费金额为准。<s
            class="color">如需搬运上楼，需另支付搬运费用￥50元。</s>
          </p>
          <p class="item">
            <s class="color">注：</s>
          </p>
          <p class="item">
            <s class="color">1、</s>如收货方不能及时收货，免费为收货方留仓2天，超过两天收费标准为25元／天／件。
          </p>
          <a class="btn-close" @click="freightMark = !freightMark">关闭</a>
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
  import {getLocal} from '../../common/js/util';
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        freightMark: false,
        addressObj: getLocal('_address') || {},
        warning: false,
        tips: ''
      };
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      toExchange() {
        // 判断是否有收货地址
        if (!this.addressObj.id) {
          this.warning = !this.warning;
          this.tips = '请选择收货地址';
          return;
        }
        // 判断是否中小点地址
        if (this.addressObj.id == 0) {
          this.warning = !this.warning;
          this.tips = '此商品不支持送货到小店';
          return;
        }
        // 下订单
        this.$http.post(api.addOrder, qs.stringify({
          item: '1|1|1',
          address: this.addressObj.id,
          coupon: 1
        })).then((res) => {
          res = res.data;
          let orderId = res.data.order_id;
          if (res.err_code == 200) {
            this.$http.post(api.payOrder, qs.stringify({
              order_id: orderId,
              item: '1|1|1',
              pay: 1
            })).then((res) => {
              console.log(res);
              res = res.data;
              if (res.err_code == 200) {
                this.$router.replace({name: 'myOrder', query: {type: 0}});
              } else {
                this.warning = !this.warning;
                this.tips = res.err_msg;
              }
            });
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
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

  .confirmFridge-wrap {
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
      z-index: 1;
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
      bottom: 45px;
      overflow: hidden;
      .scroll-wrap {
        padding: 5px;
      }
      .com {
        height: 40px;
        margin-top: 5px;
        padding-left: 10px;
        border-radius: $br6;
        background: $bgff;
      }
      .address-wrap {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 40px;
        padding: 5px 0 5px 10px;
        border-radius: $br6;
        background: $bgff;
        box-sizing: border-box;
        .txt-wrap {
          flex: 1;
          .tel {
            padding-left: 5px;
          }
          .color {
            color: $fs43;
          }
        }
        .txt {
          line-height: 20px;
          font-size: 13px;
          color: $fs95;
        }
        .btn-go {
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
          background-image: url(i_right_arrow.png);
        }
      }
      .pro-show {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        .pro-wrap {
          height: 80px;
          padding: 5px 0;
          overflow: hidden;
          background: $bgff;
          .list {
            height: 80px;
            text-align: center;
            white-space: nowrap;
            font-size: 0;
            .list-item {
              display: inline-block;
              width: 78px;
              height: 78px;
              margin-right: 5px;
              border: 1px solid $bdec;
              border-radius: $br6;
              overflow: hidden;
              &:last-child {
                margin-right: 0;
              }
              .img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
        .info-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-top: 1px;
          padding-left: 5px;
          font-size: 13px;
          background: $bgff;
          .color {
            color: $fse5;
          }
        }
        .left {
          color: $fs43;
        }
        .right {
          display: flex;
          align-items: center;
          .txt, .icon {
            height: 30px;
            line-height: 30px;
            color: $fs95;
          }
          .icon {
            width: 30px;
            @include bg(23px 23px);
            background-image: url(i_right_arrow.png);
          }
        }
      }
      .song-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        .left {
          display: flex;
          color: $fs43;
          .txt, .icon {
            height: 30px;
            line-height: 30px;
          }
          .icon {
            width: 30px;
            @include bg(23px 23px);
            background-image: url(i_ask.png);
          }
        }
        .right {
          display: flex;
          .txt, .icon {
            height: 30px;
            line-height: 30px;
          }
          .txt {
            color: $fs95;
            .color {
              color: $fse5;
            }
          }
          .icon {
            width: 30px;
            @include bg(23px 23px);
            background-image: url(i_right_arrow.png);
          }

        }
      }
      .song-type {
        min-height: 40px;
        margin-top: 5px;
        font-size: 13px;
        border-radius: $br6;
        overflow: hidden;
        background: $bgff;
        .type {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 0 10px;
          .center {
            display: flex;
            align-items: center;
            margin-left: -30px;
            .l, .r {
              display: flex;
              height: 30px;
              line-height: 30px;
              color: $fs95;
              &.on {
                .icon {
                  background-image: url(i_checked.png);
                }
              }
              .icon {
                width: 30px;
                height: 30px;
                @include bg(23px 23px);
                background-image: url(i_check.png);
              }
            }
          }
          .time-btn {
            display: flex;
            align-items: center;
            width: 98px;
            height: 20px;
            border: 1px solid $bddc;
            border-radius: $br20;
            &.open {
              .icon {
                background-image: url(i_bottom_arrow.png);
              }
            }
            .color {
              flex: 1;
              text-align: center;
              color: $fse5;
            }
            .icon {
              width: 20px;
              height: 20px;
              margin-right: 5px;
              @include bg;
              background-image: url(i_up_arrow.png);
            }
          }
        }
        .time-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 0 10px;
          background: $bgd1;
          .item {
            height: 20px;
            line-height: 20px;
            padding: 0 8px;
            font-size: 12px;
            color: $fs95;
            border-radius: $br20;
            background: $bgff;
          }
        }
      }
      .song-msg {
        display: flex;
        align-items: center;
        font-size: 13px;
        .txt {
          color: $fs43;
          height: 30px;
          line-height: 30px;
        }
        .msg {
          flex: 1;
          padding-right: 10px;
        }
      }
      .pay-type {
        margin-top: 5px;
        font-size: 13px;
        color: $fs43;
        border-radius: $br6;
        overflow: hidden;
        .title {
          height: 20px;
          line-height: 20px;
          padding-left: 10px;
          background: $bgff;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-top: 1px;
          background: $bgff;
          .left {
            display: flex;
            .icon {
              width: 10px;
              height: 30px;
            }
            .txt {
              height: 30px;
              line-height: 30px;
            }
            .icon2 {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
              background-image: url(i_ask.png);
            }
          }
          &.quan {
            .right {
              display: flex;
              .icon {
                width: 30px;
                height: 30px;
                margin-right: 3px;
                @include bg(23px 23px);
                background-image: url(i_check.png);
                &.on {
                  background-image: url(i_checked.png);
                }
              }
            }
          }
        }
      }
      .cost-list {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        font-size: 13px;
        .title {
          height: 20px;
          line-height: 20px;
          margin-bottom: 1px;
          padding-left: 10px;
          color: $fs43;
          background: $bgff;
        }
        .txt {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 20px;
          padding: 0 10px;
          background: $bgff;
          &:last-child {
            padding-bottom: 4px;
          }
          .left {
            color: $fs95;
          }
          .color {
            color: $fse5;
          }
        }
      }
    }
    .foot-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      width: 100%;
      height: 45px;
      text-align: center;
      font-size: 13px;
      .left {
        flex: 1;
        height: 100%;
        line-height: 45px;
        color: $fse5;
        background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      }
      .right {
        flex: 1;
        color: $fsff;
        height: 100%;
        line-height: 45px;
        background: $bge5;
      }
    }
    .mark3 {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(236, 240, 243, .8);
      .alert {
        width: 298px;
        border-radius: $br20;
        overflow: hidden;
      }
      .title {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        line-height: 40px;
        color: $fs31;
        background: $bgff;
        .icon {
          width: 30px;
          height: 30px;
          @include bg;
          background-image: url(i_car.png);
        }
        .close {
          position: absolute;
          right: 5px;
          top: 50%;
          width: 30px;
          height: 30px;
          margin-top: -15px;
          @include bg(23px 23px);
          background-image: url(i_close.png);
        }
      }
      .cont {
        margin-top: 1px;
        padding-bottom: 10px;
        background: $bgff;
        .color {
          color: $fse5;
        }
        .item-tip {
          line-height: 1.2;
          text-align: justify;
          padding: 10px 32px 12px;
          font-size: 13px;
          color: $fs53;
        }
        .item {
          line-height: 1.4;
          text-align: justify;
          padding: 0 32px 0 55px;
          font-size: 14px;
          color: $fse5;
          .color {
            margin-left: -22px;
          }
        }
        .btn-close {
          display: block;
          width: 274px;
          line-height: 48px;
          text-align: center;
          margin: 15px auto 0;
          font-size: 13px;
          color: $fse5;
          border: 1px solid $bddc;
          border-radius: $br50;
        }
      }
    }
  }
</style>
