<template>
  <div class="search-wrap">
    <header class="head-wrap">
      <router-link class="back pos" :to="{name: 'home', params: { back: true }}"></router-link>
      <div class="se_box">
        <input type="text" class="se_ch" placeholder="  输入商品名称" name="keyword" v-model="words">
        <i class="se_img" @click="result"></i>
        <b class="se_font" @click="result">搜索</b>
      </div>
      <a class="change" @click="change_img" :class="{'change_2': show }"></a>
    </header>
    <div class="con-wrap" ref="scroll_hook">
      <div>
        <!--热搜商品-->
        <div class="hot_product">
          <h3 class="ht_title">热搜商品</h3>
          <div class="ay_t_box">
            <a class="h_alcohol" v-if="index < 4" v-for="(item, index) in kinds">
              <span class="ht_temp" :class="{'active': active == index}"
                    @click="change_color(item, index, $event)">{{item}}</span>
            </a>
          </div>
        </div>
        <!--热门推荐-->
        <div class="hot_recommend">
          <h3 class="ht_re_title">热门推荐</h3>
          <ul :class="{'co_colum': colum,'co_row': row}">
            <li class="item" v-if="index < 4" v-for="(item, index) in star">
              <div class="item-box">
                <router-link class="img-box"
                             :to="item.part_of_id > 0 ? { name: 'suit', query: { itemid: item.part_of_id } } : { name: 'goods', query: { itemid: item.item_id } }"
                             tag="div">
                  <img class="img" :src="item.thumb_url"
                       onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" :alt="item.item_name"/>
                  <span class="tips-txt" v-if="item.storage == 0">已抢光</span>
                </router-link>
                <div class="img_right">
                  <div class="title">
                    <h2 class="name">{{item.item_name}}</h2>
                  </div>
                  <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                  <h3 class="price" v-else><span class="small">￥</span>{{item.item_price}}</h3>
                  <h4 class="mj_price" v-if="item.is_mjb == 0 || item.item_id == 1"></h4>
                  <h4 class="mj_price" v-else-if="item.is_mjb == 1">
                    <span class="border">可用<i class="ic_mj"></i>{{item.item_price}}</span>
                  </h4>
                  <h4 class="mj_price" v-else-if="item.is_mjb == 2">
                    <span class="border">可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                  </h4>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!--浏览足迹-->
        <div class="browsef" v-show="browsef">
          <h3 class="br_title">浏览足迹</h3>
          <ul :class="{'co_colum': colum,'co_row': row}">
            <li class="item" v-for="(item, index) in foot">
              <div class="item-box">
                <router-link class="img-box"
                             :to="item.part_of_id > 0 ? { name: 'suit', query: { itemid: item.part_of_id } } : { name: 'goods', query: { itemid: item.item_id } }"
                             tag="div">
                  <img class="img" v-lazy="item.thumb_url"
                       onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" :alt="item.item_name"/>
                  <span class="tips-txt" v-if="item.storage == 0">已抢光</span>
                </router-link>
                <div class="img_right">
                  <div class="title">
                    <h2 class="name">{{item.item_name}}</h2>
                  </div>
                  <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                  <h3 class="price" v-else><span class="small">￥</span>{{item.item_price}}</h3>
                  <h4 class="mj_price" v-if="item.is_mjb == 0 || item.item_id == 1"></h4>
                  <h4 class="mj_price" v-else-if="item.is_mjb == 1">
                    <span class="border">可用<i class="ic_mj"></i>{{item.item_price}}</span>
                  </h4>
                  <h4 class="mj_price" v-else-if="item.is_mjb == 2">
                    <span class="border">可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                  </h4>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <!--清空足迹-->
        <div class="empty_fo" @click="empty" v-show="empty_fo">
          <span class="em_bg"></span>
          清空足迹



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
  import storage from 'good-storage';
  import {setLocal, getLocal} from '../../common/js/util.js';
  export default{
    data() {
      return {
        warning: false,
        tips: '',
        show: false,
        colum: false,
        row: true,
        active: -1,
        kinds: [],
        star: [],
        foot: [],
        browsef: true,
        empty_fo: true,
        keywords: '',
        words: '',
        _history: []
      };
    },
    methods: {
      // 点击搜索
      result() {
        if (this.words.length > 0) {
          this.keywords = this.words;
          this.$router.push({name: 'result'});
          storage.session.set('words', this.keywords);
        } else {
          this.warning = true;
          this.tips = '请输入要搜索的关键字';
        }
      },
      // 清空足迹
      empty() {
        this.foot = [];
        this.browsef = false;
        this.empty_fo = false;
        let _his = [];
        setLocal('_history', _his);
      },
      change_img() {
        if (this.show) {
          this.show = !this.show;
          this.colum = !this.colum;
          this.row = !this.row;
        } else {
          this.show = !this.show;
          this.colum = !this.colum;
          this.row = !this.row;
        }
        this._iscorll();
      },
      // 页面滚动
      _iscorll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            click: true,
            probeType: 3
          });
        } else {
          this.scroll.refresh();
        }
      },
      change_color(obj, num, event) {
        // 防止PC触发两次点击
        if (!event._constructed) {
          return;
        }
        this.active = num;
        this.keywords = obj;
        this.$router.push({name: 'result'});
        storage.session.set('words', this.keywords);
      },
      // 主页ajax
      _searchAjax() {
        this.$http.post(api.searchData).then((res) => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.kinds = res.hot_search;
            this.star = res.hot;
          } else {
            console.log('数据请求失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 获取历史记录信息
      history() {
        this._history = getLocal('_history');
        if (this._history.length) {
          if (this._history.length >= 4) {
            this.foot = this._history.slice(0, 4);
          } else {
            this.foot = this._history;
          }
        } else {
          this.foot = [];
          this.browsef = false;
          this.empty_fo = false;
        }
      }
    },
    created() {
      this._searchAjax();
      this.history();
    },
    watch: {
      star: {
        handler(val, oldVal) {
          this.$nextTick(() => {
            this._iscorll();
          });
        },
        deep: true
      },
      foot: {
        handler(val, oldVal) {
          this.$nextTick(() => {
            this._iscorll();
          });
        },
        deep: true
      }
    }
  };
</script>
<style scoped lang="scss">
  @import "../../common/scss/common";

  .search-wrap {
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
        background-image: url("i_left_arrow.png");
      }
      .txt {
        text-align: center;
        padding: 0 40px;
        color: $fse5;
        @extend .dot;
      }
    }
    .change {
      @include bg(23px 23px);
      background-image: url("i_bomb.png");
      position: absolute;
      top: 50%;
      right: 13px;
      width: 30px;
      height: 30px;
      margin-top: -15px;
    }
    .change_2 {
      @include bg(23px 23px);
      background-image: url("i_sort.png");
    }
    .se_box {
      position: relative;
      top: 4px;
      height: 30px;
      border: 1px solid #e5e5e5;
      border-radius: $br15;
      display: flex;
      align-items: center;
      font-size: 13px;
      margin: 0 54px 0 50px;
      overflow: hidden;
      .se_img {
        position: absolute;
        top: 0px;
        left: 4px;
        width: 30px;
        height: 30px;
        @include bg(23px 23px);
        background-image: url(i_search.png);
      }
      .se_font {
        position: absolute;
        right: 7px;
        top: 0;
        color: $fse5;
        width: 30px;
        height: 30px;
        line-height: 31px;
        font-size: 12px;
        font-size: 12px;
      }
      .se_ch {
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 45px 0 40px;
        box-sizing: border-box;
        color: $fs95;
      }
    }
    .con-wrap {
      position: absolute;
      left: 0;
      top: 46px;
      right: 0;
      bottom: 0px;
      overflow: hidden;
    }
    .hot_product {
      margin: 0 5px;
      background-color: $bgff;
      border-radius: $br6;
      .ht_title {
        padding-left: 37px;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: $fs1b;
        position: relative;
        border-bottom: 1px solid $bdec;
        &:before {
          width: 30px;
          height: 30px;
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          @include bg(23px 23px);
          background-image: url(i_trophy.png);
        }
      }
      .ay_t_box {
        display: flex;
        height: 40px;
        .h_alcohol {
          display: flex;
          flex-grow: 1;
          width: 20%;
          height: 40px;
          text-align: center;
          justify-content: center;
          align-items: center;
          .ht_temp {
            height: 20px;
            line-height: 21px;
            margin-top: -1px;
            width: 70%;
            text-align: center;
            font-size: 13px;
            color: $fs95;
            display: block;
            background: $bgff;
            border-radius: $br15;
          }
          .active {
            background: $bge5;
            color: $fsff;
          }
        }
      }
    }
    .hot_recommend {
      margin: 5px;
      border-radius: $br6;
      overflow: hidden;
      .ht_re_title {
        background-color: $bgff;
        padding-left: 37px;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: $fs1b;
        position: relative;
        border-bottom: 1px solid $bdec;
        &:before {
          width: 30px;
          height: 30px;
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          @include bg(23px 23px);
          background-image: url(i_medal.png);
        }
      }
    }
    .co_row {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
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
          .title {
            line-height: 15px;
            padding-top: 3px;
            color: $fs43;
            .name {
              font-size: 13px;
              @extend .dot;
            }
          }
          .price {
            margin: 5px 0 3px;
            line-height: 16px;
            font-size: 15px;
            color: $fse5;
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
      }
    }
    .co_colum {
      width: 100%;
      overflow: hidden;
      .item {
        width: 100%;
        margin-top: 1px;
        box-sizing: border-box;
        .item-box {
          display: flex;
          padding: 5px;
          margin-left: 1px;
          background: $bgff;
          .img-box {
            position: relative;
            width: 80px;
            height: 80px;
            img {
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
      }
    }
    .browsef {
      margin: 0 5px;
      border-radius: $br6;
      overflow: hidden;
      .br_title {
        background: $bgff;
        padding-left: 37px;
        height: 40px;
        line-height: 40px;
        font-size: 13px;
        color: $fs1b;
        position: relative;
        border-bottom: 1px solid $bdec;
        &:before {
          width: 30px;
          height: 30px;
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          @include bg(23px 23px);
          background-image: url("i_footprint.png");
        }
      }
    }
    .empty_fo {
      text-align: center;
      display: block;
      width: 80px;
      margin: 15px auto;
      font-size: 12px;
      line-height: 25px;
      color: $fs95;
      .em_bg {
        display: block;
        margin: 0 auto;
        width: 30px;
        height: 30px;
        @include bg(23px 23px);
        background-image: url("i_empty.png");
      }
    }
  }
</style>
