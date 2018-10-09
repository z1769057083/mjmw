<template>
  <div class="search-wrap" ref="wrap">
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <div class="se_box">
        <input type="text" class="se_ch" placeholder="  输入商品名称" name="keyword" v-model="words" ref="inpso">
        <i class="se_img" @click="sear"></i>
        <b class="se_font" @click="sear">搜索</b>
      </div>
      <a class="change" v-show="change" :class="{'change_2': show}" @click="change_img"></a>
      <a class="close" v-show="close" @click="cliclose"></a>
    </header>
    <!--有搜索结果-->
    <div class="con-wrap" ref="scroll_hook" v-show="change">
      <div>
        <!--title-->
        <div class="co_box">
          <ul class="co_nav">
            <li class="temp" :class="{'active': active == 0}" @click.stop="show_kind(0)">
              <i class="temp_img"></i>
              <span class="temp_font">综合排序</span>
            </li>
            <li class="temp" :class="{'active': active == 1}" @click.stop="show_kind(1, 'sales')">
              <i class="temp_img"></i>
              <span class="temp_font">销量优先</span>
            </li>
            <li class="temp" :class="{'active': active == 2}" @click.stop="show_kind(2)">
              <i class="temp_img"></i>
              <span class="temp_font">精确筛选</span>
            </li>
          </ul>
          <ul class="co_layer" v-show="sort">
            <li class="lay_tem" :class="{'active': active_sort == 0}" @click.stop="sort_kind(0)">
              <span class="list">综合排序</span>
            </li>
            <li class="lay_tem" :class="{'active': active_sort == 1}" @click.stop="sort_kind(1,'down')">
              <span class="list">从高到低</span>
            </li>
            <li class="lay_tem" :class="{'active': active_sort == 2}" @click.stop="sort_kind(2,'up')">
              <span class="list">从低到高</span>
            </li>
            <li class="lay_tem" :class="{'active': active_sort == 3}" @click.stop="sort_kind(3)">
              <span class="list">信用排序</span>
            </li>
          </ul>
        </div>
        <!--精确筛选内容-->
        <div class="co_screen" v-show="deta_choo && brandlist.length">
          <!--价格-->
          <div class="scr_tit">
            <p class="pr_le">
              <span class="pr_le_sp">价格</span>
              <span class="pr_numle">
                <input type="text" class="input" v-model="minnum" ref="inpmin">
              </span>
              <span class="le_sp">至</span>
              <span class="pr_numri">
                <input type="text" class="input" v-model="maxnum" ref="inpmax">
              </span>
            </p>
            <p class="pr_ri">
              <span class="pr_ri_sp">品牌</span>
              <span class="pr_ri_a" @click.stop="check_five">
                <b class="ri_b">{{arr.length ? arr[arr.length - 1] : ''}}</b>
                <i class="ri_i"></i>
              </span>
            </p>
          </div>
          <!--多选内容区域-->
          <div class="check_mask" v-if="attr.length > 0">
            <div class="chexk_u">
              <i class="check_i">
                <span class="check_sp" v-for="x in attr">{{x}}</span>
              </i>
              <b class="chek_empty" @click.stop="empty">清空</b>
            </div>
          </div>
          <!--品牌按下显示-->
          <div class="co_down" v-show="brand">
            <ul class="co_sc_box">
              <li class="sc_temp" v-for="(item, index) in brandlist" :class="{active: arr.indexOf(item.brand) > -1 }"
                  @click.stop="changes(item.brand, item.brand_id)">
                <div class="ay_pp">
                  <span class="tem_sp">{{item.brand}}</span>
                </div>
              </li>
            </ul>
          </div>
          <!--适用人群-->
          <div class="co_pe">
            <p class="co_pe_pp">
              <span class="pp_sp">适用人群</span>
              <span class="pe_sp">
                <b class="more">{{phere}}</b>
                <i class="bott" @click.stop="per_clik"></i>
              </span>
            </p>
          </div>
          <!--适用人群下面的选项-->
          <div class="co_pe_choose" v-show="per_cli">
            <ul class="choose_box">
              <li class="choose_temp" :class="{'active': act == 0}" @click.stop="chphone('所有人群',0)">
                <div class="person">
                  <span class="per_sp">所有人群</span>
                </div>
              </li>
              <li class="choose_temp" :class="{'active': act == 1}" @click.stop="chphone('儿童',1)">
                <div class="person">
                  <span class="per_sp">儿童</span>
                </div>
              </li>
              <li class="choose_temp" :class="{'active': act == 2}" @click.stop="chphone('普通人群',2)">
                <div class="person">
                  <span class="per_sp">普通人群</span>
                </div>
              </li>
            </ul>
          </div>
          <!--筛选-->
          <div class="ay_choose">
            <span class="choose_ch" @click.stop="screen">筛选</span>
          </div>
        </div>
        <!--列表-->
        <div class="box" v-show="list">
          <ul :class="{'co_colum': colum,'co_row': row}">
            <li class="item" v-for="(item, index) in listem">
              <router-link
                :to="item.part_of_id > 0 ? { name: 'suit', query: { itemid: item.part_of_id } } : { name: 'goods', query: { itemid: item.item_id } }"
                tag="div" class="item-box">
                <div class="img-box">
                  <img class="img" v-lazy="item.thumb_url" :alt="item.item_name"/>
                </div>
                <div class="img_right">
                  <div class="title">
                    <h2 class="name">{{item.item_name}}</h2>
                  </div>
                  <div class="price" v-if="item.item_id == 1">冰箱兑换券</div>
                  <h3 class="price" v-else><span class="small">￥</span>{{item.item_price}}</h3>
                  <h4 class="mj_price" v-if="item.is_mjb == 0 || item.item_id == 1"></h4>
                  <h4 class="mj_price" v-else-if="item.is_mjb == 1">
                    <span class="border">可用<i class="ic_mj"></i>{{
                      item.item_price }}</span>
                  </h4>
                  <h4 class="mj_price" v-else-if="item.is_mjb == 2">
                    <span class="border">可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                  </h4>
                </div>
              </router-link>
            </li>
          </ul>
          <p class="last-tip" v-show="listem.length"><i></i><span>{{done_flag ? '我是有底线的' : '上拉加载更多'}}</span><i></i></p>
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
            <a class="btn_a" @click="$router.back()">确认</a>
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
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">返回</a>
    </vtoastw>
  </div>
