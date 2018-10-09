<template>
  <div class="confirm-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">确认支付</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="cost-list">
          <h4 class="title">费用清单</h4>
          <div class="txt">
            <span class="left">商品金额</span>
            <s class="color">￥{{total}}</s>
          </div>
          <div class="txt">
            <span class="left">美家钻</span>
            <s class="color">-{{mjb.toFixed(2)}}</s>
          </div>
          <div class="txt">
            <span class="left">运费</span>
            <s class="color" v-if="isTips">{{express == 0 ? '运费到付' : '￥' + express + '+运费到付'}}</s>
            <s class="color" v-else>{{express == 0 ? '包邮' : '￥' + express}}</s>
          </div>
          <div class="txt">
            <span class="left color">实付款</span>
            <s class="color">￥{{(total - mjb + express * 1).toFixed(2)}}</s>
          </div>
        </div>
        <div class="pay-type">
          <h4 class="title">支付方式</h4>
          <div class="item mj" v-if="listId.is_pay != 2">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">美家钻</span>
              <i class="icon2" @click="mjzMark = !mjzMark"></i>
            </div>
            <router-link tag="div" class="right" :to="{name: 'mjzpay'}">
              <span class="txt">使用 <s class="color">{{mjb.toFixed(2)}}</s></span>
              <!--<span class="no-support">此商品不支持美家钻</span>-->
              <i class="icon"></i>
            </router-link>
          </div>
          <div class="item wx">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">微信支付</span>
            </div>
            <div class="right" @click="changeWX">
              <i class="icon" :class="{on: wx}"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-wrap">
      <div class="right" @click="toPay">确认</div>
    </div>
    <!-- 美家钻全额支付弹层 -->
    <div class="mark" v-show="qeFlag">
      <div class="alert">
        <div class="title">
          <i class="icon"></i>
          <!--<i class="close"></i>-->
        </div>
        <div class="cont">
          <p class="txt">该订单商品已设置为美家钻全额支付，<br>若需更换支付方式，<br>请先关闭美家钻支付设置开关。</p>
          <a class="btn-know" @click="qeFlag = !qeFlag">我知道了</a>
        </div>
      </div>
    </div>
    <!-- 美家钻弹层 -->
    <div class="mark2" v-show="mjzMark">
      <div class="alert">
        <div class="title"><i class="icon" @click="mjzMark = !mjzMark"></i>配送说明</div>
        <div class="cont">
          <p class="item">当您账户美家钻余额不足时，系统将默认为现金支付。</p>
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
  import {setLocal, getLocal} from '../../common/js/util';
  import local from 'vue-cookie';
  import qs from 'qs';

  export default {
    data() {
      return {
        mjzMark: false,
        listId: getLocal('__listId'),
        list: getLocal('_list'),
        num: getLocal('_num'),
        total: getLocal('_total'),
        goodsNum: getLocal('_goodsNum'),
        goodsNumMJB: getLocal('_goodsNumMJB'),
        express: getLocal('_expressfee'),
        deliveryWay: 1,
        warning: false,
        tips: '',
        mjb: 0,
        wx: false,
        qeFlag: false,
        note: '',
        cartList: [],
        guid: local.get('guid')
      };
    },
    computed: {
      isTips() {
        return this.list.find((item) => {
          return item.supplier_id == 48;
        });
      }
    },
    mounted() {
      this.initScroll();
      this.getMJB();
      if (this.express > 0) {
        this.wx = true;
      } else {
        this.wx = false;
      }
    },
    methods: {
      getMJB() {
        // 获取用户美家币
        this.$http.post(api.purseExpired).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.mjb = res.data.mjb;
            setLocal('_mjb', this.mjb);
            // 计算商品可用美家币
            let temp = 0;
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].is_mjb > 0 && this.list[i]._switch) {
                if (this.list[i].is_mjb == 1) {
                  temp += this.list[i].num * this.list[i].item_price;
                } else {
                  temp += this.list[i].num * this.list[i].mjb_value;
                }
              }
            }
            if (this.listId.pay) {
              for (let i = 0; i < this.listId.pay.length; i++) {
                if (this.listId.pay[i].payment_method_id == 1) {
                  this.mjb = this.listId.pay[i].sum * 1;
                }
              }
            } else {
              // 用户可用美家币和商品可用美家币做比较
              if (this.mjb > temp) {
                this.mjb = temp;
              }
            }
            // 比较可用美家币和商品总价
            if (this.mjb < this.total) {
              this.wx = true;
            }
          }
        });
      },
      toPay() {
        setLocal('_order_id', this.listId.order_id);
        let pay = null;
        if (!this.listId.pay) {
          if (this.mjb == 0) {
            pay = 3;
          } else if (!this.wx && this.express == 0) {
            pay = 1;
          } else {
            pay = '1|3';
          }
        } else {
          pay = 3;
        }
        setLocal('_pay', pay);
        // 判断是否设置过支付密码
        if (pay != 3 && local.get('_paypass') > 0) {
          this.$router.push({name: 'payment'});
        } else {
          // 验证支付是否成功
          this.$http.post(api.payOrder, qs.stringify({
            order_id: this.listId.order_id,
            item: this.goodsNumMJB,
            pay: pay
          })).then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              if (res.data.amount > 0) {
                this.$http.post(api.payMoney, qs.stringify({
                  order_id: res.data.order_id,
                  amount: res.data.amount,
                  pay_no: res.data.pay_no,
                  method: 3
                })).then((ress) => {
                  ress = ress.data;
                  if (ress.err_code == 200) {
                    window.location.href = api.wxPay + ress.data;
                  } else {
                    this.$router.replace({name: 'confirmID', query: {id: res.data.order_id}});
                  }
                });
              } else {
                this.$router.replace({name: 'paySuccess'});
              }
            }
          });
        }
      },
      changeWX() {
        if (this.mjb >= this.total && this.express <= 0) {
          this.qeFlag = !this.qeFlag;
        }
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

  .confirm-wrap {
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
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
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
          &.mj {
            .left {
              .icon {
                background-image: url(i_mj.png);
              }
            }
            .right {
              display: flex;
              .txt {
                height: 30px;
                line-height: 30px;
                .color {
                  color: $fse5;
                }
              }
              .no-support {
                height: 30px;
                line-height: 30px;
                color: $fs95;
              }
              .icon {
                width: 30px;
                height: 30px;
                @include bg(23px 23px);
                background-image: url(i_right_arrow.png);
              }
            }
          }
          &.wx {
            .left {
              .icon {
                background-image: url(i_wx.png);
              }
            }
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
      .right {
        flex: 1;
        color: $fsff;
        height: 100%;
        line-height: 45px;
        background: $bge5;
      }
    }
    .mark {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(236, 240, 243, .8);
      .alert {
        width: 298px;
        font-size: 13px;
        border-radius: $br20;
        overflow: hidden;
        .title {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          background: $bgff;
          .icon {
            width: 30px;
            height: 30px;
            @include bg;
            background-image: url(i_warp.png);
          }
          .close {
            position: absolute;
            right: 5px;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-top: -15px;
            @include bg;
            background-image: url(i_close.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .txt {
            line-height: 17px;
            text-align: center;
            padding: 40px 0;
            color: $fs53;
          }
          .btn-know {
            display: block;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin: 0 10px;
            color: $fse5;
            border: 1px solid $bdec;
            border-radius: $br50;
          }
        }
      }
    }
    .mark2, .mark3 {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(236, 240, 243, .8);
      .alert {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        border-top-left-radius: $br6;
        border-top-right-radius: $br6;
        background: $bgff;
      }
      .title {
        position: relative;
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 16px;
        color: $fs31;
        .icon {
          position: absolute;
          left: 10px;
          top: 50%;
          width: 30px;
          height: 30px;
          margin-top: -15px;
          @include bg(23px 23px);
          background-image: url(i_left_back.png);
        }
      }
      .cont {
        padding: 0 30px 30px;
        .item {
          line-height: 20px;
          text-align: justify;
          font-size: 12px;
          color: $fs43;
        }
      }
    }
    .password-mark {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(236, 240, 243, .8);
      .alert {
        width: 298px;
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
            background-image: url(i_key.png);
          }
        }
        .cont {
          padding: 15px 0 10px;
          margin-top: 1px;
          font-size: 13px;
          background: $bgff;
          .txt {
            line-height: 1.3;
            text-align: center;
            color: $fs31;
          }
          .zw-5 {
            height: 5px;
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
          }
          .btn-setting {
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
