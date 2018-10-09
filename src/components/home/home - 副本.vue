<template>
  <div class="home-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos"></a>
      <a class="search pos"></a>
      <a class="msg pos"></a>
    </header>
    <!-- 内容区域 -->
    <div class="main" ref="scroll_hook">
      <div>
        <!-- 轮播图 -->
        <div class="swiper-outter">
          <div class="swiper-inner">
            <div class="swiper-container" ref="swiper_hook">
              <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in title">
                  <template v-if="item.item_id == 1">
                    <a href="http://v2.mjmw365.com/Home/Slide/index.html">
                      <img class="img" :src="url + item.pic" onerror="this.src='http://placeholder.qiniudn.com/800'"
                           alt="">
                    </a>
                  </template>
                  <template v-else>
                    <router-link :to="{ name: 'goods', query: { itemid: item.item_id } }" v-if="item.is_part == 0">
                      <img class="img" :src="url + item.pic" onerror="this.src='http://placeholder.qiniudn.com/800'"
                           alt="">
                    </router-link>
                    <router-link :to="{ name: 'group', query: { itemid: item.item_id } }" v-else>
                      <img class="img" :src="url + item.pic" onerror="this.src='http://placeholder.qiniudn.com/800'"
                           alt="">
                    </router-link>
                  </template>
                </div>
              </div>
              <!-- 轮播指示灯 -->
              <div class="swiper-pagination"></div>
            </div>
          </div>
        </div>
        <!-- 分类菜单 -->
        <ul class="nav-wrap" ref="kinks_hook">
          <li class="item" :class="{ active: kindsNum == index }" v-for="(item, index) in kinds"
              @click.stop.prevent="changeKinds(index, $event)">
            <i class="icon" :class="[icon[index]]"></i>
            <p class="txt">{{ item.catname }}</p>
          </li>
        </ul>
        <!-- 今日特供 -->
        <div class="today-wrap" ref="today_hook">
          <template v-if="today.is_part == 0">
            <router-link :to="{ name: 'goods', query: { itemid: today.item_id } }" class="item tip" tag="div">
              <div class="img-wrap">
                <div class="img-outer">
                  <img class="img" :src="url + today.item_img_thumb"
                       onerror="this.src='http://placeholder.qiniudn.com/300'" alt="">
                  <span class="tips-txt" v-show="today.storage == 0">已抢光</span>
                </div>
              </div>
              <div class="txt-wrap">
                <p class="title">{{ today.item_name }}</p>
                <p class="desc">{{ today.item_subtitle }}</p>
                <div class="price"><s class="color">￥{{ today.item_price }}</s>
                  <span class="border" v-if="today.is_mjb == 1">可用<i class="ic_mj"></i>{{
                    today.item_price }}</span>
                  <span class="border" v-else-if="today.is_mjb == 2">可用<i class="ic_mj"></i>{{
                    today.mjb_value }}</span>
                </div>
              </div>
            </router-link>
            <i class="cart-btn" @click.stop="_add(today, $event)"></i>
          </template>
          <!-- 这个元素用于横向菜单定位 -->
          <s class="sw_dw" ref="ul_hook"></s>
        </div>
        <div class="content-wrap">
          <!-- 专区 ||  mjb为1代表全部使用美家钻 -->
          <div class="tab-toggle">
            <span class="item" :class="{ active: mjb == 1 }" @click="toggleArea(1)">
              <s class="txt">美家钻 <i class="ic_mj"></i> 专区</s>
            </span>
            <span class="item" :class="{ active: mjb == 2 }" @click="toggleArea(2)">
              <s class="txt">美家钻 + 现金 专区</s>
            </span>
          </div>
          <!-- 商品展示 -->
          <ul class="list-wrap" :class="slideDir[0]" ref="swipe_hook" v-finger:swipe="swipe">
            <li class="nothing-item" v-if="!star.length">
              <p class="tip">暂无商品</p>
            </li>
            <li class="list-item" v-for="item in star">
              <template v-if="item.is_part == 0">
                <router-link :to="{ name: 'goods', query: { itemid: item.item_id } }" tag="div">
                  <div class="img-wrap">
                    <div class="img-link">
                      <img class="img" :src="url + item.item_img_thumb"
                           onerror="this.src='http://placeholder.qiniudn.com/300'" :alt="item.item_name">
                      <span class="tips-txt" v-if="item.storage == 0">已抢光</span>
                      <span class="tips-txt" v-else-if="item.is_prepare == 1">备货中</span>
                    </div>
                    <i class="cart-btn" v-show="item.storage != 0 && item.is_prepare != 1 && item.item_id != 1"
                       @click.stop="_add(item, $event)"></i>
                  </div>
                  <div class="info-wrap">
                    <div class="title">
                      <h2 class="name">{{ item.item_name }}</h2>
                    </div>
                    <div class="price" v-if="item.item_id == 1">
                      <s class="color">冰箱兑换券</s>
                    </div>
                    <div class="price" v-else>
                      <s class="color" v-if="item.is_mjb == 2">￥{{ (item.item_price - item.mjb_value).toFixed(2)
                        }} + </s>
                      <s class="mjz">
                        <i class="ic_mj"></i>{{ item.mjb_value }}
                      </s>
                    </div>
                  </div>
                </router-link>
              </template>
              <template v-else>
                <router-link :to="{ name: 'goods', query: { itemid: item.item_id } }" tag="div">
                  <div class="img-wrap">
                    <div class="img-link">
                      <img class="img" :src="url + item.item_img_thumb"
                           onerror="this.src='http://placeholder.qiniudn.com/300'" :alt="item.item_name">
                      <span class="tips-txt" v-if="item.storage == 0">已抢光</span>
                      <span class="tips-txt" v-else-if="item.is_prepare == 1">备货中</span>
                    </div>
                    <i class="cart-btn" v-show="item.storage != 0 && item.is_prepare != 1 && item.item_id != 1"
                       @click.stop="_add(item, $event)"></i>
                  </div>
                  <div class="info-wrap">
                    <div class="title">
                      <h2 class="name">{{ item.item_name }}</h2>
                    </div>
                    <div class="price" v-if="item.item_id == 1">
                      <s class="color">冰箱兑换券</s>
                    </div>
                    <div class="price" v-else>
                      <s class="color" v-if="item.is_mjb == 2">￥{{ (item.item_price - item.mjb_value).toFixed(2)
                        }} + </s>
                      <s class="mjz">
                        <i class="ic_mj"></i>{{ item.mjb_value }}
                      </s>
                    </div>
                  </div>
                </router-link>
              </template>
            </li>
          </ul>
          <!-- 加载提示文字 -->
          <p class="load-tip" v-if="doneFlag"><i></i><span>我是有底线的</span><i></i></p>
          <p class="load-tip" v-else><i></i><span>上拉加载更多</span><i></i></p>
        </div>
      </div>
      <!-- 横向菜单 -->
      <transition name="fade">
        <div class="hor-nav" v-show="horFlag">
          <div class="item-wrap">
            <span class="item" :class="{ active: kindsNum == index }" v-for="(item, index) in kinds"
                  @click="changeKinds(index, $event)">
              <span class="icon" :class="[icon[index]]"></span>
              <span class="txt">{{ item.catname }}</span>
            </span>
          </div>
        </div>
      </transition>
      <!-- 固定专区 ||  mjb为1代表全部使用美家钻 -->
      <div class="fixed-tab" v-show="fixedFlag" ref="fixed_hook">
        <div class="tab-toggle">
          <span class="item" :class="{ active: mjb == 1 }" @click="toggleArea(1)">
            <s class="txt">美家钻 <i class="ic_mj"></i> 专区</s>
          </span>
          <span class="item" :class="{ active: mjb == 2 }" @click="toggleArea(2)">
            <s class="txt">美家钻 + 现金 专区</s>
          </span>
        </div>
      </div>
    </div>
    <!-- 置顶按钮 -->
    <a class="go-top" @click="goTop" v-show="horFlag"></a>
    <vloading></vloading>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import Swiper from 'swiper';
  import {getPos} from '../../common/js/util.js';
  import api from '../../api';
  import local from 'vue-cookie';
  import {mapActions} from 'vuex';
  import qs from 'qs';

  let curArr = [];

  // 最小上拉高度
  const MIN_PULL = 30;

  export default {
    data() {
      return {
        url: api.url,
        page: 1, // 当前分页
        totalPage: 2, // 假设总分页
        title: [], // 轮播商品
        star: [], // 专区商品
        today: [], // 今日推荐
        kinds: [], // 八大分类
        kindsNum: -1, // 当前分类代号(全部分类为-1)
        horFlag: false, // 横向菜单开关
        ajaxFlag: true, // ajax开关
        doneFlag: false, // 上拉加载提示文字开关
        fixedFlag: false, // 专区固定开关
        icon: ['ic_gz', 'ic_hg', 'ic_jb', 'ic_tp', 'ic_bb', 'ic_ly', 'ic_zs', 'ic_pz'], // 八大分类对应图标
        slideDir: [], // 滑动方向
        mjb: 1 // 全部美家钻商品
      };
    },
    methods: {
      // 添加购物车
      ...mapActions(['add', 'setAni']),
      _add(obj, ev) {
        this.add(obj);
        this.setAni(ev);
      },
      // 置顶
      goTop() {
        this.scroll.scrollTo(0, 0, 100);
      },
      // 专区切换
      toggleArea(num) {
        curArr = [];
        this.page = 1;
        this.mjb = num;
        this.scroll.scrollToElement(this.$refs.ul_hook, 10);
        if (this.kindsNum === -1) {
          this.indexAjax();
        } else {
          this.changeKinds(this.kindsNum);
        }
      },
      // 左右滑动
      swipe(ev) {
        if (ev.direction === 'Left') {
          // 是否滑动到分类最后一项
          if (++this.kindsNum > this.icon.length - 1) {
            this.kindsNum = this.icon.length - 1;
            return;
          }
          // 设置滑动方向
          this.slideDir = ['left'];
          this.changeKinds(this.kindsNum);
        } else if (ev.direction === 'Right') {
          // 是否滑动到全部分类
          if (--this.kindsNum < -1) {
            this.kindsNum = -1;
            return;
          }
          // 设置滑动方向
          this.slideDir = ['right'];
          if (this.kindsNum === -1) {
            this.page = 1;
            curArr = [];
            this.indexAjax();
            // 让全部分类也回到指定位置
            this.scroll.scrollToElement(this.$refs.ul_hook, 10);
          } else {
            this.changeKinds(this.kindsNum);
          }
        }
      },
      // 点击分类
      changeKinds(index, ev) {
        this.doneFlag = false;
        this.totalPage = 2;
        this.kindsNum = index;
        this.page = 1;
        curArr = [];

        // 判断是否是滑动切换
        if (!ev) {
          this.scroll.scrollToElement(this.$refs.ul_hook, 10);
        } else {
          // 判断点击是否是横向菜单
          if (ev.target.nodeName === 'SPAN') {
            this.scroll.scrollToElement(this.$refs.ul_hook, 100);
          } else {
            this.scroll.scrollToElement(this.$refs.kinks_hook, 100);
          }
        }
        this.kindsAjax();
      },
      // 首页ajax
      indexAjax() {
        if (!this.ajaxFlag) {
          return;
        }
        this.ajaxFlag = false;
        this.doneFlag = false;
        this.$http.post(api.homeData, qs.stringify({
          page: this.page,
          count: 20,
          is_mjb: this.mjb
        })).then((res) => {
          res = res.data;
          if (res.err_code === 200) {
            res = res.data;
            // 更新轮播商品
            if (this.page === 1) {
              this.title = res.title;
            }
            curArr = curArr.concat(res.star);
            this.star = curArr;
            this.today = res.today[0];
            this.ajaxFlag = true;
            this.slideDir = [];
          }
        });
      },
      // 分类ajax
      kindsAjax() {
        if (!this.ajaxFlag) {
          return;
        }
        this.ajaxFlag = false;
        this.$http.post(api.searchResultData, qs.stringify({
          catid: this.kinds[this.kindsNum].catid,
          page: this.page,
          count: 20,
          is_mjb: this.mjb
        })).then((res) => {
          res = res.data;
          if (res.err_code === 200) {
            res = res.data;
            curArr = curArr.concat(res.item);
            this.star = curArr;
            this.totalPage = res.total_page;
            this.ajaxFlag = true;
            this.slideDir = [];
            // 判断此分类数据是否加完了
            if (this.page >= this.totalPage) {
              this.doneFlag = true;
            }
          }
        });
      },
      // 初始化滚动
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            // 主体滚动初始化
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              probeType: 3,
              click: true
            });
            // 记录最大高度
            this.maxHeight = this.scroll.maxScrollY;
            this.scroll.on('scroll', (pos) => {
              // 判断是否显示横向菜单
              if (pos.y < -(getPos(this.$refs.today_hook).top - 40)) {
                this.horFlag = true;
              } else {
                this.horFlag = false;
              }
              // 判断是否显示固定专区
              if (pos.y < -(getPos(this.$refs.ul_hook).top - 40)) {
                this.fixedFlag = true;
              } else {
                this.fixedFlag = false;
              }
            });
            // 上拉加载
            this.scroll.on('touchend', (pos) => {
              if (pos.y < this.maxHeight - MIN_PULL) {
                this.page++;
                // 判断是否为全部分类
                if (this.kindsNum === -1) {
                  this.indexAjax();
                } else {
                  if (this.page > this.totalPage) {
                    return;
                  }
                  this.kindsAjax();
                }
              }
            });
          } else {
            this.scroll.refresh();
            // 记录最大高度
            this.maxHeight = this.scroll.maxScrollY;
          }
        });
      },
      // 获取分类项
      fetchKinds() {
        this.$http.post(api.catData).then((res) => {
          res = res.data;
          if (res.err_code === 200) {
            res = res.data;
            this.kinds = res.top;
          }
        });
      },
      // 获取UUID
      fetchUUID() {
        let guid = local.get('guid');
        if (!guid) {
          this.$http.post(api.getUUID).then((res) => {
            res = res.data;
            if (res.err_code === 200) {
              res = res.data;
              local.set('guid', res.guid, 365);
            }
          });
        }
      }
    },
    mounted() {
      // 首页数据
      this.indexAjax();
      // 分类菜单数据
      this.fetchKinds();
      // 获取UUID
      this.fetchUUID();
    },
    watch: {
      star: {
        handler(val, oldVal) {
          this.initScroll();
        },
        deep: true
      },
      title: {
        handler(val, oldVal) {
          this.$nextTick(() => {
            if (!this.swiper) {
              this.swiper = new Swiper('.swiper-container', {
                loop: true,
                autoplay: 3000,
                pagination: '.swiper-pagination',
                paginationClickable: true,
                autoplayDisableOnInteraction: false
              });
            }
          });
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .home-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
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
      background-image: url(txt_logo.png);
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
        background-image: url(i_scan.png);
      }
      .search {
        right: 50px;
        background-image: url(i_search.png);
      }
      .msg {
        right: 11px;
        background-image: url(i_msg.png);
      }
    }
    .main {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .swiper-outter {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 49%;
        overflow: hidden;
      }
      .swiper-inner {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
      .swiper-container {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .nav-wrap {
        display: flex;
        justify-content: space-between;
        flex-flow: row wrap;
        height: 150px;
        background: $bgff;
        .item {
          display: flex;
          justify-content: center;
          flex-flow: column;
          width: 25%;
          height: 75px;
          text-align: center;
          font-size: 10px;
          color: $fs95;
          &.active {
            .ic_gz {
              background-image: url(ic_gz_a.png);
            }
            .ic_hg {
              background-image: url(ic_hg_a.png);
            }
            .ic_jb {
              background-image: url(ic_jb_a.png);
            }
            .ic_tp {
              background-image: url(ic_tp_a.png);
            }
            .ic_bb {
              background-image: url(ic_bb_a.png);
            }
            .ic_ly {
              background-image: url(ic_ly_a.png);
            }
            .ic_zs {
              background-image: url(ic_zs_a.png);
            }
            .ic_pz {
              background-image: url(ic_pz_a.png);
            }
          }
        }
        .icon {
          width: 50px;
          height: 50px;
          margin: 0 auto;
          @include bg;
          &:before {
            display: none;
          }
        }
        .ic_gz {
          background-image: url(ic_gz_d.png);
        }
        .ic_hg {
          background-image: url(ic_hg_d.png);
        }
        .ic_jb {
          background-image: url(ic_jb_d.png);
        }
        .ic_tp {
          background-image: url(ic_tp_d.png);
        }
        .ic_bb {
          background-image: url(ic_bb_d.png);
        }
        .ic_ly {
          background-image: url(ic_ly_d.png);
        }
        .ic_zs {
          background-image: url(ic_zs_d.png);
        }
        .ic_pz {
          background-image: url(ic_pz_d.png);
        }
        .txt {
          padding-top: 8px;
        }
      }
      .today-wrap {
        position: relative;
        width: 100%;
        margin-top: 1px;
        background: $bgff;
        .item {
          position: relative;
          display: flex;
          height: 120px;
          &.tip:before {
            content: "";
            position: absolute;
            left: 10px;
            z-index: 1;
            width: 30px;
            height: 40px;
            @include bg;
            background-image: url(tips_state1.png);
          }
        }
        .img-wrap {
          display: flex;
          align-items: center;
          width: 50%;
          height: 100%;
          .img-outer {
            position: relative;
            width: 110px;
            height: 110px;
            margin-left: 35px;
            .img {
              width: 100%;
              height: 100%;
            }
            .tips-txt {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              width: 70px;
              height: 70px;
              line-height: 70px;
              text-align: center;
              margin: auto;
              font-size: 12px;
              color: $bgff;
              border-radius: 50%;
              background: rgba(229, 0, 79, .8);
            }
          }
        }
        .txt-wrap {
          display: flex;
          justify-content: center;
          flex-direction: column;
          width: 50%;
          height: 100%;
          .title {
            display: -webkit-box;
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
          .desc {
            display: -webkit-box;
            height: 14px;
            line-height: 14px;
            font-size: 10px;
            color: $fs95;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            word-break: break-all;
            overflow: hidden;
          }
          .price {
            padding-top: 5px;
            font-size: 0;
            .color {
              font-size: 15px;
              color: $fse5;
            }
          }
        }
        .cart-btn {
          position: absolute;
          right: 3px;
          bottom: 3px;
          width: 24px;
          height: 24px;
          @include bg(22px 22px);
          border-top-left-radius: 5px;
          background-color: $bgff;
          background-image: url(i_cart.png);
        }
        .sw_dw {
          position: absolute;
          bottom: 60px;
        }
      }
      .content-wrap {
        padding-top: 5px;
        overflow: hidden;
        .tab-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 0 5px 8px;
          border-bottom: 3px solid $bde5;
          .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: calc((100% - 5px) / 2);
            height: 35px;
            font-size: 13px;
            color: $fs95;
            &.active {
              color: $fsff;
              border-top-left-radius: $br6;
              border-top-right-radius: $br6;
              background: $bge5;
            }
          }
        }
        .list-wrap {
          position: relative;
          display: flex;
          justify-content: space-between;
          flex-flow: row wrap;
          padding: 0 5px;
          width: 100%;
          box-sizing: border-box;
          &.left {
            transition: transform .3s;
            transform: translateX(-100%);
          }
          &.right {
            transition: transform .3s;
            transform: translateX(100%);
          }
          &:before {
            content: "";
            position: absolute;
            left: -100%;
            top: 0;
            width: 100%;
            height: 100%;
          }
          &:after {
            content: "";
            position: absolute;
            right: -100%;
            top: 0;
            width: 100%;
            height: 100%;
          }
          .nothing-item {
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 120%;
            .tip {
              position: absolute;
              left: 0;
              top: 30px;
              width: 100%;
              text-align: center;
              font-size: 16px;
              color: $fs43;
            }
          }
          .list-item {
            width: calc((100% - 5px) / 2);
            padding: 5px;
            margin-bottom: 5px;
            border-radius: $br6;
            background: $bgff;
            box-sizing: border-box;
            .img-wrap {
              position: relative;
              width: 100%;
              height: 0;
              padding-top: 100%;
              .img-link, .img {
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
                width: 70px;
                height: 70px;
                line-height: 70px;
                text-align: center;
                margin: auto;
                font-size: 12px;
                color: $bgff;
                border-radius: 50%;
                background: rgba(229, 0, 79, .8);
              }
              .cart-btn {
                position: absolute;
                right: 0;
                bottom: 0;
                width: 24px;
                height: 24px;
                @include bg(22px 22px);
                border-top-left-radius: 5px;
                background-color: $bgff;
                background-image: url(i_cart.png);
              }
            }
            .info-wrap {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding-top: 5px;
              .title {
                display: flex;
                align-items: center;
                height: 30px;
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
                font-size: 0;
                .color {
                  font-size: 14px;
                  color: $fsb2;
                }
                .mjz {
                  font-size: 14px;
                  color: $fse5;
                  .ic_mj {
                    margin-right: 5px;
                  }
                }
              }
            }
          }
        }
      }
      .hor-nav {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        padding: 5px;
        background: $bgec;
        .item-wrap {
          display: flex;
          justify-content: space-between;
          align-content: space-around;
          flex-flow: row wrap;
          height: 55px;
          padding: 0 10px;
          border-radius: $br6;
          background: $bgff;
        }
        .item {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 0 0 25%;
          width: 25%;
          height: 20px;
          text-align: center;
          font-size: 12px;
          color: $fs95;
          border-radius: 20px;
          overflow: hidden;
          &.active {
            color: $fsff;
            background: $bge5;
          }
          .icon {
            width: 18px;
            height: 18px;
            margin-right: 3px;
            font-size: 18px;
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
      .fixed-tab {
        position: absolute;
        left: 0;
        top: 65px;
        right: 0;
        background: $bgec;
        padding: 0 5px;
        .tab-toggle {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid $bde5;
          .item {
            display: flex;
            justify-content: center;
            align-items: center;
            width: calc((100% - 5px) / 2);
            height: 35px;
            font-size: 13px;
            color: $fs95;
            &.active {
              color: $fsff;
              border-top-left-radius: $br6;
              border-top-right-radius: $br6;
              background: $bge5;
            }
          }
        }
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
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
