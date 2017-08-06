<template>
    <div class="mdui-container-fluid">
        <div class="mdui-row">
            <div class="mdui-col-xs-6 mdui-col-offset-xs-3 mdui-card">
                <h1>Login</h1>
                <div class="mdui-textfield mdui-textfield-floating-label" v-bind:class="exist?'mdui-textfield-invalid':''">
                    <label class="mdui-textfield-label">Username</label>
                    <input class="mdui-textfield-input" type="text" v-model="userName"/>
                    <div class="mdui-textfield-error">用户名已存在</div>
                </div>
                <div class="mdui-textfield mdui-textfield-floating-label">
                    <label class="mdui-textfield-label">Password</label>
                    <input class="mdui-textfield-input" type="password" v-model="passWord"/>
                </div>
                <button class="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme" @click="login">登录</button>
                <button class="mdui-btn mdui-btn-raised mdui-ripple" @click="signup">注册</button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data:function(){
        return {
            userName:"",
            passWord:"",
            exist:false
        }
    },
    methods:{
        signup:function(){
            let vm = this;
            vm.$axios({
                method:'post',
                url:'/user',
                headers:{
                   'Content-Type':'application/x-www-form-urlencoded;charset=utf-8'
                },
                data:{
                    name:this.userName,
                    password:this.passWord
                }
            }).then(function(response){
                if(response.status == 200 && response.data=="user exist"){
                    vm.exist = true;
                }else{
                    vm.exist = false;
                    vm.$router.push({path:'chat'});
                }
                console.log(response);
            }).catch(function(err){
                console.log(err);
            })
        },
        login:function(){

        }
    }
}
</script>

