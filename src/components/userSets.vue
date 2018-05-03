<template>
  <div class="flex-container">
    <div class="img-input" ref="uploadBox" :style="{backgroundImage: `url(${avatar})`}" @click.stop="handleClick">
      <i class="iconfont icon-liulan"></i>
      <input type="file" name="file" accept="image/gif,image/jpeg,image/jpg,image/png" ref="upload" @change="readFile" hidden/>
    </div>
    <div class="text-input">
      <span>昵称</span>
      <div class="input-wrapper">
      <input type="text" :placeholder="this.user" v-model="nickName">
      <i class="iconfont icon-xuanzhong" title="确认修改" @click.stop="changeUserInfo(nickName, 'name', $event)"></i>
      </div>
      <span>密码</span>
      <div class="input-wrapper"> 
      <input v-model="password" autocomplete="off">
      <i class="iconfont icon-xuanzhong" title="确认修改" @click.stop="changeUserInfo(password, 'pwd', $event)"></i>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import validate from '../utils/validate';
export default {
  data: function() {
    return {
      nickName: '',
      password: ''
    }
  },
  computed: {
    ...mapState([
      'user',
      'avatar',
      'socket'
    ])
  },
  methods: {
    changeUserInfo(str, type, e) {
      e.target.focus();
      if(!str) return;
      let validateRes;
      if(type === 'name') {
        validateRes = validate(str, 'l0000000', this);
      } else {
        console.log(this.user)
        validateRes = validate(this.user, str, this);
      }
      if(!validateRes) {
        return;
      }
      console.log('content: ', str)
      this.emitChangeInfo(str, type);
      if(type === 'name') {
        // 改名成功后修改浏览器端存储的nickName和storage里的user数据
        this.$store.commit('CHANGE_USER_NAME', str);
        localStorage.setItem('user', str);
      }
    },
    emitChangeInfo(content, type) {
      this.socket.emit(`${type} change`, content, info => {
            return this.$message({
              type: info.err ? 'error' : 'success',
              message: info.content 
            });
      })
    },
    handleClick() {
      this.$refs.upload.value = null;
      this.$refs.upload.click();
    },
    uploadFile(data) {
      this.$axios({
          method: 'post',
          url: '/api/upload',
          headers: {
            'Authorization': `Bearer ${localStorage.token}` // 必须加前面的Bearer
          },
          data: data,
        }).then(response => {
          if(response.status === 200 && response.data === 'update success') {
            // commit CHANGE_AVATAR
            this.changeAvatar(data.baseCode)
            this.$message({
              type: 'success',
              message: '头像上传成功'
            })
          } else {
            this.$message({
              type: 'info',
              message: '头像上传失败'
            })
          }
        }).catch(err => {
          console.log(err.response)
          if(err.response.status === 401) {
            this.$message({
              type: 'info',
              message: 'token失效，请重新登录'
            })
            return;
          }
          this.$message({
              type: 'info',
              message: '系统错误'
            })
        })
    },
    readFile(e) {
      let file = this.$refs.upload.files[0];
      if(file.size > 1024*1024*2) {
        this.$message({
          type: 'info',
          message: '图片不能大于2M'
        })
        return;
      }
      let reader = new FileReader();
      reader.onload = () => {
        this.uploadFile({
          type: file.type.slice(6), 
          baseCode: reader.result
        })
      }
      reader.readAsDataURL(file);
    },
    ...mapMutations({
      changeAvatar: 'CHANGE_AVATAR'
    })
  },
  // created(){
  //   this.nickName = this.user;
  // },
  mounted() {

  }
}
</script>
<style lang="less" scoped>
  .flex-container {
    display: flex;
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
    padding: 20px 30px;
    color: rgba(255, 255, 255, .8);
    .img-input {
      position: relative;
      border-radius: 50%;
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      background-size: cover;
      &>i{
        position: absolute;
        display: inline-block;
        border-radius: 50%;
        color: rgba(255, 255, 255, .6);
        text-align: center;
        line-height: 2;
        font-size: 50px;
        background: rgba(0, 0, 0, .3);
        opacity: 0;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: pointer;
      }
      &:hover>i{
        opacity: 1;
      }
    }
    .text-input{
      display: flex;
      flex-direction: column;
      i{
        right: .75em;
        bottom: 0;
        position: absolute;
        cursor: pointer;
        display: inline;
        color: rgba(255, 255, 255, .4);
      }
      input{
        &:focus + i{
          color: rgba(255, 255, 255, .8);
        }
      }
      .input-wrapper{
        margin: 1em 0;
        padding-right: 2em; 
        position: relative;
      }
    }
  }

@media screen  and (max-width: 645px){
  .flex-container{
    flex-direction: column;
    .img-input{
      margin-bottom: 1em;
    }
  }
}
</style>
