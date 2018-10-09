import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import local from 'vue-cookie';
import api from './api';
import qs from 'qs';
Vue.use(Vuex);

let _this = this;
let cartCart = [];
// 获取用记UUID
var guid = local.get('guid');
_initData();
function _initData() {
  if (!guid) {
    axios.post(api.getUUID).then((res) => {
      res = res.data;
      if (res.err_code == 200) {
        res = res.data;
        guid = res.guid;
        local.set('guid', guid, 365);
      }
    });
  } else {
    // 获取购物车商品列表
    axios.post(api.getItem, qs.stringify({
      guid: guid
    })).then((res) => {
      res = res.data;
      if (res.err_code == 200) {
        // 计算购物车总数和总价
        res = res.data.item;
        calcDate(res);
      }
    });
  }
};
// 购物车计算
function calcDate(arr) {
  // 获取购物车数量和总价
  let cartNum = 0;
  let cartMoney = 0;
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      cartNum += arr[i].num * 1;
      cartMoney += arr[i].num * arr[i].item_price;
    }
    cartCart = arr;
    _this.a.commit('initCart', {num: cartNum, money: cartMoney});
  } else {
    cartCart = arr;
    _this.a.commit('initCart', {num: cartNum, money: cartMoney});
  }
}

export default new Vuex.Store({
  state: {
    // 购物车数量
    count: 0,
    // 购物车总价
    money: 0,
    // 加载层
    loading: false,
    cartObj: {},
    addressObj: {}
  },
  mutations: {
    // 初始化购物车
    initCart(state, obj) {
      state.count = obj.num;
      state.money = obj.money;
    },
    // 加载层
    toggleLoading(state) {
      state.loading = !state.loading;
    },
    setAni(state, obj) {
      state.cartObj = obj;
    },
    setAddressObj(state, obj) {
      state.addressObj = obj;
    }
  },
  actions: {
    toggleLoading({commit}) {
      commit('toggleLoading');
    },
    add({commit}, obj) {
      console.log(obj);
      if (obj.is_part == 1 || obj.item_id == 1) {
        return;
      }
      let num = 1;
      let tempObj = cartCart.find((item) => {
        return item.item_id == obj.item_id;
      });
      if (tempObj) {
        // is_pack || 0:正常商品 1:只能整箱购买商品
        if (obj.is_pack == 1 && obj.pack_num > 0) {
          num = tempObj.num * 1 + obj.pack_num * 1;
        } else {
          num = tempObj.num * 1 + 1;
        }
      } else {
        // is_pack || 0:正常商品 1:只能整箱购买商品
        if (obj.is_pack == 1 && obj.pack_num > 0) {
          num = obj.pack_num;
        }
      }
      // 调用购物车添加商品接口
      axios.post(api.addItem, qs.stringify({
        guid: guid,
        item_id: obj.item_id,
        num: num,
        mjb: obj.is_mjb
      })).then((res) => {
        res = res.data;
        if (res.err_code == 200) {
          _initData();
        }
      });
    },
    setAni({commit}, obj) {
      commit('setAni', obj);
    },
    calcCart({commit}, arr) {
      calcDate(arr);
    },
    setAddressObj({commit}, obj) {
      commit('setAddressObj', obj);
    }
  }
});
