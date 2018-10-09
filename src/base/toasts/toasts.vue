<template>
  <div class="toasts-wrap">
    <div class="alert">
      <div class="title">
        <slot name="icon"><i class="icon"></i></slot>
      </div>
      <div class="cont">
        <div class="zw-10"></div>
        <slot name="txt" class="txt">恭喜你，操作成功</slot>
        <slot name="btn" class="btn">确定</slot>
      </div>
    </div>
  </div>
</template>

<script></script>

<style scoped lang="scss">
  @import "../../common/scss/common";

  .toasts-wrap {
    position: fixed;
    left: 0;
    top: 40px;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(236, 240, 240, .8);
    .zw-10 {
      height: 10px;
    }
    .alert {
      width: 298px;
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
        .icon {
          width: 30px;
          height: 30px;
          @include bg;
          background-image: url(i_right.png);
        }
      }
      .cont {
        margin-top: 1px;
        padding-bottom: 10px;
        background: $bgff;
        .txt {
          padding: 20px 15px;
          line-height: 1.2;
          text-align: center;
          font-size: 13px;
          color: $fs31;
        }
        .color {
          color: $fse5;
        }
        .btn {
          display: block;
          width: 274px;
          height: 48px;
          line-height: 48px;
          text-align: center;
          margin: 10px auto 0;
          font-size: 13px;
          color: $fse5;
          border: 1px solid $bddc;
          border-radius: 50px;
          overflow: hidden;
        }
      }
    }
  }
</style>
