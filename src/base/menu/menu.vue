<template>
  <div class="menu-wrap">
    <div class="menu-box">
      <router-link :to="{ name: 'home' }" tag="div" class="menu-item">
        <i class="icon home"></i>
        <div class="txt">首页</div>
      </router-link>
      <router-link :to="{ name: 'mall' }" tag="div" class="menu-item">
        <i class="icon mall"></i>
        <div class="txt">商城精选</div>
      </router-link>
      <router-link :to="{ name: 'shop' }" tag="div" class="menu-item">
        <i class="icon shop"></i>
        <div class="txt">我的小店</div>
      </router-link>
      <router-link :to="{ path: '/cart#home' }" tag="div" class="menu-item">
        <i class="icon cart"><b class="num" v-show="count > 0">{{ count }}</b></i>
        <div class="txt money" v-if="money > 0">￥{{ money.toFixed(2) }}</div>
        <div class="txt" v-else>购物车</div>
      </router-link>
      <router-link :to="{ name: 'personal' }" tag="div" class="menu-item">
        <i class="icon mine"></i>
        <div class="txt">我的</div>
      </router-link>
    </div>
    <template v-for="item in balls">
      <transition @before-enter="beforeDrop" @enter="drop" @after-enter="afterDrop" name="drop">
        <div class="ball-wrap" v-show="item.flag">
          <div class="inner"></div>
        </div>
      </transition>
    </template>
  </div>
</template>

<script>
  import {mapState} from 'vuex';

  export default {
    data() {
      return {
        balls: [
          {flag: false},
          {flag: false},
          {flag: false},
          {flag: false},
          {flag: false}
        ],
        dropBall: []
      };
    },
    computed: {
      ...mapState(['count', 'money', 'cartObj'])
    },
    methods: {
      beforeDrop(el) {
        let count = this.balls.length;
        while (count--) {
          let temp = this.balls[count];
          let rect = this.cartObj.target.getBoundingClientRect();
          let x = -(window.innerWidth - rect.left - window.innerWidth * 0.275 - 16);
          let y = -(window.innerHeight - rect.top - 22);
          if (temp.flag) {
            el.style.display = '';
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            let inner = el.querySelector('.inner');
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      drop(el, done) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        el.style.webkitTransform = 'translate3d(0, 0, 0)';
        el.style.transform = 'translate3d(0, 0, 0)';
        let inner = el.querySelector('.inner');
        inner.style.webkitTransform = 'translate3d(0, 0, 0)';
        inner.style.transform = 'translate3d(0, 0, 0)';
        el.addEventListener('webkitTransitionEnd', done, false);
        el.addEventListener('transitionend', done, false);
        inner.addEventListener('webkitTransitionEnd', done, false);
        inner.addEventListener('transitionend', done, false);
      },
      afterDrop(el) {
        let ball = this.dropBall.shift();
        if (ball) {
          ball.flag = false;
          el.style.display = 'none';
        }
      },
      _drop() {
        for (let i = 0, len = this.balls.length; i < len; i++) {
          let temp = this.balls[i];
          if (!temp.flag) {
            temp.flag = true;
            this.dropBall.push(temp);
            return;
          }
        }
      }
    },
    watch: {
      cartObj: {
        handler(val, oldVal) {
          // 放到回调里的原因是进行性能处理
          this.$nextTick(() => {
            this._drop();
          });
        },
        deep: true
      }
    }
  };
</script>

<style lang="scss">
  @import "../../common/scss/common";

  .menu-wrap {
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 45px;
    background: linear-gradient(#fefefe, #f6f4f3, #fdfcfc);
    box-shadow: 0 0 1px #dcdfe2;
    .menu-box {
      display: flex;
      width: 100%;
      height: 100%;
      .menu-item {
        flex: 1;
        height: 100%;
        font-size: 10px;
        color: $fs95;
        .money {
          color: $fse5;
        }
        &.router-link-active {
          color: $fse5;
          .home {
            background-image: url(home_a.png);
          }
          .mall {
            background-image: url(mall_a.png);
          }
          .shop {
            background-image: url(shop_a.png);
          }
          .cart {
            background-image: url(cart_a.png);
          }
          .mine {
            background-image: url(mine_a.png);
          }
        }
        .icon {
          position: relative;
          display: block;
          width: 23px;
          height: 23px;
          margin: 3px auto 2px;
          @include bg;
        }
        .txt {
          text-align: center;
        }
        .home {
          background-image: url(home_d.png);
        }
        .mall {
          background-image: url(mall_d.png);
        }
        .shop {
          background-image: url(shop_d.png);
        }
        .cart {
          background-image: url(cart_d.png);
          .num {
            position: absolute;
            right: -8px;
            top: 0;
            text-align: center;
            padding: 3px 6px;
            font-size: 12px;
            color: $fsff;
            transform: scale(0.6);
            border-radius: 100px;
            background: $bge5;
          }
        }
        .mine {
          background-image: url(mine_d.png);
        }
      }
    }
    .ball-wrap {
      position: fixed;
      right: 27.5%;
      bottom: 22px;
      z-index: 1;
      transition: all .4s cubic-bezier(.49, -.29, .75, .41);
      .inner {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: $bge5;
        transition: all .4s linear;
      }
    }
  }
</style>
