const meetingService = require('../services/meeting_service');
const MeetingPayloadEnum = require('../utils/meeting-payload.enum');

async function joinMeeting(appointmentId, socket, payload) {
    const { userId, name, userType } = payload;
    const meeting = await meetingService.getMeetingByAppointmentId(appointmentId);

    if (!meeting) {
        sendMessage(socket, {
            type: MeetingPayloadEnum.NOT_FOUND
        });
    } else {
        socket.on('ready', () => {
        addPerson(socket, { meetingId: meeting._id, personId: userId, name })
            .then(() => {
                const joinedMeetingType = userType === 'user' ? MeetingPayloadEnum.USER_JOINED_MEETING : MeetingPayloadEnum.DOCTOR_JOINED_MEETING;
                sendMessage(socket, {
                    type: joinedMeetingType, data: {
                        userId,
                        socketId:socket.id,
                    }
                });

                broadcastUsers(meeting._id, socket, {
                    type: MeetingPayloadEnum.USER_JOINED,
                    data: {
                        userId,
                        name,
                        ...payload.data
                    }
                });
                // Lưu trữ socketId khi người dùng hoặc bác sĩ tham gia cuộc họp
                    let participants = {};
                    participants[userId] = socket.id;

                    // Khi cuộc họp kết thúc, ngắt kết nối socket của người dùng và bác sĩ
                    setTimeout(() => {
                        broadcastUsers(meeting._id, socket, {
                            type: MeetingPayloadEnum.MEETING_ENDED_AUTO,
                            data: {}
                        });

                        // Ngắt kết nối socket của người dùng và bác sĩ
                        Object.keys(participants).forEach(userId => {
                            let socketId = participants[userId];
                            if (meetingServer.sockets.connected[socketId]) {
                                meetingServer.sockets.connected[socketId].disconnect();
                            }
                        });
                        }, 30 * 60 * 1000); // 30 minutes in milliseconds
            }
            )
            .catch((error) => {
                console.log(error);
            });
        });
    }
}

function userLeft(meetingId, socket, payload) {
    const { userId, userType } = payload.data;
    const leftMeetingType = userType === 'user' ? MeetingPayloadEnum.USER_LEFT_MEETING : MeetingPayloadEnum.DOCTOR_LEFT_MEETING;
    broadcastUsers(meetingId, socket, {
        type: leftMeetingType,
        data: {
            userId: userId
        }
    });
}

function forwardConnectionRequest(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, name } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServer.getAllMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.CONNECTION_REQUEST,
                data: {
                    userId,
                    name,
                    ...payload.data
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });
}

function forwardIceCandidate(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, candidate } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServer.getAllMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ICECANDIDATE,
                data: {
                    userId,
                    candidate,
                    ...payload.data
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });
}

function forwardOfferSDP(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, sdp } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServer.getAllMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.OFFER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });
}

function forwardAnswerSDP(meetingId, socket, meetingServer, payload) {
    const { userId, otherUserId, sdp } = payload.data;
    var model = {
        meetingId: meetingId,
        userId: otherUserId
    };
    meetingServer.getAllMeetingUser(model, (error, results) => {
        if (results) {
            var sendPayload = JSON.stringify({
                type: MeetingPayloadEnum.ANSWER_SDP,
                data: {
                    userId,
                    sdp
                }
            });
            meetingServer.to(results.socketId).emit('message', sendPayload);
        }
    });
}

function forwardEvent(meetingId, socket,meetingServer,payload){
    const {userId}=payload.data;
    broadcastUsers(meetingId,socket,meetingServer,{
        type: payload.type,
        data:{
            userId: userId,
            ...payload.data,
        }
    });
}
function endMeeting(meetingId, socket, payload) {
    const { userId, userType } = payload.data;
    const leftMeetingType = userType === 'user' ? MeetingPayloadEnum.USER_LEFT_MEETING : MeetingPayloadEnum.DOCTOR_LEFT_MEETING;
    broadcastUsers(meetingId, socket, {
        type: leftMeetingType,
        data: {
            userId: userId
        }
    });

    // Ngắt kết nối socket của người dùng hoặc bác sĩ
    if (meetingServer.sockets.connected[socket.id]) {
        meetingServer.sockets.connected[socket.id].disconnect();
    }
}

function addPerson(socket, { meetingId, personId, name }) {
    let promise = new Promise(function (resolve, reject) {
        meetingService.getAllMeetingUser({ meetingId }), (error, results) => {
            if (!results) {
                var model = {
                    socketId: socket.id,
                    meetingId: meetingId,
                    userId: personId,
                    joined: true,
                    name: name,
                    isAlive: true,
                };
                meetingService.joinMeeting(model, (error, results) => {
                    if (results) {
                        resolve(true);
                    }
                    if (error) {
                        reject(error)
                    }
                });
            }
            else {
                meetingService.updateMeetingUser({
                    userId: personId,
                    socketId: socket.id,
                }, (error, results) => {
                    if (results) {
                        resolve(true);
                    }

                    if (error) {
                        reject(error);
                    }
                });
            }
        }
    });
    return promise;
}
//gửi tin nhắn đến người dùng cụ thể
function sendMessage(socket, payload) {
    socket.send(JSON.stringify(payload));
}
// gửi cho tất cả người dùng
function broadcastUsers(meetingId, socket, payload) {
    socket.broadcast.emit("message", JSON.stringify(payload));
}

module.exports = {
    joinMeeting,
    userLeft,
    forwardConnectionRequest,
    forwardIceCandidate,
    forwardOfferSDP,
    forwardAnswerSDP,
    forwardEvent,
    endMeeting
    
};