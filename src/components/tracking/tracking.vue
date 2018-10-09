<template>
  <div class="tracking-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">订单跟踪</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="toggle" v-show="arr.length > 3">
          <i class="icon left" v-show="arr.length > 3 && num > 1" @click="goLeft"></i>
          <div class="package">
            <span class="item" v-for="(item, index) in arr">
              <s class="txt" :class="{active: index == 1}">{{item}}</s>
            </span>
          </div>
          <i class="icon right" v-show="arr.length > 3 && num < arr.length - 2" @click="goRight"></i>
        </div>
        <template v-for="(item, index) in list" v-if="index == num - 1">
          <div class="order-list">
            <div class="title">
              <span class="left">{{item.supplier_name}}</span>
            </div>
            <div class="item-box">
              <div class="item">
                <div class="cont">
                  <div class="pic-show">
                    <div class="img-box">
                      <img class="img" :src="item.thumb_url" alt="">
                      <span class="tips" v-show="0">备货中</span>
                    </div>
                    <div class="txt-box">
                      <div class="text store">
                        <s class="color">店铺：</s>
                        <s class="txt">{{item.supplier_name}}</s>
                      </div>
                      <div class="text dispatch">
                        <s class="color">配送：</s>
                        <s class="txt">由{{item.supplier_name}}进行配送</s>
                      </div>
                      <div class="text freight">
                        <s class="color">运费：</s>
                        <s class="txt" v-if="isTips">{{other.express_fee > 0 ? '￥' + other.express_fee + '+运费到付' : '运费到付'}}</s>
                        <s class="txt" v-else-if="item.item_id == 1">到货后物流公司收取</s>
                        <s class="txt" v-else>{{other.express_fee > 0 ? '￥' + other.express_fee : '包邮'}}</s>
                      </div>
                    </div>
                    <div class="toggle-wrap" v-if="0" @click="seenFlag = !seenFlag">
                      <div class="txt">共 {{item.item_num}} 件</div>
                      <div class="toggle-box" v-if="!seenFlag">查看</div>
                      <div class="toggle-box on" v-else>收起</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pic" ref="pic_hook" v-show="seenFlag && 0">
                <ul class="img-list" style="width: 540px;">
                  <li class="item">
                    <img class="img" src="http://placeholder.qiniudn.com/100" alt="">
                  </li>
                  <li class="item">
                    <img class="img" src="http://placeholder.qiniudn.com/100" alt="">
                  </li>
                  <li class="item">
                    <img class="img" src="http://placeholder.qiniudn.com/100" alt="">
                  </li>
                  <li class="item">
                    <img class="img" src="http://placeholder.qiniudn.com/100" alt="">
                  </li>
                  <li class="item">
                    <img class="img" src="http://placeholder.qiniudn.com/100" alt="">
                  </li>
                  <li class="item">
                    <img class="img" src="http://placeholder.qiniudn.com/100" alt="">
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="pack-info">
            <ul class="time-line">
              <template v-for="(obj, index) in packs" v-if="index == num - 1">
                <li class="item" v-for="pack in obj.track.result.data">
                  <span class="time">{{_formatDate(pack.time)}}</span>
                  <span class="txt"><i class="icon"></i>{{pack.context}}</span>
                </li>
              </template>
              <li class="item">
                <span class="time">{{_formatDate(other.pay_time)}}</span>
                <span class="txt"><i class="icon"></i>订单付款成功</span>
              </li>
              <li class="item">
                <span class="time">{{_formatDate(other.order_time)}}</span>
                <span class="txt"><i class="icon"></i>订单已提交，等待付款</span>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {formatDate} from '../../common/js/util';

  export default {
    data() {
      return {
        seenFlag: false,
        arr: ['', ''],
        list: [],
        packs: [],
        other: {},
        num: 1,
        orderId: this.$route.query.order_id
      };
    },
    computed: {
      isTips() {
        return this.list.find((item) => {
          return item.supplier_id == 48;
        });
      }
    },
    created() {
      this.initData();
    },
    methods: {
      goLeft() {
        this.num--;
        this.arr.unshift(this.arr.pop(this.arr[this.arr.length - 1]));
      },
      goRight() {
        this.num++;
        this.arr.push(this.arr.shift(this.arr[0]));
      },
      initData() {
        this.$http.post(api.orderShadow, qs.stringify({
          order_id: this.orderId
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            res = res.data;
            this.other = res;
            this.list = res.item;
            this.packs = res.pack;
            for (let i = 0; i < this.list.length; i++) {
              let num = (i + 1);
              this.arr.splice(num, 0, '包裹' + num);
            }
          }
        });
      },
      _formatDate(time) {
        return formatDate(time, 'yyyy-MM-dd hh:mm:ss');
      },
      // 初始化横向滚动
      _scroll() {
        if (!this._scroll0) {
          this._scroll0 = new BScroll(this.$refs.pic_hook, {
            scrollX: true,
            eventPassthrough: 'vertical'
          });
        } else {
          this._scroll0.refresh();
        }
      },
      // 初始化页面滚动
      _initScroll() {
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
    },
    watch: {
      arr() {
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      seenFlag() {
        this.$nextTick(() => {
          this._initScroll();
        });
      },
      num() {
        this.$nextTick(() => {
          this._initScroll();
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .tracking-wrap {
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
      bottom: 0;
      overflow: hidden;
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
      .toggle {
        position: relative;
        height: 40px;
        padding: 0 40px;
        border-radius: $br6;
        background: $bgff;
        .icon {
          position: absolute;
          top: 50%;
          width: 30px;
          height: 30px;
          margin-top: -15px;
          @include bg(23px 23px);
          &.left {
            left: 5px;
            background-image: url(i_left_arrow2.png);
          }
          &.right {
            right: 5px;
            background-image: url(i_right_arrow2.png);
          }
        }
        .package {
          display: flex;
          align-items: center;
          height: 100%;
          color: $fs53;
          white-space: nowrap;
          overflow: hidden;
          .item {
            flex: 0 0 33.3%;
            width: 33.3%;
            text-align: center;
            .txt {
              display: inline-block;
              width: 60px;
              line-height: 20px;
              font-size: 13px;
              border-radius: $br20;
              &.active {
                color: $fsff;
                background: $bge5;
              }
            }
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
          .color {
            color: $fse5;
          }
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
                .text {
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  word-break: break-all;
                  height: 20px;
                  line-height: 20px;
                  font-size: 13px;
                  overflow: hidden;
                  .color {
                    color: $fs95;
                  }
                  .txt {
                    color: $fs53;
                  }
                }
                .freight {
                  .txt {
                    color: $fse5;
                  }
                }
              }
              .toggle-wrap {
                align-self: flex-end;
                width: 60px;
                height: 45px;
                margin: 0 10px;
                font-size: 13px;
                color: $fs53;
                .txt {
                  text-align: center;
                  padding-bottom: 5px;
                }
                .toggle-box {
                  position: relative;
                  width: 58px;
                  line-height: 18px;
                  text-align: center;
                  border: 1px solid $bddc;
                  border-radius: $br20;
                  &.on {
                    color: $fse5
                  }
                }
              }
            }
          }
        }
        .pic {
          margin-top: 1px;
          padding: 5px 0;
          overflow: hidden;
          background: $bgff;
          .img-list {
            text-align: center;
            white-space: nowrap;
            font-size: 0;
            .item {
              display: inline-block;
              width: 80px;
              height: 80px;
              margin-left: 10px;
              border-radius: $br6;
              overflow: hidden;
              .img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
      .pack-info {
        margin-top: 5px;
        padding: 30px 0;
        border-radius: $br6;
        background: $bgff;
        .time-line {
          font-size: 12px;
          line-height: 14px;
          margin-right: 46px;
          .item {
            position: relative;
            margin-left: 105px;
            padding-bottom: 22px;
            border-left: 1px solid $bde6;
            transition: all .3s;
            &:after {
              content: "";
              position: absolute;
              left: -16px;
              top: -15px;
              width: 30px;
              height: 30px;
              @include bg(17px 17px);
              background-image: url(i_point_d.png);
            }
            &:first-child {
              .time {
                color: $fse5;
              }
              .txt {
                color: $fsff;
                border-color: $bde5;
                background: $bge5;
                .icon {
                  background-image: url(i_post_a.png);
                }
              }
              &:after {
                background-image: url(i_point_a.png);
              }
            }
            &:last-child {
              padding-bottom: 0;
            }
            .time {
              position: absolute;
              left: -94px;
              top: 0;
              width: 70px;
              text-align: right;
              color: $fs95;
            }
            .txt {
              position: relative;
              display: inline-block;
              margin-left: 24px;
              padding: 6px 14px;
              color: $fs53;
              border-radius: $br6;
              border-top-left-radius: 0;
              border: 1px solid $bde3;
              .icon {
                position: absolute;
                left: -9px;
                top: -2px;
                width: 9px;
                height: 9px;
                @include bg;
                background-image: url(i_post_d.png);
              }
            }
          }
        }
      }
    }
  }
</style>
