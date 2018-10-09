<template>
  <div class="confirm-wrap">
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">优惠券</p>
    </header>
    <!--标题-->
    <nav class="coupon-nav">
      <ul class="conbox">
        <li class="temp">
          <span class="tesp" :class="{active: active == 0}" @click="change_active(0)">未使用</span>
          <!--<b class="tesb" v-show="active == 0 && star.length >0">{{star.length}}</b>-->
        </li>
        <li class="temp">
          <span class="tesp" :class="{active: active == 2}" @click="change_active(2)">即将过期</span>
          <!--<b class="tesb" v-show="active == 2 && star.length >0">{{star.length}}</b>-->
        </li>
        <li class="temp">
          <span class="tesp" :class="{active: active == 1}" @click="change_active(1)">已使用</span>
          <!--<b class="tesb" v-show="active == 1 && star.length >0">{{star.length}}</b>-->
        </li>
      </ul>
    </nav>
    <div class="con-wrap" ref="scroll_hook">
      <div>
        <!--不为空时-->
        <div class="ulbox" v-show="Nonull">
          <ul class="conte-box">
            <li class="temli" v-for="item in star">
              <dl class="temdl">
                <dt class="temdt">
                  <!--v-if如果是已经使用的-->
                  <img src="./i_refrigerator.png" alt="" class="dt-img more_gray" v-if="item.is_used == 1"/>
                  <!--v-else如果不是已经使用的-->
                  <img src="./i_refrigerator.png" alt="" class="dt-img" v-else/>
                </dt>
                <!--冰箱券-->
                <dd class="temdd1" v-if="item.is_used == 0">
                  <h3 class="bank-con">{{item.coupon_name}}</h3>
                  <!--<h4 class="bank-date">{{formatTime(datatimes)}}—{{formatTime(item.coupon_end_time)}}</h4>-->
                </dd>
                <dd class="temdd1" v-else>
                  <h3 class="bank-con bank95">{{item.coupon_name}}</h3>
                  <!--<h4 class="bank-date">{{formatTime(datatimes)}}—{{formatTime(item.coupon_end_time)}}</h4>-->
                </dd>
                <!--v-else-if-->
                <!--50元的券红色-->
                <!--<dd class="temdd1">-->
                <!--<div class="ay-reduce">-->
                <!--<span class="red-sp">50</span>-->
                <!--<p class="red-p">-->
                <!--<span class="red-p-sp">满减券</span>-->
                <!--<b class="red-p-b">满99可用</b>-->
                <!--</p>-->
                <!--</div>-->
                <!--<h5 class="ay-name">自营饼干蛋糕休闲食品专场自营饼干蛋糕休闲食品</h5>-->
                <!--<h4 class="bank-date">2016.9.1—2017.02.12</h4>-->
                <!--</dd>-->
                <!--v-else-if-->
                <!--50元的券蓝色-->
                <!--<dd class="temdd1">-->
                <!--<div class="ay-reduce red-bluef">-->
                <!--<span class="red-sp">50</span>-->
                <!--<p class="red-p">-->
                <!--<span class="red-p-sp sp-blue">满减券</span>-->
                <!--<b class="red-p-b">满99可用</b>-->
                <!--</p>-->
                <!--</div>-->
                <!--<h5 class="ay-name">自营饼干蛋糕休闲食品专场自营饼干蛋糕休闲食品</h5>-->
                <!--<h4 class="bank-date">2016.9.1—2017.02.12</h4>-->
                <!--</dd>-->
                <!--已过期-->
                <!--v-else-if-->
                <!--<dd class="temdd1">-->
                <!--<div class="ay-reduce red-gruyf">-->
                <!--<span class="red-sp">50</span>-->
                <!--<p class="red-p">-->
                <!--<span class="red-p-sp sp-gruy">满减券</span>-->
                <!--<b class="red-p-b">满99可用</b>-->
                <!--</p>-->
                <!--</div>-->
                <!--<h5 class="ay-name">自营饼干蛋糕休闲食品专场自营饼干蛋糕休闲食品</h5>-->
                <!--<h4 class="bank-date">2016.9.1—2017.02.12</h4>-->
                <!--</dd>-->
                <!--冰箱券-->
                <dd class="temdd2" v-if="item.is_used == 0">
                  <b class="cular-b"></b>
                  <i class="cular-i"></i>
                  <a class="change-a" @click="changeFridge">兑换<br/>冰箱</a>
                </dd>
                <!--粉色立即使用-->
                <!--<dd class="temdd2">-->
                <!--<b class="cular-b"></b>-->
                <!--<i class="cular-i"></i>-->
                <!--<a class="change-a">立即<br/>使用</a>-->
                <!--</dd>-->
                <!--蓝色立即使用-->
                <!--<dd class="temdd2 blue">-->
                <!--<b class="cular-b"></b>-->
                <!--<i class="cular-i"></i>-->
                <!--<a class="change-a">立即<br/>使用</a>-->
                <!--</dd>-->
                <!--灰色已过期-->
                <dd class="temdd2 gruy" v-else-if="item.is_used == 1">
                  <b class="cular-b"></b>
                  <i class="cular-i"></i>
                  <a class="change-a overdue-a">已使用</a>
                </dd>
              </dl>
            </li>
          </ul>
          <p class="last-tip" v-show="star.length"><i></i><span>{{done_flag ? '我是有底线的' : '上拉加载更多'}}</span><i></i></p>
        </div>
        <!--为空时-->
        <div class="nousecoupon" v-show="Null">
          <p class="no_p">
            <i class="no_i"></i>
          </p>
          <h4 class="nouse_font">无可用优惠券</h4>
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
  import { formatDate, setLocal } from '../../common/js/util';
  import fridgeObj from '../../common/js/config';
  import api from '../../api';
  import qs from 'qs';

  const MIN_PULL = 30;
  export default{
    data() {
      return {
        warning: false,
        tips: '',
        active: 0,
        overdue: false,
        Null: false,
        Nonull: true,
        page: 1,
        total_page: 2,
        done_flag: false,
        ajax_start_flag: true,
        star: [],
        curArr: [],
        stararr: [
          {
            id: '1',
            coupon_name: '冰箱优惠券',
            coupon_end_time: '1469426340',
            is_used: '0'
          },
          {
            id: '1',
            coupon_name: '冰箱优惠券',
            coupon_end_time: '1469426340',
            is_used: '1'
          }
        ]
//        datatimes: 1
      };
    },
    methods: {
      changeFridge() {
        setLocal('_num', 1);
        setLocal('_list', [fridgeObj]);
        setLocal('_goodsNum', '1|1');
        this.$router.push({name: 'confirmFridge'});
      },
      // 过滤时间戳的方法
      formatTime(time) {
        return formatDate(time, 'yyyy-MM-dd');
      },
      // 点击切换
      change_active(num) {
        this.active = num;
        this.page = 1;
        this.star = [];
        this.done_flag = false;
        this._indexAjax(num);
      },
      // 数据加载
      _indexAjax(num) {
        if (!this.ajax_start_flag) {
          return;
        }
        this.ajax_start_flag = false;
        this.$http.post(api.couponList, qs.stringify({
          flag: num,
          count: 10,
          page: this.page
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.curArr = res.coupons;
            this.star = this.star.concat(this.curArr);
            this.total_page = res.total_page;
            this.done_flag = false;
            if (this.page >= this.total_page) {
              this.done_flag = true;
            }
            this.Null = false;
            this.Nonull = true;
            this.ajax_start_flag = true;
            if (this.star.length == 0) {
              this.Null = true;
              this.Nonull = false;
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
            click: true,
            probeType: 3
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
              if (this.active == 0) {
                this._indexAjax(0);
              } else if (this.active == 2) {
                this._indexAjax(2);
              } else if (this.active == 1) {
                this._indexAjax(1);
              }
            }
          });
        } else {
          this.scroll.refresh();
          // 记录高度
          this.maxHeight = this.scroll.maxScrollY;
        }
      }
      // 获取当前日期的时间戳
//      datatime() {
//        return Date.parse(new Date());
//      }
    },
    mounted() {
//      this.datatimes = this.datatime() / 1000;
      this._indexAjax(0);
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

  /*全灰色*/
  .more_gray {
    filter: grayscale(100%);
    transform: translateZ(0);
  }

  .confirm-wrap {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
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
    .coupon-nav {
      position: relative;
      top: 40px;
      width: 100%;
      padding: 5px;
      box-sizing: border-box;
      .conbox {
        display: flex;
        justify-content: center;
        width: 100%;
        height: 40px;
        border-radius: $br6;
        background-color: $bgff;
        .temp {
          width: 33.3%;
          color: $fs53;
          text-align: center;
          .tesp {
            display: inline-block;
            height: 20px;
            line-height: 21px;
            padding: 0 10px;
            border-radius: $br10;
            font-size: 13px;
            /*margin-right: 5px;*/
            margin-top: 10px;
          }
          .active {
            background-color: $fse5;
            color: $fsff;
          }
          .tesb {
            color: $fse5;
            font-size: 10px;
          }
        }
      }
    }
    .con-wrap {
      position: absolute;
      left: 0;
      top: 90px;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }
    .ulbox {
      padding: 0 5px;
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
    .conte-box {
      width: 100%;
      .temli {
        width: 100%;
        height: 80px;
        margin-bottom: 5px;
        .temdl {
          display: flex;
          width: inherit;
          height: 80px;
          border-radius: $br6;
          overflow: hidden;
          background: $bgff;
          box-shadow: 0px 0px 3px 0px rgba(0, 0, 0, 0.2);
          .temdt {
            flex-shrink: 0;
            width: 80px;
            height: 80px;
            .dt-img {
              width: 100%;
              height: 100%;
            }
          }
          .temdd1 {
            display: flex;
            flex-direction: column;
            justify-content: center;
            background: $bgff;
            height: inherit;
            flex-grow: 1;
            padding-left: 8px;
            width: calc(95% - 160px);
            box-sizing: border-box;
            padding-right: 3px;
            .bank-con {
              font-size: 16px;
              color: $fse5;
              font-weight: bold;
              margin-top: 4px;
              margin-bottom: 7px;
              padding: 10px 0 8px;
            }
            .bank95 {
              color: $fs95;
            }
            .bank-date {
              flex-shrink: 0;
              font-size: 10px;
              line-height: 16px;
              color: $fs95;
            }
          }
          .temdd2 {
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            flex-shrink: 0;
            width: 80px;
            height: inherit;
            text-align: center;
            background-color: $bge5;
            .cular-b {
              position: absolute;
              z-index: 9;
              top: -5px;
              left: -5px;
              width: 10px;
              height: 10px;
              border-radius: 100%;
              background: $bgec;
              box-shadow: 0px 80px 0px 0px $bgec;
            }
            .cular-i {
              position: absolute;
              z-index: 9;
              top: 10px;
              left: -3px;
              width: 6px;
              height: 6px;
              border-radius: 100%;
              background: $bgec;
              box-shadow: 0px 11px 0px 0px $bgec, 0px 22px 0px 0px $bgec, 0px 33px 0px 0px $bgec, 0px 43px 0px 0px $bgec, 0px 54px 0px 0px $bgec;
            }
            .change-a {
              width: 100%;
              font-size: 13px;
              color: $fsff;
              height: 30px;
              line-height: 14px;
            }
            .overdue-a {
              line-height: 30px;
            }
          }
          .blue {
            background-color: $bg88;
          }
          .gruy {
            background-color: $bg95;
          }
        }
      }
      .ay-reduce {
        display: flex;
        height: 42px;
        color: $fse5;
        .red-sp {
          height: 40px;
          line-height: 40px;
          font-size: 40px;
          font-weight: bold;
        }
        .red-p {
          margin-top: 4px;
          margin-left: 5px;
          font-size: 0px;
          .red-p-sp {
            display: block;
            border: 1px solid $bde5;
            border-radius: 8px;
            margin-bottom: 3px;
            text-align: center;
            padding: 0 7px;
            font-size: 10px;
            line-height: 15px;
            height: 15px;
          }
          .sp-blue {
            border: 1px solid $bg88;
          }
          .sp-gruy {
            border: 1px solid $fs95;
          }
          .red-p-b {
            font-size: 10px;
          }
        }
      }
      .red-bluef {
        color: $bg88;
      }
      .red-gruyf {
        color: $fs95;
      }
      .ay-name {
        font-size: 10px;
        color: $fs95;
        line-height: 12px;
        margin-top: 2px;
        margin-bottom: 1px;
        @extend .dot;
      }
    }
    /*为空时*/
    .nousecoupon {
      position: relative;
      z-index: 9;
      top: 0;
      left: 0;
      width: 298px;
      background: $bgff;
      margin: 120px auto;
      border-radius: $br20;
      overflow: hidden;
      .no_p {
        border-bottom: 1px solid $bdf0;
        position: relative;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        .no_i {
          width: 30px;
          height: 30px;
          background: url(i_nouse.png);
          background-size: contain;
        }
      }
      .nouse_font {
        font-size: 13px;
        text-align: center;
        color: $fs43;
        margin: 30px 0;
      }
    }
  }
</style>
