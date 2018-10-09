<template>
  <div class="historical-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">我的收藏</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook" v-show="wrap">
      <div class="scroll-wrap">
        <template v-for="items in newList">
          <div class="pro-box" v-for="item in items">
            <div class="item-box">
              <div class="item" :class="{on: item.left}" v-finger:swipe="swipe.bind(this, item)">
                <router-link class="cont"
                     :to="item.part_of_id > 0 ? {name: 'suit', query: {itemid: item.part_of_id}} : {name: 'goods', query: {itemid: item.item_id}}"
                     tag="div">
                  <div class="pic-show">
                    <div class="img-box">
                      <img class="img" v-lazy="item.thumb_url" alt="">
                      <span class="tips" v-if="item.storage == 0">已抢光</span>
                      <span class="tips" v-else-if="item.is_prepare == 1">备货中</span>
                    </div>
                    <div class="txt-box">
                      <h3 class="name">{{item.item_name}}</h3>
                      <h5 class="smtit">{{item.item_subtitle}}</h5>
                      <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                      <div class="price" v-else><b class="small">￥</b>{{item.item_price}}</div>
                    </div>
                    <template v-if="item.is_prepare != 1 && item.storage > 0">
                      <template v-if="item.is_part != 1 && item.item_id != 1">
                        <div class="txt-cart" @click.stop="_add(item, $event)"></div>
                      </template>
                      <template v-else>
                        <template v-if="item.part_of_id > 0">
                          <router-link tag="div" class="txt-cart" :to="{name: 'suit', query: {itemid: item.part_of_id}}"></router-link>
                        </template>
                      </template>
                    </template>
                    <div class="txt-cart off" v-else-if="item.storage == 0"></div>
                  </div>
                </router-link>
                <div class="trash" @click="showToast(item)"></div>
              </div>
            </div>
          </div>
        </template>
        <p class="last-tip" v-show="newList.length"><i></i><span>{{done_flag ? '我是有底线的' : '上拉加载更多'}}</span><i></i></p>
      </div>
    </div>
    <!-- 收藏为空 -->
    <div class="nothing-wrap" v-show="nowrap">
      <div class="alert">
        <div class="title">
          <i class="icon"></i>
        </div>
        <div class="cont">
          <p class="txt">你的收藏夹没有收藏任何商品</p>
          <router-link :to="{name: 'home', params: {back: true}}" class="btn btn-go">去逛逛</router-link>
        </div>
      </div>
    </div>
    <!-- 删除弹层 -->
    <div class="del-mark" v-show="flag">
      <div class="alert">
        <div class="title">
          <i class="icon-tip"></i>
        </div>
        <div class="cont">
          <p class="txt">确认删除所选商品</p>
          <a class="btn btn-ok" @click="deleteCollect">确认</a>
          <a class="btn btn-cancle" @click="flag = false">取消</a>
        </div>
      </div>
    </div>
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import {mapActions} from 'vuex';
  import qs from 'qs';

  // 最小上拉高度
  const MIN_PULL = 30;
  export default {
    data() {
      return {
        warning: false, // 网络开小差提示开关
        tips: '', // 网络开小差文字
        nowrap: false, // 收藏为空时开关
        wrap: true, // 收藏不为空时开关
        flag: false, // 删除图层的提示开关
        delete: null, // 商品的每个对象
        list: [], // 数据列表
        page: 1, // 当前页
        total_page: 2, // 假设总页数
        curArr: [], // 取到的数据
        ajax_start_flag: true, // ajax提示开关
        done_flag: false // 上拉加载提示文字开关
      };
    },
    computed: {
      newList() {
        var arr1 = [];
        // 把每一项转成数组
        for (var k = 0; k < this.list.length; k++) {
          var arr2 = [];
          // 为每一个对象添加left属性
          this.$set(this.list[k], 'left', false);
          arr2.push(this.list[k]);
          arr1.push(arr2);
        }
        return arr1;
      }
    },
    methods: {
      // 添加购物车
      ...mapActions(['add', 'setAni']),
      _add(obj, ev) {
        this.add(obj);
        this.setAni(ev);
      },
      swipe(obj, ev) {
        if (ev.direction == 'Left') {
          // 找到已经左滑的元素，将其实还原
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].left) {
              this.list[i].left = false;
              break;
            }
          }
          obj.left = true;
        } else if (ev.direction == 'Right') {
          obj.left = false;
        }
      },
      showToast(obj) {
        this.flag = true;
        this.delete = obj;
      },
      // 删除收藏商品
      deleteCollect() {
        this.$http.post(api.deleteCollect, qs.stringify({item_id: this.delete.item_id})).then((res) => {
          if (res.data.err_code == 200) {
            this.flag = false;
            this.list.splice(this.list.indexOf(this.delete), 1);
            if (this.list.length == 0) {
              this.nowrap = true;
              this.wrap = false;
            }
            this._initScroll();
          } else {
            console.log('数据删除失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 主体滚动
      _initScroll() {
        if (!this.scroll) {
          // 主体滚动
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            probeType: 3,
            click: true
          });
          // 记录高度
          this.maxHeight = this.scroll.maxScrollY;
          // 上拉加载
          this.scroll.on('touchend', (pos) => {
            if (pos.y < this.maxHeight - MIN_PULL) {
              this.page++;
              this._indexAjax();
            }
          });
        } else {
          this.scroll.refresh();
          // 记录高度
          this.maxHeight = this.scroll.maxScrollY;
        }
      },
      // 初始数据加载
      _indexAjax() {
        if (!this.ajax_start_flag) {
          return;
        }
        this.ajax_start_flag = false;
        this.$http.post(api.collectList, qs.stringify({
          type: 'G',
          count: 10,
          page: this.page
        })).then((res) => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.curArr = res.item;
            this.list = this.list.concat(this.curArr);
            this.total_page = res.total_page;
            this.done_flag = false;
            if (this.page >= this.total_page) {
              this.done_flag = true;
            }
            this.ajax_start_flag = true;
            if (this.list.length == 0) {
              this.nowrap = true;
              this.wrap = false;
            }
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      }
    },
    created() {
      this._indexAjax();
    },
    watch: {
      list: {
        handler(val, oldVal) {
          this.$nextTick(() => {
            this._initScroll();
          });
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
        .last-tip {
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
            height: 75px;
            background: $bgff;
            .pic-show {
              position: relative;
              display: flex;
              align-items: center;
              width: 100%;
              height: 65px;
              padding: 0 5px;
              box-sizing: border-box;
              .img-box {
                position: relative;
                flex: 0 0 65px;
                width: 65px;
                height: 65px;
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
                width: 60%;
                padding: 0 8px;
                .name {
                  line-height: 20px;
                  font-size: 13px;
                  color: $fs53;
                  @extend .dot;
                }
                .smtit {
                  line-height: 16px;
                  font-size: 10px;
                  color: $fs95;
                  @extend .dot;
                }
                .price {
                  height: 20px;
                  line-height: 20px;
                  font-size: 13px;
                  color: $fse5;
                  .small {
                    font-size: 12px;
                  }
                }
                .store {
                  font-size: 10px;
                  color: $fs95;
                }
              }
              .txt-cart {
                position: absolute;
                right: 5px;
                top: 50%;
                margin-top: -15px;
                width: 30px;
                height: 30px;
                @include bg(23px 23px);
                background-image: url(i_cart.png);
                &.off {
                  background-image: url(i_cart_empty.png);
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
        margin: 160px auto 0;
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
            background-image: url(i_wrong.png);
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
