const Appointment = require('../models/appointment.model')
const {StatusCodes} = require('http-status-codes')

const {appointmentValidate} = require('../utils/validation')
const ApiError = require('../utils/ApiError')

exports.getAllAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.findAll()

        res.status(StatusCodes.OK).json({
            status: 'success',
            total: appointments.length,
            data: {
                appointments
            }
        })
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error.errors[0].message))
        
    }
}

exports.getAppointment = async (req, res, next) => {
    const appointmentId = req.params.appointmentId

    try {
        const appointment = await Appointment.findByPk(appointmentId)

        if (!appointment) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any appointment with appointmentId, please try again!`))
        } else {
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: {
                    appointment
                }
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error.errors[0].message))
        
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
            next (new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
        } else {
            const newAppointment = await Appointment.create(inputData)
    
            res.status(StatusCodes.CREATED).json({
                status: 'success',
                newAppointment: {
                    newAppointment
                }
            })
        }

    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.updateAppointment = async (req, res, next) => {
    const appointmentId = req.params.appointmentId

    const updateAppointmentDate = req.body.appointment_date
    const updateStatus = req.body.status

    try {
        const appointment = await appointment.findByPk(appointmentId)

        if (!appointment) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find appointment with id: ${appointmentId}`))
        } else {
            appointment.appointment_date = updateAppointmentDate ? updateAppointmentDate : appointment.appointment_date
            appointment.status = updateStatus ? updateStatus : appointment.status

            await appointment.save()

            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'success to update appointment id: ' + appointmentId,
                appointmentUpdate : {
                    appointment
                }
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.deleteAppointment = async (req, res, next) => {
    const appointmentId = req.params.appointmentId

    try {
        const appointmentDelete = await Appointment.destroy({
            where: {
                appointment_id: appointmentId
            }
        })

        if (!appointmentDelete) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any appointment with id: ${appointmentId}`))
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