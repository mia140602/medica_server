const mongoose =require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;
const appointmentSchema = new Schema({
    type:{
        type: String,
        // lowercase: true,//tất cả email được lưu trữ dưới dạng chữ thường trong CSDL
        required: true,
        unique: true
    },
    department:{
        type: String,
        required:true
    },
    status: String,
    patient_name: String,
    doctor_name: String,
    // password:{
    //     type: String,
    //     required: true,

    // },
    
});
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