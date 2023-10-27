var express = require ('express');
var router = express.Router();
var db = require.main.require ('./models/db_controller');
var bodyPaser = require ('body-parser');
const ConversationModel = require('../model/conversation_model');
var MessageModel= require('../model/messager_model')
router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

// router.get('/',async function(req,res){
//     try {
//         const result= await db.getcomplain();
// 		const data = await db.getInbox(req);
//         res.render('inbox.ejs',{list :result, data: data});
//     } catch(err) {
//         console.error(err);
//         res.status(500).send(err);
//     }
	
// });
// inbox.js
router.get('/:id', async function(req, res) {
    try {
        const conversationId = req.params.id;
        const conversation = await ConversationModel.findById(conversationId)
                                .populate('user')
                                .populate('doctor')
                                
                                ;
        
        const messages = await db.getMessagesForConversation(conversationId);
        res.render('inbox.ejs', { list: messages , detail: conversation});
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});
router.post('/sendMessage', async function(req, res) {
    try {
        const messageContent = req.body.message;
        const senderId = req.body.senderId;
        const receiverId = req.body.receiverId;
        const conversationId = req.body.conversationId;
        console.log("messagecontent:"+ messageContent);
            console.log("senderId:"+ senderId);
            console.log("receiverId:"+ receiverId);
            console.log("conversationId:"+ conversationId);
        if (!conversationId) {
            res.status(400).send('Missing conversationId');
            
            return;
        }
        const newMessage = new MessageModel({
            content: messageContent,
            chat: conversationId,
            sender: senderId,
            receiver: receiverId,
            onModelSender: 'doctors',
            onModelReceiver: 'users'
        });

        await newMessage.save();

        res.redirect('/inbox/' + conversationId);
    } catch(err) {
        console.error(err);
        res.status(500).send(err);
    }
});













module.exports =router;

