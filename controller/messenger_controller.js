
const ConversationModel = require('../model/conversation_model');
const MessageModel= require('../model/messager_model')
const UserModel = require('../model/user_model');
const DoctorModel= require('../model/doctor_model');


module.exports ={
    
    sendMesssage: async(req,res) => {
        try {
            const { content,appointmentId}= req.body;
    
            if(!content || !appointmentId){
                console.log("Không có dữ liệu");
                return res.status(400).json("Vui lòng cung cấp đủ dữ liệu");
            }
    
            const chat = await ConversationModel.findOne({appointment: appointmentId});
    
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
                chat: chat.id,
            };
    
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
            console.error(error);
            res.status(400).json({error: error.toString()});
        }
    },
    getMessagesByAppointmentId: async(req, res) => {
        try {
          const appointmentId = req.params.appointmentId;
          const conversation = await ConversationModel.findOne({ appointment: appointmentId });
          if (!conversation) {
            return res.status(404).json({ message: 'Không tìm thấy cuộc trò chuyện' });
          }
          const messages = await MessageModel.find({ chat: conversation._id })
          .populate('chat')
          .populate('sender','-password')
          .populate('receiver')
          ;
          res.json(messages);
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Lỗi server' });
        }
      }
}
