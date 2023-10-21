var mongoose = require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;

// var MessageSchema = new Schema({
//     content: String,
//     timestamp: { type: Date, default: Date.now },
//     chat: { type: mongoose.Schema.ObjectId, ref: 'conversations' },
//     user: { type: mongoose.Schema.ObjectId, ref: 'users' }, // tham chiếu đến model User
//     doctor: { type: mongoose.Schema.ObjectId, ref: 'doctors' },
// });
var MessageSchema = new Schema({
    content: String,
    timestamp: { type: Date, default: Date.now },
    chat: { type: mongoose.Schema.ObjectId, ref: 'conversations' },
    sender: { type: mongoose.Schema.ObjectId, refPath: 'onModelSender' },
    receiver: { type: mongoose.Schema.ObjectId, refPath: 'onModelReceiver' },
    onModelSender: {
        type: String,
        required: true,
        enum: ['users', 'doctors']
    },
    onModelReceiver: {
        type: String,
        required: true,
        enum: ['users', 'doctors']
    }
});
const MessageModel= db.model('message',MessageSchema);
module.exports=MessageModel;