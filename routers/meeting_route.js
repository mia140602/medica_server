const MeetingController= require('../controller/meeting_controller');

const express= require('express');
const router= express.Router();

router.post('/meeting/join',MeetingController.joinMeeting);
router.get('/meeting/:appointmentId',MeetingController.getMeeting)


module.exports= router;