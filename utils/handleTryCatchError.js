const handleTryCatchError = (res, statusCode, msg) => {
    res.status(statusCode).json({
        status: 'fail',
        message: msg
    })
}

module.exports = handleTryCatchError