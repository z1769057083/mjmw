<template>
  <div class="search-wrap">
    <header class="head-wrap">
      <a class="back pos" href="javascript:window.history.go(-1)"></a>
      <form action="" method="post" class="se_box">
        <input type="text" class="se_ch" placeholder="  输入商品名称" name="keyword">
        <i class="se_img"></i>
        <b class="se_font">搜索</b>
      </form>
      <a class="change" v-show="change" :class="{'change_2': show }" @click="change_img"></a>
      <a class="close" v-show="close"></a>
    </header>
    <!--有搜索结果-->
    <div class="con-wrap" ref="scroll_hook" v-show="change">
      <div>
        <!--title-->
        <div class="co_box">
          <ul class="co_nav">
            <li class="temp" :class="{ 'active': active == 0 }" @click="show_kind(0)">
              <i class="temp_img"></i>
              <span class="temp_font">综合排序</span>
            </li>
            <li class="temp" :class="{ 'active': active == 1 }" @click="show_kind(1)">
              <i class="temp_img"></i>
              <span class="temp_font">销量优先</span>
            </li>
            <li class="temp" :class="{ 'active': active == 2 }" @click="show_kind(2)">
              <i class="temp_img"></i>
              <span class="temp_font">精确筛选</span>
            </li>
          </ul>
          <ul class="co_layer" v-show="sort">
            <li class="lay_tem" :class="{ 'active': active_sort == 0 }" @click="sort_kind(0)">
              <span class="list">综合排序</span>
            </li>
            <li class="lay_tem" :class="{ 'active': active_sort == 1 }" @click="sort_kind(1)">
              <span class="list">从高到低</span>
            </li>
            <li class="lay_tem" :class="{ 'active': active_sort == 2 }" @click="sort_kind(2)">
              <span class="list">从低到高</span>
            </li>
            <li class="lay_tem" :class="{ 'active': active_sort == 3 }" @click="sort_kind(3)">
              <span class="list">信用排序</span>
            </li>
          </ul>
        </div>
        <!--精确筛选内容-->
        <div class="co_screen" v-show="deta_choo">
          <!--价格-->
          <div class="scr_tit">
            <p class="pr_le">
              <span class="pr_le_sp">价格</span>
              <input type="text" class="pr_numle">
              <span class="le_sp">至</span>
              <input type="text" class="pr_numri">
            </p>
            <p class="pr_ri">
              <span class="pr_ri_sp">品牌</span>
              <span class="pr_ri_a">
                <b class="ri_b">{{ arr.length ? arr[arr.length - 1] : '' }}</b>
                <i class="ri_i" @click="check_five"></i>
              </span>
            </p>
          </div>
          <!--多选内容区域-->
          <div class="check_mask" v-if="attr.length > 0">
            <div class="chexk_u">
              <i class="check_i">
                <span class="check_sp" v-for="x in attr">{{ x }}</span>
              </i>
              <b class="chek_empty" @click="empty">清空</b>
            </div>
          </div>
          <!--品牌按下显示-->
          <div class="co_down" v-show="brand">
            <ul class="co_sc_box">
              <li class="sc_temp" @click="changes('五粮液',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="五粮液">
                  <span class="tem_sp">五粮液</span>
                </div>
              </li>
              <li class="sc_temp" @click="changes('第六金',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="第六金">
                  <span class="tem_sp">第六金</span>
                </div>
              </li>
              <li class="sc_temp" @click="changes('瓶装桶装两箱',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="瓶装桶装两箱">
                  <span class="tem_sp">瓶装桶装两箱</span>
                </div>
              </li>
              <li class="sc_temp" @click="changes('来一桶',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="来一桶">
                  <span class="tem_sp">来一桶</span>
                </div>
              </li>
              <li class="sc_temp" @click="changes('二级',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="二级">
                  <span class="tem_sp">二级</span>
                </div>
              </li>
              <li class="sc_temp" @click="changes('三级',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="三级">
                  <span class="tem_sp">三级</span>
                </div>
              </li>
              <li class="sc_temp" @click="changes('nini',$event)">
                <div class="ay_pp">
                  <input type="checkbox" name="co_ap" class="tem_inp" value="nini">
                  <span class="tem_sp">nini</span>
                </div>
              </li>
            </ul>
          </div>
          <!--适用人群-->
          <div class="co_pe">
            <p class="co_pe_pp">
              <span class="pp_sp">适用人群</span>
              <span class="pe_sp">
                <b class="more">{{ phere }}</b>
                <i class="bott" @click="per_clik"></i>
              </span>
            </p>
          </div>
          <!--适用人群下面的选项-->
          <div class="co_pe_choose" v-show="per_cli">
            <ul class="choose_box">
              <li class="choose_temp" @click="chphone('所有人群')">
                <div class="person">
                  <input type="radio" name="co_pe" class="per_inp">
                  <span class="per_sp">所有人群</span>
                </div>
              </li>
              <li class="choose_temp" @click="chphone('儿童')">
                <div class="person">
                  <input type="radio" name="co_pe" class="per_inp">
                  <span class="per_sp">儿童</span>
                </div>
              </li>
              <li class="choose_temp" @click="chphone('普通人群')">
                <div class="person">
                  <input type="radio" name="co_pe" class="per_inp">
                  <span class="per_sp">普通人群</span>
                </div>
              </li>
            </ul>
          </div>
          <!--筛选-->
          <div class="ay_choose">
            <span class="choose_ch">筛选</span>
          </div>
        </div>
        <!--列表-->
        <div class="box">
          <ul :class="{ 'co_colum': colum,'co_row': row }">
            <li class="item">
              <div class="item-box">
                <div class="img-box">
                  <img class="img" src="http://placeholder.qiniudn.com/300x300" alt="">
                </div>
                <div class="img_right">
                  <div class="title">
                    <h2 class="name">蛋挞味冰凌</h2>
                  </div>
                  <h3 class="price"><span class="small">￥</span>30000.90</h3>
                  <h4 class="mj_price"><span class="border">可用<i class="ic_mj"></i>528.00</span></h4>
                </div>
              </div>
            </li>
            <li class="item">
              <div class="item-box">
                <div class="img-box">
                  <img class="img" src="http://placeholder.qiniudn.com/300x300" alt="">
                </div>
                <div class="img_right">
                  <div class="title">
                    <h2 class="name">蛋挞味冰凌</h2>
                  </div>
                  <h3 class="price"><span class="small">￥</span>30000.90</h3>
                  <h4 class="mj_price"><span class="border">可用<i class="ic_mj"></i>528.00</span></h4>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--无搜索结果-->
    <div class="ay_mask mask" v-show="close">
      <div class="ay_info_box">
        <h4 class="tips_title">
          <span class="tips_icon nores"></span>
        </h4>
        <div class="sub_info_box">
          <p class="last_tips_txt">抱歉，没有找到与"<span class="mess">{{message}}</span>"相关的商品。您可以换个词试试</p>
          <div class="item_btn">
            <a class="btn_a">确认</a>
          </div>
        </div>
      </div>
    </div>
    <!--弹层-->
    <div class="ay_mask" v-show="wrapp">
      <div class="ay_info_box">
        <h4 class="tips_title">
          <span class="tips_icon wrapp"></span>
        </h4>
        <div class="sub_info_box">
          <p class="last_tips_txt">搜索品牌不能超过5个</p>
          <div class="item_btn">
            <a class="btn_a" @click="wrapp = !wrapp ">关闭</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  export default{
    data() {
      return {
        url: api.url,
        show: false,
        active: 0,
        active_sort: -1,
        sort: true,
        brand: false,
        per_cli: false,
        deta_choo: false,
        colum: false,
        row: true,
        change: true,
        close: false,
        message: '空白',
        arr: [],
        phere: '所有人群',
        wrapp: false,
        attr: []
      };
    },
    methods: {
      empty() {
         this.arr = [];
         this.attr = [];
      },
      chphone(st) {
        this.phere = st;
      },
      changes(str, event) {
        var numb = this.arr.indexOf(str);
        if (numb > -1) {
          this.arr.splice(numb, 1);
        } else {
          this.arr.push(str);
        }
        console.log(this.arr.length);
        if (this.arr.length >= 6) {
          this.wrapp = true;
          this.arr.splice(numb, 1);
          event.target.checked = false;
        }
        this.attr = this.arr;
      },
      //   综合排序、销量优先、精确筛选
      show_kind(num) {
        this.active = num;
        if (this.active === 0) {
          this.sort = true;
          this.deta_choo = false;
        } else if (this.active === 2) {
          this.sort = false;
          this.deta_choo = true;
        } else {
          this.sort = false;
          this.deta_choo = false;
        }
        this._iscorll();
      },
      //   综合排序、从高到低、从低到高、信用排序选中状态
      sort_kind(num) {
        this.active_sort = num;
      },
      _iscorll() {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.scroll_hook, {
              click: true,
              probeType: 3
            });
            // 上拉加载
            this.scroll.on('touchend', (pos) => {
            });
            // 记录高度
            this.maxHeight = this.scroll.maxScrollY;
          } else {
            this.scroll.refresh();
            // 记录高度
            this.maxHeight = this.scroll.maxScrollY;
          }
        });
      },
      //   按下选择按钮
      check_five() {
        if (!this.brand) {
          this.brand = !this.brand;
        } else {
          this.brand = !this.brand;
        }
        this._iscorll();
      },
      //   按下适用人群按钮
      per_clik() {
        if (!this.per_cli) {
          this.per_cli = !this.per_cli;
        } else {
          this.per_cli = !this.per_cli;
        }
        this._iscorll();
      },
      //   colum与 row变换样式
      change_img() {
        if (this.show) {
          this.show = !this.show;
          this.colum = !this.colum;
          this.row = !this.row;
        } else {
          this.show = !this.show;
          this.colum = !this.colum;
          this.row = !this.row;
        }
        this._iscorll();
      },
      // 获取点击的文字
      licli(event) {
      }
    },
    mounted() {
      this._iscorll();
    },
    watch: {}
  };
