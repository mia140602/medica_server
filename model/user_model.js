const mongoose =require('mongoose');
const bcrypt=require("bcrypt");
const db= require("../config/db");
const { Schema } = mongoose;


const userSchema = new Schema({
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
    fullName:{
        type:String,
    },
    nickName:{
        type:String,
    },
    birthday: {
        type: String,
    },
    gender: {
        type: String,
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
      },
},
{
    timestamps: true
  }
);

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) {
        return next();
      }
    try{
        var user= this;
        const salt=await(bcrypt.genSalt(10));
        const hashpass= await bcrypt.hash(user.password,salt);
        user.password=hashpass;
    }catch(error){
        throw error;
    }
});
userSchema.methods.comparePassword= async function(userPassword){
    try {
        const isMatch=await bcrypt.compare(userPassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}

const UserModel= db.model('users',userSchema);
module.exports=UserModel;