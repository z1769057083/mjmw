<template>
  <div class="nick-wrap">
    <header class="head-wrap">
      <a class="back pos" @click="$router.back()"></a>
      <p class="txt">我的钱包</p>
    </header>
    <div class="wallet_con">
      <div class="wallet_box">
        <ul class="ay_wa_mlist">
          <!--<li class=" temp_li">-->
          <!--<i class="temp_i bank_i"></i>-->
          <!--<span class="te_sp">银行卡</span>-->
          <!--<a href="javascript:;" class="liwe_a"></a>-->
          <!--</li>-->
          <li class="temp_li">
            <i class="temp_i mj_i"></i>
            <span class="te_sp">美家钻</span>
            <router-link :to="{name: 'mjz'}" class="liwe_a"></router-link>
          </li>
          <li class="temp_li">
            <i class="temp_i libank_i"></i>
            <span class="te_sp">交易记录</span>
            <router-link :to="{name: 'record'}" class="liwe_a" tag="a"></router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {};
</script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .nick-wrap {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $bgec;
    .head-wrap {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 40px;
      line-height: 40px;
      @include bg(65px 15px);
      background-color: $bgff;
      box-shadow: inset 0 -1px 0 $bsdc;
      .pos {
        position: absolute;
        top: 50%;
        width: 30px;
        height: 30px;
        margin-top: -16px;
        @include bg(23px 23px);
      }
      .back {
        left: 9px;
        background-image: url("i_left_arrow.png");
      }
      .txt {
        text-align: center;
        padding: 0 40px;
        color: $fse5;
        @extend .dot;
      }
    }
    .wallet_con {
      position: absolute;
      left: 0;
      top: 40px;
      right: 0;
      bottom: 0;
      overflow: hidden;
      .wallet_box {
        padding: 5px;
      }
    }
    .ay_wa_mlist {
      width: 100%;
      .temp_li {
        display: flex;
        align-items: center;
        height: 40px;
        background: $bgff;
        border-radius: $br6;
        margin-bottom: 5px;
        .te_sp {
          height: 13px;
          flex-grow: 1;
          font-size: 13px;
          color: $fs31;
          line-height: 13px;
          margin-top: 2px;
        }
        .liwe_a {
          width: 30px;
          height: 30px;
          @include bg(23px 23px);
          background-image: url("i_left.png");
        }
        .temp_i {
          margin-left: 3px;
          margin-right: 5px;
          width: 30px;
          height: 30px;
        }
      }
      .bank_i {
        @include bg(23px 23px);
        background-image: url("i_bankb.png");
      }
      .mj_i {
        @include bg(23px 23px);
        background-image: url("i_mj.png");
      }
      .libank_i {
        @include bg(23px 23px);
        background-image: url("i_record.png");
      }
    }
  }
</style>
