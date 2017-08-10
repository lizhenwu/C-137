import Vue from 'vue';
import Router from 'vue-router';
import chat from '../components/chat.vue';
import login from '../components/login.vue';

Vue.use(Router);
const router = new Router({
    routes:[
        {
            path:'/',
            name:'login',
            component:login
        },
        {
            path:'/chat',
            name:'chat',
            meta:{
                requiresAuth: true
            },
            component:chat
        }
    ]
});
router.beforeEach((to,from,next)=>{
    let cookie = window.document.cookie;
    if(to.name=='chat'){
        if(!/\bname\b/.test(cookie)){
        console.log("没有");
        next({path:'/'});
    }
    else{
        console.log("有");
        next();
    }
    }else{
        if(!/\bname\b/.test(cookie)){
        console.log("没有");
        next();
        }else{
            next({path:'chat'})
        }
    }
    
})
export default router;