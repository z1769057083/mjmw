<template>
  <div class="historical-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">历史足迹</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook" v-show="newList.length">
      <div class="scroll-wrap">
        <div class="title-bar">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">历史足迹</span>
          </div>
          <div class="right" @click="empty">
            <span class="txt">清空</span>
            <i class="icon"></i>
          </div>
        </div>
        <template v-for="items in newList">
          <div class="pro-box" v-for="item in items">
            <div class="item-box">
              <div class="item" :class="{on: item.left}" v-finger:swipe="swipe.bind(this, item)">
                <div class="cont">
                  <div class="btn-box">
                    <span class="btn"></span>
                  </div>
                  <router-link :to="{name: 'goods', query: {itemid: item.item_id}}" class="pic-show">
                    <div class="img-box">
                      <img class="img" v-lazy="item.thumb_url" alt="">
                      <span class="tips" v-if="item.is_prepare == 1">备货中</span>
                      <span class="tips" v-else-if="item.storage < 1">已抢光</span>
                    </div>
                    <div class="txt-box">
                      <h3 class="name">{{ item.item_name }}</h3>
                      <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                      <div class="price" v-else><b class="small">￥</b>{{item.item_price}}</div>
                      <div class="mj-box">
                      <span class="border" v-if="item.is_mjb == 1">可用<i class="ic_mj"></i>{{
                        item.item_price }}</span>
                        <span class="border" v-else-if="item.is_mjb == 2">可用<i class="ic_mj"></i>{{
                          item.mjb_value }}</span>
                      </div>
                    </div>
                  </router-link>
                </div>
                <div class="trash" @click="showToast(item)"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 为您推荐 -->
    <div class="nothing-wrap" v-if="history.length == 0">
      <div class="alert">
        <div class="title">
          <i class="icon"></i>
        </div>
        <div class="cont">
          <p class="txt">赶紧逛起来吧</p>
          <router-link :to="{name: 'home'}" class="btn btn-go">去逛逛</router-link>
        </div>
      </div>
      <div class="tui-wrap">
        <h3 class="title">为您推荐</h3>
        <div class="list-wrap">
          <div class="item" v-for="item in tui">
            <router-link :to="{name: 'goods', query: {itemid: item.item_id}}" class="item-box" tag="div">
              <div class="img-box">
                <img class="img" :src="item.thumb_url"
                     onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" :alt="item.item_name">
              </div>
              <div class="name">{{item.item_name}}</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!--删除层-->
    <div class="del-mark" v-show="flag">
      <div class="alert">
        <div class="title">
          <i class="icon-tip"></i>
        </div>
        <div class="cont">
          <p class="txt">确认删除所选商品</p>
          <a class="btn btn-ok" @click="deletesure">确认</a>
          <a class="btn btn-cancle" @click="flag = false">取消</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {setLocal, getLocal} from '../../common/js/util.js';
  import api from '../../api';

  export default {
    data() {
      return {
        tui: [],
        history: getLocal('_history') || [],
        delete: null,
        flag: false
      };
    },
    computed: {
      newList() {
        var arr1 = [];
        // 把每一项转成数组
        for (var k = 0; k < this.history.length; k++) {
          var arr2 = [];
          // 为每一个对象添加left属性
          this.$set(this.history[k], 'left', false);
          arr2.push(this.history[k]);
          arr1.push(arr2);
        }
        return arr1;
      }
    },
    methods: {
      // 清空
      empty() {
        this.history = [];
        setLocal('_history', this.history);
      },
      // 删除确认
      deletesure() {
        this.flag = false;
        this.history.splice(this.history.indexOf(this.delete), 1);
        setLocal('_history', this.history);
      },
      swipe(obj, ev) {
        if (ev.direction == 'Left') {
          // 找到已经左滑的元素，将其实还原
          for (let i = 0; i < this.history.length; i++) {
            if (this.history[i].left) {
              this.history[i].left = false;
              break;
            }
          }
          obj.left = true;
        } else if (ev.direction == 'Right') {
          obj.left = false;
        }
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
        });
      },
      getTui() {
        // 获取推荐商品列表
        this.$http.post(api.recommentData).then((res) => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.tui = res.items;
          }
        });
      },
      // 点击删除
      showToast(obj) {
        this.flag = true;
        this.delete = obj;
      }
    },
    mounted() {
      this.getTui();
      this.initScroll();
    },
    watch: {
      history: {
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

  .historical-wrap {
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
      z-index: 1;
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
      .title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        padding: 0 5px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
        .left {
          display: flex;
          align-items: center;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url(i_trace.png);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            margin-left: 5px;
            color: $fs43;
          }
        }
        .right {
          display: flex;
          align-items: center;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url(i_trash.png);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            margin-right: 2px;
            color: $fse5;
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
        .item {
          position: relative;
          width: 100%;
          transition: transform .3s;
          &.on {
            transform: translateX(-50px);
          }
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
              flex: 1;
              height: 80px;
              padding: 0 5px;
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
            }
          }
          .trash {
            position: absolute;
            right: -50px;
            top: 0;
            width: 50px;
            height: 100%;
            @include bg(30px 30px);
            background-image: url(i_trash.png);
          }
        }
      }
    }
    .nothing-wrap {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      background: $bgec;
      .alert {
        position: relative;
        z-index: 1;
        width: 298px;
        margin: 115px auto 0;
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
            background-image: url(i_foot.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .txt {
            line-height: 48px;
            text-align: center;
            padding-top: 12px;
            font-size: 13px;
            color: $fs31;
          }
          .btn {
            display: block;
            margin-top: 10px;
            width: 272px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin: 10px auto 0;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            &.btn-go {
              color: $fse5;
            }
          }
        }
      }
      .tui-wrap {
        position: absolute;
        left: 5px;
        bottom: 5px;
        right: 5px;
        border-radius: $br6;
        overflow: hidden;
        .title {
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 13px;
          color: $fs1b;
          background: $bgff;
        }
        .list-wrap {
          display: flex;
          width: 100%;
          margin-top: 1px;
          .item {
            flex: 0 0 33.3%;
            width: 33.3%;
            background: $bgff;
            .item-box {
              padding: 5px 5px 0;
              .img-box {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;
                overflow: hidden;
                .img {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                }
              }
              .name {
                height: 23px;
                line-height: 23px;
                font-size: 13px;
                color: $fs43;
                @extend .dot;
              }
            }
          }
          .item:nth-of-type(2) {
            margin-left: 1px;
            margin-right: 1px;
          }
        }
      }
    }
    .del-mark {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(236, 240, 243, .8);
      .alert {
        width: 298px;
        margin: auto;
        border-radius: $br20;
        overflow: hidden;
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          background: $bgff;
          .icon-tip {
            width: 30px;
            height: 30px;
            @include bg;
            background-image: url(i_trash_icon.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .txt {
            line-height: 48px;
            text-align: center;
            padding-top: 12px;
            font-size: 13px;
            color: $fs31;
          }
          .btn {
            display: block;
            width: 272px;
            line-height: 48px;
            text-align: center;
            margin: 10px auto 0;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            &.btn-ok {
              color: $fs53;
            }
            &.btn-cancle {
              color: $fse5;
            }
          }
        }
      }
    }
  }
</style>
