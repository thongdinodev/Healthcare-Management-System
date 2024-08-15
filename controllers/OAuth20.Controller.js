const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy


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

// PASSPORT FOR GOOGLE

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

        profile.email = profile.emails[0].value
        
        userProfile = profile;
        return done(null, userProfile);
        }
))

// PASSPORT FOR GITHUB
const getOAuthGithub = passport.authenticate('github', { scope : ['user: email'] })

const getOAuthGithubCallback = passport.authenticate('github', { 
    failureRedirect: '/error',
    successRedirect: '/success'
})

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },

    function(accessToken, refreshToken, profile, done) {
        
        if (!profile.displayName) profile.displayName = profile.username
        if (!profile.email) profile.email = profile.profileUrl
        
        userProfile = profile;
        return done(null, userProfile);
        }
))
module.exports = {
    getLoginOAuthPage,
    getErrorOAuthPage,
    getSuccessOAuthPage,
    getOAuthGoogle,
    getOAuthGoogleCallback,
    getOAuthGithub,
    getOAuthGithubCallback
}