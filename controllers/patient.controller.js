const Patient = require('../models/patient.model')

const {patientValidate} = require('../utils/validation')
const handleTryCatchError = require('../utils/handleTryCatchError')

exports.getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.findAll()

        res.status(200).json({
            status: 'success',
            length: patients.length,
            data: {
                patients
            }
        })
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
        
    }
}

exports.getPatientById = async (req, res, next) => {
    const patientId = req.params.patientId

    try {
        const patient = await Patient.findByPk(patientId)

        if (!patient) {
            handleTryCatchError(res, 400, `Can't find any patient with patientId, please try again!`)
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    patient
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
        
    }
}

exports.createPatient = async (req, res, next) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const date_of_birth = req.body.date_of_birth
    const phone_number = req.body.phone_number
    const address = req.body.address
    const gender = req.body.gender
    const insurance_info = req.body.insurance_info

    
    const inputData = {
        first_name,
        last_name,
        date_of_birth,
        phone_number,
        address,
        gender,
        insurance_info
    }

    try {
        const {error, value} = patientValidate(inputData)
        console.log('====ERROR====', error);
        if (error) {
            handleTryCatchError(res, 400, error.details[0].message)
        } else {
            const newPatient = await Patient.create(inputData)
    
            res.status(200).json({
                status: 'success',
                newPatient: {
                    newPatient
                }
            })
        }

    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.updatePatient = (req, res, next) => {

}

exports.deletePatient = (req, res, next) => {
    
}