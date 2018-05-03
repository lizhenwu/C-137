<template>
  <div class="side-bar" :class="siderBarCollapsed ? 'sideBar-collapse' : ''">
            <header class="header" @click.stop="showMenu">
                <span>C-137</span>
                <i class="iconfont icon-menu" v-toolTip:right="'菜单'"></i>
            </header>
            <transition name="menu">
            <div class="menu" v-if="isMenuShow">
                <ul class="menu-items">
                    <li @click="toggleRoomPage">创建群组</li>
                    <li @click="toggleSystemSettings">设置</li>
                    <li @click="signOut">注销</li>
                    <li>关于</li>
                </ul>
            </div>
            </transition>
            <div class="list">
                <ul :style="{height: `${rooms.length*42}px`}">
                    <li :class="{'active': roomData && roomData.name === item.name}" :style="{top: `${index*42}px`}" :key="index" v-for="(item, index) of rooms" @click="enterRoom(item.name, index)">{{item.name}}</li>
                    <li class="wrapper" :style="wrapperStyle"></li>
                </ul>
            </div>
            <div class="user-board">
              <div ref="userInfo" class="user-info normal-flex-box">
                <div class="avatar" :style="{backgroundImage: `url(${avatar})`}">
                  <i class="current-state" :style="{background: states[currentState]}"></i>
                </div>
                <span>{{user}}</span>
              </div>
              <div ref="states" @click="changeState" class="states normal-flex-box hidden">
                <span data-state="online"><i></i>在线</span>
                <span data-state="hidden"><i></i>隐身</span>
                <span data-state="nodisturb"><i></i>勿扰</span>
              </div>
              <span class="btn">
                  <i class="iconfont" v-toolTip:top="'状态设置'" @click="showStates">&#xe73a;</i>
                  <i class="iconfont" @click="toggleSettings" v-toolTip:top="'个人设置'">&#xe74c;</i>
              </span>
            </div>
        </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import {states} from '../utils/data';
