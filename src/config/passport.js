const passport = require('passport');
require('./strategies/local.strategy')();

module.exports = function passportConfig(app) {
    //initialize a passport instance
    app.use(passport.initialize());

    //create a new session on that passport instance
    app.use(passport.session());

    //serialize our USER OBJECT for purposes of  
    //persistance and place it on the done function
    //once you've finished serializing it so
    //that it can be placed onto our session
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    //deserialize our USER OBJECT from the session and 
    //return the USER OBJECT that was stored
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    //the strategy is the concept passport uses to
    //authenticate requests. It has three strategies 
    //1. LocalStrategy, 2. OAuth, 3.OpenID
    //we will use LocalStrategy here

}