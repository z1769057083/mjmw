<template>
  <div class="preferential-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">优惠组合</p>
    </header>
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="list-item" v-for="(item, index) in list">
          <div class="title">
            <div class="left" @click="toggleChecked(item)"><span class="btn" :class="{on: item.checked}"></span><span
              class="txt">{{item.item_name.substr(0, 16)}}</span></div>
            <div class="right">共 {{item.items.length}} 件</div>
          </div>
          <div class="img-box" ref="imgBox">
            <ul class="img-list">
              <li class="img-item" v-for="img in item.items">
                <img class="img" :src="img.thumb_url" alt="">
              </li>
            </ul>
          </div>
          <div class="cart">
            <div class="left" v-show="0">
              <div class="top">美家价 ￥30000.00</div>
              <div class="bot">立省 ￥10000.00</div>
            </div>
            <div class="left"></div>
            <div class="right">
              <span class="price">组合价</span>
              <span class="num">{{'￥' + item.price}}</span>
              <span class="btn" :class="{gray: item.storage < 1 || item.is_prepare == 1}"
                    @click="(item.storage < 1 || item.is_prepare == 1) ? '' : add(item.bundle)"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="foot-wrap" v-if="list.length">
      <div class="num" @click="toggleCheckedAll">
        <span class="btn" :class="{on: all}"></span><span class="numb">已选（{{checkedNum}}）</span>
      </div>
      <router-link tag="div" class="cart" :to="{name: 'cart'}">
        <span class="cart-inner"><b class="num2" v-show="count > 0">{{count}}</b></span>
      </router-link>
      <div class="add" :class="{gray: checkedNum == 0}" @click="cartAdd">加入购物车</div>
    </footer>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <router-link slot="btn" class="btn" :to="{name: 'home'}">返回首页</router-link>
    </vtoastw>
  </div>
</template>

