
  //  RedisStore = require('connect-redis')(session),
var GoogleStrategy = require('passport-google-oauth2').Strategy; //Google
var logger =require('morgan');
//app.use(require('morgan')('combined'));
var GoogleUser = require('../models/GoogleUser');

var GOOGLE_CLIENT_ID = "Enter Your Google ID",
    GOOGLE_CLIENT_SECRET = "Enter Your Secret Key";

module.exports = function (passport) {
passport.use(require('morgan')('combined'));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (obj, done) {
        GoogleUser.findById(id, function(err, user){
            done(err, user);
        });
    });


    passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:1993/auth/google/callback",
            passReqToCallback: true
        },
        function (request, accessToken, refreshToken, profile, done) {
            // asynchronous verification, for effect...
            process.nextTick(function () {

                GoogleUser.findOne({
                    'id': profile.id
                }, function (err, user) {
                    console.log(profile);
                    console.log(user);
                    if (err)
                        return done(err);
                    if (user)
                        return done(null, user);
                    else {

                        var newUser = new GoogleUser();
                        newUser.id = profile.id;
                        newUser.name = profile.displayName;
                        newUser.email = profile.emails[0].value;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        })

                    }
                });
                return done(null, profile);
            });
        }
    ));


}
    
