const express = require('express')

const router = express.Router()
const patientController = require('../controllers/patient.controller')

router
    .route('/')
    .get(patientController.getAllPatients)

router 
    .route('/')
    .post(patientController.createPatient)

router
    .route('/:patientId')
    .get(patientController.getPatient)


router
    .route('/:patientId')
    .patch(patientController.updatePatient)

router
    .route('/:patientId')
    .delete(patientController.deletePatient)

module.exports = router