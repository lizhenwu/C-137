import Vue from 'vue';
// function component(){
//     var element = document.createElement('div');
//     element.innerHTML = _.join(['hello','webpack'],' ');
//     element.classList.add('hello');
//     var myIcon = new Image();
//     myIcon.src = icon;
//     element.appendChild(myIcon);
//     return element;
// }
// document.body.appendChild(component());
// import '../lib/css/mdui.min.css';
import './lib/js/mdui.min.js';


import App from './components/App.vue';

var app = new Vue({
  el: '#app',
  template:'<App></App>',
  components:{App}

  
})


// Vue.component(appBar.name,appBar)



// const Vue = require('vue');

// const app=new Vue({
//     el:'#app',
//     data:{
//         message:'Hello Vue.js'
//     }
// })