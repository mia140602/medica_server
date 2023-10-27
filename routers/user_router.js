const router=require("express").Router();

const UserController= require('../controller/user_controller');

const MessageController= require('../controller/messenger_controller');
const ChatController= require('../controller/chat_controller');
const { verifyAndAuthorization, verifytoken } = require("../middleware/verifyToken");


//create message
router.post('/userSendMessage',verifyAndAuthorization, MessageController.sendMesssage);
//get all message
router.get('/messages/:appointmentId',  MessageController.getMessagesByAppointmentId);
//auth
router.post("/registration",UserController.register);
router.post('/userLogin',UserController.login);
router.put("/updateProfile", UserController.updateProfile);
router.get("/getUserInfo",UserController.getUserInfo);

//chat
router.post('/userCreateChat',verifyAndAuthorization ,ChatController.accessChat);
router.get('/getChat',verifyAndAuthorization,ChatController.getChat);


module.exports= router;