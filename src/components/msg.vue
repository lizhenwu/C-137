<template>
        <div class="main">
            <loading v-if="loading"></loading>
            <div class="msg-wrapper" ref="msgWrapper">
            <ul class="msg-list">
            <li class="msg-list-item" :key="index" v-for="(msg, index) in currentMsgArr" 
            :class="{ 'reverse' : user === msg.author.nickName}">
                <div class="avatar" :style="{backgroundImage: `url(${user === msg.author.nickName ? avatar : msg.author.avatar})`}"></div>
                <div class="msg-item-body">
                <h3 v-if="user === msg.author.nickName">
                    <span>{{timeFormat(msg.time)}}</span><strong>{{msg.author.nickName}}</strong>
                </h3>
                <h3 v-else>
                    <strong>{{msg.author.nickName}}</strong><span>{{timeFormat(msg.time)}}</span>
                </h3>
                <span class="msg-item-content">{{msg.content}}</span>
                </div>
            </li>
            </ul>
            </div>
        <div class="input-box device-width-box">
            <div class="input-wrapper">
            <i class="iconfont" title="发送文件todo">&#xe64d;</i>
            <textarea ref="textarea" rows="1"  type="text" v-model="msg" placeholder="#New Message" @keydown.enter="sendMsg(msg, $event)"></textarea>
            <i @click="sendMsg(msg, $evnet)" class="iconfont btn-send" title="发送">&#xe60c;</i>
            </div>
        </div>
    </div>
</template>
<script>
    import loading from './loading';
    import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
    export default {
        data:function(){
            return {
                // user:this.sock,
                msg: '',
                move: false,
                height: '',
                sending: false,
                loading: false
            }
        },
        computed: {
            loadingPosition: {
                get: function() {
                    return this.$store.loadingPosition;
                },
                set: function(newVal) {
                    this.$store.loadingPosition = newVal
                }
            },
            ...mapState([
                'user',
                'socket',
                'avatar',
            ]),
            ...mapGetters([
                'roomData',
                'currentMsgArr'
            ])
        },
        watch: {
            // 有新消息时自动滑动到消息框底部
            // vm.$nextTick用法
            currentMsgArr: function(newMsgArr, oldMsgArr) {
                if(!this.loading) {
                    this.$nextTick(function() {
                    // dom更新后
                        this.$refs.msgWrapper.scrollTop = this.$refs.msgWrapper.scrollHeight; 
                    })
                }
                // 加载历史记录成功取消loading在此处
                this.loading = false
                // console.log(this.msgBox.scrollHeight)  // dom更新前的
            },
            msg: function() {
                // textarea自适应高度
                this.$refs.textarea.style.height = this.height;
                if(this.$refs.textarea.scrollHeight > parseFloat(this.height)) {
                    // 这段if代码解决当点发送之后清空输入框但高度没有变到原始高度
                    if(this.msg === '') {
                        this.$refs.textarea.style.height = this.height;
                        return;
                    }
                    this.$refs.textarea.style.height = this.$refs.textarea.scrollHeight + 'px'
                }
            }
        },
        methods:{
            sendMsg: function(m, e) {
                if(e) {
                    e.preventDefault();
                }
                let msg = {author: {nickName: this.user}, content: m, time: Date.now()};
                let msgWrap = {roomName: this.roomData.name, msg: msg};
                this.msg = '';
                this.socket.emit('new msg', msgWrap, info => {
                    if(info.err) {
                        this.$message({
                            type: 'error',
                            message: '发送失败'
                        })
                    }
                    this.sending = false;
                })
                this.sending = true;
                this.addMsg(msgWrap);
                // let msg;
                // socket.emit('new msg', msgWrap, info => {
                //      if(!info.err) {
                //            this.$nextTick(function() {
                //                 msg.loading = false
                //      }) 
                // }
                // msg = this.$createMsgInstance({options})     
                // })
            },
            timeFormat(timestamp) {
                return this.$timeFormat(timestamp, true)
            },
            loadHistory() {
                let lastOne = this.currentMsgArr[0],
                    timestamp = lastOne ? lastOne.time : Date.now(),
                    roomName = this.roomData.name;
                this.socket.emit('load history', {
                    timestamp,
                    name: roomName,
                    limit: 15
                }, data => {
                    if(data.err) {
                        this.loading = false;
                        return this.$message({
                            type: 'info',
                            message: data.err
                        })
                    }
                    this.addMsg({roomName: roomName, msg: data})
                })
            },
            handleScroll() {
                let msgWrapper = this.$refs.msgWrapper;
                if(msgWrapper.scrollTop === 0 && !this.loading) {
                    this.loading = true;
                    this.loadHistory();
                }
            },
            ...mapMutations({
                registe: 'EVENT_REGISTE',
                addMsg: 'ADD_NEW_MSG'
            })
        },
        updated() {
            // this.msgBox.scrollTop = this.msgBox.scrollHeight; 
            // console.log(this.msgBox.scrollHeight)
        },
        mounted(){
            this.height = window.getComputedStyle(this.$refs.textarea)['height'];
            
            this.$refs.msgWrapper.addEventListener('scroll', this.handleScroll);

            this.loadHistory();
        },
        beforeDestry() {
            // 要改成滚轮事件
            this.$refs.msgWrapper.removeEventListener('scroll', this.handleScroll)
        },
        components: {loading}
    }
