var express = require ('express');
var router = express.Router();
var db = require.main.require ('./models/db_controller');
var Notification= require('../model/notification_model');
var bodyPaser = require ('body-parser');

router.get('*', function(req, res, next){
	if(req.cookies['username'] == null){
		res.redirect('/login');
	}else{
		next();
	}
});

router.get('/', async function(req, res) {
    try {
        var username = req.cookies['username'];
      var appointments = await db.getdoctorappointment(username);
      appointments.sort((a, b) => b.created_at - a.created_at);
      var doctor = await db.getdoctordetails(username);
      res.render('appointment.ejs', { list: appointments ,doctor: doctor});
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });
  router.get('/acceptAppointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        await db.acceptAppointment(id);
        res.redirect('/appointment');
    } catch (err) {
        // Nếu lịch hẹn đã được xử lý, hiển thị thông báo lỗi
        if (err.message === 'Lịch hẹn đã được xử lý') {
            res.render('appointment', { errorMessage: err.message });
        } else {
            console.error(err);
            res.status(500).send();
        }
    }
});

  router.get('/rejectAppointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        const appointment = await db.rejectAppointment(id);
        // Tạo thông báo
        const notification = new Notification({
            userId: appointment.patientId,
            message: `Bác sĩ ${appointment.doctor.userName} đã từ chối lịch hẹn ${appointment.type} lúc ${appointment.time} ngày ${appointment.date} của bạn`
        });
        await notification.save();
        res.redirect('/appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});


router.get('/add_appointment',function(req,res){
    res.render('add_appointment.ejs');
});

router.post('/add_appointment',function(req,res){

    db.add_appointment(req.body.p_name,req.body.department,req.body.d_name,req.body.date,req.body.time,req.body.email,req.body.phone,function(err,result){
        res.redirect('/appointment');
    });

});


router.get('/edit_appointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        var result = await db.getappointmentbyid(id);
        console.log(result);
        res.render('edit_appointment.ejs', {list : result});
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/edit_appointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        await db.editappointment(id, req.body.p_name, req.body.department, req.body.d_name, req.body.date, req.body.time, req.body.email, req.body.phone);
        res.redirect('/appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});


router.get('/delete_appointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        var result = await db.getappointmentbyid(id);
        console.log(result);
        res.render('delete_appointment.ejs', {list : result});
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/delete_appointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        await db.deleteappointment(id);
        res.redirect('/appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});









module.exports =router;