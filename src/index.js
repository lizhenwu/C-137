import Vue from 'vue';
import {Router, router} from './router';
import axios from 'axios';
import App from './components/App.vue';
import './style.less';
import store from './store/store';
import renderNotice from './components/Notification/index';
import renderMessage from './components/Message/index';
import timeFormat from './utils/timeFormat';
import directives from './utils/directives';
import plugins from './utils/plugins';

Vue.use(Router);
Vue.prototype.$axios = axios;
// 插入notice组件方法
Vue.prototype.$notify = renderNotice;
// 插入message组件方法
Vue.prototype.$message = renderMessage;
// 时间格式化方法
Vue.prototype.$timeFormat = timeFormat();

// 注册自定义指令 
Object.keys(directives).forEach(name => {
  Vue.directive(name, directives[name]);
})

// 插件
Object.keys(plugins).forEach(name => {
  Vue.use(plugins[name]);
})

var app = new Vue({
  el: '#app',
  router,
  store,
  render: h => {
    return h(App)
  }
})