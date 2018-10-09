<template>
  <div class="newsCenter-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">消息中心</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 消息中心 -->
        <div class="item news-notify" v-show="0">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">消息通知</span>
            <b class="num">99</b>
          </div>
          <div class="right">
            <i class="icon"></i>
          </div>
        </div>
        <!-- 促销活动 -->
        <div class="item news-sales" v-show="0">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">促销活动</span>
            <b class="num">99</b>
          </div>
          <div class="right">
            <i class="icon"></i>
          </div>
        </div>
        <!-- 物流信息 -->
        <div class="item news-logistics">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">物流信息</span>
            <b class="num" v-show="0">99</b>
          </div>
          <router-link tag="div" class="right" :to="{name: 'logisticsNews'}">
            <i class="icon"></i>
          </router-link>
        </div>
        <!-- 优惠券信息 -->
        <div class="item news-coupon" v-show="0">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">优惠券信息</span>
            <b class="num">99</b>
          </div>
          <div class="right">
            <i class="icon"></i>
          </div>
        </div>
        <!-- 订单消息 -->
        <div class="item news-order">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">订单消息</span>
            <b class="num" v-show="0">99</b>
          </div>
          <router-link tag="div" class="right" :to="{name: 'newsCenterOrder'}">
            <i class="icon"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';

  export default {
    data() {
      return {
        sign: false
      };
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
      }
    },
    mounted() {
      this.initScroll();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .newsCenter-wrap {
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
        height: 30px;
        margin-top: -16px;
        @include bg(23px 23px);
      }
      .back {
        left: 9px;
        width: 30px;
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
      .scroll-wrap {
        padding: 5px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        margin-top: 5px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
        &:first-child {
          margin-top: 0;
        }
        .left {
          position: relative;
          display: flex;
          .icon {
            margin: 0 3px;
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            color: $fs1b;
          }
          .num {
            position: absolute;
            right: -26px;
            top: 50%;
            text-align: center;
            margin-top: -9px;
            padding: 3px 6px;
            font-size: 12px;
            color: $fsff;
            transform: scale(0.6);
            border-radius: 100px;
            background: $bge5;
          }
        }
        .right {
          display: flex;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url(i_right_arrow.png);
          }
        }
      }
      .news-notify {
        .left {
          .icon {
            background-image: url(i_mess.png);
          }
        }
      }
      .news-sales {
        .left {
          .icon {
            background-image: url(i_sale.png);
          }
        }
      }
      .news-logistics {
        .left {
          .icon {
            background-image: url(i_logistic.png);
          }
        }
      }
      .news-coupon {
        .left {
          .icon {
            background-image: url(i_coupon.png);
          }
        }
      }
      .news-order {
        .left {
          .icon {
            background-image: url(i_order.png);
          }
        }
      }
    }
  }
</style>
