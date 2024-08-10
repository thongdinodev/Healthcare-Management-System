const Appointment = require('../models/appointment.model')

const {appointmentValidate} = require('../utils/validation')
const handleTryCatchError = require('../utils/handleTryCatchError')

exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.findAll()

        res.status(200).json({
            status: 'success',
            length: appointments.length,
            data: {
                appointments
            }
        })
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
        
    }
}

exports.getAppointment = async (req, res, next) => {
    const appointmentId = req.params.appointmentId

    try {
        const appointment = await Appointment.findByPk(appointmentId)

        if (!appointment) {
            handleTryCatchError(res, 400, `Can't find any appointment with appointmentId, please try again!`)
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    appointment
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
        
    }
}

exports.createAppointment = async (req, res, next) => {
    const appointment_date = req.body.appointment_date
    const status = req.body.status

    const inputData = {
        appointment_date,
        status
    }

    try {
        const {error, value} = appointmentValidate(inputData)
        console.log('====ERROR====', error);
        if (error) {
            handleTryCatchError(res, 400, error.details[0].message)
        } else {
            const newAppointment = await Appointment.create(inputData)
    
            res.status(200).json({
                status: 'success',
                newAppointment: {
                    newAppointment
                }
            })
        }

    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.updateAppointment = async (req, res, next) => {
    const appointmentId = req.params.appointmentId

    const updateAppointmentDate = req.body.appointment_date
    const updateStatus = req.body.status

    try {
        const appointment = await appointment.findByPk(appointmentId)

        if (!appointment) {
            handleTryCatchError(res, 404, `Can't find appointment with id: ${appointmentId}`)
        } else {
            appointment.appointment_date = updateAppointmentDate ? updateAppointmentDate : appointment.appointment_date
            appointment.status = updateStatus ? updateStatus : appointment.status

            await appointment.save()

            res.status(200).json({
                status: 'success',
                message: 'success to update appointment id: ' + appointmentId,
                appointmentUpdate : {
                    appointment
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.deleteAppointment = async (req, res, next) => {
    
}