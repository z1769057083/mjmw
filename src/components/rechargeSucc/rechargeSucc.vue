<template>
  <div class="mine-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="back"></a>
      <p class="txt">充值</p>
    </header>
    <div class="mine-recharge" ref="scroll_hook">
      <div></div>
    </div>
    <!--充值7999换购水卡和冰箱兑换券-->
    <div class="rech_su" v-show="water">
      <div class="box">
        <p class="title">充值成功</p>
        <!--<h3 class="tit">恭喜您获得水卡换购券、冰箱兑换券各一张</h3>-->
        <h3 class="tit">恭喜您获得冰箱兑换券一张</h3>
        <div class="ulbox">
          <ul class="conte-box">
            <!--<li class="temli">-->
            <!--<dl class="temdl">-->
            <!--<dt class="temdt">-->
            <!--<img src="./i_worter.png" alt="" class="dt-img"/>-->
            <!--</dt>-->
            <!--&lt;!&ndash;水卡&ndash;&gt;-->
            <!--<dd class="temdd1">-->
            <!--<h3 class="bank-con">水卡换购券</h3>-->
            <!--<h4 class="bank-date">4099美家钻换购<br/>价值5000元水卡</h4>-->
            <!--</dd>-->
            <!--<dd class="temdd2">-->
            <!--<b class="cular-b"></b>-->
            <!--<i class="cular-i"></i>-->
            <!--<a class="change-a">换购<br/>水卡</a>-->
            <!--</dd>-->
            <!--</dl>-->
            <!--</li>-->
            <li class="temli">
              <dl class="temdl">
                <dt class="temdt">
                  <img src="./i_refrigerator.png" alt="" class="dt-img"/>
                </dt>
                <!--水卡-->
                <dd class="temdd1">
                  <h3 class="bank-con">冰箱兑换券</h3>
                  <!--<h4 class="bank-date">兑换截至日期<br/>{{ formatTime(datatimes)}}-2017.02.12</h4>-->
                </dd>
                <dd class="temdd2">
                  <b class="cular-b"></b>
                  <i class="cular-i"></i>
                  <a class="change-a">兑换<br/>冰箱</a>
                </dd>
              </dl>
            </li>
          </ul>
        </div>
        <a class="moent" @click="monRecharge">立即换购</a>
      </div>
    </div>
    <!--充值成功弹层-->
    <vtoasts v-show="re_su">
      <i slot="icon" class="icon re_su"></i>
      <div slot="txt" class="txt">充值成功</div>
      <a slot="btn" class="btn" @click="back">返回</a>
    </vtoasts>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import {setLocal} from '../../common/js/util';
  import fridgeObj from '../../common/js/config';
  import api from '../../api';
  import qs from 'qs';
  import local from 'vue-cookie';
  export default {
    data() {
      return {
        water: false,
        re_su: false
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
    },
    mounted() {
      let IndeUrl = window.location.href;
      console.log(IndeUrl);
      if (IndeUrl.indexOf('T6hLh6Aver6y') > -1) {
        this.water = true;
        this.re_su = false;
      } else {
        this.re_su = true;
        this.water = false;
      }
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.scroll_hook, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    methods: {
      back() {
        let _this = this;
        if (local.get('_isCh') != 1) {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.replace({name: 'bindChannel', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        } else {
          this.$wechat.getLocation({
            type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success(res1) {
              _this.$router.replace({name: 'recharge', query: {lng: res1.longitude, lat: res1.latitude}});
            }
          });
        }
      },
      // 立即换购
      monRecharge() {
        setLocal('_num', 1);
        setLocal('_list', [fridgeObj]);
        setLocal('_goodsNum', '1|1');
        this.$router.push({name: 'confirmFridge'});
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
    bottom: 46px;
    background: $bgec;
    .toasts-wrap .alert .title .re_su {
      display: block;
      @include bg(30px 30px);
      background-image: url(i_ev_sucess.png);
    }
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
      z-index: 11;
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
    .mine-recharge {
      position: absolute;
      left: 5px;
      top: 41px;
      right: 5px;
      bottom: 0;
      overflow: hidden;
    }
    /*水卡和冰箱弹出层*/
    .rech_su {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: rgba(238, 242, 245, 0.8);
      .box {
        width: 298px;
        text-align: center;
        border: 1px solid $bdec;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
        .title {
          border-bottom: 1px solid $bdf0;
          position: relative;
          height: 40px;
          line-height: 40px;
          color: $fse5;
          font-size: 16px;
        }
        .tit {
          color: $fs31;
          font-size: 13px;
          margin: 19px 0;
        }
        .ulbox {
          padding: 0 5px;
        }
        .conte-box {
          width: 100%;
          .temli {
            width: 100%;
            height: 80px;
            margin-bottom: 10px;
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
                text-align: left;
                .bank-con {
                  font-size: 13px;
                  color: $fs53;
                  margin-top: 4px;
                  margin-bottom: 7px;
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
                  background: $bgff;
                  box-shadow: 0px 80px 0px 0px $bgff;
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
              }
            }
          }
        }
        .moent {
          display: block;
          height: 50px;
          line-height: 50px;
          margin: 0 10px 10px;
          box-sizing: border-box;
          color: $fse5;
          font-size: 13px;
          border: 1px solid $bddc;
          border-radius: $br24;
          overflow: hidden;
        }
      }
    }
    /*换购成功*/
    .rech {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 10;
      width: 100%;
      height: 100%;
      background: rgba(238, 242, 245, 0.8);
      .rebox {
        width: 298px;
        text-align: center;
        border: 1px solid $bdec;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
        .bu_su_p {
          display: flex;
          justify-content: center;
          align-items: center;
          border-bottom: 1px solid $bdf0;
          position: relative;
          height: 40px;
          line-height: 40px;
          .bu_img {
            display: block;
            width: 30px;
            height: 30px;
            background: url(i_ev_sucess.png) no-repeat;
            background-size: contain;
          }
        }
        .bu_cen {
          padding: 10px;
          padding-bottom: 0;
          width: 100%;
          box-sizing: border-box;
          .cen_p {
            text-align: justify;
            font-size: 12px;
            color: $fs31;
            line-height: 16px;
            margin-bottom: 8px;
          }
        }
      }
    }
  }
</style>
