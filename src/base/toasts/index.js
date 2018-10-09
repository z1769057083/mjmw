import toasts from './toasts';

// vtoasts这就是后面可以使用的组件的名字，install是默认的一个方法
export default {
  install: function (Vue) {
    Vue.component('vtoasts', toasts);
  }
};
