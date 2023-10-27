var express = require('express');
var router = express.Router();
var db = require('../models/db_controller');
var session = require('express-session');

router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.get('*', function(req, res, next){
    if(req.cookies['username'] == null){
        res.redirect('/login');
    }else{
        next();
    }
});

// router.get('/:chatId', async function(req, res) {
//     try {
//         var username = req.cookies['username'] || 'Guest';
//         var chatId = req.params.chatId;
//         var messages = await db.getMessages(chatId);
//         res.render('chat.ejs', { username: username, messages: messages });
//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// });
router.get('/', async function(req, res) {
    try {
        var username = req.cookies['username'] || 'Guest';
        // var doctor = await db.getdoctordetails(username);
        // req.user = doctor; // Set req.user to the current doctor
        var conversations = await db.getdoctorconversations(username);
        res.render('conversation.ejs', { list: conversations });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

module.exports = router;