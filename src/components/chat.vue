<template>
    <main>
        <!-- <room-list></room-list> -->
        <div class="blur-container" :class="{'blur': isSettingsShown}">
        <side-bar v-on:roomPage="toggleRoomPage" v-on:showSettings = toggleSettings v-on:showSystemSettings = toggleSysSets>
        </side-bar>
        <div class="main-container">
            <tool-bar :room-title="insideRoom ? roomData.name : 'Welcome'" :notice="insideRoom ? roomData.notice : ''" v-on:showOnline="toggleOnline"></tool-bar>
            <div class="content">
                <msg v-if="insideRoom"></msg>
                <div class="home" v-else>
                    <loading v-if="loadingPosition === 'content'"></loading>
                    <span v-else>选择一个房间开始聊天吧!</span>
                </div>
                <!-- 在线用户信息 -->
                <online v-show="isOnlineShown"></online>
            </div>
        </div>
        </div>
        <transition name="dialog">
        <my-dialog v-show="isSettingsShown">
            <header slot="header">
                <span>{{dialogTitle}}</span>
                <i class="iconfont icon-guanbi" @click="toggleSettings"></i>
            </header>
            <component v-bind:is="currentView"></component>
        </my-dialog>
        </transition>
    </main>
</template>
<script>
    import loading from './loading';
    import roomSets from './roomSets'; 
    import systemSets from './systemSets';
    import sideBar from './sideBar';
    import userSets from './userSets';
    import myDialog from './dialog';
    import roomList from './roomList.vue';
    import online from './online.vue';
    import toolBar from './toolBar';
    import msg from './msg.vue';
    import { mapActions, mapState, mapGetters } from "vuex";
    export default {
        data:function(){
            return {
                counter: 0,
                move:false,
                isOnlineShown: true,
                isSettingsShown: false,
                dialogTitle: '',
                currentView: ''
            }
        },
        computed: {
            ...mapState([
                'socket',
                'onlineUsers',
                'insideRoom',
                'loadingPosition'
            ]),
            ...mapGetters([
                'roomData'
            ])
        },
        methods:{
            toggleOnline() {
                this.isOnlineShown = !this.isOnlineShown;
            },
            toggleRoomPage() {
                this.isSettingsShown = !this.isSettingsShown;
                this.currentView = this.isSettingsShown ? 'roomSets' : '';
                this.dialogTitle = this.isSettingsShown ? '创建群组' : '';
            },
            toggleSettings() {
                this.isSettingsShown = !this.isSettingsShown;
                this.currentView = this.isSettingsShown ? 'userSets' : '';
                this.dialogTitle = this.isSettingsShown ? '个人设置' : '';
            },
            toggleSysSets() {
                this.isSettingsShown = !this.isSettingsShown;
                this.currentView = this.isSettingsShown ? 'systemSets' : '';
                this.dialogTitle = this.isSettingsShown ? '系统设置' : '';
            },
            logout:function(){
                let vm = this;
                vm.$axios({
                    method:'get',
                    url:'/api/logout',
                    headers: {
                        'Authorization': `Bearer ${localStorage.token}` // 必须加前面的Bearer
                    }
                }).then(function(response){
                    if (response.status == 200 && response.data == "log out success") {
                        console.log('logout')
                        vm.$router.push({path:'/'})
                    }
                }).catch(function (err) {
                    console.log(err);
                })
            },
            ...mapActions([
                'socketInit'
            ])
        },
        components:{roomList, online, msg, toolBar, myDialog, userSets, sideBar, systemSets, roomSets, loading}
    }
</script>
<style lang="less" scoped>
    main{
        height: calc(~"100% - 40px");
        width: 1200px;
        margin: 0 auto;
        margin-top: 15px;
        position: relative;
        .blur-container{
            display: flex;
            width: 100%;
            height: 100%;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.6);
        }
    }
    .blur-container.blur{
        margin: -10px -10xp -10px -10px;
        pointer-events: none;
        animation: goblur .2s cubic-bezier(.43,.9,.75,1.01) 1;
        animation-fill-mode: forwards;
    }
    .dialog-enter, .dialog-leave-to{
        transform: scale(1.1);
        opacity: 0;
    }
    .dialog-enter-active, .dialog-leave-active{
        transition: all .2s cubic-bezier(.43,.9,.75,1.01);
    }
    .main-container{
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        .content{
            display: flex;
            flex: 1 1 auto; 
            margin-top: 1px;
        }
    }
    .home{
        display: flex;
        position: relative;
        background: #434140;
        color: hsla(0, 0, 100%, .9);;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        &::before{
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            margin: auto;
            background-image: url(https://i.loli.net/2018/03/14/5aa8d55242559.png);
            background-position: center;
            background-repeat: no-repeat;
            filter: grayscale(100%);
            opacity: .18;
        }
        span{
            margin-top: -100px;
        }
    }
    @media screen and (max-width: 1320px) {
        main{
            margin: 0;
            height: 100%;
            width: 100%;
        }
    }
    @keyframes goblur{
        from{
            // filter: none;
            // box-shadow: 0 2px 12px 0 rgba(0,0,0,.6);
        }
        to{
            filter: blur(3px);
            box-shadow: none;
        }
    }
</style>