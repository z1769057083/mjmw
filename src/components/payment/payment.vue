<template>
  <div class="payment-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <router-link class="back pos" :to="{name: 'myOrder', query: { type: 0 }}"></router-link>
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
              <input class="input" v-model="pass" type="password" placeholder="请输入6位数字支付密码" @click="isFocus = true">
            </div>
            <div class="third-text" v-show="isThird && isFocus">您正在输入美家钻支付密码，美家钻支付成功后将进入<s class="color">微信</s>平台支付订单中剩余金额。
            </div>
            <router-link class="btn btn-forget" :to="{name: !isBindPhone ? 'phoneBind' : 'paySettingEdit' }">忘记密码</router-link>
            <a class="btn btn-sure" @click="toPay">确认</a>
          </div>
        </div>
      </div>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
    <!-- 错误框 -->
    <vtoaste v-show="error">
      <div slot="txt" class="txt" v-if="num < 4">抱歉，您输入的密码错误<br/>还有<s class="color">{{5 - num}}</s>次机会</div>
      <div slot="txt" class="txt" v-else-if="num == 4">抱歉，您输入的密码错误，您仅剩<s class="color">{{5 - num}}</s>次机会<br/>为保障您的账户安全，若再次出现错误，<br/>您账户内的美家钻将冻结。





      </div>
      <div slot="txt" class="txt" v-else-if="num > 4">
        抱歉，您输入的密码错误，您今日密码输<br/>入错误已达5次，为保障您的账户安全，您<br/>账户内的美家钻已冻结。您可致电每家美<br/>物客服<s class="color">4001-688-521</s>进行解冻。





      </div>
      <router-link slot="btn" class="btn color" :to="{name: !isBindPhone ? 'phoneBind' : 'paySettingEdit' }" v-if="num < 5">忘记密码</router-link>
      <a slot="btn" class="btn" @click="error = !error">返回</a>
    </vtoaste>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {getLocal} from '../../common/js/util';
  import local from 'vue-cookie';

  export default {
    data() {
      return {
        pass: '',
        warning: false,
        tips: '',
        error: false,
        num: 0,
        isThird: false,
        isFocus: false,
        isBindPhone: local.get('_bindPhone')
      };
    },
    mounted() {
      // 解决安卓输入框上移露白问题
      document.body.style.background = '#ecf0f3';
      this.initScroll();
      console.log(getLocal('_pay'), '_pay');
      if (getLocal('_pay') != 1) {
        this.isThird = true;
      }
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
      toPay() {
        // 验证是否输入6位纯数字密码
        if (!/^\d{6}$/.test(this.pass)) {
          this.warning = !this.warning;
          this.tips = '请输入6位纯数字密码';
          return;
        }
        // 验证支付是否成功
        this.$http.post(api.payOrder, qs.stringify({
          order_id: getLocal('_order_id'),
          item: getLocal('_goodsNumMJB'),
          pay: getLocal('_pay'),
          pass: this.pass
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            if (res.data.amount > 0) {
              this.$http.post(api.payMoney, qs.stringify({
                order_id: getLocal('_order_id'),
                amount: res.data.amount,
                pay_no: res.data.pay_no,
                method: 3
              })).then((res) => {
                res = res.data;
                if (res.err_code == 200) {
                  window.location.href = api.wxPay + res.data;
                } else {
                  this.$router.push({name: 'confirmID', query: {id: getLocal('_order_id')}});
                }
              }).catch((err) => {
                console.log(err, 'err');
              });
            } else {
              this.$router.replace({name: 'paySuccess'});
            }
          } else {
            this.error = !this.error;
            this.num = res.data.err_num;
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .payment-wrap {
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
          .third-text {
            padding: 0 30px;
            text-align: justify;
            line-height: 18px;
            margin-top: 10px;
            font-size: 13px;
            color: $fs95;
            .color {
              color: $fse5;
            }
          }
          .input {
            display: flex;
            width: 100%;
            height: 100%;
            padding: 0 20px;
            font-size: 13px;
            box-sizing: border-box;
          }
          .btn-forget {
            line-height: 48px;
            text-align: center;
            margin-top: 10px;
            color: $fs3d;
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
