var express = require ('express');
var session = require('express-session');
var router = express.Router();
// var db = require.main.require ('./models/db_controller');
var db= require('../models/db_controller');
var bodyPaser = require ('body-parser');
const { request } = require('../app');
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

router.get('/',async function(req,res){
    try {
        const result = await db.getAllDoc();
        const applist = await db.getallappointment();
        var total_doc = result.length;
        var appointment = applist.length;
        var username = req.cookies['username'] || 'Guest';
        var doctor = await db.getdoctordetails(username);
        res.render('home.ejs', { doc: total_doc, doclist: result, appointment: appointment, applist: applist,username: username,list: doctor  });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});


router.get('/departments',async function(req,res){
    try {
        const result= await db.getalldept();
        res.render('departments.ejs',{list:result});
    } catch (error) {
        console.error(err);
        res.status(500).send();
    }
    
});

router.get('/add_departments',function(req,res){
    res.render('add_departments.ejs');
});

router.post('/add_departments',function(req,res){
    var name = req.body.dpt_name;
    var desc = req.body.desc;
    db.add_dept(name,desc,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/delete_department/:id',function(req,res){

    var id = req.params.id;
    db.getdeptbyId(id,function(err,result){
        res.render('delete_department.ejs',{list:result});
    });
});

router.post('/delete_department/:id',function(req,res){
    var id = req.params.id;
    db.delete_department(id,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/edit_department/:id',function(req,res){
    var id = req.params.id;
    db.getdeptbyId(id,function(err,result){
        res.render('edit_department.ejs',{list:result});
    })
});


router.post('/edit_department/:id',function(req,res){

    db.edit_dept(req.params.id,req.body.dpt_name,req.body.desc,function(err,result){
        res.redirect('/home/departments');
    });
});

router.get('/profile', async function(req, res) {
    try {
        var username = req.cookies['username'] || 'Guest';
        
        var doctor = await db.getdoctordetails(username);
        console.log(doctor); 
        res.render('profile.ejs', { list: doctor });
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

router.post('/profile',function(req,res){
    var username = req.cookies['username'];
    db.getuserdetails(username,function(err,result){
        var id = result[0].id;
        var password = result[0].password;
        var username = result[0].username; 
        if (password== req.body.password){

            db.edit_profile(id,req.body.username,req.body.email,req.body.new_password,function(err,result1){
                if (result1){
                    res.send("profile edited successfully");
                }
                if(!result1){ res.send("old password did not match");}
                   
                

            });
        }
        


    }) ;
});

module.exports =router;