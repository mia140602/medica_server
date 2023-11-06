const res = require('express/lib/response');
const MeetingService = require('../services/meeting_service');
const req = require('express/lib/request');
const MeetingModel= require('../model/meeting_model')

exports.joinMeeting = async (req, res, next) => {
    try {
    const { appointmentId, userId, socketId } = req.body;
    if (!appointmentId || !userId || !socketId) {
    return res.status(400).json({error: "Chưa cung cấp đầy đủ giá trị"});
    }
    const result = await MeetingService.joinMeetingbyappointmentId(appointmentId, userId, socketId);
    if (result.status) {
    res.json({ status: true, success: result.message });
    } else {
    res.json({ status: false, error: result.message });
    }
    } catch (error) {
    res.status(500).json({ error: "Đã xảy ra lỗi" });
    }
    };


    exports.getMeeting = async (req, res, next) => {
      try {
          const appointmentId = req.params.appointmentId;
          if (!appointmentId) {
              return res.status(400).json("Bạn chưa cung cấp appointmentId");
          }
          let result = await MeetingModel.findOne({appointment: appointmentId});
          if (!result) {
              return res.status(404).json({ message: 'Không tìm thấy cuộc họp nào' });
          } else {
              // Chuyển đổi BigInt thành chuỗi trước khi chuyển đổi thành JSON
              result = JSON.stringify(result, (_, v) => typeof v === 'bigint' ? v.toString() : v);
              res.json(JSON.parse(result));
          }
      } catch (error) {
          console.log(error);
          res.status(500).json({ error: "có lỗi khi tìm meeting"});
      }
  };