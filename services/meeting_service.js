const MeetingModel = require('../model/meeting_model');

class MeetingService {
    static async getMeetingByAppointmentId(appointmentId) {
        try {
            const meeting = await MeetingModel.getMeetingByAppointmentId(appointmentId);
            return meeting;
        } catch (err) {
            throw err;
        }
    }

  

    static async getMeetingUser(meetingId, userId) {
        try {
            const user = await MeetingModel.findOne({ _id: meetingId, user: userId });
            return user;
        } catch (err) {
            throw err;
        }
    }

    static async updateMeetingUser(meetingId, userId, socketId) {
        try {
            const user = await MeetingModel.findOneAndUpdate({ _id: meetingId, user: userId }, { socketId: socketId }, { new: true });
            return user;
        } catch (err) {
            throw err;
        }
    }
    static async getAllMeetingUser(meetingId) {
        try {
            const meeting = await MeetingModel.findById(meetingId);
            return meeting;
        } catch (err) {
            throw err;
        }
    }

    static async joinMeetingbyappointmentId(appointmentId,userId, socketId) {
        try {
            const meeting = await MeetingModel.findOne({appointment: appointmentId});
            if (!meeting) {
                return { status: false, message: "Không tìm thấy meeting room nào" };
            }
    
            const currentTime = new Date();
            const endTime = new Date(meeting.startTime.getTime() + 30*60000); // endTime là 30 phút sau startTime
    
            if (currentTime < meeting.startTime) {
                return { status: false, message: "Cuộc họp chưa bắt đầu" };
            } else if (currentTime > endTime) {
                return { status: false, message: "Cuộc họp đã kết thúc" };
            } else {
                // Logic to start the meeting
                // ...
                return { status: true, message: "Tham gia thành công" }; // Meeting started
            }
        } catch (err) {
            throw err;
        }
    }

    

}

module.exports = MeetingService;