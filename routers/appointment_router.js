const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment-timezone'); 

const AppointmentModel = require('../model/appointment_model')

// GET /api/appointment
const DoctorModel = require('../model/doctor_model'); 

router.get('/doctorAppointment', async (req, res) => {
    try {
      const { doctorId, date } = req.query;
  
      if (!doctorId || !date) {
        return res.status(400).json("Không tồn tại doctorId hoặc date");
      }
  
      const getAppointmentsByDoctorIdAndDate = async (doctorId, date) => {
        try {
          const appointments = await AppointmentModel.find({
            doctor:new mongoose.Types.ObjectId(doctorId),
            date: date,
          }).populate('doctor', 'userName');
          return appointments;
        } catch (error) {
          throw error;
        }
      };
  
      const appointments = await getAppointmentsByDoctorIdAndDate(doctorId, date);
  
      console.log("Appointments found by doctorId and date:", appointments);
      const times = appointments.map(appointment => appointment.time);
  
      res.json(times);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  });

  router.post('/creatAppointment', async (req, res) => {
    console.log("creatAppointment");
    const { doctor, patientId, date, time , type, problem} = req.body;
    const newAppointment = await AppointmentModel.create({
        doctor: doctor,
        patientId:patientId,
        date: date,
        time: time,
        type: type,
        problem: problem
    }
    )
    try {
      await newAppointment.save();
      res.status(201).json(newAppointment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
// GET /api/appointments
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json("Không tồn tại userId");
    }

    const appointments = await AppointmentModel.find({
      patientId: new mongoose.Types.ObjectId(userId),
    }).populate({
      path: 'doctor',
      select: 'userName avatar department',
      populate: {
        path: 'department',
        select: 'department_name'
      }
    });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;