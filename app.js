const express = require('express')
const session = require('express-session')
const passport = require('passport')
const morgan = require('morgan')

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
const OAuth20Route = require('./routes/OAuth20.route')

// Middleware and ApiError to handler error
const ErrorHandler = require('./middlewares/ErrorHandler')
const ApiError = require('./utils/ApiError')

const sequelize = require('./db/database')
const app = express()


if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.set('view engine', 'ejs')

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
)
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())

// ASSOCIATE
// Patient – Appointment Relationship:
// One-to-many relationship: Each patient can have multiple appointments.
// Foreign key: patient_id in Appointment table referencing patient_id in Patient table.
Patient.hasMany(Appointment, {
    foreignKey: 'patient_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Appointment.belongsTo(Patient, {
    foreignKey: 'patient_id'
})
//Appointment.belongsTo(Patient)
// Patient – Billing Relationship:
// One-to-many relationship: Each patient can have multiple billing records.
// Foreign key: patient_id in Billing table referencing patient_id in Patient table.
Patient.hasMany(Billing, {
    foreignKey: 'patient_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Billing.belongsTo(Patient, {
    foreignKey: 'patient_id'
})
// Doctor – Appointment Relationship:
// One-to-many relationship: Each doctor can have multiple appointments.
// Foreign key: doctor_id in Appointment table referencing doctor_id in Doctor table.
Doctor.hasMany(Appointment, {
    foreignKey: 'doctor_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Appointment.belongsTo(Doctor, {
    foreignKey: 'doctor_id'
})

// Routes middleware
app.use('/api/patients/', patientRoute)
app.use('/api/doctors/', doctorRoute)
app.use('/api/billings/', billingRoute)
app.use('/api/appointments/', appointmentRoute)
app.use('/api/auth/', authRoute)
app.use('/', OAuth20Route)

passport.serializeUser(function(user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

// Handle unknow request, 404 not found error
app.all('*', (req, res, next) => {
    next(new ApiError(StatusCodes.NOT_FOUND, `Not Found 404, Can't find ${req.originalUrl} on this server!`))
})

// ErrorHandler middleware
app.use(ErrorHandler)

sequelize
    // .sync({ 
    //     alter: true,
    //     force: true
    // })
    .sync()
    
    .then(() => {
        
        console.log(`Server is running in ========== ${process.env.NODE_ENV} ENVIRONMENT ==========`);
        console.log('Table and model synced successfully');
    })
    .catch((err) => {
        console.log(err);
    })


module.exports = app