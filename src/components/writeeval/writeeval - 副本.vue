<template>
  <div class="feed-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="rece_rele = true"></a>
      <p class="txt">评价中心</p>
    </header>
    <div class="cont-wrap" @click="lostBlur">
      <div class="feed-cont" ref="page_hook">
        <div>
          <!-- 暂无评价 -->
          <div class="alertt" v-show="noeval">
            <div class="title">
              <span class="icon"></span>
            </div>
            <div class="cont">
              <p class="txt">您还没有待评价商品</p>
              <a class="btn">返回</a>
            </div>
          </div>
          <!-- 列表 -->
          <!--循环列表-->
          <div class="ord_lsit">
            <dl class="main_lsit" v-show="evall">
              <dd v-for="(item, index) in stars" class="temp">
                <div class="item_box">
                  <div class="img_box">
                    <img class="img" :src="url + item.item_img_thumb"
                         onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'"
                         :alt="item.item_name">
                  </div>
                  <div class="img_right">
                    <div class="title">
                      <h2 class="name">{{ item.item_name }}</h2>
                    </div>
                    <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                    <h3 class="price">
                      <span class="small">￥</span>{{ item.price }}
                    </h3>
                  </div>
                  <div class="img_num">
                    <span class="num_sp">X {{ item.item_num }}</span>
                    <ul class="ev_x">
                      <li class="wr_star" :class="{ active: index < sign }" v-for="(item, index) in star"
                          @click="star_acv(index)"></li>
                    </ul>
                  </div>
                </div>
                <div class="row_writer">
                  <textarea class="tex_ev" name="" rows="4" maxlength="100" placeholder="文字长度在10—100字之间，写下您在购物过程中的体会。"
                            v-model="text" ref="inpso"
                            @click.stop="getFocus"></textarea>
                  <span class="textnu">{{100 - text.length}}</span>
                </div>
                <!--图片盒子-->
                <div class="pic" ref="pic_hook" v-show="seen_flag">
                  <ul class="img-list">
                    <li class="item" v-for="(item, index) in attr">
                      <img class="img" :src="item" alt="">
                    </li>
                  </ul>
                </div>
                <div class="item_star">
                  <div class="aga_left">
                    <div class="left_in" :class="{active : atc - 1}" @click="chec()">
                      <!--<div class="left_in" :class="{active : comment.show_name ? comment.show_name * 1 : -1}" @click="chec()">-->
                      <span class="insp"></span>
                    </div>
                    <span class="ri">匿名评价</span>
                  </div>
                  <a class="btnn ec53" v-if="seen_flag" @click="modifyImg">修改图片</a>
                  <a class="btnn ec53" v-else @click="rece_good = true">晒单传图</a>
                  <a class="btnn" @click="submit">提交</a>
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
    <!--上传图片提示框-->
    <div class="long_img" v-show="rece_good">
      <div class="limg_box">
        <h4 class="ti_title">
          <span class="ti_icon"></span>
          <i class="i_close" @click="rece_good = false"></i>
        </h4>
        <div class="infi_box">
          <p class="last_goods">最多上传五张照片</p>
          <div class="item_btn">
            <a class="btn_sy" @click="photo">相册</a>
          </div>
          <div class="item_btn">
            <a class="btn_sy fo53" @click="rece_good = false">取消</a>
          </div>
        </div>
      </div>
    </div>
    <!--尚未发布此评论-->
    <div class="norele" v-show="rece_rele">
      <div class="rele_box">
        <h4 class="tle">
          <span class="tle_icon"></span>
          <i class="tle_close" @click="rece_rele = false"></i>
        </h4>
        <div class="more_box">
          <p class="more_goods">您尚未发布此评论<br/>是否对已编辑内容进行保存</p>
          <div class="more_btn">
            <a class="more_sy fo53" href="javascript:window.history.go(-1)">不保存</a>
          </div>
          <div class="more_btn">
            <a class="more_sy" @click="preser">保存</a>
          </div>
        </div>
      </div>
    </div>
    <!--成功弹出框-->
    <vtoasts v-show="succ">
      <div slot="txt" class="txt">{{ title }}</div>
      <div slot="btn" class="btn" @click="back">返回</div>
    </vtoasts>
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{ tips }}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
    </vtoastw>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import qs from 'qs';
  import wx from 'weixin-js-sdk';
  import {getStyle} from '../../common/js/util';
  const STAR_NUM = 5;

  export default {
    data() {
      return {
        title: '',
        warning: false,
        tips: '',
        url: api.url,
        item_id: '',
        order_id: '',
        noeval: false,
        evall: true,
        seen_flag: false,
        rece_good: false,
        rece_rele: false,
        text: '',
        star: STAR_NUM,
        sign: -1,
        atc: 0,
        succ: false,
        stars: [],
        comment: [],
        images: '',
        attr: []
      };
    },
    methods: {
      // 返回
      back() {
        this.succ = false;
        this.$router.replace({name: 'myOrder', query: {type: 0}});
      },
      // input失焦
      lostBlur() {
        this.$refs.inpso[0].blur();
      },
      // 得到焦点
      getFocus() {
        this.$refs.inpso[0].focus();
      },
      // 点击修改图片
      modifyImg() {
        this.attr = [];
        this.rece_good = true;
        this.seen_flag = false;
      },
      // 点击相册
      photo() {
        this.rece_good = false;
        // 上传图片
        let _this = this;
        wx.chooseImage({
          count: 1, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
          success: function (res) {
            console.log(res, 111);
            let localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(localIds, 666);
            for (let i = 0; i < localIds.length; i++) {
              wx.uploadImage({
                localId: localIds[i], // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                  _this.attr.push(localIds[i]);
                  console.log(_this.attr);
                  if (_this.attr.length > 0) {
                    _this.seen_flag = true;
                  }
//                  let serverId = res.serverId; // 返回图片的服务器端ID
                }
              });
            }
          }
        });
      },
      // 评价星等级
      star_acv(index) {
        this.sign = index + 1;
      },
      // 是否匿名
      chec() {
        if (this.atc === 0) {
          this.atc = 1;
        } else {
          this.atc = 0;
        }
      },
      // 初始化横向滚动
      _scroll() {
        this.$nextTick(() => {
          let pics = this.$refs.pic_hook;
          for (var i = 0; i < 1; i++) {
            let oUl = pics[i].children[0];
            let oLi = oUl.children[0];
            oUl.style.width = (getStyle(oLi, 'width') + 10) * oUl.children.length + 'px';
            if (!this['_scroll' + i]) {
              this['_scroll' + i] = new BScroll(this.$refs.pic_hook[i], {
                scrollX: true
              });
            } else {
              this['_scroll' + i].refresh();
            }
          }
        });
      },
      // 初始化页面滚动
      _initScroll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.page_hook, {
              click: true
            });
          } else {
            this.scroll.refresh();
          }
        });
      },
      // 调取评论中心待评价的商品
      _waiteval() {
        this.$http.post(api.commentCenter, qs.stringify({
          flag: this.act,
          count: 10,
          order_id: this.order_id
        })).then(res => {
          if (res.data.err_code === 200) {
            res = res.data.data;
            this.stars = res.items;
          } else {
            console.log('数据加载失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 查看未保存评论接口
      _indexAjax() {
        // 查看未保存评论接口
        this.$http.post(api.saveCommentData, qs.stringify({
          order_id: this.order_id,
          item_id: this.item_id
        })).then(res => {
          console.log(res, 888);
          if (res.data.err_code === 200) {
            res = res.data.data;
            console.log(res);
            if (res.comment.length == 0) {
            } else {
              this.comment = res.comment;
              this.star_acv(this.comment.rate - 1);
              this.text = this.comment.comment;
              this.atc = this.comment.show_name * 1;
            }
          } else {
            console.log('数据请求失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 添加商品评价接口
      _addGoods(flag) {
        this.$http(api.addComment, qs.stringify({
          order_id: this.order_id,
          item_id: this.item_id,
          rate: this.sign,
          comment: this.text,
          show_name: this.atc,
          'pic[]': this.attr[0] || '',
          flag: flag // 0 : 保存 1: 提交
        })).then(res => {
          console.log(res);
          if (res.data.err_code === 200) {
            if (flag == 0) {
              this.succ = true;
              this.title = '保存成功';
            } else if (flag == 1) {
              this.succ = true;
              this.title = '提交成功';
            }
          } else {
            console.log('失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 点击保存按钮
      preser() {
        if (this.sign !== 0 && this.text !== '') {
          this._addGoods('0');
        } else {
          this.rece_rele = false;
          this.warning = true;
          this.tips = '您的评论还没有填写完整';
        }
      },
      // 点击提交
      submit() {
        if (this.sign !== 0 && this.text !== '') {
          this._addGoods('1');
        } else {
          this.warning = true;
          this.tips = '您的评论还没有填写完整';
        }
      }
    },
    created() {
      this.$http.post(api.wx, qs.stringify({
        url: window.location.href
      })).then((res) => {
        res = res.data;
        wx.config({
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
    },
    mounted() {
      this.item_id = this.$route.query.item_id;
      this.order_id = this.$route.query.order_id;
      this._waiteval();
      this._indexAjax();
      this._initScroll();
    },
    watch: {
      seen_flag: function (val, oldVal) {
        this._initScroll();
        this._scroll();
      },
      attr: {
        handler(val, oldVal) {
          this._initScroll();
          this._scroll();
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .feed-wrap {
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
    .cont-wrap {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      .feed-cont {
        position: absolute;
        left: 0;
        top: 5px;
        right: 0;
        bottom: 0;
        overflow: hidden;
        .ord_lsit {
          .main_lsit {
            margin: 0 5px;
            overflow: hidden;
            .temp {
              width: 100%;
              background-color: $bgff;
              border-radius: 6px;
              margin-bottom: 5px;
              overflow: hidden;
              .item_box {
                display: flex;
                padding: 5px;
                margin-left: 1px;
                background: $bgff;
                .img_box {
                  position: relative;
                  width: 80px;
                  height: 80px;
                  border: 1px solid $bdec;
                  border-radius: $br6;
                  overflow: hidden;
                  .img {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                  }
                  .tips-txt {
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 50px;
                    height: 50px;
                    line-height: 50px;
                    text-align: center;
                    margin: auto;
                    font-size: 12px;
                    color: $bgff;
                    border-radius: 50%;
                    background: rgba(229, 0, 79, .8);
                  }
                }
                .img_right {
                  margin-left: 5px;
                  width: 50%;
                }
                .img_num {
                  display: flex;
                  align-items: center;
                  position: relative;
                  width: 20%;
                  .num_sp {
                    position: absolute;
                    color: $fs95;
                    right: 3px;
                    font-size: 10px;
                    top: 40%;
                  }
                  .ev_x {
                    position: absolute;
                    bottom: 2px;
                    right: 3px;
                    display: flex;
                    .wr_star {
                      width: 25px;
                      height: 25px;
                      @include bg(23px 23px);
                      background-image: url("i_evgstar.png");
                      &.active {
                        @include bg(23px 23px);
                        background-image: url("i_evstar.png");
                      }
                    }
                  }
                }
                .title {
                  display: flex;
                  align-items: center;
                  height: 40px;
                  padding-left: 3px;
                  overflow: hidden;
                  .name {
                    display: -webkit-box;
                    line-height: 15px;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    word-break: break-all;
                    font-size: 13px;
                    color: $fs43;
                    overflow: hidden;
                  }
                }
                .price {
                  line-height: 16px;
                  font-size: 15px;
                  color: $fse5;
                  margin: 3px 0 2px;
                  .small {
                    font-size: 12px;
                  }
                }
                .mj_price {
                  height: 16px;
                  .border {
                    margin-left: 0;
                  }
                }
              }
              .row_writer {
                position: relative;
                background: $bgff;
                padding: 5px 10px;
                border-bottom: 1px solid $bgec;
                text-align: justify;
                color: $fs95;
                line-height: 20px;
                font-size: 10px;
                .tex_ev {
                  display: block;
                  padding: 8px;
                  width: 100%;
                  border-radius: $br6;
                  box-sizing: border-box;
                  border: 1px solid $bgec;
                  font-size: 10px;
                }
                .textnu {
                  color: $fsff;
                  background-color: $bge5;
                  border-radius: $br15;
                  padding: 2px 5px 0;
                  position: absolute;
                  bottom: 10px;
                  line-height: 12px;
                  right: 20px;
                }
              }
              .item_star {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                height: 40px;
                border-top: 1px solid $bdec;
                .aga_left {
                  flex-grow: 1;
                  display: flex;
                  align-items: center;
                  .left_in {
                    width: 30px;
                    height: 30px;
                    margin: 0 5px;
                    position: relative;
                    .insp {
                      display: block;
                      width: inherit;
                      height: inherit;
                      background: url(i_check.png) no-repeat center;
                      background-size: 23px 23px;
                    }
                  }
                  .active .insp {
                    background: url(i_checked.png) no-repeat center;
                    background-size: 23px 23px;
                  }
                  .ri {
                    font-size: 13px;
                    color: $fs95;
                  }
                }
                .btnn {
                  display: block;
                  width: 78px;
                  height: 20px;
                  line-height: 19px;
                  text-align: center;
                  box-sizing: border-box;
                  font-size: 13px;
                  color: $fse5;
                  border: 1px solid $bdf8;
                  border-radius: $br15;
                  margin-right: 8px;
                }
                .ec53 {
                  color: $fs53;
                  border-color: $bdec;
                }
              }
              .pic {
                margin-top: 1px;
                padding: 5px 0;
                overflow: hidden;
                background: $bgff;
                .img-list {
                  white-space: nowrap;
                  font-size: 0;
                  .item {
                    display: inline-block;
                    width: 80px;
                    height: 80px;
                    margin-left: 10px;
                    border-radius: $br6;
                    overflow: hidden;
                    .img {
                      width: 100%;
                      height: 100%;
                    }
                  }
                }
              }
            }
          }
        }
        .alertt {
          width: 298px;
          margin: 160px auto 0;
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
              background-image: url(i_comment_sucess.png);
            }
          }
          .cont {
            height: 129px;
            font-size: 13px;
            text-align: center;
            margin-top: 1px;
            background: $bgff;
            .txt {
              line-height: 69px;
              color: $fs31;
            }
            .btn {
              display: block;
              width: 274px;
              height: 48px;
              margin: 0 auto;
              line-height: 48px;
              color: $fse5;
              border: 1px solid $bddc;
              border-radius: $br50;
            }
          }
        }
      }
    }
    /*上传图片提示框*/
    .long_img {
      position: fixed;
      left: 0;
      top: 40px;
      z-index: 9;
      width: 100%;
      height: 100%;
      background: rgba(236, 240, 243, 0.6);
      .limg_box {
        width: 298px;
        margin: 160px auto 0;
        padding-bottom: 10px;
        border-radius: $br20;
        overflow: hidden;
        background: $bgff;
        .ti_title {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid $bgec;
          position: relative;
          .ti_icon {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-left: -15px;
            margin-top: -15px;
            background: url(i_mass.png) no-repeat;
            background-size: contain;
          }
          .i_close {
            position: absolute;
            right: 5px;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-top: -15px;
            @include bg(24px 24px);
            background-image: url("i_close.png");
          }
        }
        .infi_box {
          width: 274px;
          margin: 0 auto;
          .last_goods {
            padding: 20px 15px 10px;
            line-height: 1.5;
            text-align: center;
            font-size: 13px;
            color: $fs95;
          }
        }
        .item_btn {
          height: 48px;
          margin-top: 10px;
          border: 1px solid $bgec;
          border-radius: $br50;
          overflow: hidden;
          position: relative;
          .btn_sy {
            display: block;
            width: 100%;
            height: 100%;
            line-height: 48px;
            text-align: center;
            font-size: 13px;
            color: $fse5;
          }
          .fo53 {
            color: $fs53;
          }
        }
      }
    }
    /*尚未发布此评论弹出框*/
    .norele {
      position: fixed;
      left: 0;
      top: 40px;
      /*z-index: 5;*/
      width: 100%;
      height: 100%;
      background: rgba(236, 240, 243, 0.6);
      .rele_box {
        width: 298px;
        margin: 160px auto 0;
        padding-bottom: 10px;
        border-radius: $br20;
        overflow: hidden;
        background: $bgff;
        .tle {
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid $bgec;
          position: relative;
          .tle_icon {
            position: absolute;
            left: 50%;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-left: -15px;
            margin-top: -15px;
            background: url(i_file.png) no-repeat;
            background-size: contain;
          }
          .tle_close {
            position: absolute;
            right: 5px;
            top: 50%;
            width: 30px;
            height: 30px;
            margin-top: -15px;
            @include bg(24px 24px);
            background-image: url("i_close.png");
          }
        }
        .more_box {
          width: 274px;
          margin: 0 auto;
          .more_goods {
            padding: 20px 15px 10px;
            line-height: 1.5;
            text-align: center;
            font-size: 13px;
            color: $fs95;
          }
        }
        .more_btn {
          height: 48px;
          margin-top: 10px;
          border: 1px solid $bgec;
          border-radius: $br50;
          overflow: hidden;
          position: relative;
          .more_sy {
            display: block;
            width: 100%;
            height: 100%;
            line-height: 48px;
            text-align: center;
            font-size: 13px;
            color: $fse5;
          }
          .fo53 {
            color: $fs53;
          }
        }
      }
    }
  }
</style>

