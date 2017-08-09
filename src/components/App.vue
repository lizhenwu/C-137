<template>
<transition name="fadeIn" appear mode="out-in">
    <keep-alive>
  <router-view></router-view>
    </keep-alive>
</transition>
</template>
<script>
export default {
    beforeCreate(){
      let vm = this;
      vm.$axios.get('/user').then(function(response){
        if(response.data == "online"){
          console.log('cookie存在用户');
          vm.$router.push({path:'chat'});
        }else{
          console.log('可以登陆');
        }
      }).catch(function(err){
          console.log(err);
      })
    }
}
</script>
<style>
    .fadeIn-enter-active, .fadeIn-leave-active {
        transition: opacity .3s ease;
    }
    .fadeIn-enter, .fadeIn-leave-to /* .fade-leave-active 在 <2.1.8 中 */ {
        opacity: 0;
    }
</style>

