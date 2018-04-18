<template>
  <div class="settings">
    <ul>
      <li class="normal-flex-box">
        <span>群组名称</span>
        <input type="text" placeholder="#room name" maxlength="10" v-model="roomName"/>
      </li>
      <li class="normal-flex-box">
        <span>群组notice</span>
        <input type="text" placeholder="#room notice" maxlength="30" v-model="roomNotice"/>
      </li>
      <setting-item ref="checkbox" title="公共/私有" :isChecked="isChecked" id="roomAuth"></setting-item>
    </ul>
    <button :disabled="roomName === ''" @click="createRoom">确 认</button>
  </div>
</template>
<script>
import settingItem from './settingItem';
import { mapActions, mapState, mapGetters, mapMutations } from "vuex";
export default {
  data: function() {
    return {
      roomName: '',
      roomNotice: '',
      isChecked: 'checked'
    }
  },
  computed: {
    ...mapState([
      'socket'
    ]),
  },
  methods: {
    createRoom: function(e) {
      let isPublic = this.$refs.checkbox.$refs.checkbox.checked;
      
      const roomInfo = {
        roomName: this.roomName,
        roomNotice: this.roomNotice,
        isPublic: isPublic
      }
      
      this.socket.emit('new room', roomInfo, info => {
        if(info.err) {
          this.$message({
            type: 'error',
            message: info.err
          })
        } else {
          this.$message({
            type: 'success',
            message: '创建成功'
          })
          this.addNewRoom({
            name: info.name, 
            entered: false, 
            roomData: {msgs: [], notice: ''}
          });
        }
      })
    },
    ...mapMutations({
      addNewRoom: 'ADD_NEW_ROOM'
    })
  },
  components: {settingItem},
}
</script>
<style lang="less" scoped>
  li{
    justify-content: space-between;
    padding: 1em 0;
    &:not(:last-child){
      border-bottom: 1px solid rgba(255, 255, 255, .1);
    }
  }
  button{
    display: block;
    margin: 0 auto;
    outline: none;
    padding: .5em 1.5em;
    background: #F5EBC7;
    color: rgba(0, 0, 0, .8);
    border: 1px solid #434140;
    border-radius: .3em;
    box-shadow: 0 0 15px -5px black;
    transition: all .5s ease;
    &:hover{
      background: darken(#F5EBC7, 3%);
    }
}
</style>
