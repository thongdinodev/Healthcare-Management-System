const express = require('express')
const OAuth20Controller = require('../controllers/OAuth20.Controller')

const router = express.Router()

router
    .route('/')
    .get(OAuth20Controller.getLoginOAuthPage)


router
    .route('/success')
    .get(OAuth20Controller.getSuccessOAuthPage)

router
    .route('/error')
    .get(OAuth20Controller.getErrorOAuthPage)


// GOOGLE OAUTH
router
    .route('/auth/google')
    .get(OAuth20Controller.getOAuthGoogle)

   
router
    .route('/auth/google/callback')
    .get(OAuth20Controller.getOAuthGoogleCallback)

// GITHUB OAUTH
router
    .route('/auth/github')
    .get(OAuth20Controller.getOAuthGithub)

   
router
    .route('/auth/github/callback')
    .get(OAuth20Controller.getOAuthGithubCallback)

module.exports = router