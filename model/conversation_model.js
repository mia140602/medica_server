var mongoose = require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;



var ConversationSchema = new Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'users' },
    doctor: { type: mongoose.Schema.ObjectId, ref: 'doctors' },
    appointment: { type: mongoose.Schema.ObjectId, ref: 'appointments' },
    startTime: { type: Date },
    latestMessage:{type:mongoose.Schema.ObjectId, ref:'message'},
    endTime: { type: Date },
    isEnded: { type: Boolean, default: false }
    
}, {timestamps: true});

const ConversationModel= db.model('conversations',ConversationSchema);
module.exports=ConversationModel;
