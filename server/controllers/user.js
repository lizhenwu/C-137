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
            // publicRoom = await Room.find().byName('public').select('_id').exec(),
            user = await User.find().byName(userInfo.name).exec();
        if (user) {
            ctx.response.status = 200;
            ctx.body = 'user exist';
        } else {
            let newUser = new User({
                nickName: userInfo.name,
                pwd: cryptoFunc(userInfo.password),
                state: true,
                rooms: []
            });
            // save返回的是promise，不能exec
            await newUser.save();
            let token = jsonWebToken.sign({
                name: newUser.nickName,
                pwd: newUser.pwd,
                exp: Math.floor(Date.now() / 1000) +  3600 * 24 * jwt_expdays // 有效时间7天
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
            ctx.body = '用户名不存在或密码错误';
        } else {
            let token = jsonWebToken.sign({
                name: user.nickName, 
                pwd: user.pwd,
                exp: Math.floor(Date.now() / 1000) + 3600 * 24 * jwt_expdays // 有效时间一小时
            },'windmill');
            ctx.response.set('Authorization', token);
            ctx.response.status = 200;
            ctx.response.body = user.nickName;
        }
    },

    /**
     * 用户登出
     * 放弃使用路由，改用socket.io
     * @param {*} socket 
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
                sort: '-initialTime'
            }
        }).select('nickName avatar state').exec();
        if(!userInfo.state) {
            // 这个地方应该解析token然后用User.find().login(token)
            await User.findOneAndUpdate({nickName: userInfo.nickName}, {$set: {state: true}}).exec();
        }
        // 获取当前在线用户的nickName和avatar信息
        let currentUsers = await User.find().where('state', true).nor([{'nickName': name},{'onlineState': 'hidden'}]).limit(20).select('nickName avatar onlineState').exec();
        
        // 查找历史用户，要把隐身状态的用户放在此处
        let previousUsers = await User.find().or([{'state': false}, {'onlineState': 'hidden'}]).select('nickName avatar').exec();
        
        // 公共房间
        let publicRooms = await Room.find().where('isPublic', true).select('name').exec();
        userInfo.rooms.push(...publicRooms);
        ctx.body = {userInfo, currentUsers, previousUsers};
    },

    
    /**
     * 
     * @param {*} ctx 
     * @param {*} next 
     * upload路由，暂时只用来上传头像图片
     */
    async changeUserAvatar(ctx, next) {
        let {type, baseCode} = JSON.parse(ctx.request.rawBody),
            user = ctx.state.user.name,
            key = 'avatar' + parseInt(Date.now()) + '.' + type,
            filePath = await uploadAvatar(key, baseCode),
            product = await User.update({nickName: user}, {$set: {avatar: 'http://' + filePath}});
        if(product.n === 0) {
            ctx.body = 'no exist';
        }
        ctx.body = 'update success';
    },

    async changeUserState(socket, state, cb) {
        let nickName = socket.nickName;
        let user = await User.findOneAndUpdate({nickName: nickName},{$set:{onlineState: state}}).exec();
        if(user) {
            socket.broadcast.emit('state change', {
                nickName: nickName,
                onlineState: state
            })
            cb({info: '操作成功'});
        } else{
            cb({err: '操作失败'});
        }
    },
    /**
     * 更改用户信息
    */
    async upadateUserInfo(type, data, cb) {
        console.log(data)
        let info = {}, user;
        if(type === 'nickName') {
            user = await User.find().byName(data.val).exec();
            if(user) {
                info.err = 'name occupied';
                info.content = 'nickName已被占用';
            } else{
                await User.findOneAndUpdate({nickName: data.user}, {$set: {nickName: data.val}});
                info.content = 'nickName修改成功';
            }
        } else {
            await User.findOneAndUpdate({nickName: data.user}, {$set: {pwd: cryptoFunc(data.val)}});
            info.content = '密码修改成功';
        }
        return cb(info);
    },
}