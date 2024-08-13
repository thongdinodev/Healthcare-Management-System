const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const signToken = (id) => {
    return jwt.sign({userId: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN * 60 * 60 * 24 * 1000
    })
}

const {registerValidate} = require('../utils/validation')
const ApiError = require('../utils/ApiError')

exports.register = async (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const password_confirm = req.body.password_confirm
    const role = req.body.role

    const inputRegisterData = {
        name,
        email,
        password,
        password_confirm,
        role
    }    

    try {
        const {error, value} = registerValidate(inputRegisterData)
        console.log('====ERROR====', error);
        if (error) {
            next (new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
        } else {
            const newUser = await User.create(inputRegisterData)
            console.log(newUser.user_id);
            

            const token = signToken(newUser.user_id)
    
            res.status(StatusCodes.CREATED).json({
                status: 'success',
                data: {
                    token,
                    newUser
                }
            })
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
}

exports.loginWithEmailAndPassword = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
        next (new ApiError(StatusCodes.BAD_REQUEST, 'Incorrect email or password, please try again!'))
    } 

    try {
        await User.findOne({where: {email: email}}).then(async function (user) {
            
            if (!user) {
                next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any user with email!`))
            } else if (user.validPassword(password)) {

                const token = signToken(user.user_id)

                res.status(StatusCodes.OK).json({
                    status: 'success',
                    msg: 'Login success',
                    token
                })

            } else {
                next (new ApiError(StatusCodes.UNAUTHORIZED, `Wrong password`))
            }
        })
    } catch (error) {
        console.log(error);
        next(error)

    }
}

exports.logoutAccount = (req, res, next) => {
    
}

exports.protectRoute = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
        next (new ApiError(StatusCodes.UNAUTHORIZED, `You are not loggin, login to get access!`))
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        // da handle loi, invalid token khi token ko hop le

        const currentUser = await User.findByPk(decoded.userId)

        if (!currentUser) {
            next(new ApiError(StatusCodes.UNAUTHORIZED, 'The user belonging to this token does no longer exist.'))
        }
        
    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error))
    }

    next()
}