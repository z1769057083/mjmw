import loading from './loading';

// vloading这就是后面可以使用的组件的名字，install是默认的一个方法
export default {
  install(Vue) {
    Vue.component('vloading', loading);
  }
};
