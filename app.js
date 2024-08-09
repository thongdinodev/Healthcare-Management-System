require('dotenv').config()

const express = require('express')

//MODELS
const Patient = require('./models/patient.model')
const Doctor = require('./models/doctor.model')
const Appointment = require('./models/appointment.model')
const Billing = require('./models/billing.model')

//ROUTES
const patientRoute = require('./routes/patient.route')
const doctorRoute = require('./routes/doctor.route')
const billingRoute = require('./routes/billing.route')
const appointmentRoute = require('./routes/appointment.route')

const sequelize = require('./db/database')
const app = express()

app.use('/patient/', patientRoute)
app.use('/doctor/', doctorRoute)
app.use('/billing/', billingRoute)
app.use('/appointment/', appointmentRoute)

sequelize
    .sync({ alter: true })
    
    .then(() => {
        
        console.log('Table and model synced successfully');
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app