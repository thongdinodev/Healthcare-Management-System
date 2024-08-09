const express = require('express')

const router = express.Router()
const appointmentController = require('../controllers/appointment.controller')

router
    .route('/')
    .get(appointmentController.getAllAppointments)

router 
    .route('/')
    .post(appointmentController.createAppointment)

router
    .route('/:appointmentId')
    .get(appointmentController.getAppointment)


router
    .route('/:appointmentId')
    .patch(appointmentController.updateAppointment)

router
    .route('/:appointmentId')
    .delete(appointmentController.deleteAppointment)

module.exports = router