<template>
  <div class="mine-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">美家钻</p>
    </header>
    <div class="mine-mjz" ref="scroll_hook">
      <div class="mine-hook">
        <!--title 可用美家钻 充值 盒子-->
        <div class="use_mjbox">
          <div class="use_left">
            <a class="a_left">
              <span class="mon">{{balance}}</span>
              <span class="le_bo">可用美家钻</span>
            </a>
          </div>
          <div class="use_rig" @click="rechonge">
            <a class="a_right no_bg">
              <span class="ti"></span>
              <span class="ri_bo">充值</span>
            </a>
          </div>
        </div>
        <!--全部 获得 支出-->
        <div class="mj_conter">
          <!--nav-->
          <nav class="cen_title">
            <ul class="ti_box">
              <li class="teli" :class="{'active': red == 0}" @click="tecli(0)">
                <span class="tesp">全部</span>
              </li>
              <li class="teli" :class="{'active': red == 1}" @click="tecli(1)">
                <span class="tesp">获得</span>
              </li>
              <li class="teli" :class="{'co_blue': red == 2}" @click="tecli(2)">
                <span class="tesp">支出</span>
              </li>
            </ul>
          </nav>
          <!--数据盒子-->
          <div class="more_box">
            <!-- 单个记录 -->
            <div class="get_row" v-for="(item, index) in star">
              <div class="re_name">
                <span class="get_na" v-if="item.type == 'R'">{{item.remark}}</span>
                <span class="get_na" v-else-if="item.type == 'W'">换购水卡</span>
                <span class="get_na" v-else-if="item.type == 'C'">实体卡兑换</span>
                <span class="get_na" v-else-if="item.type == 'E'">商城消费</span>
                <!--有订单号-->
                <i class="re_num" v-if="item.type == 'E' || item.type == 'W'">订单号：{{item.remark}}</i>
              </div>
              <!--如果是获得 样式-->
              <span class="get_mon" v-if="item.type == 'R'">+ {{item.amount}}</span>
              <span class="get_mon" v-else-if="item.type == 'C'">+ {{item.amount}}</span>
              <!--如果是支出 样式-->
              <span class="get_mon fsout" v-else-if="item.type == 'E' || item.type == 'W'">- {{item.amount}}</span>
              <span class="get_time">
                <b class="time_year">{{formatTime(item.inputtime)}}</b>
              </span>
            </div>
          </div>
        </div>
        <p class="load-tip" v-show="star.length"><i></i><span>{{doneFlag ? '我是有底线的' : '上拉加载更多'}}</span><i></i></p>
        <!--没有美家钻弹出层-->
        <div class="no_record" v-show="norecord">
          <div class="box">
            <p class="reco_p">
              <span class="resp"></span>
            </p>
            <h3 class="reco_word">您还没有美家币记录</h3>
          </div>
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
  import {formatDate} from '../../common/js/util';
  import api from '../../api';
  import local from 'vue-cookie';
  import qs from 'qs';
  // 最小上拉高度
  const MIN_PULL = 30;
  export default {
    data() {
      return {
        warning: false,
        tips: '',
        red: 0,
        norecord: false,
        page: 1,
        totalPage: 2,
        ajax_start_flag: true,
        ajaxflag: true,
        doneFlag: false,
        done: true,
        curArr: [],
        balance: 0,
        star: []
      };
    },
    created() {
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
          jsApiList: ['getLocation']
        });
      });
      this._balance();
      this._indexAja(1, 'A');
    },
    methods: {
      // 点击充值
      rechonge () {
        let _this = this;
        // 判断是否有充值渠道
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
      // 过滤时间戳的方法
      formatTime(time) {
        return formatDate(time, 'yyyy.MM.dd  hh:mm:ss');
      },
      // 点击全部，获得，支出按键
      tecli(num) {
        this.red = num;
        this.page = 1;
        this.star = [];
        this.doneFlag = false;
        if (num == 0) {
          this._indexAja(1, 'A');
        } else if (num == 1) {
          this._indexAja(1, 'R');
        } else if (num == 2) {
          this._indexAja(1, 'E');
        } else {
          this._indexAja(1, 'A');
        }
      },
      // 获取美家币余额
      _balance() {
        if (!this.ajaxflag) {
          return;
        }
        this.ajaxflag = false;
        this.$http.post(api.purseExpired).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.balance = res.mjb;
            this.ajaxflag = true;
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 初始数据加载ajax
      _indexAja(num, type) {
        if (!this.ajax_start_flag) {
          return;
        }
        this.ajax_start_flag = false;
        this.$http.post(api.purseRecode, qs.stringify({
          from: num,
          count: 10,
          page: this.page,
          type: type
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.curArr = res.wallet;
            this.star = this.star.concat(this.curArr);
            this.norecord = false;
            this.ajax_start_flag = true;
            this.done = true;
            this.totalPage = res.total_page;
            if (this.page >= this.totalPage) {
              this.doneFlag = true;
            }
            if (this.star.length == 0) {
              this.norecord = true;
              this.done = false;
            }
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 滚动
      _iscorll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            click: true
          });
          // 记录高度
          this.maxHeight = this.scroll.maxScrollY;
          // 上拉加载
          this.scroll.on('touchend', (pos) => {
            if (pos.y < this.maxHeight - MIN_PULL) {
              this.page++;
              if (this.page > this.totalPage) {
                return;
              }
              if (this.red == 0) {
                this._indexAja(0, 'A');
              } else if (this.red == 1) {
                this._indexAja(1, 'R');
              } else {
                this._indexAja(1, 'E');
              }
            }
          });
        } else {
          this.scroll.refresh();
          // 记录高度
          this.maxHeight = this.scroll.maxScrollY;
        }
      }
    },
    watch: {
      star: {
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

  .mine-wrap {
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
    .mine-mjz {
      position: absolute;
      left: 5px;
      top: 41px;
      right: 5px;
      bottom: 0;
      overflow: hidden;
    }
    .use_mjbox {
      margin: 5px 0;
      display: flex;
      width: 100%;
      box-sizing: border-box;
      height: 80px;
      border-radius: $br6;
      background: $bgff;
      padding: 12px 0;
      .use_left {
        width: 10%;
        flex-grow: 2;
        height: 100%;
        border-right: 1px solid $bgec;
      }
      .a_left,
      .a_right {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
      .mon {
        color: $fse5;
        font-size: 16px;
        margin-top: 5px;
        margin-bottom: 7px;
      }
      .ti {
        width: 30px;
        height: 30px;
        background: url(i_mjz.png) no-repeat center;
        background-size: 23px 23px;
      }
      .le_bo,
      .ri_bo {
        font-size: 13px;
        color: $fs53;
      }
      .use_rig {
        width: 10%;
        flex-grow: 1;
        height: 100%;
      }
    }
    .mj_conter {
      width: 100%;
      border-radius: $br6;
      background-color: $bgff;
      .cen_title {
        width: 100%;
        height: 40px;
        .ti_box {
          width: 100%;
          height: inherit;
          z-index: inherit;
          display: flex;
          align-items: center;
          justify-content: space-around;
          .teli {
            width: 25%;
            height: 20px;
            border: 1px solid $bgec;
            border-radius: $br15;
            font-size: 13px;
            line-height: 21px;
            text-align: center;
            position: relative;
            color: $fs53;
            .tesp {
              display: block;
            }
          }
          .active {
            color: $fse5;
          }
          .co_blue {
            color: $fs44;
          }
        }
      }
    }
    .no_record {
      margin-top: 30px;
      width: 100%;
      .box {
        width: 298px;
        margin: 0 auto;
        border-radius: $br24;
        background-color: $bgff;
        .reco_p {
          display: flex;
          border-bottom: 1px solid $bdf0;
          position: relative;
          height: 40px;
          justify-content: center;
          align-items: center;
          .resp {
            width: 30px;
            height: 30px;
            background: url(i_no_mjz.png) no-repeat;
            background-size: contain;
          }
        }
        .reco_word {
          text-align: center;
          color: $fs31;
          font-size: 13px;
          padding: 30px 0 38px;
        }
      }
    }
    .more_box {
      .get_row {
        height: 40px;
        border-top: 1px solid $bgec;
        display: flex;
      }
      .re_name {
        width: 10%;
        padding-left: 10px;
        box-sizing: border-box;
        flex-grow: 2.6;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 13px;
        color: $fs53;
        .get_na {
          @extend .dot;
        }
        .re_num {
          font-size: 10px;
          color: $fs95;
          @extend .dot;
          padding-top: 5px;
        }
      }
      .get_mon {
        width: 10%;
        flex-grow: 0.6;
        flex-shrink: 0;
        font-size: 13px;
        color: $fse5;
        line-height: 40px;
        text-align: center;
        @extend .dot;
      }
      .fsout {
        color: $fs44;
      }
      .get_time {
        padding-right: 10px;
        box-sizing: border-box;
        width: 10%;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        flex-grow: 0.6;
        flex-shrink: 0;
        font-size: 10px;
        color: $fs95;
        justify-content: center;
        line-height: 14px;
        .time_year {
          text-align: right;
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
</style>
