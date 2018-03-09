<template>
<div class="members-wrap" id="right-drawer">
  <div class="members-group">
    <header>当前在线</header>
    <ul class="members-list">
        <li class="member-info" :key="index" v-for="(item, index) of onlineUsers">
        <div class="member-avatar" :style="{backgroundImage: `url(${item.avatar})`}"></div>
        <span class="member-id">{{item.nickName}}</span>
      </li>
    </ul>
  </div>
  <div class="members-group">
    <header>历史在线</header>
    <ul class="members-list">

    </ul>
  </div>
    </div>
</template>
<script>
    import { mapState } from "vuex";
    export default {        
        computed: mapState([
            'socket',
            'onlineUsers'
        ])
    }

    
</script>
<style lang="less" scoped> 
    .members-wrap{
        flex: 0 1 auto;
        flex-basis: 240px;
        background-color: darken(#434140, 5%);
        overflow-x: hidden;
        overflow-y: auto
    }
    .members-group{
        color: hsla(0, 0 , 100%, .7);
        margin-bottom: 20px;
        // padding: 20px 15px;
        header{
            padding: 20px 15px;
        }
        .members-list{
            list-style: none;
            margin: 0;
            padding: 0;
            li:hover{
                transition: all .3s ease;
                background-color: darken(#434140, 7%)
            }
            div{
                display: inline-block;
            }
            .member-info{
                padding: 5px 20px;
                cursor: pointer;
                display: flex;
                align-items: center
            }
            .member-avatar{
                height: 30px;
                width: 30px;
                border-radius: 50%;
                background: white;
                background-size: cover;
                margin-right: 10px;
            }
            .member-id{
                vertical-align: baseline
            }
        }
    }
</style>
