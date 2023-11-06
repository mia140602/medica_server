const app=require('./app');
const db= require('./config/db')
const UserModel=require('./model/user_model')
var http= require('http');
const cors= require('cors');
const { initMeetingServer } = require('./utils/meeting-server');
var server= http.createServer(app);
var io= require('socket.io')(server,{
    pingTimeout:60000,
    //xác định nguồn nào được truy cập tài nguyên máy chủ
    cors:{
        //localhost:
        //origin :"http://localhost:3000 "
    }
})



const port =3000;

app.get('/',(req,res)=> {
    res.send("hello World");
})
io.on("connection",(socket)=> {
    const socketId= socket.id;
    const meetingId = socket.handshake.query.id;
    initMeetingServer(meetingId, socket, io);
    console.log("Connected");
    console.log(socket.id,"has joined");
    socket.on("/test",(msg)=>{
        console.log(msg);
    });
    socket.on("setup",(userId)=>{
        socket.join(userId);
        socket.broadcast.emit('online-user',userId);
        console.log(userId);

    });
    socket.on('typing',(room)=>{
        console.log("typing");
        console.log("room");
        socket.to(room).emit('typing',room);
    });
    socket.on('stop typing',(room)=>{
        console.log("stop typing");
        console.log("room");
        socket.to(room).emit('stop typing',room);
    });
    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("User Joined:"+room);
        
    });

    socket.on('new message', async (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        var sender = newMessageReceived.sender;
        var receiver = newMessageReceived.receiver;
        var onModelSender = newMessageReceived.onModelSender;
        var onModelReceiver = newMessageReceived.onModelReceiver;
      
        // Lưu tin nhắn mới vào cơ sở dữ liệu
        const newMessage = new MessageModel({
          content: newMessageReceived.content,
          chat: chat,
          sender: sender,
          receiver: receiver,
          onModelSender: onModelSender,
          onModelReceiver: onModelReceiver
        });
        await newMessage.save();
      
        // Cập nhật cuộc trò chuyện với tin nhắn mới nhất
        await ConversationModel.findByIdAndUpdate(chat, { latestMessage: newMessage._id });
      
        // Phát sự kiện 'new_message' để thông báo cho các client khác
        io.to(chat).emit('new_message', newMessage); // Gửi toàn bộ tin nhắn mới
      });

    
    // socket.on('new message', async (newMessageReceived) => {
    //     var chat = newMessageReceived.chat;
    //     var room = chat._id;
    //     var sender = newMessageReceived.sender;
    
    //     if (!sender) {
    //         console.log("Không có người dùng nào");
    //         return;
    //     }
    //     var senderId = sender._id;
    //     console.log(senderId + "message sender");
    
    //     const users = chat.users;
    //     if (!users) {
    //         console.log("Không có người dùng nào");
    //         return;
    //     }
    
    //     // Lưu tin nhắn mới vào cơ sở dữ liệu
    //     const newMessage = new MessageModel({
    //         content: newMessageReceived.content,
    //         chat: room,
    //         sender: senderId,
    //         // Thêm các thông tin khác về tin nhắn tại đây
    //     });
    //     await newMessage.save();
    
    //     // Cập nhật cuộc trò chuyện với tin nhắn mới nhất
    //     await ConversationModel.findByIdAndUpdate(room, { latestMessage: newMessage._id });
    
    //     // Phát sự kiện 'new_message' để thông báo cho các client khác
    //     io.to(room).emit('new_message', {
    //         chatId: room,
    //         content: newMessage.content,
    //         // Thêm các thông tin khác về tin nhắn tại đây
    //     });
    
    //     socket.to(room).emit("message received", newMessageReceived);
    //     socket.to(room).emit('message sent', "New Message");
    // });

    socket.off('setup',()=>{
        console.log("Người dùng không online");
        socket.leave(userId);
    })

});

//chatroom route:
require("./middleware/socket")(app,io,db);


server.listen(port,"0.0.0.0", ()=>{
    console.log(`Server Listening on Port http://localhost:${port}`);
});



//check time appointment
require('./check_end_time');
