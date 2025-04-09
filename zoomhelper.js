const axios = require('axios');
const qs = require('qs');
const MeetingModel= require('./model/meeting_model');
const moment = require('moment-timezone');


const authorize=()=>{
    return `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${encodeURI(process.env.ZOOM_OAUTH_REDIRECT_URI)}` ;
}

const redirect=async (code)=>{
    var data = qs.stringify({
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.ZOOM_OAUTH_REDIRECT_URI
        
    });
    var config={
        method:'post',
        url: 'https://zoom.us/oauth/token',
        headers: {
            "Content-Type":"application/x-www-form-urlencoded",
            "Authorization":"Basic"+ Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')
            // "Authorization":"Basic"+ process.env.access_token

        },
        data: data
    };
    var result= await axios(config)
        .then(function(response){
            return response;
        })
        .catch(function (error){
            return error;
        });

        return result;
}

const meetings=async (filter,filteredMeetings)=>{
    let meetingListUri=`https://api.zoom.us/v2/users/me/meetings?type=${filter.type||'scheduled'}&page_size=300&next_page_token=${filter.next_page_token||''}&page_number=${filter.page_number||1}`;
//pagesize: xác định số lượng cuộc họp tối đa được trả về trong 1 yêu cầu
    const {data} = await axios({
        url: meetingListUri,
        headers: 
        {
            Authorization: "Bearer "+ process.env.access_token
        }
    }).then(response => {
        return response;
    }).catch(error =>{
        return error;
    });
    if(filteredMeetings){
        filteredMeetings=[];
    }
    if(data.page_count- data.page_number>0){
        filteredMeetings.push(data.meetings);
        return meetings({
            next_page_token: data.next_page_token,
            type: filter.type,
            page_number:page_number +1,
        },filteredMeetings);
    }
    filteredMeetings.push(data.meetings);

    return filteredMeetings;
}



const meeting= async (doctorId, userId, appointmentId, type, startTime, endTime)=>{
    let meetingUri=`https://api.zoom.us/v2/users/me/meetings`;
    
    let meetingStartTime = moment(startTime);
    let meetingEndTime=moment(endTime);
    let formattedStartTime = meetingStartTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    let formattedEnTime= meetingEndTime.format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
    const payload={
        
    
            "agenda": `${type}`,
            "default_password": false,
            "duration": 30,
            "password":"12345678",
            "pre_schedule":false,
            "schedule_for":"ngoclinh140602@gmail.com",
            "start_time":formattedStartTime,
            "end_date_time":formattedEnTime,
            "timezone":"Asia/Ho_Chi_Minh",
            "topic": `${type}`,
            "type":2,
            "settings":{
                 "join_before_host":true,
                "waiting_room": false,
                "continuous_meeting_chat": {
                        "enable": true,
                        "auto_add_invited_external_users": true
                    }
            }
           
        
    }
    console.log("Payload:", payload); // Log payload
    const {data}= await axios({
        url: meetingUri,
        method: 'post',
        data:payload,
        headers:
        {
            Authorization: "Bearer "+ process.env.access_token

        }
    }).then(response => {
        return response;
        
   
    })
    .catch(error=> {
        return error;
    });
    // console.log("Response data:", data); // Log response data
    // return data;
     // Lưu thông tin cuộc họp vào cơ sở dữ liệu
  const meeting = await MeetingModel.create({
    zoomMeetingId: data.id,
    user: userId,
    doctor: doctorId,
    appointment: appointmentId,
    startTime: startTime,
    endTime: endTime,
    type: type,
    zoomMeetingUrl: data.join_url
  });

  return meeting  ;

}

const updateMeeting= async (meetingId,payload) => {
    let meetingUri=`https://api.zoom.us/v2/meetings/${meetingId}`;

    const {data} =await axios({
        url: meetingUri,
        method:'patch',
        data:payload,
        headers:
        {
            Authorization: `Bearer ${process.env.access_token}`
        }
    }).then(response => {
        return response;
    }).catch(error=>{
        return error;
    });
    console.log(data);
    return data;
}


module.exports={
    authorize,
    redirect,
    meetings,
    meeting,
    updateMeeting
}