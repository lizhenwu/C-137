<template>
  <header>
      <div class="title">
        <h3>{{roomTitle}}</h3>
        <span v-if="notice !== ''" title="公告">{{notice}}</span>
      </div>
      <div class="bar-items">
        <i class="iconfont" title="todo">&#xe627;</i>
        <i v-on:click="changeDisplay" class="iconfont" title="收起/显示群组列表">&#xe746;</i>
        <span>
            <input type="text" placeholder="Search" title="查找成员todo">
            <i class="iconfont">&#xe632;</i>
        </span>
        <i class="iconfont" title="群组信息todo">&#xe64c;</i>
      </div>
  </header>
</template>
<script>
export default {
  props: ['roomTitle', 'notice'],
  methods: {
      changeDisplay() {
        this.count++;
        this.$emit('showOnline');
      }
  }
}
</script>
<style lang="less" scoped>
header{
    display: flex;
    flex-shrink: 0;
    width: 100%;
    padding: 10px 10px;
    justify-content: space-between;
    background-color: #434140;
    color: hsla(0, 0, 100%, .7);
    box-shadow: 0 1px 0px rgba(0, 0, 0, .6), 0 2px 0px rgba(0, 0, 0, .4);
    .title{
        h3{
            display: inline-block;
            color: hsla(0, 0, 100%, .9);
            margin: 0 10px;
            line-height: 40px;
        }
        span{
            font-size: 14px;
            position: relative;
            padding: 5px 1em;
            font-size: 14px;
            &::before{
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 1px;
                height: 100%;
                background: hsla(0,0%,100%, .2);
            }
        }
    }
    .bar-items{
        display: flex;
        align-items: center;
        span{
            position: relative;
            margin: 0 5px;
        }
        input{
            outline: none;
            border: none;
            border-radius: 3px;
            background: lighten(#434140, 15%);
            color: #fff;
            padding: 5px 25px 5px 10px;
            width: 150px;
            transition: width .2s ease-out;
            &::-webkit-input-placeholder{
                color: hsla(0, 0, 100%, .4);
            }
            &:focus{
                width: 250px;
                transition: width .2s ease;
            }
            &+i{
                color: hsla(0, 0, 100%, .4);
                position: absolute;
                right: 3px;
                top: 5px;
            }
        }
        i{
            user-select: none;
            margin: 0 5px;
            cursor: pointer;
            &:hover{
                color: #fff;
            }
        }
    }
}
</style>

