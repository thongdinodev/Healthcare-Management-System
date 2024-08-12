const Joi = require('joi')

const registerValidate = data => {
    const registerSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        password_confirm: Joi.custom((value, helper) => {
            const {password, password_confirm} = helper.state.ancestors[0]
            if (password_confirm !== password) {
                return helper.message('password_confirm must match with password')
            }
            return value
        }),
        role: Joi.string()
    })

    return registerSchema.validate(data)
}

const patientValidate = data => {
    const patientSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        date_of_birth: Joi.date().required(),
        phone_number: Joi.string().required(),
        address: Joi.string(),
        gender: Joi.string(),
        insurance_info: Joi.string().required()
    })

    return patientSchema.validate(data)
}

const doctorValidate = data => {
    const doctorSchema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        schedule: Joi.string(),
        specialization: Joi.string().required().min(3)
    })

    return doctorSchema.validate(data)
}

const appointmentValidate = data => {
    const appointmentSchema = Joi.object({
        appointment_date: Joi.date().required(),
        status: Joi.string().required()
    })

    return appointmentSchema.validate(data)
}

const billingValidate = data => {
    const billingSchema = Joi.object({
        amount: Joi.number().required(),
        billing_date: Joi.date().required(),
        payment_status: Joi.string().required()
    })

    return billingSchema.validate(data)
}

module.exports = {
    patientValidate,
    doctorValidate,
    appointmentValidate,
    billingValidate,
    registerValidate
}