<template>
  <div class="merchant-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt" v-if="goods.length">{{goods[0].supplier_name}}</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <ul class="item-wrap">
          <li class="item" v-for="item in goods">
            <router-link tag="div" class="item-box" :to="{name: 'goods', query: {itemid: item.item_id}}">
              <div class="img-box">
                <img class="img" v-lazy="item.thumb_url" alt="">
              </div>
              <h2 class="title">{{item.item_name}}</h2>
              <h3 class="price"><span class="small">￥</span>{{item.item_price}}</h3>
              <h4 class="border" v-if="item.is_mjb == 1">可用<i class="ic_mj"></i>{{item.item_price}}</h4>
              <h4 class="border" v-else-if="item.is_mjb == 2">可用<i class="ic_mj"></i>{{item.mjb_value}}</h4>
            </router-link>
          </li>
        </ul>
        <!-- 加载提示文字 -->
        <p class="load-tip" v-show="goods.length"><i></i><span>{{doneFlag ? '我是有底线的' : '上拉加载更多'}}</span><i></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';

  const MIN_PULL = 30;

  export default {
    data() {
      return {
        goods: [],
        doneFlag: false,
        page: 1,
        totalPage: 1
      };
    },
    created() {
      this.initData();
    },
    methods: {
      initScroll() {
        if (!this.scroll) {
          // 主体滚动
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            probeType: 3,
            click: true
          });

          // 记录最大高度
          this.maxHeight = this.scroll.maxScrollY;

          // 上拉加载
          this.scroll.on('touchend', (pos) => {
            if (pos.y < this.maxHeight - MIN_PULL) {
              this.page += 1;
              if (this.page > this.totalPage) {
                return;
              }
              this.initData();
            }
          });
        } else {
          this.scroll.refresh();
          // 记录最大高度
          this.maxHeight = this.scroll.maxScrollY;
        }
      },
      initData() {
        this.$http.post(api.supplierIDForSupplier, qs.stringify({
          suppier_id: this.$route.query.supplier,
          page: this.page,
          count: 15
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.goods = this.goods.concat(res.data.items);
            this.totalPage = res.data.total_page;
            if (this.totalPage <= this.page) {
              this.doneFlag = true;
            }
          }
        });
      }
    },
    watch: {
      goods: {
        handler() {
          this.$nextTick(() => {
            this.initScroll();
          });
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss">
  @import "../../common/scss/common";

  .merchant-wrap {
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
      .item-wrap {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        border-radius: $br6;
        overflow: hidden;
        .item {
          flex: 0 0 33.3%;
          width: 33.3%;
          margin-top: 1px;
          box-sizing: border-box;
          .item-box {
            padding: 5px;
            margin-left: 1px;
            background: $bgff;
            .img-box {
              position: relative;
              width: 100%;
              height: 0;
              padding-top: 100%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
              }
            }
            .title {
              line-height: 15px;
              padding-top: 3px;
              font-size: 13px;
              color: $fs43;
              @extend .dot;
            }
            .price {
              line-height: 16px;
              font-size: 15px;
              color: $fse5;
              .small {
                font-size: 12px;
              }
            }
            .border {
              display: inline-flex;
              align-items: center;
              margin-left: 0;
            }
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
  }
</style>
