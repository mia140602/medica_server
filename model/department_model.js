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

const DepartmentModel= db.model('departments',departmentSchema);
module.exports=DepartmentModel;