<template>
  <div class="feed-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <div class="head-nav">
        <router-link class="item" :to="{name: 'goods', query: {itemid: $route.query.itemid}}">商品</router-link>
        <router-link class="item" :to="{name: 'goods', query: {itemid: $route.query.itemid}}">详情</router-link>
        <a class="item active">评价</a>
      </div>
      <a class="share pos" v-show=""></a>
      <div class="desk-nav pos" v-show=""></div>
    </header>
    <div class="main">
      <ul class="tab-bar">
        <li class="item" :class="{active: grade == 0}" @click="getFeed(0)">
          <span class="txt">全部</span>
          <span class="num">{{feed.total}}</span>
        </li>
        <li class="item" :class="{active: grade == 1}" @click="getFeed(1)">
          <span class="txt">好评</span>
          <span class="num">{{feed.rate1}}</span>
        </li>
        <li class="item" :class="{active: grade == 2}" @click="getFeed(2)">
          <span class="txt">中评</span>
          <span class="num">{{feed.rate2}}</span>
        </li>
        <li class="item" :class="{active: grade == 3}" @click="getFeed(3)">
          <span class="txt">差评</span>
          <span class="num">{{feed.rate3}}</span>
        </li>
        <li class="item" :class="{active: grade == 4}" @click="getFeed(4)">
          <span class="txt">晒图</span>
          <span class="num">{{feed.imgs}}</span>
        </li>
      </ul>
      <div class="feed-cont" ref="scroll_hook">
        <div class="scroll-wrap">
          <template v-if="emptyFlag && comments.length == 0">
            <div class="zw-110"></div>
            <div class="alert">
              <div class="title">
                <span class="icon"></span>
              </div>
              <div class="cont">
                <p class="txt">此商品暂无评价内容</p>
                <a class="btn" @click="$router.back()">返回</a>
              </div>
            </div>
          </template>
          <template v-else>
            <!-- 评论列表 -->
            <div class="feed-list" v-if="grade < 4">
              <div class="feed-item" v-for="item in comments">
                <div class="title">
                  <div class="person">
                    <img v-lazy="item.photo_img_url" class="avator" alt="">
                    <span class="name">{{item.name.substr(0, 20)}}</span>
                  </div>
                  <div class="time">{{_formatDate(item.inputtime)}}</div>
                </div>
                <div class="txt">{{item.comment}}</div>
                <div class="pic" v-if="item.pic.length" ref="pic_hook">
                  <ul class="img-list">
                    <li class="item" v-for="pic in item.pic_url">
                      <img class="img" :src="pic" alt="">
                    </li>
                  </ul>
                </div>
                <div class="info">
                  <div class="time">购买日期：{{_formatDate(item.order_time)}}</div>
                  <div class="star-outer">
                    <span class="star" :class="{on: index < item.rate}" v-for="(rate, index) in 5"></span>
                  </div>
                </div>
              </div>
              <!-- 加载提示文字 -->
              <p class="load-tip" v-show="comments.length"><i></i><span>{{doneFlag ? '我是有底线的' : '上拉加载更多'}}</span><i></i>
              </p>
            </div>
            <!-- 图片列表 -->
            <div class="pic-list" v-else>
              <div class="item" v-for="(item, index) in comments">
                <div class="item-box">
                  <div class="img-box">
                    <img class="img preview-img" :src="item.url_url" alt="" @click="$preview.open(index, comments)">
                  </div>
                </div>
              </div>
              <div class="pull-wrap" v-show="0">
                <i class="icon"></i>
                <span class="txt">上拉查看更多</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 置顶按钮 -->
    <a class="go-top" v-show="topFlag" @click="goTop"></a>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {getStyle, formatDate} from '../../common/js/util';

  const MIN_PULL = 30;

  export default {
    data() {
      return {
        topFlag: 0,
        comments: [],
        feed: {
          total: 0,
          rate1: 0,
          rate2: 0,
          rate3: 0,
          imgs: 0
        },
        grade: 0,
        page: 1,
        totalPage: 1,
        doneFlag: false,
        emptyFlag: false
      };
    },
    created() {
      this.initData();
      this.initDataPic();
    },
    methods: {
      getFeed(grade) {
        this.scroll.scrollTo(0, 0, 100);
        this.page = 1;
        this.grade = grade;
        this.doneFlag = false;
        this.comments.length = 0;
        this.emptyFlag = false;
        if (grade == 4) {
          this.initDataPic(true);
          return;
        }
        this.initData();
      },
      // 置顶
      goTop() {
        this.scroll.scrollTo(0, 0, 100);
      },
      // 初始化页面滚动
      initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            click: true,
            probeType: 3
          });
          // 记录最大高度
          this.maxHeight = this.scroll.maxScrollY;

          this.scroll.on('scroll', (pos) => {
            this.topFlag = pos.y < -100 ? true : false;
          });
          // 上拉加载
          this.scroll.on('touchend', (pos) => {
            if (pos.y < this.maxHeight - MIN_PULL) {
              this.page += 1;
              if (this.page > this.totalPage) {
                return;
              }
              this.initData();
            }
          });
        } else {
          this.scroll.refresh();
          // 记录最大高度
          this.maxHeight = this.scroll.maxScrollY;
        }
      },
      // 初始化横向滚动
      initHorScroll() {
        let pics = this.$refs.pic_hook;
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
      initData() {
        this.$http.post(api.commentList, qs.stringify({
          item_id: this.$route.query.itemid,
          grade: this.grade,
          page: this.page,
          count: 10
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.emptyFlag = true;
            if (this.grade == 0) {
              this.feed.total = res.data.total;
              this.feed.rate1 = res.data.rate1;
              this.feed.rate2 = res.data.rate2;
              this.feed.rate3 = res.data.rate3;
            }
            this.comments = this.comments.concat(res.data.comments);
            this.totalPage = res.data.total_page;
            if (this.totalPage <= this.page) {
              this.doneFlag = true;
            }
          }
        });
      },
      initDataPic(flag) {
        this.$http.post(api.showCommentImage, qs.stringify({
          item_id: this.$route.query.itemid
        })).then((res) => {
          res = res.data;
          this.feed.imgs = res.data.pic.length;
          if (res.err_code == 200) {
            if (flag) {
              this.emptyFlag = true;
              this.comments = this.comments.concat(res.data.pic);
              this.comments.forEach((item) => {
                let oImg = new Image();
                oImg.src = item.url_url;
                oImg.onload = () => {
                  this.$set(item, 'src', oImg.src);
                  this.$set(item, 'w', oImg.naturalWidth);
                  this.$set(item, 'h', oImg.naturalHeight);
                };
              });
            }
          }
        });
      },
      _formatDate(time) {
        return formatDate(time, 'yyyy-MM-dd hh:mm:ss');
      }
    },
    watch: {
      comments: {
        handler() {
          this.$nextTick(() => {
            this.initScroll();
            this.initHorScroll();
          });
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
      .head-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        width: 170px;
        height: 40px;
        margin: 0 auto;
        .item {
          width: 50px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 13px;
          color: $fs31;
          border-radius: 10px;
          &.active {
            color: $fsff;
            background: $bge5;
          }
        }
      }
      .share {
        right: 55px;
        background-image: url(i_comment.png);
      }
      .desk-nav {
        right: 15px;
        background-image: url(i_shortcut.png);
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
    .main {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      .tab-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        margin: 5px;
        color: $fs53;
        border-radius: $br6;
        background: $bgff;
        .item {
          flex: 1;
          text-align: center;
          &.active {
            color: $fse5;
          }
          .txt {
            display: block;
            font-size: 13px;
          }
          .num {
            display: block;
            padding-top: 3px;
            font-size: 10px;
          }
        }
      }
      .feed-cont {
        position: absolute;
        left: 0;
        top: 50px;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .scroll-wrap {
          padding: 0 5px 5px;
        }
        .zw-110 {
          height: 110px;
        }
        .alert {
          width: 298px;
          margin: 0 auto;
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
              background-image: url(i_edit.png);
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
              color: $fs95;
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
        .feed-list {
          .feed-item {
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
              padding: 0 5px;
              background: $bgff;
              .person {
                font-size: 0;
                .avator {
                  width: 25px;
                  height: 25px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
                .name {
                  display: inline-block;
                  height: 25px;
                  line-height: 25px;
                  margin-left: 10px;
                  font-size: 10px;
                  vertical-align: middle;
                  color: $fs53;
                }
              }
              .time {
                font-size: 10px;
                color: $fs95;
              }
            }
            .txt {
              line-height: 15px;
              text-align: justify;
              margin-top: 1px;
              padding: 8px 15px;
              font-size: 10px;
              background: $bgff;
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
                  width: 65px;
                  height: 65px;
                  margin-left: 10px;
                  border-radius: $br6;
                  overflow: hidden;
                  .img {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
            .info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 40px;
              margin-top: 1px;
              padding: 0 10px 0 15px;
              background: $bgff;
              .time {
                line-height: 12px;
                font-size: 10px;
                color: $fs95;
              }
              .star-outer {
                font-size: 0;
                .star {
                  display: inline-block;
                  width: 15px;
                  height: 15px;
                  @include bg;
                  background-image: url(i_evgstar.png);
                  &.on {
                    background-image: url(i_evstar.png);
                  }
                }
              }
            }
          }
        }
        .pic-list {
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          border-radius: $br6;
          overflow: hidden;
          .item {
            flex: 0 0 33.3%;
            width: 33.3%;
            margin-top: 1px;
            box-sizing: border-box;
            .item-box {
              padding: 5px;
              margin-left: 1px;
              background: $bgff;
              .img-box {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;
                img {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
          .pull-wrap {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            font-size: 12px;
            color: $fs95;
            .icon {
              width: 30px;
              height: 30px;
              @include bg;
              background-image: url(pull_up.png);
            }
            .txt {
              padding-top: 8px;
            }
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
  }
</style>
