<template>
    <div class="mdui-container-fluid">
    <div class="mdui-row">
        <div class="mdui-appbar">
            <div class="mdui-toolbar mdui-color-theme">
                <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">menu</i></a>
                <a href="javascript:;" class="mdui-typo-headline">chatX</a>
                <a href="javascript:;" class="mdui-typo-title">windmill_</a>
                <div class="mdui-toolbar-spacer"></div>
                <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">search</i></a>
                <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">refresh</i></a>
                <a href="javascript:;" class="mdui-btn mdui-btn-icon"><i class="mdui-icon material-icons">more_vert</i></a>
            </div>
        </div>
        </div>
        <div class="mdui-row">
        <div class="mdui-col-xs-6">
        <msg :sock="socket"></msg>
        </div>
        <online id="on" :sock="socket"></online>
        </div>
    </div>
</template>
<script>
    import io from 'socket.io-client';
    import online from './online.vue';
    import msg from './msg.vue';
    export default {
        data:function(){
            const socket = io({autoConnect: false});
            socket.name="guest"+Math.round(100*Math.random());
            return {
                socket:socket,
                counter: 0
            }
        },
          
        created(){
            //  console.log(this.$attrs);

            
        },
        components:{online,msg}
    }
</script>
<style scoped>
    .mdui-container-fluid{
        background:url('../img/girl.jpg') no-repeat center;
        background-size: contain;
    }
    #on{
        
        float:right;
    }
    .mdui-appbar{
        margin-bottom:2em;
    }
</style>