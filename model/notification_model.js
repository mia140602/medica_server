var mongoose = require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    }
},{timestamps: true});

const NotificationModel= db.model('notifications',NotificationSchema);
module.exports=NotificationModel;






