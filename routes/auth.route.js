const authController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.loginWithEmailAndPassword)
router.post('/logout', authController.logoutAccount)
router.post('/forgotPassword', authController.forgotPassword)
router.patch('/resetPassword/:token', authController.resetPassword)

// implement protec route
router.use(authController.protectRoute)

router.patch('/updateMyPassword', authController.updateMyPassword)

module.exports = router