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


router.get('/', async function(req, res) {
    try {
        var username = req.cookies['username'] || 'Guest';
     
        var meetingVideo = await db.getdoctormeetingvoice(username);
        res.render('meetingVoice.ejs', { list: meetingVideo });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.get('/voiceCall/:meetingId', async function(req, res) {
    const meetingId = req.params.meetingId;
    const meeting = await db.getMeetingById(meetingId);

    const now = new Date();
    if (now < meeting.startTime || now > meeting.endTime) {
        res.status(403).send('Bạn không thể tham gia cuộc họp vào thời điểm này.');
    } else {
        res.redirect(meeting.zoomMeetingUrl);
    }
});

module.exports = router;