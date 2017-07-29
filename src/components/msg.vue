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
    <div class="mdui-textfield">
        <label class="mdui-textfield-label">Messages</label>
        <textarea class="mdui-textfield-input  mdui-shadow-1" type="text" v-model="msg"></textarea>
        <button class="mdui-btn mdui-ripple mdui-btn-icon mdui-fab-mini" @click="sendMsg()"><i class="mdui-icon material-icons">send</i></button>
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
                active:false
            }
        },
        methods:{
            sendMsg: function(){
                let data = {userName:this.user.name,content:this.msg};
                this.msgArr.push(data);
                this.user.emit('send',data);
                this.msg="";
            }
        },
        created(){
            let vm = this;
            vm.user.on('text',function(msg){
                vm.msgArr.push(msg);
                if(msg.userName!=vm.user.name){
                    vm.active=true;
                }
            });
        }
    }
</script>
<style scoped>
    .mdui-card{
        overflow:scroll;
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
    .mdui-textfield-input{
        display:inline-block;
        width:88%
    }
</style>