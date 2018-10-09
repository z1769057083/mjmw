<template>
  <div class="historical-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" href="javascript:window.history.go(-1)"></a>
      <p class="txt">历史足迹</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook" v-show="">
      <div class="scroll-wrap">
        <div class="title-bar">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">历史足迹</span>
          </div>
          <div class="right">
            <span class="txt">清空</span>
            <i class="icon"></i>
          </div>
        </div>
        <div class="pro-box">
          <div class="item-box">
            <div class="item" v-finger:swipe="swipe">
              <div class="cont">
                <div class="btn-box">
                  <span class="btn"></span>
                </div>
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
                </div>
              </div>
              <div class="trash"></div>
            </div>
          </div>
        </div>
        <div class="pro-box">
          <div class="item-box">
            <div class="item" v-finger:swipe="swipe">
              <div class="cont">
                <div class="btn-box">
                  <span class="btn"></span>
                </div>
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
                </div>
              </div>
              <div class="trash"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 为您推荐 -->
    <div class="nothing-wrap" v-show="1">
      <div class="alert">
        <div class="title">
          <i class="icon"></i>
        </div>
        <div class="cont">
          <p class="txt">赶紧逛起来吧</p>
          <router-link :to="{ name: 'home' }" class="btn btn-go">去逛逛</router-link>
        </div>
      </div>
      <div class="tui-wrap">
        <h3 class="title">为您推荐</h3>
        <div class="list-wrap">
          <div class="item" v-for="item in tui">
            <template v-if="item.is_part == 0">
              <router-link :to="{ name: 'goods', query: { itemid: item.item_id } }" class="item-box" tag="div">
                <div class="img-box">
                  <img class="img" :src="url + item.item_img_thumb"
                       onerror="this.src='http://placeholder.qiniudn.com/300'" :alt="item.item_name">
                </div>
                <div class="name">{{ item.item_name }}</div>
              </router-link>
            </template>
            <template v-else>
              <router-link :to="{ name: 'group', query: { itemid: item.item_id } }" class="item-box" tag="div">
                <div class="img-box">
                  <img class="img" :src="url + item.item_img_thumb"
                       onerror="this.src='http://placeholder.qiniudn.com/300'" :alt="item.item_name">
                </div>
                <div class="name">{{ item.item_name }}</div>
              </router-link>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';

  export default {
    data() {
      return {
        url: api.url,
        tui: []
      };
    },
    mounted() {
      this.getTui();
      this.initScroll();
    },
    methods: {
      swipe(ev) {
        if (ev.direction === 'Left') {
            alert();
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
          if (res.data.err_code === 200) {
            res = res.data.data;
            this.tui = res.items;
          }
        });
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
  }
</style>
