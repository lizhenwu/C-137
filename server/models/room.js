const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const roomSchema = new Schema({
    name: String,
    notice: String,
    isPublic: { type: Boolean, default: true},
    admin: {type: Schema.Types.ObjectId, ref: 'User'},
    initialTime: {type: Date, default: Date.now},
    msgs: [{
        type: Schema.Types.ObjectId,
        ref: 'Msg'
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

roomSchema.query.byName = function(name) {
    return this.findOne({name: name})
}

module.exports = mongoose.model('Room', roomSchema);
