<template>
  <div class="fridgeSetting-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" href="javascript:window.history.go(-1)"></a>
      <p class="txt">冰箱屏保设置</p>
    </header>
    <div class="main">
      <!-- 温度设置 -->
      <div class="temp-wrap" ref="scroll_hook" v-if="curShow">
        <div class="scroll-wrap">
          <!-- 冷藏 -->
          <div class="item chill">
            <div class="left" :class="{on: coolRoom == 1}" @click="toggleCoolRoom">
              <span class="txt">冷藏</span>
              <i class="icon"></i>
            </div>
            <div class="right" v-show="coolRoom == 1">
              <div class="l">
                <span class="l-inner">
                  <span class="txt">{{upper}}</span>
                  <span class="sign">℃</span>
                </span>
              </div>
              <div class="r">
                <a class="sub" @touchstart="toggleClass"
                   @touchend="toggleClass" @click="upperSub"></a>
                <a class="add" @touchstart="toggleClass"
                   @touchend="toggleClass" @click="upperAdd"></a>
              </div>
            </div>
            <div class="right close" v-show="coolRoom == 0">冷藏室己关闭</div>
          </div>
          <!-- 冷冻 -->
          <div class="item freeze">
            <div class="left">
              <span class="txt">冷冻</span>
              <i class="icon"></i>
            </div>
            <div class="right">
              <div class="l">
                <span class="l-inner">
                  <span class="txt">{{lower}}</span>
                  <span class="sign">℃</span>
                </span>
              </div>
              <div class="r">
                <a class="sub" @touchstart="toggleClass"
                   @touchend="toggleClass" @click="lowerSub"></a>
                <a class="add" @touchstart="toggleClass"
                   @touchend="toggleClass" @click="lowerAdd"></a>
              </div>
            </div>
          </div>
          <!-- 功能 -->
          <div class="item functions">
            <div class="left">
              <span class="txt">功能</span>
              <i class="icon"></i>
            </div>
            <div class="rights" @click="changeState">
              <span class="item-item" :class="{on: fastCool == 1}" :data-index="1">速冷</span>
              <span class="item-item" :class="{on: fastFrozen == 1}" :data-index="2">速冻</span>
              <span class="item-item" :class="{on: smart == 1}" :data-index="3">智能</span>
              <span class="item-item" :class="{on: lock == 1}" :data-index="4">锁定</span>
            </div>
          </div>
        </div>
      </div>
      <!-- 屏保设置 -->
      <div class="pic-wrap" ref="scroll_hook" v-else="!curShow">
        <div class="scroll-wrap">
          <div class="pic-list" v-if="photos.length">
            <div class="item" v-for="(item, index) in photos">
              <div class="item-box">
                <div class="img-box">
                  <img class="img preview-img" :src="url + item.photo" @click="$preview.open(index, photos)">
                  <div class="del-box" v-show="">
                    <i class="icon"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="setting-wrap">
        <div class="tab-bar" v-if="!curShow">
          <div class="item left" :class="{active: screenSaver == 2}">
            <i class="icon"></i>
            <span class="txt">显示时钟</span>
          </div>
          <div class="item center" :class="{active: screenSaver == 1}">
            <i class="icon"></i>
            <span class="txt">播放相册</span>
          </div>
          <div class="item right">
            <i class="icon"></i>
            <span class="txt">添加图片</span>
          </div>
        </div>
        <div class="setting-bar">
          <div class="item left" :class="{active: curShow}" @click="curShow = true">
            <i class="icon"></i>
            <span class="txt">冰箱温度设置</span>
          </div>
          <div class="item right" :class="{active: !curShow}" @click="curShow = false">
            <i class="icon"></i>
            <span class="txt">冰箱屏保设置</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{ tips }}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        url: api.url,
        id: null,
        coolRoom: null,
        upper: null,
        lower: null,
        fastCool: null,
        fastFrozen: null,
        smart: null,
        lock: null,
        btn: ['default', 'fastCool', 'fastFrozen', 'smart', 'lock'],
        warning: false,
        tips: '',
        curShow: !false,
        photos: [],
        screenSaver: -1
      };
    },
    created() {
      // 用于存放冰箱数据
      this.fridge = {};
      this.initData();
    },
    mounted() {
      this.initScroll();
    },
    methods: {
      toggleCoolRoom() {
        if (this.coolRoom == 0) {
          this.ajaxData({coolRoom: 1}, () => {
            this.coolRoom = 1;
          });
        } else {
          this.ajaxData({coolRoom: 0}, () => {
            this.coolRoom = 0;
          });
        }
      },
      upperSub() {
        if (this.upper == 2) {
          this.warning = !this.warning;
          this.tips = '冷藏调节范围2℃ ~ 8℃';
          return;
        }
        this.ajaxData({upper: this.upper - 1}, () => {
          this.upper -= 1;
          this.fastCool = this.smart = 0;
          this.fridge.upper = this.upper;
        });
      },
      upperAdd() {
        if (this.upper == 8) {
          this.warning = !this.warning;
          this.tips = '冷藏调节范围2℃ ~ 8℃';
          return;
        }
        this.ajaxData({upper: this.upper + 1}, () => {
          this.upper += 1;
          this.fastCool = this.smart = 0;
          this.fridge.upper = this.upper;
        });
      },
      lowerSub() {
        if (this.lower == -24) {
          this.warning = !this.warning;
          this.tips = '冷冻调节范围-24℃ ~ -16℃';
          return;
        }
        this.ajaxData({lower: this.lower - 1}, () => {
          this.lower -= 1;
          this.fastFrozen = this.smart = 0;
          this.fridge.lower = this.lower;
        });
      },
      lowerAdd() {
        if (this.lower == -16) {
          this.warning = !this.warning;
          this.tips = '冷冻调节范围-24℃ ~ -16℃';
          return;
        }
        this.ajaxData({lower: this.lower + 1}, () => {
          this.lower += 1;
          this.fastFrozen = this.smart = 0;
          this.fridge.lower = this.lower;
        });
      },
      changeState(e) {
        // 1:速冷 2:速冻 3:智能 4:锁定
        let index = e.target.dataset.index;
        if (index == 1) {
          if (this.lock == 1) {
            this.warning = !this.warning;
            this.tips = '冰箱锁定状态，请解除锁定';
            return;
          }
          if (!this.coolRoom) {
            this.warning = !this.warning;
            this.tips = '冷藏室已关闭，无法设置';
            return;
          }
          if (this.fastCool == 0) {
            this.fastCool = 1;
            this.smart = 0;
            this.upper = 2;
            if (this.smart == 0) {
              this.lower = this.fridge.lower;
            }
          } else {
            this.fastCool = 0;
            this.upper = this.fridge.upper;
            this.lower = this.fridge.lower;
          }
        } else if (index == 2) {
          if (this.lock == 1) {
            this.warning = !this.warning;
            this.tips = '冰箱锁定状态，请解除锁定';
            return;
          }
          if (this.fastFrozen == 0) {
            this.fastFrozen = 1;
            this.smart = 0;
            this.lower = -24;
            if (this.smart == 0) {
              this.upper = this.fridge.upper;
            }
          } else {
            this.fastFrozen = 0;
            this.upper = this.fridge.upper;
            this.lower = this.fridge.lower;
          }
        } else if (index == 3) {
          if (this.lock == 1) {
            this.warning = !this.warning;
            this.tips = '冰箱锁定状态，请解除锁定';
            return;
          }
          if (this.smart == 0) {
            this.smart = 1;
            this.fastCool = 0;
            this.fastFrozen = 0;
            this.upper = 5;
            this.lower = -18;
          } else {
            this.smart = 0;
            this.upper = this.fridge.upper;
            this.lower = this.fridge.lower;
          }
        } else if (index == 4) {
          if (this.lock == 0) {
            this.lock = 1;
          } else {
            this.lock = 0;
          }
        }
      },
      ajaxData(options, callback) {
        if (this.lock == 1) {
          this.warning = !this.warning;
          this.tips = '冰箱锁定状态，请解除锁定';
          return;
        }
        this.$http.post(api.setFridgeTem, qs.stringify({
          upper: options.upper || this.upper,
          lower: options.lower || this.lower,
          coolroom_kg: options.coolRoom || this.coolRoom,
          fastcool_kg: options.fastCool || this.fastCool,
          fastfrozen_kg: options.fastFrozen || this.fastFrozen,
          smart_kg: options.smart || this.smart,
          lock_kg: options.lock || this.lock
        })).then((res) => {
          console.log(res);
          res = res.data;
          if (res.err_code == 200) {
            callback && callback();
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        });
      },
      toggleClass(e) {
        if (e.type === 'touchstart') {
          e.target.className = e.target.className + ' active';
        } else {
          e.target.className = e.target.className.split(' ')[0];
        }
      },
      initData() {
        this.$http.post(api.getFridgeTemData).then((res) => {
          res = res.data;
          console.log(res);
          if (res.err_code == 200) {
            res = res.data;
            this.id = res.equipment_id;
            this.coolRoom = res.coolroom_kg;
            this.fridge.upper = this.upper = res.upper | 0;
            this.fridge.lower = this.lower = res.lower | 0;
            this.fastCool = res.fastcool_kg;
            this.fastFrozen = res.fastfrozen_kg;
            this.smart = res.smart_kg;
            this.lock = res.lock_kg;
          }
        });
        this.$http.post(api.fridgePhotoList).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.photos = res.data.photos;
            this.screenSaver = res.data.screen_saver;
            this.photos.forEach((item) => {
              let oImg = new Image();
              oImg.src = this.url + item.photo;
              oImg.onload = () => {
                this.$set(item, 'src', oImg.src);
                this.$set(item, 'w', oImg.naturalWidth);
                this.$set(item, 'h', oImg.naturalHeight);
              };
            });
          }
        });
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true,
              probeType: 3
            });
          } else {
            this.scroll.refresh();
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .fridgeSetting-wrap {
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
      .scroll-wrap {
        padding: 5px;
      }
      .temp-wrap {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 72px;
        overflow: hidden;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 5px;
          padding: 10px;
          border-radius: $br6;
          background: $bgff;
          &:first-child {
            margin-top: 0;
          }
          .left {
            display: flex;
            align-items: center;
            .icon {
              height: 57px;
              @include bg;
            }
            .txt {
              height: 57px;
              line-height: 57px;
              padding: 0 10px 0 5px;
              font-size: 13px;
              color: $fs31;
            }
          }
          .right {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex: 1;
          }
        }
        .chill {
          .left {
            &.on {
              .icon {
                background-image: url(i_tep_a.png);
              }
            }
            .icon {
              width: 62px;
              background-image: url(i_tep_d.png);
            }
          }
          .right {
            .l {
              display: flex;
              justify-content: center;
              flex: 1;
              .l-inner {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 80px;
                .txt {
                  font-size: 33px;
                }
                .sign {
                  padding-left: 5px;
                  font-size: 18px;
                }
              }
            }
            .r {
              display: flex;
              justify-content: space-between;
              flex: 0 0 93px;
              width: 93px;
              .sub {
                width: 30px;
                height: 30px;
                @include bg;
                background-image: url(i_sub_d.png);
                &.active {
                  background-image: url(i_sub_a.png);
                }
              }
              .add {
                width: 30px;
                height: 30px;
                @include bg;
                background-image: url(i_add_d.png);
                &.active {
                  background-image: url(i_add_a.png);
                }
              }
            }
          }
          .close {
            justify-content: flex-end;
            font-size: 16px;
            color: $fs53;
          }
        }
        .freeze {
          .left {
            .icon {
              width: 62px;
              background-image: url(i_snow_a.png);
            }
          }
          .right {
            .l {
              display: flex;
              justify-content: center;
              flex: 1;
              .l-inner {
                display: flex;
                justify-content: flex-end;
                align-items: center;
                width: 80px;
                .txt {
                  font-size: 33px;
                }
                .sign {
                  padding-left: 5px;
                  font-size: 18px;
                }
              }
            }
            .r {
              display: flex;
              justify-content: space-between;
              flex: 0 0 93px;
              width: 93px;
              .sub {
                width: 30px;
                height: 30px;
                @include bg;
                background-image: url(i_sub_d.png);
                &.active {
                  background-image: url(i_sub_a.png);
                }
              }
              .add {
                width: 30px;
                height: 30px;
                @include bg;
                background-image: url(i_add_d.png);
                &.active {
                  background-image: url(i_add_a.png);
                }
              }
            }
          }
        }
        .functions {
          .left {
            .icon {
              width: 44px;
              background-image: url(i_border.png);
            }
          }
          .rights {
            flex: 1;
            font-size: 0;
            border-radius: $br6;
            overflow: hidden;
            .item-item {
              display: inline-block;
              width: 50%;
              height: 28px;
              line-height: 28px;
              text-align: center;
              box-shadow: -1px -1px #fff;
              font-size: 13px;
              color: $fs31;
              background: $bgec;
              &:nth-last-child(n + 3) {
                margin-top: 0;
              }
              &.on {
                color: $fsff;
                background: $bge5;
              }
            }
          }
        }
      }
      .pic-wrap {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 112px;
        overflow: hidden;
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
                  top: 50%;
                  width: 100%;
                  transform: translateY(-50%);
                }
                .del-box {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(255, 255, 255, .7);
                  .icon {
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                    width: 30px;
                    height: 30px;
                    @include bg(23px 23px);
                    background-image: url(i_close.png);
                  }
                }
              }
            }
          }
        }
      }
      .setting-wrap {
        position: absolute;
        left: 5px;
        bottom: 5px;
        right: 5px;
        border-radius: $br6;
        overflow: hidden;
        .active {
          color: $fse5;
        }
        .tab-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          margin-bottom: 1px;
          font-size: 13px;
          color: $fs53;
          background: $bgff;
          .item {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 0 33.3%;
            width: 33.3%;
            .icon {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
            }
            .txt {
              height: 30px;
              line-height: 30px;
            }
          }
          .left {
            &.active {
              .icon {
                background-image: url(i_click_a.png);
              }
            }
            .icon {
              background-image: url(i_click_d.png);
            }
          }
          .center {
            &.active {
              .icon {
                background-image: url(i_pic_a.png);
              }
            }
            .icon {
              background-image: url(i_pic_d.png);
            }
          }
          .right {
            &.active {
              .icon {
                background-image: url(i_upload_a.png);
              }
            }
            .icon {
              background-image: url(i_upload_d.png);
            }
          }
        }
        .setting-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: $fs95;
          .item {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;
            height: 67px;
            background: $bgff;
            .icon {
              width: 35px;
              height: 35px;
              @include bg;
            }
            .txt {
              padding-top: 5px;
            }
          }
          .left {
            &.active {
              .icon {
                background-image: url(i_deg_a.png);
              }
            }
            .icon {
              background-image: url(i_deg_d.png);
            }
          }
          .right {
            margin-left: 1px;
            &.active {
              .icon {
                background-image: url(i_img_a.png);
              }
            }
            .icon {
              background-image: url(i_img_d.png);
            }
          }
        }
      }
    }
  }
</style>
