<template>
  <div class="settings">
    <ul>
      <setting-item title="新消息桌面通知" isChecked = "checked" id="notice"></setting-item>
      <setting-item title="新消息通知铃声" isChecked = "checked" id="notice-sound"></setting-item>
      <setting-item title="新消息页面title通知" isChecked = "checked" id="notice-title"></setting-item>
    </ul>
  </div>
</template>
<script>
import settingItem from './settingItem';
export default {
  components: {settingItem}
}
</script>
<style lang="less" scoped>
  
</style>
