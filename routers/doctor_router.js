const express = require('express');
const router = express.Router();
const DoctorModel = require('../model/doctor_model');

// GET /api/doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await DoctorModel.find({}).populate('department');
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;