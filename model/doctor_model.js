const mongoose =require('mongoose');
const db= require("../config/db");
const { Schema } = mongoose;
const doctorSchema = new Schema({
    userName:{
        type: String,
        required:true,
        unique: true
    },
    email:{
        type: String,
        lowercase: true,//tất cả email được lưu trữ dưới dạng chữ thường trong CSDL
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,

    },
    phoneNo: {
        type: String,
        unique: false
      },
    biography:{
        type:String,
    },
    imgPath:String,
    department:String,
    
});

const DoctorModel= db.model('doctors',doctorSchema);
module.exports=DoctorModel;