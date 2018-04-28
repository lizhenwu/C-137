import Router from 'vue-router';
import chat from '../components/chat.vue';
import login from '../components/login.vue';

const router = new Router({
    routes:[
        {
            path:'/',
            name:'login',
            component:login,
            // 检查localStorage的jwt和username有的话直接进入用户页
            beforeEnter: (to,from,next) => {
                if(localStorage.user && from.name !== 'chat') {
                    next({path: `/${localStorage.user}`})
                } else {
                    next();
                }
            }
        },
        {
            path:'/:id',
            name:'chat',
            meta:{
                requiresAuth: true
            },
            component:chat,
            beforeEnter: (to,from,next) => {
                router.app.$axios.get(`/api/user${to.path}`,{
                    headers: {
                        'Authorization': `Bearer ${localStorage.token}` // 必须加前面的Bearer
                    }
                }).then(response => {
                    if(response.status === 200) {
                        //把获取到的用户数据保存到store中
                        router.app.$message({
                            type: 'success',
                            message: '登录成功'
                        })
                        router.app.$store.commit('INIT_USER_DATA', response.data.userInfo);
                        router.app.$store.commit('UPDATE_ONLINEUSERS', response.data.currentUsers);
                        router.app.$store.commit('INIT_PREV_USERS', response.data.previousUsers);
                        // 初始化socket操作挪到进入主界面路由时
                        router.app.$store.dispatch('socketInit');
                        next();
                    } else {
                        next({path: '/'})
                    }
                })
                .catch(err => {
                    localStorage.user = '';
                    if(err.response && err.response.status === 401) {
                        next({path: '/'})
                    } else {
                        router.app.$message({
                            type: 'error',
                            message: '登录出错'
                        });
                        next({path: '/'})
                    }
                })
            }
        }
    ]
});

export {Router, router};