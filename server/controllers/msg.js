const Room = require('../models/room');
const User = require('../models/user');
const Msg = require('../models/msg');

// 接收的msgWrap的结构为{roomNameL,msg:{author, content}}
// 发送出去时加上avatar属性
module.exports = {
    async saveMsg(socket, msgWrap, cb) {
        let user = await User.find().byName(msgWrap.msg.author.nickName).select('avatar').exec();
        let room = await Room.find().byName(msgWrap.roomName).select('msgs').exec();

        if(user && room) {
            let msg = new Msg({
                author: user._id,
                content: msgWrap.msg.content,
                room: room._id,
                time: msgWrap.msg.time
            });
            await msg.save();
            room.msgs.push(msg._id);
            await room.save();
            msgWrap.msg.author.avatar = user.avatar;
            socket.to(msgWrap.roomName).broadcast.emit('new msg', msgWrap);
            cb({info: '发送成功'})
        } else {
            cb({
                err: '出错了'
            })
        }
    }
}