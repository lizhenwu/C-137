<template>
<transition name="message">
  <div class="message" v-show="visible" :class="type">
      <i class="iconfont" :class="`icon-${typeClasses[type]}`"></i>
      <span>{{message}}</span>
  </div>
</transition>
</template>
<script>
const typeClasses = {
    success: 'yuanxingxuanzhongfill',
    error: 'guanbi2fill',
    info: 'tishifill',
    unkonwn: 'wenhaofill'
}
export default {
  data: function() {
      return {
          duration: 2000,
          type: '',
          message: '',
          closed: false,
          visible: false,
          typeClasses: typeClasses
      }
  },
  watch: {
      closed(newVal) {
          if(newVal) {
              this.visible = false;
              this.$el.addEventListener('transitionend', this.destroy)  
          }
      }
  },
  methods: {
    close() {
        this.closed = true;
    },
    destroy() {
        this.$el.removeEventListener('transitionend', this.destroy);
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el)
    }
  },
  mounted() {
      if(this.duration > 0) {
          this.timer = setTimeout(() => {
              this.close();
              clearTimeout(this.timer);
          }, this.duration)
      }
  }
}
</script>
<style lang="less" scoped>
.message{
    min-width: 150px;
    padding: 5px 10px;
    font-size: 12px;
    position: fixed;
    margin: 0 auto;
    border-radius: 4px;
    display: flex; 
    top: 20px;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, .5); 
    i{
        margin-right: 1em
    }  
}
.message-enter, .message-leave-to {
    transform: translate3d(-50%, -100%, 0);
    opacity: 0;
}
.message-leave-active, .message-enter-active {
    transition: transform .4s ease, opacity .3s ease;
}
.error{
    background: lighten(#F2695C, 25%);
    color: #F2695C;
}
.success{
    background: lighten(#C7D0C0, 15%);
    color: darken(#C7D0C0, 35%)
}
.info{
    background: #ebeef5;
    color: rgba(0, 0, 0, .6);
}
</style>

