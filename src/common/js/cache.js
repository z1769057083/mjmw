import storage from 'good-storage';
// 购物车
const CART_KEY = '__cart__';
const CART_MAX_LENGTH = 10000;
// 历史记录
const HISTORY_KEY = '__history__';
const SEARCH_MAX_LENGTH = 50;
// 登录状态
const ONLINE_KEY = '__online__';
// token
const TOKEN_KEY = '__token__';
// 绑定手机
const PHONE_KEY = '__bindPhone__';
// 支付密码
const PASS_KEY = '__paypass__';
// 收货地址
const ADDRESS_KEY = '__address__';

// 插入商品
function insertArray(arr, val, compare, maxLen, flag) {
  let index = arr.findIndex(compare);
  if (!flag) {
    if (index > -1) {
      arr.splice(index, 1);
    }
    arr.unshift(val);
  } else {
    if (index > -1) {
      arr.splice(index, 1, val);
    } else {
      arr.push(val);
    }
  }
  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}
// 删除商品
export function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}
// 从本地获取历史记录商品
export function loadHistory() {
  return storage.get(HISTORY_KEY, []);
}
// 向本地保存历史记录商品
export function saveHistory(obj) {
  let history = loadHistory();
  insertArray(history, obj, (item) => {
    return item.item_id == obj.item_id;
  }, SEARCH_MAX_LENGTH);
  storage.set(HISTORY_KEY, history);
  return history;
}
// 从本地删除历史记录商品
export function deleteHistory(obj) {
  let history = loadHistory();
  deleteFromArray(history, (item) => {
    return item.item_id == obj.item_id;
  });
  storage.set(HISTORY_KEY, history);
  return history;
}
// 清空本地历史记录商品
export function clearHistory() {
  storage.remove(HISTORY_KEY);
  return [];
}

// 从本地获取购物车商品
export function loadCart() {
  return storage.get(CART_KEY, []);
}
// 更改本地保存购物车商品
export function saveCart(obj) {
  let cart = loadCart();
  insertArray(cart, obj, (item) => {
    return item.item_id == obj.item_id;
  }, CART_MAX_LENGTH, true);
  storage.set(CART_KEY, cart);
  return cart;
}
// 从本地删除购物车商品
export function deleteCartOne(obj) {
  let cart = loadHistory();
  deleteFromArray(cart, (item) => {
    return item.item_id == obj.item_id;
  });
  storage.set(HISTORY_KEY, cart);
  return cart;
}
// 清空本地购物车商品
export function clearCart() {
  storage.remove(CART_KEY);
  return [];
}
// 计算购物车商品总数和总价
export function calcCart(arr) {
  let cartNum = 0;
  let cartMoney = 0;
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      cartNum += arr[i]._num;
      if (arr[i].bundling_id > 0) {
        cartMoney += arr[i]._num * arr[i].price;
      } else {
        cartMoney += arr[i]._num * arr[i].item_price;
      }
    }
  }
  return {cartNum, cartMoney};
}
// 登录
export function signIn() {
  storage.set(ONLINE_KEY, true);
}
// 登出
export function signOut() {
  storage.set(ONLINE_KEY, false);
}
// 加载登录状态
export function signState() {
  return storage.get(ONLINE_KEY, false);
}
// 保存token
export function saveToken(token) {
  storage.set(TOKEN_KEY, token);
}
// 加载token
export function loadToken() {
  return storage.get(TOKEN_KEY, '');
}
// 保存手机
export function savePhone(phone) {
  storage.set(PHONE_KEY, phone);
}
// 获取手机
export function loadPhone() {
  return storage.get(PHONE_KEY, '');
}
// 保存密码
export function savePaypass(paypass) {
  storage.set(PASS_KEY, paypass);
}
// 获取密码
export function loadPaypass() {
  return storage.get(PASS_KEY, 0);
}
// 保存地址
export function saveAddress(address) {
  storage.set(ADDRESS_KEY, address);
}
// 获取地址
export function loadAddress() {
  return storage.get(ADDRESS_KEY, {});
}

