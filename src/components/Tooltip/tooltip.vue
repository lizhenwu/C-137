<template>
  <transition name="tooltip">
      <div v-show="visible" class="tooltip" :style="positionStyle" :class="position">
          {{content}}
          <div class="tooltip-arrow"></div>
      </div>
  </transition>
</template>
<script>
import debounce from '../../utils/debounce'
export default {
  data: function() {
      return {
          content: '',
          position: '',
          positionStyle: {},
          visible: false,
          closed: false,
          timeDelay: 0
      }
  },
  watch:{
  },
  mounted() {
      this.$el.addEventListener('mouseover', this.handleShow)
      this.$el.addEventListener('mouseout', this.handleClose)
  },
  created() {
      this.debounceClose = debounce(this.close, 200);
  },
  methods: {
      close() {
          if(this.state) return;
          this.visible = false;
      },
      handleShow() {
          this.state = true;
      },
      handleClose() {
          clearTimeout(this.timer);
          this.state = false;
          this.debounceClose();
          
      }
  }
}
</script>
<style lang="less" scoped>
    .tooltip{
        position: absolute;
        border-radius: 4px;
        background: darken(#434140, 30%);
        padding: 5px 10px;
        color: #fff;
        font-size: 12px;
        z-index: 2000;
        box-shadow: 0 2px 4px black;
        .tooltip-arrow{
            position: absolute;
            background: transparent;
            border: 8px solid transparent;
        }
    }
    .right{
        margin-left: 10px; 
        .tooltip-arrow{
            left: -16px;
            top: calc(~"50% - 6px");
            border-right: 8px solid darken(#434140, 30%);
        }
    }
    .left{
        margin-left: -10px;
        transform: translateX(-100%);
        .tooltip-arrow{
            right: -16px;
            top: calc(~"50% - 6px");
            border-left: 8px solid darken(#434140, 30%);
        }
    }
    .top{
        margin-top: -10px;
        transform: translate3d(calc(~"-50% + 10px"), -100%, 0);
        .tooltip-arrow{
            right: calc(~"50% - 6px");
            bottom: -16px;
            border-top: 8px solid darken(#434140, 30%);
        }
    }
    .bottom{
        margin-top: 10px;
        transform: translate3d(calc(~"-50% + 10px"), 0, 0);
        .tooltip-arrow{
            right: 50%;
            top: -16px;
            transform: translate3d(8px, 0, 0);
            border-bottom: 8px solid darken(#434140, 30%);
        }
    }
    .tooltip-leave-to, .tooltip-enter{
        opacity: 0;
        // transform: translate3d(0, -100%, 0);
    }
    .tooltip-enter-active, .tooltip-leave-active{
        transition: transform .4s ease, opacity .3s ease;
    }
</style>


