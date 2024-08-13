const Patient = require('../models/patient.model')
const {StatusCodes} = require('http-status-codes')

const {patientValidate} = require('../utils/validation')
const ApiError = require('../utils/ApiError')

exports.getAllPatients = async (req, res, next) => {
    try {
        const patients = await Patient.findAll()

        res.status(StatusCodes.OK).json({
            status: 'success',
            length: patients.length,
            data: {
                patients
            }
        })
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error.errors[0].message))
        
    }
}

exports.getPatientById = async (req, res, next) => {
    const patientId = req.params.patientId

    try {
        const patient = await Patient.findByPk(patientId)

        if (!patient) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any patient with patientId, please try again!`))
        } else {
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: {
                    patient
                }
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error.errors[0].message))
        
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
            next (new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
        } else {
            const newPatient = await Patient.create(inputData)
    
            res.status(StatusCodes.CREATED).json({
                status: 'success',
                newPatient: {
                    newPatient
                }
            })
        }

    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.updatePatient = async (req, res, next) => {
    const patientId = req.params.patientId

    const updateFirstName = req.body.first_name
    const updateLastName = req.body.last_name
    const updateDateOfBirth = req.body.date_of_birth
    const updatePhoneNumber = req.body.phone_number
    const updateAddress = req.body.address
    const updateGender = req.body.gender
    const updateInsuranceInfo = req.body.insurance_info

    try {
        const patient = await Patient.findByPk(patientId)

        if (!patient) {
            next (new ApiError(res, 404, `Can't find patient with id: ${patientId}`))
        } else {
            patient.first_name = updateFirstName ? updateFirstName : patient.first_name
            patient.last_name = updateLastName ? updateLastName : patient.last_name
            patient.date_of_birth = updateDateOfBirth ? updateDateOfBirth : patient.date_of_birth
            patient.phone_number = updatePhoneNumber ? updatePhoneNumber : patient.phone_number
            patient.address = updateAddress ? updateAddress : patient.address
            patient.gender = updateGender ? updateGender : patient.gender
            patient.insurance_info = updateInsuranceInfo ? updateInsuranceInfo : patient.insurance_info

            await patient.save()

            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'success to update patient id: ' + patientId,
                patientUpdate : {
                    patient
                }
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.deletePatient = async (req, res, next) => {
    const patientId = req.params.patientId

    try {
        const patientDelete = await Patient.destroy({
            where: {
                patient_id: patientId
            }
        })

        if (!patientDelete) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any patient with id: ${patientId}`))
        } else {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: 'DELETE SUCCESS'
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
        
    }
}