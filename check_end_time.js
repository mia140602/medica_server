// check_end_times.js
const MeetingModel = require('./model/meeting_model');
const ConversationModel = require('./model/conversation_model');

function checkEndTimes() {
    const currentTime = new Date();

    // Check meetings
    MeetingModel.find({ isEnded: false, endTime: { $lt: currentTime } })
        .then(meetings => {
            for (let meeting of meetings) {
                meeting.isEnded = true;
                meeting.save();
            }
        });

    // Check conversations
    ConversationModel.find({ isEnded: false, endTime: { $lt: currentTime } })
        .then(conversations => {
            for (let conversation of conversations) {
                conversation.isEnded = true;
                conversation.save();
            }
        });
}

// Run checkEndTimes every minute
setInterval(checkEndTimes, 60 * 1000);