export default {
  data: function() {
    return {
      isMenuShow: false,
      states: states,
      y: 0,
      wrapperStyle: {
        transform: `translate3d(0, -120%, 0)`
      }
    };
  },
  computed: {
    ...mapState(["socket", "user", "avatar", "rooms", "insideRoom", 'currentState', 'siderBarCollapsed']),
    ...mapGetters(["roomData"]),
  },
  watch: {
    currentState: function(newVal, oldVal) {
      this.socket.emit('state change', newVal, function(data) {
        if(data.err) {
          this.$message({
            type: 'error',
            message: '操作失败'
          })
        }
        return;
      })
    }
  },
  methods: {
    showMenu() {
      this.isMenuShow = !this.isMenuShow;
    },
    showStates() {
      this.$refs.userInfo.classList.toggle('hidden');
      this.$refs.states.classList.toggle('hidden');
    },
    changeWrapperPosition(i){
      let y = i * 42 + 'px';
      this.wrapperStyle.transform = `translate3d(0, ${y}, 0)`;
    },
    changeState(e) {
      this.$store.commit('CHANGE_STATE', {
        state: e.target.dataset.state
      });
      this.showStates();
    },
    toggleRoomPage() {
      this.$emit("roomPage");
    },
    toggleSettings() {
      this.$emit("showSettings");
    },
    toggleSystemSettings() {
      this.$emit("showSystemSettings");
    },
    signOut() {
      this.socket.disconnect();
      this.$message({
        type: 'info',
        message: '已注销登录'
      })
      this.$store.commit('RESET_STATE');
      this.$router.push({path: '/'});
    },
    enterRoom(roomName, index) {
      this.$store.commit('LEAVE_ROOM');
      this.$store.commit('START_LOADING', 'content');
      let idx = this.rooms.findIndex(i => i.name === roomName);
      if (!this.rooms[idx].entered) {
        this.socket.emit("enter room", roomName, data => {
          if (data.err) {
            return this.$message({
              type: "error",
              message: data.err
            });
          }
          this.$store.commit("ENTER_ROOM");
          this.$store.commit('CHANGE_ROOM', {
            idx: idx,
            roomData: data.roomData
          });
          this.$store.commit('STOP_LOADING');
          this.changeWrapperPosition(index);
        });
      } else {
        this.$store.commit("ENTER_ROOM");
        this.$store.commit('CHANGE_ROOM', { idx: idx });
        this.$store.commit('STOP_LOADING');
        this.changeWrapperPosition(index);
      }
    },
    // 要看看vue对列表元素的事件绑定机制
  },
  mounted() {
    document.body.addEventListener("click", e => {
      if (this.isMenuShow) {
        this.isMenuShow = false;
      }
    });
  }
};
</script>
<style lang="less" scoped>
.side-bar {
  height: 100%;
  position: relative;
  background-color: darken(#434140, 10%);
  color: #f6f6f7;
  i {
    opacity: 0.6;
    user-select: none;
    padding: 5px;
  }
  .header {
    font-size: 16px;
    padding: 10px 20px;
    line-height: 40px;
    box-shadow: 0 1px 0px darken(#434140, 15%);
    transition: all 0.2s ease;
    font-weight: 500;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      background-color: darken(#434140, 12%);
      transition: all 0.2s ease;
    }
    span {
      flex: 1;
    }
    i{
      line-height: initial;
      display: inline-block;
    }
  }
  ul{
    li{
      padding: 5px 10px;
      cursor: pointer;
    }
  }
  .list {
    margin-top: 2em;
    padding: 10px;
    .wrapper{
      top: 0;
      left: 0;
      height: 42px;
      z-index: 0;
      width: 100%;
      transition: transform .3s ease;
      background: #F5EBC7;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 4px 6px;
    }
    ul {
    list-style: none;
    padding: 0;
    position: relative;
    overflow: hidden;
    li {
      display: block;
      border-radius: 5px;
      position: absolute;
      left: 0;
      width: 100%;
      z-index: 1;
      // height: 32px;
      line-height: 32px;
      opacity: 0.7;
      transition: all .3s ease;
      &.active{
        color: black;
      }
      &:not(.active):hover {
        
        opacity: 0.8;
        background-color: #434140;
      }
    }
    // li.active {
    //   opacity: 1;
    //   background-color: lighten(#434140, 10%);
    // }
  }
  }
  
  .menu {
    z-index: 100;
    position: absolute;
    background-color: #fff;
    border-radius: 2px;
    right: 2em;
    top: 35px;
    color: lighten(#434140, 0.1);
    li {
      width: 10em;
      line-height: 30px;
      &:hover {
        background-color: rgba(191, 152, 143, 0.2);
      }
    }
    .menu-items{
      margin: 1em 0;
    }
  }
  .user-board {
    position: absolute;
    left: 0;
    bottom: 0;
    background: darken(#434140, 15%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .user-info{
      transition: all .5s ease;
    }
    .hidden.user-info{
      transform: scale(0);
    }
    .states{
      font-size: 12px;
      line-height: 50px;
      overflow: hidden;
      white-space: nowrap;
      span{
        transition: all .5s ease;
        cursor: pointer;
        margin: 0 6px;
        color: hsla(0, 100%, 100%, .6);
        &:hover{
          color: #fff;
        }
        i{
          height: 10px;
          width: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 10px;
          pointer-events: none;
          opacity: 1;
        }
      }
      span:nth-of-type(1) {
        i{
          background: #43b581;
        }
      }
      span:nth-of-type(3) {
        i{
          background: #f04747;
        }
      }
      span:nth-of-type(2) {
        i{
          background: #747f8d;
        }
      }
    }
    .hidden.states{
      span:nth-of-type(1){
        transform: translate3d(200%, 0, 0);
      }
      span:nth-of-type(2){
        transform: translate3d(100%, 0, 0);
      }
      span:nth-of-type(3){
        transform: translate3d(0%, 0, 0);
      }
    }
    .btn {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
      margin-right: 15px;
      i {
        cursor: pointer;
        border-radius: 3px;
        &:hover {
          background: darken(#434140, 17%);
          opacity: 1;
          transition: all 0.1s ease;
        }
      }
    }
  }
}
.menu-enter {
  transform: scale(0);
  // transform-origin: top right;
}
.menu-enter-active {
  transform-origin: top right;
  transition: transform 0.35s cubic-bezier(0.43, 0.9, 0.75, 1.01);
}
.showSideBar{
  display: flex;

}
@media screen and (max-width: 645px){

}
</style>