</script>
<style lang="less" scoped>
    .main{
        // height: 100%;
        color: #737f8d;
        flex: 1 1 auto;
        width: 0;        // 小屏时可以促成 打开成员列表时隐藏消息框的效果
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background-color: #434140;
        .msg-wrapper{
            // min-height: calc(~"100% - 100px");
            flex: 1 1 auto;
            overflow-x: hidden;
            overflow-y: auto;
            .msg-list{
                list-style: none;
                user-select: text;
                min-width: 350px;  // 
                margin: 0;
                padding: 0;
                .msg-list-item{
                    width: 100%;
                    overflow: hidden;
                    display: flex;
                    padding: 20px 10px;
                    border-bottom: 1px solid hsla(0, 0, 100%, .07);
                    .avatar{
                        background-size: cover;
                        height: 40px;
                        min-width: 40px;
                        border-radius: 50%;
                        margin: 0 10px; 
                    }
                    .msg-item-body{
                        flex: 1 1 auto;
                        margin-right: 10px;
                        h3{
                            margin: 5px 0px;
                            font-size: 0.75rem;
                            strong{
                                color: lighten(#737f8d, 30%);;
                                font-weight: 500;
                                margin: 0 10px;
                            }
                            span{
                                color: hsla(0, 0, 100%, .2);
                                font-weight: 400;
                                vertical-align: baseline;
                            }
                        }
                        span{
                            white-space: pre-wrap;
                            word-break: break-all;
                            word-wrap: break-word;
                        }
                    }
                }
            }
        }
        .input-box{
            min-height: 80px;
            .input-wrapper{
                padding: 0px 15px;
                border-radius: 6px;
                margin: 15px auto;
                min-height: 40px;
                width: 70%;
                max-width: 100%;
                background-color: lighten(#434140, 10%);
                display: flex;
                align-items: center;
                    i{
                        background-color: lighten(#434140, 30%);
                        position: relative;
                        vertical-align: middle;
                        font-size: 8px;
                        line-height: 100%;
                        color: #434140;
                        padding: 5px;
                        border-radius: 50%;
                        cursor: pointer;
                        &:hover{
                            background-color: lighten(#434140, 50%)
                        }
                        &:nth-of-type(2):hover{
                            transition: transform .1s ease;
                            transform: scale(1.2);
                        }
                        &:first-of-type::before{
                            content: '';
                            position: absolute;
                            width: 1px;
                            height: 100%;
                            right: -10px;
                            top: 0;
                            background: lighten(#434140, 30%);
                        }
                    }
                textarea{
                    max-height: 80px;
                    line-height: 1.25rem;
                    height: auto;
                    font-size: 16px;
                    margin: 10px 10px 10px 30px;
                    flex: 1 1 auto;
                    border: none;
                    background: transparent;
                    outline: none;
                    color: hsla(0, 0, 100%, 0.7);
                    resize: none;
                    white-space: pre-wrap;
                    &::-webkit-scrollbar{
                        width: 0;
                    }
                }
                button{
                    outline: none;
                    border: none;
                    border-radius: 50%;
                }
            }
        }
    }
    .online-icon{
        display: inline-block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        background-color: #00E676;
    }
    .input-box{
        display: flex;
        flex-shrink: 0
    }
    .sending{
        background: white
    }
    .reverse{
        flex-direction: row-reverse;
    }
    .reverse .msg-item-body{
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }
    @media screen and (max-width: 900px) {
        .main .input-box{
            width: 100%;
        }
        textarea{
            width: 80%;
        }
    }
</style>