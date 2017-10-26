const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test',{
    useMongoClient: true
});

const Msg = mongoose.model('Msg',{
    user: String,
    content: String,
    time: Date
})
const User = mongoose.model('User',{
    nickName: String,
    passWord: String,
    state: Boolean,
    lastTime: Date,
    msgs: [{content: String,time: Date}]
})

module.exports = User