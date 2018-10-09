<template>
  <div class="mine-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <router-link :to="{name: 'personal'}" class="back pos"></router-link>
      <p class="txt">账户充值</p>
    </header>
    <div class="mine-recharge" ref="scroll_hook" v-show="agency_id != -1">
      <div>
        <ul class="mlist">
          <li class="line wei">
            <span class="name">微信充值</span>
            <!--<div class="chec" :class="{'active': check}" @click="check = !check">-->
            <!--<b class="bac"></b>-->
            <!--</div>-->
            <div class="chec active">
              <b class="bac"></b>
            </div>
          </li>
        </ul>
        <div class="content">
          <ul class="ul_price">
            <li v-if="agency_id == 10 || agency_id == 11" class="pri" :class="{'active': flag == 6900}"
                @click="change(6900)">6900元
            </li>
            <li v-else class="pri" :class="{'active': flag == 6999}" @click="change(6999)">6999元</li>
            <li class="pri" :class="{'active': flag == 1}" @click="change(1)">其他金额</li>
          </ul>
          <div class="mbmoney" v-show="monery">
            <span class="rech_mon">金额</span>
            <input type="number" placeholder="  请输入美家钻充值金额" class="inp" v-model.number="price" v-model="text"
                   ref="telpro">
          </div>
          <p class="mbrec" @click="recharge">充值</p>
          <div class="agree">
            <div class="ag_le" @click="chon = !chon">
              <span class="le_sp" :class="{'active': chon}"></span>
            </div>
            <router-link :to="{name: 'agree6900'}" class="ag_ri" v-if="this.flag == 6900">同意充值换购预存协议</router-link>
            <router-link :to="{name: 'agree6999'}" class="ag_ri" v-else-if="this.flag == 6999">同意充值换购预存协议</router-link>
            <router-link class="ag_ri" :to="{name: 'agreelse'}" v-else>同意充值换购预存协议</router-link>
          </div>
          <!--已参加-->
          <div class="article" v-if="order_id > 0">
            <p class="art_p">天小美温馨提示：鉴于部分银行卡有支付金额限制，请您充值前先确保充值金额在银行限额之内，以便顺利充值。</p>
          </div>
          <!--未参加深圳水卡-->
          <div class="article" v-else>
            <p class="art_p">天小美温馨提示：鉴于部分银行卡有支付金额限制，请使用以下支付方式的用户，更换付款方式，以便顺利参与充值送冰箱活动。</p>
            <p class="art_p">1、微信支付，并绑定了宁波银行信用卡、中国农业银行信用卡、中国农业银行储蓄卡及中国邮政银行储蓄卡。</p>
            <p class="art_p">2、支付宝支付，并绑定了中国邮政银行储蓄卡。</p>
            <p class="art_p">如给您带来不便，还请谅解，谢谢</p>
          </div>
          <p class="tel">客服电话：400-1688-521</p>
        </div>
      </div>
    </div>
    <!--充值7999换购水卡和冰箱兑换券-->
    <div class="rech_su" v-show="water">
      <div class="box">
        <p class="title">充值成功</p>
        <!--<h3 class="tit">恭喜您获得水卡换购券、冰箱兑换券各一张</h3>-->
        <h3 class="tit">恭喜您获得冰箱兑换券一张</h3>
        <div class="ulbox">
          <ul class="conte-box">
            <!--<li class="temli">-->
            <!--<dl class="temdl">-->
            <!--<dt class="temdt">-->
            <!--<img src="./i_worter.png" alt="" class="dt-img"/>-->
            <!--</dt>-->
            <!--&lt;!&ndash;水卡&ndash;&gt;-->
            <!--<dd class="temdd1">-->
            <!--<h3 class="bank-con">水卡换购券</h3>-->
            <!--<h4 class="bank-date">4099美家钻换购<br/>价值5000元水卡</h4>-->
            <!--</dd>-->
            <!--<dd class="temdd2">-->
            <!--<b class="cular-b"></b>-->
            <!--<i class="cular-i"></i>-->
            <!--<a class="change-a">换购<br/>水卡</a>-->
            <!--</dd>-->
            <!--</dl>-->
            <!--</li>-->
            <li class="temli">
              <dl class="temdl">
                <dt class="temdt">
                  <img src="./i_refrigerator.png" alt="" class="dt-img"/>
                </dt>
                <!--水卡-->
                <dd class="temdd1">
                  <h3 class="bank-con">冰箱兑换券</h3>
                  <!--<h4 class="bank-date">兑换截至日期<br/>{{formatTime(datatimes)}}-2017.02.12</h4>-->
                </dd>
                <dd class="temdd2">
                  <b class="cular-b"></b>
                  <i class="cular-i"></i>
                  <a class="change-a">兑换<br/>冰箱</a>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
        <a class="moent" @click="water = false">立即换购</a>
      </div>
    </div>
    <!--换购成功弹框-->
    <div class="rech" v-show="succ">
      <div class="rebox">
        <p class="bu_su_p">
          <span class="bu_img"></span>
        </p>
        <div class="bu_cen">
          <p class="cen_p">1.本次换购行为消耗4099美家钻，获得价值5000元水卡，剩余3900美家钻可在商城消费。</p>
          <p class="cen_p">2.水卡发放及后续使用问题归水卡所属公司负责，如有疑问请与属地水卡公司联系。</p>
          <p class="cen_p">3.冰箱兑换券已发放在"我的 优惠券"中。</p>
        </div>
        <a class="btnt">查看换购记录</a>
        <a class="btnt">继续兑换冰箱</a>
      </div>
    </div>
    <!--充值不足6999弹层-->
    <div class="less" v-show="less">
      <div class="lesbox">
        <p class="lessp">
          <span class="le_img"></span>
        </p>
        <div class="cen_font">
          您的充值金额不足<span class="red">￥{{mon}}</span>,<br/>将无法参加充值送冰箱活动，<br/>请问您是否继续？
        </div>
        <a class="btnt" @click="less = !less">参加，返回修改</a>
        <a class="btnt bt95" @click="next">不参加，下一步</a>
      </div>
    </div>
    <!--充值失败弹层-->
    <vtoasts v-show="fail">
      <i slot="icon" class="icon re_fail"></i>
      <div slot="txt" class="txt">充值失败</div>
      <div slot="btn" class="btn" @click="fail = !fail">返回</div>
    </vtoasts>
    <!--充值成功弹层-->
    <vtoasts v-show="re_su">
      <i slot="icon" class="icon re_su"></i>
      <div slot="txt" class="txt">充值成功</div>
      <div slot="btn" class="btn" @click="re_su = !re_su">返回</div>
    </vtoasts>
    <!--密码错误-->
    <vtoasts v-show="pass_fail">
      <i slot="icon" class="icon pass_fail"></i>
      <div slot="txt" class="txt">密码输入错误，请重新输入</div>
      <div slot="btn" class="btn">返回</div>
    </vtoasts>
    <!--弹层-->
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
  export default {
    data() {
      return {
        warning: false,
        tips: '',
        check: true,
        flag: 0,
        chon: false,
        monery: false,
        price: '',
        water: false,
        succ: false,
        less: false,
        fail: false,
        re_su: false,
        pass_fail: false,
        text: '',
        Mone: 0,
        me: {lng: this.$route.query.lng, lat: this.$route.query.lat},
        agency_id: -1,
        order_id: -1,
        mon: 6999,
        is_coupon: 0
      };
    },
    created () {
      this.$http.post(api.getChannel, qs.stringify({
        lat: this.me.lat,
        lng: this.me.lng
      })).then((res) => {
        if (res.data.err_code == 200) {
          res = res.data.data;
          this.agency_id = res.agency_id;
          this.order_id = res.order_id;
          if (this.agency_id == 10 || this.agency_id == 11) {
            this.mon = 6900;
          } else {
            this.mon = 6999;
          }
        } else {
          console.log('获取失败');
        }
      }).catch(() => {
        console.log('网络错误');
      });
    },
    mounted() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            click: true
          });
          this.scroll.on('beforeScrollStart', () => {
            this.$refs.telpro.blur();
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    methods: {
      // 点击下一步
      next () {
        this.less = false;
        this.rechar();
      },
      // 充值接口
      rechar () {
        this.$http.post(api.insetMJB, qs.stringify({
          amount: this.Mone,
          by: 3
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.$http.post(api.payMoney, qs.stringify({
              amount: res.data.third_amount,
              pay_no: res.data.pay_no,
              method: 1,
              is_coupon: res.data.is_coupon
            })).then((ress) => {
              ress = ress.data;
              if (ress.err_code == 200) {
                window.location.href = api.wxPay + ress.data;
              } else {
                this.fail = true;
              }
            });
          } else {
            console.log('数据错误');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 充值按钮
      recharge () {
        if (this.chon) {
          if (this.flag == '6900') { // 6999
            this.Mone = 6900;
            this.rechar();
          } else if (this.flag == '6999') { // 7999
            this.Mone = 6999;
            this.rechar();
          } else if (this.flag == '1') { // 其他
            this.Mone = this.text;
            if (this.Mone > 0) {
              if (this.checkRates(this.Mone)) {
                if (this.Mone < this.mon) {
                  this.less = true;
                } else {
                  this.rechar();
                }
              } else {
                this.warning = true;
                this.tips = '请正确输入您的充值金额';
                return;
              }
            } else {
              this.warning = true;
              this.tips = '请正确输入您的充值金额';
              return;
            }
          } else {
            this.warning = true;
            this.tips = '请选择充值金额';
            return;
          }
        } else {
          this.warning = true;
          this.tips = '请您同意充值协议';
        }
      },
      change(num) {
        this.flag = num;
        if (this.flag === 1) {
          this.monery = !this.monery;
        } else {
          this.monery = false;
        }
      },
      // 判断是不是金钱
      checkRates(str) {
        let re = /^([1-9]\d{0,9}|0)([.]?|(\.\d{1,2})?)$/;
        let Sure;
        if (!re.test(str) || str.length >= 8) {
          Sure = 0;
        } else {
          Sure = 1;
        }
        return Sure;
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
    bottom: 0;
    background: $bgec;
    .toasts-wrap .alert .title .re_su {
      display: block;
      @include bg(30px 30px);
      background-image: url(i_recharge_sucess.png);
    }
    .toasts-wrap .alert .title .pass_fail {
      display: block;
      @include bg(30px 30px);
      background-image: url(i_password_fail.png);
    }
    .toasts-wrap .alert .title .re_fail {
      display: block;
      @include bg(30px 30px);
      background-image: url(i_recharge_fail.png);
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
      box-shadow: inset 0 -1px 0 $bsdc;
      z-index: 11;
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
    .mine-recharge {
      position: absolute;
      left: 5px;
      top: 41px;
      right: 5px;
      bottom: 0;
      overflow: hidden;
    }
    .mlist {
      margin-top: 5px;
      overflow: hidden;
      .line {
        display: flex;
        background: $bgff;
        height: 40px;
        line-height: 41px;
        border-radius: $br6;
        margin-bottom: 5px;
        position: relative;
        &:before {
          content: '';
          width: 30px;
          height: 30px;
          position: absolute;
          top: 5px;
        }
        .name {
          padding-left: 30px;
          flex-grow: 1;
          font-size: 13px;
          color: $fs1b;
        }
        .chec {
          position: relative;
          width: 43px;
          height: inherit;
          .bac {
            margin-top: 5px;
            margin-left: 6px;
            display: block;
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url("i_check.png");
          }
        }
        .active {
          .bac {
            @include bg(23px 23px);
            background-image: url("i_checked.png");
          }
        }
      }
      .wei {
        &:before {
          @include bg(23px 23px);
          background-image: url("i_recharge_we.png");
        }
      }
    }
    .content {
      margin-top: 16px;
      overflow: hidden;
      .ul_price {
        display: flex;
        margin: 0 auto;
        width: 275px;
        height: 50px;
        margin-bottom: 9px;
        .pri {
          flex-grow: 1;
          width: 25%;
          border-radius: $br24;
          background-color: $fsff;
          text-align: center;
          line-height: 50px;
          margin-right: 7px;
          font-size: 13px;
          color: $fs1b;
          border: 1px solid $fsff;
        }
        .active {
          border: 1px solid $fse5;
          color: $fse5;
        }
        .rit_mar {
          margin-right: 0;
        }
      }
      .mbmoney {
        display: flex;
        align-items: center;
        margin: 0 auto;
        width: 275px;
        height: 50px;
        line-height: 50px;
        border-radius: $br24;
        background: $bgff;
        overflow: hidden;
        .rech_mon {
          line-height: 13px;
          text-align: center;
          padding-left: 30px;
          font-size: 13px;
          color: $fs31;
        }
        .inp {
          flex: 1;
          height: 100%;
          padding: 0 10px;
          font-size: 13px;
          color: $fs95;
        }
      }
      .mbrec {
        display: block;
        margin: 0 auto;
        width: 275px;
        height: 50px;
        line-height: 50px;
        border-radius: $br24;
        text-align: center;
        color: $fsff;
        margin-top: 10px;
        font-size: 13px;
        background: $bge5;
      }
      .agree {
        display: flex;
        justify-content: center;
        line-height: 30px;
        margin-top: 10px;
        .ag_le {
          width: 30px;
          height: 30px;
          position: relative;
          right: 3px;
          .le_sp {
            display: block;
            width: inherit;
            height: inherit;
            @include bg(23px 23px);
            background-image: url("i_check.png");
          }
          .active {
            @include bg(23px 23px);
            background-image: url("i_checked.png");
          }
        }
        .ag_ri {
          line-height: 13px;
          font-size: 13px;
          color: $fse5;
          margin-top: 10px;
        }
      }
      .article {
        width: 261px;
        margin: 5px auto 0;
        overflow: hidden;
        .art_p {
          text-align: justify;
          line-height: 18px;
          font-size: 10px;
          color: $fs95;
        }

      }
      .tel {
        font-size: 13px;
        color: $fse5;
        text-align: center;
        padding-top: 10px;
      }
    }
    /*公共按钮样式*/
    .btnt {
      display: block;
      padding: 15px 0;
      margin: 0 10px 10px;
      color: $fse5;
      font-size: 13px;
      border: 1px solid $bddc;
      border-radius: $br24;
      overflow: hidden;
    }
    .bt95 {
      color: $fs95;
    }
    /*水卡和冰箱弹出层*/
    .rech_su {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: rgba(238, 242, 245, 0.8);
      .box {
        width: 298px;
        text-align: center;
        border: 1px solid $bdec;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
        .title {
          border-bottom: 1px solid $bdf0;
          position: relative;
          height: 40px;
          line-height: 40px;
          color: $fse5;
          font-size: 16px;
        }
        .tit {
          color: $fs31;
          font-size: 13px;
          margin: 19px 0;
        }
        .ulbox {
          padding: 0 5px;
        }
        .conte-box {
          width: 100%;
          .temli {
            width: 100%;
            height: 80px;
            margin-bottom: 10px;
            .temdl {
              display: flex;
              width: inherit;
              height: 80px;
              border-radius: $br6;
              overflow: hidden;
              background: $bgff;
              box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
              .temdt {
                flex-shrink: 0;
                width: 80px;
                height: 80px;
                .dt-img {
                  width: 100%;
                  height: 100%;
                }
              }
              .temdd1 {
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: $bgff;
                height: inherit;
                flex-grow: 1;
                padding-left: 8px;
                width: calc(95% - 160px);
                box-sizing: border-box;
                padding-right: 3px;
                text-align: left;
                .bank-con {
                  font-size: 13px;
                  color: $fs53;
                  margin-top: 4px;
                  margin-bottom: 7px;
                }
                .bank-date {
                  flex-shrink: 0;
                  font-size: 10px;
                  line-height: 16px;
                  color: $fs95;
                }
              }
              .temdd2 {
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                flex-shrink: 0;
                width: 80px;
                height: inherit;
                text-align: center;
                background-color: $bge5;
                .cular-b {
                  position: absolute;
                  z-index: 9;
                  top: -5px;
                  left: -5px;
                  width: 10px;
                  height: 10px;
                  border-radius: 100%;
                  background: $bgff;
                  box-shadow: 0px 80px 0px 0px $bgff;
                }
                .cular-i {
                  position: absolute;
                  z-index: 9;
                  top: 10px;
                  left: -3px;
                  width: 6px;
                  height: 6px;
                  border-radius: 100%;
                  background: $bgec;
                  box-shadow: 0px 11px 0px 0px $bgec, 0px 22px 0px 0px $bgec, 0px 33px 0px 0px $bgec, 0px 43px 0px 0px $bgec, 0px 54px 0px 0px $bgec;
                }
                .change-a {
                  width: 100%;
                  font-size: 13px;
                  color: $fsff;
                  height: 30px;
                  line-height: 14px;
                }
              }
            }
          }
        }
        .moent {
          display: block;
          height: 50px;
          line-height: 50px;
          margin: 0 10px 10px;
          box-sizing: border-box;
          color: $fse5;
          font-size: 13px;
          border: 1px solid $bddc;
          border-radius: $br24;
          overflow: hidden;
        }
      }
    }
    /*换购成功*/
    .rech {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: rgba(238, 242, 245, 0.8);
      .rebox {
        width: 298px;
        text-align: center;
        border: 1px solid $bdec;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
        .bu_su_p {
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid $bdf0;
          position: relative;
          height: 40px;
          line-height: 40px;
          .bu_img {
            display: block;
            width: 30px;
            height: 30px;
            background: url(i_ev_sucess.png) no-repeat;
            background-size: contain;
          }
        }
        .bu_cen {
          padding: 10px;
          padding-bottom: 0;
          width: 100%;
          box-sizing: border-box;
          .cen_p {
            text-align: justify;
            font-size: 12px;
            color: $fs31;
            line-height: 16px;
            margin-bottom: 8px;
          }
        }
      }
    }
    /*不足6999弹层*/
    .less {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: rgba(238, 242, 245, 0.8);
      .lesbox {
        width: 298px;
        text-align: center;
        border: 1px solid $bdec;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
      }
      .lessp {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid $bdf0;
        position: relative;
        height: 40px;
        line-height: 40px;
        .le_img {
          display: block;
          width: 30px;
          height: 30px;
          background: url(i_warp.png) no-repeat;
          background-size: contain;
        }
      }
      .cen_font {
        text-align: center;
        line-height: 20px;
        font-size: 13px;
        color: $fs31;
        padding: 5px 0;
        .red {
          color: $fse5;
        }
      }
    }
  }
</style>
