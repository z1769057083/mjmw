<template>
  <div class="orderList-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" href="javascript:window.history.go(-1)"></a>
      <p class="txt">商品清单（共3件）</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 普通商品 -->
        <div class="pro-box">
          <div class="title">
            <span class="left">每家美物</span>
            <span class="right">共 1 件</span>
          </div>
          <div class="item-box">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" src="http://placeholder.qiniudn.com/300" alt="">
                    <span class="tips">备货中</span>
                  </div>
                  <div class="txt-box">
                    <h3 class="name">每家美物牌蛋挞味道冰激凌每每家美物牌蛋挞味冰凌冰激</h3>
                    <div class="price"><b class="small">￥</b>30000.90</div>
                    <div class="mj-box">
                      <span class="border">可用<i class="ic_mj"></i>2000</span>
                    </div>
                  </div>
                  <div class="txt-num">X5<br>1.05kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 普通商品 -->
        <div class="pro-box">
          <div class="title">
            <span class="left">每家美物</span>
            <span class="right">共 1 件</span>
          </div>
          <div class="item-box">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" src="http://placeholder.qiniudn.com/300" alt="">
                    <span class="tips">备货中</span>
                  </div>
                  <div class="txt-box">
                    <h3 class="name">每家美物牌蛋挞味道冰激凌每每家美物牌蛋挞味冰凌冰激</h3>
                    <div class="price"><b class="small">￥</b>30000.90</div>
                    <div class="mj-box">
                      <span class="border">可用<i class="ic_mj"></i>2000</span>
                    </div>
                  </div>
                  <div class="txt-num">X5<br>1.05kg</div>
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
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState(['comfirmObj'])
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
        var arr1 = [];
        // 把每一项转成数组
        for (let i = 0; i < this.comfirmObj.list.length; i++) {
          var arr2 = [];
          arr2.push(this.list[i]);
          arr1.push(arr2);
        }
        // 把相同供应商非套装数组合并
        for (let i = 0; i < arr1.length; i++) {
          for (let j = i + 1; j < arr1.length; j++) {
            if (arr1[i][0].supplier_id === arr1[j][0].supplier_id && arr1[j][0].is_bundling !== '1') {
              var tmepArr = arr1.splice(j, 1);
              arr1[i].push(tmepArr[0][0]);
              j--;
            }
          }
        }
        // 根据当前组的分类状态确定当前组的选中状态
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr1[i].length; j++) {
            if (!arr1[i][j].checked) {
              arr1[i].checked = false;
              break;
            } else {
              arr1[i].checked = true;
            }
          }
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
