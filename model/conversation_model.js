var mongoose = require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;



var ConversationSchema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'users' },
    doctor: { type: mongoose.Schema.ObjectId, ref: 'doctors' },
    startTime: { type: Date, default: Date.now },
    latestMessage:{type:mongoose.Schema.ObjectId, ref:'message'},
    
}, {timestamps: true});

const ConversationModel= db.model('conversations',ConversationSchema);
module.exports=ConversationModel;
