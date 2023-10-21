var express = require ('express');
var session = require('express-session');
var router = express.Router();
// var db = require.main.require ('./models/db_controller');
var db= require('../models/db_controller');
var bodyPaser = require ('body-parser');
// const { request } = require('../app');
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
router.get('/', async function (req, res) {
    try {
      // Lấy giá trị doctorId từ cookie
      var username = req.cookies['username'] || 'Guest';
      var doctor = await db.getdoctordetails(username);
        console.log("thong tin : " + doctor._id);
        var doctorId = doctor._id.toString();
        var conversations = await db.getAllInbox(doctorId);
        // console.log(conversations);

  
      // Đảm bảo có giá trị doctorId hợp lệ
      if (doctor && doctor._id) {
        var doctorId = doctor._id;
  
        // Lấy cuộc trò chuyện dựa trên doctorId
        var conversations = await db.getAllInbox(doctorId);
  
        // Kiểm tra kết quả
        console.log("Cuộc trò chuyện:", conversations);
        res.render('messenger.ejs', { list: doctor, conversations: conversations });
      } else {
        res.status(500).send("Lỗi không tìm thấy thông tin bác sĩ.");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Đã xảy ra lỗi.");
    }
  });
  






module.exports =router;