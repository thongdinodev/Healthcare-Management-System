const express = require('express')

const router = express.Router()
const doctorController = require('../controllers/doctor.controller')

router
    .route('/')
    .get(doctorController.getAllDoctors)

router 
    .route('/')
    .post(doctorController.createDoctor)

router
    .route('/:doctorId')
    .get(doctorController.getDoctor)


router
    .route('/:doctorId')
    .patch(doctorController.updateDoctor)

router
    .route('/:doctorId')
    .delete(doctorController.deleteDoctor)

module.exports = router