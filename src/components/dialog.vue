<template>
  <div class="dialog">
      <slot name="header"></slot>
      <slot></slot>
  </div>
</template>
<script>
export default {
  
}
</script>
<style lang="less" scoped>
.dialog{
    display: flex;
    flex-direction: column;
    min-width: 360px;
    min-height: 300px;
    width: 40%;
    height: 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0; 
    margin: auto;
    z-index: 1000;
    background: darken(#434140, 10%);
    color: #fff;
    border-radius: 3px;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, .4);
    header{
        display: flex;
        flex-shrink: 0;
        justify-content: flex-end;
        padding: 10px 20px;
        span{
            flex-grow: 1; 
            display: flex;
            justify-content: center;
            line-height: 1.5;
            margin-left: 24px
        }
        i{
            font-size: .75rem;
            display: inline-block;
            // position: relative;
            right: 0;
            padding: 6px;
            border-radius: 50%;
            border: 2px solid #434140;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            &:hover{
                background-color: rgba(255, 255, 255, .1);
                color: rgba(255, 255, 255, 0.8);
                transition: all .2s ease;
            }
        }
    }
}
@media screen and (max-width: 645px){
    .dialog{
        width: 100%;
        height: 60%;
        min-height: 400px;
    }
}
</style>
