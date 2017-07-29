<template>
<div class="mdui-col-xs-3">
  <div class="mdui-card">
  <div class="mdui-card-header">
    <div class="mdui-card-header-title">在线人数</div>
    <div class="mdui-card-header-subtitle">{{counter}}</div>
  </div>
    <ul class="mdui-list">
      <li class="mdui-list-item mdui-ripple" v-for="item of members">
        <div class="mdui-list-item-avatar"></div>
        <div class="mdui-list-item-content">{{item.name}}</div>
        <i class="mdui-list-item-icon mdui-icon material-icons">chat_bubble</i>
      </li>
    </ul>
    </div>
    </div>
</template>
<script>
    export default {
        props:['sock'],
        
        data:function(){
            return {
                socket1:this.sock,
                counter:0,
                members:[]
            }
        },
        created(){
            this.socket1.open();
                this.socket1.on('connect',()=>{
                    this.socket1.emit('namein',this.socket1.name);
                    this.socket1.on('num',(data)=>{
                        console.log(data);
                        this.counter = data.counts;
                        this.members = data.users;
                    });
                    this.socket1.on('text',(msg)=>{
                        console.log(msg);
                    })
                    console.log(this.socket1.name);
                });
        }
    }

    
</script>