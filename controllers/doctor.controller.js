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

exports.updateDoctor = (req, res, next) => {

}

exports.deleteDoctor = (req, res, next) => {
    
}