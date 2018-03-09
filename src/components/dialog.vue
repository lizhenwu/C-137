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
    // min-width: 400px;
    // min-height: 300px;
    width: 50%;
    height: 50%;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0; 
    margin: auto;
    z-index: 1000;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, .4);
    header{
        display: flex;
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
            padding: 4px;
            border-radius: 50%;
            border: 2px solid #434140;
            cursor: pointer;
            &:hover{
                background-color: rgba(0, 0, 0, .2);
                transition: background-color .2s ease;
            }
        }
    }
}
</style>
