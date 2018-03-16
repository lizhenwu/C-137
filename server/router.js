// controllers
const User = require('./controllers/user');
const Room = require('./controllers/room');
const Msg = require('./controllers/msg');

const router = require('koa-router')({
    prefix: '/api'
});
const routes = {
    // 改成restful，login和logout考虑改成/token
    // 用户注册,获取信息,修改信息已改
    // signup: '/signup',
    login: '/login',
    user: '/user/:user',
    logout: '/logout',
    upload: '/upload'
}
// 登录
router.post(routes.login, User.userLogin);
// 获取用户信息
router.get(routes.user, User.getUserInfo);
// 修改用户信息
router.post(router.user, User.upadateUserInfo)
// 用户注册
router.put(router.user, User.createUser)

router.post(routes.upload, User.changeUserAvatar)

router.get(routes.logout, User.userLogout);

// router.post(routes.signup, User.createUser);

module.exports = {
    router,
    routes
}
