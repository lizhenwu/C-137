const Room = require('../models/room');
const User = require('../models/user');
module.exports = {
    
    async createRoom(roomData, cb) {
        
        let info = {};
        // 先查询用户创建过的房间个数，超过一定数目禁止再创建
        let user = await User.find().byName(roomData.admin).exec();
        let ownRooms = await Room.find({admin: user._id}).exec();
        if(ownRooms.length >= 3) {
            info.err = '已创建房3个房间';
            return cb(info);
        }
        let room = await Room.find().byName(roomData.roomName).exec();
        if(room) {
            info.err = '房间已存在';
        } else {
            let newRoom = new Room({
                name: roomData.roomName,
                admin: user._id,
                isPublic: roomData.isPublic,
                notice: roomData.roomNotice,
                members: [user._id]
            });
            newRoom = await newRoom.save();
            user.rooms.push(newRoom._id);
            await user.save();
            info.name = newRoom.name;
        }
        cb(info);
    },

    async initRoomList(user, cb) {
        // 所有房间
        let roomList = await Room.find({options: {sort: '-initialTime'}}).select('name isPublic -_id',);
        cb(roomList)
    },

    async getRoomInfo(roomName, cb) {
        let roomData = await Room.find().byName(roomName)
            .populate('admin', 'nickName -_id')
            .select('notice initialTime')
            .exec();
        if(roomData) {
            cb({
                roomName: roomName,
                roomData
            })
        } else {
            cb({
                err: '未找到该房间'
            })
        }
    },

    async joinRoom(nickName, roomName, cb) {
        let user = await User.find().byName(nickName).select('rooms').exec();
        let room = await Room.find().byName(roomName).select('members name').exec();
        if(user.rooms.indexOf(room._id) !== -1) {
            cb({
                err: `你已经加入了房间${room.name}`
            })
        } else if(user && room) {
            user.rooms.push(room._id);
            room.members.push(user._id);
            await user.save();
            await room.save();
            cb({
                info: `加入${room.name}成功`
            })
        } else {
            cb({
                err: '你要加入的房间不存在'
            })
        }
    },

    async updateRoomInfo() {

    },
    /**
     * 
     * @param {Object} options 
     * @param {Function} cb 
     * options: {name, limit, timestamp}
     */
    async getRoomHistory(options, cb) {
        let timestamp = options.timestamp || Date.now(),
            history = await Room.find().byName(options.name).select('msgs -_id').populate({
                path: 'msgs',
                match: {time: {$lt: timestamp}},
                select: 'time content -_id',
                options: {limit: options.limit, sort: '-time'},
                populate: {
                    path: 'author', 
                    select: 'nickName avatar -_id'
                }
        });
        if(!history) {
            return cb({err: '出错了'})
        }
        if(history.msgs.length) {
            return cb(history.msgs.reverse());
        }
        return cb({err: '哥, 这回真没有了'})
    }
}