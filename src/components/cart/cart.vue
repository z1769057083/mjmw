<template>
  <!-- 没有导航加.no -->
  <div class="cart-wrap" :class="{no: !$route.hash}">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">购物车</p>
      <span class="edit pos" v-show="list.length" @click="toggleDel">{{delFlag ? '完成' : '编辑'}}</span>
    </header>
    <!-- 主体内容 -->
    <div class="main" ref="scroll_hook">
      <div class="scroll-wrap">
        <template v-for="(items, index) in newList">
          <!-- 套装商品 -->
          <template v-if="items[0].is_bundling == 1">
            <div class="pro-box tz-box">
              <div class="title">
                <div class="btn-box">
                  <span class="btn" :class="{on: items[0].checked}" @click="changeListChecked(items[0])"></span>
                </div>
                <span class="left">套装</span>
              </div>
              <div class="item-box">
                <div class="item" :class="{on: items[0].left}" v-finger:swipe="swipe.bind(this, items[0])">
                  <div class="cont" v-for="item in items[0].bundlings[0].items">
                    <div class="btn-box">
                      <span class="btn" v-show="0"></span>
                    </div>
                    <div class="pic-show">
                      <div class="img-box">
                        <img class="img" v-lazy="item.thumb_url" alt="">
                        <span class="tips" v-if="items[0].storage == 0">已抢光</span>
                        <span class="tips" v-else-if="items[0].is_prepare == 1">备货中</span>
                      </div>
                      <div class="txt-box">
                        <h3 class="name">{{item.item_name}}</h3>
                        <div class="price"></div>
                        <div class="store">{{item.supplier_name}}</div>
                      </div>
                    </div>
                  </div>
                  <div class="trash" @click="showDel(items[0])"></div>
                </div>
                <div class="tz-foot">
                  <div class="left">
                    <span class="txt">套装价格</span>
                    <span class="price">{{'￥' + items[0].item_price}}</span>
                    <span class="border" v-if="items[0].is_mjb == 1">可用<i
                      class="ic_mj"></i>{{items[0].item_price}}</span>
                    <span class="border" v-else-if="items[0].is_mjb == 2">可用<i class="ic_mj"></i>{{items[0].mjb_value}}</span>
                  </div>
                  <!-- 变灰加.gray -->
                  <a class="find" v-if="items[0].storage == 0 || items[0].is_prepare == 1"
                     @click="findGoods(items[0])"></a>
                  <div class="calc-box" v-else>
                    <span class="sub" @click="_changeNum(items[0])"
                          @touchstart="toggleClass"
                          @touchend="toggleClass"></span>
                    <span class="num">{{items[0].num}}</span>
                    <span class="add" @click="_changeNum(items[0], true)"
                          @touchstart="toggleClass"
                          @touchend="toggleClass"></span>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <!-- 普通商品 -->
          <template v-else>
            <div class="pro-box">
              <div class="title">
                <div class="btn-box">
                  <span class="btn" :class="{on: items.checked}" @click="changeListChecked(items)"></span>
                </div>
                <span class="right">{{items[0].supplier_name}}</span>
              </div>
              <div class="item-box">
                <template v-for="item in items">
                  <div class="item" :class="{on: item.left}" v-finger:swipe="swipe.bind(this, item)">
                    <div class="cont">
                      <div class="btn-box">
                        <span class="btn" :class="{on: item.checked}" @click="changeItemChecked(item, items)"></span>
                      </div>
                      <div class="pic-show">
                        <div class="img-box">
                          <img class="img" v-lazy="item.thumb_url" alt="">
                          <span class="tips" v-if="item.storage == 0">已抢光</span>
                          <span class="tips" v-else-if="item.is_prepare == 1">备货中</span>
                        </div>
                        <div class="txt-box">
                          <h3 class="name">{{item.item_name}}</h3>
                          <div class="price"><b class="small">￥</b>{{item.item_price}}</div>
                          <div class="mj-box">
                            <span class="border" v-if="item.is_mjb == 1">可用<i class="ic_mj"></i>{{item.item_price}}</span>
                            <span class="border" v-else-if="item.is_mjb == 2">可用<i class="ic_mj"></i>{{item.mjb_value}}</span>
                          </div>
                        </div>
                        <!-- 变灰加.gray -->
                        <a class="find" v-if="item.storage == 0 || item.is_prepare == 1" @click="findGoods(item)"></a>
                        <div class="calc-box" v-else>
                          <!-- 变色加.active -->
                          <span class="sub" @click="_changeNum(item)" @touchstart="toggleClass"
                                @touchend="toggleClass"></span>
                          <span class="num">{{item.num}}</span>
                          <span class="add" @click="_changeNum(item, true)" @touchstart="toggleClass"
                                @touchend="toggleClass"></span>
                        </div>
                      </div>
                    </div>
                    <div class="trash" @click="showDel(item)"></div>
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
    <template v-if="list.length">
      <!-- 删除脚部 -->
      <div class="foot-edit-wrap" v-if="delFlag">
        <div class="btn-wrap">
          <span class="btn" :class="{on: checkedAll}" @click="changeAllChecked"></span>
          <span class="over">已选({{calcTotal.cartNum}})</span>
        </div>
        <a class="btn-del" @click="delItems">删除</a>
      </div>
      <!-- 去结算脚部 -->
      <div class="foot-wrap" v-else>
        <div class="btn-wrap">
          <span class="btn" :class="{on: checkedAll}" @click="changeAllChecked"></span>
          <span class="over">已选({{calcTotal.cartNum}})</span>
        </div>
        <div class="num-wrap">
          <span class="txt">合计：</span>
          <span class="num">
          <b class="small">￥</b>
          <span class="total">{{calcTotal.cartMoney.toFixed(2)}}</span>
        </span>
        </div>
        <a class="pay" @click="toBalance">去结算</a>
      </div>
    </template>
    <!-- 删除弹层 -->
    <div class="del-mark" v-if="flag">
      <div class="alert">
        <div class="title">
          <i class="icon-tip"></i>
        </div>
        <div class="cont">
          <p class="txt">确认删除所选商品</p>
          <a class="btn btn-ok" @click="delItem(delObj)">确认</a>
          <a class="btn btn-cancle" @click="flag = !flag">取消</a>
        </div>
      </div>
    </div>
    <!-- 没有商品时显示 -->
    <div class="nothing-wrap" v-if="!list.length && isShow">
      <div class="alert">
        <div class="title">
          <i class="icon-tip"></i>
        </div>
        <div class="cont">
          <p class="txt">您的购物车没有任何商品</p>
          <router-link :to="{name: 'home', params: {back: true}}" class="btn btn-go">去逛逛</router-link>
        </div>
      </div>
      <div class="tui-wrap">
        <h3 class="title">为您推荐</h3>
        <div class="list-wrap">
          <div class="item" v-for="item in tui">
            <router-link :to="{name: 'goods', query: {itemid: item.item_id}}" class="item-box" tag="div">
              <div class="img-box">
                <img class="img" :src="item.thumb_url"
                     onerror="this.src='http://cdn.mjmw365.com/images/placeholder.png'" alt="">
              </div>
              <div class="name">{{item.item_name}}</div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- 警告框 -->
    <vtoastw v-show="warning">
      <div slot="txt" class="txt">{{tips}}</div>
      <a slot="btn" class="btn" @click="warning = !warning">关闭</a>
    </vtoastw>
    <!-- 加载框 -->
    <vloading></vloading>
  </div>
