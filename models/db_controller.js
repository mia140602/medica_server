// var mysql = require("mysql");
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
const moment = require('moment-timezone');

var DoctorModel = require("../model/doctor_model");
var AppointmentModel=require("../model/appointment_model")
var DepartmentModel= require("../model/department_model")
var ComplainModel= require("../model/complain_model")
var UserModel= require('../model/user_model');
var ConversationModel= require('../model/conversation_model');
var MessageModel=require('../model/messager_model')
var ConversationModel= require('../model/conversation_model')

var express = require("express");

var router = express.Router();

const con = mongoose.createConnection(`mongodb://127.0.0.1:27017/newMedical`).on('open',()=>{
    console.log("MongoDb Connected");
}).on('error',()=>{
    console.log("MongoDb connection error");
});
module.exports= con;

// module.exports.signup = function (username, email, password, status, callback) {
//   var query =
//     "INSERT INTO `users`(`username`,`email`,`password`,`email_status`) VALUES ('" +
//     username +
//     "','" +
//     email +
//     "','" +
//     password +
//     "','" +
//     status +
//     "')";
//   con.query(query, callback);
// };

module.exports.getuserid = function (email, callback) {
  var query = "select *from verify where email = '" + email + "' ";
  con.query(query, callback);
};

module.exports.verify = function (username, email, token, callback) {
  var query =
    "insert into `verify` (`username`,`email`,`token`) values ('" +
    username +
    "','" +
    email +
    "','" +
    token +
    "')";
  con.query(query, callback);
};
// module.exports.add_doctor = async function (
//   first_name,
//   last_name,
//   email,
//   dob,
//   gender,
//   address,
//   phone,
//   image,
//   department,
//   biography
// ) {
//   try {
//     const doctor = await DoctorModel.create({
//       first_name: first_name,
//       last_name: last_name,
//       email: email,
//       dob: dob,
//       gender: gender,
//       address: address,
//       phone: phone,
//       image: image,
//       department: department,
//       biography: biography
//     });
//     return doctor;
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };
// module.exports.add_doctor = function (
//   first_name,
//   last_name,
//   email,
//   dob,
//   gender,
//   address,
//   phone,
//   image,
//   department,
//   biography,
//   callback
// ) {
//   DoctorModel.create({
//     first_name: first_name,
//     last_name: last_name,
//     email: email,
//     dob: dob,
//     gender: gender,
//     address: address,
//     phone: phone,
//     image: image,
//     department: department,
//     biography: biography
//   }, callback);
// };
// module.exports.add_doctor = function (
//   first_name,
//   last_name,
//   email,
//   dob,
//   gender,
//   address,
//   phone,
//   image,
//   department,
//   biography,
//   callback
// ) {
//   var query =
//     "INSERT INTO `doctor`(`first_name`,`last_name`,`email`,`dob`,`gender`,`address`,`phone`,`image`,`department`,`biography`) values ('" +
//     first_name +
//     "','" +
//     last_name +
//     "','" +
//     email +
//     "','" +
//     dob +
//     "','" +
//     gender +
//     "','" +
//     address +
//     "','" +
//     phone +
//     "','" +
//     image +
//     "','" +
//     department +
//     "','" +
//     biography +
//     "')";
//   con.query(query, callback);
//   console.log(query);
// };

