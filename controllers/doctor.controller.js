const Doctor = require('../models/doctor.model')

const {doctorValidate} = require('../utils/validation')
const handleTryCatchError = require('../utils/handleTryCatchError')

exports.getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.findAll()

        res.status(200).json({
            status: 'success',
            length: doctors.length,
            data: {
                doctors
            }
        })
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
    }
}

exports.getDoctor = async (req, res, next) => {
    const doctorId = req.params.doctorId

    try {
        const doctor = await Doctor.findByPk(doctorId)

        if (!doctor) {
            handleTryCatchError(res, 400, `Can't find any doctor with doctorId, please try again!`)
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    doctor
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)    
    }
}

exports.createDoctor = async (req, res, next) => {
    const first_name = req.body.first_name
    const last_name = req.body.last_name
    const schedule = req.body.schedule
    const specialization = req.body.specialization

    const inputData = {
        first_name,
        last_name,
        schedule,
        specialization
    }

    try {
        const {error, value} = doctorValidate(inputData)
        console.log('====ERROR====', error);
        if (error) {
            handleTryCatchError(res, 400, error.details[0].message)
        } else {
            const newDoctor = await Doctor.create(inputData)
    
            res.status(200).json({
                status: 'success',
                newDoctor: {
                    newDoctor
                }
            })
        }
    } catch (error) {
        console.log();
        handleTryCatchError(res, 400, error)   
    }
}

exports.updateDoctor = async (req, res, next) => {
    const doctorId = req.params.doctorId

    const updateFirstName = req.body.first_name
    const updateLastName = req.body.last_name
    const updateSchedule = req.body.schedule
    const updateSpecialization = req.body.specialization

    try {
        const doctor = await Doctor.findByPk(doctorId)

        if (!doctor) {
            handleTryCatchError(res, 404, `Can't find doctor with id: ${doctorId}`)
        } else {
            doctor.first_name = updateFirstName ? updateFirstName : doctor.first_name
            doctor.last_name = updateLastName ? updateLastName : doctor.last_name
            doctor.schedule = updateSchedule ? updateSchedule : doctor.schedule
            doctor.specialization = updateSpecialization ? updateSpecialization : doctor.specialization

            await doctor.save()

            res.status(200).json({
                status: 'success',
                message: 'success to update doctor id: ' + doctorId,
                doctorUpdate : {
                    doctor
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.deleteDoctor = (req, res, next) => {
    
}