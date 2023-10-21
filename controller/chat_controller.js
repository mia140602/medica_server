
const { response } = require('express');
const ConversationModel = require('../model/conversation_model');
const MessageModel= require('../model/messager_model')
const UserModel = require('../model/user_model');


module.exports ={
    //tạo cuộc trò chuyện mới 
    accessChat: async(req, res)=>{
        // const {userId}=req.body;
        const {doctorId}=req.body;
        // console.log(userId)
        if(!doctorId){
           return res.status(400).json("Không tồn tại userId ");
        }
        var isChat= await ConversationModel.find({
            user: req.user._id,
            doctor: doctorId
        })
        .populate("user","-password") // thêm thông tin chi tiết về user mà không bao gồm password
        .populate("doctor","-password")
        .populate("latestMessage");

        isChat= await UserModel.populate(isChat,{
            path:"latestMessage.sender",// tìm đến trường latestmessage.user 
            select:"email fullName ",
            model: "users" 
        });
        if(isChat.length > 0 ){
          return  res.send(isChat);
        }else{
            var chatData={
                chatName: req.user.id,
                user: req.user._id,
                doctor: doctorId
            }
        };
        try {
           const createdChat= await ConversationModel.create(chatData);
           console.log("tạo chat"+createdChat);
           const fullChat= await ConversationModel.findOne({id:createdChat._id})
            .populate("user","-password", "doctor");
           return res.status(200).json(fullChat);
          
        } catch (error) {
           return res.status(400).json({error:"Không thể tạo cuộc hội thoại"});
        }
        
    },
    getChat: async(req,res) => {
    

        try {
            ConversationModel.find({user: {$eq: req.user.id}})
            .populate("user","-password")
            .populate("latestMessage")
            .sort({updateAt:-1})
            .then(async (results)=>{
                results= await UserModel.populate(results,{
                    path:"latestMessage.sender",
                    select:'fullName, email',
                    model: "users"
                });
                res.status(200).send(results);
            })
           
        } catch (error) {
            return res.status(500).json("Có lỗi khi gửi tin nhắn");
        }

    }

}
