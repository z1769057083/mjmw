<template>
  <div class="nearbyStore-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">附近小店</p>
    </header>
    <!-- 主体信息 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="map-wrap">
          <baidu-map class="map" :ak="ak" @ready="bdMap"></baidu-map>
        </div>
        <ul v-if="index < 1" v-for="(item, index) in list">
          <li class="item store-name">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">小店名称</span>
            </div>
            <div class="right">{{item.store_name}}</div>
          </li>
          <li class="item store-address">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">小店地址</span>
            </div>
            <div class="right">{{item.address}}</div>
          </li>
          <li class="item store-tel">
            <div class="left">
              <i class="icon"></i>
              <span class="txt">联系电话</span>
            </div>
            <div class="right">{{item.phone}}</div>
          </li>
        </ul>
        <div class="zw-45"></div>
      </div>
    </div>
    <a class="go-store" ref="btn">导航至小店</a>
  </div>
</template>

<script>
  import {BaiduMap} from 'vue-baidu-map';
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        ak: 'ZIbrLPXqL4GvE9L0Emih1rwj',
        me: {lng: this.$route.query.lng, lat: this.$route.query.lat},
        list: [],
        flag: false,
        target: {}
      };
    },
    methods: {
      bdMap({BMap, map}) {
        // 当前自己的坐标
        let pointMe = new BMap.Point(this.me.lng, this.me.lat);
        // 请求接口数据
        this.$http.post(api.getNearStore, qs.stringify({
          lng: this.me.lng,
          lat: this.me.lat
        })).then((res) => {
          res = res.data;
          if (res.err_code === 200) {
            this.list = res.data.store;
            let [arr, tempPoint] = [[], {}];
            this.list.forEach((item) => {
              tempPoint = new BMap.Point(item.lng * 1, item.lat * 1);
              // 把计算后的距离放到数据中
              arr.push(map.getDistance(pointMe, tempPoint).toFixed(2) * 1);
            });
            // 找出数据中最小的值
            let temp = Math.min.apply(null, arr);
            let num = arr.findIndex(item => item === temp);
            this.list = [this.list[num]];
            // 目标点
            let pointTarget = new BMap.Point(this.list[0].lng * 1, this.list[0].lat * 1);
            // 设置中心点和缩放
            map.centerAndZoom(pointTarget, 18);
            // 创建标注
            let icon = new BMap.Icon('http://cdn.mjmw365.com/images/gps_1.png', new BMap.Size(30, 40));
            let marker = new BMap.Marker(pointTarget, {icon: icon});
            // 将标注添加到地图中
            map.addOverlay(marker);
            // 创建信息窗口
            let opts = {
              position: pointTarget, // 指定文本标注所在的地理位置
              offset: new BMap.Size(-100, -78) // 设置文本偏移量
            };
            let oSpan = '<span style="position: absolute; top: 50%; right: 10px; width: 40px; line-height: 16px; text-align: center; margin-top: -8px; font-size: 12px; color: #fff; border-radius: 8px; background: #e5004f">导航</span><i style="position: absolute; left: 50%; bottom: -24px; width: 0; height: 0; border: 12px solid transparent; border-top-color: rgba(255, 255, 255, .7); transform: translateX(-50%);"></i>';
            // 创建文本标注对象
            let label = new BMap.Label(`${this.list[0].address} ${oSpan}`, opts);
            label.setStyle({
              width: '200px',
              lineHeight: '1.2',
              padding: '15px 50px 15px 12px',
              fontSize: '10px',
              color: '#e5004f',
              whiteSpace: 'normal',
              border: '0 none',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, .7)',
              boxSizing: 'border-box'
            });
            map.addOverlay(label);
            // 添加click事件
            label.addEventListener('click', () => {
              this.$refs.btn.click();
            });
            this.$refs.btn.addEventListener('click', () => {
              // 防止重绘
              if (this.flag) {
                return;
              }
              this.flag = !this.flag;
              // 移除标注 || 移除信息窗口
              map.removeOverlay(marker);
              map.removeOverlay(label);
              // 创建导航线路
              new BMap.DrivingRoute(map, {renderOptions: {map: map, autoViewport: true}}).search(pointMe, pointTarget);
            });
          }
        });
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    },
    watch: {
      list: {
        handler(val, oldVal) {
          this.initScroll();
        },
        deep: true
      }
    },
    components: {
      BaiduMap
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .nearbyStore-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgff;
    .head-wrap {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
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
      }
      .zw-45 {
        height: 45px;
      }
      .map-wrap {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 82%;
        border-radius: $br6;
        overflow: hidden;
        background: $bgff;
        .map {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 5px;
        padding: 5px 10px 5px 5px;
        font-size: 13px;
        border-radius: $br6;
        background: $bgff;
        .left {
          display: flex;
          align-items: center;
          flex: 0 0 100px;
          width: 100px;
          color: $fs43;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            padding-left: 2px;
          }
        }
        .right {
          flex: 1;
          line-height: 1.5;
          text-align: justify;
          color: $fs95;
        }
      }
      .store-name {
        .left {
          .icon {
            background-image: url(i_logo.png);
          }
        }
      }
      .store-address {
        .left {
          .icon {
            background-image: url(i_store.png);
          }
        }
      }
      .store-tel {
        .left {
          .icon {
            background-image: url(i_phone.png);
          }
        }
      }
    }
    .go-store {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      height: 45px;
      line-height: 45px;
      text-align: center;
      font-size: 13px;
      color: $fsff;
      background: $bge5;
    }
  }
</style>
