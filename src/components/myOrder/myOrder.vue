<template>
  <div class="feed-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <router-link :to="{name: 'home'}" tag="a" class="back pos"></router-link>
      <p class="txt">全部订单</p>
    </header>
    <div class="cont-wrap">
      <div class="feed-cont" ref="page_hook">
        <div>
          <!-- 列表 -->
          <!--title-->
          <div class="ord_title" v-show="roder">
            <ul class="ord_box">
              <li class="ord_list" :class="{'active': act == 0}"
                  @click="listit(0)">
                <div class="titd">
                  <span class="titfont">未完成订单</span>
                  <b class="titb" v-if="pro.processing_num > 0">{{pro.processing_num}}</b>
                </div>
              </li>
              <li class="ord_list" :class="{'active': act == 1}" @click="listit(1)">
                <div class="titd">
                  <span class="titfont">已完成订单</span>
                  <b class="titb" v-if="pro.done_num > 0">{{pro.done_num}}</b>
                </div>
              </li>
              <li class="ord_list" :class="{'active': act == 2}"
                  @click="listit(2)" tag="li">
                <div class="titd">
                  <span class="titfont">已取消订单</span>
                  <b class="titb" v-if="pro.cancel_num > 0">{{pro.cancel_num}}</b>
                </div>
              </li>
            </ul>
            <ul class="tib_box" v-show="norder">
              <li class="nofi_list" :class="{'active': nolis == 0}" @click="nolist(0)">
                <div class="lisd">
                  <span class="sdsp">待付款</span>
                  <b class="sdb" v-if="pro.unpay_num > 0">{{pro.unpay_num}}</b>
                </div>
              </li>
              <li class="nofi_list" :class="{'active': nolis == 1}" @click="nolist(1)">
                <div class="lisd">
                  <span class="sdsp">待发货</span>
                  <b class="sdb" v-if="pro.undeliv_num > 0">{{pro.undeliv_num}}</b>
                </div>
              </li>
              <li class="nofi_list" :class="{'active': nolis == 2}" @click="nolist(2)">
                <div class="lisd">
                  <span class="sdsp">待收货</span>
                  <b class="sdb" v-if="pro.unget_num > 0">{{pro.unget_num}}</b>
                </div>
              </li>
            </ul>
            <ul class="com_bo" v-show="uscom">
              <li class="com_list" :class="{'active': com == 0}" @click="comlist(0)">
                <div class="com_div">
                  <span class="div_sp">待评价</span>
                  <b class="div_b" v-if="pro.uncomm_num > 0 ">{{pro.uncomm_num}}</b>
                </div>
              </li>
              <li class="com_list" :class="{'active': com == 1}" @click="comlist(1)">
                <div class="com_div">
                  <span class="div_sp">已评价</span>
                  <b class="div_b" v-if="pro.comm_num > 0 ">{{pro.comm_num}}</b>
                </div>
              </li>
            </ul>
          </div>
          <!-- 暂无订单 -->
          <div class="alert" v-show="noroder">
            <div class="title">
              <span class="icon"></span>
            </div>
            <div class="cont">
              <p class="txt">您还没有相关订单</p>
              <router-link :to="{name: 'home', params: {back: true}}" tag="a" class="btn">去逛逛</router-link>
            </div>
          </div>
          <!--循环列表-->
          <div class="ord_lsit">
            <dl class="main_lsit" v-show="roder">
              <!--等待付款-->
              <dd v-for="(temp, index) in newList" class="temp">
                <!--名字-->
                <div class="te_name">
                  <span class="ti_name">每家美物自营</span>
                  <span class="ti_status">状态：<b class="ti_b" v-if="temp.is_pay != 1 && temp.is_over != 4">等待付款 </b>
                    <b class="ti_b" v-else-if="temp.is_pay == 1 && temp.is_delivery == 0 && temp.is_over != 4">等待发货 </b>
                    <b class="ti_b"
                       v-else-if="temp.is_pay == 1 && temp.is_delivery == 1 && temp.is_get == 0 && temp.is_over != 4">等待收货 </b>
                    <b class="ti_b" v-else-if="temp.is_over == 1 && temp.is_comment == 1">已评论 </b>
                    <b class="ti_b" v-else-if="temp.is_over == 1 && temp.is_comment == 0">未评论 </b>
                    <b class="ti_b" v-else-if="temp.is_over == 4">已取消 </b>
                  </span>
                </div>
                <div class="pic" ref="pic_hook">
                  <ul class="ord_st" :style="{width: temp.numimg*85 + 'px'}">
                    <template v-for="list in temp.order_items">
                      <li class="item" v-for="tips in list.item">
                        <router-link :to="{name: 'confirmID', query: {id:temp.order_id}}">
                          <img class="img"
                               v-lazy="tips.thumb_url"
                               onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'"
                               :alt="tips.item_name">
                        </router-link>
                      </li>
                    </template>
                  </ul>
                </div>
                <div class="nu_price">
                  <span class="pri_s">共<b class="nub">{{temp.num}}</b>件商品</span>
                  <template v-if="temp.is_pay != 1 || temp.is_over == 4">
                    <span class="pri_p" v-if="temp.pay_by_mjb == temp.should_pay">需付款：<b
                      class="ic_mj"><i class="pi">{{temp.should_pay}}</i></b></span>
                    <span class="pri_p" v-else>需付款：<b class="mub">¥ {{temp.should_pay}}</b></span>
                  </template>
                  <template v-else>
                    <span class="pri_p"
                          v-if="(temp.goods_amount / 1 + temp.express_fee / 1).toFixed(2) != (temp.pay_by_mjb / 1).toFixed(2)">实付款：<b
                      class="mub">¥ {{temp.should_pay}}</b></span>
                    <span class="pri_p" v-else>实付款：<b class="ic_mj"><i class="pi">{{temp.pay_by_mjb}}</i></b></span>
                  </template>
                </div>
                <div class="butt juc" v-if="temp.is_over == 1 && temp.is_comment == 1">
                  <ul class="but_star">
                    <span class="star_fir">好评：</span>
                    <!-- 红色的星星加class为active -->
                    <li class="lis active"></li>
                    <li class="lis active"></li>
                    <li class="lis active"></li>
                    <li class="lis active"></li>
                    <li class="lis active"></li>
                  </ul>
                  <a class="btnn" @click="oncebuy(temp)">再次购买</a>
                </div>
                <div class="butt" v-else>
                  <template v-if="temp.is_pay != 1 && temp.is_over != 4">
                    <a class="btnn ec53" @click="noord(temp)">取消订单</a>
                    <a class="btnn" @click="pay(temp)">去支付</a>
                  </template>
                  <template v-else-if="temp.is_pay == 1 && temp.is_delivery == 0">
                    <router-link class="btnn ec53" :to="{ name: 'tracking', query: { order_id:temp.order_id } }">查看物流



                    </router-link>
                  </template>
                  <template
                    v-else-if="temp.is_over != 1 && temp.is_pay == 1 && temp.is_delivery == 1 && temp.is_get == 0 && temp.is_over != 4">
                    <router-link class="btnn ec53" :to="{ name: 'tracking', query: { order_id:temp.order_id } }">查看物流



                    </router-link>
                    <a class="btnn" @click="surebook(temp)">确认收货</a>
                  </template>
                  <template v-else-if="temp.is_over == 1 && temp.is_comment == 0">
                    <router-link :to="{name: 'evalcenwait'}" class="btnn ec53" tag="a">评价</router-link>
                    <a class="btnn" @click="oncebuy(temp)">再次购买</a>
                  </template>
                  <template v-else-if="temp.is_over == 1 || temp.is_over == 4">
                    <a class="btnn" @click="oncebuy(temp)">再次购买</a>
                  </template>
                </div>
              </dd>
              <!-- 加载提示文字 -->
              <p class="load-tip" v-show="newList.length"><i></i><span>{{doneFlag ? '我是有底线的' : '上拉加载更多'}}</span><i></i></p>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <!--取消订单弹层-->
    <div class="ay_can_ord" v-show="cel_order">
      <div class="can_box">
        <h4 class="tips_title">
          <span class="tips_icon"></span>
        </h4>
        <div class="info_box">
          <div class="check_box">
            <h3 class="sotre_name" v-for="(Res, index) in reason">
              <span class="left_box">
                <i class="inp_bg" :class="{'active': actinde == index}" @click="check(index)"></i>
              </span>
              <span class="right_txt">{{Res}}</span>
            </h3>
          </div>
          <div class="btn_box">
            <a class="bt fs95" @click="cel_order = false">考虑一下</a>
          </div>
          <div class="btn_box">
            <a class="bt" @click="sureord()">确认取消订单</a>
          </div>
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
    <!-- 置顶按钮 -->
    <a class="go-top" v-show="top_flag" @click="goTop"></a>
    <vtoasts v-show="vscuss">
      <div slot="txt" class="txt">收货成功</div>
      <a slot="btn" class="btn" @click="$router.back()">返回</a>
    </vtoasts>
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import {mapActions} from 'vuex';
  import {setLocal} from '../../common/js/util';
  import qs from 'qs';

  // 最小上拉高度
  const MIN_PULL = 30;

  export default {
    data() {
      return {
        vscuss: false,
        warning: false,
        tips: '',
        top_flag: 0,
        noroder: false,
        roder: true,
        act: -1,
        nolis: -1,
        norder: true, // 待付款，待发货，待收货显示层
        uscom: false, // 待评价，已评价显示层
        com: -1,
        actinde: 0,
        curArr: [],
        cel_order: false,
        rece_good: false,
        page: 0,
        totalPage: 2,
        ajaxFlag: true, // ajax开关
        doneFlag: false,
        ordtemp: null, // 每个订单对象
        pro: {},
        reason: ['收货人信息错误', '商品数量或款式调整', '忘记使用优惠券购买', '不想买了', '其他原因'],
        orderss: [],
        orders: [],
        ited: ''
      };
    },
    computed: {
      newList() {
        let arr = [];
        for (let i = 0; i < this.orders.length; i++) {
          // 计算商品购买的数量
          let numb = 0;
          // 计算商品图片的数量
          let numimg = 0;
          for (let k = 0; k < this.orders[i].order_items.length; k++) {
            numimg += this.orders[i].order_items[k].item.length;
            for (let j = 0; j < this.orders[i].order_items[k].item.length; j++) {
              numb += this.orders[i].order_items[k].item[j].item_num * 1;
            }
          }
          // 添加num属性
          this.$set(this.orders[i], 'num', numb);
          // 添加numimg属性
          this.$set(this.orders[i], 'numimg', numimg);
          arr.push(this.orders[i]);
        }
        return arr;
      }
    },
    methods: {
      // 去支付
      pay(tempArr) {
        let cartNum = tempArr.num;
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
        console.log(tempArr, 567);
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
      // 添加购物车
      ...mapActions(['add']),
      // 点击确认收货
      surebook (obj) {
        this.rece_good = true;
        this.ordtemp = obj;
      },
      // 确认收货
      firmRec () {
        this.rece_good = false;
        this.$http.post(api.sureReceiveOrder, qs.stringify({
          id: this.ordtemp.order_id
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
      // 点击再次购买
      oncebuy(temp) {
        for (let i = 0; i < temp.init_item.length; i++) {
          this.add(temp.init_item[i]);
        }
        setTimeout(() => {
          this.$router.push({name: 'cart'});
        }, 500);
      },
      // 切换已完成订单的title
      comlist(num) {
        for (let i = 0; i < this.orders.length; i++) {
          this['_scroll' + i] = null;
        }
        this.com = num;
        this.curArr = [];
        this.page = 0;
        this.curArr.length = 0;
        this.orders = this.curArr;
        this.ajaxFlag = true;
        if (num == 0) {
          this._indexAjax(5); // 待评价
        } else if (num == 1) {
          this._indexAjax(6); // 已评价
        }
      },
      // 确认取消订单
      sureord() {
        this.$http.post(api.cancelOrder, qs.stringify({
          order_id: this.ordtemp.order_id,
          reason: this.reason[this.actinde]
        })).then(res => {
          if (res.data.err_code == 200) {
            this.orders.splice(this.orders.indexOf(this.ordtemp), 1);
            this.cel_order = false;
            this._indexAjax(9);
            if (this.orders.length == 0) {
              this.noroder = true;
//              this.roder = false;
            }
          } else {
            console.log('订单取消失败');
          }
          this.initScroll();
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 点击取消订单
      noord(obj) {
        this.cel_order = true;
        this.ordtemp = obj;
      },
      // 未完成订单title切换
      nolist(num) {
        for (let i = 0; i < this.orders.length; i++) {
          this['_scroll' + i] = null;
        }
        this.act = 0;
        this.nolis = num;
        this.curArr = [];
        this.page = 0;
        this.curArr.length = 0;
        this.orders = this.curArr;
        this.ajaxFlag = true;
        if (num == 0) {
          this._indexAjax(1);
        } else if (num == 1) {
          this._indexAjax(2);
        } else if (num == 2) {
          this._indexAjax(3);
        }
      },
      // 切换title
      listit(num) {
        for (let i = 0; i < this.orders.length; i++) {
          this['_scroll' + i] = null;
        }
        this.act = num;
        this.nolis = -1;
        this.curArr = [];
        this.page = 0;
        this.curArr.length = 0;
        this.orders = this.curArr;
        this.ajaxFlag = true;
        this.doneFlag = false;
        this.noroder = false;
        if (num == 0) {
          this.norder = true;
          this.uscom = false;
          this._indexAjax(9); // 9 是未完成
        } else if (num == 1) {
          this.norder = false;
          this.uscom = true;
          this._indexAjax(7); // 7 是已完成
        } else if (num == 2) {
          this.norder = false;
          this.uscom = false;
          this._indexAjax(8); // 8 是已取消
        }
      },
      // 取消订单弹框的多选
      check(index) {
        this.actinde = index;
      },
      // 置顶
      goTop() {
        this.scroll.scrollTo(0, 0, 100);
      },
      // 初始化数据
      _indexAjax(type) {
        if (!this.ajaxFlag) {
          return;
        }
        this.ajaxFlag = false;
        this.$http.post(api.orderList, qs.stringify({
          page: ++this.page,
          count: 10,
          type: type
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.pro = res;
            this.ajaxFlag = true;
            this.noroder = false;
            this.roder = true;
            this.totalPage = res.total_page;
            if (this.page >= this.totalPage) {
              this.doneFlag = true;
            }
            this.curArr = res.orders;
            this.orders = this.orders.concat(this.curArr);
            if (this.orders.length == 0) {
              this.noroder = true;
//              this.roder = false;
            }
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 初始化页面滚动
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.page_hook, {
              click: true,
              probeType: 3
            });
            // 记录最大高度
            this.maxHeight = this.scroll.maxScrollY;
            this.scroll.on('scroll', (pos) => {
              this.top_flag = pos.y < -100 ? 1 : 0;
            });
            // 上拉加载
            this.scroll.on('touchend', (pos) => {
              if (pos.y < this.maxHeight - MIN_PULL) {
                if (this.page >= this.totalPage) {
                  return;
                }
                if (this.act == 2) {
                  this._indexAjax(8);
                } else if (this.act == 0) {
                  if (this.nolis == 0) {
                    this._indexAjax(1); // 待付款
                  } else if (this.nolis == 1) {
                    this._indexAjax(2); // 待发货
                  } else if (this.nolis == 2) {
                    this._indexAjax(3); // 待收货
                  } else {
                    this._indexAjax(9);
                  }
                } else if (this.act == 1) {
                  if (this.com == 0) {
                    this._indexAjax(5); // 待评价
                  } else if (this.com == 1) {
                    this._indexAjax(6); // 已评价
                  } else {
                    this._indexAjax(7);
                  }
                } else {
                  this._indexAjax(0); // 全部订单
                }
              }
            });
          } else {
            this.scroll.refresh();
            // 记录最大高度
            this.maxHeight = this.scroll.maxScrollY;
          }
        });
      },
      _initHorScroll() {
        this.$nextTick(() => {
          for (let i = 0; i < this.orders.length; i++) {
            if (!this['_scroll' + i]) {
              this['_scroll' + i] = new BScroll(this.$refs.pic_hook[i], {
                scrollX: true
              });
            } else {
              this['_scroll' + i].refresh();
            }
          }
        });
      }
    },
    mounted() {
      this.ited = this.$route.query.type;
      if (this.ited == 1) {
        this.norder = true;
        this.uscom = false;
        this.nolis = 0;
        this.act = 0;
        this._indexAjax(1); // 待付款
      } else if (this.ited == 0) {
        this._indexAjax(0); // 全部
      } else if (this.ited == 3) {
        this.norder = true;
        this.uscom = false;
        this.act = 0;
        this.nolis = 2;
        this._indexAjax(3); // 待收货
      } else if (this.ited == 2) {
        this.norder = true;
        this.uscom = false;
        this.nolis = 1;
        this.act = 0;
        this._indexAjax(2); // 待发货
      } else if (this.ited == 5) {
        this.norder = false;
        this.uscom = true;
        this.act = 1;
        this.com = 0;
        this._indexAjax(5); // 待评价
      } else {
        this._indexAjax(0);
      }
    },
    watch: {
      orders: {
        handler(val, oldVal) {
          this.initScroll();
          this._initHorScroll();
        },
        deep: true
      },
      pro: {
        handler(val, oldVal) {
        }
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .feed-wrap {
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
    .go-top {
      position: fixed;
      right: 15px;
      bottom: 60px;
      width: 30px;
      height: 30px;
      @include bg;
      background-image: url(to_top.png);
    }
    .cont-wrap {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      .feed-cont {
        position: absolute;
        left: 0;
        top: 5px;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .ord_title {
          background: $bgff;
          border-radius: $br6;
          position: relative;
          margin: 0 5px;
          .ord_box {
            height: 40px;
            width: inherit;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .ord_list {
              width: 29%;
              height: 20px;
              position: relative;
              .titd {
                position: relative;
                height: 20px;
                line-height: 20px;
                text-align: center;
                .titfont {
                  display: inline-block;
                  font-size: 13px;
                  color: $fs53;
                }
                .titb {
                  position: relative;
                  display: inline-block;
                  height: 13px;
                  text-align: center;
                  line-height: 13px;
                  padding: 2px 5px;
                  font-size: 12px;
                  color: $fsff;
                  border-radius: $br15;
                  background: $bge5;
                  transform: scale(0.6);
                  top: -1px;
                  margin-left: -3px;
                }
              }
            }
            .active {
              .titd {
                position: relative;
                background-color: $bge5;
                border-radius: $br15;
                text-align: center;
                .titfont {
                  font-size: 13px;
                  color: $fsff;
                }
                .titb {
                  background-color: $bgff;
                  color: $fse5;
                }
              }
            }
          }
          .tib_box {
            height: 40px;
            border-top: 1px solid $bdec;
            width: inherit;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .nofi_list {
              width: 30%;
              height: 26px;
              position: relative;
              .lisd {
                position: relative;
                height: 20px;
                line-height: 20px;
                text-align: center;
                .sdsp {
                  display: inline-block;
                  font-size: 13px;
                  color: $fs53;
                }
                .sdb {
                  position: relative;
                  display: inline-block;
                  height: 13px;
                  text-align: center;
                  line-height: 13px;
                  padding: 2px 5px;
                  font-size: 12px;
                  color: $fsff;
                  border-radius: $br15;
                  background: $bge5;
                  transform: scale(0.6);
                  margin-left: -3px;
                }
              }
            }
            .active .lisd {
              position: relative;
              background-color: $bge5;
              border-radius: $br15;
              text-align: center;
              .sdsp {
                font-size: 13px;
                color: $fsff;
              }
              .sdb {
                background-color: $bgff;
                color: $fse5;
              }
            }
          }
          .com_bo {
            height: 40px;
            border-top: 1px solid $bgec;
            width: inherit;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .com_list {
              width: 29%;
              height: 20px;
              position: relative;
              .com_div {
                position: relative;
                height: 20px;
                line-height: 20px;
                text-align: center;
                .div_sp {
                  display: inline-block;
                  font-size: 13px;
                  color: $fs53;
                }
                .div_b {
                  position: relative;
                  display: inline-block;
                  height: 13px;
                  text-align: center;
                  line-height: 13px;
                  padding: 2px 5px;
                  font-size: 12px;
                  color: $fsff;
                  border-radius: $br15;
                  background: $bge5;
                  transform: scale(0.6);
                  margin-left: -3px;
                }
              }
            }
            .active .com_div {
              position: relative;
              background-color: $bge5;
              border-radius: $br15;
              text-align: center;
              .div_sp {
                font-size: 13px;
                color: $fsff;
              }
              .div_b {
                background-color: $bgff;
                color: $fse5;
              }
            }
          }
        }
        .ord_lsit {
          padding-top: 5px;
          .main_lsit {
            margin: 0 5px;
            overflow: hidden;
            .temp {
              background: $bgff;
              border-radius: 6px;
              margin-bottom: 5px;
              .te_name {
                display: flex;
                justify-content: space-between;
                padding: 0 14px 0 17px;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid $bdec;
                .ti_name {
                  flex-grow: 1;
                  @extend .dot;
                  font-size: 13px;
                  color: $fs53;
                }
                .ti_status {
                  flex-shrink: 0;
                  font-size: 13px;
                  color: $fs95;
                  .ti_b {
                    color: $fse5;
                  }
                }
              }
              .pic {
                margin-top: 1px;
                padding: 5px 0;
                overflow: hidden;
                background: $bgff;
                .ord_st {
                  text-align: center;
                  white-space: nowrap;
                  font-size: 0;
                  margin: 0 auto;
                  .item {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                    padding: 5px;
                    box-sizing: border-box;
                    margin-left: 5px;
                    border: 1px solid $bdec;
                    border-radius: $br6;
                    overflow: hidden;
                    .img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
              }
              .nu_price {
                display: flex;
                height: 40px;
                line-height: 40px;
                background: $bgff;
                border-top: 1px solid $bgec;
                border-bottom: 1px solid $bgec;
                font-size: 13px;
                color: $fs95;
                .pri_s {
                  margin-left: 23px;
                  margin-right: 15px;
                  .nub {
                    color: $fse5;
                    padding: 0 4px;
                  }
                }
                .pri_p {
                  max-width: 65%;
                  @extend .dot;
                  .mub {
                    font-size: 13px;
                    color: $fse5;
                  }
                  b {
                    color: $fse5;
                  }
                }
              }
              .butt {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                height: 40px;
                .but_star {
                  display: flex;
                  .star_fir {
                    margin: 0 3px 0 18px;
                    line-height: 23px;
                    font-size: 13px;
                    color: $fs53;
                  }
                  .lis {
                    width: 23px;
                    height: 23px;
                    background: url(i_evgstar.png) no-repeat;
                    background-size: contain;
                    &.active {
                      background: url(i_evstar.png) no-repeat;
                      background-size: contain;
                    }
                  }
                }
                .btnn {
                  display: block;
                  width: 78px;
                  height: 20px;
                  line-height: 19px;
                  text-align: center;
                  box-sizing: border-box;
                  font-size: 13px;
                  color: $fse5;
                  border: 1px solid $bdf8;
                  border-radius: $br15;
                  margin-right: 8px;
                }
                .ec53 {
                  color: $fs53;
                  border-color: $bdec;
                }
              }
              .juc {
                justify-content: space-between;
              }
            }
          }
          .load-tip {
            display: flex;
            align-items: center;
            padding: 10px 0 15px;
            font-size: 14px;
            color: $fs95;
            i {
              flex: 1;
              border-top: 1px dashed $bd95;
            }
            span {
              padding: 0 10px;
            }
          }
        }
        .alert {
          width: 298px;
          margin: 120px auto 0;
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
              background-image: url(i_no_ord.png);
            }
          }
          .cont {
            height: 129px;
            font-size: 13px;
            text-align: center;
            margin-top: 1px;
            background: $bgff;
            .txt {
              line-height: 69px;
              color: $fs31;
            }
            .btn {
              display: block;
              width: 274px;
              height: 48px;
              margin: 0 auto;
              line-height: 48px;
              color: $fse5;
              border: 1px solid $bddc;
              border-radius: $br50;
            }
          }
        }
      }
    }
    /*取消订单弹层*/
    .ay_can_ord {
      position: fixed;
      left: 0;
      top: 40px;
      z-index: 9;
      width: 100%;
      height: 100%;
      background: rgba(236, 240, 243, .6);
      .can_box {
        width: 298px;
        margin: 110px auto 0;
        padding-bottom: 10px;
        border-radius: $br20;
        overflow: hidden;
        background: $bgff;
        .tips_title {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid $bgec;
          position: relative;
        }
        .tips_icon {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 30px;
          height: 30px;
          margin-left: -15px;
          margin-top: -15px;
          background: url(i_trash.png) no-repeat;
          background-size: contain;
        }
        .info_box {
          width: 274px;
          margin: 0 auto;
          .check_box {
            width: 155px;
            margin: 0 auto;
            padding: 12px 0 8px;
            .sotre_name {
              display: flex;
              align-items: center;
              height: 25px;
              background: $bgff;
              overflow: hidden;
              .left_box {
                width: 25px;
                height: 25px;
                margin-right: 5px;
                position: relative;
                .inp_bg {
                  display: block;
                  z-index: 1;
                  width: 25px;
                  height: 25px;
                  @include bg(23px 23px);
                  background-image: url("i_check.png");
                }
                .active {
                  @include bg(23px 23px);
                  background-image: url("i_checked.png");
                }
              }
              .right_txt {
                color: $fs95;
                font-size: 12px;
              }

            }
          }
          .btn_box {
            height: 50px;
            margin-top: 10px;
            border: 1px solid $bgec;
            border-radius: $br50;
            overflow: hidden;
            position: relative;
            .bt {
              display: block;
              width: 100%;
              height: 100%;
              line-height: 48px;
              text-align: center;
              font-size: 14px;
              color: $fse5;
            }
            .fs95 {
              color: $fs95;
            }
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