module.exports.getAllDoc = async function () {
  try {
    const doctors = await DoctorModel.find({});
    return doctors;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


module.exports.getEmpbyId = function (id, callback) {
  var query = "select * from employee where id =" + id;
  con.query(query, callback);
};
module.exports.getDocbyId = async function (id) {
  try {
    const doctor = await DoctorModel.findById(id);
    return doctor;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
module.exports.editDoc = async function (
  id,
  first_name,
  last_name,
  email,
  dob,
  gender,
  address,
  phone,
  image,
  department,
  biography
) {
  try {
    const doctor = await DoctorModel.findByIdAndUpdate(id, {
      first_name: first_name,
      last_name: last_name,
      email: email,
      dob: dob,
      gender: gender,
      address: address,
      phone: phone,
      image: image,
      department: department,
      biography: biography
    }, { new: true });
    return doctor;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// module.exports.editDoc = function (
//   id,
//   first_name,
//   last_name,
//   email,
//   dob,
//   gender,
//   address,
//   phone,
//   image,
//   department,
//   biography,
//   callback
// ) {
//   var query =
//     "update `doctor` set `first_name`='" +
//     first_name +
//     "', `last_name`='" +
//     last_name +
//     "', `email`='" +
//     email +
//     "', `dob`='" +
//     dob +
//     "',`gender`='" +
//     gender +
//     "',`address`='" +
//     address +
//     "',`phone`='" +
//     phone +
//     "',`image`='" +
//     image +
//     "',`department`='" +
//     department +
//     "',`biography`='" +
//     biography +
//     "' where id=" +
//     id;
//   con.query(query, callback);
//   // console.log(query);
// };

module.exports.editEmp = function (
  id,
  name,
  email,
  contact,
  join_date,
  role,
  callback
) {
  var query =
    "update `employee` set `name`='" +
    name +
    "', `email`='" +
    email +
    "', `contact`='" +
    contact +
    "', `join_date`='" +
    join_date +
    "', `role`='" +
    role +
    "' where id=" +
    id;
  con.query(query, callback);
};

module.exports.deleteDoc = function (id, callback) {
  //console.log("i m here");
  var query = "delete from doctor where id=" + id;
  con.query(query, callback);
};

module.exports.deleteEmp = function (id, callback) {
  //console.log("i m here");
  var query = "delete from employee where id=" + id;
  con.query(query, callback);
};

module.exports.deletemed = function (id, callback) {
  //console.log("i m here");
  var query = "delete from store where id=" + id;
  con.query(query, callback);
};

// appointment

 module.exports.getdoctorappointment= async function (doctorUsername) {
  try {
    const doctor = await DoctorModel.findOne({ userName: doctorUsername });
    if (!doctor) {
      console.error(`No doctor found with username: ${doctorUsername}`);
      return [];
    }
    const appointments = await AppointmentModel.find({ doctor: doctor._id })
    .sort({ createdAt: -1 })
    .populate('patientId')
    .populate({
      path: 'doctor',
      populate: { path: 'department' }
    })
    ;
    return appointments;
  } catch (err) {
    console.error(err);
    return [];
  }
};
module.exports.getallappointment = async function () {
  try {
    const appointment = await AppointmentModel.find({});
    return appointment;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.acceptAppointment = async function (appointmentId){
  // Lấy thông tin lịch hẹn
  const appointment = await AppointmentModel.findById(appointmentId);

  // Kiểm tra xem lịch hẹn đã được xác nhận hay từ chối chưa
  if (appointment.status !== 'Chưa xác nhận') {
    throw new Error('Lịch hẹn đã được xử lý');
}

  // Cập nhật trạng thái lịch hẹn
  appointment.status = 'Xác nhận';
  await appointment.save();

  // Nếu lịch hẹn là loại "chat", tạo một cuộc trò chuyện mới
  if (appointment.type === 'chat') {
    const startTime = moment(appointment.date + ' ' + appointment.time, 'YYYY-MM-DD h:mm A', 'Asia/Ho_Chi_Minh').toDate();
    const endTime = moment(startTime).add(30, 'minutes').toDate();

    const conversation = new ConversationModel({
      user: appointment.patientId,
      doctor: appointment.doctor,
      appointment: appointmentId,
      startTime: startTime,
      endTime: endTime,
    });
    await conversation.save();
  }

  return appointment;
};


module.exports.rejectAppointment = async function (appointmentId){
  // Lấy thông tin lịch hẹn
  const appointment = await AppointmentModel.findById(appointmentId)
  .populate('doctor')
  ;

  // Kiểm tra xem lịch hẹn đã được xử lý chưa
  if (appointment.status !== 'Chưa xác nhận') {
      throw new Error('Lịch hẹn đã được xử lý');
  }

  // Cập nhật trạng thái lịch hẹn
  appointment.status = 'Từ chối';
  await appointment.save();

  return appointment;
};

module.exports.add_appointment = async function (
  p_name,
  department,
  d_name,
  date,
  time,
  email,
  phone
) {
  try {
    const appointment = await AppointmentModel.create({
      patient_name: p_name,
      department: department,
      doctor_name: d_name,
      date: date,
      time: time,
      email: email,
      phone: phone
    });
    return appointment;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.searchDoc = function (key, callback) {
  var query = 'SELECT  *from doctor where first_name like "%' + key + '%"';
  con.query(query, callback);
  console.log(query);
};

module.exports.searchmed = function (key, callback) {
  var query = 'SELECT  *from store where name like "%' + key + '%"';
  con.query(query, callback);
};

module.exports.searchEmp = function (key, callback) {
  var query = 'SELECT  *from employee where name  like "%' + key + '%"';
  con.query(query, callback);
  console.log(query);
};

module.exports.getappointmentbyid = async function (id) {
  try {
    const appointment = await AppointmentModel.findById(id);
    return appointment;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.editappointment = async function (
  id,
  p_name,
  department,
  d_name,
  date,
  time,
  email,
  phone
) {
  try {
    const appointment = await AppointmentModel.findByIdAndUpdate(id, {
      patient_name: p_name,
      department: department,
      doctor_name: d_name,
      date: date,
      time: time,
      email: email,
      phone: phone
    }, { new: true });
    return appointment;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports.deleteappointment = async function (id) {
  try {
    const result = await AppointmentModel.findByIdAndRemove(id);
    return result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
//module.exports =router;


//conversations
module.exports.getdoctorconversations= async function (doctorUsername) {
  try {
    const doctor = await DoctorModel.findOne({ userName: doctorUsername });
    if (!doctor) {
      console.error(`No doctor found with username: ${doctorUsername}`);
      return [];
    }
    const conversations = await ConversationModel.find({ doctor: doctor._id })
    .populate('user')
    .populate({
      path: 'appointment',
      match: { status: 'Xác nhận' } 
    })
    // .populate({
    //   path: 'doctor',
    //   populate: { path: 'department' }
    // })
    ;
    return conversations;
  } catch (err) {
    console.error(err);
    return [];
  }
};





module.exports.findOne = function (email, callback) {
  var query = "select *from users where email='" + email + "'";
  con.query(query, callback);
  console.log(query);
};

module.exports.temp = function (id, email, token, callback) {
  var query =
    "insert into `temp` (`id`,`email`,`token`) values ('" +
    id +
    "','" +
    email +
    "','" +
    token +
    "')";
  con.query(query, callback);
};

module.exports.checktoken = function (token, callback) {
  var query = "select *from temp where token='" + token + "'";
  con.query(query, callback);
  console.log(query);
};

module.exports.setpassword = function (id, newpassword, callback) {
  var query =
    "update `users` set `password`='" + newpassword + "' where id=" + id;
  con.query(query, callback);
};

module.exports.add_employee = function (
  name,
  email,
  contact,
  join_date,
  role,
  salary,
  callback
) {
  var query =
    "Insert into `employee` (`name`,`email`,`contact`,`join_date`,`role`,`salary`) values ('" +
    name +
    "','" +
    email +
    "','" +
    contact +
    "','" +
    join_date +
    "','" +
    role +
    "','" +
    salary +
    "')";
  con.query(query, callback);
  console.log(query);
};

module.exports.addMed = function (
  name,
  p_date,
  expire,
  e_date,
  price,
  quantity,
  callback
) {
  var query =
    "Insert into `store` (name,p_date,expire,expire_end,price,quantity) values('" +
    name +
    "','" +
    p_date +
    "','" +
    expire +
    "','" +
    e_date +
    "','" +
    price +
    "','" +
    quantity +
    "')";
  console.log(query);
  con.query(query, callback);
};


module.exports.editmed = function (
  id,
  name,
  p_date,
  expire,
  e_date,
  price,
  quantity,
  callback
) {
  var query =
    "update store set name='" +
    name +
    "', p_date='" +
    p_date +
    "',expire='" +
    expire +
    "' ,expire_end='" +
    e_date +
    "',price='" +
    price +
    "',quantity='" +
    quantity +
    "' where id=" +
    id;
  console.log(query);
  con.query(query, callback);
};


module.exports.getAllemployee = function (callback) {
  var query = "select * from employee";
  con.query(query, callback);
};

module.exports.add_leave = function (
  name,
  id,
  type,
  from,
  to,
  reason,
  callback
) {
  var query =
    "Insert into `leaves` (`employee`,`emp_id`,`leave_type`,`date_from`,`date_to`,`reason`) values ('" +
    name +
    "','" +
    id +
    "','" +
    type +
    "','" +
    from +
    "','" +
    to +
    "','" +
    reason +
    "')";
  console.log(query);
  con.query(query, callback);
};

module.exports.getAllLeave = function (callback) {
  var query = "Select * from leaves";
  con.query(query, callback);
};

module.exports.matchtoken = function (id, token, callback) {
  var query = "select * from `verify` where token='" + token + "' and id=" + id;
  con.query(query, callback);
  console.log(query);
};

module.exports.updateverify = function (email, email_status, callback) {
  var query =
    "update `users` set `email_status`='" +
    email_status +
    "' where `email`='" +
    email +
    "'";
  con.query(query, callback);
};

module.exports.add_dept = async function (name, desc, img) {
  try {
    const newDepartment =  DepartmentModel.create ({
      department_name: name,
      department_desc: desc,
      img_path: img
    });
    
  } catch (err) {
    console.error(err);
  }
};

module.exports.getalldept =async function () {
  try {
    var depts= await DepartmentModel.find({});
    return depts;
  } catch (error) {
    throw error;
  }
};

module.exports.delete_department = function (id, callback) {
  var query = "delete from departments where id=" + id;
  con.query(query, callback);
};

module.exports.getdeptbyId = function (id, callback) {
  var query = "select * from departments where id=" + id;
  con.query(query, callback);
};

module.exports.edit_dept = function (id, name, desc, callback) {
  var query =
    "update departments set department_name='" +
    name +
    "',department_desc='" +
    desc +
    "' where id=" +
    id;
  con.query(query, callback);
};

module.exports.getdoctordetails =async function (username) {
  try {
    var doctor = await DoctorModel.findOne({userName:username}); // Sử dụng Mongoose để tìm bác sĩ theo id
    return doctor;
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports.edit_profile = function (
  id,
  username,
  email,
  password,
  callback
) {
  var query =
    "update users set username ='" +
    username +
    "', email = '" +
    email +
    "',password='" +
    password +
    "' where id=" +
    id;
  con.query(query, callback);
  console.log(query);
};

module.exports.getleavebyid = function (id, callback) {
  var query = "select * from leaves where id=" + id;
  con.query(query, callback);
};

module.exports.deleteleave = function (id, callback) {
  var query = "delete  from leaves where id=" + id;
  con.query(query, callback);
};

module.exports.edit_leave = function (
  id,
  name,
  leave_type,
  from,
  to,
  reason,
  callback
) {
  var query =
    "update leaves set employee='" +
    name +
    "',leave_type='" +
    leave_type +
    "',date_from='" +
    from +
    "',date_to='" +
    to +
    "',reason='" +
    reason +
    "' where id=" +
    id;
  con.query(query, callback);
};


//inbox

module.exports.getAllInbox = async function (doctorId) {
  try {
    const conversations = await ConversationModel.find({
      doctorId: doctorId
    }).populate('userId'); // Sử dụng populate để lấy thông tin user tương ứng với conversation

    return conversations;
  } catch (err) {
    console.error("Error in getAllInbox:", err);
    throw err; 
  }
};


module.exports.searchUser = async function (user) {
  const searchQuery = user.replace("+88", "");

  try {
    if (searchQuery !== "") {
      const users = await UserModel.find({
        $or: [
          { name: { $regex: searchQuery, $options: 'i' } },
          { mobile: { $regex: "^" + "+88" + searchQuery } },
          { email: { $regex: "^" + searchQuery + "$", $options: 'i' } },
        ],
      }, "name avatar");

      return users;
    } else {
      throw new Error("You must provide some text to search!");
    }
  } catch (err) {
    throw err;
  }
};

module.exports.addConversation = async function (req) {
  try {
    const newConversation = new ConversationModel({
      creator: {
        id: req.user.userid,
        name: req.user.username,
        avatar: req.user.avatar || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
      },
    });

    await newConversation.save();
    return newConversation;
  } catch (err) {
    throw err;
  }
};

module.exports.getMessages = async function (req) {
  try {
    const messages = await ConversationModel.find({
      conversation_id: req.params.conversation_id,
    }).sort("-createdAt");

    const { participant } = await ConversationModel.findById(
      req.params.conversation_id
    );

    return {
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    };
  } catch (err) {
    throw err;
  }
};
// 
module.exports.getMessagesForConversation = async function(conversationId) {
  try {
      const messages = await MessageModel.find({ chat: conversationId })
      
      .populate({
        path: 'chat',
        model: 'conversations',
        populate: [
          { path: 'user', model: 'users' },
          // { path: 'doctor', model: 'doctors' }
        ]
      });
      
      ;
      return messages;
  } catch (err) {
      console.error("Error in getMessagesForConversation:", err);
      throw err; 
  }
};


module.exports.sendMessage = async function (req) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new MessageModel({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.users.id,
          name: req.users.fullName,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

      return result;
    } catch (err) {
      throw err;
    }
  } else {
    throw new Error("message text or attachment is required!");
  }
};