<template>
  <div class="help-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">帮助</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="issue" :class="{first: index == 0}" v-for="(item, index) in arr">
          <div class="title" :class="{on: item.flag}">
            <i class="icon tip"></i>
            <div class="txt">{{item.issue}}</div>
            <i class="icon btn" @click="item.flag = !item.flag"></i>
          </div>
          <transition>
            <ul class="cont" v-show="item.flag">
              <li class="item">{{item.answer}}</li>
            </ul>
          </transition>
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
        arr: [
          {
            issue: '每家美物·美的冰箱的售后服务如何?',
            answer: '该冰箱是天汇联合、TCL智能家居与美的联合研发、由美的生产的。售后服务依照国家标准，享受美的品牌售后服务保障。按照国家三包条例，自购买之日起，整机免费包修一年，主要零部件免费包修三年。主要零部件包括：压缩机、主控板、显控板、温控器、蒸发器、冷凝器、电磁阀、过滤器、毛细管、风扇电机。',
            flag: false
          },
          {
            issue: '参与"充值送冰箱活动"，免费送的冰箱能开具发票吗?',
            answer: '每家美物·美的智能冰箱是商城充值赠送给您的，不是商品购买，因此不能开具发票。此冰箱无需凭借发票享受美的质保和售后服务，请您放心。',
            flag: false
          },
          {
            issue: '冰箱物流费用如何结算',
            answer: '物流费用取决于您的实际收货地址，因此请您在填写订单信息时，准确、完整填写您的收货信息，我们会根据您的收货地址提供预估物流费用，您在收货时根据实际发生物流费用直接支付给送货人员即可。',
            flag: false
          },
          {
            issue: '物流到货后需要自己搬运吗？',
            answer: '物流公司提供送货入户服务，楼层为1层的用户不收取入户费用。楼梯住户需提供入户服务时，入户搬运费用=楼层*100元/层。电梯2层以上用户统一收取100元入户搬运费用（以上计费标准为最高计费标准，不同区域会有差异，请以物流人员实际结算报价为准）',
            flag: false
          },
          {
            issue: '冰箱到货后发现损坏如何处理？',
            answer: '请您在冰箱到货后先检查冰箱外包装，确认外包装完好后再进行签收。若外包装破损，请您拍照留存外包装破损情况，并拒绝签收，我们的客服人员会与您联系核实，并重新为您配送新的冰箱。若外包装完好，签收后发现冰箱有损坏，您可以拨打美的售后服务热线400-889-9315，会有专人为您解决问题。',
            flag: false
          },
          {
            issue: '冰箱到货后可以直接使用吗？',
            answer: '冰箱运送途中因颠簸，可能会使冰箱内制冷液不稳定。请您在冰箱到货后，先将冰箱静置4小时后再通电使用。',
            flag: false
          }
        ]
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
    },
    watch: {
      arr: {
        handler: function(val, oldVal) {
          this.initScroll();
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .help-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
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
      background: $bgec;
      .scroll-wrap {
        padding: 5px;
      }
      .issue {
        border-radius: $br6;
        overflow: hidden;
        margin-top: 5px;
        &.first {
          margin-top: 0;
        }
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 0 5px;
          font-size: 13px;
          color: $fs1b;
          background: $bgff;
          &.on {
            .tip {
              background-image: url(i_ask_a.png);
            }
            .btn {
              background-image: url(i_up_arrow.png);
            }
          }
          .icon {
            flex: 0 0 30px;
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .tip {
            background-image: url(i_ask_d.png);
          }
          .btn {
            background-image: url(i_bottom_arrow.png);
          }
          .txt {
            flex: 1;
            display: -webkit-box;
            max-height: 30px;
            line-height: 15px;
            padding-right: 5px;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
            overflow: hidden;
          }
        }
        .cont {
          text-align: justify;
          margin-top: 1px;
          padding: 0 35px 25px;
          font-size: 12px;
          color: $fs31;
          background: $bgff;
          .item {
            position: relative;
            line-height: 1.5;
            padding-top: 20px;
          }
        }
      }
    }
  }
</style>
