const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment-timezone'); 

const DepartmentModel = require('../model/department_model')
var DoctorModel=require('../model/doctor_model')



router.get('/getAllDepartment', async (req, res) => {
    try {
        const getAllDepartments = async () => {
            try {
                const departments = await DepartmentModel.find({});
                return departments;
            } catch (error) {
                throw error;
            }
        };

        const departments = await getAllDepartments();
        res.json(departments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
router.get('/getDoctorsByDepartment/:departmentId', async (req, res) => {
    try {
        const departmentId = req.params.departmentId;
        const doctors = await DoctorModel.find({ department: departmentId });
        res.json(doctors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;