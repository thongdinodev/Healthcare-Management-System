const authController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router
    .route('/signup')
    .post(authController.signup)

router
    .route('/login')
    .post(authController.loginBasic)
    
module.exports = router