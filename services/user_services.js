const UserModel=require('../model/user_model')
const jwt= require('jsonwebtoken')
class UserSerVice{
    static async registerUser(email,password){
        try{
            const creatUser = new UserModel({email,password});
            return await creatUser.save();
        }catch(err){
            throw err;
        }
    }
    static async checkUser(email){
        try {
            return await UserModel.findOne({email})
        } catch (error) {
            throw error;
        }
    }

    static async generateToken(tokenData,secretKey,jwt_expire){
        return jwt.sign(tokenData,secretKey,{expiresIn: jwt_expire})
    }
    // tokenData: Đối số đầu tiên của phương thức này là dữ liệu mà bạn muốn mã hóa vào JWT. Thường thì đây là thông tin về người dùng hoặc các dữ liệu tùy chỉnh mà bạn muốn đính kèm vào token.

    // secretKey: Đối số thứ hai là khóa bí mật (secret key) sẽ được sử dụng để mã hóa JWT. Đây là một chuỗi bí mật chỉ có server biết. Khóa này được sử dụng để kiểm tra tính hợp lệ của JWT khi nó được gửi lại từ client.
    
    // jwt_expire: Đối số thứ ba là thời gian tồn tại của JWT, thường được chỉ định bằng số giây. Sau thời gian này, JWT sẽ hết hạn và không còn hiệu lực.
    
    //cập nhật thông tin người dùng
    static async updateProfile(email, name, nickName, birthday, gender) {
      try {
        // const { email, name, nickName, birthday, gender } = user;
        const userToUpdate = await UserModel.findOne({ email });
        if (!userToUpdate) {
          throw new Error('Không tìm thấy người dùng');
        }
        
        userToUpdate.fullName = name;
        userToUpdate.nickName = nickName;
        userToUpdate.birthday = birthday;
        userToUpdate.gender = gender;
        userToUpdate.profileCompleted = true;
        await userToUpdate.save();
        return userToUpdate;
        // console.log(userToUpdate);
      } catch (error) {
        throw error;
      }
  }
      //lấy thông tin người dùng qua email
      static async getUserInfo(email) {
        try {
          return await UserModel.findOne({ email });
        } catch (error) {
          throw error;
        }
      }


}
module.exports=UserSerVice;