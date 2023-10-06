const mongoose =require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;
const departmentSchema = new Schema({
    department_name: {
        type: String,

    },
    department_desc:{
        type:String
    },
    img_path: String,

    
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
const DepartmentModel= db.model('departments',departmentSchema);
module.exports=DepartmentModel;