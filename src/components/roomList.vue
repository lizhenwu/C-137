<template>
  <div class='side-bar'>
    <div class="btn">
      <span>
        <i class="iconfont">&#xe746;</i>
      </span>
    </div>
    <div class="online-numbers">
      <span>0 online</span>
    </div>
    <div class="btn">

    </div>
    <div class="btn">
      +
    </div>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less" scoped>
  .side-bar{
    color: hsla(0,0,100%,.3);
    background: #434140;
    height: 100vh;
    width: 70px;
    margin: 0;
    padding: 20px 10px;
    & div{
      margin-bottom: 20px;
    }
    .btn{
      cursor: pointer;
      margin-bottom: 10px; 
      height: 50px;
      width: 50px;
      text-align: center;   // 让span居中
      // font-size: 50px;
      // text-transform: uppercase;
      border-radius: 50%;
      & span{
        display: block;
        margin-top: 10px;
        padding: 10px;
        border-radius: 50%;
        background: lighten(#434140, 10%);
        color: #F5EBC7;
        transition: all .3s ease;
        &:hover{
          border-radius: 10px;
          background-color: #63A69A;
          transition: all .3s ease-in-out;
        }
        & .iconfont{
          font-size: 30px;
        }
      }
    }
    .online-numbers{
      font-size: 8px;
      white-space: nowrap;
      text-transform: uppercase;
      overflow-x: visible;
    } 
  }
  div:nth-of-type(3){
    background: url(https://cdn.discordapp.com/icons/325477692906536972/75523e3c0f68b7e092c9ca6c7ee09ecc.png);
    background-size: cover;
  }
  div:last-of-type.btn{
    background-color: transparent;
    transition: all .3s ease;
    border: 1px dashed lighten(#434140, 30%);
    font-size: 30px;
    // line-height: 150%;
    &:hover{
      color: #fff;
      border-color: #fff;
      transition: all .3s ease;
    } 
  }
</style>
