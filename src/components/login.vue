<template>
    <section class="login-box">
        <h2>Hello, {{userName || 'bro'}}</h2>
        <div class="input-group">
            <label class="label"><i class="iconfont icon-mine"></i></label>
            <input class="input-box" type="text" placeholder="用户名" @blur.stop="showTip" v-model="userName" />
            <span>username is required</span>
        </div>
        <div class="input-group">
            <label class="label"><i class="iconfont icon-lock"></i></label>
            <input class="input-box" type="password" placeholder="密 码" @keydown.enter.stop="login" @blur.stop="showTip" v-model="passWord" />
            <span>password is required</span>
        </div>
        <div class="btn">
            <button class="login" @click="login">登 录</button>
            <button class="register" @click="signup">注 册</button>
        </div>
    </section>
</template>
<script>
const regForName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{2,8}$/gi;
const regForPwd = /^[a-zA-Z0-9.*]{5,12}$/gi;
export default {
  data() {
    return {
      userName: "",
      passWord: ""
    };
  },
  methods: {
    validate: function(name, pwd) {
      if(!regForName.test(name)) {
        return this.$message({
          type: 'info',
          message: '用户名由2到8位字母数字汉字下划线组成'
        })
      }
      if(!regForPwd.test(pwd)) {
        return this.$message({
          type: 'info',
          message: '密码由5到12位字母数字.*组成'
        })
      }
      return true;
    },
    signup: function() {
      let vm = this;
      if (this.userName && this.passWord) {
        if(this.validate(this.userName, this.passWord)) {
          vm
          .$axios({
            method: "put",
            url: `/api/user/:${this.userName}`,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            data: {
              name: this.userName,
              password: this.passWord
            }
          })
          .then(function(response) {
            if (response.status == 200 && response.data == "user exist") {
              this.$message({type: 'info', message: "用户名已存在" });
            } else {
              let nickName = response.data;
              localStorage.token = response.headers.authorization;
              localStorage.user = response.data;
              vm.$router.push({ path: `/${nickName}` });
            }
          })
          .catch(function(err) {
            this.$message({type: 'error', message: err.response.data})
          });
        }
      } else {
        this.$message({type: 'info', message: '请输入用户名和密码'})
      }
    },
    login: function() {
      let vm = this;
      if (this.userName && this.passWord) {
        vm
          .$axios({
            method: "post",
            url: "/api/login",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            // 对象数据会自动转换成JSON发送
            data: {
              name: this.userName,
              password: this.passWord
            }
          })
          .then(function(response) {
            if (response.status === 200) {
              localStorage.token = response.headers.authorization;
              localStorage.user = response.data;
              vm.$store.commit("login");
              vm.$router.push({ path: `/${response.data}` });
            } else {
              vm.$message({type: 'info', message: "登录失败" });
            }
          })
          .catch(function(err) {
            if (err.response.status === 401) {
              vm.$message({type: 'info', message: err.response.data})
            }
          });
      } else {
        this.$message({type: 'info', message: '请输入用户名和密码'});
      }
    },
    showTip: function(e) {
      let inputVal = e.target.value;
      let classList = e.target.classList;
      if(inputVal === '' || inputVal == null) {
        classList.contains('blank') ? null : classList.add('blank')
      } else {
        classList.remove('blank')
      }
    }
  }

  // beforeRouteEnter(to, from, next){
  //         next(vm => {
  //             vm.$axios.get('/user').then((response)=>{
  //                 console.log(response);
  //                 if(response.data == 'online')
  //                     vm.$router.push({path:'chat'});
  //             }).catch(err=>{
  //                 console.log(err);
  //             })
  //             // 通过 `vm` 访问组件实例
  //         })
  // }
};
</script>
<style lang="less">
@import url('../var.less');
.login-box{
    background: #fff;
    margin: auto;
    margin-top: 10%;
    width: 90%;
    padding: 30px;
    padding-bottom: 15px;
    max-width: 400px;
    border-radius: 4px;
    box-shadow: 0 0px 8px @shadow-color;
    .input-group{
        position: relative;
        margin-bottom: 20px;
        .label{
            font-size: 16px;
            position: absolute;
            left: 3px;
            top: 0.5em;
            color: black
        }
        .input-box{
            color: #737373;
            width: 100%;
            padding: 5px 5px 5px 25px;
            font-size: 1em;
            line-height: 1.5em;
            border: 1px solid #d9d9d9;
            transition: all .3s;
            &:focus{
              border-color: rgb(191, 152, 143);
              color: darken(#737373, 20%);
              outline: none;
              box-shadow: 0 0 0px 2px rgba(191, 152, 143, 0.25);
            }
            &.blank{
              border-color: rgb(191, 152, 143);
            }
        }
        span{
          display: none;
        }
        .blank + span{
          display: inline;
          position: absolute;
          left: 0;
          color: #DA727E;
          font-size: .5em;
        }
    }
    .btn{
      width: 100%;
      font-size: 0; // 消除两个button之间因为html换行造成的小间隙
      button{
        padding: 5px 20px;
        width: 30%;
        margin: 20px 10%; 
        outline: none;
        cursor: pointer;
        border: none;
        line-height: 2em;
        font-family: "Lucida Grande";
        font-weight: 500;
      }
      .login{
        background:lighten(#737373, 20%);
        color: #fff;
        transition: all .3s;
        &:hover{
          background: lighten(#737373, 30%)
        }
        &:active{
          background: lighten(#737373, 20%)
        }
      }
      .register{
        background: transparent;
        color: darken(#d9d9d9, 30%);
        transition: all .3s;
        &:hover{
          color: rgb(191, 152, 143)
        }
      }
    }
}
</style>



