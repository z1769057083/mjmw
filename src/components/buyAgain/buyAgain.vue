<template>
  <div class="buyAgain-wrap">
    <!-- 头部信息 -->
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">再次购买</p>
    </header>
    <!-- 主体内容 -->
    <div class="nothing-wrap">
      <div class="alert">
        <div class="title">抱歉</div>
        <div class="cont">
          <p class="txt">您需要购买的此商品已下架。</p>
          <router-link :to="{name: 'home'}" class="btn btn-go">重新选购</router-link>
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
  </div>
</template>

<script>
  import api from '../../api';

  export default {
    data() {
      return {
        tui: []
      };
    },
    methods: {
      // 获取推荐商品列表
      getTui() {
        this.$http.post(api.recommentData).then((res) => {
          if (res.data.err_code == 200) {
            res = res.data.data;
            this.tui = res.items;
          }
        });
      }
    },
    mounted() {
      this.getTui();
    }
  };
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .buyAgain-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 46px;
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
          font-size: 15px;
          color: $fse5;
          background: $bgff;
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
