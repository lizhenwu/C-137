<template>
  <div class="side-bar">
            <header class="header" @click.stop="showMenu">
                <span>C-137</span>
                <i class="iconfont icon-jiantouxia" v-toolTip:right="'菜单'"></i>
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
                <ul>
                    <li :class="{'active': roomData && roomData.name === item.name}" :key="index" v-for="(item, index) of rooms" @click="enterRoom(item.name)">{{item.name}}</li>
                </ul>
            </div>
            <div class="user-board">
                <div class="avatar" :style="{backgroundImage: `url(${avatar})`}"></div>
                <span>{{user}}</span>
                <span class="btn">
                    <i class="iconfont" v-toolTip:top="'状态设置todo'">&#xe73a;</i>
                    <i class="iconfont" @click="toggleSettings" v-toolTip:top="'个人设置todo'">&#xe74c;</i>
                </span>
            </div>
        </div>
</template>
<script>
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
export default {
  data: function() {
    return {
      isMenuShow: false
    };
  },
  computed: {
    ...mapState(["socket", "user", "avatar", "rooms", "insideRoom"]),
    ...mapGetters(["roomData"])
  },
  methods: {
    showMenu() {
      this.isMenuShow = !this.isMenuShow;
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
      localStorage.user = '';
      localStorage.token = '';
      this.$message({
        type: 'info',
        message: '已注销登录'
      })
      this.$router.push({path: '/'});
    },
    enterRoom(roomName) {
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
        });
      } else {
        this.$store.commit("ENTER_ROOM");
        this.$store.commit('CHANGE_ROOM', { idx: idx });
        this.$store.commit('STOP_LOADING');
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
  min-width: 240px;
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
  .list {
    margin-top: 2em;
    padding: 10px;
  }
  ul {
    list-style: none;
    padding: 0;
    li {
      display: block;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      // height: 32px;
      line-height: 32px;
      opacity: 0.7;
      &:hover {
        opacity: 0.8;
        background-color: lighten(#434140, 5%);
      }
    }
    li.active {
      opacity: 1;
      background-color: lighten(#434140, 10%);
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
  }
  .user-board {
    position: absolute;
    left: 0;
    bottom: 0;
    background: darken(#434140, 15%);
    display: flex;
    align-items: center;
    width: 100%;
    .avatar {
      height: 30px;
      width: 30px;
      background: white;
      background-size: cover;
      border-radius: 50%;
      margin: 10px 20px;
      margin-right: 10px;
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
</style>

