<template>
  <div class="feed-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">评价中心</p>
    </header>
    <div class="cont-wrap">
      <div class="feed-cont" ref="page_hook">
        <div>
          <!-- 暂无评价 -->
          <div class="alert" v-show="noeval">
            <div class="title">
              <span class="icon"></span>
            </div>
            <div class="cont">
              <p class="txt">您还没有待评价商品</p>
              <a class="btn" @click="$router.back()">返回</a>
            </div>
          </div>
          <!-- 列表 -->
          <!--title-->
          <div class="ord_title" v-show="evall">
            <ul class="eval_box">
              <li class="eval_list" :class="{active: act == 0}" @click="listit(0)">
                <div class="titd">
                  <span class="titfont">待评价</span>
                  <b class="titb" v-if="pro.no_say > 0">{{pro.no_say}}</b>
                </div>
              </li>
              <li class="eval_list" :class="{active: act == 1}" @click="listit(1)">
                <div class="titd">
                  <span class="titfont">已评价</span>
                  <b class="titb" v-if="pro.allow_say > 0">{{pro.allow_say}}</b>
                </div>
              </li>
            </ul>
          </div>
          <!--循环列表-->
          <div class="ord_lsit">
            <dl class="main_lsit" v-show="evall">
              <!--已评价-->
              <dd v-for="(item, index) in star" class="temp">
                <div class="item_box">
                  <div class="img_box">
                    <img class="img" :src="item.thumb_url"
                         onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'"
                         :alt="item.item_name">
                  </div>
                  <div class="img_right">
                    <div class="title">
                      <h2 class="name">{{item.item_name}}</h2>
                    </div>
                    <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                    <h3 class="price">
                      <span class="small">￥</span>{{item.price}}
                    </h3>
                    <h4 class="mj_price" v-if="item.is_mjb == 0"></h4>
                    <h4 class="mj_price" v-else>
                      <span class="border" v-if="item.is_mjb == 1">可用<i class="ic_mj"></i>{{item.price}}</span>
                      <span class="border" v-else>可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                    </h4>
                  </div>
                  <div class="img_num">
                    <span class="num_sp">X {{item.item_num}}</span>
                  </div>
                </div>
                <div class="item_con" v-if="act == 1">
                  <p class="cen_p">{{item.comment.comment}}</p>
                </div>
                <div class="item_star ite_cen" v-if="act == 1">
                  <ul class="but_star">
                    <span class="star_fir" v-if="item.comment.rate*1 < 3">差评：</span>
                    <span class="star_fir" v-if="item.comment.rate*1 == 3">中评：</span>
                    <span class="star_fir" v-if="item.comment.rate*1 > 3">好评：</span>
                    <!-- 红色的星星加class为active -->
                    <li class="lis" :class="{active: index < item.comment.rate}" v-for="(temp, index) in ratenu"></li>
                  </ul>
                  <a class="btnn" @click="oncebuy(item)">再次购买</a>
                </div>
                <div class="item_star" v-else>
                  <a class="btnn ec53" @click="oncebuy(item)">再次购买</a>
                  <router-link :to="{name: 'writeeval', query: {item_id: item.item_id, order_id: item.order_id}}" class="btnn" tag="a">评价</router-link>
                </div>
              </dd>
              <p class="load-tip" v-show="star.length"><i></i><span>{{doneFlag ? '我是有底线的' : '上拉加载更多'}}</span><i></i></p>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
    </vtoastw>
    <!-- 置顶按钮 -->
    <a class="go-top" v-show="top_flag" @click="goTop"></a>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {mapActions} from 'vuex';

  const STAR_NUM = 5;
  // 最小上拉高度
  const MIN_PULL = 30;

  export default {
    data() {
      return {
        warning: false,
        tips: '',
        top_flag: 0,
        ajaxFlag: true, // ajax开关
        doneFlag: false,
        noeval: false,
        evall: true,
        act: 0,
        page: 0,
        totalPage: 2,
        pro: {},
        ratenu: STAR_NUM,
        curArr: [],
        star: []
      };
    },
    methods: {
      // 添加购物车
      ...mapActions(['add']),
      // 点击再次购买
      oncebuy(obj) {
        if (obj.is_part == 1) {
          this.add(obj.bundlings[0]);
        } else {
          this.add(obj);
        }
        setTimeout(() => {
          this.$router.push({name: 'cart'});
        }, 300);
      },
      // 切换title
      listit(num) {
        this.act = num;
        this.page = 0;
        this.curArr = [];
        this.curArr.length = 0;
        this.star = this.curArr;
        this.ajaxFlag = true;
        this._indexAjax();
      },
      // 置顶
      goTop() {
        this.scroll.scrollTo(0, 0, 100);
      },
      // 页面滚动
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.page_hook, {
              click: true,
              probeType: 3
            });
            // 记录最大高度
            this.maxHeight = this.scroll.maxScrollY;
            this.scroll.on('scroll', (pos) => {
              this.top_flag = pos.y < -100 ? 1 : 0;
            });
            // 上拉加载
            this.scroll.on('touchend', (pos) => {
              if (pos.y < this.maxHeight - MIN_PULL) {
                if (this.page >= this.totalPage) {
                  return;
                }
                this._indexAjax();
              }
            });
          } else {
            this.scroll.refresh();
            // 记录最大高度
            this.maxHeight = this.scroll.maxScrollY;
          }
        });
      },
      // 初始数据加载
      _indexAjax() {
        if (!this.ajaxFlag) {
          return;
        }
        this.ajaxFlag = false;
        this.$http.post(api.commentCenter, qs.stringify({
          flag: this.act,
          count: 10,
          page: ++this.page
        })).then(res => {
          console.log(res);
          if (res.data.err_code == 200) {
            res = res.data.data;
            console.log(res);
            this.pro = res;
            this.curArr = res.items;
            this.ajaxFlag = true;
            this.star = this.star.concat(this.curArr);
            if (this.star.length == 0) {
              this.noeval = true;
              this.evall = false;
            }
            this.totalPage = res.total_page;
            if (this.page >= this.totalPage) {
              this.doneFlag = true;
            }
          } else {
            console.log('数据加载失败');
          }
          this.initScroll();
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      }
    },
    mounted() {
      this._indexAjax();
      this.initScroll();
    },
    watch: {
      orders: {
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

  .feed-wrap {
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
      @include bg(65px 15px);
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
    .go-top {
      position: fixed;
      right: 15px;
      bottom: 60px;
      width: 30px;
      height: 30px;
      @include bg;
      background-image: url(to_top.png);
    }
    .cont-wrap {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      .feed-cont {
        position: absolute;
        left: 0;
        top: 5px;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .ord_title {
          background: $bgff;
          border-radius: $br6;
          position: relative;
          margin: 0 5px;
          .eval_box {
            height: 40px;
            width: inherit;
            padding: 0 10%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            .eval_list {
              width: 31%;
              height: 20px;
              position: relative;
              .titd {
                position: relative;
                height: 20px;
                line-height: 20px;
                text-align: center;
                padding-left: 3px;
                box-sizing: border-box;
                .titfont {
                  display: inline-block;
                  font-size: 13px;
                  color: $fs53;
                }
                .titb {
                  position: relative;
                  display: inline-block;
                  height: 13px;
                  text-align: center;
                  line-height: 13px;
                  padding: 2px 5px;
                  font-size: 12px;
                  color: $fsff;
                  border-radius: $br15;
                  background: $bge5;
                  transform: scale(0.6);
                  top: -1px;
                  margin-left: -3px;
                }
              }
            }
            .active {
              .titd {
                position: relative;
                background-color: $bge5;
                border-radius: $br15;
                text-align: center;
                .titfont {
                  font-size: 13px;
                  color: $fsff;
                }
                .titb {
                  background-color: $bgff;
                  color: $fse5;
                }
              }
            }
          }
        }
        .ord_lsit {
          padding-top: 5px;
          .main_lsit {
            margin: 0 5px;
            overflow: hidden;
            .temp {
              width: 100%;
              background-color: $bgff;
              border-radius: 6px;
              margin-bottom: 5px;
              overflow: hidden;
              .item_box {
                display: flex;
                padding: 5px;
                margin-left: 1px;
                background: $bgff;
                .img_box {
                  position: relative;
                  width: 80px;
                  height: 80px;
                  border: 1px solid $bdec;
                  border-radius: $br6;
                  overflow: hidden;
                  .img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                  }
                  .tips-txt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    margin: auto;
                    font-size: 12px;
                    color: $bgff;
                    border-radius: 50%;
                    background: rgba(229, 0, 79, .8);
                  }
                }
                .img_right {
                  margin-left: 5px;
                  width: 50%;
                }
                .img_num {
                  display: flex;
                  align-items: center;
                  position: relative;
                  width: 20%;
                  .num_sp {
                    position: absolute;
                    color: $fs95;
                    right: 3px;
                    font-size: 10px;
                  }
                }
                .title {
                  display: flex;
                  align-items: center;
                  height: 40px;
                  padding-left: 3px;
                  overflow: hidden;
                  .name {
                    display: -webkit-box;
                    line-height: 15px;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    font-size: 13px;
                    color: $fs43;
                    overflow: hidden;
                  }
                }
                .price {
                  line-height: 16px;
                  font-size: 15px;
                  color: $fse5;
                  margin: 3px 0 2px;
                  .small {
                    font-size: 12px;
                  }
                }
                .mj_price {
                  height: 16px;
                  .border {
                    margin-left: 0;
                  }
                }
              }
              .item_con {
                padding: 10px 14px;
                box-sizing: border-box;
                border-top: 1px solid $bdec;
                width: 100%;
                .cen_p {
                  text-align: justify;
                  color: $fs95;
                  font-size: 10px;
                  line-height: 18px;
                }
              }
              .item_star {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                height: 40px;
                border-top: 1px solid $bdec;
                .but_star {
                  display: flex;
                  .star_fir {
                    margin: 0 3px 0 18px;
                    line-height: 23px;
                    font-size: 13px;
                    color: $fs53;
                  }
                  .lis {
                    width: 23px;
                    height: 23px;
                    background: url(i_evgstar.png) no-repeat;
                    background-size: contain;
                    &.active {
                      background: url(i_evstar.png) no-repeat;
                      background-size: contain;
                    }
                  }
                }
                .btnn {
                  display: block;
                  width: 78px;
                  height: 20px;
                  line-height: 19px;
                  text-align: center;
                  box-sizing: border-box;
                  font-size: 13px;
                  color: $fse5;
                  border: 1px solid $bdf8;
                  border-radius: $br15;
                  margin-right: 8px;
                }
                .ec53 {
                  color: $fs53;
                  border-color: $bdec;
                }
              }
              .ite_cen {
                justify-content: space-between;
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
        .alert {
          width: 298px;
          margin: 160px auto 0;
          border-radius: $br20;
          overflow: hidden;
          .title {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            background: $bgff;
            .icon {
              width: 30px;
              height: 30px;
              @include bg;
              background-image: url(i_comment_sucess.png);
            }
          }
          .cont {
            height: 129px;
            font-size: 13px;
            text-align: center;
            margin-top: 1px;
            background: $bgff;
            .txt {
              line-height: 69px;
              color: $fs31;
            }
            .btn {
              display: block;
              width: 274px;
              height: 48px;
              margin: 0 auto;
              line-height: 48px;
              color: $fse5;
              border: 1px solid $bddc;
              border-radius: $br50;
            }
          }
        }
      }
    }
  }
</style>