</script>
<style scoped lang="scss">
  @import "../../common/scss/common";

  .search-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
    background: $bgec;
    .mask {
      bottom: 46px;
    }
    .mess {
      color: $fse5;
    }
    .wrapp {
      background-image: url("i_warp.png");
      background-size: contain;
    }
    .nores {
      background-image: url("i_nosearch.png");
      background-size: contain;
    }
    .back {
      background-image: url("i_left_arrow.png");
    }
    .change {
      @include bg(23px 23px);
      background-image: url("i_bomb.png");
      position: absolute;
      top: 50%;
      right: 13px;
      width: 30px;
      height: 30px;
      margin-top: -15px;
    }
    .close {
      @include bg(23px 23px);
      background-image: url("i_search_close.png");
      position: absolute;
      top: 50%;
      right: 13px;
      width: 30px;
      height: 30px;
      margin-top: -15px;
    }
    .change_2 {
      @include bg(23px 23px);
      background-image: url("i_sort.png");
    }
    .se_box {
      position: relative;
      top: 4px;
      height: 30px;
      border: 1px solid #e5e5e5;
      border-radius: $br15;
      display: flex;
      align-items: center;
      font-size: 13px;
      margin: 0 54px 0 50px;
      .se_img {
        position: absolute;
        top: 0px;
        left: 4px;
        width: 30px;
        height: 30px;
        @include bg(23px 23px);
        background-image: url(i_search.png);
      }
      .se_font {
        position: absolute;
        right: 7px;
        top: 0;
        color: $fse5;
        width: 30px;
        height: 30px;
        line-height: 31px;
        font-size: 12px;
        font-size: 12px;
      }
      .se_ch {
        width: 100%;
        margin: 9px 0 8px;
        padding: 0 45px 0 30px;
        box-sizing: border-box;
        height: 30px;
        background: none;
      }
    }
    .con-wrap {
      position: absolute;
      left: 5px;
      top: 46px;
      right: 5px;
      bottom: 0px;
      overflow: hidden;
    }
    .co_box {
      width: 100%;
      margin: 0 auto;
      border-radius: $br6;
      overflow: hidden;
    }
    .co_nav {
      display: flex;
      align-items: center;
      background: $bgff;
      width: 100%;
      height: 40px;
      .temp {
        width: 33.3%;
        display: flex;
        justify-content: center;
        align-items: center;
        .temp_img {
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
        }
        .temp_font {
          font-size: 13px;
          color: $fs53;
          height: 13px;
          margin-top: 3px;
          line-height: 13px;
        }
        &.active .temp_font {
          color: $fse5;
        }
        &:nth-of-type(1) .temp_img {
          background-image: url("i_com_sort.png");
        }
        &:nth-of-type(2) .temp_img {
          background-image: url("i_sale_preferred.png");
        }
        &:nth-of-type(3) .temp_img {
          background-image: url("i_precise_scr.png");
        }
        &:nth-of-type(1).active .temp_img {
          background-image: url("i_ac_com_sort.png");
        }
        &:nth-of-type(2).active .temp_img {
          background-image: url("i_ac_sale_preferred.png");
        }
        &:nth-of-type(3).active .temp_img {
          background-image: url("i_ac_precise_scr.png");
        }
      }
    }
    .co_layer {
      display: flex;
      background: $bgd1;
      height: 40px;
      .lay_tem {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25%;
        color: $fs95;
        font-size: 13px;
        text-align: center;
        .list {
          display: block;
          width: 68%;
          margin-top: 1px;
          height: 20px;
          line-height: 21px;
          background: $bgff;
          border-radius: $br24;
        }
      }
      .active .list {
        color: $fsff;
        background: $bge5;
      }
    }
    /*精确筛选内容*/
    .co_screen {
      width: 100%;
      margin: 0 auto;
      border-radius: $br6;
      overflow: hidden;
      margin-top: 5px;
    }
    /*价格*/
    .scr_tit {
      display: flex;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid $bdec;
      background-color: $bgff;
      .pr_le {
        width: 60%;
        text-align: center;
        font-size: 13px;
        color: $fs95;
        line-height: 40px;
        .pr_le_sp {
          padding-right: 4px;
        }
        .le_sp {
          font-size: 10px;
        }
        .pr_numle,
        .pr_numri {
          box-sizing: border-box;
          padding-left: 10px;
          color: $fs53;
          width: 28%;
          height: 30px;
          border: 1px solid $bgec;
          border-radius: $br24;
        }
      }
      .pr_ri {
        width: 40%;
        text-align: left;
        font-size: 13px;
        color: $fs95;
        line-height: 40px;
        .pr_ri_sp {
          padding-right: 8px;
        }
        .pr_ri_a {
          vertical-align: middle;
          text-align: left;
          display: inline-block;
          position: relative;
          top: -1px;
          width: 58%;
          color: $fs31;
          height: 30px;
          line-height: 30px;
          border: 1px solid $bgec;
          border-radius: $br24;
          .ri_b {
            width: 75%;
            text-align: center;
            display: inline-block;
            margin-top: 1px;
            font-size: 12px;
            @extend .dot;
            padding: 0 3px;
            box-sizing: border-box;
          }
          .ri_i {
            position: absolute;
            top: 3px;
            right: 3px;
            width: 25px;
            height: 25px;
            @include bg(23px 23px);
            background-image: url(i_bottom.png);
          }
        }
      }
    }
    /*选中多选的内容区域*/
    .check_mask {
      background: $bgff;
      border-bottom: 1px solid $bgec;
      .chexk_u {
        padding: 10px 10px 5px;
        .check_i {
          display: inline-block;
        }
        .check_sp {
          padding: 0 5px;
          display: inline-block;
          border: 1px solid $bgec;
          border-radius: $br15;
          font-size: 12px;
          color: $fs31;
          height: 20px;
          line-height: 21px;
          margin-right: 3px;
          margin-bottom: 5px;
        }
        .chek_empty {
          padding: 0 5px;
          display: inline-block;
          border: 1px solid $bgec;
          border-radius: $br15;
          font-size: 12px;
          color: $fsff;
          height: 20px;
          line-height: 21px;
          background: $bge5;
        }
      }
    }
    /*品牌按下显示*/
    .co_down {
      background: $bgd1;
      padding: 5px 0 10px;
      .co_sc_box {
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        margin: 0 auto;
        padding-left: 1%;
      }
      .sc_temp {
        text-align: center;
        width: 25%;
        height: 20px;
        line-height: 20px;
        border-radius: $br15;
        background: $bgff;
        color: $fs95;
        margin: 5px 4% 0;
        .tem_inp {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        .tem_inp:checked + .tem_sp {
          color: $fse5;
        }
        .ay_pp {
          position: relative;
          display: block;
          width: 100%;
          height: inherit;
          @extend .dot;
          padding: 0 5px;
          box-sizing: border-box;
          .tem_sp {
            font-size: 13px;
          }
        }
      }
    }
    /*适用人群*/
    .co_pe {
      width: 100%;
      height: 40px;
      background: $bgff;
      padding-left: 5%;
      box-sizing: border-box;
      border-bottom: 1px solid $bgec;
      .co_pe_pp {
        position: relative;
        width: 100%;
        height: inherit;
        line-height: 40px;
        font-size: 13px;
        color: $fs95;
        .pp_sp {
          padding-right: 8px;
        }
        .pe_sp {
          display: inline-block;
          width: 90px;
          height: 30px;
          line-height: 30px;
          position: relative;
          color: $fs31;
          border: 1px solid $bgec;
          border-radius: $br15;
          .more {
            display: inline-block;
            margin-top: 1px;
            width: 70px;
            text-align: center;
            font-size: 12px;
          }
          .bott {
            position: absolute;
            top: 3px;
            right: 3px;
            width: 25px;
            height: 25px;
            @include bg(23px 23px);
            background-image: url(i_bottom.png);
          }
        }
      }
    }
    /*适用人群按下*/
    .co_pe_choose {
      background: $bgd1;
      padding: 5px 0 10px;
      .choose_box {
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        padding-left: 1%;
        margin: 0 auto;
        .choose_temp {
          text-align: center;
          width: 25%;
          height: 20px;
          line-height: 20px;
          border-radius: $br15;
          background: $bgff;
          color: $fs95;
          margin: 5px 4% 0;
          .per_inp {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            &:checked + .per_sp {
              color: $fse5;
            }
          }
          .person {
            position: relative;
            display: block;
            width: 100%;
            height: inherit;
            .per_sp {
              font-size: 13px;
            }
          }
        }
      }
    }
    /*筛选*/
    .ay_choose {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: $bgff;
      text-align: center;
      .choose_ch {
        display: inline-block;
        width: 25%;
        height: 20px;
        line-height: 21px;
        background: $bge5;
        border-radius: $br15;
        color: $fsff;
        font-size: 13px;
      }
    }
    .box {
      border-radius: 6px;
      overflow: hidden;
      margin-top: 5px;
    }
    .co_row {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      overflow: hidden;
      .item {
        flex: 0 0 33.3%;
        width: 33.3%;
        margin-top: 1px;
        box-sizing: border-box;
        .item-box {
          padding: 5px;
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
              width: 70px;
              height: 70px;
              line-height: 70px;
              text-align: center;
              margin: auto;
              font-size: 12px;
              color: $bgff;
              border-radius: 50%;
              background: rgba(229, 0, 79, .8);
            }
          }
          .title {
            line-height: 15px;
            padding-top: 3px;
            color: $fs43;
            .name {
              font-size: 13px;
              @extend .dot;
            }
          }
          .price {
            margin: 5px 0 3px;
            line-height: 16px;
            font-size: 15px;
            color: $fse5;
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
      }
    }
    .co_colum {
      width: 100%;
      overflow: hidden;
      .item {
        width: 100%;
        margin-top: 1px;
        box-sizing: border-box;
        .item-box {
          display: flex;
          padding: 5px;
          margin-left: 1px;
          background: $bgff;
          .img-box {
            position: relative;
            width: 80px;
            height: 80px;
            img {
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
      }
    }
  }
</style>
