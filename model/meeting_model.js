var mongoose = require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;



var MeetingSchema = new Schema({
    zoomMeetingId: { type: BigInt },
    user: { type: mongoose.Schema.ObjectId, ref: 'users' },
    doctor: { type: mongoose.Schema.ObjectId, ref: 'doctors' },
    appointment: { type: mongoose.Schema.ObjectId, ref: 'appointments' },
    startTime: { type: Date },
    endTime: { type: Date },
    type: { type: String, enum: ['videoCall', 'voiceCall'] },
    isEnded: { type: Boolean, default: false },
    zoomMeetingUrl: {
        type: String,
        required: true
    },
}, {timestamps: true});
MeetingSchema.statics.createMeeting = function(doctorId, userId, appointmentId, type, startTime, endTime, zoomMeetingId,zoomMeetingUrl) {
   

    // logic to create a new meeting
    return this.create({
        doctor: doctorId,
        user: userId,
        appointment: appointmentId,
        type: type,
        startTime: startTime,
        endTime: endTime,
        zoomMeetingId:zoomMeetingId,
        zoomMeetingUrl:zoomMeetingUrl
    });
};
MeetingSchema.statics.getMeetingByAppointmentId = function (appointmentId) {
    return this.findOne({ appointment: appointmentId });
};
const MeetingModel= db.model('meetings',MeetingSchema);
module.exports=MeetingModel;
