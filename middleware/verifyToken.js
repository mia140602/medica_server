const jwt = require('jsonwebtoken');
const UserSerVice = require("../services/user_services");
const UserModel= require('../model/user_model');

const verifytoken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log(req.headers.authorization);


    if (authHeader) {
        const token= authHeader.split(" ")[1];
        jwt.verify(token, "secretKey", async (err, user) => {
            if (err) {
                return res.status(403).json("Không tồn tại token");
            }

            // Attach user to request object
            // req.user = await UserSerVice.getUserInfo(user.email);
            req.user= user;
            console.log(user);
            next();
        });
    } else {
      return res.status(401).json("Bạn chưa được xác thực ");
    }

};

const verifyAndAuthorization=(req, res, next)=>{
    verifytoken(req, res,()=>{
        if(req.user.id== req.params.id){
            next();
        }else{
           return res.status(403).json("Bạn bị hạn chế thực hiện thao tác này ");
        }
    });
    
}

module.exports={ verifytoken, verifyAndAuthorization};