</template>

<script>
  import BScroll from 'better-scroll';
  import api from '../../api';
  import local from 'vue-cookie';
  import {mapActions} from 'vuex';
  import storage from 'good-storage';
  import qs from 'qs';
  import {setLocal} from '../../common/js/util';

  export default {
    data() {
      return {
        list: [],
        flag: false,
        delObj: null,
        tui: [],
        delFlag: false,
        guid: local.get('guid'),
        isShow: false,
        checkedAll: true,
        warning: false,
        tips: ''
      };
    },
    computed: {
      newList() {
        // 存放普通商品
        let arr1 = [];
        // 存放套装商品
        let tempSuit = [];
        // 把每一项转成数组
        for (let i = 0; i < this.list.length; i++) {
          let arr2 = [];
          arr2.push(this.list[i]);
          if (arr2[0].is_bundling == 1) {
            tempSuit.push(arr2);
          } else {
            arr1.push(arr2);
          }
        }
        // 把相同供应商非套装数组合并
        for (let i = 0; i < arr1.length; i++) {
          for (let j = i + 1; j < arr1.length; j++) {
            if (arr1[i][0].supplier_id == arr1[j][0].supplier_id && arr1[j][0].is_bundling != 1) {
              let tmepArr = arr1.splice(j, 1);
              arr1[i].push(tmepArr[0][0]);
              j--;
            }
          }
        }
        arr1 = arr1.concat(tempSuit);
        // 根据当前组的分类状态确定当前组的选中状态
        for (let i = 0; i < arr1.length; i++) {
          for (let j = 0; j < arr1[i].length; j++) {
            if (!arr1[i][j].checked) {
              arr1[i].checked = false;
              break;
            } else {
              arr1[i].checked = true;
            }
          }
        }
        return arr1;
      },
      // 计算应付总额
      calcTotal() {
        let cartNum = 0;
        let cartMoney = 0;
        let arr = this.list;
        if (arr.length) {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].checked) {
              cartNum += arr[i].num * 1;
              cartMoney += arr[i].num * arr[i].item_price;
            }
          }
        }
        return {cartNum, cartMoney};
      }
    },
    mounted() {
      this.getList();
      this.getTui();
    },
    methods: {
      // 找相似
      findGoods(item) {
        this.$router.push({name: 'result', query: {catid: item.catid[0]}});
        storage.session.set('words', '');
      },
      ...mapActions(['calcCart', 'toggleLoading']),
      // 切换删除
      toggleDel() {
        this.delFlag = !this.delFlag;
      },
      // 改变全选状态
      changeAllChecked() {
        this.checkedAll = !this.checkedAll;
        for (let i = 0; i < this.newList.length; i++) {
          this.newList[i].checked = this.checkedAll;
          for (let j = 0; j < this.newList[i].length; j++) {
            this.newList[i][j].checked = this.checkedAll;
          }
        }
      },
      // 改变一组选中状态
      changeListChecked(arr) {
        arr.checked = !arr.checked;
        for (let i = 0; i < arr.length; i++) {
          arr[i].checked = arr.checked;
        }
      },
      // 改变单个选中状态
      changeItemChecked(obj, arr) {
        obj.checked = !obj.checked;
        // 只要有一个没有选中，则父级就不选中
        for (let i = 0; i < arr.length; i++) {
          if (!arr[i].checked) {
            arr.checked = false;
            return;
          }
        }
        arr.checked = true;
      },
      // 左右滑动
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
      // 显示删除层
      showDel(obj) {
        this.flag = !this.flag;
        this.delObj = obj;
      },
      // 删除多个商品
      delItems() {
        let tempArr = [];
        let tempId = [];
        // 找到被选中的商品
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].checked) {
            tempArr.push(this.list[i]);
            tempId.push(this.list[i].item_id);
          }
        }
        // 是否有商品要删除
        if (!tempArr.length) {
          this.warning = !this.warning;
          this.tips = '请选择您要删除的商品';
        } else {
          this.flag = !this.flag;
          this.delObj = {tempArr: tempArr, tempId: tempId};
        }
      },
      // 删除单个商品
      delItem(obj) {
        // 不是通过删除操作删除的商品
        if (obj.tempArr == undefined) {
          this.$http.post(api.delItem, qs.stringify({
            guid: this.guid,
            item_id: obj.item_id
          })).then((res) => {
            res = res.data;
            if (res.err_code == 200) {
              let tempPos = this.list.findIndex((item) => {
                return item.item_id == obj.item_id;
              });
              this.list.splice(tempPos, 1);
              this.calcCart(this.list);
              this.flag = !this.flag;
            } else {
              this.warning = true;
              this.tips = api.warning;
              this.flag = !this.flag;
            }
          });
        } else {
          if (obj.tempArr.length < 2) {
            this.delItem(obj.tempArr[0]);
          } else {
            this.$http.post(api.delItem, qs.stringify({
              guid: this.guid,
              item_id: obj.tempId.join('|')
            })).then((res) => {
              res = res.data;
              if (res.err_code == 200) {
                // 将每一个选中的商品找到删除
                for (let i = 0; i < obj.tempArr.length; i++) {
                  let tempPos = this.list.findIndex((item) => {
                    return item.item_id === obj.tempArr[i].item_id;
                  });
                  this.list.splice(tempPos, 1);
                }
                this.calcCart(this.list);
                this.flag = !this.flag;
              } else {
                this.warning = true;
                this.tips = api.warning;
                this.flag = !this.flag;
              }
            });
          }
        }
      },
      // 购物车增加减少
      _changeNum(obj, bool) {
        let tempNum = 0;
        // 有bool代表加
        if (bool) {
          // is_pack || 0:正常商品 1:只能整箱购买商品
          if (obj.is_pack > 0 && obj.pack_num > 1) {
            tempNum = obj.num * 1 + obj.pack_num * 1;
          } else {
            tempNum = obj.num * 1 + 1;
          }
        } else {
          // is_pack || 0:正常商品 1:只能整箱购买商品
          if (obj.is_pack > 0 && obj.pack_num > 1) {
            tempNum = obj.num - obj.pack_num;
          } else {
            tempNum = obj.num - 1;
          }
          // 判断是否应该显示删除提示
          if (tempNum < 1) {
            this.flag = !this.flag;
            this.delObj = obj;
            return;
          }
        }
        this.$http.post(api.addItem, qs.stringify({
          guid: this.guid,
          item_id: obj.item_id,
          num: tempNum,
          mjb: obj.is_mjb
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            obj.num = tempNum;
            this.calcCart(this.list);
          }
        });
      },
      // 获取推荐商品列表
      getTui() {
        this.$http.post(api.recommentData).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            res = res.data;
            this.tui = res.items;
          }
        });
      },
      // 获取购物车商品列表
      getList() {
        this.toggleLoading();
        this.$http.post(api.getItem, qs.stringify({
          guid: this.guid
        })).then((res) => {
          res = res.data;
          if (res.err_code == 200) {
            res = res.data;
            this.list = res.item;
            this.isShow = true;
            for (let i = 0; i < this.list.length; i++) {
              // 为每一个对象添加left属性
              this.$set(this.list[i], 'left', false);
              // 为每一个对象添加选中选项
              this.$set(this.list[i], 'checked', true);
              if (this.list[i].is_mjb > 0) {
                // 为每一个对象添加美家钻开关
                this.$set(this.list[i], '_switch', true);
              }
            }
            this.toggleLoading();
          } else {
            this.toggleLoading();
          }
        });
      },
      // class切换
      toggleClass(ev) {
        if (ev.type == 'touchstart') {
          ev.target.className = ev.target.className + ' active';
        } else {
          ev.target.className = ev.target.className.split(' ')[0];
        }
      },
      // 去结算
      toBalance() {
        if (!this.calcTotal.cartNum) {
          this.warning = true;
          this.tips = '您还未选择去结算的商品';
        } else {
          // 存储选中商品
          let tempArr = this.list.filter((item) => {
            return item.checked === true;
          });
          // 检查选中商品是否含有库存不足的商品
          let isEmpty = tempArr.filter((item) => {
            return item.storage == 0 || item.is_prepare == 1;
          });
          if (isEmpty.length) {
            this.warning = true;
            this.tips = '您的购物车有已抢光商品，请移除后结算';
            return;
          }
          let arr = [];
          let arr2 = [];
          for (let i = 0; i < tempArr.length; i++) {
            arr.push(tempArr[i].item_id + '|' + tempArr[i].num);
            if (tempArr[i].is_mjb > 0) {
              arr2.push(tempArr[i].item_id + '|' + tempArr[i].num + '|' + 1);
            } else {
              arr2.push(tempArr[i].item_id + '|' + tempArr[i].num + '|' + 0);
            }
          }
          // 将要支付的商品存入本地
          setLocal('_list', tempArr);
          setLocal('_num', this.calcTotal.cartNum);
          setLocal('_total', this.calcTotal.cartMoney.toFixed(2));
          setLocal('_goodsNum', arr.join(','));
          setLocal('_goodsNumMJB', arr2.join(','));
          this.$router.push({name: 'confirm'});
        }
      }
    },
    watch: {
      list: {
        handler(val, oldVal) {
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.scroll_hook, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
            // 检查是否全选
            for (let i = 0; i < this.newList.length; i++) {
              if (!this.newList[i].checked) {
                this.checkedAll = false;
                return;
              }
            }
            this.checkedAll = true;
          });
        },
        deep: true
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .cart-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
    background: $bgec;
    &.no {
      bottom: 0;
    }
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
      .edit {
        right: 24px;
        line-height: 30px;
        font-size: 13px;
        color: $fs95;
      }
    }
    .main {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 45px;
      overflow: hidden;
      .scroll-wrap {
        padding: 5px;
      }
      .pro-box {
        margin-top: 5px;
        border-radius: $br6;
        overflow: hidden;
        &:first-child {
          margin-top: 0;
        }
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding-right: 12px;
          background: $bgff;
          .btn-box {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 0 0 35px;
            width: 35px;
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
          .right {
            font-size: 13px;
            color: $fs95;
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
            height: 90px;
            background: $bgff;
            .btn-box {
              display: flex;
              justify-content: center;
              align-items: center;
              flex: 0 0 35px;
              width: 35px;
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
            .pic-show {
              position: relative;
              display: flex;
              align-items: center;
              flex: 1;
              height: 80px;
              .img-box {
                position: relative;
                flex: 0 0 80px;
                width: 80px;
                height: 80px;
                border-radius: $br6;
                border: 1px solid $bdf0;
                overflow: hidden;
                box-sizing: border-box;
                .img {
                  width: 100%;
                  height: 100%;
                }
                .tips {
                  position: absolute;
                  left: 0;
                  top: 0;
                  right: 0;
                  bottom: 0;
                  width: 40px;
                  height: 40px;
                  line-height: 40px;
                  text-align: center;
                  margin: auto;
                  font-size: 10px;
                  color: $fsff;
                  border-radius: 50%;
                  background: rgba(229, 0, 79, .8);
                }
              }
              .txt-box {
                flex: 1;
                padding: 0 8px;
                .name {
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  word-break: break-all;
                  height: 30px;
                  line-height: 15px;
                  text-align: justify;
                  font-size: 13px;
                  color: $fs43;
                  overflow: hidden;
                }
                .price {
                  height: 20px;
                  line-height: 20px;
                  font-size: 15px;
                  color: $fse5;
                  .small {
                    font-size: 12px;
                  }
                }
                .store {
                  font-size: 10px;
                  color: $fs95;
                }
                .mj-box {
                  display: flex;
                  .border {
                    margin-left: 0;
                  }
                }
              }
              .calc-box {
                position: absolute;
                right: 5px;
                bottom: -2px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 93px;
                font-size: 15px;
                color: $fse5;
                .add, .sub {
                  width: 30px;
                  height: 30px;
                  @include bg(23px 23px);
                }
                .add {
                  &.active {
                    background-image: url(i_add_a.png);
                  }
                  background-image: url(i_add_d.png);
                }
                .sub {
                  &.active {
                    background-image: url(i_sub_a.png);
                  }
                  background-image: url(i_sub_d.png);
                }
              }
              .find {
                position: absolute;
                right: 11px;
                bottom: 5px;
                width: 83px;
                height: 20px;
                @include bg;
                background-image: url(i_find_a.png);
                .gray {
                  background-image: url(i_find_d.png);
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
      .tz-box {
        .title {
          justify-content: flex-start;
          font-size: 13px;
          color: $fse5;
        }
        .cont {
          margin-bottom: 1px;
        }
        .tz-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 40px;
          padding: 0 5px 0 10px;
          background: $bgff;
          .left {
            display: flex;
            align-items: center;
            .txt {
              font-size: 12px;
              color: $fs53;
            }
            .price {
              margin-left: 8px;
              font-size: 15px;
              color: $fse5;
              .small {
                font-size: 12px;
              }
            }
          }
          .calc-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 93px;
            font-size: 15px;
            color: $fse5;
            .add, .sub {
              width: 30px;
              height: 30px;
              @include bg(23px 23px);
            }
            .add {
              background-image: url(i_add_d.png);
              &.active {
                background-image: url(i_add_a.png);
              }
            }
            .sub {
              background-image: url(i_sub_d.png);
              &.active {
                background-image: url(i_sub_a.png);
              }
            }
          }
        }
      }
    }
    .foot-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      .btn-wrap {
        display: flex;
        align-items: center;
        flex: 0 0 120px;
        width: 120px;
        height: 100%;
        .btn {
          width: 30px;
          height: 30px;
          margin-left: 8px;
          @include bg(23px 23px);
          background-image: url(i_check.png);
          &.on {
            background-image: url(i_checked.png);
          }
        }
        .over {
          height: 30px;
          line-height: 30px;
          font-size: 10px;
          color: $fs95;
        }
      }
      .num-wrap {
        flex: 1;
        height: 100%;
        line-height: 45px;
        text-align: center;
        font-size: 10px;
        color: $fs53;
        border-left: 1px solid $bdec;
        .num {
          font-size: 0px;
          color: $fse5;
          .small {
            font-size: 12px;
          }
          .total {
            font-size: 15px;
          }
        }
      }
      .pay {
        flex: 0 0 90px;
        width: 90px;
        height: 100%;
        line-height: 45px;
        text-align: center;
        font-size: 13px;
        color: $fsff;
        background: $bge5;
      }
    }
    .foot-edit-wrap {
      position: absolute;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 45px;
      background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
      .btn-wrap {
        display: flex;
        align-items: center;
        flex: 1;
        .btn {
          width: 30px;
          height: 30px;
          margin-left: 8px;
          @include bg(23px 23px);
          background-image: url(i_check.png);
          &.on {
            background-image: url(i_checked.png);
          }
        }
        .over {
          height: 30px;
          line-height: 30px;
          font-size: 10px;
          color: $fs95;
        }
      }
      .btn-del {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        height: 100%;
        font-size: 13px;
        color: $fsff;
        background: $bge5;
      }
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
    .nothing-wrap {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      background: $bgec;
      .alert {
        position: relative;
        z-index: 1;
        width: 298px;
        margin: 115px auto 0;
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
            background-image: url(i_cart.png);
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
            margin-top: 10px;
            width: 272px;
            height: 48px;
            line-height: 48px;
            text-align: center;
            margin: 10px auto 0;
            font-size: 13px;
            border: 1px solid $bddc;
            border-radius: $br50;
            &.btn-go {
              color: $fse5;
            }
          }
        }
      }
      .tui-wrap {
        position: absolute;
        left: 5px;
        bottom: 5px;
        right: 5px;
        border-radius: $br6;
        overflow: hidden;
        .title {
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: 13px;
          color: $fs1b;
          background: $bgff;
        }
        .list-wrap {
          display: flex;
          width: 100%;
          margin-top: 1px;
          .item {
            flex: 0 0 33.3%;
            width: 33.3%;
            background: $bgff;
            .item-box {
              padding: 5px 5px 0;
              .img-box {
                position: relative;
                width: 100%;
                height: 0;
                padding-top: 100%;
                overflow: hidden;
                .img {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                }
              }
              .name {
                height: 23px;
                line-height: 23px;
                font-size: 13px;
                color: $fs43;
                @extend .dot;
              }
            }
          }
          .item:nth-of-type(2) {
            margin-left: 1px;
            margin-right: 1px;
          }
        }
      }
    }
  }
</style>
