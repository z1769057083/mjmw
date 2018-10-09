<template>
  <div class="mine-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <router-link :to="{name: 'home'}" class="back pos"></router-link>
      <p class="txt">我的</p>
    </header>
    <div class="mine-cont" ref="scroll_hook">
      <div class="mine-hook">
        <section class="ay_title">
          <router-link :to="{name: 'nickname'}" class="tit_p" tag="p">
            <img v-if="fragimg != ''" :src="fragimg" alt="" class="img">
            <img v-else src="" alt="" class="img">
          </router-link>
          <div class="tit_name">{{pro.nickname != '' ? pro.nickname : '昵称'}}</div>
        </section>
        <section class="ay_main">
          <section class="ay_wallet">
            <router-link :to="{name: 'wallet'}" class="wa_le" tag="p">
              <span class="wa_sp"></span>
              <p class="wa_p">我的钱包</p>
            </router-link>
            <router-link :to="{name: 'mjz'}" class="wa_cen" tag="div">
              <p class="wa_cenbox">
                <em class="cenbox_bg"></em>
                <i class="cenbox_mj">美家钻</i>
                <b class="cenbox_mon">{{balance}}</b>
              </p>
            </router-link>
            <div class="wa_ri" @click="rechonge">
              <span class="ri_bg"></span>
              <p class="ri_change">充值</p>
            </div>
          </section>
          <section class="ay_order">
            <router-link :to="{name: 'myOrder', query: { type : 0 }}" class="order_le" tag="div">
              <span class="le_to"></span>
              <p class="le_bo">我的订单</p>
            </router-link>
            <div class="order-ri">
              <router-link :to="{name: 'myOrder', query: { type : 3 }}" class="order_root" tag="a">
                待收货<b class="radius" v-if="ordernum.unget_num > 0">{{ordernum.unget_num}}</b>
              </router-link>
              <router-link :to="{name: 'myOrder', query: { type : 5 }}" class="order_root" tag="a">待评价<b
                class="radius" v-if="ordernum.uncomm_num > 0">{{ordernum.uncomm_num}}</b></router-link>
              <router-link :to="{name: 'myOrder', query: { type : 0 }}" class="order_root" tag="a">全部订单




              </router-link>
              <router-link :to="{name: 'myOrder', query: { type : 2 }}" class="order_root" tag="a">待发货<b
                class="radius" v-if="ordernum.undeliv_num > 0">{{ordernum.undeliv_num}}</b></router-link>
              <router-link :to="{name: 'myOrder', query: { type : 1 }}" class="order_root" tag="li">待付款<b
                class="radius" v-if="ordernum.unpay_num > 0">{{ordernum.unpay_num}}</b></router-link>
              <a class="order_root" @click="change_show = true">退换货</a>
            </div>
          </section>
          <ul class="ay_mineb">
            <router-link :to="{name: 'collection'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">我的收藏</p>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'confirmq'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp">
                    <b class="radius radtop" v-show="total > 0">{{total}}</b>
                  </span>
                  <p class="link_p">优惠券</p>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'entityCard'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">兑换卡</p>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'historical'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">历史足迹</p>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'deliveryAddress', query: {personal: true}}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">我的地址</p>
                </div>
              </div>
            </router-link>
            <li class="temp_li" @click="checkFridge">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">智能设备</p>
                </div>
              </div>
            </li>
            <router-link :to="{name: 'help'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">帮助</p>
                </div>
              </div>
            </router-link>
            <router-link :to="{name: 'setup'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">设置</p>
                </div>
              </div>
            </router-link>
            <li class="temp_li" @click="has_show = true">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">客服</p>
                </div>
              </div>
            </li>
            <router-link :to="{name: 'account'}" class="temp_li" tag="li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">账户安全</p>
                </div>
              </div>
            </router-link>
            <li class="temp_li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">关注公众号</p>
                </div>
              </div>
            </li>
            <li class="temp_li">
              <div class="bloc_box">
                <div class="bloc_link">
                  <span class="link_sp"></span>
                  <p class="link_p">更多功能</p>
                </div>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
    <!--客服弹框-->
    <div class="ay_mask" v-show="has_show">
      <div class="ay_info_box">
        <h4 class="tips_title">
          <span class="tips_icon phone_bg"></span>
          <span class="tips_close" @click="has_show = false"></span>
        </h4>
        <div class="sub_info_box">
          <p class="last_tips_txt">请拨打客服电话进行退换货</p>
          <p class="tel_con">400 168 8521</p>
          <div class="item_btn">
            <a href="tel:4001688521" class="btn_a">立即拨打</a>
          </div>
        </div>
      </div>
    </div>
    <!--退换货弹框-->
    <div class="ay_mask" v-show="change_show">
      <div class="ay_info_box">
        <h4 class="tips_title">
          <span class="tips_icon change_bg"></span>
          <span class="tips_close" @click="change_show = false"></span>
        </h4>
        <div class="sub_info_box">
          <p class="last_tips_txt">请拨打客服电话进行退换货</p>
          <p class="tel_con">400 168 8521</p>
          <div class="item_btn">
            <a href="tel:4001688521" class="btn_a">立即拨打</a>
          </div>
        </div>
      </div>
    </div>
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
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
        warning: false,
        tips: '',
        has_show: false,
        change_show: false,
        pro: [],
        balance: 0,
        ordernum: {},
        fragimg: '',
        total: 0
      };
    },
    created() {
      this.$http.post(api.wx, qs.stringify({
        url: api.wxUrl
      })).then((res) => {
        res = res.data;
        this.$wechat.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['getLocation', 'scanQRCode']
        });
      });
    },
    mounted() {
      this._balance();
      this._indexAjax();
      this._ordernum();
      this._confirmq();
      this._iscorll();
    },
    methods: {
      checkFridge() {
        if (local.get('_equipmentId') == 0) {
          let _this = this;
          this.$wechat.scanQRCode({
            needResult: 1,
            desc: 'scanQRCode desc',
            success(res) {
              let result = res.resultStr;
              // 判断是绑定渠道还是绑定冰箱
              let flag = result.indexOf('mjmw365-icebox');
              if (flag > -1) {
                _this.$http.post(api.scanFridgeLogin, qs.stringify({
                  fridge: result.replace(/mjmw365-icebox/, ''),
                  do: 0
                })).then((res) => {
                  res = res.data;
                  if (res.err_code == 200) {
                    res.data._str = result.replace(/mjmw365-icebox/, '');
                    _this.$router.push({name: 'bindFridge', query: {info: res.data}});
                  }
                });
                return;
              }
            }
          });
        } else {
          this.$router.push({name: 'fridgeSetting'});
        }
      },
      // 点击充值
      rechonge () {
        let _this = this;
        if (local.get('_isCh') != 1) {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.push({name: 'bindChannel', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        } else {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.push({name: 'recharge', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        }
      },
      // 调取优惠券个数
      _confirmq() {
        this.$http.post(api.couponList, qs.stringify({
          flag: 0
        })).then(res => {
          if (res.data.err_code === 200) {
            this.total = res.data.data.total;
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      _indexAjax() {
        this.$http.post(api.proFile).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.pro = res.profile;
            this.fragimg = res.profile.photo_img_url;
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      _iscorll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true,
              probeType: 3
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 获取美家币余额
      _balance() {
        this.$http.post(api.purseExpired).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.balance = res.mjb;
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 获取订单的数量
      _ordernum() {
        this.$http.post(api.orderList).then(res => {
          if (res.data.err_code === 200) {
            res = res.data.data;
            this.ordernum = res;
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .mine-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
    background: $bgec;
    //圆角样式
    .radius {
      position: absolute;
      left: 66%;
      top: 12%;
      line-height: 12px;
      text-align: center;
      padding: 3px 6px;
      font-size: 12px;
      color: $fsff;
      border-radius: 100px;
      background: $bge5;
      transform: scale(0.6);
    }
    //弹层样式
    .ay_mask {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 41px;
      right: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(238, 242, 245, 0.8);
      .ay_info_box {
        width: 298px;
        padding-bottom: 10px;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
        .tips_title {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid $bdec;
          position: relative;
          .tips_icon {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-left: -15px;
            margin-top: -15px;
          }
          .tips_close {
            position: absolute;
            right: 5px;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-top: -15px;
          }
        }
        .sub_info_box {
          width: 274px;
          margin: 0 auto;
          .last_tips_txt {
            padding: 20px 15px 10px;
            line-height: 1.5;
            text-align: center;
            font-size: 13px;
            color: $fs31;
          }
          .item_btn {
            height: 48px;
            margin-top: 10px;
            border: 1px solid $bdec;
            border-radius: $br24;
            overflow: hidden;
            position: relative;
            .btn_a {
              display: block;
              width: 100%;
              height: 100%;
              line-height: 48px;
              text-align: center;
              font-size: 13px;
              color: $fse5;
            }
          }
        }
      }
    }
    .head-wrap {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      @include bg(65px 15px);
      background-color: $bgff;
      box-shadow: inset 0 -1px 0 #dcdfe2;
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
    .mine-cont {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .ay_title {
        width: 100%;
        background: url("i_mine_bg.png") repeat-x;
        background-size: contain;
        overflow: hidden;
        .tit_p {
          display: block;
          margin: 24px auto 10px;
          width: 50px;
          height: 50px;
          border-radius: 100%;
          background: url(i_avatar.png) no-repeat;
          background-size: 100%;
          overflow: hidden;
          .img {
            width: 100%;
            height: 100%;
          }
        }
        .tit_name {
          font-size: 10px;
          height: 12px;
          color: $fs31;
          text-align: center;
          overflow: hidden;
          padding: 8px 0 16px;
        }
      }
    }
    .ay_main {
      width: 100%;
      box-sizing: border-box;
      padding: 0 5px;
      box-sizing: border-box;
      background: $bgec;
      overflow: hidden;
    }
    .ay_wallet {
      display: flex;
      width: 100%;
      padding: 12px 0 0;
      height: 80px;
      box-sizing: border-box;
      background: $bgff;
      border-radius: $br6;
      margin-bottom: 5px;
      .wa_le {
        width: 24%;
        flex-shrink: 0;
        .wa_sp {
          display: block;
          width: 35px;
          height: 35px;
          margin: 0 auto;
          background: url(i_wallet.png) no-repeat center;
          background-size: contain;
        }
        .wa_p {
          line-height: 20px;
          font-size: 10px;
          color: $fs53;
          text-align: center;
          margin-top: 8px;
        }
      }
      .wa_cen {
        border-left: 1px solid #e5e5e5;
        border-right: 1px solid #e5e5e5;
        flex-grow: 1;
        width: 5%;
        margin-bottom: 12px;
        box-sizing: border-box;
        .wa_cenbox {
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 0;
          overflow: hidden;
          .cenbox_bg {
            display: inline-block;
            margin: 8px 0 0;
            width: 20px;
            height: 15px;
            background: url(i_diamonds.png) no-repeat;
            background-size: contain;

          }
          .cenbox_mj {
            display: block;
            box-sizing: border-box;
            font-size: 10px;
            color: $fs53;
            margin: 5px 0 5px;

          }
          .cenbox_mon {
            display: block;
            color: $bge5;
            font-size: 12px;
          }
        }
      }
      .wa_ri {
        width: 24%;
        flex-shrink: 0;
        .ri_bg {
          display: block;
          width: 35px;
          height: 35px;
          margin: 0 auto 7px;
          background: url(i_card.png) no-repeat center;
          background-size: contain;
        }
        .ri_change {
          line-height: 20px;
          font-size: 10px;
          color: $fs53;
          text-align: center;
        }
      }
    }
    .ay_order {
      display: flex;
      width: 100%;
      padding: 12px 0px;
      height: 80px;
      margin-bottom: 5px;
      box-sizing: border-box;
      background: $bgff;
      border-radius: $br6;
    }
    .order_le {
      width: 24%;
      flex-shrink: 0;
      .le_to {
        display: block;
        width: 35px;
        height: 35px;
        margin: 0 auto;
        background: url(i_order.png) no-repeat center;
        background-size: contain;
      }
      .le_bo {
        line-height: 20px;
        font-size: 10px;
        color: $fs53;
        text-align: center;
        margin-top: 8px;
      }
    }
    .order-ri {
      flex-grow: 1;
      flex-shrink: 0;
      width: 5%;
      display: flex;
      flex-wrap: wrap;
      border-left: 1px solid #e5e5e5;
      align-items: center;
      justify-content: space-around;
      .order_root {
        display: block;
        position: relative;
        width: 33.3%;
        text-align: center;
        font-size: 10px;
        line-height: 30px;
        color: $fs53;
        height: 30px;
      }
    }
    .ay_mineb {
      display: flex;
      flex-wrap: wrap;
      overflow: hidden;
      .temp_li {
        width: calc((100% - 15px) / 4);
        box-sizing: border-box;
        border-radius: $br6;
        background: $bgff;
        margin-bottom: 5px;
        margin-right: 5px;
        &:nth-of-type(4n) {
          margin-right: 0;
        }
        .bloc_box {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 100%;
          .bloc_link {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .link_sp {
              display: block;
              width: 35px;
              height: 35px;
              margin: 10px auto 0;
              position: relative;
              .radtop {
                top: -10%;
                left: 60%;
              }
            }
            .link_p {
              line-height: 20px;
              font-size: 10px;
              color: $fs53;
              text-align: center;
              margin-top: 8px;
            }
          }
        }
        &:nth-of-type(1) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_collect.png");
        }
        &:nth-of-type(2) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_coupon.png");
        }
        &:nth-of-type(3) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_chcard.png");
        }
        &:nth-of-type(4) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_footmark.png");
        }
        &:nth-of-type(5) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_address.png");
        }
        &:nth-of-type(6) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_device.png");
        }
        &:nth-of-type(7) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_help.png");
        }
        &:nth-of-type(8) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_settings.png");
        }
        &:nth-of-type(9) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_phone.png");
        }
        &:nth-of-type(10) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_safety.png");
        }
        &:nth-of-type(11) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_follow.png");
        }
        &:nth-of-type(12) .link_sp {
          @include bg(35px 35px);
          background-image: url("i_expect.png");
        }
      }
    }
    .phone_bg {
      @include bg(30px 30px);
      background-image: url("i_dial.png");
    }
    .change_bg {
      @include bg(30px 30px);
      background-image: url("i_exchange.png");
    }
    .tips_close {
      @include bg(24px 24px);
      background-image: url("i_close.png");
    }
    .tel_con {
      font-size: 18px;
      color: $fse5;
      text-align: center;
    }
  }
</style>
