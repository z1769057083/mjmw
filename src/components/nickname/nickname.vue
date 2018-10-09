<template>
  <div class="nick-wrap">
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">个人信息</p>
    </header>
    <div class="nick_con">
      <div class="con_box">
        <!--头像-->
        <div class="head_port" @click="beginUsePic">
          <span class="port_le">我的头像</span>
          <div class="port_cen">
            <div class="cen_img">
              <img :src="fingerImage" class="tip_top" alt="">
            </div>
          </div>
          <a href="javascript:;" class="port_ri">修改</a>
        </div>
        <!--昵称-->
        <div class="nick">
          <span class="nick_le">昵称</span>
          <p class="nick_cen" v-show="has_show">{{message}}</p>
          <input type="text" maxlength="20" name="nick_name" class="nick_cen" v-model="message" @blur="changeCount()"
                 v-show="inp_show">
          <p class="nick_ri" @click="exchange">修改</p>
        </div>
        <!--手机绑定-->
        <!--<div class="phone_bind">-->
          <!--<span class="bind_le">手机绑定</span>-->
          <!--<p class="bind_cen">{{pro.mobile}}</p>-->
          <!--<a href="javascript:;" class="bind_ri">-->
            <!--<i></i>-->
          <!--</a>-->
        <!--</div>-->
      </div>
    </div>
    <!--弹框-->
    <div class="ay_mask" v-show="cik_wran">
      <div class="ay_info_box">
        <h4 class="tips_title">
          <span class="tips_icon phone_warn"></span>
        </h4>
        <div class="sub_info_box">
          <p class="last_tips_txt">昵称限制在4-20个字符不能有非法字符</p>
          <div class="item_btn">
            <a class="btn_a" @click="cik_wran = false">关闭</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '../../api';
  import qs from 'qs';

  export default {
    data() {
      return {
        warning: false,
        tips: '',
        has_show: true,
        inp_show: false,
        message: '昵称',
        cik_wran: false,
        pro: [],
        fingerImage: ''
      };
    },
    methods: {
      // 点击修改昵称
      exchange() {
        this.has_show = false;
        this.inp_show = true;
        this.message = '';
      },
      // 修改昵称接口
      chagnickname() {
        this.$http.post(api.changeNickName, qs.stringify({nickname: this.message})).then(res => {
          if (res.data.err_code == 200) {
//            console.log('修改昵称成功');
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      changeCount() {
        let nic = /^[\u4e00-\u9fff\w-]{4,20}$/;
        if (!nic.test(this.message)) {
          this.cik_wran = true;
        } else {
          this.inp_show = false;
          this.has_show = true;
          this.cik_wran = false;
          this.chagnickname();
        }
      },
      _indexAjax() {
        this.$http.post(api.proFile).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.pro = res.profile;
            this.fingerImage = res.profile.photo_img_url;
            if (this.pro.nickname !== '') {
              this.message = this.pro.nickname;
            }
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 修改图片
      beginUsePic() {
        let _this = this;
        _this.$wechat.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success(res) {
            let localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            _this.$wechat.uploadImage({
              localId: localId,
              isShowProgressTips: 1,
              success(res) {
                let serverId = res.serverId; // 返回的是字符串
                _this.$http.post(api.upLoadHeadIcon, qs.stringify({
                  serverId: serverId
                })).then((res) => {
                  console.log(res, 678);
                  res = res.data;
                  if (res.err_code == 200) {
                    _this._indexAjax();
                  } else {
                    console.log('数据错误');
                  }
                }).catch(() => {
                  console.log('网络错误');
                });
              }
            });
          }
        });
      }
    },
    mounted() {
      this._indexAjax();
      this.$http.post(api.wx, qs.stringify({
        url: api.wxUrl
      })).then((res) => {
        res = res.data;
        this.$wechat.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: res.appId, // 必填，公众号的唯一标识
          timestamp: res.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.nonceStr, // 必填，生成签名的随机串
          signature: res.signature, // 必填，签名，见附录1
          jsApiList: ['checkJsApi',
            'chooseImage',
            'previewImage',
            'uploadImage',
            'downloadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
      }).catch(() => {
        console.log('网络错误');
      });
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .nick-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgec;
    /*弹框*/
    .ay_mask {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      left: 0;
      top: 41px;
      right: 0;
      bottom: 0;
      z-index: 10;
      background: rgba(238, 242, 245, 0.8);
      .ay_info_box {
        width: 298px;
        padding-bottom: 10px;
        border-radius: $br24;
        overflow: hidden;
        background: $bgff;
        .tips_title {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid $bdec;
          position: relative;
          .tips_icon {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-left: -15px;
            margin-top: -15px;
          }
          .tips_close {
            position: absolute;
            right: 5px;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-top: -15px;
          }
        }
        .sub_info_box {
          width: 274px;
          margin: 0 auto;
          .last_tips_txt {
            padding: 20px 15px 10px;
            line-height: 1.5;
            text-align: center;
            font-size: 13px;
            color: $fs31;
          }
          .item_btn {
            height: 48px;
            margin-top: 10px;
            border: 1px solid $bdec;
            border-radius: $br24;
            overflow: hidden;
            position: relative;
            .btn_a {
              display: block;
              width: 100%;
              height: 100%;
              line-height: 48px;
              text-align: center;
              font-size: 13px;
              color: $fse5;
            }
          }
        }
      }
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
    .nick_con {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
    }
    .con_box {
      padding: 5px;
    }
    /*头像部分*/
    .head_port {
      display: flex;
      align-items: center;
      width: 100%;
      height: 80px;
      background: $bgff;
      border-radius: $br6;
      .port_le {
        width: 20%;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        flex-shrink: 0;
        font-size: 13px;
        color: $fs31;
        padding-left: 13px;
      }
      .port_cen {
        flex-shrink: 0;
        flex-grow: 1;
        .cen_img {
          margin: 0 auto;
          width: 60px;
          height: 60px;
          border-radius: 100%;
          overflow: hidden;
          background: url("./i_avatar.png") no-repeat center;
          background-size: contain;
          .tip_top {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }
      }
      .port_ri {
        text-align: right;
        width: 20%;
        height: 30px;
        line-height: 30px;
        padding-right: 11px;
        box-sizing: border-box;
        flex-shrink: 0;
        font-size: 13px;
        color: $fs95;
      }
    }
    /*昵称部分*/
    .nick {
      display: flex;
      align-items: center;
      height: 40px;
      background: $bgff;
      border-radius: $br6;
      margin-top: 5px;
      .nick_le {
        width: 14%;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        flex-shrink: 0;
        font-size: 13px;
        color: $fs31;
        padding-left: 13px;
      }
      .nick_cen {
        color: $fse5;
        flex-grow: 1;
        text-align: center;
        word-break: break-all;
        max-width: 70%;
        font-size: 13px;
      }
      .nick_ri {
        text-align: right;
        width: 16%;
        height: 30px;
        line-height: 30px;
        padding-right: 10px;
        box-sizing: border-box;
        flex-shrink: 0;
        font-size: 13px;
        color: $fs95;
      }
    }
    /*手机绑定*/
    .phone_bind {
      display: flex;
      align-items: center;
      height: 40px;
      background: $bgff;
      border-radius: $br6;
      margin-top: 5px;
      .bind_le {
        width: 20%;
        height: 30px;
        line-height: 30px;
        box-sizing: border-box;
        flex-shrink: 0;
        font-size: 13px;
        color: $fs31;
        padding-left: 13px;
      }
      .bind_cen {
        color: $fse5;
        text-align: center;
        flex-shrink: 0;
        flex-grow: 1;
        font-size: 13px;
      }
      .bind_ri {
        width: 20%;
        height: 30px;
        flex-shrink: 0;
        text-align: right;
        position: relative;
        i {
          position: absolute;
          right: 0;
          top: 0;
          height: 30px;
          width: 30px;
          background: url(i_left.png) no-repeat center;
          background-size: 23px 23px;
        }
      }
    }
    .phone_warn {
      @include bg(30px 30px);
      background-image: url("i_warp.png");
    }
  }
</style>