</template>
<script>
  import BScroll from 'better-scroll';
  import storage from 'good-storage';
  import api from '../../api';
  import qs from 'qs';

  // 最小上拉高度
  const MIN_PULL = 30;

  var Strspan = '';
  export default{
    data() {
      return {
        warning: false, // 网络开小差开关
        tips: '', // 网络开小差文字
        show: false, // 商品横向纵向显示
        active: 0, // 开始显示综合排序
        active_sort: 0, // 综合排序里的综合排序
        sort: true, // 综合排序盒子开关
        brand: false, // 品牌按下的盒子开关
        per_cli: false, // 适用人群下的盒子开关
        deta_choo: false, // 精确筛选下的盒子开关
        colum: true, // 商品纵向开关
        row: false, // 商品横向开关
        change: true, // 横纵项开关显示
        close: false, // 无结果头部差号显示
        message: '', // 搜索无结果文字显示
        arr: [], // 品牌文字
        phere: '所有人群', // 人群初始选项
        wrapp: false, // 品牌不能超过5个弹层开关
        attr: [], // 多选区域文字
        act: 0, // 适用人群文字切换
        words: '', // 输入的关键字
        listem: [], // 商品循环的列表
        brandlist: [], // 品牌循环的列表
        page: 1, // 当前分页
        total_page: 2, // 假设总分页
        curArr: [], // ajax取到的数据
        binArr: [], // 原来的数据
        done_flag: false, // 上拉加载提示文字开关
        ajax_start_flag: true, // ajax提示开关
        brid: [], // 品牌id列表
        minnum: '', // 最小价格
        maxnum: '', // 最高价格
        list: true
      };
    },
    mounted() {
      // 获取words关键字
      this.words = storage.session.get('words');
      // 品牌数据加载
      // 获取cookie里的screen关键字，防止刷新数据消失
      if (storage.session.get('screen')) {
        this.attr = storage.session.get('screen');
        this.arr = this.attr;
      }
      if (storage.session.get('brind')) {
        this.brid = storage.session.get('brind');
      }
      // 初始数据加载
      if (this.$route.query.catid) {
        this._catidAjax();
      } else {
        this._indexAjax();
      }
      // 初始滚动
      this._iscorll();
    },
    methods: {
      // 点击查号
      cliclose () {
        this.words = '';
        storage.session.set('words', '');
        this.message = '';
      },
      // 点击清空
      empty() {
        storage.session.remove('screen');
        storage.session.remove('brind');
        this.arr = [];
        this.attr = [];
        this.brid = [];
      },

      // 点击适用人群
      chphone(st, index) {
        this.act = index;
        this.phere = st;
      },

      // 点击品牌下面选项
      changes(str, brands) {
        var numb = this.arr.indexOf(str);
        var br = this.brid.indexOf(brands);
        if (numb > -1) {
          this.arr.splice(numb, 1);
          this.brid.splice(br, 1);
        } else {
          this.arr.push(str);
          this.brid.push(brands);
        }
        if (this.arr.length >= 6) {
          this.wrapp = true;
          this.arr.splice(numb, 1);
          this.brid.splice(br, 1);
        }
        this.attr = this.arr;
      },

      // 点击综合排序、销量优先、精确筛选
      show_kind(num, sort) {
        this.active = num;
        this.active_sort = 0;
        this.done_flag = false;
        this.page = 1;
        this.listem = [];
        if (this.active == 0) {
          this.sort = true;
          this.deta_choo = false;
          this._indexAjax(sort);
        } else if (this.active == 2) {
          this.sort = false;
          Strspan = '';
          this.done_flag = false;
          this.page = 1;
          this.listem = [];
          storage.session.set('screen', this.attr);
          storage.session.set('brind', this.brid);
          storage.session.set('words', this.words);
          for (var i = 0, len = this.brid.length; i < len; i++) {
            if (i == (this.brid.length - 1)) {
              Strspan += this.brid[i];
            } else {
              Strspan += (this.brid[i] + '|');
            }
          }
          this._brandload();
          this._Ajascree(Strspan);
        } else {
          this.sort = false;
          this.deta_choo = false;
          this._indexAjax(sort);
        }
      },

      // 点击综合排序、从高到低、从低到高、信用排序选中状态
      sort_kind(num, sort) {
        this.done_flag = false;
        this.active_sort = num;
        this.page = 1;
        this.listem = [];
        this._indexAjax(sort);
      },
      // 滚动与上拉加载
      _iscorll() {
        this.$nextTick(() => {
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
                if (this.page > this.total_page) {
                  return;
                }
                if (this.active_sort == 0) {
                  if (this.active == 2) {
                    this._Ajascree(Strspan);
                  } else {
                    this._indexAjax();
                  }
                } else if (this.active_sort == 1) {
                  if (this.active == 2) {
                    this._Ajascree(Strspan);
                  } else {
                    this._indexAjax('down');
                  }
                } else if (this.active_sort == 2) {
                  if (this.active == 2) {
                    this._Ajascree(Strspan);
                  } else {
                    this._indexAjax('up');
                  }
                } else if (this.active_sort == 3) {
                  if (this.active == 2) {
                    this._Ajascree(Strspan);
                  } else {
                    this._indexAjax();
                  }
                } else {
                  this._indexAjax();
                }
              }
            });
            this.scroll.on('beforeScrollStart', () => {
              this.$refs.inpso.blur();
              this.$refs.inpmin.blur();
              this.$refs.inpmax.blur();
            });
          } else {
            this.scroll.refresh();
            // 记录高度
            this.maxHeight = this.scroll.maxScrollY;
          }
        });
      },

      // 按下选择按钮
      check_five() {
        if (!this.brand) {
          this.brand = !this.brand;
        } else {
          this.brand = !this.brand;
        }
        this._iscorll();
      },

      // 按下适用人群按钮
      per_clik() {
        if (!this.per_cli) {
          this.per_cli = !this.per_cli;
        } else {
          this.per_cli = !this.per_cli;
        }
        this._iscorll();
      },

      // colum与 row变换样式
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

      // 加载商品数据
      _indexAjax(sort) {
        if (!this.ajax_start_flag) {
          return;
        }
        this.ajax_start_flag = false;
        this.$http.post(api.searchResultData, qs.stringify({
          page: this.page,
          keyword: this.words,
          count: 10,
          sort: sort
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.curArr = res.item;
            this.binArr = this.listem;
            this.listem = this.binArr.concat(this.curArr);
            this.change = true;
            this.close = false;
            if (this.listem.length == 0) {
              this.message = this.words;
              this.change = false;
              this.close = true;
            }
            this.total_page = res.total_page;
            if (this.page >= this.total_page) {
              this.done_flag = true;
            }
            this.ajax_start_flag = true;
          } else {
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },

      // 根据cartid
      _catidAjax(sort) {
        if (!this.ajax_start_flag) {
          return;
        }
        this.ajax_start_flag = false;
        this.$http.post(api.searchResultData, qs.stringify({
          page: this.page,
          keyword: this.words,
          count: 10,
          sort: sort,
          catid: this.$route.query.catid
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.curArr = res.item;
            this.binArr = this.listem;
            this.listem = this.binArr.concat(this.curArr);
            this.change = true;
            this.close = false;
            if (this.listem.length == 0) {
              this.message = this.words;
              this.change = false;
              this.close = true;
            }
            this.total_page = res.total_page;
            if (this.page >= this.total_page) {
              this.done_flag = true;
            }
            this.ajax_start_flag = true;
          } else {
            this.warning = true;
            this.tips = res.data.err_msg;
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },
      // 根据关键字 品牌加载
      _brandload() {
        this.list = false;
        storage.session.set('words', this.words);
        this.$http.post(api.keywordForBrand, qs.stringify({keyword: this.words})).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.brandlist = res.brand;
            this.close = false;
            if (this.brandlist.length == 0) {
              this.deta_choo = false;
              this.list = true;
              // 消除attr
              this.attr = [];
              this.arr = [];
              storage.session.remove('screen');
            } else {
              this.list = true;
              this.deta_choo = true;
            }
          } else {
            this.brandlist = [];
            this.list = true;
            console.log('数据访问失败');
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      },

      // 点击搜索按键
      sear() {
        storage.session.set('words', this.words);
        storage.session.remove('screen');
        storage.session.remove('brind');
        this.attr = [];
        this.arr = [];
        this.brid = [];
        this.page = 1;
        this.minnum = '';
        this.maxnum = '';
        this.sort = true;
        this.done_flag = false;
        this.deta_choo = false;
        this.active = 0;
        this.active_sort = 0;
        this.listem = [];
        this._indexAjax();
      },

      // 点击筛选
      screen() {
        Strspan = '';
        this.done_flag = false;
        this.page = 1;
        this.listem = [];
        storage.session.set('brind', this.brid);
        storage.session.set('screen', this.attr);
        for (var i = 0, len = this.brid.length; i < len; i++) {
          if (i == (this.brid.length - 1)) {
            Strspan += this.brid[i];
          } else {
            Strspan += (this.brid[i] + '|');
          }
        }
        // 正则匹配
        let money = /^([1-9]\d*|0)(\.\d{1,2})?$/;
        if (this.minnum.length > 0) {
          if (!money.test(this.minnum)) {
            this.warning = true;
            this.tips = '请输入合法的价格';
            return;
          }
        }
        if (this.maxnum.length > 0) {
          if (!money.test(this.maxnum)) {
            this.warning = true;
            this.tips = '请输入合法的价格';
            return;
          }
        }
        // 比较前后的对比
        let Stu = this.minnum;
        if (this.maxnum === '' || this.minnum === '') {
          this._Ajascree(Strspan);
          return;
        } else if (this.maxnum / 1 >= 0 && this.minnum / 1 > this.maxnum / 1) {
          this.minnum = this.maxnum;
          this.maxnum = Stu;
        }
        this._Ajascree(Strspan);
      },

      // 精确筛选
      _Ajascree(brid) {
        this.$http.post(api.searchResultData, qs.stringify({
          page: this.page,
          keyword: this.words,
          count: 10,
          brandid: brid,
          mi: this.minnum,
          ma: this.maxnum
        })).then(res => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.curArr = res.item;
            this.binArr = this.listem;
            this.listem = this.binArr.concat(this.curArr);
            if (this.listem.length == 0) {
              this.message = this.words;
              this.change = false;
              this.close = true;
//              消除attr
              this.attr = [];
              this.arr = [];
              storage.session.remove('screen');
            }
            this.total_page = res.total_page;
            if (this.page >= this.total_page) {
              this.done_flag = true;
            }
            this.ajax_start_flag = true;
          } else {
            this.warning = true;
            this.tips = res.data.err_msg;
          }
        }).catch(() => {
          this.warning = true;
          this.tips = api.warning;
        });
      }
    },
    watch: {
      brandlist: {
        handler(val, oldVal) {
          this._iscorll();
        },
        deep: true
      },
      listem: {
        handler(val, oldVal) {
          this._iscorll();
        },
        deep: true
      },
      words: {
        handler(val, oldVal) {
          this.listem = [];
          storage.session.set('brind', ' ');
          storage.session.set('screen', ' ');
          this.attr = [];
          this.arr = [];
          this.brid = [];
        },
        deep: true
      }
    }
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
    //弹层样式
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
      overflow: hidden;
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
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0 45px 0 40px;
        box-sizing: border-box;
        color: $fs95;
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
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60%;
        font-size: 13px;
        color: $fs95;
        line-height: 40px;
        .pr_le_sp {
          padding-right: 4px;
        }
        .le_sp {
          padding: 0 5px;
          font-size: 10px;
        }
        .pr_numle,
        .pr_numri {
          display: inline-block;
          width: 28%;
          height: 30px;
          border: 1px solid $bgec;
          border-radius: $br24;
          box-sizing: border-box;
          overflow: hidden;
        }
        .input {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          color: $fs31;
          padding: 0 10px;
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
      .active {
        color: $fse5;
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
        .active {
          color: $fse5;
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
