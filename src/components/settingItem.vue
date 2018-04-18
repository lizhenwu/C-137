<template>
 <li class="setting-item normal-flex-box">
    <span>{{title}}</span>
    <input ref="checkbox" type="checkbox" :checked="checked" :id="id" @click="handCheck" hidden/>
    <label :for="id">
      <div></div>
    </label>
 </li>
</template>
<script>
export default {
  props: ['title', 'isChecked', 'id'],
  data: function() {
    return {
      checked: this.isChecked 
    }
  }
}
</script>
<style lang="less" scoped>
  li{
    justify-content: space-between;
  }
</style>

