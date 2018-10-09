<template>
  <div class="mall-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">商城精选</p>
    </header>
    <div class="main" ref="scroll_hook">
      <!-- 产品列表 -->
      <ul class="item-wrap">
        <li class="item" v-for="item in lists">
          <router-link tag="div" class="img-wrap"
                       :to="item.part_of_id > 0 ? {name: 'suit', query: {itemid: item.item_id}} : {name: 'goods', query: {itemid: item.item_id}}">
            <img width="100%" class="img" v-lazy="item.pic_url" alt="">
          </router-link>
          <div class="txt-wrap">
            <h2 class="title">{{item.title}}</h2>
            <p class="intr">{{item.subtitle}}</p>
          </div>
        </li>
        <li class="item" v-show="lists.length"><i></i><span>更多商品，敬请期待</span><i></i></li>
      </ul>
    </div>
    <!-- 置顶按钮 -->
    <a class="go-top" @click="goTop" v-show="seen"></a>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';

  export default {
    data() {
      return {
        lists: [],
        seen: false
      };
    },
    created() {
      this.initData();
    },
    methods: {
      goTop() {
        this.scroll.scrollTo(0, 0, 100);
      },
      initData() {
        this.$http.post(api.wellChosenData).then((res) => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.lists = res.choice;
          }
        });
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true,
              probeType: 3
            });
            this.scroll.on('scroll', (pos) => {
              if (pos.y < -100) {
                this.seen = true;
              } else {
                this.seen = false;
              }
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    },
    watch: {
      lists: {
        handler() {
          this.initScroll();
        },
        deep: true
      }
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
      background: $bgff;
      .item-wrap {
        padding: 5px;
        .item {
          width: 100%;
          text-align: center;
          &:last-child {
            display: flex;
            align-items: center;
            padding-bottom: 5px;
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
        .img-wrap {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 37%;
        }
        .img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: $br6;
        }
        .txt-wrap {
          padding-bottom: 14px;
          .title {
            padding: 9px 0 5px;
            font-size: 13px;
            color: $fs31;
            @extend .dot;
          }
          .intr {
            font-size: 10px;
            color: $fs95;
          }
        }
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
  }
</style>
