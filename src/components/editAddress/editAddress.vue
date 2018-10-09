<template>
  <div class="account-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="toBack"></a>
      <p class="txt">编辑收货地址</p>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <div class="item consignee">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">收货人</span>
          </div>
          <div class="right">
            <input class="input" type="text" placeholder="收货人姓名" maxlength="10" v-model="name">
          </div>
        </div>
        <div class="address">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">收货地址</span>
          </div>
          <div class="right">
            <div class="items top" @click="changeAddressFlag">
              <div class="input input-mark" style="position: relative">
                <div class="ios-mark" style="position: absolute; left: 0; top: 0; right: 0; bottom: 0;"></div>
                <input class="input" :value="address" type="text" placeholder="请选择所在地区">
              </div>
              <i class="icon"></i>
            </div>
            <div class="items bot">
              <input class="input" type="text" placeholder="请输入详细地址" v-model="moreAddress">
              <i class="icon" @click="toGPS"></i>
            </div>
          </div>
        </div>
        <div class="item tel">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">联系电话</span>
          </div>
          <div class="right">
            <input class="input" type="tel" placeholder="请输入手机号码" v-model="phone">
          </div>
        </div>
        <div class="item default">
          <div class="left">
            <i class="icon"></i>
            <span class="txt">是否设为常用地址</span>
          </div>
          <div class="right">
              <span class="switch-box" :class="{on: isDefault == 1}" @click="toggleIsDefault">
                <span class="switch-dot"></span>
              </span>
          </div>
        </div>
      </div>
    </div>
    <a class="btn-save" @click="saveAddress">保存</a>
    <!-- 三级联动 -->
    <div class="pick-mark" v-show="addressFlag">
      <div class="btn-wrap">
        <a class="btn-cancel" @click="addressFlag = !addressFlag">取消</a>
        <a class="btn-sure" @click="fillAddress">确定</a>
      </div>
      <mt-picker class="select" :slots="slots" value-key="aname" @change="onValuesChange"></mt-picker>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
    <!-- 添加地址成功 -->
    <vtoasts v-show="success">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="toBack">返回</a>
    </vtoasts>
  </div>
</template>

