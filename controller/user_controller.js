const req = require("express/lib/request");
const UserSerVice= require("../services/user_services");
const res = require("express/lib/response");
const jwt = require('jsonwebtoken');

exports.register= async(req,res,next)=> {
    try {
        const {email, password}=req.body;
        console.log(email,password);
        const sucessRes= await UserSerVice.registerUser(email,password);
        res.json({status: true,success:"User registerd Successfully"});
    }catch(error){
        throw error;
    }
}

exports.login= async(req,res,next)=> {
    try {
        const {email, password}=req.body;
        console.log(email,password);
        const user=await UserSerVice.checkUser(email);
        if(!user){
            return res.status(400).json({status: false, message: 'Email chưa đăng ký'});
        }
        const isMatch=await user.comparePassword(password);
        if(isMatch==false){
            return res.status(400).json({status: false, message: 'Sai mật khẩu'});
        }
        const userData = {
          email: user.email,
          name: user.fullName,
          nickName: user.nickName,
          birthday: user.birthday,
          gender: user.gender,
        };
        let tokenData={_id: user._id,email:user.email,
            profileCompleted: user.profileCompleted
        };
        
        const token= await UserSerVice.generateToken(tokenData,"secretKey",'2h');
        
      
          
        res.status(200).json({status:true,token:token, profileCompleted: user.profileCompleted,
            data: userData,
            
        })
    }catch(error){
        res.status(500).json({status: false, message: 'Đã xảy ra lỗi'});
    }


}
exports.getUserInfo = async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      const decodedToken = jwt.verify(token, secretKey);
      const email = decodedToken.email;
      const user = await UserSerVice.getUserInfo(email);
      if (!user) {
        return res.status(404).json({ status: false, message: 'Không tìm thấy người dùng' });
      }
      return res.status(200).json({ status: true, data: user });
    } catch (error) {
      return res.status(500).json({ status: false, message: 'An error occurred', error: error });
    }
  };
  exports.updateProfile = async(req, res, next) => {
    
    try {
    const { email, name, nickName, birthday, gender } = req.body;
    const updatedUser = await UserSerVice.updateProfile(email, name, nickName, birthday, gender);
    const userData = {
      email: updatedUser.email,
      name: updatedUser.fullName,
      nickName: updatedUser.nickName,
      birthday: updatedUser.birthday,
      gender: updatedUser.gender,
      profileCompleted: updatedUser.profileCompleted
    };
    res.json({ status: true, message: "Cập nhật thông tin cá nhân thành công", data: userData });
  } catch (error) {
    res.status(500).json({ status: false, message: 'Đã xảy ra lỗi', error: error.toString() });
  }
  }