<script>
  import api from '../../api';
  import BScroll from 'better-scroll';
  import {mapActions, mapState} from 'vuex';
  import {getStyle} from '../../common/js/util';

  export default {
    data() {
      return {
        list: [],
        all: false,
        checkedNum: 0,
        warning: false,
        tips: ''
      };
    },
    computed: {
      ...mapState(['count'])
    },
    created() {
      this.initData();
    },
    methods: {
      cartAdd() {
        this.list.forEach((item) => {
          if (item.checked) {
            this.add(item.bundle);
          }
        });
      },
      toggleChecked(item) {
        if (item.storage < 1 || item.is_prepare == 1) {
          return;
        }
        item.checked = !item.checked;
        // 找出未选中的项
        let obj = this.list.find((item) => {
          return item.checked == false;
        });
        if (obj) {
          this.all = false;
        } else {
          this.all = true;
        }
      },
      toggleCheckedAll() {
        // 检查商品是否有已抢或备货中
        let emptyObj = this.list.find((item) => {
          return item.storage < 1 || item.is_prepare == 1;
        });
        if (emptyObj) {
          return;
        }
        // 找出未选中的项
        let obj = this.list.find((item) => {
          return item.checked == false;
        });
        if (obj) {
          this.list.forEach((item) => {
            item.checked = true;
          });
          this.all = true;
        } else {
          this.list.forEach((item) => {
            item.checked = false;
          });
          this.all = false;
        }
      },
      initData() {
        this.$http.get(api.detailsData + this.$route.query.itemid).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            res = res.data;
            // is_shelves 是否下架：1:正常 0:下架
            if (res.item.is_shelves == 0) {
              this.warning = !this.warning;
              this.tips = '商品已下架';
            }
            this.list = res.item.bundlings;
            this.list.forEach((item) => {
              this.$set(item, 'checked', false);
            });
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        });
      },
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
          this.initHorScroll();
        });
      },
      initHorScroll() {
        let pics = this.$refs.imgBox;
        if (pics == undefined) {
          return;
        }
        for (let i = 0; i < pics.length; i++) {
          this['horScroll' + i] = null;
          let oUl = pics[i].children[0];
          let oLi = oUl.children[0];
          oUl.style.width = (getStyle(oLi, 'width') + 10) * oUl.children.length + 'px';
          if (!this['horScroll' + i]) {
            this['horScroll' + i] = new BScroll(pics[i], {
              scrollX: true
            });
          } else {
            this['horScroll' + i].refresh();
          }
        }
      },
      ...mapActions(['add'])
    },
    watch: {
      list: {
        handler() {
          this.initScroll();
          let num = 0;
          this.list.forEach((item) => {
            if (item.checked) {
              num += 1;
            }
          });
          this.checkedNum = num;
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss">
  @import "../../common/scss/common";

  .preferential-wrap {
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
      .scroll-wrap {
        padding: 5px;
      }
      .list-item {
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
          padding: 0 10px 0 5px;
          font-size: 13px;
          color: $fs53;
          background: $bgff;
          .left {
            display: flex;
            align-items: center;
            .btn {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
              background-image: url(i_check.png);
              &.on {
                background-image: url(i_checked.png);
              }
            }
            .txt {
              height: 30px;
              line-height: 30px;
            }
          }
        }
        .img-box {
          height: 90px;
          padding: 5px 0;
          margin-top: 1px;
          overflow: hidden;
          text-align: center;
          background: $bgff;
          box-sizing: border-box;
          .img-list {
            display: inline-block;
            font-size: 0;
          }
          .img-item {
            display: inline-block;
            width: 80px;
            height: 80px;
            border-radius: $br6;
            border: 1px solid $bdf0;
            overflow: hidden;
            box-sizing: border-box;
            margin-right: 5px;
            .img {
              display: block;
              width: 100%;
              height: 100%;
            }
            &:last-child {
              margin-right: 0;
            }
          }
        }
        .cart {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-top: 1px;
          padding: 0 5px 0 10px;
          background: $bgff;
          .left {
            display: flex;
            flex-direction: column;
            .top {
              line-height: 14px;
              font-size: 12px;
              color: $fs53;
              text-decoration: line-through;
            }
            .bot {
              line-height: 20px;
              font-size: 13px;
              color: $fse5;
            }
          }
          .right {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: $fs53;
            .price {
              height: 30px;
              line-height: 30px;
              margin-right: 5px;
            }
            .num {
              height: 30px;
              line-height: 30px;
              color: $fse5;
            }
            .btn {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
              background-image: url(i_cart.png);
              &.gray {
                background-image: url(i_cart_gray.png);
              }
            }
          }
        }
      }
    }
    .foot-wrap {
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 45px;
      text-align: center;
      font-size: 13px;
      background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      .num {
        flex: 0 0 100px;
        width: 100px;
        color: $fs53;
        .btn {
          display: inline-block;
          width: 30px;
          height: 30px;
          vertical-align: middle;
          @include bg(23px 23px);
          background-image: url(i_check.png);
          &.on {
            background-image: url(i_checked.png);
          }
        }
        .numb {
          display: inline-block;
          height: 30px;
          line-height: 30px;
          vertical-align: middle;
        }
      }
      .cart {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        font-size: 13px;
        color: $fsff;
        border-left: 1px solid $bdec;
        border-right: 1px solid $bdec;
        .cart-inner {
          position: relative;
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
          background-image: url(cart_d.png);
          .num2 {
            position: absolute;
            right: -4px;
            top: 0;
            text-align: center;
            padding: 3px 6px;
            font-size: 12px;
            color: $fsff;
            transform: scale(0.6);
            border-radius: 100px;
            background: $bge5;
          }
        }
      }
      .add {
        flex: 0 0 125px;
        width: 125px;
        height: 100%;
        line-height: 45px;
        color: $fsff;
        background: $bge5;
        &.gray {
          background: $bg95;
        }
      }
    }
  }
</style>
