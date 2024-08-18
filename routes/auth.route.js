const authController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router
    .route('/register')
    .post(authController.register)

router
    .route('/login')
    .post(authController.loginWithEmailAndPassword)
 
router
    .route('/logout')
    .post(authController.logoutAccount)
    
module.exports = router