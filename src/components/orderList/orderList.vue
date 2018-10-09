<template>
  <div class="orderList-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">商品清单（共{{num}}件）</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 普通商品 -->
        <div class="pro-box" v-for="(items, index) in newList()">
          <div class="title">
            <span class="left">{{items[0].supplier_name}}</span>
            <span class="right">共 {{items.allNum}} 件</span>
          </div>
          <div class="item-box" v-for="item in items">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" v-lazy="item.thumb_url" alt="">
                  </div>
                  <div class="txt-box">
                    <h3 class="name">{{ item.item_name }}</h3>
                    <div class="price" v-if="item.item_id == 1">{{item._text}}</div>
                    <div class="price" v-else><b class="small">￥</b>{{item.item_price}}</div>
                    <div class="mj-box" v-if="item.item_id != 1">
                      <span class="border" v-if="item.is_mjb == 1">可用<i class="ic_mj"></i>{{item.item_price}}</span>
                      <span class="border" v-else-if="item.is_mjb == 2">可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                    </div>
                  </div>
                  <div class="txt-num">X{{item.num}}</div>
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
  import {getLocal} from '../../common/js/util';

  export default {
    data() {
      return {
        list: getLocal('_list'),
        num: getLocal('_num')
      };
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      newList() {
        let arr1 = [];
        // 把每一项转成数组
        for (let i = 0; i < this.list.length; i++) {
          let arr2 = [];
          arr2.push(this.list[i]);
          arr1.push(arr2);
        }
        // 把相同供应商非套装数组合并
        for (let i = 0; i < arr1.length; i++) {
          for (let j = i + 1; j < arr1.length; j++) {
            if (arr1[i][0].supplier_id === arr1[j][0].supplier_id && arr1[j][0].is_bundling !== '1') {
              let tmepArr = arr1.splice(j, 1);
              arr1[i].push(tmepArr[0][0]);
              j--;
            }
          }
        }
        // 获得同一供应商的商品总数
        for (let i = 0; i < arr1.length; i++) {
          let temp = 0;
          for (let j = 0; j < arr1[i].length; j++) {
            temp += arr1[i][j].num * 1;
          }
          arr1[i].allNum = temp;
        }
        return arr1;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .orderList-wrap {
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
    }
  }
</style>
