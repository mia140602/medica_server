const mongoose =require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;
const appointmentSchema = new Schema({
    doctor: { type: mongoose.Schema.ObjectId, ref: 'doctors' },
      patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
      date: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      type:{
        type: String,
        required: true
      },
      problem:{
        type:String
      },
      status:{
        type:String,
        default:"Chưa xác nhận"
      }
    },{timestamps: true});

// const appointmentSchema = new Schema({
//     doctorId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'doctors',
//         required: true
//     },
//     userId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'users',
//         required: true
//     },
//     appointmentDate: {
//         type: Date,
//         required: true
//     },
//     // Add other fields as needed
// });
const AppointmentModel= db.model('appointments',appointmentSchema);
module.exports=AppointmentModel;