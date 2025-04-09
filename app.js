// const { use } = require('bcrypt/promises');
const express= require('express');
const body_parser=require('body-parser');

const userRouter= require('./routers/user_router');
const meetingRouter =require('./routers/meeting_route');

const flash= require('connect-flash');



const {authorize,redirect, meetings, meeting, updateMeeting, }= require('./zoomhelper')










// new/
require('dotenv').config();
var session = require ('express-session');
var cookie = require ('cookie-parser');
var path = require ('path');
var ejs= require ('ejs');
var multer = require('multer');
var path = require ('path');
var async = require ('async');
var nodmailer = require ('nodemailer');
var crypto = require ('crypto');
var expressValidator = require ('express-validator');



const app=express();






var bodyParser = require ('body-parser');

var  login = require ('./controllers/login');
var  home = require ('./controllers/home');
var  signup = require ('./controllers/signup');
var add_doc = require('./controllers/add_doctor');
var  doc_controller = require ('./controllers/doc_controller');
var db = require ('./models/db_controller');
var reset = require('./controllers/reset_controller');
var set = require('./controllers/set_controller');
var employee = require ('./controllers/employee.js');
var logout = require ('./controllers/logout');
var verify = require ('./controllers/verify');
var store = require ('./controllers/store');
var landing = require ('./controllers/landing');
var complain = require ('./controllers/complain');
var inbox = require ('./controllers/inbox');
var appointment = require ('./controllers/appointment');

var receipt = require ('./controllers/receipt');

var messenger= require('./controllers/messenger')
var conversation= require('./controllers/conversation')
var meetingvideo= require('./controllers/meeting_video')
var meetingCall= require('./controllers/meeting_voice')
var zoonmeeting= require('./controllers/zoommeeting')



const { Socket } = require('socket.io');



// middleware
app.use(express.json());
// app.use(cors());
app.use(body_parser.json());
app.use('/',userRouter);
app.use('/api',meetingRouter);
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookie());
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    // cookie: { maxAge: 60000 }
}));
app.use(flash());
//app.use(expressValidator());

// var server =app.listen(3000 , function(){

//     console.log('server started');
// });

app.use('/login' ,login);
app.use('/home' , home);
app.use('/signup' , signup);
app.use('/doctors', doc_controller);
app.use('/resetpassword' ,reset);
app.use('/setpassword',set);
app.use('/employee',employee);
app.use ('/logout',logout);
app.use ('/verify', verify);
app.use ('/store',store);
app.use ('/',landing);
app.use ('/complain',complain);
app.use ('/inbox',inbox);
app.use ('/appointment',appointment);
app.use('/receipt',receipt);

app.use('/messenger',messenger);
app.use('/conversation',conversation);


app.use('/meetingvideo',meetingvideo);
app.use('/meetingvoice',meetingCall);

app.use('/zoommeeting',zoonmeeting);


// app.use('/doctors/add_doctor',add_doc);



//doctor router
const doctorsRouter = require('./routers/doctor_router'); 
app.use('/api/doctors', doctorsRouter);


//appointment router
const appointmentRouter= require('./routers/appointment_router');
app.use('/api/appointments',appointmentRouter);


//department router

const departmentRouter= require('./routers/department_router');
app.use('/api/departments',departmentRouter);

const notificationRouter = require('./routers/notification_router');

app.use('/notification',notificationRouter);


//đánh giá
const reviewRouter= require('./routers/review_router');
app.use('/api/',reviewRouter);


//zoom meeting
//ClientId: Bg2wcc_KQvaby26BDF1hrA
// //Client Secret: L0DHsBRAM6kmWeiiodZpz00UVtgU8XC7


app.get('/api/zoom/authorize', async function(req, res){
    return res.redirect(encodeURI(authorize()));
})

// app.get('/api/zoom/zoomauth', async function (req, res){
//     return res.redirect(encodeURI(authorize()));
// });

app.get('/api/zoom/redirect', async function (req, res){
    const {data}= await redirect(req.query.code);
    // sessionStorage.setItem('zoomtoken',result.access_token);
    // req.session.zoomtoken = data.access_token;
    process.env.access_token= data.access_token;
    console.log("Token hiện tại:  "+process.env.access_token);
 
    return res.json(data);

   
} );
app.get('/api/zoom/meetings', async (req,res)=>{
    let meetingList = await meetings(req.query);

    return res.json(meetingList);

});
app.post('/api/zoom/meeting',async (req,res)=>{
    let rerult= await meeting(req.body);
    return res.json(rerult);
});
app.patch('/api/zoom/meetings/:id', async (req,res)=>{
    let meeingUpdate= await updateMeeting(req.params.id,req.body);
    return res.json(meeingUpdate);

});


module.exports=app;