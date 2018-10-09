<template>
  <div class="account-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">地址管理</p>
      <span class="sure pos" v-show="list.length && isShow" @click="changeAddress">确认</span>
    </header>
    <!-- 主体内容 -->
    <div class="main" :class="{no: !list.length && isSeen}" ref="scroll_hook">
      <div class="scroll-wrap">
        <template v-if="!list.length && isSeen">
          <div class="zw-110"></div>
          <!-- 绑定手机号 -->
          <div class="alert">
            <div class="title">
              <i class="icon"></i>
            </div>
            <div class="cont">
              <p class="txt">您还没有收货地址</p>
              <router-link class="btn btn-add" :to="{name: 'addAddress'}">添加新地址</router-link>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="address-box store-box" v-if="item.id == 0" v-for="item in list">
            <div class="title">
              <i class="icon"></i>
              <span class="txt">小店地址</span>
            </div>
            <div class="item-box">
              <div class="item">
                <div class="cont">
                  <div class="btn-box">
                    <span class="btn" :class="{on: item.checked}" v-show="isShow" @click="changeChecked(item)"></span>
                  </div>
                  <div class="left">
                    <div class="user">{{item.name}}</div>
                    <div class="address">{{item.address}}</div>
                  </div>
                  <div class="right">
                    <div class="tel">{{item.phone}}</div>
                    <div class="handle"></div>
                  </div>
                </div>
              </div>
              <div class="trash"></div>
            </div>
          </div>
          <div class="address-box others-box" v-show="list.length">
            <div class="title">
              <i class="icon"></i>
              <span class="txt">其他收货地址</span>
            </div>
            <div class="item-box" v-if="item.id != 0" v-for="item in list">
              <div class="item" :class="{on: item.left}" v-finger:swipe="swipe.bind(this, item)">
                <div class="cont">
                  <div class="btn-box">
                    <span class="btn" :class="{on: item.checked}" v-show="isShow" @click="changeChecked(item)"></span>
                  </div>
                  <div class="left">
                    <div class="user">{{item.name}}</div>
                    <div class="address">{{item.province + '' + item.city + '' + item.district + '' + item.address}}</div>
                  </div>
                  <div class="right">
                    <div class="tel">{{item.phone}}</div>
                    <div class="handle" @click="toEditAddress(item)">
                      <span class="txt">编辑</span>
                      <i class="icon"></i>
                    </div>
                  </div>
                </div>
                <div class="trash" @click="showDel(item)"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <router-link class="add-address" v-show="list.length" :to="{name: 'addAddress'}">添加新地址</router-link>
    <!-- 删除弹层 -->
    <div class="del-mark" v-if="flag">
      <div class="alert">
        <div class="title">
          <i class="icon-tip"></i>
        </div>
        <div class="cont">
          <p class="txt">确认删除所选地址</p>
          <a class="btn btn-ok" @click="delItem">确认</a>
          <a class="btn btn-cancle" @click="flag = !flag">取消</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import {setLocal, getLocal} from '../../common/js/util';
  import local from 'vue-cookie';

  export default {
    data() {
      return {
        flag: false,
        list: [],
        warning: false,
        tips: '',
        delObj: null,
        isShow: this.$route.query.personal ? false : true,
        isSeen: false
      };
    },
    mounted() {
      this.initScroll();
      this.getAddress();
    },
    methods: {
      swipe(obj, ev) {
        if (ev.direction == 'Left') {
          // 找到已经左滑的元素，将其实还原
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].left) {
              this.list[i].left = false;
              break;
            }
          }
          obj.left = true;
        } else if (ev.direction == 'Right') {
          obj.left = false;
        }
      },
      changeChecked(obj) {
        if (this.$route.query.fridge && obj.id == 0) {
          return;
        }
        this.list.forEach((item) => {
          if (item == obj) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
      },
      changeAddress() {
        // 找出选中的那项
        let temp = this.list.find((item) => {
          return item.checked;
        });
        if (temp) {
          setLocal('_address', temp);
        } else {
          setLocal('_address', {});
        }
        this.$router.back();
      },
      showDel(obj) {
        this.delObj = obj;
        this.flag = !this.flag;
      },
      delItem() {
        this.$http.post(api.deleteAddress, qs.stringify({
          id: this.delObj.id
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            if (getLocal('_address').id == this.delObj.id) {
              setLocal('_address', {});
            }
            this.list.splice(this.list.indexOf(this.delObj), 1);
            this.flag = !this.flag;
          }
        });
      },
      toEditAddress(obj) {
        local.set('__name', obj.name);
        local.set('__id', obj.id);
        local.set('__address', obj.province + ' ' + obj.city + ' ' + obj.district);
        local.set('__moreAddress', obj.address);
        local.set('__phone', obj.phone);
        local.set('__default', obj.is_on);
        this.$router.push({name: 'editAddress'});
      },
      getAddress() {
        this.$http.post(api.addressMember)
          .then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              this.list = res.data.address;
              this.isSeen = true;
              for (let i = 0; i < this.list.length; i++) {
                // 找出默认选中项
                if (this.list[i].is_on == 1) {
                  this.$set(this.list[i], 'checked', true);
                } else {
                  this.$set(this.list[i], 'checked', false);
                }
                // 为每一项增加一个left属性
                this.$set(this.list[i], 'left', false);
              }
            }
          });
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
      }
    },
    watch: {
      list: {
        handler() {
          this.initScroll();
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .account-wrap {
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
      .sure {
        right: 15px;
        line-height: 30px;
        color: $fse5;
      }
    }
    .main {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 45px;
      overflow: hidden;
      background: $bgec;
      &.no {
        bottom: 0;
      }
      .scroll-wrap {
        padding: 5px;
      }
      .zw-110 {
        height: 110px;
      }
      .alert {
        width: 298px;
        margin: 0 auto;
        border-radius: $br20;
        overflow: hidden;
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          background: $bgff;
          .icon {
            width: 30px;
            height: 30px;
            @include bg;
            background-image: url(i_wrong.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .txt {
            text-align: center;
            padding: 25px 0;
            font-size: 13px;
            color: $fs31;
          }
          .btn {
            display: block;
            width: 274px;
            height: 48px;
            margin: 0 auto;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            overflow: hidden;
          }
          .btn-add {
            line-height: 48px;
            text-align: center;
            color: $fse5;
          }
        }
      }
      .address-box {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        &:first-child {
          margin-top: 0;
        }
        &.store-box {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
          .title {
            .icon {
              background-image: url(i_home.png);
            }
            .txt {
              color: $fs84;
            }
          }
          .handle {
            height: 15px;
          }
        }
        &.others-box {
          .title {
            .icon {
              background-image: url(i_house.png);
            }
            .txt {
              color: $fs8c;
            }
          }
        }
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          background: $bgff;
          .icon {
            width: 30px;
            height: 30px;
            @include bg(23px 23px);
          }
          .txt {
            height: 30px;
            line-height: 30px;
            font-size: 13px;
          }
        }
        .item {
          position: relative;
          width: 100%;
          margin-top: 1px;
          transition: transform .3s;
          &.on {
            transform: translateX(-50px);
          }
          .cont {
            display: flex;
            align-items: center;
            width: 100%;
            line-height: 1.3;
            padding: 8px 10px 8px 0;
            font-size: 13px;
            color: $fs43;
            background: $bgff;
            box-sizing: border-box;
            .btn-box {
              display: flex;
              justify-content: center;
              align-items: center;
              flex: 0 0 34px;
              width: 34px;
              height: 100%;
              .btn {
                width: 30px;
                height: 30px;
                @include bg(23px 23px);
                background-image: url(i_check.png);
                &.on {
                  background-image: url(i_checked.png);
                }
              }
            }
            .left {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 1;
              .user {
                padding-bottom: 5px;
              }
              .address {
                text-align: justify;
              }
            }
            .right {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 0 0 100px;
              .tel {
                display: flex;
                justify-content: flex-end;
              }
              .handle {
                display: flex;
                justify-content: flex-end;
                .txt {
                  height: 30px;
                  line-height: 30px;
                }
                .icon {
                  width: 30px;
                  height: 30px;
                  @include bg(23px 23px);
                  background-image: url(i_edit.png);
                }
              }
            }
          }
          .trash {
            position: absolute;
            right: -50px;
            top: 0;
            width: 50px;
            height: 100%;
            @include bg(30px 30px);
            background-image: url(i_trash.png);
          }
        }
      }
    }
    .add-address {
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
    .del-mark {
      position: fixed;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background: rgba(236, 240, 243, .8);
      .alert {
        width: 298px;
        margin: auto;
        border-radius: $br20;
        overflow: hidden;
        .title {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 40px;
          background: $bgff;
          .icon-tip {
            width: 30px;
            height: 30px;
            @include bg;
            background-image: url(i_trash_icon.png);
          }
        }
        .cont {
          margin-top: 1px;
          padding-bottom: 10px;
          background: $bgff;
          .txt {
            line-height: 48px;
            text-align: center;
            padding-top: 12px;
            font-size: 13px;
            color: $fs31;
          }
          .btn {
            display: block;
            width: 272px;
            line-height: 48px;
            text-align: center;
            margin: 10px auto 0;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            &.btn-ok {
              color: $fs53;
            }
            &.btn-cancle {
              color: $fse5;
            }
          }
        }
      }
    }
  }
</style>
