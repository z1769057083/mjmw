<template>
  <div class="confirm-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" href="javascript:window.history.go(-1)"></a>
      <p class="txt">订单确认</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 无地址 -->
        <router-link class="address-wrap" tag="div" :to="{ name: 'deliveryAddress' }" v-if="!addressObj.id">
          <p class="txt">请输入收货地址</p>
          <i class="btn-go"></i>
        </router-link>
        <!-- 有地址 -->
        <router-link class="address-wrap" tag="div" :to="{ name: 'deliveryAddress' }" v-else>
          <div class="txt-wrap">
            <p class="txt">
              <span class="name">姓名：<s class="color">{{ addressObj.name }}</s></span>
              <span class="tel">电话：<s class="color">{{ addressObj.phone }}</s></span>
            </p>
            <p class="txt">
              <span>地址：<s
                class="color">{{ addressObj.province + '' + addressObj.city + '' + addressObj.district + '' + addressObj.address
                }}</s></span>
            </p>
          </div>
          <i class="btn-go"></i>
        </router-link>
        <div class="pro-show">
          <div class="pro-wrap" ref="ul_hook">
            <ul class="list">
              <li class="list-item" v-for="item in list">
                <img class="img" :src="url + item.item_img_thumb"
                     onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" :alt="item.item_name">
              </li>
            </ul>
          </div>
          <div class="info-wrap">
            <div class="left">共 <s class="color">{{ num }}</s> 件商品</div>
            <div class="center"><s class="color">￥{{ total }}</s></div>
            <router-link tag="div" :to="{ name: 'orderList' }" class="right">
              <span class="txt">商品清单</span>
              <i class="icon"></i>
            </router-link>
          </div>
        </div>
        <div class="com song-info">
          <div class="left">
            <span class="txt">配送信息</span>
            <i class="icon" @click="deliveryMark = !deliveryMark"></i>
          </div>
          <div class="right" @click="chooseAddress" v-if="!addressObj.id">
            <span class="txt">运费</span>
            <i class="icon"></i>
          </div>
          <router-link tag="div" class="right" :to="{ name: 'dispatch' }" v-else>
            <span class="txt">
              运费 <s class="color">{{ express > 0 ? '￥' + express : '包邮' }}</s>
            </span>
            <i class="icon"></i>
          </router-link>
        </div>
        <div class="song-type" v-if="addressObj.id == 0">
          <div class="type">
            <div class="left">配送方式</div>
            <div class="center">
              <div class="l" :class="{ on: deliveryWay == 1 }" @click="deliveryWay = 1">
                <i class="icon"></i>
                <span class="txt">小店送货</span>
              </div>
              <div class="r" :class="{ on: deliveryWay == 0 }" @click="deliveryWay = 0">
                <i class="icon"></i>
                <span class="txt">用户自取</span>
              </div>
            </div>
            <div class="time-btn" :class="{open: !timeFlag}" @click="showTime" v-show="deliveryWay == 1">
              <s class="color">{{ time[0].txt }}</s>
              <i class="icon"></i>
            </div>
            <div style="width: 100px" v-show="deliveryWay == 0"></div>
          </div>
          <div class="time-wrap" v-show="timeFlag && deliveryWay == 1">
            <span class="item" :key="index" v-if="index > 0" v-for="(item, index) in time"
                  @click="chooseTime(item, index)">{{ item.txt }}</span>
          </div>
        </div>
        <div class="com song-info">
          <div class="left">
            <span class="txt">优惠券</span>
          </div>
          <div class="right">
            <span class="txt">
              <s class="color">0</s> 张可用
            </span>
            <i class="icon"></i>
          </div>
        </div>
        <div class="pay-type">
          <h4 class="title">支付方式</h4>
          <div class="item mj">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">美家钻</span>
              <i class="icon2" @click="mjzMark = !mjzMark"></i>
            </div>
            <router-link tag="div" class="right" :to="{ name: 'mjzpay' }">
              <span class="txt">使用 <s class="color">{{ mjb.toFixed(2) }}</s></span>
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
              <i class="icon" :class="{ on: wx }"></i>
            </div>
          </div>
        </div>
        <div class="com song-msg">
          <span class="txt">备注：</span>
          <input class="msg" type="text" v-model="note" maxlength="50" placeholder=" 选填，给商家留言（50字以内）">
        </div>
        <div class="cost-list">
          <h4 class="title">费用清单</h4>
          <div class="txt">
            <span class="left">商品金额</span>
            <s class="color">￥{{ total }}</s>
          </div>
          <div class="txt">
            <span class="left">美家钻</span>
            <s class="color">-{{ mjb.toFixed(2) }}</s>
          </div>
          <div class="txt">
            <span class="left">运费</span>
            <s class="color">￥{{ express }}</s>
          </div>
        </div>
      </div>
    </div>
    <div class="foot-wrap">
      <div class="left">实际付款：￥{{ (total - mjb + express * 1).toFixed(2) }}</div>
      <div class="right" @click="toPay">去支付</div>
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
    <!-- 支付密码设置提示 -->
    <div class="password-mark" v-show="passFlag">
      <div class="alert">
        <div class="title">
          <i class="icon" @click="passFlag = !passFlag"></i>
        </div>
        <div class="cont">
          <div class="txt">为了您的帐户安全，您可前往我的帐户安全<br>设置支付密码。</div>
          <div class="zw-5"></div>
          <router-link class="btn btn-setting" :to="{ name: 'paySetting' }">设置密码</router-link>
          <a class="btn btn-sure" @click="goingPay">继续支付</a>
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
    <!-- 配送说明弹层 -->
    <div class="mark3" v-show="deliveryMark">
      <div class="alert">
        <div class="title"><i class="icon" @click="deliveryMark = !deliveryMark"></i>配送说明</div>
        <div class="cont">
          <p class="item">Q：在每家美物商城购物是免运费吗？</p>
          <p class="item">A：1、每家美物“满198”包邮活动。在单一厂商店铺消费满198元即减免邮费。</p>
          <p class="item">2、如商品详情页公示明确提示，该商品不参加“满198包邮”活动，需要您按运费标准支付运费。</p>
          <p class="item">3、用户购买的商品，以商品详情页公示的运费标准收取。</p>
          <p class="item">4、特殊商品运费到付，具体详情见商品详情页。</p>
          <p class="item">备注：每家美物商城平台致力于为消费者优选商品，提供源头直采的货物，保障消费者可以放心、安心的使用我们为您选择的商品。每一家供应商或合作厂商都会经过我们严格审核。</p>
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
  import api from '../../api';
  import {getStyle, setLocal, getLocal} from '../../common/js/util';
  import local from 'vue-cookie';
  import qs from 'qs';
  import {mapActions} from 'vuex';

  export default {
    data() {
      return {
        url: api.url,
        timeFlag: false,
        deliveryMark: false,
        mjzMark: false,
        list: getLocal('_list'),
        num: getLocal('_num'),
        total: getLocal('_total'),
        goodsNum: getLocal('_goodsNum'),
        goodsNumMJB: getLocal('_goodsNumMJB'),
        express: 0,
        deliveryWay: 1,
        time: [{txt: '任何时间', num: 0}, {txt: '8:00-12:00', num: 8}, {txt: '12:00-14:00', num: 12}, {
          txt: '14:00-16:00',
          num: 14
        }, {txt: '16:00-18:00', num: 16}],
        warning: false,
        tips: '',
        addressObj: getLocal('_address') || {},
        mjb: 0,
        wx: false,
        qeFlag: false,
        passFlag: false,
        note: '',
        cartList: [],
        guid: local.get('guid')
      };
    },
    created() {
      this.getList();
      console.log(this.list, 'list');
      console.log(this.num, 'num');
      console.log(this.total, 'total');
      console.log(this.goodsNum, 'goodsNum');
      console.log(this.goodsNumMJB, 'goodsNumMJB');
    },
    mounted() {
      this.initScroll();
      this.initHorScroll();
      if (this.addressObj.id) {
        this.getExpress();
      }
      this.getMJB();
    },
    methods: {
      ...mapActions(['calcCart']),
      getList() {
        this.$http.post(api.getItem, qs.stringify({
          guid: this.guid
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            res = res.data;
            this.cartList = res.item;
            let tempArr = this.list.map((item) => {
              return item.item_id;
            });
            // 将每一个选中的商品找到删除
            for (let i = 0; i < tempArr.length; i++) {
              let tempPos = this.list.findIndex((item) => {
                return item.item_id == tempArr[i].item_id;
              });
              this.cartList.splice(tempPos, 1);
            }
          }
        });
      },
      goingPay() {
        // 判断是否是送到小店
        let pay = null;
        if (this.mjb === 0) {
          pay = 3;
        } else if (!this.wx && this.express === 0) {
          pay = 1;
        } else {
          pay = '1|3';
        }
        if (this.addressObj.id === '0') {
          // 下订单
          this.$http.post(api.addOrder, qs.stringify({
            item: this.goodsNumMJB,
            address: this.addressObj.id,
            to_store: 1,
            get_pack: this.deliveryWay,
            time: this.deliveryWay === 1 ? this.time[0].num : '',
            pay: pay,
            note: this.note,
            hint: ''
          })).then((res) => {
            res = res.data;
            if (res.err_code === 200) {
              setLocal('_order_id', res.data.order_id);
              setLocal('_pay', pay);
              this.$router.push({name: 'payment'});
            } else {
              this.warning = !this.warning;
              this.tips = res.err_msg;
            }
          });
        } else {
          // 下订单
          this.$http.post(api.addOrder, qs.stringify({
            item: this.goodsNumMJB,
            address: this.addressObj.id,
            to_store: 0,
            pay: pay,
            note: this.note,
            hint: ''
          })).then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              let tempArr = this.list.map((item) => {
                return item.item_id;
              });
              // 立即购买的商品_aa为true
              if (!this.list[0]._aa) {
                this.$http.post(api.delItem, qs.stringify({
                  guid: this.guid,
                  item_id: tempArr.join('|')
                })).then((res) => {
                  res = res.data;
                  if (res.err_code == 200) {
                    this.calcCart(this.cartList);
                  }
                });
              }
              setLocal('_order_id', res.data.order_id);
              setLocal('_pay', pay);
              this.$router.push({name: 'payment'});
            } else {
              this.warning = !this.warning;
              this.tips = res.err_msg;
            }
          });
        }
      },
      toPay() {
        // 判断是否有收货地址
        if (!this.addressObj.id) {
          this.chooseAddress();
          return;
        }
        // 判断是否设置过支付密码
        if (local.get('_paypass') === '0') {
          this.passFlag = !this.passFlag;
          return;
        }
        this.goingPay();
      },
      changeWX() {
        if (this.mjb >= this.total && this.express <= 0) {
          this.qeFlag = !this.qeFlag;
        }
      },
      chooseTime(obj, index) {
        this.time.splice(index, 1, this.time[0]);
        this.time.splice(0, 1, obj);
      },
      chooseAddress() {
        this.warning = !this.warning;
        this.tips = '请选择收货地址';
      },
      showTime() {
        this.timeFlag = !this.timeFlag;
        this.initScroll();
      },
      getMJB() {
        // 获取用户美家币
        this.$http.post(api.purseExpired).then((res) => {
          res = res.data;
          if (res.err_code === 200) {
            this.mjb = res.data.mjb;
            setLocal('_mjb', this.mjb);
            // 计算商品可用美家币
            let temp = 0;
            for (let i = 0; i < this.list.length; i++) {
              if (this.list[i].is_mjb > 0 && this.list[i]._switch) {
                temp += this.list[i].num * this.list[i].mjb_value;
              }
            }
            // 用户可用美家币和商品可用美家币做比较
            if (this.mjb > temp) {
              this.mjb = temp;
            }
            // 比较可用美家币和商品总价
            if (this.mjb < this.total) {
              this.wx = true;
            }
          }
        });
      },
      getExpress() {
        this.$http.post(api.orderExpress, qs.stringify({
          address: this.addressObj.id,
          item: this.goodsNum
        })).then((res) => {
          res = res.data;
          if (res.err_code === 200) {
            this.express = res.data.total;
            // 如果有运费，则微信支付打开
            if (this.express > 0) {
              this.wx = true;
            }
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
      },
      initHorScroll() {
        this.$nextTick(() => {
          let oUl = this.$refs.ul_hook.children[0];
          let oLi = oUl.children;
          let width = (getStyle(oLi[0], 'width') + 8) * oLi.length - 8 + 'px';
          if (parseInt(width) > getStyle(this.$refs.ul_hook, 'width')) {
            oUl.style.width = width;
          } else {
            oUl.style.width = 'auto';
          }
          if (!this.horScroll) {
            this.horScroll = new BScroll(this.$refs.ul_hook, {
              click: true,
              scrollX: true
            });
          } else {
            this.horScroll.refresh();
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
