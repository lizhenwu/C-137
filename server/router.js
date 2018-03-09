// controllers
const User = require('./controllers/user');
const Room = require('./controllers/room');
const Msg = require('./controllers/msg');

const router = require('koa-router')({
    prefix: '/api'
});
const routes = {
    signup: '/signup',
    login: '/login',
    user: '/user/:user',
    logout: '/logout',
    upload: '/upload'
}
// 登录
router.post(routes.login, User.userLogin);
// 用户
router.get(routes.user, User.getUserInfo);

router.post(routes.upload, User.changeUserAvatar)

router.get(routes.logout, User.userLogout);

router.post(routes.signup, User.createUser);

module.exports = {
    router,
    routes
}