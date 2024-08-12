const authController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router
    .route('/register')
    .post(authController.register)

router
    .route('/login')
    .post(authController.loginBasic)
    
module.exports = router