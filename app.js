require('dotenv').config()

const express = require('express')
const {StatusCodes} = require('http-status-codes')

//MODELS
const Patient = require('./models/patient.model')
const Doctor = require('./models/doctor.model')
const Appointment = require('./models/appointment.model')
const Billing = require('./models/billing.model')
const User = require('./models/user.model')

//ROUTES
const patientRoute = require('./routes/patient.route')
const doctorRoute = require('./routes/doctor.route')
const billingRoute = require('./routes/billing.route')
const appointmentRoute = require('./routes/appointment.route')
const authRoute = require('./routes/auth.route')

// Middleware and ApiError to handler error
const ErrorHandler = require('./middlewares/ErrorHandler')
const ApiError = require('./utils/ApiError')

const sequelize = require('./db/database')
const app = express()

app.use(express.json())

// Routes middleware
app.use('/api/patients/', patientRoute)
app.use('/api/doctors/', doctorRoute)
app.use('/api/billings/', billingRoute)
app.use('/api/appointments/', appointmentRoute)
app.use('/api/auth/', authRoute)

// Handle unknow request, 404 not found error
app.all('*', (req, res, next) => {
    next(new ApiError(StatusCodes.NOT_FOUND, `Not Found 404, Can't find ${req.originalUrl} on this server!`))
})

// ErrorHandler middleware
app.use(ErrorHandler)

User
    .sync({ alter: true })
    //.sync()
    
    .then(() => {
        
        console.log('Table and model synced successfully');
    })
    .catch((err) => {
        console.log(err);
    })

module.exports = app