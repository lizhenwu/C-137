const mongoose = require('mongoose');
const config = require('../config');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    nickName: String,
    pwd: String,
    state: Boolean,
    avatar: {type: String, default: config.defaultAvatar},
    lastTime: {type: Date, default: Date.now},
    rooms: [{type: Schema.Types.ObjectId, ref: 'Room'}],
    initialTime: {type: Date, default: Date.now}
    // msgs: [msgSchema]
})

userSchema.query.login = function(name,pwd) {
    return this.findOneAndUpdate({nickName: name,pwd: pwd},{$set:{state: true}});
}
userSchema.query.logout = function(name) {
    return this.findOneAndUpdate({nickName: name},{$set:{state: false,lastTime: Date.now()}});
}
userSchema.query.byName = function(name) {
    return this.findOne({nickName: name})
}

module.exports = mongoose.model('User', userSchema)
