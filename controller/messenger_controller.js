
const ConversationModel = require('../model/conversation_model');
const MessageModel= require('../model/messager_model')
const UserModel = require('../model/user_model');
const DoctorModel= require('../model/doctor_model');


module.exports ={
    getAllMessage: async(req, res)=>{
        try {
            const pageSize=12;// số lượng tin nhắn mỗi trang
            const page= req.query.page||1//current page number
            //tính toán số lượng tin nhắn để bỏ qua
            const skipMessages= (page-1)*pageSize;
            //tìm kiếm tin nhắn
            var message= await MessageModel.find({chat: req.params.id})
            .populate("sender","userName email")
            // .populate("receiver","userName email avatar")
            .populate('chat')
            .sort({createdAt: -1})
            .skip(skipMessages)//skip messages dựa vào phân trang
            .limit(pageSize);

            message=await DoctorModel.populate(message,{
                path:"chat.doctor",
                select:"userName email avatar",
            });
           res.json(message);
        } catch (error) {
            console.log(error); 
            res.status(500).json({error:"Không thể tải tin nhắn"});
        }
    },
    sendMesssage: async(req,res) => {
        const { content,chatId}= req.body;

        if(!content || !chatId){
            console.log("Không có dữ liệu");
            return res.status(400).json("Vui lòng cung cấp đủ dữ liệu");
        }
        const chat = await ConversationModel.findById(chatId);

        // Kiểm tra xem cuộc trò chuyện có tồn tại không
        if (!chat) {
            return res.status(404).json("Không tìm thấy cuộc trò chuyện");
        }
        var newMessage ={
            sender: req.user._id,
            receiver: chat.doctor,
            onModelSender: 'users', // đặt onModel cho sender là 'users'
            onModelReceiver: 'doctors', // đặt onModel cho receiver là 'doctors'
            content: content,
            chat: chatId,
        };

        try {

            var message= await MessageModel.create(newMessage);
            // console.log(req.user._id);
            message= await message.populate("sender","userName email");
            message= await message.populate("receiver", "userName email avatar department");
            message= await message.populate("chat");    
            message= await DoctorModel.populate   (message,{
                path: "chat.doctor",
                select:"userName  email",
            });
            await ConversationModel.findByIdAndUpdate(req.body.chatId, {latestMessage:message});
            
            res.json(message);
        } catch (error) {
            res.status(400).json({error: error});
        }

    }

}
