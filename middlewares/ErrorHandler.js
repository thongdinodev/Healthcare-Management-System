const {StatusCodes} = require('http-status-codes')

const ErrorHandler = (err, req, res, next) => {
    console.log("Middleware Error Handling");
    console.log(err);
    
    
    if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

    const responseError = {
        statusCode: err.statusCode,
        message: err.message || StatusCodes[err.statusCode], 
        stack: err.stack
    }
    
    res.status(responseError.statusCode).json(responseError)
}

module.exports = ErrorHandler