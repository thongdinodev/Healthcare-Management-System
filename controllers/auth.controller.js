const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { StatusCodes } = require('http-status-codes')
const { Op } = require('sequelize')

const User = require('../models/user.model')

const { registerValidate, resetPasswordValidate} = require('../utils/validation')
const ApiError = require('../utils/ApiError')
const SendEmail = require('../utils/EmailService')

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
        console.log(error.errors[0].message);
        next (new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.errors[0].message))
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
        next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.errors[0].message))

    }
}

exports.logoutAccount = (req, res, next) => {
    res.clearCookie('jwt');
    res.status(200).json({ 
        status: 'success',
        message: 'Logout success'
    });
}

exports.protectRoute = async (req, res, next) => {

    console.log('======protectRoute active======');
    
    let token
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
        
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt

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

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({email: req.body.email})

    if (!user) {
        next (new ApiError(StatusCodes.NOT_FOUND, `Can't find any user with email, try again!`))
    }

    const resetToken = user.createResetToken()
    await user.save()

    const resetURL = `${req.protocol}://${req.get('host')}/auth/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forget password, please ignore this email!`;
    
    try {

        await SendEmail({
            email: user.email,
            subject: 'Your password reset token in 30 minutes',
            message
        })

        res.status(200).json({
            status: 'success',
            msg: 'reset password token was sent to your email, pls check your mail box'
        })
        
    } catch (error) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        console.log(error);
        
        next(new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.resetPassword = async (req, res, next) => {
    const hashedToken =  crypto
                            .createHash('sha256')
                            .update(req.params.token)
                            .digest('hex')
                        
    try {
        const user = await User.findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    [Op.gt]: Date.now()
                }
            }
        })        

        if (!user) {
            next (new ApiError(StatusCodes.BAD_REQUEST, 'Token is invalid or has expired'))
        }

        console.log(req.body);
        
        const {error, value} = resetPasswordValidate(req.body)
        console.log('====ERROR====', error);
        if (error) {
            next (new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
        } else {
            user.password = req.body.newPassword
            user.passwordResetToken = null
            user.passwordResetExpires = null
    
            await user.save()        
    
            createSendToken(user, res, StatusCodes.CREATED)
        }


    } catch (error) {
        console.log(error);
        next(new ApiError(StatusCodes.BAD_REQUEST, error))
    }    
}