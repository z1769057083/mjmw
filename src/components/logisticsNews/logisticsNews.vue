<template>
  <div class="logisticsNews-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">物流消息</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 没有消息 -->
        <template>
          <div class="zw-110"></div>
          <div class="alert">
            <div class="title">
              <slot name="icon"><i class="icon"></i></slot>
            </div>
            <div class="cont">
              <div class="zw-10"></div>
              <div name="txt" class="txt">您暂时没有新消息</div>
              <a name="btn" class="btn" @click="$router.back()">确定</a>
            </div>
          </div>
        </template>
        <!-- 普通商品 -->
        <div class="pro-box" v-show="0">
          <div class="title">
            <span class="left">2016.05.10 09:23:11</span>
            <span class="right">状态：订单未支付</span>
          </div>
          <div class="item-box">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" src="http://placeholder.qiniudn.com/300" alt="">
                    <span class="tips">备货中</span>
                  </div>
                  <div class="txt-box">您购买的东西还未支付，订单即将失效，快去看看吧。</div>
                </div>
              </div>
            </div>
          </div>
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

  .logisticsNews-wrap {
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
      .zw-110 {
        height: 110px;
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
          font-size: 15px;
          color: $fse5;
          background: $bgff;
          .icon {
            width: 30px;
            height: 30px;
            @include bg;
            background-image: url(i_warp.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .txt {
            padding: 20px 15px;
            line-height: 1.2;
            text-align: center;
            font-size: 13px;
            color: $fs31;
          }
          .color {
            color: $fse5;
          }
          .btn {
            display: block;
            width: 274px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin: 10px auto 0;
            font-size: 13px;
            color: $fse5;
            border: 1px solid $bddc;
            border-radius: 50px;
            overflow: hidden;
          }
        }
      }
      .pro-box {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        &:first-child {
          margin-top: 0;
        }
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 0 12px;
          background: $bgff;
          font-size: 13px;
          .left {
            color: $fs95;
          }
          .right {
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
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                max-height: 40px;
                line-height: 20px;
                text-align: justify;
                padding: 0 28px;
                font-size: 13px;
                color: $fs53;
                overflow: hidden;
              }
            }
          }
        }
      }
    }
  }
</style>
