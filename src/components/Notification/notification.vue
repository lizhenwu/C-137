<template>
  <transition name="notice">
  <div class="notification" v-show="visible" :style="positionStyle">
      <p>{{message}}</p>
      <i class="iconfont" @click.stop="close">&#xe624;</i>
  </div>
  </transition>
</template>
<script>
export default {
  data: function() {
    return {
      id: 0,
      message: "",
      duration: 4000,
      timer: null,
      onClose: null,
      visible: false,
      positionValue: 0,
      closed: false
    };
  },
  computed: {
    positionStyle: function() {
      if(!this.positionValue) {
        return {}
      }
      return {
        top: `${this.positionValue}px`
      }
    }
  },
  watch: {
    closed: function(newVal) {
      if(newVal) {
        this.$el.addEventListener('transitionend', this.destroy);
        this.visible = false;
      }
    }
  },
  methods: {
    destroy() {
      if (typeof this.onClose === "function") {
        this.onClose(this.id);
      }
      // this.$el.removeEventListener('transitionend', this.destroy)
      // 会使紧跟着它出现的notice不能触发transitionend事件
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.closed = true;
    },
    // 过渡动画的钩子函数无效
    // afterEnter(el) {
    //   console.log(el)
    // },
    // afterLeave(el) {
      // this.destroy();
      // console.log('aftertrans')
    // }
  },
  mounted() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }
};
</script>
<style lang="less" scoped>
.notification {
  display: flex;
  font-size: 14px;
  color: #606266;
  justify-content: space-between;
  padding: 10px 10px;
  align-items: center;
  position: fixed;
  top: 16px;
  right: 16px;
  height: 50px;
  width: 300px;
  border-radius: 3px;
  background: #f2ede4;
  box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
  i {
    cursor: pointer;
  }
}
.notice-enter{
  transform: scale(1.1);
}
.notice-enter, .notice-leave-to {
  opacity: 0;
}
.notice-enter-active, .notice-leave-active {
  transition: all 0.2s cubic-bezier(0.43, 0.9, 0.75, 1.01);
}
// .notice-enter{
//   transform: translate3d(0, 100%, 0);
// }
// .notice-enter, .notice-leave-to{
//   opacity: 0;
// }
// .notice-enter-active, .notice-leave-active{
//   transition: all .2s cubic-bezier(.43,.9,.75,1.01);
// }
</style>


