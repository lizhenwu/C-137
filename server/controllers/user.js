const crypoto = require('crypto');
const Room = require('../models/room');
const User = require('../models/user');
const jsonWebToken = require('jsonwebtoken');
const {uploadAvatar} = require('../utils');
const {jwt_expdays} = require('../config');

const cryptoFunc = function(pwd) {
    let hash = crypoto.createHash('sha256');
    hash.update(pwd);
    return hash.digest('hex');
}     

module.exports = {

    /** 
     * 用户注册路由
     * 
    */
    async createUser(ctx, next) {
        let userInfo = JSON.parse(ctx.request.rawBody),
            publicRoom = await Room.find().byName('public').select('_id').exec(),
            user = await User.find().byName(userInfo.name).exec();
        if (user) {
            ctx.response.status = 200;
            ctx.body = 'user exist';
        } else {
            let newUser = new User({
                nickName: userInfo.name,
                pwd: cryptoFunc(userInfo.password),
                state: true,
                rooms: [publicRoom._id]
            });
            // save返回的是promise，不能exec
            await newUser.save();
            let token = jsonWebToken.sign({
                name: newUser.nickName,
                pwd: newUser.pwd,
                exp: Math.floor(Date.now() / 1000) + 60// 3600 * 24 * jwt_expdays // 有效时间7天
            }, 'windmill');
            ctx.response.set('Authorization', token);
            ctx.response.status = 200;
            ctx.response.body = newUser.nickName;
        }
    },

    /** 
     * 用户登录路由
    */
    async userLogin(ctx, next) {
        let userInfo = JSON.parse(ctx.request.rawBody);
        let query = User.find().login(userInfo.name, cryptoFunc(userInfo.password)).exec();
        let user = await query;
        if(!user) {
            ctx.response.status = 401;
            ctx.body = "用户名不存在或密码错误";
        } else {
            let token = jsonWebToken.sign({
                name: user.nickName, 
                pwd: user.pwd,
                exp: Math.floor(Date.now() / 1000) + 60*60 // 有效时间一小时
            },'windmill');
            ctx.response.set('Authorization', token);
            ctx.response.status = 200;
            ctx.response.body = user.nickName;
        }
    },

    /**
     * 用户登出
     * 放弃使用路由，改用socket.io
     * @param {*} ctx 
     * @param {*} next 
     */
    async userLogout(socket) {
        let user = socket.nickName;
        await User.find().logout(user);
        socket.broadcast.emit('user out', {nickName: user})
    },

    /**
     * 获取用户数据路由
     * @param {*} ctx 
     * @param {*} next 
     */
    async getUserInfo(ctx, next) {
        let {name} = ctx.state.user;
        
        // 包含nickName, avatar, rooms的name等信息 
        let userInfo = await User.find().byName(name).populate({
            path: 'rooms', 
            select: 'name -_id',
            options: {
                sort: '-initialTtime'
            }
        }).select('nickName avatar').exec();
        
        // 获取当前在线用户的nickName和avatar信息
        let currentUsers = await User.find().where('state', true).ne('nickName', name).limit(20).select('nickName avatar').exec();

        ctx.body = {userInfo, currentUsers};
    },

    
    /**
     * 
     * @param {*} ctx 
     * @param {*} next 
     * upload路由，暂时只用来上传头像图片
     */
    async changeUserAvatar(ctx, next) {
        let {type, baseCode} = JSON.parse(ctx.request.rawBody),
            user = ctx.state.user.name;
            key = 'avatar' + parseInt(Date.now()) + '.' + type,
            filePath = await uploadAvatar(key, baseCode),
            product = await User.update({nickName: user}, {$set: {avatar: '//' + filePath}});
        if(product.n === 0) {
            ctx.body = 'no exist';
        }
        ctx.body = 'update success';
    },

    /**
     * 更改用户信息
    */
    async upadateUserInfo(ctx, next) {
        
    },
}