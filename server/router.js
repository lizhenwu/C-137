const router = require('koa-router')({
    prefix: '/api'
});
const routes = {
    sigup: '/signup',
    login: '/login',
    user: '/user',
    logout: '/logout'
}

module.exports = {
    router,
    routes
}