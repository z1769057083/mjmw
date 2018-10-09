<template>
  <!-- 没有导航加.no -->
  <div class="cart-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">美家钻</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 支持美家钻 -->
        <div class="pro-box">
          <div class="title">
            <span class="left">美家钻（剩余<s class="color">{{mjb}}</s>）</span>
          </div>
          <div class="item-box" v-if="item.is_mjb > 0" v-for="item in list">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" :src="item.thumb_url"
                         onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" :alt="item.item_name">
                    <!--<span class="tips">备货中</span>-->
                  </div>
                  <div class="txt-box">
                    <h3 class="name">{{ item.item_name }}</h3>
                    <div class="price"><b class="small">￥</b>{{ item.item_price }}</div>
                    <div class="mj-box">
                      <span class="border" v-if="item.is_mjb == 1">可用<i class="ic_mj"></i>{{
                        item.item_price }}</span>
                      <span class="border" v-else-if="item.is_mjb == 2">可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                    </div>
                  </div>
                  <!-- 打开美家币加.on -->
                  <div class="switch-wrap" :class="{on: item._switch}" v-if="mjb == 0">
                    <div class="txt"><i class="ic_mj"></i> 支付</div>
                    <span class="switch-box">
                      <span class="switch-dot"></span>
                    </span>
                  </div>
                  <div class="switch-wrap" :class="{on: item._switch}" v-else @click="changeSwitch(item)">
                    <div class="txt"><i class="ic_mj"></i> 支付</div>
                    <span class="switch-box">
                      <span class="switch-dot"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 不支持美家钻 -->
        <div class="pro-box" v-show="noFlag">
          <div class="title">
            <span class="left">不支持美家钻</span>
          </div>
          <div class="item-box" v-if="item.is_mjb == 0" v-for="item in list">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" :src="item.thumb_url"
                         onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" :alt="item.item_name">
                    <!--<span class="tips">备货中</span>-->
                  </div>
                  <div class="txt-box">
                    <h3 class="name">{{item.item_name}}</h3>
                    <div class="price"><b class="small">￥</b>{{item.item_price}}</div>
                    <div class="mj-box">
                      <!--<span class="border">可用<i class="ic_mj"></i>2000</span>-->
                    </div>
                  </div>
                  <!-- 打开美家币加.on -->
                  <div class="switch-wrap">
                    <!--<div class="txt"><i class="ic_mj"></i> 支付</div>-->
                    <!--<span class="switch-box">-->
                    <!--<span class="switch-dot"></span>-->
                    <!--</span>-->
                  </div>
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
  import {setLocal, getLocal} from '../../common/js/util';

  export default {
    data() {
      return {
        mjb: getLocal('_mjb'),
        list: getLocal('_list')
      };
    },
    computed: {
      noFlag() {
        let temp = this.list.filter((item) => {
          return item.is_mjb == 0;
        });
        return temp.length ? true : false;
      }
    },
    mounted() {
      this.initScroll();
      this.checkList();
    },
    methods: {
      checkList() {
        if (this.mjb == 0) {
          for (let i = 0; i < this.list.length; i++) {
            this.list[i]._switch = false;
          }
        }
      },
      changeSwitch(obj) {
        obj._switch = !obj._switch;
        setLocal('_list', this.list);
        let arr = [];
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i]._switch == true) {
            arr.push(this.list[i].item_id + '|' + this.list[i].num + '|' + 1);
          } else {
            arr.push(this.list[i].item_id + '|' + this.list[i].num + '|' + 0);
          }
        }
        setLocal('_goodsNumMJB', arr.join(','));
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.srcoll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .cart-wrap {
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
              .switch-wrap {
                align-self: flex-end;
                width: 40px;
                height: 45px;
                margin: 0 10px;
                &.on {
                  .switch-box {
                    background: $bge5;
                    .switch-dot {
                      left: 22px;
                    }
                  }
                  .txt {
                    color: $fse5;
                  }
                }
                .txt {
                  text-align: center;
                  padding-bottom: 5px;
                  font-size: 12px;
                  color: $fs95;
                }
                .switch-box {
                  position: relative;
                  display: block;
                  width: 40px;
                  height: 20px;
                  border-radius: $br20;
                  background: $bg95;
                  .switch-dot {
                    position: absolute;
                    left: 2px;
                    top: 2px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: $bgff;
                    transition: left .2s cubic-bezier(.4, .4, .25, 1.35);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
