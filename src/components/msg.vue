<template>
    <div class="msg">
    <div class="mdui-card">
       <ul class="mdui-list">
        <li class="mdui-list-item" v-bind:class="msg.userName==user.name ? 'reverse':''" v-for="msg in msgArr">
            <div class="mdui-list-item-avatar"><img/></div>
            <div class="mdui-list-item-content">
            <div class="mdui-list-item-title" v-bind:style="msg.userName==user.name?{textAlign:'right'}:{}">{{msg.userName}}</div>
              <div class="mdui-chip">
            <span class="mdui-chip-title">{{msg.content}}</span>
             </div>             
            </div>
        </li>
        </ul>
    </div>
    <div class="mdui-card">
    <div class="mdui-textfield">
        <label class="mdui-textfield-label">Messages</label>
        <textarea class="mdui-textfield-input" type="text" v-model="msg"></textarea>
    </div>
        <button class="mdui-btn mdui-btn-icon mdui-color-pink" @click="sendMsg()"><i class="mdui-icon material-icons">send</i></button>   
    </div>
    </div>
</template>
<script>
    export default {
        props:['sock'],
        data:function(){
            return {
                user:this.sock,
                msgArr:[],
                msg:"",
                msgBox:''
            }
        },
        methods:{
            scroll:function(){
                this.msgBox.scrollTop+=56;
            },
            sendMsg: function(){
                let data = {userName:this.user.name,content:this.msg};
                this.msgArr.push(data);
                this.scroll();
                this.user.emit('send',data);
                this.msg="";
            }
        },
        created(){
            let vm = this;
            vm.user.on('text',function(msg){
                vm.msgArr.push(msg);
                this.scroll();
                if(msg.userName!=vm.user.name){
                }
            });
        },
        mounted(){
            this.msgBox=document.querySelector('.mdui-card');
        }
    }
</script>
<style scoped>
    .mdui-card{
        background-color:rgba(255,255,255,0.7);
        overflow:auto;
        margin-bottom:1em;
    }
    .mdui-card:nth-of-type(1){
        height:70vh;
    }
    .msg{
        position:relative;
        left:10vw;
    }
    .mdui-chip{
        display:table;
        white-space:normal;
        cursor:auto;
        user-select:text;
        height:auto
    }
    .mdui-chip-title{
        height:auto;
        line-height:170%
    }
    .mdui-list-item{
        
        cursor:auto;

    }
    .reverse{
        flex-direction:row-reverse;
    }
    .mdui-list-item-content{
        flex-grow:0;
        margin-right:16px;
        padding-top:0px;
        padding-bottom:7px
    }
    .mdui-list-item:hover{
        background:transparent;
    }
    .msg{
        display:flex;
        flex-direction:column;
    }
    button{
        display:inline
    }
    .mdui-textfield{
        display:inline;
        padding: 0 0;
    }
    .mdui-textfield-input{
        height:24px;
        min-height:20px;
        max-height:40px;
        padding:0 0 0 0;
        display:inline-block;
        width:88%;
    }
</style>