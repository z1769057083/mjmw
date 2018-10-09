<template>
  <div class="confirmID-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <router-link :to="{name: 'myOrder', query: {type : 0}}" class="back pos"></router-link>
      <p class="txt">订单详情</p>
    </header>
    <!-- 主体内容 -->
    <!-- 没有底部加.no -->
    <div class="main" ref="scroll_hook" :class="{no: isBottom}" v-show="pro.express_fee">
        <div class="scroll-wrap">
          <div class="order-id">
            <div class="left">订单号：{{pro.order_no}}</div>
            <div class="right">状态：<s class="color" v-if="pro.is_pay != 1 && pro.is_over != 4">等待付款</s>
              <s class="color" v-else-if="pro.is_pay == 1 && pro.is_delivery == 0 && pro.is_over != 4 ">等待发货</s>
              <s class="color"
                 v-if="pro.is_pay == 1 && pro.is_delivery == 1 && pro.is_get == 0 && pro.is_over != 4 ">等待收货</s>
              <s class="color" v-if="pro.is_over == 1 && pro.is_comment == 1">已评论</s>
              <s class="color" v-if="pro.is_over == 1 && pro.is_comment == 0">未评论</s>
              <s class="color" v-if="pro.is_over == 4">已取消</s>
            </div>
          </div>
          <div class="order-time com">
            <div class="left">下单时间：{{formatTime(pro.order_time)}}</div>
            <router-link class="right" v-if="pro.is_pay != 0 && pro.is_pay != 2"
                         :to="{name:'tracking', query: {order_id:pro.order_id}}" tag="div">
              <i class="icon"></i>
              <span class="color">订单跟踪</span>
            </router-link>
          </div>
          <div class="order-address">
            <p class="txt">
              <span class="name">姓名：<s class="color">{{pro.name}}</s></span>
              <span class="tel">电话：<s class="color">{{pro.telephone}}</s></span>
            </p>
            <p class="txt">
              地址：<s class="color">{{pro.address}}</s>
            </p>
          </div>
          <div class="order-list" v-for="list in pro.order_items">
            <div class="title">
              <span class="left">{{list.store_name}}</span>
            </div>
            <div class="item-box">
              <div class="item" v-for="temp in list.item">
                <div class="cont">
                  <div class="pic-show">
                    <div class="img-box">
                      <img class="img" :src="temp.thumb_url"
                           onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'"
                           :alt="temp.item_name">
                    </div>
                    <div class="txt-box">
                      <h3 class="name">{{temp.item_name}}</h3>
                      <div class="price"><b class="small">￥</b>{{temp.item_price}}</div>
                      <div class="mj-box" v-if="temp.is_mjb != 0">
                        <span class="border" v-if="temp.is_mjb == 1">可用<i class="ic_mj"></i>{{temp.item_price}}</span>
                        <span class="border" v-else>可用<i class="ic_mj"></i>{{temp.mjb_value}}</span>
                      </div>
                    </div>
                    <div class="txt-num">X {{temp.item_num}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="remarks" v-if="pro.note != ''">
            <div class="left">备注：</div>
            <div class="right">{{pro.note}}</div>
          </div>
          <div class="order-ways com">
            <div class="left">支付方式</div>
            <template v-if="pro.supplier_id == 1">
              <div class="right">
                <span class="color">冰箱兑换券</span>
              </div>
            </template>
            <template v-else>
              <template v-for="item in pro.pay">
                <div class="right mj" v-if="item.payment_method_id == 1 && item.is_ok == 1">
                  <i class="icon"></i>
                  <span class="color">美家钻支付</span>
                </div>
                <div class="right" v-else-if="item.payment_method_id == 2 && item.is_ok == 1">
                  <span class="color">余额支付</span>
                </div>
                <div class="right wx" v-else-if="item.payment_method_id == 3 && item.is_ok == 1">
                  <i class="icon"></i>
                  <span class="color">微信支付</span>
                </div>
                <div class="right pay" v-else-if="item.payment_method_id == 4 && item.is_ok == 1">
                  <i class="icon"></i>
                  <span class="color">支付宝支付</span>
                </div>
                <div class="right" v-else-if="item.payment_method_id == 5 && item.is_ok == 1">
                  <span class="color">银联支付</span>
                </div>
              </template>
            </template>
          </div>
          <div class="order-cost">
            <div class="item">
              <div class="left">商品总额：<s class="color">￥{{pro.goods_amount}}</s></div>
              <div class="right">美家钻：<s class="color" v-if="pro.pay_by_mjb > 0">- {{pro.pay_by_mjb}}</s>
                <s class="color" v-else>{{pro.pay_by_mjb}}</s>
              </div>
            </div>
            <div class="item">
              <div class="left"></div>
              <div class="right" v-if="isTips">运费：<s
                class="color">{{pro.express_fee == 0 ? '运费到付' : '￥' + pro.express_fee + '+运费到付'}}</s></div>
              <div class="right" v-else-if="isFridge">运费：<s class="color">到货后物流公司收取</s></div>
              <div class="right" v-else>运费：<s class="color">{{pro.express_fee == 0 ? '包邮' : '￥' + pro.express_fee}}</s>
              </div>
            </div>
            <div class="item">
              <div class="left"></div>
              <div class="right">
                <template v-if="pro.is_over == 4">（未付）</template>
                <template v-if="pro.is_pay == 1">实付款：</template>
                <template v-else>需付款：</template>

                <s class="color" v-if="pro.pay_by_mjb == pro.should_pay"><i class="ic_mj">{{pro.should_pay}}</i></s>
                <s class="color" v-else-if="pro.is_pay == 1 && pro.should_pay ==0"><i class="ic_mj">{{pro.pay_by_mjb}}</i></s>
                <s class="color" v-else>￥{{pro.should_pay}}</s>
              </div>
            </div>
          </div>
        </div>
      </div>
    <template v-if="pro.order_items && pro.order_items.length">
      <div class="foot-wrap" v-if="pro.is_over == 1 || pro.is_over == 4">
        <div class="right" @click="oncebuy">再次购买</div>
      </div>
      <div class="foot-wrap" v-if="pro.is_pay != 1 && pro.is_over != 4">
        <div class="left">付款剩余时间：<br>{{surtimes}}</div>
        <div class="center" @click="cancel_order = !cancel_order;">取消订单</div>
        <div class="right" :class="{gra: gray}" @click="gray ? '' : gopay()">确认支付</div>
      </div>
      <div class="foot-wrap" v-if="pro.is_pay == 1 && pro.is_over != 4 && pro.is_delivery == 1 && pro.is_get == 0">
        <div class="right" @click="rece_good = !rece_good">确认收货</div>
      </div>
      <!--取消订单-->
      <div class="cancel-mark" v-show="cancel_order">
        <div class="alert">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <!-- 选中加.on -->
            <div class="item" :class="{on: actinde == index}" v-for="(res, index) in reason"
                 @click="check(index, $event)">
              <i class="icon"></i>
              <span class="txt">{{res}}</span>
            </div>
            <div class="zw-8"></div>
            <a class="btn btn-cancle" @click="cancel_order = !cancel_order">考虑一下</a>
            <a class="btn btn-sure" @click="canord">确认取消订单</a>
          </div>
        </div>
      </div>
      <!-- 支付密码设置提示 -->
      <div class="password-mark" v-show="0">
        <div class="alert">
          <div class="title">
            <i class="icon"></i>
          </div>
          <div class="cont">
            <div class="txt">为了您的帐户安全，您可前往我的帐户安全<br>设置支付密码。</div>
            <div class="zw-5"></div>
            <a class="btn btn-setting">设置密码</a>
            <a class="btn btn-sure">继续支付</a>
          </div>
        </div>
      </div>
      <!--是否确认收货-->
      <div class="rece_goods" v-show="rece_good">
        <div class="goods_ti">
          <h4 class="ti_title">
            <span class="ti_icon"></span>
          </h4>
          <div class="infi_box">
            <p class="last_goods">是否确认收货</p>
            <div class="item_btn">
              <a class="btn_sy" @click="firmRec">是</a>
            </div>
            <div class="item_btn">
              <a class="btn_sy fo53" @click="rece_good = false">否</a>
            </div>
          </div>
        </div>
      </div>
      <vtoasts v-show="vscuss">
        <div slot="txt" class="txt">收货成功</div>
        <a slot="btn" class="btn" @click="$router.back()">返回</a>
      </vtoasts>
      <vtoastw v-show="warning">
        <div slot="txt" class="txt">{{tips}}</div>
        <a slot="btn" class="btn" @click="warning = !warning">返回</a>
      </vtoastw>
    </template>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import {formatDate, setLocal} from '../../common/js/util';
  import {mapActions} from 'vuex';
  import qs from 'qs';

  let timer;
  let time;
  export default {
    data() {
      return {
        vscuss: false,
        warning: false,
        tips: '',
        cancel_order: false,
        rece_good: false, // 是否确认收货
        item_id: '',
        pro: {
          order_items: []
        },
        surtimes: '',
        tim: '',
        t: null,
        gray: false,
        actinde: 0,
        reason: ['收货人信息错误', '商品数量或款式调整', '忘记使用优惠券购买', '不想买了', '其他原因']
      };
    },
    computed: {
      isBottom() {
        return this.pro.is_pay == 1 && this.pro.is_delivery == 0 && this.pro.is_over != 4;
      },
      isTips() {
        let list = [];
        for (let i = 0; i < this.pro.order_items.length; i++) {
          list.push(this.pro.order_items[i]);
        }
        return list.find((item) => {
          return item.supplier_id == 48;
        });
      },
      isFridge() {
        let list = [];
        for (let i = 0; i < this.pro.order_items.length; i++) {
          for (let j = 0; j < this.pro.order_items[i].item.length; j++) {
            list.push(this.pro.order_items[i].item[j]);
          }
        }
        return list.find((item) => {
          return item.item_id == 1;
        });
      }
    },
    methods: {
      // 添加购物车
      ...mapActions(['add']),
      // 再次购买
      oncebuy() {
        for (let i = 0; i < this.pro.init_item.length; i++) {
          this.add(this.pro.init_item[i]);
        }
        setTimeout(() => {
          this.$router.push({name: 'cart'});
        }, 500);
      },
      // 去支付
      gopay() {
        let tempArr = this.pro;
        let cartNum = 0;
        let cartMoney = tempArr.goods_amount;
        let expressfee = tempArr.express_fee;
        let paymjb = tempArr.pay_by_mjb;
        let arr = [];
        let arr2 = [];
        for (let k = 0; k < tempArr.init_item.length; k++) {
          if (tempArr.init_item[k].is_mjb > 0) {
            // 为每一个对象添加美家钻开关
            this.$set(tempArr.init_item[k], '_switch', true);
            arr2.push(tempArr.init_item[k].item_id + '|' + tempArr.init_item[k].num + '|' + 1);
          } else {
            arr2.push(tempArr.init_item[k] + '|' + tempArr.init_item[k] + '|' + 0);
          }
        }
        // 将要支付的商品存入本地
        setLocal('_list', tempArr.init_item);
        setLocal('_num', cartNum);
        setLocal('_total', cartMoney);
        setLocal('_goodsNum', arr.join(','));
        setLocal('_goodsNumMJB', arr2.join(','));
        setLocal('_expressfee', expressfee);
        setLocal('pay_mjb', paymjb);
        setLocal('__listId', tempArr);
        this.$router.push({name: 'toPay'});
      },
      // 确认收货
      firmRec() {
        this.$http.post(api.sureReceiveOrder, qs.stringify({
          id: this.item_id
        })).then(res => {
          if (res.data.err_code == 200) {
            this.vscuss = true;
          } else {
            console.log(res.data.err_msg);
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 取消订单
      canord () {
        this.$http.post(api.cancelOrder, qs.stringify({
          order_id: this.item_id,
          reason: this.reason[this.actinde]
        })).then(res => {
          if (res.data.err_code == 200) {
            this.$router.push({name: 'myOrder', query: {type: 0}});
          } else {
            console.log(res.data.err_msg);
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 取消订单样式选中
      check(index, event) {
        this.actinde = index;
      },
      // 过滤时间戳的方法
      formatTime(time) {
        return formatDate(time, 'yyyy-MM-dd  hh:mm:ss');
      },
      // 调取订单详情信息
      _indexOrder() {
        this.$http.post(api.orderDetails, qs.stringify({
          id: this.item_id
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.pro = res;
            this.tim = (this.pro.order_time * 1 + 24 * 3600);
            this.deth();
            this.clock(this.tim, this.pro.current);
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      _initScroll() {
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
      // 时分秒计时器
      clock(times, nowtime) {
        // 检查是否过期
        time = times - nowtime;
        if (time < 0) {
          // 过期的事
          this.gray = true;
          this.surtimes = '00小时00分钟00';
        } else {
          timer = setInterval(() => {
            time -= 1;
            if (time < 0) {
              // 过期的事
              this.gray = true;
              this.surtimes = '00小时00分钟00';
              // 关闭计时器
              clearInterval(timer);
            } else {
              // 没过期的事
              // 计算天，时，分，秒
              var s = time % 60;
              var m = parseInt(time / 60) % 60;
              var h = parseInt(time / 3600) % 24;
              // 添加内容
              this.gray = false;
              this.surtimes = this.repair(h) + '小时' + this.repair(m) + '分钟' + this.repair(s);
            }
          }, 1000);
        }
      },
      deth () {
        time = this.tim - this.pro.current;
        if (time < 0) {
          // 过期的事
          this.gray = true;
          this.surtimes = '00小时00分钟00';
          // 关闭计时器
          clearInterval(timer);
        } else {
          // 没过期的事
          // 计算天，时，分，秒
          var s = time % 60;
          var m = parseInt(time / 60) % 60;
          var h = parseInt(time / 3600) % 24;
          // 添加内容
          this.gray = false;
          this.surtimes = this.repair(h) + '小时' + this.repair(m) + '分钟' + this.repair(s);
        }
      },
      // 创建补0函数
      repair(s) {
        return s < 10 ? '0' + s : s;
      }
    },
    created() {
      this.item_id = this.$route.query.id;
      this._indexOrder();
    },
    mounted() {
      this._initScroll();
    },
    destroyed() {
      clearInterval(timer);
    },
    watch: {
      pro: {
        handler(val, oldVal) {
          this._initScroll();
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .confirmID-wrap {
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
      &.no {
        bottom: 0;
      }
      .scroll-wrap {
        padding: 5px;
      }
      .com {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        margin-top: 5px;
        padding: 0 10px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
      }
      .order-id {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 10px;
        font-size: 13px;
        color: $fs43;
        border-radius: $br6;
        background: $bgff;
        .color {
          color: $fse5;
        }
      }
      .order-time {
        color: $fs95;
        .right {
          display: flex;
          align-items: center;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url(i_car.png);
          }
          .color {
            height: 30px;
            line-height: 30px;
            color: $fs55;
          }
        }
      }
      .order-address {
        font-size: 13px;
        color: $fs95;
        margin-top: 5px;
        padding: 5px 10px;
        border-radius: $br6;
        background: $bgff;
        .txt {
          line-height: 1.6;
          .tel {
            padding-left: 10px;
          }
          .color {
            color: $fs53;
          }
        }
      }
      .order-list {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 0 12px;
          background: $bgff;
          font-size: 13px;
          color: $fs53;
        }
        .item {
          position: relative;
          width: 100%;
          margin-top: 1px;
          .cont {
            display: flex;
            align-items: center;
            width: 100%;
            height: 90px;
            background: $bgff;
            .pic-show {
              position: relative;
              display: flex;
              align-items: center;
              width: 100%;
              box-sizing: border-box;
              height: 80px;
              padding-left: 8px;
              .img-box {
                position: relative;
                flex: 0 0 80px;
                width: 80px;
                height: 80px;
                border-radius: $br6;
                border: 1px solid $bdf0;
                overflow: hidden;
                box-sizing: border-box;
                .img {
                  width: 100%;
                  height: 100%;
                }
                .tips {
                  position: absolute;
                  left: 0;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 40px;
                  height: 40px;
                  line-height: 40px;
                  text-align: center;
                  margin: auto;
                  font-size: 10px;
                  color: $fsff;
                  border-radius: 50%;
                  background: rgba(229, 0, 79, .8);
                }
              }
              .txt-box {
                flex: 1;
                padding: 0 8px;
                .name {
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  word-break: break-all;
                  height: 30px;
                  line-height: 15px;
                  text-align: justify;
                  font-size: 13px;
                  color: $fs43;
                  overflow: hidden;
                }
                .price {
                  height: 20px;
                  line-height: 20px;
                  font-size: 15px;
                  color: $fse5;
                  .small {
                    font-size: 12px;
                  }
                }
                .store {
                  font-size: 10px;
                  color: $fs95;
                }
                .mj-box {
                  display: flex;
                  .border {
                    margin-left: 0;
                  }
                }
              }
              .txt-num {
                text-align: right;
                padding-right: 10px;
                font-size: 13px;
                color: $fs95;
              }
            }
          }
        }
      }
      .remarks {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 30px;
        margin-top: 5px;
        padding: 5px 10px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
        color: $fs53;
        .left{
          flex: 0 0 40px;
          width: 40px;
        }
        .right {
          flex: 1;
          line-height: 1.2;
          word-break: break-all;
          overflow: hidden;
        }
      }
      .order-ways {
        color: $fs53;
        .right {
          display: flex;
          align-items: center;
          &.wx {
            .icon {
              background-image: url(i_wx.png);
            }
            .color {
              color: $fs80;
            }
          }
          &.pay {
            .icon {
              background-image: url(i_pay.png);
            }
            .color {
              color: $fs55;
            }
          }
          &.mj {
            .icon {
              background-image: url(i_mj.png);
            }
            .color {
              color: $fse5;
            }
          }
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .color {
            height: 30px;
            line-height: 30px;
          }
        }
      }
      .order-cost {
        margin-top: 5px;
        font-size: 13px;
        color: $fs53;
        border-radius: $br6;
        overflow: hidden;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-top: 1px;
          padding: 0 10px;
          background: $bgff;
          &:first-child {
            margin-top: 0;
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
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        line-height: 1.2;
        color: $fse5;
        background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      }
      .center {
        flex: 1;
        height: 100%;
        line-height: 45px;
        margin-left: 1px;
        margin-right: 1px;
        color: $fs53;
        background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      }
      .right {
        flex: 1;
        color: $fsff;
        height: 100%;
        line-height: 45px;
        background: $bge5;
      }
      .gra {
        background-color: $fs95;
      }
    }
    .cancel-mark {
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
            background-image: url(i_trash.png);
          }
        }
        .cont {
          padding: 14px 0 10px;
          margin-top: 1px;
          font-size: 13px;
          background: $bgff;
          .item {
            display: flex;
            align-items: center;
            height: 26px;
            margin: 0 60px 0 70px;
            color: $fs53;
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
            .txt {
              height: 30px;
              line-height: 30px;
            }
          }
          .zw-8 {
            height: 8px;
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
          .btn-cancle {
            color: $fs53;
          }
          .btn-sure {
            color: $fse5;
          }
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
    /*是否确认收货*/
    .rece_goods {
      position: fixed;
      left: 0;
      top: 40px;
      z-index: 9;
      width: 100%;
      height: 100%;
      background: rgba(236, 240, 243, 0.6);
      .goods_ti {
        width: 298px;
        margin: 160px auto 0;
        padding-bottom: 10px;
        border-radius: $br20;
        overflow: hidden;
        background: $bgff;
        .ti_title {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid $bgec;
          position: relative;
          .ti_icon {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-left: -15px;
            margin-top: -15px;
            background: url(i_warp.png) no-repeat;
            background-size: contain;
          }
        }
        .infi_box {
          width: 274px;
          margin: 0 auto;
          .last_goods {
            padding: 20px 15px 10px;
            line-height: 1.5;
            text-align: center;
            font-size: 13px;
            color: $fs31;
          }
        }
        .item_btn {
          height: 48px;
          margin-top: 10px;
          border: 1px solid $bgec;
          border-radius: $br50;
          overflow: hidden;
          position: relative;
          .btn_sy {
            display: block;
            width: 100%;
            height: 100%;
            line-height: 48px;
            text-align: center;
            font-size: 13px;
            color: $fse5;
          }
          .fo53 {
            color: $fs53;
          }
        }
      }
    }
  }
</style>