<script>
  import {address, slots} from './address';
  import BScroll from 'better-scroll';
  import local from 'vue-cookie';
  import api from '../../api';
  import qs from 'qs';
  import {setLocal} from '../../common/js/util';

  export default {
    data() {
      return {
        addressFlag: false,
        slots: slots,
        address: local.get('__address') || '',
        id: local.get('__id'),
        tempAddr: '',
        name: local.get('__name') || '',
        moreAddress: local.get('__moreAddress') || '',
        phone: local.get('__phone') || '',
        isDefault: local.get('__default'),
        success: false,
        warning: false,
        tips: ''
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
      this.initAddress();
      this.initScroll();
    },
    methods: {
      toggleIsDefault() {
        if (this.isDefault == 1) {
          this.isDefault = 0;
        } else {
          this.isDefault = 1;
        }
      },
      changeAddressFlag() {
        let inputs = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].blur();
        }
        this.addressFlag = !this.addressFlag;
      },
      toBack() {
        local.set('__id', '');
        local.set('__name', '');
        local.set('__address', '');
        local.set('__moreAddress', '');
        local.set('__phone', '');
        local.set('__default', '');
        this.$router.back();
      },
      toGPS() {
        local.set('__id', this.id);
        local.set('__name', this.name);
        local.set('__address', this.address);
        local.set('__moreAddress', this.moreAddress);
        local.set('__phone', this.phone);
        local.set('__default', this.isDefault);
        let _this = this;
        this.$wechat.getLocation({
          type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success(res1) {
            _this.$router.push({name: 'currentLocation', query: {lng: res1.longitude, lat: res1.latitude}});
          }
        });
      },
      saveAddress() {
        // 验证收货人姓名
        if (this.name.replace(/^\s+|\s+$/g, '') == '') {
          this.warning = true;
          this.tips = '收货人姓名不能为空';
          return;
        }
        // 验证收货人姓名
        if (this.address == '') {
          this.warning = true;
          this.tips = '选择所在区不能为空';
          return;
        }
        // 验证详细地址
        if (this.moreAddress == '') {
          this.warning = true;
          this.tips = '详细地址不能为空';
          return;
        }
        // 验证手机号
        if (!(/^1[34578]\d{9}$/.test(this.phone))) {
          this.warning = true;
          this.tips = '请输入正确的手机号';
          return;
        }
        let tempArr = this.address.split(' ');
        let top = this.isDefault ? 1 : 0;
        this.$http.post(api.editAddress, qs.stringify({
          id: this.id,
          name: this.name,
          province: tempArr[0],
          city: tempArr[1],
          district: tempArr[2],
          address: this.moreAddress,
          phone: this.phone,
          top: top
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            this.success = !this.success;
            this.tips = '编辑地址成功';
            if (top) {
              setLocal('_address', res.data.address);
            }
          } else {
            this.warning = !this.warning;
            this.tips = res.err_msg;
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      fillAddress() {
        // 填入省市区
        this.address = this.tempAddr;
        this.addressFlag = !this.addressFlag;
      },
      initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            // 主体滚动
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              probeType: 3,
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      onValuesChange(picker, values) {
        // 防止没有省份时报错
        if (values[0]) {
          this.slots[1].values = address.filter((item, index) => {
            if (item.apid == values[0].aid) {
              return item;
            }
          });
        }
        // 防止没有市时报错
        if (values[1]) {
          this.slots[2].values = address.filter((item, index) => {
            if (item.apid == values[1].aid) {
              return item;
            }
          });
        }
        // 防止没有区时报错
        if (values[2]) {
          this.tempAddr = values[0].aname + ' ' + values[1].aname + ' ' + values[2].aname;
        }
      },
      initAddress() {
        this.slots[0].values = address.filter((item, index) => {
          if (item.apid == 0) {
            return item;
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .pick-mark {
    position: fixed;
    left: 0;
    top: 40px;
    bottom: 0;
    right: 0;
    background: rgba(236, 240, 243, .8);
    .btn-wrap {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 180px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 20px;
      font-size: 13px;
      background: $bgff;
      .btn-cancel {
        color: $fs55;
      }
      .btn-sure {
        color: $fse5;
      }
    }
    .select {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .account-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
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
        height: 30px;
        margin-top: -16px;
        @include bg(23px 23px);
      }
      .back {
        left: 9px;
        width: 30px;
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
      bottom: 46px;
      overflow: hidden;
      background: $bgec;
      .scroll-wrap {
        padding: 5px;
      }
      .zw-45 {
        height: 45px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        font-size: 13px;
        margin-top: 5px;
        border-radius: $br6;
        background: $bgff;
        &:first-child {
          margin-top: 0;
        }
        .left {
          display: flex;
          align-items: center;
          flex: 0 0 100px;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            color: $fs1b;
          }
        }
        .right {
          display: flex;
          flex: 1;
          height: 100%;
          .input {
            display: flex;
            width: 100%;
            height: 100%;
            padding-right: 20px;
            font-size: 13px;
            box-sizing: border-box;
          }
        }
      }
      .consignee {
        .left {
          .icon {
            background-image: url(i_avatar.png);
          }
        }
      }
      .address {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        .left {
          display: flex;
          flex: 0 0 100px;
          height: 61px;
          background: $bgff;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
            background-image: url(i_house.png);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            color: $fs1b;
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          flex: 1;
          .items {
            display: flex;
            align-items: center;
            width: 100%;
            height: 30px;
            background: $bgff;
            .input {
              flex: 1;
              display: flex;
              height: 100%;
              font-size: 13px;
              box-sizing: border-box;
            }
            .icon {
              width: 30px;
              height: 30px;
              margin-right: 3px;
              @include bg(23px 23px);
            }
          }
          .top {
            .icon {
              background-image: url(i_right_arrow.png);
            }
          }
          .bot {
            margin-top: 1px;
            .icon {
              background-image: url(i_gps.png);
            }
          }
        }
      }
      .tel {
        .left {
          .icon {
            background-image: url(i_phone.png);
          }
        }
      }
      .default {
        .left {
          flex: 1;
          .icon {
            background-image: url(i_lock.png);
          }
        }
        .right {
          justify-content: flex-end;
          align-items: center;
          .switch-box {
            position: relative;
            display: block;
            width: 40px;
            height: 20px;
            margin-right: 10px;
            border-radius: $br20;
            background: $bg95;
            &.on {
              background: $bge5;
              .switch-dot {
                left: 22px;
              }
            }
            .switch-dot {
              position: absolute;
              left: 2px;
              top: 2px;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: $bgff;
              transition: left .2s cubic-bezier(.4, .4, .25, 1.35);
            }
          }
        }
      }
    }
    .btn-save {
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
