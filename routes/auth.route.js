const authController = require('../controllers/auth.controller')
const express = require('express')
const router = express.Router()

router
    .route('/')
    .post(authController.signup)


module.exports = router