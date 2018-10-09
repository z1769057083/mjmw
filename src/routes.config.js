import Vue from 'vue';
import VueRouter from 'vue-router';
import local from 'vue-cookie';

// 首页
import home from './components/home/home';
// 消息中心
import newsCenter from './components/newsCenter/newsCenter';
// 订单消息
import newsCenterOrder from './components/newsCenterOrder/newsCenterOrder';
// 商城精选
import mall from './components/mall/mall';
// 小店
import shop from './components/shop/shop';
// 购物车
import cart from './components/cart/cart';
// 再次购买
import buyAgain from './components/buyAgain/buyAgain';
// 历史足迹
import historical from './components/historical/historical';
// 我的
import personal from './components/personal/personal';
// 商品详情
import goods from './components/goods/goods';
// 商品套装
import suit from './components/suit/suit';
// 评论
import feed from './components/feed/feed';
// 订单
import confirm from './components/confirm/confirm';
// 订单详情
import confirmID from './components/confirmID/confirmID';
// 冰箱订单
import confirmFridge from './components/confirmFridge/confirmFridge';
// 订单列表
import orderList from './components/orderList/orderList';
// 订单跟踪
import tracking from './components/tracking/tracking';
// 配送信息
import dispatch from './components/dispatch/dispatch';
// 供应商商品
import merchant from './components/merchant/merchant';
// 美家钻支付
import mjzpay from './components/mjzpay/mjzpay';
// 优惠组合
import preferential from './components/preferential/preferential';
// 注册
import register from './components/register/register';
// 登录
import login from './components/login/login';
// 忘记密码
import passwordReset from './components/passwordReset/passwordReset';
// 张户安全
import account from './components/account/account';
// 修改密码
import passwordEdit from './components/passwordEdit/passwordEdit';
// 设置支付密码
import paySetting from './components/paySetting/paySetting';
// 支付密码修改
import paySettingEdit from './components/paySettingEdit/paySettingEdit';
// 支付密码
import payment from './components/payment/payment';
// 支付成功
import paySuccess from './components/paySuccess/paySuccess';
// 修改手机
import phoneEdit from './components/phoneEdit/phoneEdit';
// 绑定手机
import phoneBind from './components/phoneBind/phoneBind';
// 微信绑定手机
import wxBindPhone from './components/wxBindPhone/wxBindPhone';
// 能接收手机
import phoneCan from './components/phoneCan/phoneCan';
// 不能接收手机
import phoneNo from './components/phoneNo/phoneNo';
// 帮助
import help from './components/help/help';
// 附近小店
import nearbyStore from './components/nearbyStore/nearbyStore';
// 绑定智能冰箱
import bindFridge from './components/bindFridge/bindFridge';
// 兑换卡
import entityCard from './components/entityCard/entityCard';
// 冰箱设置
import fridgeSetting from './components/fridgeSetting/fridgeSetting';
// 地址管理
import deliveryAddress from './components/deliveryAddress/deliveryAddress';
// 获取当前位置
import currentLocation from './components/currentLocation/currentLocation';
// 增加收货地址
import addAddress from './components/addAddress/addAddress';
// 编辑收货地址
import editAddress from './components/editAddress/editAddress';
// 注册协议
import GVRP from './components/GVRP/GVRP';
// 我的页面——设置
import setup from './components/setup/setup';
// 个人信息
import nickname from './components/nickname/nickname';
// 我的钱包
import wallet from './components/wallet/wallet';
// 优惠券
import confirmq from './components/confirmq/confirmq';
// 搜索
import search from './components/search/search';
// 搜索结果
import result from './components/result/result';
// 美家钻页面
import mjz from './components/mjz/mjz';
// 交易记录
import record from './components/record/record';
// 充值
import recharge from './components/recharge/recharge';
// 我的订单
import myOrder from './components/myOrder/myOrder';
// 评价中心待评价
import evalcenwait from './components/evalcenwait/evalcenwait';
// 写评价
import writeeval from './components/writeeval/writeeval';
// 我的收藏
import collection from './components/collection/collection';
// 充值换购预存协议6000
import agree6900 from './components/agreement/agree6900';
// 充值换购预存协议6999
import agree6999 from './components/agreement/agree6999';
// 充值换购预存协议其它
import agreelse from './components/agreement/agreelse';
// 免密支付
import noPassPay from './components/noPassPay/noPassPay';
// 物流消息
import logisticsNews from './components/logisticsNews/logisticsNews';
// token错误
import tokenError from './components/tokenError/tokenError';
// 绑定渠道
import bindChannel from './components/bindChannel/bindChannel';
// h5
import h5 from './components/h5/h5';
// 确认支付
import toPay from './components/toPay/toPay';
// 支付错误
import payError from './components/payError/payError';
// 充值错误
import rechargeError from './components/rechargeError/rechargeError';
// 充值成功
import rechargeSucc from './components/rechargeSucc/rechargeSucc';
Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: home,
      meta: {
        keep: true
      }
    },
    {
      path: '/newsCenter',
      name: 'newsCenter',
      component: newsCenter
    },
    {
      path: '/newsCenterOrder',
      name: 'newsCenterOrder',
      component: newsCenterOrder
    },
    {
      path: '/mall',
      name: 'mall',
      component: mall
    },
    {
      path: '/shop',
      name: 'shop',
      component: shop
    },
    {
      path: '/cart',
      name: 'cart',
      component: cart
    },
    {
      path: '/buyAgain',
      name: 'buyAgain',
      component: buyAgain
    },
    {
      path: '/historical',
      name: 'historical',
      component: historical
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    },
    {
      path: '/goods',
      name: 'goods',
      component: goods
    },
    {
      path: '/suit',
      name: 'suit',
      component: suit
    },
    {
      path: '/feed',
      name: 'feed',
      component: feed
    },
    {
      path: '/merchant',
      name: 'merchant',
      component: merchant
    },
    {
      path: '/preferential',
      name: 'preferential',
      component: preferential
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: confirm
    },
    {
      path: '/confirmID',
      name: 'confirmID',
      component: confirmID
    },
    {
      path: '/confirmFridge',
      name: 'confirmFridge',
      component: confirmFridge
    },
    {
      path: '/tracking',
      name: 'tracking',
      component: tracking
    },
    {
      path: '/mjzpay',
      name: 'mjzpay',
      component: mjzpay
    },
    {
      path: '/orderList',
      name: 'orderList',
      component: orderList
    },
    {
      path: '/dispatch',
      name: 'dispatch',
      component: dispatch
    },
    {
      path: '/register',
      name: 'register',
      component: register
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/passwordReset',
      name: 'passwordReset',
      component: passwordReset
    },
    {
      path: '/account',
      name: 'account',
      component: account
    },
    {
      path: '/passwordEdit',
      name: 'passwordEdit',
      component: passwordEdit
    },
    {
      path: '/paySetting',
      name: 'paySetting',
      component: paySetting
    },
    {
      path: '/paySettingEdit',
      name: 'paySettingEdit',
      component: paySettingEdit
    },
    {
      path: '/payment',
      name: 'payment',
      component: payment
    },
    {
      path: '/paySuccess',
      name: 'paySuccess',
      component: paySuccess
    },
    {
      path: '/phoneEdit',
      name: 'phoneEdit',
      component: phoneEdit
    },
    {
      path: '/phoneBind',
      name: 'phoneBind',
      component: phoneBind
    },
    {
      path: '/wxBindPhone',
      name: 'wxBindPhone',
      component: wxBindPhone
    },
    {
      path: '/phoneCan',
      name: 'phoneCan',
      component: phoneCan
    },
    {
      path: '/phoneNo',
      name: 'phoneNo',
      component: phoneNo
    },
    {
      path: '/help',
      name: 'help',
      component: help
    },
    {
      path: '/nearbyStore',
      name: 'nearbyStore',
      component: nearbyStore
    },
    {
      path: '/bindFridge',
      name: 'bindFridge',
      component: bindFridge
    },
    {
      path: '/entityCard',
      name: 'entityCard',
      component: entityCard
    },
    {
      path: '/fridgeSetting',
      name: 'fridgeSetting',
      component: fridgeSetting
    },
    {
      path: '/deliveryAddress',
      name: 'deliveryAddress',
      component: deliveryAddress
    },
    {
      path: '/currentLocation',
      name: 'currentLocation',
      component: currentLocation
    },
    {
      path: '/addAddress',
      name: 'addAddress',
      component: addAddress
    },
    {
      path: '/editAddress',
      name: 'editAddress',
      component: editAddress
    },
    {
      path: '/GVRP',
      name: 'GVRP',
      component: GVRP
    },
    {
      path: '/setup',
      name: 'setup',
      component: setup
    },
    {
      path: '/nickname',
      name: 'nickname',
      component: nickname
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: wallet
    },
    {
      path: '/confirmq',
      name: 'confirmq',
      component: confirmq
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/result',
      name: 'result',
      component: result
    },
    {
      path: '/mjz',
      name: 'mjz',
      component: mjz
    },
    {
      path: '/record',
      name: 'record',
      component: record
    },
    {
      path: '/recharge',
      name: 'recharge',
      component: recharge
    },
    {
      path: '/myOrder',
      name: 'myOrder',
      component: myOrder
    },
    {
      path: '/evalcenwait',
      name: 'evalcenwait',
      component: evalcenwait
    },
    {
      path: '/writeeval',
      name: 'writeeval',
      component: writeeval
    },
    {
      path: '/collection',
      name: 'collection',
      component: collection
    },
    {
      path: '/agree6900',
      name: 'agree6900',
      component: agree6900
    },
    {
      path: '/agree6999',
      name: 'agree6999',
      component: agree6999
    },
    {
      path: '/agreelse',
      name: 'agreelse',
      component: agreelse
    },
    {
      path: '/noPassPay',
      name: 'noPassPay',
      component: noPassPay
    },
    {
      path: '/logisticsNews',
      name: 'logisticsNews',
      component: logisticsNews
    },
    {
      path: '/tokenError',
      name: 'tokenError',
      component: tokenError
    },
    {
      path: '/bindChannel',
      name: 'bindChannel',
      component: bindChannel
    },
    {
      path: '/h5',
      name: 'h5',
      component: h5
    },
    {
      path: '/toPay',
      name: 'toPay',
      component: toPay
    },
    {
      path: '/payError',
      name: 'payError',
      component: payError
    },
    {
      path: '/rechargeError',
      name: 'rechargeError',
      component: rechargeError
    },
    {
      path: '/rechargeSucc',
      name: 'rechargeSucc',
      component: rechargeSucc
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
});

router.beforeEach((to, from, next) => {
  // 购物车去支付前登录判断 || 去我的页面登录判断
  if (to.name == 'confirm' || to.name == 'personal' || to.name == 'nearbyStore') {
    if (local.get('_online') == null || local.get('_online') == 'false') {
      next({name: 'login'});
    }
  }
  next();
});

export default router;
