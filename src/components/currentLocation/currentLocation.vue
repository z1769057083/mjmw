<template>
  <div class="currentLocation-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">获取当前位置</p>
    </header>
    <!-- 主体信息 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="ininer-wrap">
          <div class="map-wrap">
            <i class="gps"></i>
            <baidu-map class="map" :center="gps" :zoom="zoom" :ak="ak" @ready="bdMap"></baidu-map>
          </div>
          <div class="item" :class="{on: flag == index}" v-for="(item, index) in list" @click="flag = index">
            <i class="icon"></i>
            <div class="txt">{{item}}</div>
            <i class="btn"></i>
          </div>
        </div>
        <div class="zw-45"></div>
      </div>
    </div>
    <a class="go-sure" @click="toBack">确认</a>
  </div>
</template>

<script>
  import {BaiduMap} from 'vue-baidu-map';
  import BScroll from 'better-scroll';
  import local from 'vue-cookie';

  export default {
    data() {
      return {
        ak: 'ZIbrLPXqL4GvE9L0Emih1rwj',
        gps: {lng: this.$route.query.lng, lat: this.$route.query.lat},
        zoom: 18,
        list: [],
        flag: 0
      };
    },
    methods: {
      toBack() {
        local.set('__moreAddress', this.list[this.flag]);
        this.$router.back();
      },
      bdMap({BMap, map}) {
        // 保存this引用
        let _this = this;
        // 添加地图类型控件
        map.addControl(new BMap.MapTypeControl());
        // 添加地图比例尺控件
        map.addControl(new BMap.ScaleControl());
        // 添加地图缩放控件
        map.addControl(new BMap.NavigationControl());
        // 解析地当前地址
        new BMap.Geocoder().getLocation(new BMap.Point(_this.gps.lng, _this.gps.lat), (res) => {
          if (res.address) {
            _this.list = [res.address];
          }
        });
        // 给地图添加添加拖动事件
        map.addEventListener('dragend', () => {
          // 重置第一个选中
          _this.flag = 0;
          // 获取可视区域
          let bs = map.getBounds();
          // 可视区域左下角
          let bssw = bs.getSouthWest();
          // 可视区域右上角
          let bsne = bs.getNorthEast();
          // 组装试图中心点坐标
          let obj = {lng: (bssw.lng + bsne.lng) / 2, lat: (bssw.lat + bsne.lat) / 2};
          // 解析地当前地址
          new BMap.Geocoder().getLocation(new BMap.Point(obj.lng, obj.lat), (res) => {
            let addComp = res.addressComponents;
            local.search(addComp.street + addComp.streetNumber);
          });
        });

        let options = {
          onSearchComplete(res) {
            console.log(res);
            // 判断状态是否正确
            if (local.getStatus() == 0) {
              let arr = [];
              for (let i = 0; i < res.getCurrentNumPois(); i++) {
                arr.push(res.getPoi(i).address + res.getPoi(i).title);
              }
              // 获取到的数据进行赋值操作
              _this.list = arr;
            }
          }
        };
        let local = new BMap.LocalSearch(map, options);
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
    components: {
      BaiduMap
    },
    watch: {
      list: {
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

  .currentLocation-wrap {
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
      .ininer-wrap {
        border-radius: $br6;
        overflow: hidden;
        .map-wrap {
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 82%;
          background: $bgff;
          .gps {
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 1;
            width: 30px;
            height: 40px;
            margin-left: -15px;
            margin-top: -40px;
            @include bg;
            background-image: url(i_point.png);
          }
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
          margin-top: 1px;
          padding: 7px 0;
          font-size: 13px;
          color: $fs43;
          background: $bgff;
          &.on {
            .icon {
              background-image: url(i_gps.png);
            }
            .btn {
              background-image: url(i_checked.png);
            }
          }
          .icon {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            @include bg(23px 23px);
            background-image: url(i_air.png);
          }
          .txt {
            flex: 1;
            text-align: justify;
            line-height: 1.5;
            word-break: break-all;
          }
          .btn {
            flex: 0 0 36px;
            width: 36px;
            height: 36px;
            @include bg(23px 23px);
            background-image: url(i_check.png);
          }
        }
      }
    }
    .go-sure {
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
