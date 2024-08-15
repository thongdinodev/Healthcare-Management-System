const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

let userProfile

// request OAuth 20
const getLoginOAuthPage = (req, res, next) => {
    res.render('pages/auth')
}

const getSuccessOAuthPage = (req, res, next) => {
    res.render('pages/success', {
        user: userProfile
    })
}

const getErrorOAuthPage = (req, res, next) => {
    res.json({
        msg: 'Error when use oauth 20'
    })
}


// PASSPORT SESSION
const getOAuthGoogle = passport.authenticate('google', { scope : ['profile', 'email'] })

const getOAuthGoogleCallback = passport.authenticate('google', { 
        failureRedirect: '/error',
        successRedirect: '/success'
})

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },

    function(accessToken, refreshToken, profile, done) {
        
        userProfile = profile;
        return done(null, userProfile);
        }
))

module.exports = {
    getLoginOAuthPage,
    getErrorOAuthPage,
    getSuccessOAuthPage,
    getOAuthGoogle,
    getOAuthGoogleCallback
}