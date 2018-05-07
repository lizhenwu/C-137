<template>
  <header>
      <div class="title">
        <i @click="toggleSiderBar" :class="siderBarCollapsed ? 'jiantou-left' : 'jiantou-right'" class="iconfont icon-jiantouxia show-in-s"></i>
        <h3>{{roomTitle}}</h3>
        <span v-if="notice !== ''" title="公告">{{notice}}</span>
      </div>
      <div class="bar-items">
        <i class="iconfont" v-toolTip:bottom="'待定'">&#xe627;</i>
        <i v-on:click="changeDisplay" class="iconfont" v-toolTip:bottom="'收起/显示群组列表'">&#xe746;</i>
        <span ref="searchBox">
            <input type="text" id="test" autocomplete="off" @blur="toggleSearch" placeholder="Search" v-model="name" v-toolTip:bottom="'查找成员todo'" @input="search">
            <i class="iconfont" @click="toggleSearch">&#xe632;</i>
            <div v-if="name !== ''" ref="searchContent" class="members-group">
                <strong v-if="seachRoomResult.length > 0">ROOMS</strong>
                <ul :key="item" v-for="item in seachRoomResult">
                    <li>{{item.name}}</li>
                </ul>
                <strong v-if="seachUserResult.length > 0">USERS</strong>
                <ul class="members-list">
                    <li class="member-info" :key="item.nickName" v-for="item of seachUserResult">
                    <div class="avatar avatar-s" :style="{backgroundImage: `url(${item.avatar})`}">
                    </div>
                    <span class="member-id">{{item.nickName}}</span>
                    </li>
                </ul>
            </div>
        </span>
        <i class="iconfont" v-toolTip:bottom="'群组信息todo'">&#xe64c;</i>
      </div>
  </header>
</template>
<script>
import {mapState, mapMutations} from 'vuex';
import throttle from '../utils/throttle';
export default {
  data: function() {
      return {
          name: '',
          seachRoomResult: [],
          seachUserResult: []
      }
  },
  props: ['roomTitle', 'notice'],
  computed: {
      ...mapState([
          'siderBarCollapsed',
          'socket'
      ])
  },
  methods: {
      ...mapMutations({
          toggleSiderBar: 'TOGGLE_SIDE_BAR'
      }),
      changeDisplay() {
          this.count++;
          this.$emit('showOnline');
      },
      toggleSearch() {
          this.name = '';
          if(window.innerWidth > 900) {
              return;
          }
          let box = this.$refs.searchBox;
          if(!box.classList.toggle('search-s')) {
              return;
          };
          box.getElementsByTagName('input')[0].focus();
      },
      search: throttle(function() {
          if(!this.name) return;
          let loading = this.$loading('searchContent');
          this.socket.emit('search', this.name, data => {
              if(data.err) {
                  this.$message({
                      type: 'error',
                      message: data.err
                  })
              };
              this.seachRoomResult = data.rooms;
              this.seachUserResult = data.users;
              loading.close();
          });
      }, 300)
  }
}
</script>
<style lang="less" scoped>
header{
    display: flex;
    position: relative;
    flex-shrink: 0;
    // width: 100%;
    padding: 10px 10px;
    justify-content: space-between;
    background-color: #434140;
    color: hsla(0, 0, 100%, .7);
    box-shadow: 0 1px 0px rgba(0, 0, 0, .6), 0 2px 0px rgba(0, 0, 0, .4);
    i{
        font-size: 1.3em;
        user-select: none;
        margin: 0 5px;
        cursor: pointer;
        &:hover{
            color: #fff;
        }
    }
    .title{
        display: flex;
        overflow: hidden;
        align-items: center;
        .iconfont{
            margin: 0 10px;
            display: none;
        }
        h3{
            display: inline-block;
            color: hsla(0, 0, 100%, .9);
            margin: 0 10px;
            line-height: 40px;
            overflow: hidden;
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
        .search-s{
            position: absolute;
            top: 0;
            left: 0px;
            right: 0px;
        }
        span{
            position: relative;
            margin: 0 5px;
            .members-group{
                padding: 10px;
                // display: none;
                position: absolute;
                margin-top: 1em;
                top: 100%;
                left: 0;
                right: 0;
                min-height: 200px;
                background:#434140;
                border-radius: 4px;
                box-shadow: 0 0 6px 0px  rgba(0, 0, 0, .4);
                z-index: 1;
                ul{
                    li{
                        cursor: pointer;
                        border-radius: 3px;
                        padding: 4px;
                    }
                }
            }
            strong{
                color: rgba(255, 255, 255, .3)
            }
        }
        input{
            right: 0;
            outline: none;
            border: none;
            border-radius: 3px;
            background: lighten(#434140, 15%);
            color: #fff;
            padding: 5px 25px 5px 10px;
            width: 150px;
            transition: all .2s ease-out;
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
                top: 3px;
            }
        }
    }
}
@media screen and (max-width: 900px) {
  .title span {
    display: none;
  }
  header .bar-items span{
    //   font-size: 1.5rem;
      input{
          position: absolute;
          font-size: 1.5rem
      }
  }
  header .bar-items :not(.search-s) {
    input{
      width: 0;
      padding: 0;
      overflow: hidden;
      transition: 0s;
      &+i {
        position: static;
        color: inherit;
        margin-top: 5px; 
      }
    }
  }
  header .bar-items .search-s{
      width: 100%;
      height: 100%;
      margin: 0;
    //   transition: all .4s ease;
      input{
          width: 100% !important;
          height: 100%;
          padding-bottom: 0;
          transition: all .2s cubic-bezier(.08,.74,.37,.94);
          &+i{
              top: 30%;
          }
      }
  }
}
</style>
<style lang="less">
</style>


