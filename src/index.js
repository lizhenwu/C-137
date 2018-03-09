import Vue from 'vue';
import {Router, router} from './router';
import axios from 'axios';
import App from './components/App.vue';
import './style.less';
import store from './store/store';
import renderNotice from './components/Notification/index';
import renderMessage from './components/Message/index';
import timeFormat from './utils/timeFormat';

Vue.use(Router);
Vue.prototype.$axios = axios;
Vue.prototype.$notify = renderNotice;
Vue.prototype.$message = renderMessage;
Vue.prototype.$timeFormat = timeFormat();

var app = new Vue({
  el: '#app',
  router,
  store,
  render: h => {
    return h(App)
  }
})