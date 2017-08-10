<template>
<transition name="fadeIn" appear mode="out-in">
    <keep-alive>
  <router-view></router-view>
    </keep-alive>
</transition>
</template>
<script>
export default {

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

