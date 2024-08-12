const User = require('../models/user.model')
const handleTryCatchError = require('../utils/handleTryCatchError')
const bcrypt = require('bcrypt')

const {signupValidate} = require('../utils/validation')

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
            const newUser = await User.create(inputSignupData, {
                attri
            })
    
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

    try {
        if (!email || !password) {
            handleTryCatchError(res, 404, `Incorrect email or password, pls try again!`)
        } else {
            await User.findOne({where: {email: email}}).then(async function (user) {
                
                
                if (!user) {
                    handleTryCatchError(res, 400, `Can't find any user with email!`)
                } else if (user.validPassword(password)) {
                    console.log(user.validPassword(password))
                    console.log('login success');
                    res.status(201).json({
                        status: 'success',
                        msg: 'Login success'
                    })
                } else {
                    console.log('wrong pass');
                    handleTryCatchError(res, 400, `Wrong password`)
                }
            })

            


            //bcrypt.compareSync(myPlaintextPassword, hash); // true

        }
        
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}