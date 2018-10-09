<template>
  <div class="mall-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">充值换购预存协议</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div>
        <div class="payment_box">
          <!--<h2 class="title">充值换购预存协议</h2>-->
          <p>1、本协议内容包括协议正文及所有每家美物已经发布的或将来可能发布的各类规则。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，任何每家美物及其关联公司提供的服务均受本协议约束。</p>
          <p>2、请您在使用每家美物服务之前务必认真阅读全部协议内容，如您对协议有任何疑问，可向每家美物咨询。一旦您使用每家美物服务，则默认您已阅读并同意本协议内容，且接受本协议对您的约束。届时您不应以未阅读本协议的内容或者未获得每家美物对您问询问题的解答等为理由，主张本协议无效，或要求撤销本协议。</p>
          <p>3、您承诺接受并遵守本协议的约定。如果您不同意本协议的约定，您应立即停止充值活动或停止使用每家美物服务。</p>
          <p>4、您在每家美物商城充值的美家钻，仅限用于每家美物商城商品选购。</p>
          <p>5、充值金额不可退、不可取出且不可转让赠予。</p>
          <p>6、每家美物有权根据需要不时地制订、修改本协议及/或各类规则，并以网站公示的方式进行公告，不再单独通知您。变更后的协议和规则一经在网站公布后，立即自动生效。如您不同意相关变更，应当立即停止使用每家美物服务。您继续使用每家美物服务的，即默认您接受经修订的协议和规则。</p>
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
      };
    },
    methods: {
      // 主体滚动
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

  .mall-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: $bgec;
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
      overflow: hidden;
      .payment_box {
        margin: 5px;
        padding: 25px;
        padding-top: 20px;
        border-radius: $br6;
        background: $bgff;
        .title{
          text-align: center;
          padding: 10px 0 15px;
          font-size: 16px;
          color: $fse5;
          @extend .dot;
        }
        p {
          line-height: 1.4;
          text-indent: 2em;
          padding-bottom: 15px;
          font-size: 14px;
          text-align: justify;
        }
      }
    }
  }
</style>
