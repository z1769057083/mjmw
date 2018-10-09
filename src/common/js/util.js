// 获取元素的左边距和上边距
function getPos(obj) {
  var pos = {left: 0, top: 0};

  while (obj) {
    pos.left += obj.offsetLeft;
    pos.top += obj.offsetTop;

    obj = obj.offsetParent;
  }

  return pos;
};

// 获取元素样式
function getStyle(obj, attr, bool = true) {
  if (obj.currentStyle) {
    // 非标准浏览器
    return bool ? parseInt(obj.currentStyle[attr]) : obj.currentStyle[attr];
  } else {
    // 标准浏览器
    return bool ? parseInt(getComputedStyle(obj)[attr]) : getComputedStyle(obj)[attr];
  }
}

// 格式化时间
function formatDate(date, fmt) {
  date = new Date(date * 1000);
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

// {60}秒倒计时
let timer = null;
function countDown(fn, callback) {
  let num = 59;

  timer = setInterval(function () {
    if (--num < 1) {
      clearInterval(timer);
      callback && callback();
    } else {
      fn && fn(num);
    }
  }, 1000);
}

// 清除定时器
function clearTimer() {
  clearInterval(timer);
}

function setLocal(key, value) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    seller = {};
  } else {
    seller = JSON.parse(seller);
  }
  seller[key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
};

function getLocal(key) {
  let seller = window.localStorage.__seller__;
  if (seller) {
    return JSON.parse(seller)[key];
  }
};

export {getPos, getStyle, formatDate, countDown, clearTimer, setLocal, getLocal};
