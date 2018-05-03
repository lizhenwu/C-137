<template>
<div class="members-wrap">
  <div class="members-group">
    <header>当前在线</header>
    <ul class="members-list">
        <li class="member-info" :key="item.nickName" v-for="item of nonHidden(onlineUsers)">
        <div class="avatar" :style="{backgroundImage: `url(${item.avatar})`}">
            <i class="current-state" :style="{background: states[item.onlineState]}"></i>
        </div>
        <span class="member-id">{{item.nickName}}</span>
      </li>
    </ul>
  </div>
  <div class="members-group">
    <header>历史在线</header>
    <ul class="members-list">
        <li class="member-info" :key="item.nickName" v-for="item of previousUsers">
        <div class="avatar" :style="{backgroundImage: `url(${item.avatar})`}">
        </div>
        <span class="member-id">{{item.nickName}}</span>
      </li>
    </ul>
  </div>
    </div>
</template>
<script>
    import { mapState, mapGetters } from "vuex";
    import {states} from '../utils/data';
    export default {    
        data: function() {
            return {
                states: states
            }
        }, 
        computed: {
            ...mapState([
                'onlineUsers',
                'previousUsers'
            ])
        },
        methods: {
            nonHidden: function(users) {
                return users.filter(function(user) {
                    return user.onlineState !== 'hidden';
                })
            }
        }
    }

    
</script>
<style lang="less" scoped> 
    .members-wrap{
        flex: 0 0 auto;  // 阻止flex缩放
        flex-basis: 240px;
        background-color: darken(#434140, 5%);
        overflow-x: hidden;
        overflow-y: auto;
        transition: all .2s cubic-bezier(.08,.74,.37,.94);
    }
    .members-group{
        margin-bottom: 20px;
        // padding: 20px 15px;
        header{
            padding: 20px 15px;
        }
        .members-list{
            .member-info{
                padding: 5px 20px;
            }
        }
    }
    @media screen and (max-width: 900px){
        .members-wrap{
            flex-basis: 0;
        }
        .members-wrap.collapse{
            flex-basis: 100% !important;   
        }
    }
</style>
<style>
    
</style>
