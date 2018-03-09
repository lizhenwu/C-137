const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    content: String,
    time: {type: Date, default: Date.now},
    room: {type: Schema.Types.ObjectId, ref: 'Room'}
})

module.exports = mongoose.model('Msg', msgSchema);
