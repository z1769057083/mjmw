import Vue from 'vue';
import axios from 'axios';
import local from 'vue-cookie';
import wechat from 'weixin-js-sdk';
// 手势插件
import AlloyFinger from 'alloyfinger';
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger.vue.js';
// 图片预览插件
import VuePreview from 'vue-preview';
// 轮播图插件
import VueAwesomeSwiper from 'vue-awesome-swiper';

// mint-ui引入
import 'mint-ui/lib/style.css';
import { Picker } from 'mint-ui';
Vue.component(Picker.name, Picker);

import App from './App';
// 状态管理
import store from './store';
// 路由配置
import router from './routes.config';

// 导入自定义菜单组件
import menu from './base/menu';
// 导入自定义加载组件
import loading from './base/loading';
// 导入自定义成功弹层组件
import toasts from './base/toasts';
// 导入自定义失败弹层组件
import toaste from './base/toaste';
// 导入自定义警告弹层组件
import toastw from './base/toastw';
import './common/scss/index.scss';
// 导入懒加载
import VueLazyload from 'vue-lazyload';

Vue.config.productionTip = false;

Vue.use(VueLazyload, {
  loading: require('./common/img/bg.png'),
  error: 'http://cdn.mjmw365.com/images/placeholder.png',
  attempt: 1
});

/* eslint-disable no-unused-vars */
// import vconsole from 'vconsole';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 添加header头
  config.headers['x-mjmw365-token'] = local.get('_token');
  return config;
}, function (error) {
  return Promise.reject(error);
});
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做些事
  if (response.data.err_code == 300001 || response.data.err_msg == 'TOKEN错误！') {
    router.replace({name: 'tokenError'});
    return;
  }
  return response;
}, function (error) {
  // 请求错误时做些事
  return Promise.reject(error);
});

// 挂载axios到Vue上
Vue.prototype.$http = axios;

// 挂载微信到Vue上
Vue.prototype.$wechat = wechat;

// 挂载手势模块
Vue.use(AlloyFingerVue, {AlloyFinger: AlloyFinger});
// 挂载图片预览插件
Vue.use(VuePreview);
// 挂载轮播图插件
Vue.use(VueAwesomeSwiper);
// 挂载自定义组件
Vue.use(menu);
Vue.use(loading);
Vue.use(toasts);
Vue.use(toaste);
Vue.use(toastw);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  router,
  store
});
