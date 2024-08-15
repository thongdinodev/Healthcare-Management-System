const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const {StatusCodes} = require('http-status-codes')

const signToken = (id) => {
    return jwt.sign({userId: id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN * 60 * 60 * 24 * 1000
    })
}

const createSendToken = (user, res, statusCode) => {
    console.log(user.user_id);
    
    const token = signToken(user.user_id)
    const cookieOptions = {
        expires:  new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 24 * 1000
        ),
        httpOnly: true
    }

    res.cookie('jwt', token, cookieOptions)

    // hide password show in json
    delete user.dataValues.password   
    
    res.status(statusCode).json({
        status: 'success',
        token,
        user
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

            createSendToken(newUser, res, StatusCodes.CREATED)
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

                createSendToken(user, res, StatusCodes.OK)

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

    console.log('======protectRoute active======');
    
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
        
        req.user = currentUser

    } catch (error) {
        next(new ApiError(StatusCodes.BAD_REQUEST, error))
    }

    next()
}