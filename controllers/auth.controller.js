const User = require('../models/user.model')
const handleTryCatchError = require('../utils/handleTryCatchError')

const {signupValidate, loginValidate} = require('../utils/validation')

exports.signup = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const password_confirm = req.body.password_confirm
    const role = req.body.role

    const inputSignupData = {
        name,
        email,
        password,
        password_confirm,
        role
    }
    console.log(inputSignupData);
    

    try {
        const {error, value} = signupValidate(inputSignupData)
        console.log('====ERROR====', error);
        if (error) {
            handleTryCatchError(res, 400, error.details[0].message)
        } else {
            const newUser = await User.create(inputSignupData)
    
            res.status(201).json({
                status: 'success',
                newUser: {
                    newUser
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.loginBasic = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const password_confirm = req.body.password_confirm

    const inputLogin = {
        email,
        password,
        password_confirm
    }

    try {
        const {error, value} = loginValidate(inputLogin)
        console.log('====ERROR====', error);
        if (error) {
            handleTryCatchError(res, 400, error.details[0].message)
        } else {
    
            res.status(201).json({
                status: 'success',
                msg: 'Login success'
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}