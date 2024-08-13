const express = require('express')

const router = express.Router()
const patientController = require('../controllers/patient.controller')
const authController = require('../controllers/auth.controller')

router
    .route('/')
    .get(authController.protectRoute, patientController.getAllPatients)

router 
    .route('/')
    .post(patientController.createPatient)

router
    .route('/:patientId')
    .get(patientController.getPatientById)


router
    .route('/:patientId')
    .patch(patientController.updatePatient)

router
    .route('/:patientId')
    .delete(patientController.deletePatient)

module.exports = router