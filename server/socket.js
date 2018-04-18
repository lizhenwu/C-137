// controllers
const User = require('./controllers/user');
const Room = require('./controllers/room');
const Msg = require('./controllers/msg');

module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('login', data => {

            socket.nickName = data.user;
            data.userRooms.forEach(item => {
                socket.join(item)
            })
            socket.broadcast.emit('user in', {
                nickName: data.user,
                avatar: data.avatar,
                onlineState: 'online'
            })
        })
        // 加入某个房间
        socket.on('join room', (roomName, cb) => {
            socket.join(roomName);
            // 在数据库中查询roomName房间的信息以及聊天消息传给cb
            cb({
                roomName: roomName,
                roomData: {
                    notice: 'it\'s a fucking notice'
                }
            })
        })
        socket.on('load history', (options, cb) => {
            Room.getRoomHistory(options, cb)
        })
        // 进入某个房间
        socket.on('enter room', (roomName, cb) => {
            // 查询并返回房间信息notice等
            Room.getRoomInfo(roomName, cb)
        })

        // 创建新房间
        socket.on('new room', (roomData, cb) => {
            roomData.admin = socket.nickName;
            Room.createRoom(roomData, cb);
        })

        socket.on('new msg', (msgWrap, cb) => {
            Msg.saveMsg(socket, msgWrap, cb)
        })
        // 修改用户在线状态(勿扰，隐身等)
        socket.on('state change', (targetState, cb) => {
            
            User.changeUserState(socket, targetState, cb);
        })
        socket.on('disconnect', (reason) => {
            User.userLogout(socket);
        });
    })
}