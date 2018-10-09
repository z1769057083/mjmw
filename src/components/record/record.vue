<template>
  <div class="mine-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">交易记录</p>
    </header>
    <div class="mine-record" ref="scroll_hook">
      <div class="mine-hook">
        <nav class="tran_nav">
          <ul class="tran_u">
            <li class="tem">
              <div href="javascript:;" class="boxx" @click="trans">
                <span class="cont">{{type}}</span>
                <b class="tran_b" :class="{'tran_to': tran}"></b>
              </div>
            </li>
            <li class="tem">交易金额</li>
            <li class="tem">备注</li>
          </ul>
          <ul class="tran_mask" v-show="tran_ma">
            <li class="ten" v-show="chen" @click="content('充值')">
              <a class="conte">充值</a>
            </li>
            <li class="ten" v-show="consu" @click="content('美家币消费')">
              <a class="conte">美家币消费</a>
            </li>
            <li class="ten" v-show="mory" @click="content('全部')">
              <a class="conte">全部</a>
            </li>
          </ul>
        </nav>
        <!--全部盒子-->
        <div class="tran_more_box" v-show="!norecord">
          <!-- 遍历数据 -->
          <div class="rech_row" v-for="(item, index) in star">
            <div class="rech_mode">
              <span class="mode_time">{{ formatTime(item.inputtime) }}</span>
              <span class="mode_name" v-if="item.type == 'R' && item.recharge_from == 3">微信充值</span>
              <span class="mode_name" v-else-if="item.type == 'R' && item.recharge_from == 4">支付宝充值</span>
              <span class="mode_name" v-else-if="item.type == 'R' && item.recharge_from == 5">银联充值</span>
              <span class="mode_name"
                    v-else-if="item.type == 'R' && item.recharge_from != 5 && item.recharge_from != 4 && item.recharge_from != 3"></span>
              <span class="mode_name" v-else-if="item.type == 'C'">实体卡兑换</span>
              <span class="mode_name" v-else>美家币消费</span>
            </div>
            <!--如果是充值-->
            <span class="rech_mon" v-if="item.type == 'R'">+{{item.amount}}</span>
            <span class="rech_mon" v-else-if="item.type == 'C'">+{{item.amount}}</span>
            <!--如果是消费-->
            <span class="rech_mon cons_mon" v-else-if="item.type == 'E'">-{{item.amount}}</span>
            <span class="expla">
              <b class="expla_sp">{{item.remark}}</b>
            </span>
          </div>
          <p class="last-tip" v-show="star.length"><i></i><span>{{doneFlag ?'我是有底线的' : '上拉加载更多' }}</span><i></i></p>
        </div>
        <!--没有美家钻弹出层-->
        <div class="no_record" v-show="norecord">
          <div class="box">
            <p class="reco_p">
              <span class="resp"></span>
            </p>
            <h3 class="reco_word">您还没有交易记录</h3>
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
  import qs from 'qs';

  // 最小上拉高度
  const MIN_PULL = 30;
  export default {
    data() {
      return {
        warning: false,
        tips: '',
        norecord: false,
        tran: false,
        type: '全部',
        tran_ma: false,
        chen: true,
        consu: true,
        mory: false,
        page: 1,
        total_page: 2,
        doneFlag: false,
        ajax_start_flag: true,
        curArr: [],
        star: []
      };
    },
    created() {
      this._indexAja(0, 'A');
    },
    methods: {
      // 过滤时间戳的方法
      formatTime(time) {
        return formatDate(time, 'yyyy-MM-dd hh:mm:ss');
      },
      trans() {
        this.tran = !this.tran;
        this.tran_ma = !this.tran_ma;
      },
      // 点击全部、充值、美家币消费
      content(key) {
        this.type = key;
        this.tran_ma = false;
        this.doneFlag = false;
        this.page = 1;
        this.star = [];
        if (key == '全部') {
          this.mory = false;
          this.consu = true;
          this.chen = true;
          this._indexAja(0, 'A');
        } else if (key == '美家币消费') {
          this.mory = true;
          this.consu = false;
          this.chen = true;
          this._indexAja(1, 'E');
        } else if (key == '充值') {
          this.mory = true;
          this.consu = true;
          this.chen = false;
          this._indexAja(1, 'R');
        }
      },
      // 初始加载ajax
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
            this.total_page = res.total_page;
            this.doneFlag = false;
            if (this.page >= this.total_page) {
              this.doneFlag = true;
            }
            this.norecord = false;
            this.ajax_start_flag = true;
            if (this.star.length === 0) {
              this.norecord = true;
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
              if (this.page > this.total_page) {
                return;
              }
              if (this.type == '全部') {
                this._indexAja(0, 'A');
              } else if (this.type == '充值') {
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
    .mine-record {
      position: absolute;
      left: 5px;
      top: 41px;
      right: 5px;
      bottom: 0;
      overflow: hidden;
    }
    .tran_nav {
      width: 100%;
      overflow: hidden;
      border-radius: $br6;
      margin-top: 5px;
      /*title*/
      .tran_u {
        display: flex;
        height: 40px;
        width: 100%;
        background: $bgff;
        align-items: center;
        justify-content: center;
        .boxx {
          position: relative;
          display: block;
          width: 84%;
          height: 30px;
          border-radius: $br15;
          border: 1px solid $bgec;
          color: $fs95;
          font-size: 13px;
          .cont {
            text-align: center;
            display: inline-block;
            width: 78%;
            color: $fse5;
          }
          .tran_b {
            position: absolute;
            top: 0;
            right: 3px;
            width: 30px;
            height: 30px;
            background: url(i_bottom.png) no-repeat center;
            background-size: 23px 23px;
          }
          .tran_to {
            background: url(i_top.png) no-repeat center;
            background-size: 23px 23px;
          }
        }
        .tem {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 32px;
          line-height: 32px;
          font-size: 13px;
          color: $fs53;
          flex-grow: 1;
          width: 10%;
        }
      }
      /*隐藏框*/
      .tran_mask {
        display: flex;
        justify-content: center;
        height: 40px;
        width: 100%;
        background: $bgd1;
        .ten {
          display: flex;
          justify-content: center;
          align-items: center;
          flex-grow: 1;
          width: 10%;
          .conte {
            text-align: center;
            font-size: 13px;
            color: $fs95;
            width: 80%;
            height: 20px;
            line-height: 21px;
            background: $bgff;
            border-radius: $br15;
          }
        }
      }
    }
    /*全部盒子*/
    .tran_more_box {
      overflow: hidden;
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
      // 充值盒子，美家币获取，美家币消费
      .rech_row {
        display: flex;
        margin-top: 5px;
        min-height: 60px;
        border-radius: $br6;
        background: $bgff;
      }
      .rech_mode {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-shrink: 0;
        line-height: 16px;
        width: 41%;
        padding-left: 15px;
        box-sizing: border-box;
        .mode_time {
          display: block;
          margin-bottom: 5px;
          font-size: 10px;
          color: $fs95;
        }
        .mode_name {
          display: block;
          font-size: 13px;
          color: $fs53;
          @extend .dot;
        }
      }
      .rech_mon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: 27%;
        font-size: 13px;
        color: $fse5;
        padding-left: 13px;
        box-sizing: border-box;
        @extend .dot;
      }
      .cons_mon {
        color: $fs44;
      }
      .cons_mon {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        width: 27%;
        font-size: 13px;
        color: $fs44;
        padding-left: 13px;
        box-sizing: border-box;
        @extend .dot;
      }
      .expla {
        flex-shrink: 0;
        width: 32%;
        display: flex;
        align-items: center;
        padding: 3px 2px 3px 0;
        box-sizing: border-box;
        .expla_sp {
          font-size: 11px;
          line-height: 16px;
          color: $fs53;
          word-break: break-all;
        }
      }
    }
    /*没有记录*/
    .no_record {
      margin-top: 80px;
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
            background: url(i_no_ord.png) no-repeat;
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
  }
</style>
