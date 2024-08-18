class ApiError extends Error {
    constructor(statusCode, message) {
        super(message)
        
        //this.name = 'ApiError'
        this.statusCode = statusCode
        this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true
            
        Error.captureStackTrace(this, this.constructor)        
    }
}

module.exports = ApiError