const {StatusCodes} = require('http-status-codes')
const ApiError = require('../utils/ApiError')


const sendResponseErrorDev = (err, res) => {
    console.log(err);
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || StatusCodes[err.statusCode], 
        error: err,
        stack: err.stack
    })
}

const sendResponseErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message || StatusCodes[err.statusCode], 
        })
    } else {
        // log error in server
        console.log('=========ERROR=========', err);

        // send response
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!!!'
        })
        
    }
}

module.exports = (err, req, res, next) => {
    console.log("================Middleware Error Handling================");    
    console.log(err);  
    
    if (process.env.NODE_ENV === 'development') {
        sendResponseErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {


        sendResponseErrorProd(err, res)
    }
}

