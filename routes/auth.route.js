const authController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.loginWithEmailAndPassword)
router.post('/logout', authController.logoutAccount)
router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

// implement protec route
router.use(authController.protectRoute)

router.patch('/update-password', authController.updateMyPassword)

module.exports = router