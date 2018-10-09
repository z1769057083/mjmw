<template>
  <div class="goods-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <div class="head-nav">
        <a class="item" :class="{active: active}" @click="goTop">商品</a>
        <a class="item" :class="{active: !active}" @click="goDesc">详情</a>
        <router-link class="item" :to="{name: 'feed', query: {itemid: $route.query.itemid}}">评价</router-link>
      </div>
      <a class="share pos" v-show="0"></a>
      <div class="desk-nav pos" v-show="0"></div>
    </header>
    <!-- 主体信息 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <!-- 商品首图 -->
        <div class="pro-img">
          <div class="img-item" v-if="pro.video && pro.video.length">
            <video class="video" controls loop :src="pro.video[0].url" ref="video"></video>
            <div class="video-mark" @click="toPlay" v-show="videoFlag"></div>
          </div>
          <div class="img-item" v-else>
            <img class="img" :src="pro.img_url" alt="">
            <div class="img-mark" v-if="pro.storage < 1">
              <span class="tip-txt">已抢光</span>
            </div>
            <div class="img-mark" v-else-if="pro.is_prepare == 1">
              <span class="tip-txt">备货中</span>
            </div>
          </div>
          <div class="img-txt">
            <div class="title">{{pro.item_name}}</div>
            <div class="price" v-if="itemid == 1">
              <a class="convert" @click="checkRecharge">立即充值兑换</a>
            </div>
            <div class="price" v-else>
              <span class="num">￥<strong class="num2">{{itemPrice}}</strong></span>
              <span class="border">可用<i class="ic_mj"></i>{{mjbVal}}</span>
            </div>
          </div>
        </div>
        <!-- 仅限冰箱兑换券 -->
        <div class="pro-only com-row" v-show="itemid == 1">
          <span class="danger">仅限冰箱兑换券使用</span>
        </div>
        <!-- 整箱销售 -->
        <div class="pro-sale com-row" v-show="pro.is_part == 1">
          <span class="danger">此商品不可单独售卖</span>
        </div>
        <!-- 商品规格 -->
        <ul class="pro-spec mar-bg" v-if="pro.spec && pro.spec.length">
          <li class="item" v-for="item in pro.spec">
            <span class="name">{{item.name}}：</span>
            <span>{{item.value}}</span>
          </li>
        </ul>
        <!-- 配送说明 -->
        <div class="pro-dist com-row" v-show="0">
          <span class="left">此商品支持分时配送</span>
          <i class="alert"></i>
        </div>
        <!-- 促销信息 -->
        <router-link class="pro-prom com-row" :to="{name: 'preferential', query: {itemid: pro.item_id}}"
                     v-show="pro.is_part == 1 && pro.bundlings.length">
          <span class="title">促销</span>
          <span class="btn">优惠套装</span>
          <span class="btn" v-show="0">领券</span>
          <span class="go-box">
            <a class="btn-go"></a>
          </span>
        </router-link>
        <!-- 说明 -->
        <div class="pro-explain com-row" v-show="0">
          <span class="title">说明</span>
          <span class="txt">此商品不参加商铺<s class="danger">满198</s>包邮活动</span>
        </div>
        <!-- 商铺 -->
        <div class="pro-explain com-row">
          <span class="title">商铺</span>
          <span class="txt">
            将由
            <router-link class="danger" :to="{name: 'merchant', query: {supplier: pro.supplier_id}}">{{pro.supplier_name}}</router-link>
            提供服务
          </span>
        </div>
        <!-- 评价 -->
        <ul class="pro-feed" v-if="comments.total">
          <li class="feed-head">
            <div class="left">
              <span class="title">评价</span>
              <span>({{comments.total}})</span>
            </div>
            <router-link class="right" tag="div" :to="{name: 'feed', query: {itemid: $route.query.itemid}}">
              <span class="good-feed">好评率{{comments.good * 100}}%</span>
              <i class="btn-go"></i>
            </router-link>
          </li>
          <li class="feed-cont" v-for="item in comments.comments">
            <div class="left">
              <h3 class="nick">{{item.name.substr(0, 20)}}</h3>
              <div class="star-outer">
                <span class="star" :class="{on: index < item.rate}" v-for="(star, index) in 5"></span>
              </div>
              <div class="txt">{{item.comment}}</div>
            </div>
            <div class="right" v-if="item.pic.length">
              <div>
                <ul class="img-list">
                  <li class="img-item" v-if="index < 3" v-for="(pic, index) in item.pic_url">
                    <img class="img" width="65" height="65" :src="pic" alt="">
                  </li>
                </ul>
              </div>
            </div>
          </li>
          <li class="feed-foot">
            <a class="color">晒图相册（{{feedPic}}）</a>
          </li>
        </ul>
        <!-- 商品介绍 -->
        <div class="pro-show" ref="desc_hook">
          <div class="title">商品介绍</div>
          <div id="has-br" class="img-show" v-html="cont"></div>
        </div>
      </div>
    </div>
    <!-- 置顶按钮 -->
    <a class="go-top" @click="goTop" v-show="btn_seen"></a>
    <!-- 页面脚 -->
    <footer class="foot-wrap">
      <!-- 收藏加.on -->
      <div class="item collect" :class="{on: collection > 0}" @click="toggleCollection"></div>
      <router-link tag="div" class="item cart" :to="{name: 'cart'}">
        <span class="cart-inner"><b class="num" v-show="count > 0">{{ count }}</b></span>
      </router-link>
      <template v-if="isOneBtn && pro.item_id">
        <router-link tag="div" class="item order" :to="{name: 'suit', query: {itemid: pro.part_of_id}}" v-if="isSuit">
          去套装</router-link>
        <div class="item add gray" v-else-if="pro.is_prepare == 1">备货中</div>
        <div class="item order" v-else-if="pro.item_id == 1" @click="checkRecharge">充值兑换</div>
      </template>
      <template v-if="!isOneBtn && pro.item_id">
        <div class="item add" :class="{gray: isGray}" @click="isGray ? '' : add(pro)">加入购物车</div>
        <a class="item order" :class="{gray: isGray}" @click="isGray ? '' : toBuy()">立即购买</a>
      </template>
    </footer>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <router-link slot="btn" class="btn" :to="{name: 'home'}">返回首页</router-link>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {mapActions, mapState} from 'vuex';
  import {getPos, setLocal, getLocal} from '../../common/js/util.js';
  import {goodsMode, checkGoods} from '../../common/js/config';
  import local from 'vue-cookie';

  export default {
    data() {
      return {
        itemid: 1,
        page: 1,
        pro: {},
        cont: '',
        btn_seen: false,
        collection: 0,
        comments: {},
        active: true,
        videoFlag: true,
        feedPic: 0,
        warning: false,
        tips: ''
      };
    },
    computed: {
      isOneBtn() {
        if (checkGoods(this.pro) == goodsMode.suit || this.pro.item_id == 1) {
          return true;
        }
        return false;
      },
      isSuit() {
        return checkGoods(this.pro) == goodsMode.suit;
      },
      itemPrice() {
        if (checkGoods(this.pro) == goodsMode.pack) {
          return (this.pro.item_price * this.pro.pack_num).toFixed(2);
        }
        return this.pro.item_price;
      },
      mjbVal() {
        // is_mjb为1是代表全部每家钻商品
        if (this.pro.is_mjb == 1) {
          if (checkGoods(this.pro) == goodsMode.pack) {
            return (this.pro.item_price * this.pro.pack_num).toFixed(2);
          }
          return this.pro.item_price;
        } else if (this.pro.is_mjb == 2) {
          if (checkGoods(this.pro) == goodsMode.pack) {
            return (this.pro.mjb_value * this.pro.pack_num).toFixed(2);
          }
          return this.pro.mjb_value;
        }
        return '0.00';
      },
      isGray() {
        return this.pro.storage < 1 || this.pro.is_prepare == 1;
      },
      ...mapState(['count'])
    },
    created() {
      this.initData();
      this.initFeedPic();
      this.$http.post(api.wx, qs.stringify({
        url: api.wxUrl
      })).then((res) => {
        res = res.data;
        this.$wechat.config({
          debug: false,
          appId: res.appId,
          timestamp: res.timestamp,
          nonceStr: res.nonceStr,
          signature: res.signature,
          jsApiList: ['getNetworkType', 'getLocation']
        });
      });
    },
    methods: {
      checkRecharge() {
        if (local.get('_online') == null || local.get('_online') == 'false') {
          this.$router.push({name: 'login'});
          return;
        }
        let _this = this;
        if (local.get('_isCh') != 1) {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.push({name: 'bindChannel', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        } else {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.push({name: 'recharge', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        }
      },
      toggleCollection() {
        if (local.get('_online') == null || local.get('_online') == 'false') {
          this.$router.push({name: 'login'});
          return;
        }
        if (this.collection < 1) {
          this.$http.post(api.addCollect, qs.stringify({
            item_id: this.pro.item_id
          })).then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              this.collection = 1;
            }
          });
        } else {
          this.$http.post(api.deleteCollect, qs.stringify({
            item_id: this.pro.item_id
          })).then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              this.collection = 0;
            }
          });
        }
      },
      toBuy() {
        // 套装
        if (this.pro.is_bundling == 1) {
          return;
        }
        let arr = [];
        let arr2 = [];
        // 将要支付的商品存入本地
        // 为商品添加每加钻开关
        if (checkGoods(this.pro) == goodsMode.nomal) {
          setLocal('_num', 1);
          setLocal('_total', this.pro.item_price);
          arr.push(this.pro.item_id + '|' + 1);
          if (this.pro.is_mjb > 0) {
            arr2.push(this.pro.item_id + '|' + 1 + '|' + 1);
          } else {
            arr2.push(this.pro.item_id + '|' + 1 + '|' + 0);
          }
          this.pro.num = 1;
        }
        if (checkGoods(this.pro) == goodsMode.pack) {
          setLocal('_num', this.pro.pack_num);
          setLocal('_total', (this.pro.item_price * this.pro.pack_num).toFixed(2));
          arr.push(this.pro.item_id + '|' + this.pro.pack_num);
          if (this.pro.is_mjb > 0) {
            arr2.push(this.pro.item_id + '|' + this.pro.pack_num + '|' + 1);
          } else {
            arr2.push(this.pro.item_id + '|' + this.pro.pack_num + '|' + 0);
          }
          this.pro.num = this.pro.pack_num;
        }
        this.pro._aa = true;
        if (this.pro.is_mjb > 0) {
          // 为每一个对象添加美家钻开关
          this.$set(this.pro, '_switch', true);
        }
        setLocal('_list', [this.pro]);
        setLocal('_goodsNum', arr.join(','));
        setLocal('_goodsNumMJB', arr2.join(','));
        this.$router.push({name: 'confirm'});
      },
      toPlay() {
        let _this = this;
        // 检查网络状态
        this.$wechat.getNetworkType({
          success(res) {
            // 返回网络类型2g，3g，4g，wifi
            let networkType = res.networkType;
            if (networkType != 'wifi') {
              if (confirm(`您确定在${networkType}环境下继续播放吗?`)) {
                _this.videoFlag = !_this.videoFlag;
                _this.$refs.video.play();
                document.addEventListener('WeixinJSBridgeReady', () => {
                  _this.$refs.video.play();
                }, false);
              }
            } else {
              _this.videoFlag = !_this.videoFlag;
              _this.$refs.video.play();
              document.addEventListener('WeixinJSBridgeReady', () => {
                _this.$refs.video.play();
              }, false);
            }
          }
        });
      },
      goTop() {
        this.scroll.scrollTo(0, 0, 100);
      },
      goDesc() {
        this.scroll.scrollToElement(this.$refs.desc_hook, 100);
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true,
              probeType: 3
            });
            this.scroll.on('scroll', (pos) => {
              // 监听置顶
              if (pos.y < -100) {
                this.btn_seen = true;
              } else {
                this.btn_seen = false;
              }
              // 监听是否滚动详情区域
              if (pos.y <= -(getPos(this.$refs.desc_hook).top - 40)) {
                this.active = false;
              } else {
                this.active = true;
              }
            });
          } else {
            this.scroll.refresh();
          }
          let imgs = document.querySelectorAll('img');

          for (let i = 0; i < imgs.length; i++) {
            imgs[i].onload = () => {
              this.scroll.refresh();
            };
            imgs[i].onerror = () => {
              this.scroll.refresh();
            };
          }
        });
      },
      initData() {
        // 商品id
        this.itemid = this.$route.query.itemid;
        this.$http.get(api.detailsData + this.itemid).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            res = res.data;
            this.pro = res.item;
            // is_shelves 是否下架：1:正常 0:下架
            if (this.pro.is_shelves == 0) {
              this.warning = !this.warning;
              this.tips = '商品已下架';
            }
            this.cont = res.item.content;
            this.collection = res.item.collection;
            // 历史记录
            let _history = getLocal('_history') || [];
            if (_history.length) {
              let _index = _history.findIndex(item => item.item_id == this.itemid);
              if (_index > -1) {
                _history.splice(_index, 1);
              }
            }
            _history.unshift(this.pro);
            // 保留最新的20条记录
            _history.length = Math.min(_history.length, 20);
            setLocal('_history', _history);
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        });
        // 评价
        this.$http.post(api.commentList, qs.stringify({
          item_id: this.itemid,
          count: 3
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.comments = res.data;
          }
        });
      },
      initFeedPic() {
        this.$http.post(api.showCommentImage, qs.stringify({
          item_id: this.$route.query.itemid
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.feedPic = res.data.pic.length;
          }
        });
      },
      ...mapActions(['add'])
    },
    watch: {
      pro: {
        handler() {
          this.initScroll();
        },
        deep: true
      },
      comments: {
        handler() {
          this.initScroll();
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .goods-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgec;
    .mar-bg {
      margin-top: 5px;
      border-radius: $br6;
      overflow: hidden;
      background: $bgff;
    }
    .com-row {
      display: flex;
      align-items: center;
      height: 40px;
      padding: 0 10px;
      @extend .mar-bg;
      .title {
        margin-right: 10px;
        font-size: 13px;
        color: $fs53;
      }
      .txt {
        font-size: 13px;
        color: $fs95;
      }
      .danger {
        color: $fse5;
      }
    }
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
    .main {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 45px;
      overflow: hidden;
      .scroll-wrap {
        padding: 5px;
        .pro-img {
          width: 100%;
          border-radius: $br6;
          overflow: hidden;
          .img-item {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 49.3%;
            overflow: hidden;
            .video {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
              object-fit: fill;
            }
            .video-mark {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              @include bg(60px 60px);
              background-image: url(i_play.png);
            }
            .img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
            }
            .img-mark {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              background: rgba(255, 255, 255, .7);
              .tip-txt {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
                width: 40px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                font-size: 10px;
                color: $fsff;
                border-radius: 50%;
                background: $bge5;
              }
            }
          }
          .img-txt {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            padding: 0 10px;
            background: $bgff;
            .title {
              display: -webkit-box;
              flex: 1;
              max-height: 30px;
              line-height: 15px;
              padding-right: 5px;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
              font-size: 13px;
              color: $fs43;
              overflow: hidden;
            }
            .price {
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: flex-end;
              flex: 0 0 100px;
              width: 100px;
              .convert {
                line-height: 20px;
                padding: 0 10px;
                border-radius: 20px;
                font-size: 13px;
                color: $fsff;
                background: $bge5;
              }
              .num {
                font-size: 12px;
                color: $fse5;
                .num2 {
                  font-size: 15px;
                  font-weight: normal;
                }
              }
              .border {
                margin-top: 2px;
                padding: 0 6px;
                font-size: 12px;
                color: #e5004f;
              }
            }
          }
        }
        .pro-only, .pro-sale {
          font-size: 13px;
        }
        .pro-spec {
          display: flex;
          justify-content: space-between;
          flex-flow: row wrap;
          line-height: 20px;
          padding: 10px;
          font-size: 13px;
          color: $fs43;
          .item {
            flex: 0 0 50%;
            width: 50%;
            @extend .dot;
          }
          .name {
            color: $fs95;
          }
        }
        .pro-dist {
          justify-content: space-between;
          .left {
            font-size: 13px;
            color: $fse5;
          }
          .alert {
            display: inline-block;
            width: 30px;
            height: 30px;
            margin-right: -5px;
            @include bg(23px 23px);
            background-image: url(i_ask.png);
          }
        }
        .pro-prom {
          .btn {
            width: 70px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            margin-right: 10px;
            font-size: 10px;
            color: $fse5;
            border-radius: 20px;
            border: 1px solid $bde5;
            box-sizing: border-box;
          }
          .go-box {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            height: 100%;
            flex: 1;
            .btn-go {
              width: 30px;
              height: 30px;
              margin-right: -5px;
              @include bg(23px 23px);
              background-image: url(i_right_arrow.png);
            }
          }
        }
        .pro-feed {
          @extend .mar-bg;
          border-radius: $br6;
          overflow: hidden;
          .feed-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            padding: 0 10px;
            font-size: 13px;
            color: $fse5;
            .left {
              .title {
                color: $fs53;
              }
            }
            .right {
              display: inline-flex;
              justify-content: flex-end;
              align-items: center;
              height: 100%;
              .good-feed {
                display: inline-block;
                height: 30px;
                line-height: 30px;
              }
              .btn-go {
                display: inline-block;
                width: 30px;
                height: 30px;
                margin-right: -5px;
                @include bg(23px 23px);
                background-image: url(i_right_arrow.png);
              }
            }
          }
          .feed-cont {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            border-top: 1px solid $bdec;
            .left {
              flex: 1;
              padding-right: 5px;
              font-size: 10px;
              color: $fs95;
              .nick {
                line-height: 12px;
                @extend .dot;
              }
              .star-outer {
                margin-left: -3px;
                padding: 3px 0;
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
              .txt {
                line-height: 12px;
                text-align: justify;
              }
            }
            .right {
              flex: 0 0 215px;
              width: 215px;
              font-size: 0;
              .img-item {
                display: inline-block;
                width: 65px;
                height: 65px;
                margin-right: 10px;
                &:last-child {
                  margin-right: 0;
                }
                .img {
                  width: 100%;
                  heith: 100%;
                  border-radius: $br6;
                  overflow: hidden;
                }
              }
            }
          }
          .feed-foot {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 40px;
            border-top: 1px solid $bdec;
            .color {
              font-size: 13px;
              color: $fs95;
            }
          }
        }
      }
    }
    .pro-show {
      border-radius: $br6;
      @extend .mar-bg;
      .title {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 16px;
        border-bottom: 1px solid $bdec;
      }
      .img-show {
        width: 100%;
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
    .foot-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 45px;
      background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      .item {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        font-size: 13px;
        color: $fsff;
      }
      .total {
        font-size: 12px;
        color: $fse5;
      }
      .collect {
        @include bg(23px 23px);
        background-image: url(i_collect.png);
        &.on {
          background-image: url(i_collected.png);
        }
      }
      .cart {
        border-left: 1px solid $bdec;
        border-right: 1px solid $bdec;
        .cart-inner {
          position: relative;
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
          background-image: url(cart_d.png);
          .num {
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
        background: $bgfc;
      }
      .order {
        background: $bge5;
      }
      .gray {
        margin-left: 1px;
        background: $bg95;
      }
    }
  }
</style>
