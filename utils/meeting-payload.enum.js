const MeetingPayloadEnum = {
    USER_JOINED_MEETING: 'user_joined_meeting',
    DOCTOR_JOINED_MEETING: 'doctor_joined_meeting',
    USER_LEFT_MEETING: 'user_left_meeting',
    DOCTOR_LEFT_MEETING: 'doctor_left_meeting',
    CONNECTION_REQUEST: 'connection-request',
    OFFER_SDP: 'offer-sdp',
    ANSWER_SDP: 'answer-sdp',
    END_MEETING: 'end-meeting',
    MEETING_ENDED: 'meeting-ended',
    MEETING_ENDED_AUTO: 'meeting_ended_auto',
    ICECANDIDATE: 'icecandidate',
    VIDEO_TOGGLE: 'video-toggle',
    AUDIO_TOGGLE: 'audio-toggle',
    NOT_FOUND: 'not-found',
    UNKNOWN: 'unknown'
}
module.exports = MeetingPayloadEnum;