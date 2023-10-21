var express = require ('express');
var router = express.Router();
var db = require.main.require ('./models/db_controller');
var AppointmentModel= require('../model/appointment_model');
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
      var doctor = await db.getdoctordetails(username);
      res.render('appointment.ejs', { list: appointments ,doctor: doctor});
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });
  router.get('/accept_appointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        await AppointmentModel.updateOne({ _id: id }, { status: 'Accepted' });
        res.redirect('/appointment');
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});
router.get('/reject_appointment/:id', async function(req, res) {
    try {
        var id = req.params.id;
        await AppointmentModel.updateOne({ _id: id }, { status: 'Rejected' });
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