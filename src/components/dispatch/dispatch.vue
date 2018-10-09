<template>
  <div class="dispatch-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">配送信息</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="order-list" v-for="item in list">
          <div class="item-box">
            <div class="item">
              <div class="cont">
                <div class="pic-show">
                  <div class="img-box">
                    <img class="img" v-lazy="item.item[0].img_thumb_url" alt="">
                    <!--<span class="tips">备货中</span>-->
                  </div>
                  <div class="txt-box">
                    <div class="text store">
                      <s class="color">店铺：</s>
                      <s class="txt">{{item.store_name}}</s>
                    </div>
                    <div class="text dispatch">
                      <s class="color">配送：</s>
                      <s class="txt">由{{item.store_name}}进行配送</s>
                    </div>
                    <div class="text freight">
                      <s class="color">运费：</s>
                      <s class="txt" v-if="isTips(item)">{{item.express_fee ? '￥' + item.express_fee + '+运费到付' : item._express ? item._express : '运费到付'}}</s>
                      <s class="txt" v-else>{{item.express_fee ? '￥' + item.express_fee : item._express ? item._express : '包邮'}}</s>
                    </div>
                  </div>
                  <div class="toggle-wrap">
                    <div class="txt">共 {{item._express ? 1 : item._num}} 件</div>
                    <div class="toggle-box" v-show="item._num > 1" :class="{on:item._seen}"
                         @click="item._seen = !item._seen">
                      {{item._seen ? '收起' : '查看'}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="pic" ref="pic_hook" v-show="item._seen">
              <ul class="img-list" v-if="item.item.length">
                <template v-for="items in item.item">
                  <li class="item" v-for="_item in items.item_num">
                    <img class="img" v-lazy="items.img_thumb_url" alt="">
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {getStyle, getLocal} from '../../common/js/util';

  export default {
    data() {
      return {
        list: [],
        addressObj: getLocal('_address'),
        goodsNum: getLocal('_goodsNum')
      };
    },
    mounted() {
      this.getExpress();
    },
    methods: {
      isTips(item) {
        return item.supplier_id == 48;
      },
      getExpress() {
        if (this.$route.query.fridge) {
          this.list = getLocal('_list');
          for (let i = 0; i < this.list.length; i++) {
            let temp = 0;
            for (let j = 0; j < this.list[i].item.length; j++) {
              temp += this.list[i].item[j].item_num;
            }
            // 为每一项设置显示开关
            this.$set(this.list[i], '_seen', false);
            // 为每一项设置显示开关
            this.$set(this.list[i], '_num', temp);
          }
          return;
        }
        this.$http.post(api.orderExpress, qs.stringify({
          address: this.addressObj.id,
          item: this.goodsNum,
          to_store: this.addressObj.id == 0 ? 1 : 0
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.list = res.data.supplier;
            for (let i = 0; i < this.list.length; i++) {
              let temp = 0;
              for (let j = 0; j < this.list[i].item.length; j++) {
                temp += this.list[i].item[j].item_num;
              }
              // 为每一项设置显示开关
              this.$set(this.list[i], '_seen', false);
              // 为每一项设置显示开关
              this.$set(this.list[i], '_num', temp);
            }
          }
        });
      },
      // 初始化页面滚动
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
          this.initHorScroll();
        });
      },
      // 初始化横向滚动
      initHorScroll() {
        this.$nextTick(() => {
          let pics = this.$refs.pic_hook;
          for (let i = 0; i < pics.length; i++) {
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
        });
      }
    },
    watch: {
      list: {
        handler(val, oldVal) {
          this.initScroll();
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .dispatch-wrap {
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
      z-index: 1;
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
      .scroll-wrap {
        padding: 5px;
      }
      .com {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        margin-top: 5px;
        padding: 0 10px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
      }
      .order-list {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        &:first-child {
          margin-top: 0;
        }
        .item {
          position: relative;
          width: 100%;
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
                border: 1px solid $bdf0;
                border-radius: $br6;
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
                .text {
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  word-break: break-all;
                  height: 20px;
                  line-height: 20px;
                  font-size: 13px;
                  overflow: hidden;
                  .color {
                    color: $fs95;
                  }
                  .txt {
                    color: $fs53;
                  }
                }
                .freight {
                  .txt {
                    color: $fse5;
                  }
                }
              }
              .toggle-wrap {
                align-self: flex-end;
                width: 60px;
                height: 45px;
                margin: 0 10px 0 0;
                font-size: 13px;
                color: $fs53;
                .txt {
                  text-align: center;
                  padding-bottom: 5px;
                }
                .toggle-box {
                  position: relative;
                  width: 58px;
                  line-height: 18px;
                  text-align: center;
                  color: $fse5;
                  border: 1px solid $bddc;
                  border-radius: $br20;
                  &.on {
                    color: $fs53;
                  }
                }
              }
            }
          }
        }
        .pic {
          margin-top: 1px;
          padding: 5px 0;
          overflow: hidden;
          background: $bgff;
          .img-list {
            white-space: nowrap;
            font-size: 0;
            .item {
              display: inline-block;
              width: 80px;
              height: 80px;
              margin-left: 10px;
              border: 1px solid $bdf0;
              border-radius: $br6;
              overflow: hidden;
              box-sizing: border-box;
              .img {
                width: 100%;
                height: 100%;
              }
            }
          }
        }
      }
    }
  }
</style>
